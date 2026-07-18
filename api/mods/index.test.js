const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { test } = require("node:test");
const { NodeCache } = require("@cacheable/node-cache");
const modsHandler = require("./index");

function createCache() {
  return new NodeCache({
    stdTTL: 3600,
    checkperiod: 0,
    maxKeys: 256,
    useClones: true,
  });
}

function createRequestStub(responder) {
  let callCount = 0;

  const request = (options, callback) => {
    callCount += 1;
    const outgoingRequest = new EventEmitter();

    outgoingRequest.end = () => {
      const response =
        typeof responder === "function"
          ? responder(options, callCount)
          : responder;

      process.nextTick(() => {
        if (response.error) {
          outgoingRequest.emit("error", response.error);
          return;
        }

        const upstreamResponse = new EventEmitter();
        upstreamResponse.statusCode = response.status;
        callback(upstreamResponse);
        upstreamResponse.emit("data", Buffer.from(response.body));
        upstreamResponse.emit("end");
      });
    };

    return outgoingRequest;
  };

  request.getCallCount = () => callCount;
  return request;
}

function invoke(handler, bindingData) {
  return new Promise((resolve) => {
    const logs = [];
    const log = (...values) => logs.push(["info", ...values]);
    log.error = (...values) => logs.push(["error", ...values]);
    log.warn = (...values) => logs.push(["warn", ...values]);

    const context = {
      bindingData,
      log,
      done: () => resolve({ response: context.res, logs }),
    };

    handler(context, {});
  });
}

test("caches a successful response for one hour", async () => {
  const cache = createCache();
  const request = createRequestStub({
    status: 200,
    body: JSON.stringify({ name: "A mod" }),
  });
  const handler = modsHandler.createHandler({ cache, request });

  const first = await invoke(handler, { domainName: "Witcher3", id: 1738 });
  const second = await invoke(handler, { domainName: "witcher3", id: 1738 });

  assert.equal(request.getCallCount(), 1);
  assert.equal(first.response.headers["X-Cache"], "MISS");
  assert.equal(second.response.headers["X-Cache"], "HIT");
  assert.deepEqual(second.response.body, { name: "A mod" });

  const remainingTtl = cache.getTtl("witcher3:1738") - Date.now();
  assert.ok(remainingTtl > 3_595_000 && remainingTtl <= 3_600_000);
});

test("keeps cache entries isolated by domain and mod id", async () => {
  const cache = createCache();
  const request = createRequestStub((options) => ({
    status: 200,
    body: JSON.stringify({ path: options.path }),
  }));
  const handler = modsHandler.createHandler({ cache, request });

  await invoke(handler, { domainName: "witcher3", id: 1738 });
  await invoke(handler, { domainName: "witcher3", id: 1643 });
  const cached = await invoke(handler, { domainName: "witcher3", id: 1738 });

  assert.equal(request.getCallCount(), 2);
  assert.equal(cached.response.headers["X-Cache"], "HIT");
  assert.equal(cached.response.body.path, "/v1/games/witcher3/mods/1738");
});

test("does not cache non-200 responses", async () => {
  const cache = createCache();
  const request = createRequestStub({
    status: 404,
    body: JSON.stringify({ message: "Not found" }),
  });
  const handler = modsHandler.createHandler({ cache, request });

  const first = await invoke(handler, { domainName: "witcher3", id: 9999 });
  const second = await invoke(handler, { domainName: "witcher3", id: 9999 });

  assert.equal(request.getCallCount(), 2);
  assert.equal(first.response.status, 404);
  assert.equal(second.response.headers["X-Cache"], "MISS");
  assert.equal(cache.get("witcher3:9999"), undefined);
});

test("does not cache malformed upstream responses", async () => {
  const cache = createCache();
  const request = createRequestStub({ status: 200, body: "not json" });
  const handler = modsHandler.createHandler({ cache, request });

  const first = await invoke(handler, { domainName: "witcher3", id: 1738 });
  const second = await invoke(handler, { domainName: "witcher3", id: 1738 });

  assert.equal(request.getCallCount(), 2);
  assert.equal(first.response.status, 502);
  assert.equal(second.response.headers["X-Cache"], "MISS");
  assert.equal(cache.get("witcher3:1738"), undefined);
});

test("does not cache network errors", async () => {
  const cache = createCache();
  const request = createRequestStub({ error: new Error("network failed") });
  const handler = modsHandler.createHandler({ cache, request });

  const first = await invoke(handler, { domainName: "witcher3", id: 1738 });
  const second = await invoke(handler, { domainName: "witcher3", id: 1738 });

  assert.equal(request.getCallCount(), 2);
  assert.equal(first.response.status, 502);
  assert.equal(second.response.headers["X-Cache"], "MISS");
  assert.equal(cache.get("witcher3:1738"), undefined);
});

test("rejects missing or invalid route values without calling Nexus", async () => {
  const request = createRequestStub({ status: 200, body: "{}" });
  const handler = modsHandler.createHandler({ cache: createCache(), request });

  const missingId = await invoke(handler, { domainName: "witcher3" });
  const invalidId = await invoke(handler, { domainName: "witcher3", id: 0 });
  const missingDomain = await invoke(handler, { id: 1738 });

  assert.equal(request.getCallCount(), 0);
  assert.equal(missingId.response.status, 400);
  assert.equal(invalidId.response.status, 400);
  assert.equal(missingDomain.response.status, 400);
});

test("returns successful responses when a bounded cache rejects a write", async () => {
  const cache = {
    get: () => undefined,
    set: () => {
      throw new Error("cache is full");
    },
  };
  const request = createRequestStub({
    status: 200,
    body: JSON.stringify({ name: "A mod" }),
  });
  const handler = modsHandler.createHandler({ cache, request });

  const result = await invoke(handler, { domainName: "witcher3", id: 1738 });

  assert.equal(result.response.status, 200);
  assert.equal(result.response.headers["X-Cache"], "MISS");
  assert.deepEqual(result.response.body, { name: "A mod" });
  assert.ok(result.logs.some(([level]) => level === "warn"));
});

const https = require("https");
const { NodeCache } = require("@cacheable/node-cache");

const CACHE_TTL_SECONDS = 60 * 60;
const modCache = new NodeCache({
  stdTTL: CACHE_TTL_SECONDS,
  checkperiod: 120,
  maxKeys: 256,
  useClones: true,
});

function createResponse(status, body, cacheStatus) {
  return {
    status,
    body,
    headers: {
      "Content-Type": "application/json",
      "X-Cache": cacheStatus,
    },
  };
}

function createHandler({ cache = modCache, request = https.request } = {}) {
  return function handler(context, req) {
    const domainName = context.bindingData?.domainName
      ?.toString()
      .trim()
      .toLowerCase();
    const modId = Number(context.bindingData?.id);
    let completed = false;

    const complete = (status, body, cacheStatus = "MISS") => {
      if (completed) {
        return;
      }

      completed = true;
      context.res = createResponse(status, body, cacheStatus);
      context.done();
    };

    if (!domainName || !Number.isInteger(modId) || modId <= 0) {
      complete(400, {
        error: "domainName and a positive integer id are required",
      });
      return;
    }

    const cacheKey = `${domainName}:${modId}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse !== undefined) {
      context.log(`Cache hit: ${cacheKey}`);
      complete(cachedResponse.status, cachedResponse.body, "HIT");
      return;
    }

    context.log(`Cache miss: ${cacheKey}`);

    const options = {
      host: "api.nexusmods.com",
      path: `/v1/games/${encodeURIComponent(domainName)}/mods/${modId}`,
      headers: { apiKey: process.env.NEXUS_API_KEY },
      method: "GET",
    };

    try {
      const upstreamRequest = request(options, (upstreamResponse) => {
        let responseBody = "";

        context.log(`statusCode: ${upstreamResponse.statusCode}`);

        upstreamResponse.on("data", (chunk) => {
          responseBody += chunk;
        });

        upstreamResponse.on("end", () => {
          let parsedBody;

          try {
            parsedBody = JSON.parse(responseBody);
          } catch (error) {
            context.log.error(error);
            complete(502, {
              error: "Nexus Mods API returned invalid JSON",
            });
            return;
          }

          const status = upstreamResponse.statusCode ?? 502;

          if (status === 200) {
            try {
              cache.set(cacheKey, { status, body: parsedBody });
            } catch (error) {
              context.log.warn(`Unable to cache ${cacheKey}: ${error.message}`);
            }
          }

          complete(status, parsedBody);
        });
      });

      upstreamRequest.on("error", (error) => {
        context.log.error(error);
        complete(502, { error: "Unable to reach Nexus Mods API" });
      });

      upstreamRequest.end();
    } catch (error) {
      context.log.error(error);
      complete(502, { error: "Unable to reach Nexus Mods API" });
    }
  };
}

const handler = createHandler();
handler.createHandler = createHandler;

module.exports = handler;

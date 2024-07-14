// module.exports = async function (context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');

//     const name = (req.query.name || (req.body && req.body.name));
//     const responseMessage = name
//         ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//         : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: responseMessage
//     };
// }

module.exports = function (context, req) {
  var https = require("https");

  var domainName = context.bindingData.domainName;
  var modId = context.bindingData.id;
  var options = {
    host: "api.nexusmods.com",
    path: `/v1/games/${domainName}/mods/${modId}`,
    //headers: { apiKey: process.env.NEXUS_API_KEY },
    headers: { apiKey: "cUJtMTFqeHRINEw2cWNwVHk0aWJrTUJvL3p1TzZZN0hkdkttYnJoeEgwZz0tLTlXamVpM3ZTcEdXWU4yZ1VGa0g0Snc9PQ==--99485e65241a65fb4b8eceb8bfaa51b9633b3fe7" },
    method: "GET",
  };

  var response = "";
  const request = https.request(options, (res) => {
    context.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d) => {
      response += d;
    });

    res.on("end", (d) => {
      context.res = {
        status: res.statusCode,
        body: JSON.parse(response),
        headers: { "Content-Type": "application/json" },
      };
      context.done();
    });
  });

  request.on("error", (error) => {
    context.log.error(error);
    context.done();
  });

  request.end();
};

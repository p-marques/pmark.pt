module.exports = function (context, req) {
    var https = require('https');

    var domainName = context.bindingData.domainName;
    var modId = context.bindingData.id;
    var options = {
        host: 'api.nexusmods.com',
        path: `/v1/games/${domainName}/mods/${modId}`,
        headers: { 'apiKey': process.env.NEXUS_API_KEY },
        method: 'GET'
    }

    var response = '';
    const request = https.request(options, (res) => {
        context.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
            response += d;
        })

        res.on('end', (d) => {
            context.res = {
                status: res.statusCode,
                body: JSON.parse(response),
                headers: {'Content-Type': 'application/json'}
            }
            context.done();
        })
    })

    request.on('error', (error) => {
        context.log.error(error)
        context.done();
    })

    request.end();
}
module.exports = async function (context, req) {
    const currentStatus = process.env.PERSONAL_STATUS_MESSAGE;

    context.res = {
        status: 200,
        body: currentStatus
    };
}
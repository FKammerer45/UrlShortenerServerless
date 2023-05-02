const urls = require('../ShortenUrl/index').urls;

module.exports = async function (context, req) {
    const { id } = context.bindingData;

    if (urls.has(id)) {
        context.res = {
            status: 302,
            headers: {
                'Location': urls.get(id)
            },
            body: ''
        };
    } else {
        context.res = {
            status: 404,
            body: 'Short URL not found'
        };
    }
};

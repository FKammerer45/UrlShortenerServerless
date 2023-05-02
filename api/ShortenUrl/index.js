const { nanoid } = require('nanoid');

const urls = new Map();

module.exports = async function (context, req) {
    const { url } = req.body;
    const id = nanoid(7);
    urls.set(id, url);

    context.res = {
        status: 200,
        body: {
            id,
            shortUrl: `${req.headers["x-ms-client-principal-name"]}/${id}`
        }
    };
};

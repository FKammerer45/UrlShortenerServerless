const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

module.exports = async function (context, req) {
    if (req.body && req.body.longUrl) {
        const longUrl = req.body.longUrl;
        const shortId = uuidv4().substring(0, 7);
        const shortUrl = `${req.headers["x-ms-client-principal-name"]}/${shortId}`;

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(shortId);

        await blockBlobClient.upload(longUrl, Buffer.byteLength(longUrl));

        context.res = {
            status: 200,
            body: {
                shortUrl
            }
        };
    } else {
        context.res = {
            status: 400,
            body: {
                error: "Please pass a longUrl in the request body"
            }
        };
    }
};

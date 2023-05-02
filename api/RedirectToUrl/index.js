const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
//test trigger redeploy 1
module.exports = async function (context, req) {
    const shortId = context.bindingData.shortId;

    if (shortId) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(shortId);

        try {
            const response = await blockBlobClient.download(0);
            const longUrl = response.readableStreamBody.read(response.contentLength).toString();

            context.res = {
                status: 302,
                headers: {
                    "Location": longUrl
                }
            };
        } catch (error) {
            context.res = {
                status: 404,
                body: {
                    error: "Short URL not found"
                }
            };
        }
    } else {
        context.res = {
            status: 400,
            body: {
                error: "Please pass a shortId in the request URL"
            }
        };
    }
};

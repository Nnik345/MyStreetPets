const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const generateFileName = (originalName) => {
  const uniqueId = uuidv4();
  const extension = originalName.split('.').pop();
  return `${uniqueId}.${extension}`;
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    // Read bucket and region from environment variables
    const S3_BUCKET = process.env.S3_BUCKET;
    const REGION = process.env.REGION;

    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    // Extract file information from the event
    const file = Buffer.from(body.fileBody, 'base64'); // File content passed in base64 format
    const originalName = body.fileName; // File name passed in the event

    const fileName = generateFileName(originalName);

    console.log(`Generated file name: ${fileName}`);

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: file,
    };

    await s3.putObject(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileName: fileName,
      }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "File upload failed",
        error: error.message,
      }),
    };
  }
};

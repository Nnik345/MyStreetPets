const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "ap-south-1" });  // Change region if needed

exports.handler = async (event) => {
    const input = {
        endpointId: "arn:aws:sagemaker:ap-south-1:024848451206:endpoint/my-street-pets",
        body: JSON.stringify({
            prompt: "Hello, how are you?"
        })
    };

    try {
        const command = new InvokeModelCommand(input);
        const response = await client.send(command);

        const responseBody = JSON.parse(Buffer.from(response.body).toString());
        console.log("Response:", responseBody);
        
        return {
            statusCode: 200,
            body: JSON.stringify(responseBody)
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

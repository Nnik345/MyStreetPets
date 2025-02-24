import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockClient({ region: "us-east-1" });
const bedrockRuntime = new BedrockRuntimeClient({ region: "us-east-1" });

export const lambdaHandler = async (event) => {
  try {
    // Retrieve information about available models
    const foundationModels = await bedrock.send(new ListFoundationModelsCommand({}));
    const matchingModel = foundationModels.modelSummaries.find(model => model.modelName === "Jurassic-2 Ultra");

    if (!matchingModel) {
      throw new Error("Model not found");
    }

    const { question } = JSON.parse(event.body).input;

    // The payload to be provided to Bedrock
    const body = JSON.stringify({
      prompt: question,
      maxTokens: 200,
      temperature: 0.7,
      topP: 1,
    });

    // Invoke the model
    const response = await bedrockRuntime.send(
      new InvokeModelCommand({
        body,
        modelId: matchingModel.modelId,
        accept: "application/json",
        contentType: "application/json",
      })
    );

    const responseBody = JSON.parse(Buffer.from(response.body).toString());
    const answer = responseBody.completions[0]?.data?.text || "No answer provided";

    return {
      statusCode: 200,
      body: JSON.stringify({ Answer: answer }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

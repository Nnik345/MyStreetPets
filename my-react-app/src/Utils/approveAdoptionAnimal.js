export const approveAdoptionAnimal = async (animal) => {
  const API_GATEWAY_URL =
    "https://6l4spdgvi3.execute-api.ap-south-1.amazonaws.com/default/updateAdoptionAnimal"; // Replace with your actual API Gateway URL

  try {
    const response = await fetch(API_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animal }),
    });

    if (!response.ok) throw new Error("Failed to approve animal");

    return await response.json();
  } catch (error) {
    console.error("Error approving animal:", error);
    return { error: error.message };
  }
};

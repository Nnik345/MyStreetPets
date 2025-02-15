export const deleteStreetAnimal = async (imageUrl, mongoId) => {
    const API_GATEWAY_URL =
      "https://6l4spdgvi3.execute-api.ap-south-1.amazonaws.com/default/deleteStreetAnimal"; // Replace with your actual API Gateway URL
  
    try {
      const response = await fetch(API_GATEWAY_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, mongoId }),
      });
  
      if (!response.ok) throw new Error("Failed to delete animal");
  
      return await response.json();
    } catch (error) {
      console.error("Error deleting animal:", error);
      return { error: error.message };
    }
  };
  
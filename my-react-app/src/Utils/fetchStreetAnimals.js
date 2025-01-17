export const fetchAnimals = async () => {
  try {
    const response = await fetch("https://zq7qa65k1j.execute-api.ap-south-1.amazonaws.com/default/fetchStreetAnimals");
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return [];
  }
};

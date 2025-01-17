export const fetchAnimals = async () => {
  try {
    const response = await fetch("https://k34176tah4.execute-api.ap-south-1.amazonaws.com/default/fetchAdoptionAnimals");
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return [];
  }
};

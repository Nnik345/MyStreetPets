export const fetchDogs = async () => {
  try {
    const response = await fetch("https://mystreetpets.onrender.com/api/adoption-dogs");
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return [];
  }
};

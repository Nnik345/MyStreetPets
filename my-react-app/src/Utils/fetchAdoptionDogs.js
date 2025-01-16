export const fetchDogs = async () => {
    try {
      const response = await fetch("./Data/adoptionDogs.json");
      if (!response.ok) throw new Error("Failed to fetch data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching dogs:", error);
      return [];
    }
  };
  
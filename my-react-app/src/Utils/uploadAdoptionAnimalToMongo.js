export const uploadAdoptionAnimalMongo = async (animalData) => {
  try {
    const response = await fetch('https://jmkce2ob92.execute-api.ap-south-1.amazonaws.com/default/updateAdoptionAnimals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animalData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Animal data successfully uploaded to MongoDB:', result);
      return result; // Return the response from the server if needed
    } else {
      const errorMessage = await response.text();
      throw new Error(`Failed to upload animal data: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error uploading animal data to MongoDB:', error);
    throw error; // Re-throw the error for further handling
  }
};

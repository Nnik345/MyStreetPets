export const uploadAdoptionAnimal = async (file) => {
    const fileReader = new FileReader();
  
    return new Promise((resolve, reject) => {
      fileReader.onloadend = async () => {
        const fileBody = fileReader.result.split(',')[1]; // Remove the data URL prefix
        const fileName = file.name;
  
        const requestBody = {
          fileBody: fileBody,
          fileName: fileName,
        };
  
        try {
          const response = await fetch('https://6l4spdgvi3.execute-api.ap-south-1.amazonaws.com/default/uploadAdoptionImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
  
          if (response.ok) {
            const responseData = await response.json();
            if (responseData.fileName) {
              const responseUrl = `https://my-street-pets.s3.ap-south-1.amazonaws.com/Adoption+Animals/${responseData.fileName}`;
              resolve(responseUrl);
            } else {
              reject("File uploaded, but response did not contain a fileName");
            }
          } else {
            reject("Failed to upload file");
          }
        } catch (error) {
          reject("An error occurred while uploading the file");
        }
      };
  
      fileReader.readAsDataURL(file); // Read the file as a base64-encoded string
    });
  };
  
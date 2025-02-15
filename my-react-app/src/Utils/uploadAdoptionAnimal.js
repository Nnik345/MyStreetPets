export const uploadAdoptionAnimal = async (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      img.src = event.target.result;
    };

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const base64Data = canvas.toDataURL("image/jpeg").split(",")[1]; // Extract only the image data

      const requestBody = {
        fileBody: base64Data,
        fileName: file.name,
      };

      try {
        const response = await fetch("https://6l4spdgvi3.execute-api.ap-south-1.amazonaws.com/default/uploadAdoptionImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
};

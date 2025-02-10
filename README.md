# MyStreetPets

## Project Description
MyStreetPets is a platform designed to help street animals find caretakers and assist users in listing their animals for adoption. The website provides a way to view and track animals living on the street, allowing volunteers and animal lovers to provide necessary care. It also serves as a hub for pet adoption, enabling users to find new homes for animals in need.

## Features
- **View Street Animals**: Search for animals living on the street by location, species, and search radius.
  - Displays details such as name, gender, address, vaccination and neuter status, and caretaker information.
- **View Animals Up for Adoption**: Browse adoptable animals filtered by country, state, city, and species.
  - Includes details such as name, age, gender, location, about section, vaccination and neuter status, and contact information.
- **Admin Functionality**: Authorized admins can add new animals to both the street animals and adoption sections.

## Tech Stack
- **Frontend**: React & Bootstrap (hosted on AWS Amplify)
- **Backend**: AWS Lambda (Node.js)
- **Database**: MongoDB Atlas
- **Storage**: Amazon S3 for image hosting
- **Authentication**: Amazon Cognito

## Setup Instructions
1. Set up AWS backend services including API endpoints and MongoDB Atlas storage.
   - Ensure CORS is enabled for API requests.
2. Navigate into the React application directory:
   ```sh
   cd my-react-app
   ```
3. Install dependencies:
   ```sh
   npm install  
   # or
   yarn install
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## API Details
- The API is **not public** and has **CORS enabled**.

## Contributing
Open to feature suggestions and improvements. Contribution guidelines will be provided when the project is open-sourced.

## License
Currently private, with plans to open-source in the future.

## Cloud Architecture Diagram
Below is the AWS architecture for MyStreetPets:

![AWS Architecture Diagram](link-to-diagram)

---
*The above diagram visually represents the AWS infrastructure used in the project.*


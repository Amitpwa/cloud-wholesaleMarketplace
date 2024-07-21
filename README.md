# Cloud Wholesale Marketplace

This repository contains the codebase for the Cloud Wholesale Marketplace, an innovative platform designed to connect wholesalers with buyers. The marketplace enables wholesalers to list their products, manage orders, and interact with customers seamlessly. Buyers can browse through a variety of products, place orders, and track their purchases with ease. The platform leverages modern web technologies to ensure a responsive and efficient user experience.

## Project URL
[Whole seller Market Place](www.tridyota.com)

## Technologies Used

### Backend
- **Node.js**: Handles the business logic, authentication, and communication with the frontend and database.

### Frontend
- **React.js**: Provides a dynamic and responsive user interface for interacting with the marketplace.

### Storage
- **Image Kit**: Used for storing and managing product images and documents.
- **Cloudinary**: Utilized for storing static images.

### Data Storage
- **AWS S3**: Used for storing various types of data securely.

### Data Visualization
- **Chart.js**: Integrated for visualizing data and presenting insights on user interactions and other metrics.

### Compute
- **AWS EC2 T3 Micro**: The platform is hosted on this instance, ensuring reliable compute resources.

### Database
- **MongoDB**: Serves as the primary database for storing application data.

### Analytics
- **MS Clarity**: Used for analyzing user behavior to improve the user experience.

## Architecture Overview

### User Interaction
1. **Users** interact with the **React.js Frontend** to browse products, place orders, and track purchases.

### Backend Communication
2. The **React.js Frontend** communicates with the **Node.js Backend** to handle user requests and application logic.

### Data Storage
3. The **Node.js Backend** determines where to store data and utilizes **AWS S3** for general data storage.
4. Product images and documents are stored using **Image Kit**, while static images are managed with **Cloudinary**.

### Database
5. The **Node.js Backend** interacts with **MongoDB** to perform CRUD operations on the database.

### Compute Resources
6. The entire platform is hosted on an **AWS EC2 T3 Micro** instance, providing scalable compute resources.

### Data Visualization and Analytics
7. Data visualization is handled by **Chart.js**, which is used to present user interaction data and other insights.
8. User behavior is analyzed using **MS Clarity** to continually improve the platform's user experience.

## Diagram
<img width="2846" alt="Tridyota | Wholeselling marketplace architecture diagram" src="https://github.com/user-attachments/assets/ff8d84c0-2934-4414-b7b9-3b925fda2cc7">


## Getting Started
Follow the instructions below to set up and run the project locally.

### Prerequisites
- Node.js
- npm
- MongoDB
- AWS account for S3 and EC2 setup
- Image Kit and Cloudinary accounts

### Installation
1. Clone the repository
   ```sh
   git clone https://github.com/your-repo/cloud-wholesale-marketplace.git
   ```
2. Navigate to the project directory
   ```sh
   cd cloud-wholesale-marketplace
   ```
3. Install backend dependencies
   ```sh
   cd backend
   npm install
   ```
4. Install frontend dependencies
   ```sh
   cd ../frontend
   npm install
   ```

### Running the Application
1. Start the backend server
   ```sh
   cd backend
   npm start
   ```
2. Start the frontend development server
   ```sh
   cd ../frontend
   npm start
   ```

### Deployment
Refer to the AWS documentation to deploy the backend to an EC2 instance and configure S3 for data storage. Follow the Image Kit and Cloudinary documentation for integrating image storage solutions.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License
Distributed under the MIT License. See `LICENSE` for more information.

---

This README provides a comprehensive overview of the Cloud Wholesale Marketplace project, detailing its architecture, technologies used, and instructions for setup and deployment.

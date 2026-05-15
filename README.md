# Agroverse - Agriculture & Rural Development Platform

Agroverse is a MERN (MongoDB, Express, React, Node.js) stack application designed to empower farmers with knowledge, community support, and access to government schemes.

## Features

The platform has three main modules:

1. **Crop Planning and Advisory**
   - Get personalized crop recommendations based on soil type, season, and water availability
   - Receive fertilizer tips tailored to your specific conditions

2. **Farmer Community Forums**
   - Ask questions and share knowledge with fellow farmers
   - Discuss agricultural practices, challenges, and solutions
   - Comment on posts and engage with the farming community

3. **Government Schemes and Subsidies**
   - Browse available government schemes for farmers
   - View eligibility criteria, benefits, and application links
   - Search for schemes by keywords

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator

### Frontend
- React.js with hooks
- React Router Dom
- Context API for state management
- Axios for API requests
- TailwindCSS for styling
- React Icons

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Setting up the Backend
1. Navigate to the backend directory:
   ```
   cd Agroverse/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/agroverse
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Setting up the Frontend
1. Navigate to the frontend directory:
   ```
   cd Agroverse/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Advisory
- `POST /api/advisory` - Create a new advisory
- `GET /api/advisory` - Get all advisories for logged in user
- `GET /api/advisory/:id` - Get advisory by ID
- `DELETE /api/advisory/:id` - Delete advisory

### Forum
- `POST /api/forum` - Create a new forum post
- `GET /api/forum` - Get all forum posts
- `GET /api/forum/:id` - Get forum post by ID
- `POST /api/forum/:id/comments` - Add comment to a forum post
- `DELETE /api/forum/:id` - Delete a forum post
- `DELETE /api/forum/:id/comments/:commentId` - Delete a comment

### Government Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `GET /api/schemes/search` - Search schemes by query
- `POST /api/schemes` - Create a new scheme (admin only)
- `PUT /api/schemes/:id` - Update a scheme (admin only)
- `DELETE /api/schemes/:id` - Delete a scheme (admin only)

## License
MIT

## Acknowledgements
This project was created to provide a comprehensive platform for farmers to access valuable information and resources for improving their agricultural practices and livelihoods.
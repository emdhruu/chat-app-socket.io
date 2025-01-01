# Chat Application

A real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack and Socket.io for seamless communication between users. 🔐

**Note:** This project is still in progress. 🚧

## Features

- Real-time messaging powered by Socket.io ⏳
- User authentication (signup, login, and logout) 🔑
- Private and group chat functionality
- Responsive design for mobile and desktop 📱🖥️
- Message timestamps and typing indicators ⏰

## Tech Stack

- **Frontend:** React.js with TypeScript, CSS/SCSS, DaisyUI (Tailwind CSS component library) 🌱
- **Backend:** Node.js, Express.js 🚀
- **Database:** MongoDB 📃
- **Real-time Communication:** Socket.io 📢
- **State Management:** Zustand
- **Authentication:** JWT, bcrypt for password hashing

## Installation

### Prerequisites ⚙️

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup ⚡

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chat-application.git
   cd chat-application
   ```

2. Install dependencies for the backend:

   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:

   ```bash
   cd ../frontend
   npm install
   ```

4. Create an `.env` file in the `backend` directory with the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SOCKET_PORT=your_socket_server_port
   ```

5. Start the MongoDB server locally or use a cloud database.

6. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

7. Start the frontend server:
   ```bash
   cd ../frontend
   npm start
   ```

### Running the Application 🚀

Visit `http://localhost:3000` in your browser to access the chat application.

## Project Structure 🗂️

### Backend (`/backend`)

- `server.js`: Entry point for the backend server
- `routes/`: API routes 🌐
- `models/`: MongoDB models
- `controllers/`: Business logic 🔧
- `config/`: Configuration files

### Frontend (`/frontend`)

- `src/components/`: React components
- `src/pages/`: Application pages (e.g., Login, Chat)
- `src/store/`: Zustand store for state management 🔄
- `src/styles/`: Styling with DaisyUI and Tailwind CSS
- `src/utils/`: Helper functions
- `src/types/`: TypeScript type definitions

## Acknowledgments 👏

- [Socket.io Documentation](https://socket.io/)
- [MERN Stack Tutorials](https://www.mongodb.com/mern-stack)
- [React.js Documentation](https://reactjs.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

---

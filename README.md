# Full Stack Realtime Chat App

A full-stack chat application built with the MERN stack. It includes JWT-based authentication, real-time messaging with Socket.io, online user presence, profile image uploads, and theme support.

![Demo App](/frontend/public/screenshot-for-readme.png)

## Features

- User signup, login, logout, and authenticated sessions
- JWT authentication stored in HTTP-only cookies
- Real-time one-to-one messaging with Socket.io
- Online user status tracking
- Image upload support with Cloudinary
- Global client state with Zustand
- Responsive UI built with Tailwind CSS and DaisyUI
- Production build that serves the React app from the Express backend

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, DaisyUI, Zustand, Axios, Socket.io Client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io
- Auth and media: JWT, bcryptjs, Cloudinary

## Project Structure

```text
.
|-- backend/        # Express API, Socket.io server, MongoDB models
|-- frontend/       # React/Vite client app
|-- package.json    # Root scripts for build, start, and dev
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database connection string
- Cloudinary account for image uploads

### Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

## Installation

Install dependencies for both apps:

```shell
npm install --prefix backend
npm install --prefix frontend
```

## Development

Start the backend API:

```shell
npm run dev
```

In a second terminal, start the frontend:

```shell
npm run dev --prefix frontend
```

The frontend runs on `http://localhost:5173` and connects to the backend at `http://localhost:5001/api`.

## Production

Build the frontend and install dependencies:

```shell
npm run build
```

Start the production server:

```shell
npm start
```

When `NODE_ENV=production`, Express serves the compiled frontend from `frontend/dist`.

## Available Scripts

Root scripts:

- `npm run build` - install backend/frontend dependencies and build the frontend
- `npm start` - start the backend server
- `npm run dev` - start the backend with nodemon

Frontend scripts:

- `npm run dev --prefix frontend` - start the Vite dev server
- `npm run build --prefix frontend` - build the React app
- `npm run lint --prefix frontend` - run ESLint
- `npm run preview --prefix frontend` - preview the production frontend build

## API Overview

- `POST /api/auth/signup` - create a new account
- `POST /api/auth/login` - log in
- `POST /api/auth/logout` - log out
- `GET /api/auth/check` - check the current authenticated user
- `PUT /api/auth/update-profile` - update profile image
- `GET /api/messages/users` - get users for the sidebar
- `GET /api/messages/:id` - get messages with a user
- `POST /api/messages/send/:id` - send a message

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

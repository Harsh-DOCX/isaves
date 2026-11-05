# iSaves

iSaves is a full-stack credential vault built with React, Express, and MongoDB. It supports account registration and login, encrypted vault entries, profile management, account recovery, and optional Google sign-in.

## Features

- Email/password authentication with JWT sessions in HTTP-only cookies
- Optional Google sign-in
- AES-256-GCM encryption for saved vault passwords
- Password recovery using a recovery question
- Create, view, and delete vault entries
- Profile management and site-image lookup
- Security headers, CORS configuration, and authentication rate limits

## Project structure

```text
iSaves/
├── frontend/       # React application
└── server/         # Express API
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    └── utils/
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas cluster

## Local setup

### 1. Configure the backend

Create `server/.env` with:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/isaves
JWT_SECRET=replace_with_a_long_random_secret
ENCRYPTION_SECRET=replace_with_a_different_long_random_secret
FRONTEND_ORIGIN=http://localhost:3000
```

If using MongoDB Atlas, replace `MONGODB_URI` with the connection string from your cluster. Make sure your Atlas Network Access settings allow your current IP. URL-encode special characters in the database user's password.

`JWT_SECRET` and `ENCRYPTION_SECRET` must be different, private values. Do not commit `.env` files or share secrets. Google sign-in is optional in development; set `GOOGLE_CLIENT_ID` if you want to use it.

Install backend dependencies and start the API:

```powershell
cd server
npm install
npm run dev
```

The API listens at `http://localhost:8000`. Check its health at `http://localhost:8000/api/health`.

### 2. Configure the frontend

Create `frontend/.env` with:

```env
REACT_APP_API_URL=http://localhost:8000
```

If you are using Google sign-in, also add the matching client ID:

```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Install frontend dependencies and start React in a second terminal:

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:3000`.

## API routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API and database health |
| GET | `/api/site-image?query=...` | Site image suggestions (authentication required) |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/google` | Sign in with Google |
| GET | `/api/auth/me` | Get the current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/logout` | Sign out |
| POST | `/api/auth/forgot-password` | Get the recovery question |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/vault` | List the signed-in user's entries |
| POST | `/api/vault` | Create a vault entry |
| DELETE | `/api/vault/:entryId` | Delete a vault entry |

## Useful commands

Run these from their respective directories:

```powershell
# Backend
npm run dev
npm start

# Frontend
npm start
npm run build
npm test
```

## Security notes

- Keep backend and frontend `.env` files out of version control.
- Use unique, strong secrets for `JWT_SECRET` and `ENCRYPTION_SECRET`.
- Back up `ENCRYPTION_SECRET` securely. Existing vault entries cannot be decrypted without the same secret.
- In production, configure environment variables through your hosting provider, use HTTPS, and set `FRONTEND_ORIGIN` to your deployed frontend URL.
- Restrict MongoDB Atlas Network Access to the addresses that need access.

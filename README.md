# iSaves

iSaves is a full-stack credential vault built with React + Express + MongoDB.

## What it does

- Email/password signup and login
- Google signup/login using Google Identity Services
- HttpOnly cookie-based session authentication
- Encrypted vault storage for saved passwords
- Password generator and show/hide controls
- Create, view, copy, and delete vault entries
- Smart site logo retrieval from entered site name/URL (with typo-tolerant matching + fallback icon)

## Tech stack

- Frontend: React 19, React Router 6, Testing Library
- Backend: Node.js, Express 5, MongoDB (Mongoose)
- Security/auth: JWT, bcrypt, AES-256-GCM encryption, Google ID token verification

## Project structure

- `src/`: React app (pages, auth context, components, tests)
- `server/`: Express API (`auth`, `vault`, `health`)
- `public/`: Static frontend assets

## Required environment variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/isaves
JWT_SECRET=change-this-jwt-secret
ENCRYPTION_SECRET=change-this-encryption-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
FRONTEND_ORIGIN=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:8000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@example.com
PASSWORD_RESET_TTL_MINUTES=10
```

Production note: `MONGODB_URI`, `JWT_SECRET`, `ENCRYPTION_SECRET`, and `GOOGLE_CLIENT_ID` are mandatory and the server will fail fast if they are missing.

## Google auth setup

1. Create OAuth credentials in Google Cloud Console.
2. Add your frontend origin to **Authorized JavaScript origins**.
3. Set `GOOGLE_CLIENT_ID` in backend `.env`.
4. Set `REACT_APP_GOOGLE_CLIENT_ID` in frontend environment.
5. Do not commit Google client secrets to git.

## Available scripts

- `npm start` - start React app at `http://localhost:3000`
- `npm run server` - start Express API at `http://localhost:8000`
- `npm test` - run frontend test suite
- `npm run build` - create production build

## API summary

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/vault`
- `POST /api/vault`
- `DELETE /api/vault/:entryId`
- `GET /api/health`
- `GET /api/site-image?query=<site name or url>` (auth required)

## Site logo detection

When adding a credential (and when viewing vault entries), iSaves now tries to
resolve and render a site logo automatically from the entered `siteName`.

- Accepts either a URL/domain (`https://github.com`, `github.com`) or plain name (`github`)
- Uses typo-tolerant matching for common sites (`gogle` -> `google.com`)
- Returns multiple fallback image URLs so UI can recover if one provider fails
- Falls back to a generated placeholder if no logo is found

## Testing

`src/App.test.js` includes flows for:

- Root public landing render
- Signup and protected vault redirect
- Login, vault create/read/delete, and logout redirect to home

# iSaves

iSaves is a full-stack credential vault built with React + Express + MongoDB.

## What it does

- **Email/password signup and login** with recovery question for account recovery
- **Google signup/login** using Google Identity Services
- **HttpOnly cookie-based session authentication**
- **Encrypted vault storage** for saved passwords (AES-256-GCM encryption)
- **Password generator** and show/hide controls
- **Create, view, copy, and delete vault entries**
- **Smart site logo retrieval** from entered site name/URL
- **Recovery question authentication** for password reset (no email required)
- **Profile management** with recovery question updates

## Features

### Authentication
- ✅ Email/password signup with recovery question setup
- ✅ Email/password login
- ✅ Google OAuth 2.0 integration
- ✅ Session-based authentication with JWT tokens
- ✅ HttpOnly secure cookies
- ✅ Rate limiting on auth endpoints

### Password Management
- ✅ Add passwords with site name, username, notes
- ✅ Encrypt passwords before storage (AES-256-GCM)
- ✅ View/hide passwords in vault
- ✅ Copy password to clipboard
- ✅ Delete credentials
- ✅ Search and filter capabilities

### Account Recovery
- ✅ 5 predefined security questions
- ✅ Answer recovery question to reset password
- ✅ No email service required
- ✅ Update recovery question anytime in profile

### User Profile
- ✅ Update username, mobile number, personal info
- ✅ Update recovery question and answer
- ✅ View account information

### Security
- ✅ Password hashing with bcrypt
- ✅ End-to-end encryption for stored passwords
- ✅ Secure session management
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Helmet.js security headers
- ✅ Google token verification

## Tech Stack

- **Frontend**: React 19, React Router 6, Testing Library
- **Backend**: Node.js, Express 5, MongoDB (Mongoose)
- **Security/Auth**: JWT, bcrypt, AES-256-GCM encryption, Google ID token verification
- **Rate Limiting**: express-rate-limit
- **Security Headers**: helmet.js

## Project Structure

```
isaves/
├── server/                 # Express API
│   ├── index.js           # Main server with all endpoints
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment template
│
└── frontend/              # React application
    ├── src/
    │   ├── App.js        # Main routing
    │   ├── AuthContext.jsx  # Auth state management
    │   ├── components/   # React components
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Recovery.jsx
    │   │   ├── LoggedHome.jsx
    │   │   ├── About.jsx
    │   │   └── ... (other components)
    │   ├── assets/css/   # Styling
    │   └── public/       # Static assets
    ├── package.json      # Frontend dependencies
    └── .env.example      # Environment template
```

## Environment Setup

### Backend (.env)

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/isaves
JWT_SECRET=your_secure_random_secret_64_chars
ENCRYPTION_SECRET=your_secure_random_secret_64_chars
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
FRONTEND_ORIGIN=https://your-frontend-domain.com
PASSWORD_RESET_TTL_MINUTES=10
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## API Endpoints

### Authentication

```
POST   /api/auth/signup           - Register with email, password, recovery Q&A
POST   /api/auth/login            - Login with email and password
POST   /api/auth/google           - Authenticate with Google ID token
POST   /api/auth/logout           - Logout and clear session
GET    /api/auth/me               - Get current user
PUT    /api/auth/profile          - Update profile and recovery info
POST   /api/auth/forgot-password  - Get recovery question by email
POST   /api/auth/reset-password   - Reset password after answering recovery Q
```

### Vault

```
GET    /api/vault                 - Get all user's saved passwords
GET    /api/vault/:id             - Get specific vault entry
POST   /api/vault                 - Add new password to vault
PUT    /api/vault/:id             - Update vault entry
DELETE /api/vault/:id             - Delete vault entry
```

### Utilities

```
GET    /api/site-image            - Get site logo/image
GET    /api/health                - Health check
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 Client ID (Web Application)
3. Add authorized redirect URIs:
   - Local: `http://localhost:3000`
   - Production: `https://your-domain.com`
4. Copy Client ID to both `.env` files
5. Google will prompt users to verify they're using your app

## Quick Start

### Development

```bash
# Backend (in server/ directory)
npm install
npm start

# Frontend (in frontend/ directory)
npm install
npm start
```

### Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for pre-launch checklist.

## Features Explained

### Recovery Question Authentication

Instead of email-based password recovery:
1. During signup, user selects one of 5 security questions
2. User provides an answer to that question
3. Answer is hashed and stored securely
4. When resetting password, user answers the question
5. If answer matches, they can set a new password

This approach eliminates email dependency while maintaining security.

### Encryption

Passwords are encrypted with AES-256-GCM:
- Each password is encrypted with a unique IV (initialization vector)
- Authentication tag ensures data integrity
- Encryption key is derived from `ENCRYPTION_SECRET`
- Only logged-in users can decrypt their passwords

### Session Management

- JWT tokens stored in HttpOnly cookies
- Tokens expire after 12 hours
- CSRF protection via SameSite cookie attribute
- Rate limiting prevents brute force attacks

## Security Considerations

- ✅ Never commit `.env` files to git
- ✅ Use unique, strong secrets in production
- ✅ Enable HTTPS/SSL everywhere
- ✅ Regularly update dependencies
- ✅ Monitor error logs for suspicious activity
- ✅ Backup database regularly
- ✅ Use MongoDB authentication
- ✅ Keep Google OAuth credentials secure

## Testing

### Manual Testing Checklist

1. **Signup**
   - Create account with email/password
   - Select recovery question
   - Provide recovery answer
   - Account created successfully

2. **Login**
   - Login with credentials
   - Redirect to vault
   - Profile displayed

3. **Vault Operations**
   - Add password
   - View password (show/hide)
   - Copy password
   - Delete password

4. **Password Recovery**
   - Request password reset
   - View recovery question
   - Answer question
   - Set new password
   - Login with new password

5. **Profile Updates**
   - Update username
   - Update mobile number
   - Update personal info
   - Update recovery question
   - Changes persist after logout/login

6. **Google Auth**
   - Signup with Google
   - Login with Google
   - Account linked correctly

## Performance

- Frontend: Optimized React build (~100KB gzipped)
- Backend: Efficient MongoDB queries with indexing
- Encryption: Hardware-accelerated AES-256-GCM
- Caching: Browser cache for static assets

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Production Checklist

Before deploying:

- [ ] All environment variables configured
- [ ] MongoDB connection tested
- [ ] Google OAuth credentials set up
- [ ] HTTPS/SSL certificate obtained
- [ ] Frontend built: `npm run build`
- [ ] Backend tested locally
- [ ] All features tested
- [ ] Error logging configured
- [ ] Backups configured

## Troubleshooting

**CORS Error**: Check `FRONTEND_ORIGIN` in server `.env`

**Google OAuth fails**: Verify Client ID and authorized origins in Google Console

**Database connection fails**: Check MongoDB URI and network access

**Encryption error**: Ensure `ENCRYPTION_SECRET` is 64+ characters

## License

ISC

## Support & Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Quick Start Guide](./QUICKSTART.md)


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

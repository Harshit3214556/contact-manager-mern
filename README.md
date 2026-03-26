# MERN Contact Management App

Simple contact manager built with:
- Backend: Node.js + Express
- Frontend: React
- Database: MongoDB (Atlas or local)

## Local setup

### Backend
1. `cd server`
2. `npm install`
3. create `.env` with:
   - `MONGO_URI=<your-mongo-uri>`
   - `PORT=5000` (optional)
4. `npm start`

### Frontend
1. `cd client`
2. `npm install`
3. `npm start`

Open http://localhost:3000 in your browser.

## API test flow

- Server runs a quick API smoke test automatically on startup (non-production only):
  - create contact
  - fetch contacts
  - update contact
  - delete contact
  - confirm deletion

## Deployment

### Backend (Render)
- Connect repo on Render
- Set environment variable `MONGO_URI`
- Set `NODE_ENV=production`

### Frontend (Vercel)
- Connect repo on Vercel
- Default build settings for React are fine
- Set `REACT_APP_API_URL` to your backend URL if needed

## Notes
- No auth, simple CRUD only
- Keep code minimal for learning and quick edits

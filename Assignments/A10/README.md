# Assignment 10 - Blog Application (MERN Stack)

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

### Backend Setup

1. Navigate to the backend folder:
```bash
cd Assignments/A10/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create env/.env file with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_IN=7
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd Assignments/A10/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file with:
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:5173
```

Both frontend and backend will automatically reload when you make changes.

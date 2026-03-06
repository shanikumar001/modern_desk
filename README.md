# Glassmorphism Smart Dashboard

A beautiful, modern dashboard application featuring glassmorphism design with weather, clock, todo, and settings widgets.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Glassmorphism+Dashboard)

## Features

- **Clock Widget** - Real-time clock display
- **Weather Widget** - Current weather information
- **Todo Widget** - Task management
- **Settings Panel** - Customization options
- **Glassmorphism UI** - Modern frosted glass aesthetic
- **Particle Effects** - Animated background particles

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Lucide React Icons
- Recharts

### Backend

- Node.js
- Express
- CORS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Option 1: Run both frontend and backend together (Recommended)

```bash
npm run dev
```

This will start both servers concurrently:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

#### Option 2: Run separately

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will run on `http://localhost:3000`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to view the dashboard.

### Building for Production

**Frontend**

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist`

## Project Structure

```
├── backend/
│   ├── package.json
│   └── server.js          # Express server
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Radix UI components
│   │   │   └── *.tsx      # Widget components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── apiClient.ts   # API client
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── README.md
└── .gitignore
```

## Available Scripts

### Root (Run both)

- `npm run dev` - Start both frontend and backend concurrently
- `npm run install:all` - Install all dependencies

### Backend

- `npm run dev:backend` - Start development server
- `npm run dev` (in backend folder) - Start production server

### Frontend

- `npm run dev:frontend` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Customization

### Theme Configuration

Edit `frontend/tailwind.config.js` to customize colors and styling.

### Adding New Widgets

1. Create a new component in `frontend/src/components/`
2. Add the widget to `App.tsx`
3. Style using Tailwind CSS classes

## Deployment to Render (Separate Frontend & Backend)

### Deploy Backend

1. **Push your code to GitHub**

2. **Create Backend Service**
   - Go to [render.com](https://render.com) → "New +" → "Web Service"
   - Select your repository
   - Configure:
     - **Name**: `modern-desk`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `NODE_ENV` = `production`
     - `PORT` = `10000`
   - Click "Create Web Service"

3. **Copy your backend URL**: `https://modern-desk.onrender.com`

### Deploy Frontend

1. **Create Frontend Service**
   - Go to render.com → "New +" → "Static Site"
   - Select your repository
   - Configure:
     - **Name**: `modern-homescreen`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish directory**: `dist`
   - Add Environment Variable:
     - `VITE_API_URL` = `https://modern-desk.onrender.com/api`
   - Click "Create Static Site"

### Access Your App

- Frontend: `https://modern-homescreen.onrender.com`
- Backend API: `https://modern-desk.onrender.com/api`

### Environment Variables

**Backend:**

- `NODE_ENV`: `production`
- `PORT`: `10000`

**Frontend:**

- `VITE_API_URL`: `https://modern-desk.onrender.com/api`

## License

MIT License

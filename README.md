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

## Deployment to Render (Deploy Together)

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up
   - Connect your GitHub account

3. **Deploy**
   - Click "New +" → "Web Service"
   - Select your repository
   - Configure:
     - Name: `glassmorphism-dashboard`
     - Root Directory: (leave empty or set to root)
     - Build Command: `npm install && cd frontend && npm install && npm run build`
     - Start Command: `cd backend && npm start`
   - Add Environment Variable:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (or let Render assign)
   - Click "Create Web Service"

4. **Access your app**
   - Once deployed, your app will be available at `https://glassmorphism-dashboard.onrender.com`
   - The frontend and backend are served together from the same domain

### Option 2: Deploy using render.yaml

1. Push code to GitHub
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will read `render.yaml` and create the service

### Environment Variables

**Required:**

- `NODE_ENV`: `production`
- `PORT`: `10000` (or auto-assigned by Render)

### How It Works

In production mode:

- The Express server serves the built frontend from `frontend/dist`
- All `/api/*` routes are handled by the backend
- All other routes serve the React SPA (Single Page Application)
- No CORS issues since frontend and backend are on the same domain

## License

MIT License

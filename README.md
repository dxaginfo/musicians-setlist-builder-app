# Setlist Builder + Sync

A comprehensive web application for musicians to create, manage, edit, track, and export setlists with real-time collaboration and cross-device synchronization.

## 🎵 Features

### Core Features
- **Setlist Creation and Management**
  - Create, edit, save, and delete setlists
  - Organize songs into sets/blocks
  - Set time limits for entire shows and individual sets
  - Drag-and-drop interface for song reordering

- **Song Library**
  - Create and manage a personal song database
  - Import song details (name, artist, key, tempo, duration)
  - Attach chord sheets, lyrics, or notes to songs
  - Tag songs for easy filtering

- **Real-time Collaboration**
  - Share setlists with band members
  - Collaborative editing with version history
  - Comment functionality for song arrangements
  - User roles and permissions

- **Cross-Device Sync**
  - Cloud-based storage for access across devices
  - Offline mode with sync when connection is restored
  - Progressive web app support for mobile usage

- **Performance Mode**
  - Distraction-free view for live performances
  - Auto-advancing setlist with timer
  - Quick access to notes, chord charts, and lyrics
  - Night mode for low-light environments

- **Integration Capabilities**
  - Spotify integration for song reference
  - Export to PDF/CSV formats
  - Calendar integration for rehearsal/gig dates
  - Optional API for integration with other music tools

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- MongoDB (v4.4 or later)
- Redis (v6.0 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/musicians-setlist-builder-app.git
cd musicians-setlist-builder-app
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment setup
```bash
# In the backend directory
cp .env.example .env
# Edit .env file with your configuration
```

4. Start development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 🧰 Tech Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Material-UI or Chakra UI for components
- React DnD for drag-and-drop functionality
- Styled Components for styling
- PWA support with Workbox

### Backend
- Node.js with Express
- JWT authentication with OAuth 2.0 support
- OpenAPI/Swagger for API documentation
- Socket.io for real-time collaboration

### Database
- MongoDB for primary data storage
- Redis for caching and real-time data
- AWS S3 for file storage (chord sheets, lyrics)

### Infrastructure
- AWS (ECS/Fargate) or Vercel/Netlify for hosting
- GitHub Actions for CI/CD
- Sentry for error tracking
- Google Analytics or Mixpanel for usage analytics

## 📂 Project Structure

```
/
├── backend/                 # Backend server code
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware
│   ├── utils/               # Helper functions
│   ├── config/              # Configuration files
│   └── server.js            # Server entry point
│
├── frontend/                # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── features/        # Feature-based modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service calls
│   │   ├── store/           # Redux store configuration
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx          # Main application component
│   │   └── index.tsx        # Application entry point
│   └── package.json         # Frontend dependencies
│
├── docs/                    # Documentation
├── .github/                 # GitHub configuration
└── docker/                  # Docker configuration
```

## 🤝 Contributing
We welcome contributions! Please check out our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact
If you have any questions or suggestions, please open an issue or contact the team.

## 🙏 Acknowledgements
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [MusicBrainz](https://musicbrainz.org/doc/MusicBrainz_API)
- All the musicians who provided feedback during the development process
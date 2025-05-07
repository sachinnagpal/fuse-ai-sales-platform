# AI-Powered Company Prospecting Tool

A B2B sales intelligence platform that enables sales teams to discover, research, and save high-potential companies using rich filters and AI-powered enrichment.

## Project Structure

```
fuse-ai-sales-platform/
├── backend/           # Node.js/Express backend
├── frontend/         # React frontend
├── database/         # Database schemas and migrations
└── docs/            # Documentation
```

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React with TypeScript
- **Database**: MongoDB
- **AI Integration**: OpenAI API
- **Web Scraping**: Puppeteer

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/company-prospector
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Features

### MVP Features
- [x] Company search with filters
- [x] Paginated results
- [x] Save companies to prospect list
- [x] Basic company information display

### Future Enhancements
- [ ] AI-powered company enrichment
- [ ] Advanced free-text search
- [ ] Company website scraping
- [ ] Enhanced filtering capabilities
- [ ] User authentication
- [ ] Export functionality

## Architecture

The application follows a client-server architecture with the following components:

1. **Frontend**: React application handling UI/UX
2. **Backend**: Express API server
3. **Database**: MongoDB for data persistence
4. **AI Service**: OpenAI integration for company enrichment

## Development Status

Currently implementing MVP features:
- Basic project structure
- Database schema design
- API endpoints
- Frontend components 
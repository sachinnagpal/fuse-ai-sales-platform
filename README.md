# 🚀 AI-Powered Company Prospecting Tool

A B2B sales intelligence platform that enables sales teams to discover, research, and save high-potential companies using rich filters and AI-powered enrichment.

## ✨ Key Features

### Core Features
- 🔍 Advanced company search with multiple filters
- 📊 Real-time data enrichment
- 💾 Save and manage prospect lists
- 🔄 Real-time progress tracking
- 📱 Responsive modern UI
- ⚡ Fast and efficient web scraping
- 🔌 Real-time updates via WebSocket

### Technical Achievements
- 🚀 Implemented efficient queue system for long-running tasks
- 🔒 Built-in rate limiting and security measures
- 📈 Scalable architecture with MongoDB
- 🔄 Real-time progress updates using Socket.IO
- ⚡ Optimized web scraping with Cheerio

## 🛠️ Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React with TypeScript
- **Database**: MongoDB
- **AI Integration**: OpenAI API
- **Web Scraping**: Cheerio (with plans to integrate Puppeteer)
- **Real-time Updates**: Socket.IO
- **Queue Management**: Custom Queue Service

## 🚀 Setup Instructions

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
   FRONTEND_URL=http://localhost:5173
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
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### System Components

1. **Frontend (React + TypeScript)**
   - Modern UI with responsive design
   - Real-time updates using Socket.IO
   - State management with React Query

2. **Backend (Node.js + Express)**
   - RESTful API endpoints
   - WebSocket server for real-time updates
   - Queue service for handling long-running tasks
   - Rate limiting and security middleware

3. **Database (MongoDB)**
   - Flexible schema design
   - Efficient indexing for search operations
   - Scalable document storage

4. **Queue Service**
   - Handles asynchronous tasks
   - Manages web scraping operations
   - Provides real-time progress updates

### Design Choices

1. **Cheerio over Puppeteer**
   - Initially chosen for lightweight web scraping
   - Faster execution time
   - Lower resource consumption
   - Future plan to integrate Puppeteer for more complex scraping

2. **Socket.IO Integration**
   - Real-time updates for queue progress
   - Enhanced user experience
   - Efficient bi-directional communication

3. **Queue System**
   - Handles long-running tasks asynchronously
   - Prevents server overload
   - Provides progress tracking

## 🔄 Roadmap & Future Plans

### Planned Enhancements

1. **Feature Improvements**
   - Advanced filtering capabilities
   - Enhanced company enrichment
   - Export functionality
   - User authentication and authorization
   - Analytics dashboard

2. **Technical Improvements**
   - Implement Puppeteer for advanced web scraping
   - Add Redis for caching
   - Implement comprehensive API documentation
   - Add input validation middleware
   - Implement unit and integration tests

3. **Performance Optimizations**
   - Implement query caching
   - Optimize database queries
   - Add request rate limiting
   - Implement connection pooling

### Current Limitations & Next Steps

1. **UI/UX Enhancements** 🎨
   - Region/Locality dropdown selection
   - Improved company size filtering
   - Enhanced data visualization

2. **Technical Optimizations** ⚡
   - Query and prompt caching implementation
   - API documentation with Swagger
   - Input validation middleware
   - Comprehensive test coverage

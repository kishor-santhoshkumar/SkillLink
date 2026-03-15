# SkillLink Frontend

Modern React frontend for the SkillLink AI Resume Generator.

## Features

- 🤖 AI-powered resume extraction
- 🌍 Multi-language support (English, Tamil, Hindi)
- 📊 Resume quality scoring
- 📥 PDF download
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Fast development with Vite

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/
│   ├── ResumeForm.jsx      # Input form for raw resume text
│   ├── ResumePreview.jsx   # Displays structured resume
│   └── ScoreCard.jsx        # Shows quality score
├── services/
│   └── api.js               # API service layer
├── pages/
│   └── Home.jsx             # Main page
├── App.jsx                  # Root component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Component Documentation

### ResumeForm
- Handles raw resume text input
- Validates input before submission
- Shows loading state during API call
- Displays error messages

### ResumePreview
- Displays structured resume data
- Shows all extracted fields
- Displays quality metrics
- Responsive card layout

### ScoreCard
- Fetches resume quality score
- Shows visual progress bar
- Displays actionable feedback
- Color-coded based on score

### API Service (api.js)
- `createResume(data)` - Submit resume for processing
- `getResumeScore(id)` - Fetch quality score
- `downloadResume(id)` - Download PDF

## Usage Flow

1. User enters resume text in any language
2. Click "Generate Resume"
3. AI extracts and structures data
4. View formatted resume preview
5. Check quality score and feedback
6. Download professional PDF

## Styling

Uses Tailwind CSS with custom configuration:
- Primary color: Blue (#3b82f6)
- Modern card-based layout
- Responsive design
- Smooth transitions
- Clean typography

## API Integration

Backend must be running at `http://127.0.0.1:8000`

Endpoints used:
- `POST /resumes/` - Create resume
- `GET /resumes/{id}/score` - Get score
- `GET /resumes/{id}/download` - Download PDF

## Development

### Hot Module Replacement
Vite provides instant HMR for fast development.

### Proxy Configuration
API requests are proxied through Vite dev server to avoid CORS issues.

## Production Deployment

1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Configure environment variables for production API URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

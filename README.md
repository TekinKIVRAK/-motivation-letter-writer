# Motivation Letter Writer AI

An AI-powered web application that generates professional, personalized motivation letters for job applications using Claude AI.

## Features

- **3 Different Tones**: Generate motivation letters in Professional, Friendly, or Enthusiastic tones
- **Resume Analysis**: Upload your resume (PDF/DOC/DOCX) for personalized content
- **Smart Customization**: AI analyzes job postings and personal notes to create tailored letters
- **Multi-Version Output**: Get 3 different versions to choose from
- **Copy to Clipboard**: Easy one-click copy functionality
- **Customization Tips**: Receive personalized tips to improve your letter

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Anthropic Claude API** - AI text generation
- **Multer** - File upload handling
- **pdf-parse-fork** - PDF parsing
- **mammoth** - Word document parsing

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Anthropic API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd motivation-letter-writer
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
# In backend directory, create .env file
cd backend
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
PORT=3001
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
NODE_ENV=development
```

4. **Start the application**

```bash
# Terminal 1 - Start backend (from backend directory)
npm start

# Terminal 2 - Start frontend (from frontend directory)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173 or http://localhost:5174
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/api/health

## Usage

1. **Upload Resume** (Optional)
   - Drag and drop or browse for your PDF/DOC/DOCX resume
   - Maximum file size: 10MB

2. **Enter Job Information**
   - Company name
   - Position title
   - Full job description/posting

3. **Add Personal Notes**
   - Share your motivations, experiences, and achievements
   - Be authentic and specific

4. **Choose Tone**
   - Professional: Formal, traditional business style
   - Friendly: Warm and personable
   - Enthusiastic: Energetic and passionate

5. **Generate & Review**
   - Get 3 different versions instantly
   - Review customization tips
   - Copy your preferred version

## Project Structure

```
motivation-letter-writer/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── letter.js         # API routes
│   │   ├── services/
│   │   │   ├── ai.js              # Claude AI integration
│   │   │   └── parser.js          # File parsing
│   │   ├── utils/
│   │   │   └── validator.js       # Input validation
│   │   └── server.js              # Express server
│   ├── uploads/                   # Temporary file storage
│   ├── .env                       # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LetterForm.jsx     # Multi-step form
│   │   │   └── LetterResult.jsx   # Results display
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Motivation Letter
```
POST /api/letter/generate
Content-Type: multipart/form-data

Fields:
- resume (file, optional): PDF/DOC/DOCX file
- company (string, required): Company name
- position (string, required): Job position
- jobPosting (string, required): Job description
- personalNotes (string, required): Personal notes
- tone (string, optional): professional|friendly|enthusiastic
```

### Get Writing Tips
```
GET /api/letter/tips
```

## Environment Variables

### Backend (.env)
```env
# Required
ANTHROPIC_API_KEY=your-api-key-here

# Optional
PORT=3001
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## File Support

- **PDF**: `.pdf` files
- **Word Documents**: `.doc` and `.docx` files
- **Maximum Size**: 10MB (configurable)

## Error Handling

The application provides user-friendly error messages for:
- Invalid file formats
- File size exceeded
- Missing required fields
- Network errors
- API rate limits
- Service unavailability

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Build for Production
```bash
# Backend (no build needed, runs directly with Node)
cd backend
npm start

# Frontend
cd frontend
npm run build  # Creates dist/ folder
npm run preview  # Preview production build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@example.com

## Acknowledgments

- Powered by [Anthropic Claude AI](https://www.anthropic.com/)
- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Roadmap

- [ ] Multiple language support
- [ ] PDF export functionality
- [ ] Email integration
- [ ] Letter templates
- [ ] User accounts and history
- [ ] Advanced customization options

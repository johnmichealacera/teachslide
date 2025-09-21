# Presentation Generator

A web application that generates ready-made class presentations for educators with minimal effort. Perfect for teachers who want to focus on teaching, not prep work.

## Features

- **Fast Generation**: Create complete presentations in under 2 minutes
- **Complete Package**: Includes slides, talking points, and quizzes
- **Age-Appropriate**: Tailored for different class levels
- **No Account Required**: Simple, frictionless experience
- **Export Options**: Download presentations as text files
- **Dynamic Model Selection**: Automatically uses the latest available free AI model to avoid deprecation issues

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **AI**: Groq API with dynamic model selection for content generation
- **UI**: Lucide React icons, React Hot Toast for notifications
- **Styling**: Tailwind CSS v4

## Why Groq?

- **🚀 Ultra-Fast**: Groq's inference engine provides near-instant responses
- **💰 Cost-Effective**: Free tier with generous limits for educational use
- **🎯 High Quality**: Automatically selects the best available model for excellent educational content
- **🔒 Privacy-Focused**: No data retention, perfect for educational environments

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd presentation-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Get a Groq API key**
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up for a free account
   - Navigate to API Keys section
   - Create a new API key
   - Add it to your `.env.local` file
   
   **Note**: Groq offers free tier with generous limits for educational use

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Enter your topic** (e.g., "Introduction to Programming", "Educational Psychology")
2. **Select class level** (1st Year College, High School, etc.)
3. **Choose duration** (30-120 minutes)
4. **Add teaching goals** (optional)
5. **Generate presentation** - Get slides, talking points, and quiz in seconds!

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── debug/model/  # Model debugging endpoint
│   │   └── generate/     # Presentation generation API
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── PresentationForm.tsx      # Input form
│   └── PresentationDisplay.tsx   # Results display
├── types/
│   └── presentation.ts   # TypeScript interfaces
└── utils/
    └── groqClient.ts     # Dynamic Groq API client
```

## API Endpoints

- `POST /api/generate` - Generates presentation content using Groq API
- `GET /api/debug/model` - Shows currently selected model and refreshes cache (for debugging)

## Dynamic Model Selection

The application automatically selects the best available free model from Groq to ensure:

- **No Deprecation Errors**: Avoids hardcoded models that may become unavailable
- **Optimal Performance**: Always uses the latest and most capable free models
- **Smart Fallbacks**: Multiple fallback options ensure the app keeps working
- **Automatic Caching**: Models are cached for 1 hour to reduce API calls

### Model Selection Priority

1. **Llama 3 8B models** (e.g., `llama3-8b-8192`) - Fast and efficient
2. **Llama 3 70B models** (e.g., `llama3-70b-8192`) - Higher quality when available
3. **Mixtral models** (e.g., `mixtral-8x7b-32768`) - Good alternative option
4. **Gemma models** (e.g., `gemma-7b-it`) - Backup option

The system automatically detects active models and selects the best match based on these preferences.

## Future Enhancements

- [ ] Google Slides export integration
- [ ] PDF export with better formatting
- [ ] Session saving with Supabase/NeonDB
- [ ] Template customization
- [ ] Image generation for slides
- [ ] Collaborative editing

## Contributing

This project is designed for educators by educators. Feel free to contribute improvements, especially around:

- Educational content quality
- UI/UX for classroom use
- Export formats
- Additional subject areas

## License

MIT License - feel free to use this for your own educational projects!

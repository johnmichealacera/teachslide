# Migration Guide: OpenAI to Groq

This guide helps you migrate from the OpenAI version to the new Groq-powered version of the Presentation Generator.

## What Changed

- **AI Provider**: Switched from OpenAI GPT-4 to Groq Mixtral-8x7B-32768
- **API Key**: Changed from `OPENAI_API_KEY` to `GROQ_API_KEY`
- **Performance**: Faster response times with Groq's inference engine
- **Cost**: More cost-effective with Groq's free tier

## Migration Steps

### 1. Update Environment Variables

**Before:**
```env
OPENAI_API_KEY=sk-...
```

**After:**
```env
GROQ_API_KEY=gsk_...
```

### 2. Get a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Replace your `.env.local` file content

### 3. Update Dependencies

The project no longer requires the `openai` package. Run:

```bash
npm install
```

This will automatically remove the OpenAI dependency.

### 4. Test the Application

```bash
npm run dev
```

## Benefits of the Migration

- **🚀 Faster Responses**: Groq's inference engine is significantly faster
- **💰 Lower Costs**: Free tier with generous limits
- **🎯 Same Quality**: Mixtral-8x7B-32768 provides excellent educational content
- **🔒 Better Privacy**: No data retention policies

## Troubleshooting

### "GROQ_API_KEY is not configured" Error

Make sure your `.env.local` file contains:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### API Rate Limits

Groq offers generous free tier limits. If you hit limits:
- Check your usage in the Groq Console
- Consider upgrading to a paid plan for higher limits

### Content Quality Issues

The Mixtral model should provide similar or better quality than GPT-4 for educational content. If you notice issues:
- Try adjusting the temperature in `src/utils/groqClient.ts`
- Check that your prompts are clear and specific

## Support

If you encounter any issues during migration:
1. Check the [Groq Documentation](https://console.groq.com/docs)
2. Verify your API key is correct
3. Ensure your `.env.local` file is in the project root 
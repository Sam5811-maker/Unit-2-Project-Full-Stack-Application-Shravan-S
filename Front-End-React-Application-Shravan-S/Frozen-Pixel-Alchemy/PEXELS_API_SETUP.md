# Pexels API Integration

This application now uses the Pexels API to display dynamic, high-quality images instead of static assets.

## Setup Instructions

1. **Get a Pexels API Key**
   - Visit [Pexels API](https://www.pexels.com/api/)
   - Sign up for a free account
   - Generate your API key

2. **Configure Environment Variables**
   - Open the `.env` file in the root directory
   - Replace `your_pexels_api_key_here` with your actual API key:
   ```
   VITE_PEXELS_API_KEY=your_actual_api_key_here
   ```

3. **Install Dependencies** (already done)
   ```bash
   npm install axios
   ```

## Features

- **Dynamic Image Loading**: Images are fetched from Pexels based on search queries
- **Loading States**: Shows loading spinners while images are being fetched
- **Error Handling**: Displays helpful error messages if API key is missing or requests fail
- **Responsive Design**: Images adapt to different screen sizes
- **Image Credits**: Photographer attribution appears on hover
- **Lazy Loading**: Images load only when needed for better performance

## How It Works

The application uses a custom hook `usePexelsImages` that:
- Fetches images from the Pexels Search API
- Handles loading states and errors
- Returns formatted image data for display

The Home component displays two sets of images:
- Portfolio images (query: "photography portfolio", 6 images)
- Recent images (query: "recent photographs", 8 images)

## Customization

You can customize the image queries and counts by modifying the parameters in `Home.jsx`:

```javascript
// Change search terms and number of images
const { images: homeImages, loading: homeLoading, error: homeError } = 
  usePexelsImages("your custom search term", 10);
```

## API Limits

The free Pexels API allows:
- 200 requests per hour
- 20,000 requests per month

For production applications with higher traffic, consider upgrading to a paid plan.

## Troubleshooting

- **Images not loading**: Check that your API key is correctly set in the `.env` file
- **Error messages**: Read the error details - they often provide specific guidance
- **Development**: Restart the development server after changing the `.env` file

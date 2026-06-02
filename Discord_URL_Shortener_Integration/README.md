# Discord URL Shortener Integration

A Discord bot that integrates with an Express-based URL shortener service to create short URLs and share them instantly in Discord.

## Features

✅ Create short URLs directly from Discord  
✅ Automatic URL validation  
✅ MongoDB database for persistent storage  
✅ Click analytics for shortened URLs  
✅ Easy-to-use command interface  
✅ Support for any valid URL  

## Project Structure

```
Discord_URL_Shortener_Integration/
├── index.js              # Discord bot entry point
├── server.js             # Express API server entry point
├── connection.js         # MongoDB connection
├── package.json          # Dependencies
├── models/
│   └── url.js           # URL schema
├── controllers/
│   └── url.js           # URL logic (generate, redirect, analytics)
└── routes/
    └── url.js           # API routes
```

## Prerequisites

- **Node.js** (v16+)
- **MongoDB** running locally (mongodb://127.0.0.1:27017)
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)

## Setup Instructions

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a New Application
3. Go to the "Bot" section and click "Add Bot"
4. Under TOKEN, click "Copy" to get your bot token
5. Under INTENTS, enable:
   - ✅ Message Content Intent
   - ✅ Server Members Intent
6. Go to OAuth2 > URL Generator
   - Scopes: `bot`
   - Permissions: `Send Messages`, `Read Messages/View Channels`
   - Copy the generated URL and invite your bot to your server

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file (or set environment variables):

```
DISCORD_TOKEN=your_discord_bot_token_here
```

Or set it when running:

```bash
# Windows (PowerShell)
$env:DISCORD_TOKEN="your_token"; npm start

# Linux/Mac
DISCORD_TOKEN="your_token" npm start
```

### 4. Start MongoDB

Ensure MongoDB is running:

```bash
# Windows
mongod

# Linux/Mac
brew services start mongodb-community
# or
mongod
```

## Running the Application

### Option 1: Run Both Services (Recommended)

```bash
npm run dev
```

This starts both the Discord bot and the Express API server concurrently.

### Option 2: Run Separately

**Terminal 1 - Start API Server:**
```bash
npm run server
```

**Terminal 2 - Start Discord Bot:**
```bash
npm start
```

## Usage

In any Discord channel where your bot has access:

### Create a Short URL

```
!shorten https://www.example.com/very/long/url
```

**Response:**
```
🔗 Short URL Generated!

📌 Original: https://www.example.com/very/long/url
🚀 Shortened: `http://localhost:8003/url/aBc12345`
```

### Get Help

```
!help
```

## API Endpoints

### POST /url - Create Short URL

```bash
curl -X POST http://localhost:8003/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**Response:**
```json
{
  "shortId": "aBc12345",
  "shortURL": "http://localhost:8003/url/aBc12345"
}
```

### GET /url/:shortID - Redirect to Original URL

```bash
curl http://localhost:8003/url/aBc12345
```

Redirects to the original URL and records a visit.

### GET /url/analytics/:shortID - Get Analytics

```bash
curl http://localhost:8003/url/analytics/aBc12345
```

**Response:**
```json
{
  "shortId": "aBc12345",
  "originalURL": "https://example.com",
  "totalClicks": 5,
  "analytics": [
    { "timestamp": 1234567890000 },
    { "timestamp": 1234567900000 }
  ]
}
```

## Database Schema

### URL Collection

```javascript
{
  shortId: String,           // Unique 8-char ID (e.g., "aBc12345")
  redirectURL: String,       // Original long URL
  visitHistory: [
    { timestamp: Number }    // Click timestamps
  ],
  createdBy: String,         // Default: "discord-bot"
  createdAt: Date           // Creation timestamp
}
```

## Troubleshooting

### "Could not connect to MongoDB"
- Make sure MongoDB is running
- Check connection string in `connection.js`
- Default: `mongodb://127.0.0.1:27017/discord-short-url`

### "Failed to create short URL"
- Ensure the API server is running on port 8003
- Check for port conflicts: `netstat -ano | findstr :8003`

### Bot doesn't respond to commands
- Verify bot has "Message Content Intent" enabled
- Check bot has "Send Messages" permission in the channel
- Verify bot token in environment variable

### Discord bot won't login
- Double-check your DISCORD_TOKEN
- Ensure bot is invited to your server with correct scopes
- Check bot token hasn't been regenerated

## Production Deployment

For production use:

1. **Use a real database URL** instead of localhost
2. **Set BASE_URL environment variable** for the short URL domain
3. **Use a reverse proxy** (nginx) for HTTPS
4. **Store tokens securely** in environment variables
5. **Add rate limiting** to API endpoints
6. **Enable CORS** if needed for cross-origin requests

Example for production:

```javascript
const BASE_URL = process.env.BASE_URL || 'http://localhost:8003';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/discord-short-url';
```

## Notes

- Short URLs are 8 characters (using nanoid)
- Each URL click is tracked with a timestamp
- URLs are stored in MongoDB database
- The bot uses the command prefix `!`
- All URLs are created by the bot itself (no individual user tracking)

## License

ISC

## Support

For issues, check:
1. MongoDB is running
2. API server is on port 8003
3. Discord bot token is valid
4. Bot has required permissions and intents

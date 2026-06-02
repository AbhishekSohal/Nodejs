# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Setup Discord Bot
1. Go to https://discord.com/developers/applications
2. Create a new app, add a bot, copy the token
3. Enable "Message Content Intent"
4. Use OAuth2 URL Generator to invite bot to your server

### Step 2: Install & Configure
```bash
# Install dependencies
npm install

# Create .env file with your token
echo DISCORD_TOKEN=your_token_here > .env
```

### Step 3: Start MongoDB
```bash
mongod
```

### Step 4: Run Everything
```bash
npm run dev
```

## 💬 Using the Bot

Send a message in Discord:
```
!shorten https://github.com/AbhishekSohal/Nodejs
```

Bot responds:
```
🔗 Short URL Generated!

📌 Original: https://github.com/AbhishekSohal/Nodejs
🚀 Shortened: http://localhost:8003/url/aBc12345
```

## ✅ What Just Happened?

1. You sent a URL to the bot
2. Bot validated the URL
3. Bot sent it to the API (http://localhost:8003/url)
4. API created a short ID and stored it in MongoDB
5. Bot replied with the shortened URL

## 🔗 File Structure

```
Discord_URL_Shortener_Integration/
├── index.js              ← Discord bot logic
├── server.js             ← Express API server
├── connection.js         ← MongoDB setup
├── models/url.js         ← Database schema
├── controllers/url.js    ← URL generation logic
└── routes/url.js         ← API endpoints
```

## 🆘 Troubleshooting

**Bot won't respond?**
- Check bot has "Send Messages" permission
- Verify bot is in your server
- Ensure MongoDB is running (`mongod`)

**"Failed to create short URL"?**
- Make sure API server is running
- Check port 8003 is not blocked
- Verify MongoDB is running

**Bot won't start?**
- Check DISCORD_TOKEN in .env
- Ensure token hasn't been regenerated

## 📖 Learn More

See README.md for full documentation and API reference.

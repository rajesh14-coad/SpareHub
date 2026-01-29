# Environment Variables Configuration

## Setup Instructions

1. Copy this file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following values in your `.env` file:

### Required Configuration

- **MONGODB_URI**: Your MongoDB connection string
  - Local: `mongodb://localhost:27017/purzasetu`
  - Production: Use MongoDB Atlas connection string

- **JWT_SECRET**: Strong random string for JWT token signing
  - Generate with: `openssl rand -base64 32`
  - MUST be changed in production!

- **SESSION_SECRET**: Strong random string for session encryption
  - Generate with: `openssl rand -base64 32`
  - MUST be changed in production!

- **CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name
- **CLOUDINARY_API_KEY**: Your Cloudinary API key
- **CLOUDINARY_API_SECRET**: Your Cloudinary API secret

### Optional Configuration

- **PORT**: Server port (default: 5001)
- **NODE_ENV**: Environment mode (`development` or `production`)
- **CORS_ORIGIN**: Frontend URL for CORS (update for production domain)

## Security Notes

⚠️ **NEVER commit the `.env` file to version control!**

- The `.env` file is already in `.gitignore`
- Always use strong, unique secrets in production
- Rotate secrets regularly
- Use environment-specific configurations

## Production Checklist

- [ ] Generate strong JWT_SECRET
- [ ] Generate strong SESSION_SECRET
- [ ] Add Cloudinary credentials
- [ ] Update MONGODB_URI to production database
- [ ] Update CORS_ORIGIN to production domain
- [ ] Set NODE_ENV to `production`

# 🔐 NIP-05 Nostr Verification Tool

A simple and elegant web tool to verify NIP-05 Nostr identities with bilingual support (English/French).

## ✨ Features

- 🔍 **NIP-05 Identity Verification**: Verify Nostr identities against their NIP-05 addresses
- 🔄 **npub to Hex Conversion**: Convert npub keys to hexadecimal format
- 🌍 **Bilingual Interface**: Switch between English and French
- 🎨 **Modern UI**: Clean, responsive design with glass-morphism effects
- 🛡️ **CORS Fallback**: Automatic fallback for CORS-restricted domains
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🐳 **Docker Support**: Easy deployment with Docker and Docker Compose

## 🚀 Quick Start

### 🐳 Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/PastaGringo/nip05-checker.git
cd nip05-checker
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

3. Open your browser and navigate to `http://localhost:8080`

4. To stop the container:
```bash
docker-compose down
```

### 🔧 Alternative: Docker only

```bash
# Build the image
docker build -t nip05-checker .

# Run the container
docker run -d -p 8080:80 --name nip05-checker nip05-checker
```

### 💻 Local Development

1. Clone the repository:
```bash
git clone https://github.com/PastaGringo/nip05-checker.git
cd nip05-checker
```

2. Start a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

### GitHub Pages Deployment

1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your tool will be available at `https://yourusername.github.io/nip05-checker`

## 📖 How to Use

### NIP-05 Verification

1. Enter a NIP-05 address (e.g., `username@domain.com`)
2. Click "Verify" or press Enter
3. The tool will:
   - Fetch the `/.well-known/nostr.json` file from the domain
   - Check if the username exists in the file
   - Verify the public key matches
   - Display the result with detailed information

### npub to Hex Conversion

1. Enter an npub key (starts with `npub1`)
2. Click "Convert" or press Enter
3. Get the hexadecimal representation of the public key

### Example Addresses to Test

- `jack@cash.app` - Jack Dorsey's verified NIP-05
- `fiatjaf@fiatjaf.com` - fiatjaf's verified NIP-05
- `jb55@jb55.com` - Will Casarin's verified NIP-05

## 🔍 Understanding NIP-05

NIP-05 is a Nostr protocol that allows users to verify their identity by associating their public key with a domain name. It works by:

1. **Domain Verification**: Users publish their public key in a `/.well-known/nostr.json` file on their domain
2. **Identity Mapping**: The JSON file maps usernames to public keys
3. **Verification Process**: Clients can verify that a claimed identity actually controls the domain

### Example nostr.json format:
```json
{
  "names": {
    "username": "public_key_in_hex"
  },
  "relays": {
    "public_key_in_hex": ["wss://relay1.com", "wss://relay2.com"]
  }
}
```

## 🛠️ Technical Details

### File Structure
```
nip05-checker/
├── index.html          # Main HTML structure
├── script.js           # JavaScript logic and NIP-05 verification
├── style.css           # Styling and responsive design
├── Dockerfile          # Docker container configuration
├── docker-compose.yml  # Docker Compose setup
├── .dockerignore       # Docker ignore file
└── README.md           # This documentation
```

### 🐳 Docker Configuration

**Dockerfile Features:**
- Based on `nginx:alpine` for lightweight deployment
- Automatic CORS headers configuration
- Optimized for static file serving
- Production-ready setup

**Docker Compose Features:**
- Easy one-command deployment
- Port mapping (8080:80)
- Network isolation
- Restart policies
- Traefik labels for reverse proxy support

**Benefits of Docker deployment:**
- ✅ Consistent environment across different systems
- ✅ Easy scaling and deployment
- ✅ Built-in CORS handling
- ✅ Production-ready configuration
- ✅ Isolated from host system

### Key Features Implementation

**NIP-05 Verification:**
- Fetches `/.well-known/nostr.json` from the specified domain
- Parses JSON and validates the structure
- Compares provided public key with the one in the file
- Handles various error cases (network, parsing, validation)

**CORS Handling:**
- Primary fetch attempt with standard CORS
- Automatic fallback to CORS proxy for restricted domains
- User-friendly error messages for different failure scenarios

**npub Conversion:**
- Uses bech32 decoding to convert npub to hex
- Validates npub format before conversion
- Handles encoding errors gracefully

### Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

**"CORS Error" or "Network Error":**
- The tool automatically tries a CORS proxy as fallback
- Some domains may block all external requests
- Try accessing the domain directly to verify it exists

**"Invalid NIP-05 format":**
- Ensure the format is `username@domain.com`
- Check for typos in the domain name
- Verify the domain actually exists

**"No nostr.json found":**
- The domain doesn't have a `/.well-known/nostr.json` file
- The file might be misconfigured or inaccessible
- Check if the domain supports NIP-05

**"Username not found":**
- The username doesn't exist in the domain's nostr.json
- Check the exact spelling of the username
- The domain might use different username mappings

**"Public key mismatch":**
- The provided public key doesn't match the one in nostr.json
- Verify you're using the correct public key
- The domain's nostr.json might be outdated

### Docker Issues

**Container won't start:**
```bash
# Check container logs
docker-compose logs nip05-checker

# Rebuild the image
docker-compose build --no-cache
```

**Port already in use:**
```bash
# Change the port in docker-compose.yml
ports:
  - "8081:80"  # Use port 8081 instead
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Useful Links

- [NIP-05 Specification](https://github.com/nostr-protocol/nips/blob/master/05.md)
- [Nostr Protocol](https://nostr.com/)
- [Nostr Implementation Possibilities](https://github.com/nostr-protocol/nips)
- [Live Demo](https://pastagringo.github.io/nip05-checker)

---

**Made with ❤️ for the Nostr community**
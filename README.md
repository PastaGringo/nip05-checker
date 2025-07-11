# NIP-05 Nostr Verification Tool

🔐 A simple and elegant web tool to verify NIP-05 Nostr identities.

## 🌟 Features

- **Real-time NIP-05 verification** - Verify your Nostr identity instantly
- **Bilingual interface** - Available in English and French
- **Modern UI** - Clean, responsive design with glass-morphism effects
- **Error detection** - Comprehensive error handling and user-friendly messages
- **CORS proxy fallback** - Automatic fallback for domains with CORS restrictions
- **Format validation** - Detects common mistakes like using npub format in nostr.json

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/PastaGringo/nip05-checker.git
   cd nip05-checker
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

### GitHub Pages Deployment

This tool can be easily deployed on GitHub Pages:

1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your tool will be available at `https://PastaGringo.github.io/nip05-checker`

## 📖 How to Use

1. **Enter your details:**
   - **Username**: Your username without the domain (e.g., `alice` for `alice@example.com`)
   - **Domain**: The domain of your NIP-05 identity (e.g., `example.com`)
   - **Npub**: Your Nostr public key in npub format (starts with `npub1`)

2. **Click "Verify NIP-05"** to check if your identity is properly configured

3. **View results:**
   - ✅ **Success**: Your NIP-05 identity is correctly configured
   - ❌ **Error**: Issues found with detailed explanations and solutions

## 🔧 What is NIP-05?

NIP-05 is a Nostr standard that allows verifying a user's identity by associating an email-like address to a Nostr public key. This facilitates account discovery and verification.

### How it works:

1. Your domain must serve a JSON file at `/.well-known/nostr.json`
2. This file contains the mapping between usernames and public keys
3. The tool verifies that your npub matches your username in that file

### Example nostr.json format:

```json
{
  "names": {
    "alice": "b12b632c887f0c871d140d37bcb6e7c1e1a80264d0b7de8255aa1951d9e1ff79",
    "bob": "c33c05b3a51c6ff70cc92ca4ac0c28157b888906a04ae64cbf1b1b874a00a8c0"
  }
}
```

**Important**: Use hexadecimal format (64 characters), not npub format in the JSON file.

## 🛠️ Technical Details

### File Structure

```
nip05-checker/
├── index.html          # Main HTML structure
├── script.js           # JavaScript logic and NIP-05 verification
├── style.css           # Styling and responsive design
└── README.md           # This documentation
```

### Key Features Implementation

- **Bech32 Decoding**: Converts npub format to hexadecimal for comparison
- **CORS Handling**: Automatic fallback to proxy service for restricted domains
- **Input Validation**: Real-time validation of npub format
- **Internationalization**: Complete bilingual support with localStorage persistence
- **Error Detection**: Specific error messages for common configuration mistakes

### Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - The tool automatically tries a CORS proxy as fallback
   - For domain owners: Add appropriate CORS headers to your server
   - For testing: Use public domains like `nostr.band`, `iris.to`, or `damus.io`

2. **"npub format detected in nostr.json"**
   - Your nostr.json file contains npub format instead of hexadecimal
   - Convert your npub to hex format (the tool shows the correct format)

3. **"Key not found"**
   - Check that your username exists in the nostr.json file
   - Verify the JSON syntax is correct
   - Ensure the file is accessible at `https://yourdomain.com/.well-known/nostr.json`

### Testing

Use these test values to verify the tool works:
- **Username**: `jack`
- **Domain**: `nostr.band`
- **Npub**: `npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Maintain the existing code style
2. Test thoroughly across different browsers
3. Update documentation for new features
4. Ensure bilingual support for new text content

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [NIP-05 Specification](https://github.com/nostr-protocol/nips/blob/master/05.md)
- [Nostr Protocol](https://nostr.com/)
- [Live Demo](https://PastaGringo.github.io/nip05-checker)

## 🙏 Acknowledgments

- Built for the Nostr community
- Inspired by the need for simple NIP-05 verification tools
- Thanks to all contributors and testers

---

**Made with ❤️ for the Nostr ecosystem**
# Motivation Letter Writer AI - WordPress Plugin

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![WordPress](https://img.shields.io/badge/WordPress-5.8+-green.svg)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple.svg)
![License](https://img.shields.io/badge/license-GPL--2.0-orange.svg)

AI-powered motivation letter generator for WordPress using Claude AI.

---

## 🌟 Features

- ✅ **3 Different Tones**: Professional, Friendly, Enthusiastic
- ✅ **Resume Analysis**: Upload PDF/DOC/DOCX files
- ✅ **Smart AI**: Powered by Claude 3 Haiku
- ✅ **Easy Integration**: Simple shortcode
- ✅ **Fully Responsive**: Works on all devices
- ✅ **Customization Tips**: AI-generated improvement suggestions
- ✅ **Copy to Clipboard**: One-click copy functionality
- ✅ **Secure**: No data storage, temporary processing only

---

## 📦 Installation

### Quick Install

1. **Upload Plugin**
   ```
   - Zip the plugin folder
   - WordPress Admin → Plugins → Add New → Upload
   - Install and Activate
   ```

2. **Configure API Key**
   ```
   - Settings → Motivation Letter Writer
   - Enter Anthropic API key
   - Save Settings
   ```

3. **Add to Page**
   ```
   [motivation_letter_writer]
   ```

**Full guide:** See [QUICK-START.md](QUICK-START.md)

---

## 🚀 Usage

### Basic Shortcode
```
[motivation_letter_writer]
```

### With Customization
```
[motivation_letter_writer max_width="900px"]
[motivation_letter_writer width="90%" max_width="1200px"]
```

### Shortcode Attributes

| Attribute | Description | Default | Example |
|-----------|-------------|---------|---------|
| `width` | Container width | `100%` | `width="90%"` |
| `max_width` | Maximum width | `1200px` | `max_width="800px"` |

---

## ⚙️ Configuration

### Settings Page
Navigate to: **Settings → Motivation Letter Writer**

### Required Settings
- **Anthropic API Key**: Get from [console.anthropic.com](https://console.anthropic.com/)

### Optional Settings
- **Max File Size**: 5MB, 10MB, 15MB, or 20MB (default: 10MB)

---

## 📋 Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- Anthropic Claude API key
- Modern browser with JavaScript enabled

---

## 💰 API Costs

| Usage | Approximate Cost |
|-------|-----------------|
| Per letter | $0.005 - $0.02 |
| 100 letters | ~$1.00 |
| 1,000 letters | ~$10.00 |

**Model:** Claude 3 Haiku
**Monitor usage:** https://console.anthropic.com/

---

## 📁 File Structure

```
motivation-letter-writer/
├── assets/
│   ├── admin/
│   │   ├── admin.css
│   │   └── admin.js
│   └── dist/
│       ├── widget.css
│       └── widget.js
├── includes/
│   ├── class-mlw-admin.php
│   ├── class-mlw-api.php
│   └── class-mlw-shortcode.php
├── motivation-letter-writer.php
├── readme.txt
├── README.md
├── QUICK-START.md
└── WORDPRESS-INSTALLATION.md
```

---

## 🔧 Technical Details

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend
- **API**: WordPress REST API
- **Integration**: Anthropic Claude AI
- **File Parsing**: PDF & DOCX support
- **Security**: Input sanitization, file validation

### API Endpoints
```
GET  /wp-json/mlw/v1/health
POST /wp-json/mlw/v1/letter/generate
```

---

## 🛡️ Security

### Built-in Security Features
- ✅ API key encryption
- ✅ File type validation
- ✅ File size limits
- ✅ Input sanitization
- ✅ Temporary file storage
- ✅ Automatic file cleanup

### Best Practices
- Keep API key secure
- Use HTTPS (SSL)
- Regular updates
- Monitor API usage
- Set usage alerts

---

## 🎨 Customization

### CSS Customization

Add to **Appearance → Customize → Additional CSS:**

```css
/* Custom button colors */
.mlw-container .bg-primary-600 {
    background-color: #your-color !important;
}

/* Custom container style */
.mlw-container {
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
```

### Theme Integration
The plugin is theme-agnostic and works with:
- Default WordPress themes
- Popular page builders (Elementor, Divi, Beaver Builder)
- Custom themes
- Block themes (FSE)

---

## 🐛 Troubleshooting

### Common Issues

**Q: Shortcode displays as text**
A: Ensure plugin is activated and shortcode is correct: `[motivation_letter_writer]`

**Q: API key error**
A: Go to Settings → Motivation Letter Writer and enter your API key

**Q: File upload fails**
A: Check file type (PDF/DOC/DOCX) and size (under 10MB)

**Q: Letters show "\n" characters**
A: Update to latest version (fixed in v1.0.1)

**Full troubleshooting:** See [WORDPRESS-INSTALLATION.md](WORDPRESS-INSTALLATION.md)

---

## 📖 Documentation

- **[QUICK-START.md](QUICK-START.md)** - 5-minute setup guide
- **[WORDPRESS-INSTALLATION.md](WORDPRESS-INSTALLATION.md)** - Complete installation guide
- **[readme.txt](readme.txt)** - WordPress plugin repository format

---

## 🌐 Live Example

**MindTrellis Website:**
https://mindtrellis.com/motivation-letter-generator/

---

## 📞 Support

### Get Help
- **Website**: https://mindtrellis.com/support
- **Email**: contact@mindtrellis.com
- **Response Time**: 24-48 hours

### Report Issues
Include:
- WordPress version
- PHP version
- Plugin version
- Error messages
- Steps to reproduce

---

## 📝 Changelog

### Version 1.0.1 (Latest)
- ✅ Fixed letter formatting (\n display issue)
- ✅ Improved paragraph rendering
- ✅ Enhanced copy-to-clipboard functionality

### Version 1.0.0
- ✅ Initial release
- ✅ 3-tone letter generation
- ✅ Resume upload support
- ✅ Admin settings page
- ✅ WordPress shortcode
- ✅ Customization tips

---

## 🔄 Updates

### Updating the Plugin

1. **Backup First**
   - Backup WordPress files
   - Backup database

2. **Update**
   - Dashboard → Updates
   - Or manually replace files via FTP

3. **Test**
   - Clear caches
   - Test functionality

---

## 🤝 Contributing

We welcome contributions!

### Development Setup
1. Clone repository
2. Install dependencies
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📜 License

**GPL v2 or later**

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation.

---

## 🏆 Credits

### Built With
- [Anthropic Claude AI](https://www.anthropic.com/) - AI engine
- [React](https://react.dev/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [WordPress REST API](https://developer.wordpress.org/rest-api/) - Backend

### Developed By
**MindTrellis**
Website: https://mindtrellis.com
Email: contact@mindtrellis.com

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Multi-language support
- [ ] PDF export
- [ ] Email integration
- [ ] Template library
- [ ] User accounts
- [ ] Letter history
- [ ] Advanced analytics
- [ ] A/B testing

---

## ⭐ Show Your Support

If you find this plugin useful:
- ⭐ Star on GitHub
- 📢 Share on social media
- 💬 Leave a review
- 🐛 Report bugs
- 💡 Suggest features

---

## 📊 Stats

- **Version**: 1.0.1
- **WordPress**: 5.8+
- **PHP**: 7.4+
- **Active Installations**: Growing
- **Rating**: ⭐⭐⭐⭐⭐

---

**Made with ❤️ by [MindTrellis](https://mindtrellis.com)**

---

*For detailed installation instructions, see [WORDPRESS-INSTALLATION.md](WORDPRESS-INSTALLATION.md)*

*For quick setup, see [QUICK-START.md](QUICK-START.md)*

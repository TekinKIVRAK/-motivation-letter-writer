# WordPress Installation Guide
## Motivation Letter Writer AI Plugin

Complete guide for installing and configuring the Motivation Letter Writer AI plugin on your WordPress website.

---

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- ✅ WordPress 5.8 or higher
- ✅ PHP 7.4 or higher
- ✅ Anthropic Claude API key ([Get it here](https://console.anthropic.com/))

### Recommended
- WordPress 6.0+
- PHP 8.0+
- SSL certificate (HTTPS)
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## Installation Methods

### Method 1: Manual Upload (Recommended)

1. **Download Plugin Files**
   - Get the `motivation-letter-writer` folder
   - Ensure all files are included

2. **Upload to WordPress**
   ```
   - Compress the 'motivation-letter-writer' folder as .zip
   - Go to WordPress Admin → Plugins → Add New
   - Click "Upload Plugin"
   - Choose the .zip file
   - Click "Install Now"
   ```

3. **Activate Plugin**
   - Click "Activate Plugin" after installation
   - Or go to Plugins → Installed Plugins → Activate

### Method 2: FTP Upload

1. **Connect via FTP**
   - Use FileZilla, Cyberduck, or similar FTP client
   - Connect to your website

2. **Upload Files**
   ```
   Upload the 'motivation-letter-writer' folder to:
   /wp-content/plugins/
   ```

3. **Activate**
   - Go to WordPress Admin → Plugins
   - Find "Motivation Letter Writer AI"
   - Click "Activate"

### Method 3: cPanel File Manager

1. **Access File Manager**
   - Log in to cPanel
   - Open File Manager
   - Navigate to `/public_html/wp-content/plugins/`

2. **Upload & Extract**
   - Upload the plugin .zip file
   - Right-click → Extract
   - Delete the .zip file

3. **Activate in WordPress**
   - Go to WordPress Admin → Plugins
   - Activate the plugin

---

## Configuration

### Step 1: Get Anthropic API Key

1. **Create Anthropic Account**
   - Visit: https://console.anthropic.com/
   - Sign up or log in
   - Verify your email

2. **Generate API Key**
   - Go to "API Keys" section
   - Click "Create Key"
   - Name it: "MindTrellis - Motivation Letter"
   - **Copy the key immediately** (starts with `sk-ant-`)
   - Store it securely

3. **Add Credits (if needed)**
   - Go to "Billing" section
   - Add payment method
   - Purchase credits or use free tier

### Step 2: Configure WordPress Plugin

1. **Access Settings**
   ```
   WordPress Admin → Settings → Motivation Letter Writer
   ```

2. **Enter API Key**
   - Paste your Anthropic API key
   - The key will be masked for security
   - Click "Save Settings"

3. **Configure File Size (Optional)**
   - Choose maximum file upload size
   - Default: 10 MB
   - Options: 5 MB, 10 MB, 15 MB, 20 MB

4. **Test Configuration**
   - Click "Test API" link
   - Verify connection is successful
   - Check health status

### Step 3: Add to Your Website

#### Option A: Using Page Builder (Elementor, Divi, etc.)

1. **Create/Edit Page**
   - Go to the page where you want the tool
   - Edit with your page builder

2. **Add Shortcode Widget**
   - Drag "Shortcode" widget
   - Enter: `[motivation_letter_writer]`
   - Save and publish

#### Option B: Using Classic Editor

1. **Edit Page**
   - Go to Pages → Edit your page
   - Place cursor where you want the tool

2. **Add Shortcode**
   ```
   [motivation_letter_writer]
   ```

3. **Publish**
   - Click "Update" or "Publish"

#### Option C: Using Gutenberg Editor

1. **Edit Page**
   - Open page in Gutenberg editor
   - Add a new block (+)

2. **Add Shortcode Block**
   - Search for "Shortcode"
   - Add Shortcode block
   - Enter: `[motivation_letter_writer]`

3. **Publish**
   - Click "Update" or "Publish"

---

## Usage

### Basic Shortcode

```
[motivation_letter_writer]
```

### Customized Shortcode

```
[motivation_letter_writer max_width="900px"]
[motivation_letter_writer width="90%" max_width="1200px"]
```

### Shortcode Attributes

| Attribute | Description | Default | Example |
|-----------|-------------|---------|---------|
| `width` | Container width | `100%` | `width="90%"` |
| `max_width` | Maximum width | `1200px` | `max_width="900px"` |

### Example Pages

**Career Services Page:**
```
[motivation_letter_writer max_width="1000px"]
```

**Job Application Tools:**
```
[motivation_letter_writer width="95%"]
```

**Full Width Landing Page:**
```
[motivation_letter_writer]
```

---

## Recommended Pages

### 1. Dedicated Tool Page

**URL:** `https://mindtrellis.com/motivation-letter-generator/`

**Content:**
```
# AI Motivation Letter Generator

Create professional, personalized motivation letters instantly with AI.

[motivation_letter_writer]
```

### 2. Career Services Section

**URL:** `https://mindtrellis.com/career-tools/`

**Content:**
```
## Free Career Tools

### Motivation Letter Generator
Our AI-powered tool helps you create compelling motivation letters.

[motivation_letter_writer max_width="900px"]
```

### 3. Blog Post Integration

**Example:** "How to Write a Perfect Motivation Letter"

**Content:**
```
... [your blog content] ...

## Try Our AI Tool

Generate your own motivation letter now:

[motivation_letter_writer]
```

---

## Styling & Customization

### CSS Customization

Add to **Appearance → Customize → Additional CSS:**

```css
/* Customize container */
.mlw-container {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border-radius: 12px;
    padding: 20px;
}

/* Customize buttons */
.mlw-container button {
    transition: all 0.3s ease;
}

/* Customize colors to match your theme */
.mlw-container .bg-primary-600 {
    background-color: #your-brand-color !important;
}
```

### Custom Container Width

```
[motivation_letter_writer max_width="800px"]
```

### Sidebar Integration

For narrow spaces:
```
[motivation_letter_writer width="100%" max_width="400px"]
```

---

## API Usage & Costs

### Pricing
- Model: Claude 3 Haiku
- Average cost per letter: **$0.005 - $0.02**
- Input tokens: ~1,500-2,000
- Output tokens: ~1,500-2,500

### Cost Estimates

| Usage | Monthly Cost |
|-------|-------------|
| 10 letters/month | ~$0.10 |
| 50 letters/month | ~$0.50 |
| 100 letters/month | ~$1.00 |
| 500 letters/month | ~$5.00 |

### Monitor Usage
- Check usage at: https://console.anthropic.com/
- Set budget alerts
- Review monthly reports

---

## Troubleshooting

### Issue: "API key not configured"

**Solution:**
1. Go to Settings → Motivation Letter Writer
2. Enter your Anthropic API key
3. Click "Save Settings"
4. Refresh the page

### Issue: "Failed to load widget"

**Solution:**
1. Check if plugin is activated
2. Clear WordPress cache
3. Clear browser cache (Ctrl+Shift+Delete)
4. Deactivate and reactivate plugin

### Issue: "File upload fails"

**Solution:**
1. Check WordPress upload limit:
   - Settings → Media
   - Or add to `wp-config.php`:
   ```php
   @ini_set('upload_max_size', '20M');
   @ini_set('post_max_size', '20M');
   ```
2. Verify file type (PDF, DOC, DOCX only)
3. Check file size (must be under limit)

### Issue: "CORS errors in console"

**Solution:**
1. Add to `.htaccess`:
   ```apache
   <IfModule mod_headers.c>
       Header set Access-Control-Allow-Origin "*"
   </IfModule>
   ```
2. Or contact your hosting provider

### Issue: "Letters not generating"

**Solution:**
1. Verify API key is correct
2. Check Anthropic account has credits
3. Check error in browser console (F12)
4. Test API at: `/wp-json/mlw/v1/health`

### Issue: "Shortcode displays as text"

**Solution:**
1. Make sure plugin is activated
2. Check shortcode is typed correctly: `[motivation_letter_writer]`
3. No spaces in shortcode
4. Try different page builder/editor

---

## Performance Optimization

### Caching

If using cache plugin (WP Rocket, W3 Total Cache):

1. **Exclude from caching:**
   - Exclude URL: `/wp-json/mlw/*`
   - Exclude shortcode pages from cache

2. **Clear cache after:**
   - Plugin activation
   - Settings changes
   - Updates

### Speed Tips

1. **Use CDN** for static assets
2. **Enable Gzip compression**
3. **Optimize images** on the page
4. **Use fast hosting** (SSD, PHP 8+)

---

## Security Best Practices

### API Key Security

✅ **DO:**
- Keep API key in WordPress settings only
- Use environment variables in production
- Rotate keys periodically
- Monitor API usage regularly

❌ **DON'T:**
- Share API key publicly
- Commit key to version control
- Use same key across multiple sites
- Ignore usage alerts

### File Upload Security

The plugin automatically:
- Validates file types
- Limits file size
- Deletes files after processing
- Sanitizes all inputs

---

## Support

### Getting Help

1. **Documentation:** Check this guide first
2. **WordPress Support:** Ask in WP forums
3. **Email Support:** contact@mindtrellis.com
4. **Website:** https://mindtrellis.com/support

### Reporting Bugs

Include:
- WordPress version
- PHP version
- Plugin version
- Error message
- Steps to reproduce

---

## Updates & Maintenance

### Checking for Updates

1. Go to Dashboard → Updates
2. Look for plugin updates
3. Backup before updating
4. Update and test

### Backup Before Updates

1. Backup WordPress files
2. Backup database
3. Test on staging site (recommended)
4. Then update production

---

## Advanced Configuration

### Custom API Endpoint

Add to `wp-config.php`:
```php
define('MLW_API_ENDPOINT', 'https://custom-api.example.com');
```

### Custom File Size Limit

Add to functions.php:
```php
add_filter('mlw_max_file_size', function($size) {
    return 20 * 1024 * 1024; // 20MB
});
```

### Disable Resume Upload

Add to functions.php:
```php
add_filter('mlw_enable_resume_upload', '__return_false');
```

---

## Uninstallation

### Remove Plugin

1. **Deactivate:**
   - Plugins → Deactivate

2. **Delete:**
   - Click "Delete" after deactivation
   - Confirm deletion

3. **Clean Database (Optional):**
   ```sql
   DELETE FROM wp_options WHERE option_name LIKE 'mlw_%';
   ```

### Keep Settings

To remove plugin but keep settings:
- Only deactivate, don't delete
- Settings will remain in database

---

## FAQ

**Q: Can I use this on multiple sites?**
A: Yes, but you need separate API keys or monitor usage carefully.

**Q: Is there a usage limit?**
A: Only API rate limits from Anthropic (usually very high).

**Q: Can I customize the design?**
A: Yes, use custom CSS in WordPress customizer.

**Q: Does it work with my theme?**
A: Yes, it's theme-agnostic and works with any WordPress theme.

**Q: Is it mobile responsive?**
A: Yes, fully responsive on all devices.

**Q: Can I translate it?**
A: The interface can be translated. Letters are in the language of the job posting.

---

## Changelog

### Version 1.0.0
- Initial release
- 3-tone letter generation
- Resume upload (PDF/DOC/DOCX)
- WordPress shortcode
- Admin settings page
- API integration

---

## Credits

- **Website:** https://mindtrellis.com
- **Powered by:** Anthropic Claude AI
- **Built with:** React, WordPress REST API, Tailwind CSS

---

**Need help? Contact us at contact@mindtrellis.com**

**Visit:** https://mindtrellis.com

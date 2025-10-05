=== Motivation Letter Writer AI ===
Contributors: mindtrellis
Tags: motivation letter, cover letter, ai, claude, job application, career
Requires at least: 5.8
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI-powered motivation letter generator using Claude AI. Generate professional, friendly, and enthusiastic letters instantly.

== Description ==

**Motivation Letter Writer AI** helps job seekers create compelling, personalized motivation letters (cover letters) using advanced AI technology powered by Claude AI.

= Features =

* **3 Different Tones**: Generate letters in Professional, Friendly, and Enthusiastic tones
* **Resume Analysis**: Upload your resume (PDF/DOC/DOCX) for personalized content
* **Smart Customization**: AI analyzes job postings and personal notes
* **Multi-Version Output**: Get 3 different versions to choose from
* **Easy Integration**: Simple shortcode to add to any page or post
* **Customization Tips**: Receive personalized tips to improve your letter

= How It Works =

1. Upload your resume (optional)
2. Enter job information (company, position, description)
3. Add your personal notes and motivations
4. AI generates 3 different versions instantly
5. Copy your preferred version

= Usage =

Simply add the shortcode to any page or post:

`[motivation_letter_writer]`

You can also customize the display:

`[motivation_letter_writer max_width="900px"]`
`[motivation_letter_writer width="90%"]`

= Requirements =

* Anthropic Claude API key (get it from https://console.anthropic.com/)
* WordPress 5.8 or higher
* PHP 7.4 or higher

= Privacy & Data =

* All resume files are processed temporarily and deleted after generation
* No data is stored permanently on the server
* API calls are made directly to Anthropic's secure servers

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/motivation-letter-writer` directory, or install through WordPress plugins screen
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go to Settings → Motivation Letter Writer
4. Enter your Anthropic API key
5. Add the shortcode `[motivation_letter_writer]` to any page or post

== Frequently Asked Questions ==

= Do I need an API key? =

Yes, you need an Anthropic Claude API key. You can get one from https://console.anthropic.com/

= How much does it cost? =

The plugin is free, but API usage costs approximately $0.005-0.02 per letter generation depending on complexity.

= What file formats are supported? =

PDF (.pdf), Word Document (.doc, .docx) up to 10MB

= Is my data secure? =

Yes, files are processed temporarily and deleted immediately after. No permanent storage.

= Can I customize the appearance? =

Yes, use shortcode attributes like `max_width` and `width` to control the display.

= What if I don't upload a resume? =

The AI will still generate excellent letters based on job information and personal notes.

== Screenshots ==

1. Main form - Step 1: Resume upload
2. Main form - Step 2: Job information
3. Main form - Step 3: Personal notes
4. Results display with 3 different tones
5. Admin settings page
6. Customization tips

== Changelog ==

= 1.0.0 =
* Initial release
* 3-tone letter generation
* Resume upload support (PDF/DOC/DOCX)
* Admin settings page
* Shortcode integration
* Customization tips

== Upgrade Notice ==

= 1.0.0 =
Initial release of Motivation Letter Writer AI.

== Credits ==

* Powered by Anthropic Claude AI
* Built with React and WordPress REST API
* Styled with Tailwind CSS

== Support ==

For support, please visit: https://mindtrellis.com/support
Email: contact@mindtrellis.com

== API Usage & Costs ==

Each letter generation uses the Anthropic Claude API:
* Model: Claude 3 Haiku
* Average tokens per generation: 3000-4000
* Estimated cost: $0.005-0.02 per generation

Monitor your usage at: https://console.anthropic.com/

== Technical Details ==

**Frontend:**
* React application
* Responsive design
* File upload with drag & drop
* Multi-step form

**Backend:**
* WordPress REST API
* Secure file handling
* PDF/DOCX parsing
* Claude AI integration

**Security:**
* API key encryption
* File validation
* Temporary file storage
* Sanitized inputs

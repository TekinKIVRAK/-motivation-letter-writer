<?php
/**
 * Plugin Name: Motivation Letter Writer
 * Description: AI-powered motivation letter generator using Claude AI
 * Version: 2.1.0
 * Author: MindTrellis
 * Author URI: https://mindtrellis.com
 * License: GPL v2 or later
 * Text Domain: motivation-letter-writer
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

// Plugin constants
define('MLW_VERSION', '2.1.0');
define('MLW_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MLW_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main Plugin Class
 */
class Motivation_Letter_Writer {

    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Admin menu
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));

        // REST API
        add_action('rest_api_init', array($this, 'register_api'));

        // Shortcode
        add_shortcode('motivation_letter_writer', array($this, 'shortcode'));
    }

    /**
     * Admin Menu
     */
    public function admin_menu() {
        add_options_page(
            'Motivation Letter Writer',
            'Motivation Letter Writer',
            'manage_options',
            'motivation-letter-writer',
            array($this, 'settings_page')
        );
    }

    public function register_settings() {
        register_setting('mlw_settings', 'mlw_backend_url', array(
            'type' => 'string',
            'default' => 'https://motivation-letter-writer-production.up.railway.app',
            'sanitize_callback' => 'esc_url_raw',
        ));
    }

    public function settings_page() {
        if (!current_user_can('manage_options')) return;

        if (isset($_GET['settings-updated'])) {
            echo '<div class="updated"><p>Settings saved!</p></div>';
        }
        ?>
        <div class="wrap">
            <h1>Motivation Letter Writer Settings</h1>

            <div style="background: #fff; border: 1px solid #ccd0d4; padding: 20px; margin: 20px 0;">
                <h2>How to Use</h2>
                <p>Add this shortcode to any page or post:</p>
                <code style="background: #f0f0f0; padding: 10px; display: block;">[motivation_letter_writer]</code>
            </div>

            <form method="post" action="options.php">
                <?php settings_fields('mlw_settings'); ?>

                <table class="form-table">
                    <tr>
                        <th scope="row">Backend URL</th>
                        <td>
                            <input type="url" name="mlw_backend_url" value="<?php echo esc_attr(get_option('mlw_backend_url', 'https://motivation-letter-writer-production.up.railway.app')); ?>" class="regular-text">
                            <p class="description">Your Railway backend URL (default: motivation-letter-writer-production.up.railway.app)</p>
                        </td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    /**
     * REST API
     */
    public function register_api() {
        register_rest_route('mlw/v1', '/generate', array(
            'methods' => 'POST',
            'callback' => array($this, 'generate_letter'),
            'permission_callback' => '__return_true'
        ));
    }

    public function generate_letter($request) {
        // Use Railway backend instead of direct Anthropic API
        $backend_url = get_option('mlw_backend_url', 'https://motivation-letter-writer-production.up.railway.app');

        $company = sanitize_text_field($request->get_param('company'));
        $position = sanitize_text_field($request->get_param('position'));
        $job_posting = sanitize_textarea_field($request->get_param('jobPosting'));
        $resume_text = sanitize_textarea_field($request->get_param('resumeText'));
        $personal_notes = sanitize_textarea_field($request->get_param('personalNotes'));

        if (empty($company) || empty($position) || empty($job_posting)) {
            return new WP_Error('missing_fields', 'Required fields missing', array('status' => 400));
        }

        // Prepare multipart form data for Railway backend
        $boundary = wp_generate_password(24, false);
        $body = '';

        // Add text fields
        $fields = array(
            'company' => $company,
            'position' => $position,
            'jobPosting' => $job_posting,
            'resumeText' => $resume_text,
            'personalNotes' => $personal_notes,
            'tone' => 'professional'
        );

        foreach ($fields as $key => $value) {
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Disposition: form-data; name=\"{$key}\"\r\n\r\n";
            $body .= $value . "\r\n";
        }

        // Handle file upload
        $files = $request->get_file_params();
        if (!empty($files['resume'])) {
            $file = $files['resume'];
            $file_content = file_get_contents($file['tmp_name']);
            $file_name = $file['name'];

            $body .= "--{$boundary}\r\n";
            $body .= "Content-Disposition: form-data; name=\"resume\"; filename=\"{$file_name}\"\r\n";
            $body .= "Content-Type: {$file['type']}\r\n\r\n";
            $body .= $file_content . "\r\n";
        }

        $body .= "--{$boundary}--\r\n";

        // Send request to Railway backend
        $response = wp_remote_post($backend_url . '/api/letter/generate', array(
            'method' => 'POST',
            'timeout' => 60,
            'headers' => array(
                'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
            ),
            'body' => $body
        ));

        if (is_wp_error($response)) {
            error_log('MLW Backend Error: ' . $response->get_error_message());
            return new WP_Error('api_error', 'Failed to connect to backend: ' . $response->get_error_message(), array('status' => 500));
        }

        $response_body = json_decode(wp_remote_retrieve_body($response), true);

        if (!isset($response_body['success']) || !$response_body['success']) {
            error_log('MLW Backend Response Error: ' . print_r($response_body, true));
            return new WP_Error('backend_error', $response_body['message'] ?? 'Backend request failed', array('status' => 500));
        }

        return rest_ensure_response(array(
            'success' => true,
            'data' => $response_body['data']
        ));
    }

    /**
     * Parse uploaded resume file (PDF or DOCX)
     */
    private function parse_resume_file($file) {
        // Validate file
        $allowed_types = array('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        if (!in_array($file['type'], $allowed_types)) {
            return new WP_Error('invalid_file_type', 'Please upload a PDF or Word document (.pdf, .doc, .docx)', array('status' => 400));
        }

        // Check file size (10MB max)
        $max_size = 10 * 1024 * 1024;
        if ($file['size'] > $max_size) {
            return new WP_Error('file_too_large', 'File is too large. Maximum size is 10MB.', array('status' => 400));
        }

        $file_path = $file['tmp_name'];
        $file_type = $file['type'];
        $text = '';

        // Parse based on file type
        if ($file_type === 'application/pdf') {
            // Parse PDF using simple text extraction
            $text = $this->parse_pdf_simple($file_path);
        } elseif (in_array($file_type, array('application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))) {
            // Parse DOCX
            $text = $this->parse_docx_simple($file_path);
        }

        if (empty($text)) {
            return new WP_Error('parse_failed', 'Could not extract text from the file. Please try copying and pasting your resume text instead.', array('status' => 400));
        }

        return $text;
    }

    /**
     * Simple PDF text extraction
     */
    private function parse_pdf_simple($file_path) {
        // Try using pdftotext if available
        if (function_exists('shell_exec') && !empty(shell_exec('which pdftotext'))) {
            $output = shell_exec("pdftotext " . escapeshellarg($file_path) . " -");
            if (!empty($output)) {
                return trim($output);
            }
        }

        // Fallback: basic text extraction from PDF
        $content = file_get_contents($file_path);

        // Very basic PDF text extraction (works for simple PDFs)
        $text = '';
        if (preg_match_all('/\((.*?)\)/s', $content, $matches)) {
            foreach ($matches[1] as $match) {
                $text .= $match . ' ';
            }
        }

        // Clean up
        $text = str_replace(array('\\r', '\\n', '\\t'), ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    /**
     * Simple DOCX text extraction
     */
    private function parse_docx_simple($file_path) {
        // DOCX is a ZIP file containing XML
        $zip = new ZipArchive();
        $text = '';

        if ($zip->open($file_path) === true) {
            // Extract document.xml which contains the text
            $xml_content = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($xml_content) {
                // Parse XML and extract text
                $xml = simplexml_load_string($xml_content);

                if ($xml) {
                    // Remove namespaces for easier parsing
                    $xml_string = $xml->asXML();
                    $xml_string = preg_replace('/xmlns[^=]*="[^"]*"/i', '', $xml_string);
                    $xml = simplexml_load_string($xml_string);

                    // Extract text from <w:t> tags
                    $text_nodes = $xml->xpath('//w:t');
                    foreach ($text_nodes as $node) {
                        $text .= (string)$node . ' ';
                    }
                }
            }
        }

        return trim($text);
    }

    private function build_prompt($company, $position, $job_posting, $resume_text, $personal_notes) {
        $prompt = "You are a professional motivation letter writer. Generate THREE different versions of a motivation letter.\n\n";
        $prompt .= "**Job Details:**\n";
        $prompt .= "Company: {$company}\n";
        $prompt .= "Position: {$position}\n\n";
        $prompt .= "**Job Posting:**\n{$job_posting}\n\n";

        if (!empty($resume_text)) {
            $prompt .= "**Candidate's Resume:**\n{$resume_text}\n\n";
        }

        if (!empty($personal_notes)) {
            $prompt .= "**Personal Notes:**\n{$personal_notes}\n\n";
        }

        $prompt .= "**Instructions:**\n";
        $prompt .= "Generate 3 complete motivation letters with different tones:\n";
        $prompt .= "1. Professional: Formal, traditional business style\n";
        $prompt .= "2. Friendly: Warm and personable but professional\n";
        $prompt .= "3. Enthusiastic: Energetic and passionate\n\n";
        $prompt .= "Each letter should be 250-350 words.\n\n";
        $prompt .= "**Output Format (JSON only):**\n";
        $prompt .= '{"professional": {"content": "...", "tone": "Professional"}, "friendly": {"content": "...", "tone": "Friendly"}, "enthusiastic": {"content": "...", "tone": "Enthusiastic"}, "customizationTips": ["tip1", "tip2", "tip3"]}';

        return $prompt;
    }

    /**
     * Shortcode - Uses React Frontend
     */
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'max_width' => '1200px',
        ), $atts);

        $backend_url = get_option('mlw_backend_url');
        if (empty($backend_url)) {
            return '<div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; color: #991b1b;">
                <strong>Configuration Required:</strong> Please configure backend URL in Settings → Motivation Letter Writer
            </div>';
        }

        $container_id = 'mlw-app-' . uniqid();
        $api_url = rest_url('mlw/v1');
        $nonce = wp_create_nonce('wp_rest');

        ob_start();
        ?>
        <link rel="stylesheet" href="<?php echo esc_url(MLW_PLUGIN_URL . 'assets/widget.css'); ?>?ver=<?php echo MLW_VERSION; ?>">

        <script>
        // Set config before loading widget
        window.mlwConfig = {
            apiUrl: '<?php echo esc_js($api_url); ?>',
            nonce: '<?php echo esc_js($nonce); ?>'
        };
        </script>

        <script src="<?php echo esc_url(MLW_PLUGIN_URL . 'assets/widget.js'); ?>?ver=<?php echo MLW_VERSION; ?>&t=<?php echo time(); ?>"></script>

        <div id="<?php echo esc_attr($container_id); ?>" style="max-width: <?php echo esc_attr($atts['max_width']); ?>; width: <?php echo esc_attr($atts['width']); ?>; margin: 0 auto;"></div>

        <script>
        (function() {
            console.log('MLW Config:', window.mlwConfig);

            // Wait for React to load
            function initApp() {
                if (window.MotivationLetterApp && document.getElementById('<?php echo esc_js($container_id); ?>')) {
                    console.log('Mounting MLW app to:', '<?php echo esc_js($container_id); ?>');
                    window.MotivationLetterApp.mount('<?php echo esc_js($container_id); ?>');
                } else {
                    setTimeout(initApp, 100);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initApp);
            } else {
                initApp();
            }
        })();
        </script>
        <?php
        return ob_get_clean();
    }
}

// Initialize
add_action('plugins_loaded', array('Motivation_Letter_Writer', 'instance'));

// Activation
register_activation_hook(__FILE__, function() {
    add_option('mlw_backend_url', 'https://motivation-letter-writer-production.up.railway.app');
});

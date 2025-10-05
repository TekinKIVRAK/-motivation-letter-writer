<?php
/**
 * REST API Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class MLW_API {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        // Health check endpoint
        register_rest_route('mlw/v1', '/health', array(
            'methods' => 'GET',
            'callback' => array($this, 'health_check'),
            'permission_callback' => '__return_true',
        ));

        // Generate motivation letter endpoint
        register_rest_route('mlw/v1', '/letter/generate', array(
            'methods' => 'POST',
            'callback' => array($this, 'generate_letter'),
            'permission_callback' => '__return_true',
        ));
    }

    public function health_check($request) {
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Motivation Letter Writer API is running',
            'version' => MLW_VERSION,
        ), 200);
    }

    public function generate_letter($request) {
        try {
            // Get API key from settings
            $api_key = get_option('mlw_anthropic_api_key');
            if (empty($api_key)) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'API key not configured. Please configure it in plugin settings.',
                ), 400);
            }

            // Get form data
            $files = $request->get_file_params();
            $params = $request->get_params();

            $company = sanitize_text_field($params['company'] ?? '');
            $position = sanitize_text_field($params['position'] ?? '');
            $job_posting = sanitize_textarea_field($params['jobPosting'] ?? '');
            $personal_notes = sanitize_textarea_field($params['personalNotes'] ?? '');

            // Validate required fields
            if (empty($company) || empty($position) || empty($job_posting) || empty($personal_notes)) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Please fill in all required fields.',
                ), 400);
            }

            // Process resume if uploaded
            $resume_text = '';
            if (isset($files['resume']) && !empty($files['resume']['tmp_name'])) {
                $resume_text = $this->parse_resume($files['resume']);
            }

            // Generate letters using Anthropic API
            $result = $this->call_anthropic_api($api_key, array(
                'resumeText' => $resume_text,
                'company' => $company,
                'position' => $position,
                'jobPosting' => $job_posting,
                'personalNotes' => $personal_notes,
            ));

            return new WP_REST_Response(array(
                'success' => true,
                'data' => $result['data'],
                'metadata' => array(
                    'company' => $company,
                    'position' => $position,
                ),
            ), 200);

        } catch (Exception $e) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => $e->getMessage(),
            ), 500);
        }
    }

    private function parse_resume($file) {
        $file_type = $file['type'];
        $file_path = $file['tmp_name'];

        // Check file type
        $allowed_types = array(
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        );

        if (!in_array($file_type, $allowed_types)) {
            throw new Exception('Invalid file type. Please upload PDF or Word document.');
        }

        // Check file size
        $max_size = get_option('mlw_max_file_size', 10485760);
        if ($file['size'] > $max_size) {
            $max_mb = round($max_size / 1024 / 1024);
            throw new Exception("File is too large. Maximum size is {$max_mb}MB.");
        }

        // Parse file based on type
        if ($file_type === 'application/pdf') {
            return $this->parse_pdf($file_path);
        } else {
            return $this->parse_docx($file_path);
        }
    }

    private function parse_pdf($file_path) {
        // Use pdftotext if available, otherwise return message
        if (function_exists('exec')) {
            $output = array();
            exec("pdftotext " . escapeshellarg($file_path) . " -", $output);
            $text = implode("\n", $output);

            if (!empty($text)) {
                return $text;
            }
        }

        // Fallback: Read raw PDF text (limited functionality)
        $content = file_get_contents($file_path);
        $text = preg_replace('/[^a-zA-Z0-9\s\.\,\-\:\;\!\?\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\|\\\<>\~`]/', '', $text);

        if (empty($text) || strlen($text) < 100) {
            throw new Exception('Unable to read PDF. Please try a Word document instead.');
        }

        return $text;
    }

    private function parse_docx($file_path) {
        // For DOCX parsing, we'll use a simple ZIP extraction
        $zip = new ZipArchive();
        if ($zip->open($file_path) === TRUE) {
            $xml = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($xml) {
                // Remove XML tags
                $text = strip_tags($xml);
                return $text;
            }
        }

        throw new Exception('Unable to read Word document.');
    }

    private function call_anthropic_api($api_key, $data) {
        $resume_context = !empty($data['resumeText'])
            ? "**Resume/CV Content:**\n{$data['resumeText']}\n\n"
            : "**No resume provided**\n\n";

        $prompt = "You are a professional motivation letter (cover letter) writer. Generate THREE different versions of a motivation letter based on the information provided below.\n\n" .
            "{$resume_context}" .
            "**Job Information:**\n" .
            "Company: {$data['company']}\n" .
            "Position: {$data['position']}\n\n" .
            "**Job Posting/Description:**\n{$data['jobPosting']}\n\n" .
            "**Applicant's Personal Notes:**\n{$data['personalNotes']}\n\n" .
            "**Instructions:**\n" .
            "1. Generate 3 complete motivation letters with different tones:\n" .
            "   - Professional: Formal, traditional business style\n" .
            "   - Friendly: Warm and personable but still professional\n" .
            "   - Enthusiastic: Energetic and passionate\n\n" .
            "2. Each letter should:\n" .
            "   - Be 250-400 words\n" .
            "   - Include proper greeting and closing\n" .
            "   - Highlight relevant skills from resume (if provided)\n" .
            "   - Address key requirements from job posting\n" .
            "   - Incorporate personal notes naturally\n" .
            "   - Be compelling and unique\n\n" .
            "3. Also provide 3 customization tips\n\n" .
            "Please provide your response in this EXACT JSON format (but on ONE line):\n" .
            '{{"professional":{{"content":"...","tone":"Professional"}},"friendly":{{"content":"...","tone":"Friendly"}},"enthusiastic":{{"content":"...","tone":"Enthusiastic"}},"customizationTips":["Tip 1...","Tip 2...","Tip 3..."]}}';

        $response = wp_remote_post('https://api.anthropic.com/v1/messages', array(
            'timeout' => 60,
            'headers' => array(
                'Content-Type' => 'application/json',
                'x-api-key' => $api_key,
                'anthropic-version' => '2023-06-01',
            ),
            'body' => json_encode(array(
                'model' => 'claude-3-haiku-20240307',
                'max_tokens' => 4000,
                'messages' => array(
                    array(
                        'role' => 'user',
                        'content' => $prompt,
                    ),
                ),
            )),
        ));

        if (is_wp_error($response)) {
            throw new Exception('Failed to connect to AI service: ' . $response->get_error_message());
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (!isset($body['content'][0]['text'])) {
            throw new Exception('Invalid response from AI service');
        }

        $ai_response = $body['content'][0]['text'];

        // Try to extract JSON
        if (preg_match('/\{.*\}/s', $ai_response, $matches)) {
            $json_data = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return array('data' => $json_data);
            }
        }

        throw new Exception('Failed to parse AI response');
    }
}

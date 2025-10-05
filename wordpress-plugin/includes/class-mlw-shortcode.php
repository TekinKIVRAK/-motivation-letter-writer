<?php
/**
 * Shortcode Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class MLW_Shortcode {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_shortcode('motivation_letter_writer', array($this, 'render_shortcode'));
    }

    public function render_shortcode($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(array(
            'width' => '100%',
            'max_width' => '1200px',
        ), $atts);

        // Check if API key is configured
        $api_key = get_option('mlw_anthropic_api_key');
        if (empty($api_key)) {
            return $this->render_error_message(
                'Configuration Required',
                'The Motivation Letter Writer plugin needs to be configured. Please add your Anthropic API key in the plugin settings.'
            );
        }

        // Generate unique ID for this instance
        $instance_id = 'mlw-app-' . uniqid();

        // Build container with inline styles
        $style = sprintf(
            'width: %s; max-width: %s; margin: 0 auto;',
            esc_attr($atts['width']),
            esc_attr($atts['max_width'])
        );

        ob_start();
        ?>
        <div id="<?php echo esc_attr($instance_id); ?>" class="mlw-container" style="<?php echo $style; ?>">
            <div id="mlw-root">
                <!-- React app will mount here -->
                <div class="mlw-loading">
                    <div style="text-align: center; padding: 40px;">
                        <div style="
                            border: 3px solid #f3f4f6;
                            border-top: 3px solid #2563eb;
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 16px;
                        "></div>
                        <p style="color: #6b7280;">Loading Motivation Letter Writer...</p>
                    </div>
                </div>
            </div>
        </div>

        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <?php
        return ob_get_clean();
    }

    private function render_error_message($title, $message) {
        ob_start();
        ?>
        <div class="mlw-error" style="
            background-color: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
        ">
            <div style="display: flex; align-items: start;">
                <svg style="
                    width: 24px;
                    height: 24px;
                    color: #dc2626;
                    flex-shrink: 0;
                    margin-right: 12px;
                " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 style="
                        margin: 0 0 8px 0;
                        font-size: 16px;
                        font-weight: 600;
                        color: #991b1b;
                    "><?php echo esc_html($title); ?></h3>
                    <p style="
                        margin: 0;
                        font-size: 14px;
                        color: #991b1b;
                    "><?php echo esc_html($message); ?></p>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

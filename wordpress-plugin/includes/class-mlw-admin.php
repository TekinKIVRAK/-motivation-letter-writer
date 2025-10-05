<?php
/**
 * Admin Settings Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class MLW_Admin {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function add_admin_menu() {
        add_options_page(
            'Motivation Letter Writer Settings',
            'Motivation Letter Writer',
            'manage_options',
            'motivation-letter-writer',
            array($this, 'render_settings_page')
        );
    }

    public function register_settings() {
        register_setting('mlw_settings', 'mlw_anthropic_api_key', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        register_setting('mlw_settings', 'mlw_max_file_size', array(
            'type' => 'integer',
            'default' => 10485760,
            'sanitize_callback' => 'absint',
        ));

        add_settings_section(
            'mlw_api_section',
            'API Configuration',
            array($this, 'render_api_section'),
            'mlw_settings'
        );

        add_settings_field(
            'mlw_anthropic_api_key',
            'Anthropic API Key',
            array($this, 'render_api_key_field'),
            'mlw_settings',
            'mlw_api_section'
        );

        add_settings_section(
            'mlw_general_section',
            'General Settings',
            array($this, 'render_general_section'),
            'mlw_settings'
        );

        add_settings_field(
            'mlw_max_file_size',
            'Maximum File Size',
            array($this, 'render_max_file_size_field'),
            'mlw_settings',
            'mlw_general_section'
        );
    }

    public function render_api_section() {
        echo '<p>Configure your Anthropic Claude AI API key to enable the motivation letter generator.</p>';
        echo '<p>Get your API key from: <a href="https://console.anthropic.com/" target="_blank">https://console.anthropic.com/</a></p>';
    }

    public function render_general_section() {
        echo '<p>Configure general plugin settings.</p>';
    }

    public function render_api_key_field() {
        $value = get_option('mlw_anthropic_api_key', '');
        $masked = !empty($value) ? substr($value, 0, 10) . '...' . substr($value, -4) : '';
        ?>
        <input
            type="password"
            id="mlw_anthropic_api_key"
            name="mlw_anthropic_api_key"
            value="<?php echo esc_attr($value); ?>"
            placeholder="sk-ant-..."
            class="regular-text"
            style="font-family: monospace;"
        />
        <?php if (!empty($masked)): ?>
            <p class="description">Current key: <?php echo esc_html($masked); ?></p>
        <?php endif; ?>
        <p class="description">
            Your Anthropic API key (starts with sk-ant-). Keep this secure and never share it.
        </p>
        <?php
    }

    public function render_max_file_size_field() {
        $value = get_option('mlw_max_file_size', 10485760);
        $mb = round($value / 1024 / 1024);
        ?>
        <select id="mlw_max_file_size" name="mlw_max_file_size">
            <option value="5242880" <?php selected($value, 5242880); ?>>5 MB</option>
            <option value="10485760" <?php selected($value, 10485760); ?>>10 MB</option>
            <option value="15728640" <?php selected($value, 15728640); ?>>15 MB</option>
            <option value="20971520" <?php selected($value, 20971520); ?>>20 MB</option>
        </select>
        <p class="description">
            Maximum allowed size for resume file uploads. Current: <?php echo esc_html($mb); ?> MB
        </p>
        <?php
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        // Check if settings were saved
        if (isset($_GET['settings-updated'])) {
            add_settings_error(
                'mlw_messages',
                'mlw_message',
                'Settings saved successfully!',
                'updated'
            );
        }

        settings_errors('mlw_messages');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <div style="background: #fff; border: 1px solid #ccd0d4; border-radius: 4px; padding: 20px; margin: 20px 0;">
                <h2 style="margin-top: 0;">📝 How to Use</h2>
                <ol>
                    <li><strong>Configure API Key:</strong> Add your Anthropic API key below</li>
                    <li><strong>Add to Pages:</strong> Use the shortcode <code>[motivation_letter_writer]</code> in any page or post</li>
                    <li><strong>Customize:</strong> You can add attributes like <code>[motivation_letter_writer max_width="800px"]</code></li>
                </ol>

                <h3>Shortcode Examples:</h3>
                <pre style="background: #f6f7f7; padding: 10px; border-radius: 4px;"><code>[motivation_letter_writer]</code></pre>
                <pre style="background: #f6f7f7; padding: 10px; border-radius: 4px;"><code>[motivation_letter_writer max_width="900px"]</code></pre>
                <pre style="background: #f6f7f7; padding: 10px; border-radius: 4px;"><code>[motivation_letter_writer width="90%"]</code></pre>
            </div>

            <form action="options.php" method="post">
                <?php
                settings_fields('mlw_settings');
                do_settings_sections('mlw_settings');
                submit_button('Save Settings');
                ?>
            </form>

            <div style="background: #e7f3ff; border-left: 4px solid #2271b1; padding: 12px 20px; margin: 20px 0;">
                <h3 style="margin-top: 0;">ℹ️ Plugin Information</h3>
                <p><strong>Version:</strong> <?php echo esc_html(MLW_VERSION); ?></p>
                <p><strong>API Endpoint:</strong> <code><?php echo esc_url(rest_url('mlw/v1')); ?></code></p>
                <p><strong>Health Check:</strong> <a href="<?php echo esc_url(rest_url('mlw/v1/health')); ?>" target="_blank">Test API</a></p>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 20px; margin: 20px 0;">
                <h3 style="margin-top: 0;">⚠️ Important Notes</h3>
                <ul>
                    <li>This plugin uses the Anthropic Claude AI API which requires credits</li>
                    <li>Each letter generation costs approximately 0.5-2 cents depending on complexity</li>
                    <li>Monitor your API usage at <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a></li>
                    <li>Keep your API key secure - never share it publicly</li>
                </ul>
            </div>
        </div>
        <?php
    }
}

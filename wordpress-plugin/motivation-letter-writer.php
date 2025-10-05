<?php
/**
 * Plugin Name: Motivation Letter Writer AI
 * Plugin URI: https://mindtrellis.com
 * Description: AI-powered motivation letter generator using Claude AI. Generate professional, friendly, and enthusiastic letters instantly.
 * Version: 1.0.0
 * Author: MindTrellis
 * Author URI: https://mindtrellis.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: motivation-letter-writer
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MLW_VERSION', '1.0.0');
define('MLW_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MLW_PLUGIN_URL', plugin_dir_url(__FILE__));
define('MLW_PLUGIN_FILE', __FILE__);

// Load required files
require_once MLW_PLUGIN_DIR . 'includes/class-mlw-api.php';
require_once MLW_PLUGIN_DIR . 'includes/class-mlw-shortcode.php';
require_once MLW_PLUGIN_DIR . 'includes/class-mlw-admin.php';

/**
 * Main Plugin Class
 */
class Motivation_Letter_Writer {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));

        // Initialize components
        MLW_API::get_instance();
        MLW_Shortcode::get_instance();
        MLW_Admin::get_instance();
    }

    public function load_textdomain() {
        load_plugin_textdomain(
            'motivation-letter-writer',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
    }

    public function enqueue_frontend_scripts() {
        // Enqueue React app (built files)
        wp_enqueue_style(
            'mlw-widget-style',
            MLW_PLUGIN_URL . 'assets/dist/widget.css',
            array(),
            MLW_VERSION
        );

        wp_enqueue_script(
            'mlw-widget-script',
            MLW_PLUGIN_URL . 'assets/dist/widget.js',
            array(),
            MLW_VERSION,
            true
        );

        // Pass API endpoint to frontend
        wp_localize_script('mlw-widget-script', 'mlwConfig', array(
            'apiUrl' => rest_url('mlw/v1'),
            'nonce' => wp_create_nonce('wp_rest'),
        ));
    }

    public function enqueue_admin_scripts($hook) {
        // Only load on our admin page
        if ('settings_page_motivation-letter-writer' !== $hook) {
            return;
        }

        wp_enqueue_style(
            'mlw-admin-style',
            MLW_PLUGIN_URL . 'assets/admin/admin.css',
            array(),
            MLW_VERSION
        );

        wp_enqueue_script(
            'mlw-admin-script',
            MLW_PLUGIN_URL . 'assets/admin/admin.js',
            array('jquery'),
            MLW_VERSION,
            true
        );
    }
}

// Initialize plugin
function mlw_init() {
    return Motivation_Letter_Writer::get_instance();
}
add_action('plugins_loaded', 'mlw_init');

// Activation hook
register_activation_hook(__FILE__, 'mlw_activate');
function mlw_activate() {
    // Create options with default values
    add_option('mlw_anthropic_api_key', '');
    add_option('mlw_max_file_size', 10485760); // 10MB
    flush_rewrite_rules();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'mlw_deactivate');
function mlw_deactivate() {
    flush_rewrite_rules();
}

/**
 * Admin JavaScript for Motivation Letter Writer
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Copy shortcode to clipboard
        $('.mlw-copy-shortcode').on('click', function(e) {
            e.preventDefault();
            var shortcode = $(this).data('shortcode');
            copyToClipboard(shortcode);
            showNotification('Shortcode copied to clipboard!');
        });

        // Toggle API key visibility
        $('#mlw-toggle-api-key').on('click', function(e) {
            e.preventDefault();
            var $input = $('#mlw_anthropic_api_key');
            var type = $input.attr('type');

            if (type === 'password') {
                $input.attr('type', 'text');
                $(this).text('Hide');
            } else {
                $input.attr('type', 'password');
                $(this).text('Show');
            }
        });

        // Test API connection
        $('#mlw-test-api').on('click', function(e) {
            e.preventDefault();
            var $button = $(this);
            var apiKey = $('#mlw_anthropic_api_key').val();

            if (!apiKey) {
                alert('Please enter an API key first.');
                return;
            }

            $button.prop('disabled', true).text('Testing...');

            $.ajax({
                url: mlwConfig.apiUrl + '/health',
                type: 'GET',
                success: function(response) {
                    if (response.success) {
                        showNotification('API connection successful!', 'success');
                    } else {
                        showNotification('API connection failed.', 'error');
                    }
                },
                error: function() {
                    showNotification('Failed to connect to API.', 'error');
                },
                complete: function() {
                    $button.prop('disabled', false).text('Test Connection');
                }
            });
        });
    });

    function copyToClipboard(text) {
        var $temp = $('<input>');
        $('body').append($temp);
        $temp.val(text).select();
        document.execCommand('copy');
        $temp.remove();
    }

    function showNotification(message, type) {
        type = type || 'success';
        var $notice = $('<div class="notice notice-' + type + ' is-dismissible"><p>' + message + '</p></div>');

        $('.wrap h1').after($notice);

        setTimeout(function() {
            $notice.fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    }

})(jQuery);

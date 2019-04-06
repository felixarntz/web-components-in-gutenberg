<?php
/**
 * Plugin initialization file
 *
 * @package   Felix_Arntz\Web_Components_In_Gutenberg
 * @copyright 2019 Google LLC
 * @license   GNU General Public License, version 2
 *
 * @wordpress-plugin
 * Plugin Name: Web Components in Gutenberg
 * Plugin URI:  https://github.com/felixarntz/web-components-in-gutenberg
 * Description: Examples of using Web Components in Gutenberg.
 * Version:     1.0.0
 * Author:      Felix Arntz
 * Author URI:  https://felix-arntz.me
 * License:     GNU General Public License v2 (or later)
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: web-components-in-gutenberg
 */

namespace Felix_Arntz\Web_Components_In_Gutenberg;

/**
 * Registers custom element module scripts.
 *
 * @since 1.0.0
 */
function register_custom_elements() {
	$assets_dir  = plugin_dir_url( __FILE__ ) . 'assets/custom-elements/';

	$modules = array(
		'wcig-tab'                 => 'tab.js',
		'wcig-tab-panel'           => 'tab-panel.js',
		'wcig-tabs'                => 'tabs.js',
		'wcig-post-list-item'      => 'post-list-item.js',
		'wcig-post-list'           => 'post-list.js',
		'wcig-wordpress-post-list' => 'wordpress-post-list.js',
	);

	foreach ( $modules as $handle => $rel_path ) {
		wp_register_script( $handle, $assets_dir . $rel_path, array(), '1.0.0' );
		wp_script_add_data( $handle, 'type', 'module' );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\register_custom_elements' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\register_custom_elements' );

/**
 * Adds support for custom script types.
 *
 * @since 1.0.0
 *
 * @param string $tag    Script tag.
 * @param string $handle Script handle.
 * @return string Filtered $tag.
 */
function add_script_type_support( string $tag, string $handle ) : string {
	$type = wp_scripts()->get_data( $handle, 'type' );

	if ( ! empty( $type ) ) {
		$tag = str_replace( " type='text/javascript'", " type='{$type}'", $tag );
	}

	return $tag;
}
add_filter( 'script_loader_tag', __NAMESPACE__ . '\add_script_type_support', 10, 2 );

require_once plugin_dir_path( __FILE__ ) . '/inc/tabbed-admin-page.php';
require_once plugin_dir_path( __FILE__ ) . '/inc/gutenberg.php';

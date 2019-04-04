<?php
/**
 * Custom block types using Web Components
 *
 * @package   Felix_Arntz\Web_Components_In_Gutenberg
 * @copyright 2019 Google LLC
 * @license   GNU General Public License, version 2
 */

namespace Felix_Arntz\Web_Components_In_Gutenberg\Gutenberg;

/**
 * Enqueues assets for Gutenberg-created content for the frontend.
 *
 * @since 1.0.0
 */
function enqueue_block_assets() {
	$handle = 'wcig-gutenberg-custom-elements';
	$src    = plugin_dir_url( __DIR__ ) . 'assets/gutenberg-custom-elements.js';

	wp_enqueue_script( $handle, $src, array( 'wp-date' ), '1.0.0' );
	wp_script_add_data( $handle, 'type', 'module' );
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_assets' );

/**
 * Enqueues assets for the Gutenberg editor.
 *
 * @since 1.0.0
 */
function enqueue_block_editor_assets() {
	enqueue_block_assets();

	$handle = 'wcig-gutenberg-block-types';
	$src    = plugin_dir_url( __DIR__ ) . 'assets/gutenberg-block-types.js';

	wp_enqueue_script( $handle, $src, array( 'wcig-gutenberg-custom-elements' ), '1.0.0' );
	wp_script_add_data( $handle, 'type', 'module' );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets' );

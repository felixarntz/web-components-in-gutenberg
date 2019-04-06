<?php
/**
 * Tabbed admin page using Custom Elements
 *
 * @package   Felix_Arntz\Web_Components_In_Gutenberg
 * @copyright 2019 Google LLC
 * @license   GNU General Public License, version 2
 */

namespace Felix_Arntz\Web_Components_In_Gutenberg\Tabbed_Admin_Page;

/**
 * Registers the admin page.
 *
 * @since 1.0.0
 */
function register_page() {
	$hook_suffix = add_menu_page(
		__( 'Web Components', 'web-components-in-gutenberg' ),
		__( 'Web Components', 'web-components-in-gutenberg' ),
		'manage_options',
		'wcig-tabbed-admin-page',
		__NAMESPACE__ . '\render_page',
		'dashicons-index-card'
	);

	add_action(
		'admin_enqueue_scripts',
		function( $current_hook_suffix ) use ( $hook_suffix ) {
			if ( $current_hook_suffix !== $hook_suffix ) {
				return;
			}

			$handle = 'wcig-tabbed-admin-page';
			$src    = plugin_dir_url( __DIR__ ) . 'assets/tabbed-admin-page.js';

			// Enqueue the module registering custom elements for the admin page.
			wp_enqueue_script( $handle, $src, array(), '1.0.0' );
			wp_script_add_data( $handle, 'type', 'module' );
		}
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\register_page' );

/**
 * Renders the admin page.
 *
 * @since 1.0.0
 */
function render_page() {
	$tabs = array(
		'tab1' => array(
			'title'           => __( 'Introduction', 'web-components-in-gutenberg' ),
			'render_callback' => function() {
				?>
				<h2><?php esc_html_e( 'Introduction to Web Components', 'web-components-in-gutenberg' ); ?></h2>
				<h3><?php esc_html_e( 'Custom Elements', 'web-components-in-gutenberg' ); ?></h3>
				<p><?php esc_html_e( 'Custom elements give developers the ability to extend HTML and create their own tags. Because custom elements are standards based they benefit from the Web&apos;s built-in component model. The result is more modular code that can be reused in many different contexts.', 'web-components-in-gutenberg' ); ?></p>
				<h3><?php esc_html_e( 'Shadow DOM', 'web-components-in-gutenberg' ); ?></h3>
				<p><?php esc_html_e( 'Shadow DOM is a web standard that offers component style and markup encapsulation. It is a critically important piece of the Web Components story as it ensures that a component will work in any environment even if other CSS or JavaScript is at play on the page.', 'web-components-in-gutenberg' ); ?></p>
				<?php
			},
		),
		'tab2' => array(
			'title'           => __( 'Polymer', 'web-components-in-gutenberg' ),
			'render_callback' => function() {
				?>
				<h2><?php esc_html_e( 'Web Components and the Polymer Project', 'web-components-in-gutenberg' ); ?></h2>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/7CUO7PyD5zA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				<?php
			},
		),
		'tab3' => array(
			'title'           => __( 'PWA Starter Kit', 'web-components-in-gutenberg' ),
			'render_callback' => function() {
				?>
				<h2><?php esc_html_e( 'PWA starter kit: build fast, scalable, modern apps with Web Components', 'web-components-in-gutenberg' ); ?></h2>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/we3lLo-UFtk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				<?php
			},
		),
		'tab4' => array(
			'title'           => __( 'React & Web Components', 'web-components-in-gutenberg' ),
			'render_callback' => function() {
				?>
				<h2><?php esc_html_e( 'React vs Web Components?', 'web-components-in-gutenberg' ); ?></h2>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/plt-iH_47GE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				<?php
			},
		),
	);

	$current_tab_id = 'tab1';

	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Web Components', 'web-components-in-gutenberg' ); ?></h1>

		<wcig-tabs>
			<?php foreach ( $tabs as $tab_id => $tab_args ) : ?>
				<wcig-tab slot="tabs" href="<?php echo esc_attr( "#{$tab_id}" ); ?>"<?php echo $tab_id === $current_tab_id ? ' selected' : ''; ?>>
					<?php echo wp_kses_data( $tab_args['title'] ); ?>
				</wcig-tab>
				<wcig-tab-panel slot="tabpanels" id="<?php echo esc_attr( $tab_id ); ?>"<?php echo $tab_id === $current_tab_id ? ' active' : ''; ?>>
					<?php call_user_func( $tab_args['render_callback'] ); ?>
				</wcig-tab-panel>
			<?php endforeach; ?>
		</wcig-tabs>
	</div>
	<?php
}

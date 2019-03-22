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
		__( 'Custom Elements Tabs', 'web-components-in-gutenberg' ),
		__( 'Custom Elements', 'web-components-in-gutenberg' ),
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

			$modules = array(
				'wcig-tab',
				'wcig-tabs',
				'wcig-custom-elements',
			);
			foreach ( $modules as $module ) {
				wp_enqueue_script( $module );
			}
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
	/* translators: %d: tab ID */
	$tab_title = __( 'Tab %d', 'web-components-in-gutenberg' );

	/* translators: %d: tab ID */
	$tab_description = __( 'This is the content of <strong>tab %d</strong>.', 'web-components-in-gutenberg' );

	$tabs = array();
	for ( $i = 1; $i <= 4; $i++ ) {
		$tabs[ "tab{$i}" ] = array(
			'title'           => sprintf( $tab_title, $i ),
			'render_callback' => function() use ( $tab_title, $tab_description, $i ) {
				?>
				<h2><?php printf( $tab_title, $i ); ?></h2>
				<p><?php printf( $tab_description, $i ); ?></p>
				<?php
			}
		);
	}

	$current_tab_id = 'tab1';

	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Custom Elements Tabs', 'web-components-in-gutenberg' ); ?></h1>

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

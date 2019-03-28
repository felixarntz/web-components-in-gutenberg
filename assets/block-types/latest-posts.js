/*
 * Latest Posts block type module.
 *
 * Web Components in Gutenberg, Copyright 2019 Google LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

// Alternative to using JSX that doesn't require transpiling. See https://github.com/developit/htm
import htm from 'https://unpkg.com/htm?module';

const {
	createElement,
	Component,
	Fragment
} = wp.element;
const {
	PanelBody,
	QueryControls,
	RangeControl,
	ToggleControl,
	Toolbar
} = wp.components;
const {
	InspectorControls,
	BlockControls,
} = wp.editor;
const { apiFetch } = wp;
const { addQueryArgs } = wp.url;
const { __ } = wp.i18n;
const {
	dateI18n,
	format,
	__experimentalGetSettings
} = wp.date;

const html = htm.bind( createElement );

class LatestPostsEdit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			categoriesList: [],
		};
		this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );
	}

	componentDidMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( '/wp/v2/categories', { per_page: -1 } ),
		} ).then(
			( categoriesList ) => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList: [] } );
				}
			}
		);
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	toggleDisplayPostDate() {
		const { displayPostDate } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostDate: ! displayPostDate } );
	}

	render() {
		const { attributes, setAttributes } = this.props;
		const { categoriesList } = this.state;
		const { displayPostDate, postLayout, columns, order, orderBy, categories, postsToShow } = attributes;

		const inspectorControls = html`
			<${ InspectorControls }>
				<${ PanelBody } title=${ __( 'Latest Posts Settings', 'web-components-in-gutenberg' ) }>
					<${ QueryControls }
						{ ...${ order, orderBy } }
						numberOfItems=${ postsToShow }
						categoriesList=${ categoriesList }
						selectedCategoryId=${ categories }
						onOrderChange=${ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange=${ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange=${ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange=${ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					<${ ToggleControl }
						label=${ __( 'Display post date', 'web-components-in-gutenberg' ) }
						checked=${ displayPostDate }
						onChange=${ this.toggleDisplayPostDate }
					/>
					${ postLayout === 'grid' && html`
						<${ RangeControl }
							label=${ __( 'Columns', 'web-components-in-gutenberg' ) }
							value=${ columns }
							onChange=${ ( value ) => setAttributes( { columns: value } ) }
							min=${ 2 }
							max=${ 6 }
							required
						/>`
					}
				</${ PanelBody }>
			</${ InspectorControls }>
		`;

		const layoutControls = [
			{
				icon: 'list-view',
				title: __( 'List View' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid View' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
		];

		const dateFormat = __experimentalGetSettings().formats.date;

		return html`
			<${ Fragment }>
				${ inspectorControls }
				<${ BlockControls }>
					<${ Toolbar } controls=${ layoutControls } />
				</${ BlockControls }>
				<wcig-post-list
					date-format="${ dateFormat }"
					${ postLayout === 'grid' ? `columns="${ columns }"` : '' }
				>
					<wcig-post-list-item href="https://www.google.com">
						Post Title 1
						<time slot="extra" date-time="${ format( 'c', '2018-11-23' ) }">
							${ dateI18n( dateFormat, '2018-11-23' ) }
						</time>
					</wcig-post-list-item>
					<wcig-post-list-item href="https://www.google.com">
						Post Title 2
					</wcig-post-list-item>
				</wcig-post-list>
			</${ Fragment }>
		`;
	}
}


const name = 'wcig/latest-posts';

const settings = {
	title: __( 'Latest Posts (Web Components)', 'web-components-in-gutenberg' ),

	description: __( 'Display a list of your most recent posts.', 'web-components-in-gutenberg' ),

	icon: html`<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path d="M0,0h24v24H0V0z" fill="none" /><Rect x="11" y="7" width="6" height="2" /><Rect x="11" y="11" width="6" height="2" /><Rect x="11" y="15" width="6" height="2" /><Rect x="7" y="7" width="2" height="2" /><Rect x="7" y="11" width="2" height="2" /><Rect x="7" y="15" width="2" height="2" /><Path d="M20.1,3H3.9C3.4,3,3,3.4,3,3.9v16.2C3,20.5,3.4,21,3.9,21h16.2c0.4,0,0.9-0.5,0.9-0.9V3.9C21,3.4,20.5,3,20.1,3z M19,19H5V5h14V19z" /></SVG>`,

	category: 'widgets',

	keywords: [ __( 'recent posts', 'web-components-in-gutenberg' ) ],

	supports: {
		align: true,
		html: false,
	},

	attributes: {
		categories: {
			type: 'string',
		},
		postsToShow: {
			type: 'number',
			default: 5,
		},
		displayPostDate: {
			type: 'boolean',
			default: false,
		},
		postLayout: {
			type: 'string',
			default: 'list',
		},
		columns: {
			type: 'number',
			default: 3,
		},
		order: {
			type: 'string',
			default: 'desc',
		},
		orderBy: {
			type: 'string',
			default: 'date',
		}
	},

	edit: LatestPostsEdit,

	save: props => {
		return html`
			<wcig-post-list>
				<wcig-post-list-item href="https://www.google.com">
					Post Title 1
				</wcig-post-list-item>
				<wcig-post-list-item href="https://www.google.com">
					Post Title 2
				</wcig-post-list-item>
			</wcig-post-list>
		`;
	}
};

export default { name, settings };

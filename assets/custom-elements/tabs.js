/*
 * Tabs module.
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

const getSiblingTab = ( element, mode ) => {
	if ( 'next' !== mode ) {
		mode = 'previous';
	}

	while ( element[ `${ mode }ElementSibling` ] ) {
		if ( 'WCIG-TAB' === element[ `${ mode }ElementSibling` ].tagName && ! element[ `${ mode }ElementSibling` ].disabled ) {
			return element[ `${ mode }ElementSibling` ];
		}

		element = element[ `${ mode }ElementSibling` ];
	}

	return null;
};

const template = document.createElement( 'template' );
template.innerHTML = `
	<style>
		:host {
			display: block;
		}

		:host([hidden]) {
			display: none;
		}

		.tab-list {
			display: block;
			margin: 0;
			padding-top: 9px;
			padding-bottom: 0;
			border-bottom: 1px solid #ccc;
			line-height: inherit;
		}

		.tab-list:after {
			content: "";
			display: table;
			clear: both;
		}
	</style>

	<div class="tab-list" role="tablist">
		<slot name="tabs">
	</div>

	<slot name="tabpanels"></slot>
`;

class Tabs extends HTMLElement {
	constructor() {
		super();

		this.selectedTab = null;

		this._shadowRoot = this.attachShadow( { mode: 'open' } );
		this._shadowRoot.appendChild( template.content.cloneNode( true ) );
	}

	static get is() {
		return 'wcig-tabs';
	}

	connectedCallback() {
		if ( ! this.hasAttribute( 'role' ) ) {
			this.setAttribute( 'role', 'tabpanel' );
		}

		Array.from( this.querySelectorAll( 'wcig-tab' ) ).forEach( tab => {
			if ( ! tab.href || '#' !== tab.href.substr( 0, 1 ) ) {
				return;
			}

			const panel = this.querySelector( tab.href );
			if ( ! panel ) {
				return;
			}

			if ( ! tab.id ) {
				tab.id = `${ panel.id }-tab`;
			}

			if ( ! tab.hasAttribute( 'aria-controls' ) ) {
				tab.setAttribute( 'aria-controls', panel.id );
			}
			if ( ! panel.hasAttribute( 'aria-labelledby' ) ) {
				panel.setAttribute( 'aria-labelledby', tab.id );
			}
		} );

		this.addEventListener( 'select', this._onSelect );
		this.addEventListener( 'keyup', this._onKeyUp );
	}

	disconnectedCallback() {
		this.removeEventListener( 'select', this._onSelect );
		this.removeEventListener( 'keyup', this._onKeyUp );
	}

	_onSelect( event ) {
		const target = event.target;

		if ( 'WCIG-TAB' !== target.tagName ) {
			return;
		}

		Array.from( this.querySelectorAll( 'wcig-tab' ) ).forEach( tab => {
			if ( tab.href && '#' === tab.href.substr( 0, 1 ) ) {
				const tabpanel = this.querySelector( tab.href );
				if ( tabpanel ) {
					tabpanel.active = tab === target;
				}
			}

			if ( tab !== target ) {
				tab.selected = false;
			}
		} );

		this.selectedTab = target;

		this._dispatchChangeEvent();
	}

	_onKeyUp( event ) {
		const target  = event.target;
		const keycode = event.key || event.code;

		if ( 'WCIG-TAB' !== target.tagName ) {
			return;
		}

		if ( 'ArrowRight' === keycode ) {
			const next = getSiblingTab( target, 'next' );
			if ( next ) {
				next.click();
				next.focus();
			}
		} else if ( 'ArrowLeft' === keycode ) {
			const previous = getSiblingTab( target, 'previous' );
			if ( previous ) {
				previous.click();
				previous.focus();
			}
		}
	}

	_dispatchChangeEvent() {
		this.dispatchEvent(
			new CustomEvent(
				'change',
				{
					detail: {
						selectedTab: this.getSelectedTab()
					},
					bubbles: true
				}
			)
		);
	}

	getSelectedTab() {
		return this.selectedTab;
	}
}

export default Tabs;

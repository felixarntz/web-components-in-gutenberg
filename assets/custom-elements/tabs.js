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

class Tabs extends HTMLElement {
	constructor() {
		super();

		this.selectedTab = null;

		this._shadowRoot = this.attachShadow( { mode: 'open' } );
		this._shadowRoot.innerHTML = `
			<wcig-tab-list>
				<slot name="tabs">
			</wcig-tab-list>

			<slot name="tabpanels"></slot>
		`;
	}

	static is() {
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

			tab.setAttribute( 'aria-controls', panel.id );
			panel.setAttribute( 'aria-labelledby', tab.id );
		} );

		this.addEventListener( 'select', this._onSelect );
	}

	disconnectedCallback() {
		this.removeEventListener( 'select', this._onSelect );
	}

	_onSelect( event ) {
		if ( this.disabled || this.selected ) {
			return;
		}

		const target = event.target;

		if ( 'WCIG-TAB' !== target.tagName ) {
			return;
		}

		Array.from( this.querySelectorAll( 'wcig-tab' ) ).forEach( tab => {
			let tabpanel;
			if ( tab.href && '#' === tab.href.substr( 0, 1 ) ) {
				tabpanel = this.querySelector( tab.href );
			}

			if ( tab === target ) {
				tabpanel.active = true;
				return;
			}

			tab.selected    = false;
			tabpanel.active = false;
		} );

		this.selectedTab = target;

		this._dispatchChangeEvent();
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

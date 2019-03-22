/*
 * TabList module.
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

class TabList extends HTMLElement {
	constructor() {
		super();

		this.selectedTab = null;

		this._shadowRoot = this.attachShadow( { mode: 'open' } );
		this._shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					margin: 0;
					padding-top: 9px;
					padding-bottom: 0;
					border-bottom: 1px solid #ccc;
					line-height: inherit;
				}

				:host([hidden]) {
					display: none;
				}

				:host:after {
					content: "";
					display: table;
					clear: both;
				}
			</style>

			<slot></slot>
		`;
	}

	static is() {
		return 'wcig-tab-list';
	}

	connectedCallback() {
		if ( ! this.hasAttribute( 'role' ) ) {
			this.setAttribute( 'role', 'tablist' );
		}

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
			if ( tab === target ) {
				return;
			}

			tab.selected = false;
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

export default TabList;

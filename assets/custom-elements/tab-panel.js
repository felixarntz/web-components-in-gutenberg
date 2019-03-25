/*
 * TabPanel module.
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

const template = document.createElement( 'template' );
template.innerHTML = `
	<style>
		:host {
			display: none;
			padding-top: 9px;
		}

		:host([active]) {
			display: block;
		}

		:host([hidden]),
		:host([active][hidden]) {
			display: none;
		}

		:host(:focus),
		:host(:hover) {
			outline: none;
		}
	</style>

	<slot></slot>
`;

class TabPanel extends HTMLElement {
	constructor() {
		super();

		this._shadowRoot = this.attachShadow( { mode: 'open' } );
		this._shadowRoot.appendChild( template.content.cloneNode( true ) );
	}

	static get is() {
		return 'wcig-tab-panel';
	}

	static get observedAttributes() {
		return [ 'active' ];
	}

	attributeChangedCallback( name, oldValue, newValue ) {
		const hasValue = null !== newValue;

		switch ( name ) {
			case 'active':
				this.setAttribute( 'tabindex', hasValue ? 0 : -1 );
				this.setAttribute( 'aria-hidden', hasValue ? 'false' : 'true' );
				if ( hasValue ) {
					this.removeAttribute( 'hidden' );
				} else {
					this.setAttribute( 'hidden', '' );
				}
				break;
		}
	}

	connectedCallback() {
		if ( ! this.hasAttribute( 'role' ) ) {
			this.setAttribute( 'role', 'tabpanel' );
		}

		const isActive = this.hasAttribute( 'active' );

		this.setAttribute( 'tabindex', isActive ? 0 : -1 );
		this.setAttribute( 'aria-hidden', isActive ? 'false' : 'true' );
		if ( isActive ) {
			this.removeAttribute( 'hidden' );
		} else {
			this.setAttribute( 'hidden', '' );
		}
	}

	get id() {
		return this.getAttribute( 'id' );
	}

	set id( val ) {
		if ( null !== val ) {
			this.setAttribute( 'id', val );
		} else {
			this.removeAttribute( 'id' );
		}
	}

	get active() {
		return this.hasAttribute( 'active' );
	}

	set active( val ) {
		const isSelected = Boolean( val );

		if ( isSelected ) {
			this.setAttribute( 'active', '' );
		} else {
			this.removeAttribute( 'active' );
		}
	}
}

export default TabPanel;

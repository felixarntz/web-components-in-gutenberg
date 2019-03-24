/*
 * Tab module.
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
			display: block;
			float: left;
			margin-left: .5em;
			padding: 5px 10px;
			font-size: 14px;
			line-height: 24px;
			font-weight: 600;
			text-decoration: none;
			white-space: nowrap;
			background: #e5e5e5;
			color: #555;
			border: 1px solid #ccc;
			border-bottom: none;
			cursor: pointer;
		}

		:host([hidden]) {
			display: none;
		}

		:host(:disabled) {
			cursor: not-allowed;
		}

		:host(:focus),
		:host(:hover) {
			outline: none;
			background-color: #fff;
			color: #444;
		}

		:host([selected]),
		:host([selected]:focus),
		:host([selected]:focus:active),
		:host([selected]:hover) {
			margin-bottom: -1px;
			background: #f1f1f1;
			color: #000;
			border-bottom: 1px solid #f1f1f1;
		}
	</style>

	<slot></slot>
`;

class Tab extends HTMLElement {
	constructor() {
		super();

		this._shadowRoot = this.attachShadow( { mode: 'open' } );
		this._shadowRoot.appendChild( template.content.cloneNode( true ) );
	}

	static is() {
		return 'wcig-tab';
	}

	static get observedAttributes() {
		return [ 'selected', 'disabled' ];
	}

	attributeChangedCallback( name, oldValue, newValue ) {
		const hasValue = null !== newValue;

		switch ( name ) {
			case 'selected':
				this.setAttribute( 'tabindex', hasValue ? 0 : -1 );
				this.setAttribute( 'aria-selected', hasValue ? 'true' : 'false' );
				break;
			case 'disabled':
				this.setAttribute( 'aria-disabled', hasValue ? 'true' : 'false' );
				if ( hasValue || ! this.selected ) {
					this.removeAttribute( 'tabindex' );
					this.blur();
				} else {
					this.setAttribute( 'tabindex', 0 );
				}
				break;
		}
	}

	connectedCallback() {
		if ( ! this.hasAttribute( 'role' ) ) {
			this.setAttribute( 'role', 'tab' );
		}

		const isSelected = this.hasAttribute( 'selected' );

		this.setAttribute( 'tabindex', isSelected ? 0 : -1 );
		this.setAttribute( 'aria-selected', isSelected ? 'true' : 'false' );

		this.addEventListener( 'click', this._onClick );
	}

	disconnectedCallback() {
		this.removeEventListener( 'click', this._onClick );
	}

	_onClick() {
		if ( this.disabled || this.selected ) {
			return;
		}

		if ( this.href && '#' === this.href.substr( 0, 1 ) ) {
			history.replaceState( undefined, undefined, this.href );
		}

		this.selected = true;

		this._dispatchSelectEvent();
	}

	_dispatchSelectEvent() {
		this.dispatchEvent(
			new CustomEvent(
				'select',
				{
					bubbles: true
				}
			)
		);
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

	get href() {
		return this.getAttribute( 'href' );
	}

	set href( val ) {
		if ( null !== val ) {
			this.setAttribute( 'href', val );
		} else {
			this.removeAttribute( 'href' );
		}
	}

	get selected() {
		return this.hasAttribute( 'selected' );
	}

	set selected( val ) {
		const isSelected = Boolean( val );

		if ( isSelected ) {
			this.setAttribute( 'selected', '' );
		} else {
			this.removeAttribute( 'selected' );
		}
	}

	get disabled() {
		return this.hasAttribute( 'disabled' );
	}

	set disabled( val ) {
		const isSelected = Boolean( val );

		if ( isSelected ) {
			this.setAttribute( 'disabled', '' );
		} else {
			this.removeAttribute( 'disabled' );
		}
	}
}

export default Tab;

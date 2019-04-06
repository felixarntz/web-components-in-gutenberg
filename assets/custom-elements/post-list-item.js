/*
 * PostListItem custom element module.
 *
 * This custom element represents a post in a PostList. It can include a
 * title (in the default slot), an extra annotation (for example that
 * could be the post date), and a link (via the href attribute). The
 * element is not tied to WordPress in any way.
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
			display: list-item;
			color: var(--text-color, #111);
			font-family: var(--text-font, Roboto, sans-serif);
		}

		:host([hidden]) {
			display: none;
		}

		a {
			color: var(--link-color, #0073aa);
		}

		a:hover,
		a:focus {
			color: var(--link-focus-color, #124964);
		}

		a:focus {
			outline: thin dotted;
		}

		:host ::slotted(time) {
			display: block;
			color: var(--text-light-color, #6c7781);
			font-size: 13px;
		}
	</style>

	<slot></slot>
	<slot name="extra"></slot>
`;

class PostListItem extends HTMLElement {
	constructor() {
		super();

		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.appendChild( template.content.cloneNode( true ) );
	}

	static get is() {
		return 'wcig-post-list-item';
	}

	static get observedAttributes() {
		return [ 'href' ];
	}

	attributeChangedCallback( name, oldValue, newValue ) {
		switch ( name ) {
			case 'href':
				if ( null !== newValue && null !== oldValue ) {
					const a = this.shadowRoot.querySelector( 'a' );

					a.setAttribute( 'href', newValue );
				} else if ( null !== newValue ) {
					const title = this.shadowRoot.querySelector( 'slot' );
					const extra = this.shadowRoot.querySelector( 'slot[name="extra"]' );
					const a     = document.createElement( 'a' );

					a.setAttribute( 'href', newValue );
					a.appendChild( title );
					this.shadowRoot.insertBefore( a, extra );
				} else {
					const title = this.shadowRoot.querySelector( 'slot' );
					const extra = this.shadowRoot.querySelector( 'slot[name="extra"]' );
					const a     = this.shadowRoot.querySelector( 'a' );

					this.shadowRoot.insertBefore( title, extra );
					this.shadowRoot.removeChild( a );
				}
				break;
		}
	}

	connectedCallback() {
		if ( ! this.hasAttribute( 'role' ) ) {
			this.setAttribute( 'role', 'listitem' );
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
}

export default PostListItem;

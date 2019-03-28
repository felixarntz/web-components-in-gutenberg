/*
 * PostList custom element module.
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
			padding-left: 2.5em;
			list-style: disc;
		}

		:host([hidden]) {
			display: none;
		}

		:host([columns]) {
			display: flex;
			flex-wrap: wrap;
			padding: 0;
			list-style: none;
		}

		:host([columns]) ::slotted(wcig-post-list-item) {
			margin: 0 16px 16px 0;
			width: 100%;
		}

		:host([columns="2"]) ::slotted(wcig-post-list-item) {
			width: calc(50% - 16px);
		}

		:host([columns="3"]) ::slotted(wcig-post-list-item) {
			width: calc(33.33333% - 16px);
		}

		:host([columns="4"]) ::slotted(wcig-post-list-item) {
			width: calc(25% - 16px);
		}

		:host([columns="5"]) ::slotted(wcig-post-list-item) {
			width: calc(20% - 16px);
		}

		:host([columns="6"]) ::slotted(wcig-post-list-item) {
			width: calc(16.66667% - 16px);
		}
	</style>

	<slot></slot>
`;

class PostList extends HTMLElement {
	constructor() {
		super();

		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.appendChild( template.content.cloneNode( true ) );
	}

	static get is() {
		return 'wcig-post-list';
	}

	connectedCallback() {
		if ( ! this.hasAttribute( 'role' ) ) {
			this.setAttribute( 'role', 'list' );
		}
	}

	get columns() {
		return this.getAttribute( 'columns' );
	}

	set columns( val ) {
		if ( null !== val ) {
			this.setAttribute( 'columns', val );
		} else {
			this.removeAttribute( 'columns' );
		}
	}
}

export default PostList;

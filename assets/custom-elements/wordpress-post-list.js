/*
 * WordPressPostList custom element module.
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

import PostList from './post-list.js';

const format = ( dateFormat, date ) => {
	if ( ! wp || ! wp.date ) {
		return date;
	}

	if ( 'c' === dateFormat ) {
		return wp.date.format( 'c', date );
	}

	return wp.date.dateI18n( dateFormat, date );
};

const getPostListItem = ( post, dateFormat ) => {
	const item = document.createElement( 'wcig-post-list-item' );

	if ( post.url ) {
		item.setAttribute( 'href', post.url );
	}

	item.innerHTML = post.title.rendered;

	if ( dateFormat ) {
		const time = document.createElement( 'time' );

		time.setAttribute( 'slot', 'extra' );
		time.setAttribute( 'date-time', format( 'c', post.date_gmt ) );
		time.innerHTML = format( dateFormat, post.date_gmt );

		item.appendChild( time );
	}

	return item;
};

const loaderTemplate = document.createElement( 'template' );
loaderTemplate.innerHTML = `
	<p class="loader">Loading...</p>
`;

class WordPressPostList extends PostList {
	constructor() {
		super();

		this._loading = true;
	}

	static get is() {
		return 'wcig-wordpress-post-list';
	}

	connectedCallback() {
		this.shadowRoot.appendChild( loaderTemplate.content.cloneNode( true ) );
	}

	updateContent( posts ) {
		if ( ! posts || ! posts.length ) {
			if ( ! this.shadowRoot.querySelector( '.loader' ) ) {
				this.innerHTML = '';
				this.shadowRoot.appendChild( loaderTemplate.content.cloneNode( true ) );
			}
			return;
		}

		const dateFormat = wp.date && wp.date.__experimentalGetSettings ? wp.date.__experimentalGetSettings().formats.date : 'F m, Y';

		this.innerHTML = '';

		posts.forEach( post => {
			this.appendChild( getPostListItem( post, dateFormat ) );
		} );
	}
}

export default WordPressPostList;

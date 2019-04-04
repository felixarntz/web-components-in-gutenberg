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

const restRoot = ( () => {
	if ( window.wpRestRoot ) {
		return window.wpRestRoot;
	}

	const apiLink = document.querySelector( 'link[rel="https://api.w.org/"]' );
	if ( apiLink ) {
		return apiLink.getAttribute( 'href' );
	}

	return document.location.origin + '/wp-json/';
} )();

const formatDate = ( dateFormat, date ) => {
	if ( ! window.wp || ! window.wp.date ) {
		return date;
	}

	if ( 'c' === dateFormat ) {
		return window.wp.date.format( 'c', date );
	}

	return window.wp.date.dateI18n( dateFormat, date );
};

const getPostListItem = ( post, dateFormat ) => {
	const item = document.createElement( 'wcig-post-list-item' );

	if ( post.link ) {
		item.setAttribute( 'href', post.link );
	}

	item.innerHTML = post.title.rendered;

	if ( dateFormat ) {
		const time = document.createElement( 'time' );

		time.setAttribute( 'slot', 'extra' );
		time.setAttribute( 'date-time', formatDate( 'c', post.date_gmt ) );
		time.innerHTML = formatDate( dateFormat, post.date_gmt );

		item.appendChild( time );
	}

	return item;
};

// Modified version of the fetch function which allows delaying the request.
const fetch = ( ...args ) => {
	const context = this;

	if ( ! args[1] || ! args[1].delay ) {
		return window.fetch.apply( context, args );
	}

	const delay = args[1].delay;

	return new Promise( ( resolve, reject ) => {
		let timer = setTimeout( async () => {
			timer = 0;

			try {
				resolve( await window.fetch.apply( context, args ) );
			} catch ( err ) {
				reject( err );
			}
		}, delay );

		if ( args[1] && args[1].signal ) {
			args[1].signal.addEventListener( 'abort', () => {
				if ( timer ) {
					clearTimeout( timer );
					timer = 0;
					// Use 'DOMException' since this is the default fetch rejection on abort too.
					reject( 'DOMException' );
				}
			});
		}
	} );
};

const loaderTemplate = document.createElement( 'template' );
loaderTemplate.innerHTML = `
	<span class="loader">Loading...</span>
`;

class WordPressPostList extends PostList {
	constructor() {
		super();

		this._loading    = false;
		this._controller = undefined;
		this._posts      = [];
	}

	static get is() {
		return 'wcig-wordpress-post-list';
	}

	static get observedAttributes() {
		return [ 'display-date', 'order', 'orderby', 'categories', 'number' ];
	}

	attributeChangedCallback( name, oldValue, newValue ) {
		switch ( name ) {
			case 'display-date':
				this.updateContent();
				break;
			case 'order':
			case 'orderby':
			case 'categories':
			case 'number':
				this.queryPosts();
				break;
		}
	}

	connectedCallback() {
		super.connectedCallback();

		this.queryPosts();
	}

	async queryPosts() {
		let url = restRoot + `wp/v2/posts?per_page=${ this.getAttribute( 'number' ) || 10 }`;
		if ( this.hasAttribute( 'categories' ) ) {
			url += `&categories=${ this.getAttribute( 'categories' ) }`;
		}
		if ( this.hasAttribute( 'order' ) ) {
			url += `&order=${ this.getAttribute( 'order' ) }`;
		}
		if ( this.hasAttribute( 'orderby' ) ) {
			url += `&orderby=${ this.getAttribute( 'orderby' ) }`;
		}

		this._loading    = true;
		if ( this._controller ) {
			this._controller.abort();
		}
		this._controller = new AbortController();
		this._posts      = [];
		this.updateContent();

		try {
			const response = await fetch( url, {
				signal: this._controller.signal,
				delay: 50,
			} );
			if ( response.status !== 200 ) {
				throw response.status;
			}
			this._loading    = false;
			this._controller = undefined;
			this._posts      = await response.json();
			this.updateContent();
		} catch ( err ) {
			// If 'DOMException', the request was intentionally aborted, so it is not a real error.
			if ( 'DOMException' !== err ) {
				console.error( 'unable to fetch posts', err );
			}
			this._loading    = false;
			this._controller = undefined;
			this.updateContent();
		}
	}

	updateContent() {
		this.innerHTML = '';

		if ( this._loading ) {
			if ( ! this.shadowRoot.querySelector( '.loader' ) ) {
				this.shadowRoot.appendChild( loaderTemplate.content.cloneNode( true ) );
			}
			return;
		}

		const loader = this.shadowRoot.querySelector( '.loader' );
		if ( loader ) {
			this.shadowRoot.removeChild( loader );
		}

		if ( ! this._posts || ! this._posts.length ) {
			return;
		}

		let dateFormat = undefined;
		if ( this.hasAttribute( 'display-date' ) ) {
			dateFormat = this.getAttribute( 'display-date' );
			if ( ! dateFormat.length ) {
				dateFormat = window.wp && window.wp.date && window.wp.date.__experimentalGetSettings ? window.wp.date.__experimentalGetSettings().formats.date : 'F m, Y';
			}
		}

		this._posts.forEach( post => {
			this.appendChild( getPostListItem( post, dateFormat ) );
		} );
	}

	get displayDate() {
		return this.getAttribute( 'display-date' );
	}

	set displayDate( val ) {
		if ( null !== val ) {
			this.setAttribute( 'display-date', val );
		} else {
			this.removeAttribute( 'display-date' );
		}
	}

	get order() {
		return this.getAttribute( 'order' );
	}

	set order( val ) {
		if ( null !== val ) {
			this.setAttribute( 'order', val );
		} else {
			this.removeAttribute( 'order' );
		}
	}

	get orderby() {
		return this.getAttribute( 'orderby' );
	}

	set orderby( val ) {
		if ( null !== val ) {
			this.setAttribute( 'orderby', val );
		} else {
			this.removeAttribute( 'orderby' );
		}
	}

	get categories() {
		return this.getAttribute( 'categories' );
	}

	set categories( val ) {
		if ( null !== val ) {
			this.setAttribute( 'categories', val );
		} else {
			this.removeAttribute( 'categories' );
		}
	}

	get number() {
		return this.getAttribute( 'number' );
	}

	set number( val ) {
		if ( null !== val ) {
			this.setAttribute( 'number', val );
		} else {
			this.removeAttribute( 'number' );
		}
	}
}

export default WordPressPostList;

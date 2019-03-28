import PostListItem from './custom-elements/post-list-item.js';
import PostList from './custom-elements/post-list.js';

const elements = [
	PostListItem,
	PostList
];

elements.forEach( element => {
	customElements.define( element.is, element );
} );

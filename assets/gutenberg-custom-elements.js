import PostListItem from './custom-elements/post-list-item.js';
import PostList from './custom-elements/post-list.js';
import WordPressPostList from './custom-elements/wordpress-post-list.js';

const elements = [
	PostListItem,
	PostList,
	WordPressPostList,
];

elements.forEach( element => {
	customElements.define( element.is, element );
} );

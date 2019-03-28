import latestPosts from './block-types/latest-posts.js';

const { registerBlockType } = wp.blocks;

registerBlockType( latestPosts.name, latestPosts.settings );

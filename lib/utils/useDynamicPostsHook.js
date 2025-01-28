import { useState, useEffect } from 'react';
import { getAllPostsByCategory, getAllPostsByTag, getCategories, getCategoryById, getTagById, getTags } from '@/lib/api';

export function useDynamicPosts( category, tag, count ) {
	const [ dynamicPosts, setDynamicPosts ] = useState([]);

	useEffect(() => {
		const fetchPostsByCategory = async () => {
			const cat = (await getCategoryById(category)).category;
			const allPosts = await getAllPostsByCategory(parseInt(count), 0, cat?.slug);

			const fetchedPosts = allPosts.edges.map(({node: post}) => ({ 
				attributes: {
					postId: post.postId,
					category: {
						slug: cat.slug,
						name: cat.name,
						uri: cat.uri
					},
					author: {
						name: post.author?.node.name
					},
					selectedPost: {
						slug: post.slug,
						title: {
							rendered: post.title
						},
						excerpt: {
							rendered: post.excerpt
						},
					},
					featuredImage: post.featuredImage ? {
						media_details: {
							sizes: { 
								medium_large: {
									...post.featuredImage.node.mediaDetails.sizes[post.featuredImage.node.mediaDetails.sizes.length - 1], 
									source_url: post.featuredImage.node.mediaDetails.sizes[post.featuredImage.node.mediaDetails.sizes.length - 1].sourceUrl 
								}
							}
						}
					} : null,
				}
			}));
			setDynamicPosts( fetchedPosts );
		}

		const fetchPostsByTag = async () => {
			const fetchedTag = (await getTagById(tag)).tag
			const allPosts = await getAllPostsByTag(parseInt(count), 0, fetchedTag?.slug);

			const fetchedPosts = allPosts.edges.map(({node: post}) => ({
				attributes: {
					postId: post.postId,
					category: {
						slug: post?.categories?.edges[0]?.node.slug,
						name: post?.categories?.edges[0]?.node.name,
						uri: post?.categories?.edges[0]?.node.uri
					},
					author: {
						name: post.author?.node.name
					},
					selectedPost: {
						slug: post.slug,
						title: {
							rendered: post.title
						},
						excerpt: {
							rendered: post.excerpt
						},
					},
					featuredImage: post.featuredImage ? {
						media_details: {
							sizes: { 
								medium_large: {
									...post.featuredImage.node.mediaDetails.sizes[post.featuredImage.node.mediaDetails.sizes.length - 1], 
									source_url: post.featuredImage.node.mediaDetails.sizes[post.featuredImage.node.mediaDetails.sizes.length - 1].sourceUrl 
								}
							}
						}
					} : null,
				}
			}));
			setDynamicPosts( fetchedPosts );
		}

		if ( category ) fetchPostsByCategory();
		else if ( tag ) fetchPostsByTag();
	}, [])

	return dynamicPosts;
}
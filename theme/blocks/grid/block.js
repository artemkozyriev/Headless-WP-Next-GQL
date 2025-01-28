(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;
    const { InnerBlocks } = window.wp.blockEditor;
	const { useState, useEffect } = window.wp.element;
	const { useDebounce } = window.wp.compose;
	const { useEntityRecords } = window.wp.coreData;

	const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/grid', {
        title: 'Grid',
        icon: 'grid-view',
        category: 'text',
        attributes: {
			title: { type: 'string', default: '' },
			theme: { type: 'string', default: 'light' },
			tag: { type: 'number', default: 0 },
			category: { type: 'number', default: 0 },
			columnCount: { type: 'number', default: 4 },
			selectedPosts: {
				attributes: {
					selectedPost: {
						type: 'object', 
						default: { id: '', title: '', category: '', excerpt: ''},
					},
					category: {
						type: 'object',
					},
					author: {
						type: 'object',
					},
					featuredImage: {
						type: 'object',
					},
					hasVideo: {
						type: 'boolean',
						default: false,
					},
				}
			}
        },
        edit: (props) => {
            const { attributes, setAttributes, clientId } = props;
			const { title, theme, columnCount, tag, category } = attributes;

			const [taxonomy, setTaxonomy] = useState( tag ? 'tag' : category ? 'category' : 'manual');
			const [ categorySearch, setCategorySearch ] = useState( '' );
			const [ tagSearch, setTagSearch ] = useState( '' );

			const { categoriesIsResolving, records: categories } = useEntityRecords(
				'taxonomy',
				'category',
				{
					per_page: 10,
					search: categorySearch,
					_embed: true
				}
			);

			const { tagsIsResolving, records: tags } = useEntityRecords(
				'taxonomy',
				'post_tag',
				{
					per_page: 10,
					search: tagSearch,
					_embed: true
				}
			);

			const { postsIsResolving, records: posts } = useEntityRecords(
				'postType',
				'post',
				{
					per_page: 4,
					_embed: true,
					...(category && {categories: category}),
					...(tag && {tags: tag})
				}
			)

			const setCategorySearchDebounced = useDebounce( ( value ) => {
				setCategorySearch( value );
			}, 300 );

			const setTagSearchDebounced = useDebounce( ( value ) => {
				setTagSearch( value );
			}, 300 );

			const categoriesFetch = (id) => {
                // Use wp.apiFetch to make a request to the WordPress REST API
                return wp.apiFetch({ path: `/wp/v2/categories/${id}` });
            };

            const authorsFetch = (id) => {
                // Use wp.apiFetch to make a request to the WordPress REST API
                return wp.apiFetch({ path: `/wp/v2/users/${id}` });
            };

            const featuredImageFetch = (id) => {
                // Use wp.apiFetch to make a request to the WordPress REST API
                return wp.apiFetch({ path: `/wp/v2/media/${id}` })
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        throw error; // Propagate the error for further handling
                    });
            };

			useEffect(() => {
				if (!posts) return;
				const processPosts = async () => {
					try {
						const processedPosts = await Promise.all(posts?.map(async post => {
							const selectedPost = {attributes: {}};
							const filteredPost = { ...post };
							delete filteredPost.content;
							delete filteredPost.yoast_head_json;
							delete filteredPost.yoast_head;
							delete filteredPost._links;
							delete filteredPost.meta;

							selectedPost.attributes.selectedPost = filteredPost;
			
							if (post?.categories) {
								const category = await categoriesFetch(post.categories[0]);
								if (category) {
									let filteredCategory;
									if (category.parent && category.parent > 0) {
										const categoryParent = await categoriesFetch(category.parent);
										const categorySlug = categoryParent.slug;
										filteredCategory = {
											name: category.name,
											slug: category.slug,
											id: category.id,
											uri: `${categorySlug}/${category.slug}/`,
										};
									} else {
										filteredCategory = {
											name: category.name,
											slug: category.slug,
											id: category.id,
											uri: `${category.slug}/`,
										};
									}
									selectedPost.attributes.category = filteredCategory;
								}
							}
			
							if (post.author) {
								const author = await authorsFetch(post.author);
								if (author) {
									const filteredAuthor = {
										name: author.name,
										avatar_urls: author.avatar_urls,
										id: author.id,
										slug: author.slug,
									};
									selectedPost.attributes.author = filteredAuthor;
								}
							}
			
							if (post.featured_media && post.featured_media > 0) {
								const featuredImage = await featuredImageFetch(post.featured_media);
								if (featuredImage && featuredImage.source_url) {
									const filteredSizes = ["medium_large", "medium", "landscape_thumbnail", "square_thumbnail", "full"];
									const filteredMediaDetails = { sizes: {} };
									Object.keys(featuredImage.media_details.sizes).forEach(size => {
										if (filteredSizes.includes(size)) {
											filteredMediaDetails.sizes[size] = featuredImage.media_details.sizes[size];
										}
									});
									const filteredImage = {
										source_url: featuredImage?.media_details?.sizes?.medium_large?.source_url || featuredImage?.media_details?.sizes?.large?.source_url || featuredImage?.media_details?.sizes?.medium?.source_url,
										alt_text: featuredImage.alt_text,
										media_details: filteredMediaDetails,
										id: featuredImage.id,
									};
									selectedPost.attributes.featuredImage = filteredImage;
								}
							}
			
							if (post._featured_video_url) {
								selectedPost.attributes.hasVideo = true;
							}

							return selectedPost;
						}));
			
						props.setAttributes({ selectedPosts: processedPosts });
					} catch (error) {
						console.error("Error processing posts:", error);
					}
				};
			
				processPosts();
			}, [posts]);

            return [
				el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Grid Options' }, 
						[
							el(PanelRow, {},
								el(wp.components.TextControl, { label: 'Title', value: replaceStraightApostrophes(title), type: 'text', onChange: (value) => setAttributes( { title: value } ) } ),
							),
							el(PanelRow, {}, 
								el(wp.components.ButtonGroup, {}, 
									[
										el(wp.components.Button, { isPrimary: columnCount === 4, onClick: () => setAttributes({ columnCount: 4 }) }, '4 Columns'),
										el(wp.components.Button, { isPrimary: columnCount === 2, onClick: () => setAttributes({ columnCount: 2 }) }, '2 Columns')
									]
								),
							),
							el(PanelRow, {}, 
								el(wp.components.ButtonGroup, {}, 
									[
										el(wp.components.Button, { isPrimary: theme === 'light', onClick: () => setAttributes({ theme: 'light' }) }, 'Light'),
										el(wp.components.Button, { isPrimary: theme === 'dark', onClick: () => setAttributes({ theme: 'dark' }) }, 'Dark')
									]
								),
							),
							el(PanelRow, {}, 
								el(wp.components.SelectControl, {
									label: 'Posts from',
									value: taxonomy,
									options: [
										{ label: 'Manual', value: 'manual' },
										{ label: 'Tag', value: 'tag' },
										{ label: 'Category', value: 'category' }
									],
									onChange: (value) => {
										setAttributes({ tag: 0, category: 0 });
										setTaxonomy(value);
									}
								})	
							),
							taxonomy === 'category' && el(PanelRow, {}, 
								el(wp.components.ComboboxControl, { 
									label: 'Search a category',
									onChange: (value) => {
										setAttributes({ 
											category: value
										})
									},
									onFilterValueChange: (value) => {
										setCategorySearchDebounced( value );
									},
									value: category,
									options: 
										categoriesIsResolving
											? [
													{
														label: 'Loading...',
														value: 'loading',
													},
											  ]
											: categories?.map( ( category ) => ( {
													label: category.name,
													value: category.id,
											  } ) ) || []
								})
							),
							taxonomy === 'tag' && el(PanelRow, {}, 
								el(wp.components.ComboboxControl, { 
									label: 'Search a tag',
									onChange: (value) => {
										setAttributes({ 
											tag: value
										})
									},
									onFilterValueChange: (value) => {
										setTagSearchDebounced( value );
									},
									value: tag,
									options: 
										tagsIsResolving
											? [
													{
														label: 'Loading...',
														value: 'loading',
													},
											  ]
											: tags?.map( ( tag ) => ( {
													label: tag.name,
													value: tag.id,
											  } ) ) || []
								})
							),
						]
                    ),
				),
                el(
                    'div',
                    { className: `block-editor-grid columns-${columnCount} ${theme}` },
					[
						title && el( 'div', { className: 'grid-title' }, 
							el( 'h2', {}, title),
						),
						(!category && !tag) && el(
							InnerBlocks,
							{
								template: [
									['macleans/post-selector'],
									['macleans/post-selector'],
								],
								renderAppender: () => 
									el(wp.components.Button, { 
										className: 'block-list-appender-button', 
										icon: 'plus', 
										onClick: () => {
											const newBlock = wp.blocks.createBlock( 'macleans/post-selector' );
											wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, wp.data.select('core/block-editor').getBlocksByClientId(clientId)[0].innerBlocks.length, clientId );
										} 
									}
								),
								directInsert: true,
								defaultBlock: { name: 'macleans/post-selector', attributes: {}},
								allowedBlocks: ['macleans/post-selector']
							}
						),
						(category || tag) && 
							el('div', { className: 'block-editor-inner-blocks'},
								el('div', { className: 'block-editor-block-list__layout post-selector' }, posts?.map( (post) => (
									el('div', { className: 'wp-block post' }, [
										post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
										el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
										el('h2', {}, post.title.raw),
										el('div', {}, post.excerpt.raw)
									])
								)
							)
						))
					]
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            return el(
                'div',
                { className: 'grid' },
                InnerBlocks.Content({}),
            );
        },
    });
})();
(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks, InspectorControls } = window.wp.blockEditor;
    const { ToggleControl, PanelRow, PanelBody, TextControl } = window.wp.components;
	const { useState, useEffect } = window.wp.element;
	const { useDebounce } = window.wp.compose;
	const { useEntityRecords } = window.wp.coreData;

    registerBlockType('macleans/module', {
        title: 'Module (Custom)',
        icon: 'layout',
        category: 'text',
        attributes: {
            secondLayout: {
                type: 'boolean',
                default: false,
            },
			tag: { type: 'number', default: 0 },
			category: { type: 'number', default: 0 },
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
            const { attributes, setAttributes } = props;
			const { tag, category, selectedPosts } = attributes;

			const [ taxonomy, setTaxonomy ] = useState(tag ? 'tag' : category ? 'category' : 'manual');
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
					per_page: 7,
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

            // Wait until categories are fetched before rendering the block
            // if (attributes.categories.length === 0) {
            //     return null;
            // }

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
                        { title: 'Post Options' },
                        el(
                            ToggleControl,
                            {
                                label: 'Use second layout',
                                checked: attributes.secondLayout,
                                onChange: (value) => props.setAttributes({ secondLayout: value }),
                            }
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
					)
                ),
                el(
                    'div',
                    { className: `block-editor-module-block ${attributes.secondLayout ? 'second-layout' : ''}` },
                    (!category && !tag) && el(
                        InnerBlocks,
                        {
                            className: "module-block-holder",
                            template: attributes.secondLayout ? [
                                ['macleans/module-featured'],
                                ['macleans/module-column-two', { selectedModuleCategory: attributes.selectedModuleCategory }],
                                ['macleans/module-column-four', { selectedModuleCategory: attributes.selectedModuleCategory }],
                            ] : [
                                ['macleans/module-column', { selectedModuleCategory: attributes.selectedModuleCategory }],
                                ['macleans/module-featured'],
                                ['macleans/module-column', { selectedModuleCategory: attributes.selectedModuleCategory }],
                            ],
                            templateLock: "all"
                        }
                    ),
					(category || tag) && 
						el('div', { className: 'block-editor-inner-blocks' },
							el('div', { className : 'block-editor-block-list__layout' }, [
								(
									attributes.secondLayout ? [
										el('div', { className: 'block-editor-featured-post block-editor-block-list__block wp-block' }, 
											posts?.slice(0, 1).map( (post) => (
												el('div', { className: 'post-selector' }, 
												el('div', { className: 'post'}, [
													post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
													el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
													el('h2', {}, post.title.raw),
													el('div', {}, post.excerpt.raw)
												])
											)))
										),
										el('div', { className: 'block-editor-module-two-posts block-editor-block-list__block wp-block' }, 
											posts?.slice(1,3).map( (post) => (
												el('div', { className: 'post-selector' }, 
												el('div', { className: 'post'}, [
													post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
													el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
													el('h2', {}, post.title.raw),
													el('div', {}, post.excerpt.raw)
												])
											)))
										),
										el('div', { className: 'block-editor-module-two-posts block-editor-block-list__block wp-block' }, 
											posts?.slice(3).map( (post) => (
												el('div', { className: 'post-selector' }, 
												el('div', { className: 'post'}, [
													post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
													el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
													el('h2', {}, post.title.raw),
													el('div', {}, post.excerpt.raw)
												])
											)))
										),
									] : [
										el('div', { className: 'block-editor-module-four-posts block-editor-block-list__block wp-block' }, 
											posts?.slice(1,4).map( (post) => (
												el('div', { className: 'post-selector' }, 
												el('div', { className: 'post'}, [
													post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
													el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
													el('h2', {}, post.title.raw),
													el('div', {}, post.excerpt.raw)
												])
											)))
										),
										el('div', { className: 'block-editor-featured-post block-editor-block-list__block wp-block' }, 
											posts?.slice(0, 1).map( (post) => (
												el('div', { className: 'post-selector' }, 
												el('div', { className: 'post'}, [
													post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
													el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
													el('h2', {}, post.title.raw),
													el('div', {}, post.excerpt.raw)
												])
											)))
										),
										el('div', { className: 'block-editor-module-three-posts block-editor-block-list__block wp-block' }, 
											posts?.slice(4).map( (post) => (
												el('div', { className: 'post-selector' }, 
												el('div', { className: 'post' }, [
													post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
													el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
													el('h2', {}, post.title.raw),
													el('div', {}, post.excerpt.raw)
												])
											)))
										)
									]
								)
							])
						)
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            return el(
                'div',
                { className: `module-block flex ${attributes.secondLayout ? 'second-layout' : ''}` },
                InnerBlocks.Content({}),
            );
        },
    });
})();


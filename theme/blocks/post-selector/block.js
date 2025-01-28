(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { RichText, InspectorControls, InnerBlocks } = window.wp.blockEditor;
    const { TextControl, ToggleControl, PanelBody, TextareaControl } = window.wp.components;
	  const { useDebounce } = window.wp.compose;
	  const { useEntityRecords } = window.wp.coreData;
    let postsArray = [];

    const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/post-selector', {
        title: 'Post Selector',
        icon: 'admin-post',
        category: 'text',
        supports: {
            inserter: false, 
        },
        attributes: {
            selectedPost: {
                type: 'object', 
                default: { id: '', title: '', category: '', excerpt: ''},
            },
            hideFeaturedImage: {
                type: 'boolean',
                default: false,
            },
            hideCategory: {
                type: 'boolean',
                default: false,
            },
            newCategory: {
                type: 'string',
                default: '',
            },
            newTitle: {
                type: 'string',
                default: '',
            },
            newExcerpt: {
                type: 'string',
                default: '',
            },
            hideByline: {
                type: 'boolean',
                default: true,
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
            }
        },
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { selectedPost, hideFeaturedImage, hideCategory, newCategory, newTitle, newExcerpt, hideByline, category, author, featuredImage, hasVideo } = attributes;
            const [searchTerm, setSearchTerm] = React.useState('');
            const currentDate = new Date();
            const oneYearAgo = new Date(currentDate);
            oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
            const [resolvedPosts, setResolvedPosts] = React.useState([]);
            const [hasPostsResolved, setHasPostsResolved] = React.useState(false);
            const [postCount, setPostCount] = React.useState(20);

            const processedTitle = replaceStraightApostrophes(newTitle || '');
            const processedExcerpt = replaceStraightApostrophes(newExcerpt || '');

			const setSearchDebounced = useDebounce(( value ) => {
                if (value === '') {
                    setPostCount(100);
                } else {
                    setPostCount(20);
                }
				setSearchTerm( value );
			}, 500);

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

            const latestPosts = () => {
                if (searchTerm === '') {
                    return wp.apiFetch({
                        path: `/wp/v2/posts/?after=${oneYearAgo.toISOString()}&per_page=${postCount}`,
                    });
                }
                // Use wp.apiFetch to make a request to the WordPress REST API
                return wp.apiFetch({
                    path: `/wp/v2/posts/?after=${oneYearAgo.toISOString()}&search=${encodeURIComponent(searchTerm)}&per_page=${postCount}`,
                });
            };

            function renderSelectedPost(post) {
                const filteredPost = post;
                delete filteredPost.content;
                delete filteredPost.yoast_head_json;
                delete filteredPost.yoast_head;
                delete filteredPost._links;
                delete filteredPost.meta;

                props.setAttributes({ selectedPost: filteredPost });
                
                // && (!category || post.categories[0] !== category.id)
                
                if (post?.categories) {
                    categoriesFetch(post.categories[0]).then(category => {
                        let categoryParent;
                        let filteredCategory;

                        if (category?.parent && category?.parent > 0) {
                            categoriesFetch(category.parent).then(categoryParent => {
                                categoryParent = categoryParent.slug;
                                filteredCategory = {
                                    name: category.name,
                                    slug: category.slug,
                                    id: category.id,
                                    uri: categoryParent + '/' + category.slug + '/',
                                };
                                props.setAttributes({ category: filteredCategory });
                            });
                        } else {
                            filteredCategory = {
                                name: category.name,
                                slug: category.slug,
                                id: category.id,
                                uri: category.slug + '/',
                            };
                            props.setAttributes({ category: filteredCategory });
                        }
                    });
                }

                // && (!author || post.author !== author.id)
                if (post.author && post.author !== author?.id) {
                    authorsFetch(post.author).then(author => {
                        const filteredAuthor = {
                            name: author.name,
                            avatar_urls: author.avatar_urls,
                            id: author.id,
                            slug: author.slug
                        };

                        props.setAttributes({ author: filteredAuthor });
                    });
                }
                
                // && (!featuredImage || post.featured_media !== featuredImage.id)
                if (post.featured_media > 0 && post.featured_media !== featuredImage?.id) {
                    featuredImageFetch(post.featured_media).then(featuredImage => {
                        if (!featuredImage || !featuredImage.source_url) return null;

                        const filteredSizes = ["medium_large", "medium", "landscape_thumbnail", "square_thumbnail", "full"];
                        const filteredMediaDetails = {sizes: {}};

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
                
                        props.setAttributes({ featuredImage: filteredImage });
                    });
                }
            
                if (post._featured_video_url) {
                    props.setAttributes({ hasVideo: true });
                }
            
                return el(
                    'div',
                    { className: "post" },
                    post._featured_video_url ? 
                        !hideFeaturedImage && el('img', { src: `https://img.youtube.com/vi/${post._featured_video_url.replace('https://www.youtube.com/watch?v=', '')}/hqdefault.jpg` }) 
                        : 
                        !hideFeaturedImage && featuredImage && el('img', { src: featuredImage.source_url }),
                    !hideCategory && el(
                        'span', 
                        { 
                            className: "slug",
                        }, 
                        newCategory || category?.name
                    ),
                    el('h2', null, processedTitle || post.title.rendered),
                    el('p', { dangerouslySetInnerHTML: { __html: processedExcerpt || post.excerpt.rendered } }),
                    !hideByline && el('p', { className: "author" }, 'by ' + author?.name)
                );
            }

            React.useEffect(() => {
                latestPosts().then(posts => {
                    setResolvedPosts(posts);
                    setHasPostsResolved(true);
                });
            }, [searchTerm]);

            return [
                el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    // el(
                    //     TextControl,
                    //     {
                    //         label: 'Search for a post',
                    //         value: searchTerm,
                    //         onChange: (value) => setSearchTerm(value),
                    //         type: 'text',
                    //         help: 'Note: whole block is linked to selected post',
                    //     },
                    // ),
                    el(wp.components.ComboboxControl, { 
                        label: 'Search a Post',
                        onChange: (value) => {
                            if ( !value ) {
                                setAttributes({selectedPost: null})
                            } else {
                                setAttributes({selectedPost: value})
                            };
                        },
                        onFilterValueChange: (value) => {
                            setSearchDebounced( value );
                        },
                        value: selectedPost,
                        options: 
                            !hasPostsResolved
                                ? [
                                        {
                                            label: 'Loading...',
                                            value: 'loading',
                                        },
                                  ]
                                : resolvedPosts?.map( ( post ) => ( {
                                        label: post?.title?.rendered,
                                        value: post,
                                  } ) ) || []
                    }),
                    el(
                        PanelBody,
                        { title: 'Post Options' },
                        el(
                            ToggleControl,
                            {
                                label: 'Hide Featured Image',
                                checked: hideFeaturedImage,
                                onChange: (value) => setAttributes({ hideFeaturedImage: value }),
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                label: 'Hide Category',
                                checked: hideCategory,
                                onChange: (value) => setAttributes({ hideCategory: value }),
                            }
                        ),
                        !hideCategory && el(
                            TextControl,
                            {
                                label: 'New Category',
                                value: newCategory,
                                onChange: (value) => {
                                    if (value !== newCategory) {
                                        setAttributes({ newCategory: value });
                                    }
                                },
                            }
                        ),
                        el(
                            TextControl,
                            {
                                label: 'New Title',
                                value: newTitle,
                                onChange: (value) => setAttributes({ newTitle: value }),
                            }
                        ),
                        el(
                            TextareaControl,
                            {
                                label: 'New Excerpt',
                                value: newExcerpt,
                                onChange: (value) => setAttributes({ newExcerpt: value }),
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                label: 'Hide Byline',
                                checked: hideByline,
                                onChange: (value) => setAttributes({ hideByline: value }),
                            }
                        )
                    ),
                ),
                el(
                    'div',
                    { className: "post-selector" },
                    selectedPost?.id ? renderSelectedPost(selectedPost, props) : el('div', null, 'No posts available')
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            // Check if attributes.posts is defined and not empty
            if (attributes?.selectedPost?.id) {

                return el(
                    'div',
                    { className: "post" },
                    el(
                        'a', 
                        { href: attributes.selectedPost?.slug},
                        attributes.selectedPost?._featured_video_url ? 
                        !attributes.hideFeaturedImage && el('img', { src: `https://img.youtube.com/vi/${attributes.selectedPost._featured_video_url.replace('https://www.youtube.com/watch?v=', '')}/0.jpg` }) 
                        : 
                        !attributes.hideFeaturedImage && attributes.featuredImage && el('img', { src: attributes.featuredImage.source_url }),
                        !attributes.hideCategory && el(
                            'span', 
                            { 
                                className: "slug",
                            }, 
                            attributes.newCategory || attributes.category?.name
                        ),
                        attributes.selectedPost && el('h2', { key: attributes?.selectedPost?.id }, replaceStraightApostrophes(attributes.selectedPost?.title?.rendered)),
                        el('p', { dangerouslySetInnerHTML: { __html: replaceStraightApostrophes(attributes.newExcerpt) || replaceStraightApostrophes(attributes.selectedPost?.excerpt?.rendered) } }),
                        !attributes.hideByline && el('p', { className: "author" }, attributes.author?.name)
                    )
                );
            } else {
                // Handle the case when attributes.posts is undefined or empty
                return el('div', null, 'No posts available');
            }
        },
    });
})();
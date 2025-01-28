(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls, MediaUpload } = window.wp.blockEditor;
    const { TextControl, ToggleControl, PanelBody, SelectControl } = window.wp.components;

    const replaceStraightApostrophes = (text) => {
		// Regular expression to find straight apostrophes
		const regex = /'/g;
		const newText = text.replace(regex, '’');
		return newText;
	};

    registerBlockType('macleans/latest-posts', {
        title: 'Latest Posts',
        icon: 'list-view',
        category: 'text',
        attributes: {
            posts: {
                type: 'array',
                default: [],
            },
            title: {
                type: 'string',
            },
            featuredImage: {
                type: 'string',
                default: '',
            },
            hideImages: {
                type: 'boolean',
                default: true,
            },
            period: {
                type: 'string',
            }
        },
        edit: (props) => {
            const { attributes } = props;

            // Function to fetch posts from the REST API
            const latestPosts = async () => {
                // Use wp.apiFetch to make a request to the WordPress REST API
                const posts = await wp.apiFetch({ path: '/wp/v2/posts?per_page=12&_embed' });
            
                // Process each post to include featured image information
                const postsWithFeaturedImages = posts.map(post => {
                    const featuredImage = post._embedded && post._embedded['wp:featuredmedia'];
                    return {
                        ...post,
                        featured_image: featuredImage ? featuredImage[0].source_url : null,
                    };
                });

                return postsWithFeaturedImages;
            };

            const featuredImageFetch = async (id) => {
                // Use wp.apiFetch to make a request to the WordPress REST API
                return wp.apiFetch({ path: `/wp/v2/media/${id}` });
            };

            React.useEffect(() => {
                latestPosts().then(posts => {
                    // Update block attributes with the fetched posts
                    const filteredPosts = posts.map(post => ({
                        featured_image: post.featured_image, // assuming featured_media holds the image ID
                        title: post.title,
                        excerpt: post.excerpt,
                        slug: post.slug,
                        uri: post.link,
                    }));
                    props.setAttributes({ posts: filteredPosts });
                });
            }, []);

            return [
                el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Newsletter block options' },
                        el(
                            TextControl,
                            {
                                label: 'Title',
                                value: replaceStraightApostrophes(attributes.title || ''),
                                onChange: (value) => props.setAttributes({ title: value }),
                            }
                        ),
                        el(
                            ToggleControl,
                            {
                                label: 'Hide images',
                                checked: attributes.hideImages,
                                onChange: (value) => props.setAttributes({ hideImages: value }),
                            }
                        ),
                        el(
                            SelectControl,
                            {
                                label: 'Period',
                                value: attributes.period || 'latest',
                                options: [
                                    { label: 'Latest', value: 'latest' },
                                    { label: 'Popular', value: '24' },
                                    { label: 'Trending', value: '1' },
                                ],
                                onChange: (value) => props.setAttributes({ period: value }),
                            }
                        ),
                    ),
                ),
                el(
                    'div',
                    { className: "block-editor-latest-posts" },
                    el(
                        'h2',
                        { className: "latest-posts-title" },
                        attributes.title ? attributes.title : 'Latest'
                    ),
                    attributes?.posts?.map((post, index) => {
                        // if (post.featured_media > 0 && !attributes.featuredImage) {
                        //     featuredImageFetch(post.featured_media).then(featuredImage => {
                        //         props.setAttributes({ featuredImage });
                        //         attributes.posts[index].featured_image = featuredImage;
                        //     });
                        // }

                        
                        
                        
                        return el(
                            'div',
                            { className: "latest-post" },
                            !attributes.hideImages && post.featured_image && el(
                                'img',
                                { className: "latest-post-image", src: post.featured_image }
                            ),
                            el(
                                'h3',
                                { className: "latest-post-title" },
                                post.title.rendered
                            ),
                            el(
                                'p',
                                { dangerouslySetInnerHTML: { __html: post.excerpt.rendered } },
                            )
                        );
                    })
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            return el(
                'div',
                { className: "latest-posts" },
                el(
                    'h2',
                    { className: "latest-posts-title" },
                    attributes.title ? attributes.title : 'Latest'
                ),
                attributes?.posts?.map(post => {
                    return el(
                        'div',
                        { className: "latest-post" },
                        !attributes.hideImages && el(
                            'img',
                            { className: "latest-post-image", src: post.featuredImage }
                        ),
                        el(
                            'h3',
                            { className: "latest-post-title" },
                            post.title.rendered
                        ),
                        el(
                            'p',
                            { className: "latest-post-excerpt", dangerouslySetInnerHTML: { __html: post.excerpt.rendered } }
                        )
                    );
                })
            )
        },
    });
})();
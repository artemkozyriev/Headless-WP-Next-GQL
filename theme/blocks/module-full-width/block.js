(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { TextControl, TextareaControl, PanelBody, PanelRow, SelectControl } = window.wp.components;
    const { dispatch, select } = window.wp.data;
    const { useState, useEffect } = window.wp.element;
    const { useDebounce } = window.wp.compose;
    const { useEntityRecords } = window.wp.coreData;

    const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/module-full-width', {
        title: 'Module Full Width (Custom)',
        icon: 'align-full-width',
        category: 'text',
        attributes: {
            post: {
                type: 'object',
                default: null
            },
            title: {
                type: 'string',
                default: '',
            },
            excerpt: {
                type: 'string',
                default: '',
            },
            slug: {
                type: 'string',
                default: '',
            },

            newSlug: {
                type: 'string',
                default: '',
            },
            category: {
                type: 'string',
                default: ''
            },
            newCategory: {
                type: 'string',
                default: ''
            },
            byline: {
                type: 'object',
            },
            featuredImage: {
                type: 'object',
                default: null,
            },
            overlayOpacity: {
                type: 'number',
                default: 0
            },
            contentPadding: {
                type: 'boolean',
                default: false
            },
            backgroundOpacity: {
                type: 'number',
                default: 100
            },
            textColor: {
                type: 'string',
                default: 'white'
            },
            contentPosition: {
                type: 'string',
                default: 'bottom-left'
            },
            newByline: {
                type: 'string',
                default: '',
            },
            hideByline: {
                type: 'boolean',
                default: true,
            }
        },
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { post, title, excerpt, featuredImage, slug, newSlug, category, newCategory, overlayOpacity, contentPadding, backgroundOpacity, textColor, contentPosition, byline, hideByline, newByline } = attributes;
            const postTitle = document.querySelector('.edit-post-visual-editor__post-title-wrapper');

            postTitle.style.display = 'none';

            const [search, setSearch] = useState('');
            const { isResolving, records: posts } = useEntityRecords(
                'postType',
                'post',
                {
                    per_page: 10,
                    search,
                    _embed: true
                }
            );

            const setSearchDebounced = useDebounce((value) => {
                setSearch(value);
            }, 300);

            return [
                el(
                    InspectorControls,
                    { className: 'block-editor-controls-custom' },
                    el(
                        PanelBody,
                        { title: 'Module Options' },
                        [
                            el(
                                PanelRow,
                                {},
                                el(wp.components.ComboboxControl, {
                                    label: 'Search a post',
                                    onChange: (value) => {
                                        if (!value) {
                                            setAttributes({
                                                post: null,
                                                featuredImage: [],
                                                excerpt: '',
                                                title: '',
                                                slug: '',
                                                category: '',
                                                categoryUri: '',
                                                byline: [],
                                            })
                                        } else {
                                            const author = value._embedded?.author[0];
                                            const { content, _embedded, ...postWithoutContent } = value;
                                            const primaryCategory = value._embedded['wp:term'][0].find(category => category.isPrimary) || value._embedded['wp:term'][0][0];
                                            setAttributes({
                                                post: postWithoutContent,
                                                featuredImage: value._embedded['wp:featuredmedia'][0],
                                                excerpt: value.excerpt.rendered,
                                                title: value.title.rendered,
                                                slug: value._embedded['wp:term'][0][0].name ?? '',
                                                category: primaryCategory.name ?? value._embedded['wp:term'][0][0].name ?? '',
                                                categoryUri: primaryCategory.link ?? value._embedded['wp:term'][0][0].link ?? '',
                                                byline: {
                                                    name: author.name,
                                                    slug: author.slug,
                                                    id: author.id
                                                } ?? [],
                                            })
                                        }
                                    },
                                    onFilterValueChange: (value) => {
                                        setSearchDebounced(value);
                                    },
                                    value: post,
                                    options: isResolving
                                        ? [
                                            {
                                                label: 'Loading...',
                                                value: 'loading',
                                            },
                                        ]
                                        : posts?.map((post) => ({
                                            label: post?.title?.rendered,
                                            value: post,
                                        })) || [],
                                })
                            ),
                            el(
                                PanelRow,
                                {},
                                el(wp.components.ToggleControl, {
                                    label: 'Hide byline',
                                    onChange: (value) => {
                                        setAttributes({ hideByline: value })
                                    },
                                    checked: hideByline,
                                })
                            ),
                            !hideByline && el(
                                PanelRow,
                                {},
                                el(wp.components.TextareaControl, {
                                    label: 'New byline',
                                    onChange: (value) => {
                                        setAttributes({ newByline: value })
                                    },
                                    value: newByline,
                                })
                            ),
                            el(
                                PanelRow,
                                {},
                                el(wp.components.RangeControl, {
                                    label: 'Overlay Opacity %',
                                    onChange: (value) => {
                                        setAttributes({ overlayOpacity: value })
                                    },
                                    min: 0,
                                    max: 100,
                                    value: overlayOpacity,
                                })
                            ),
                            el(
                                PanelRow,
                                {},
                                el(wp.components.RangeControl, {
                                    label: 'Background Opacity %',
                                    onChange: (value) => {
                                        setAttributes({ backgroundOpacity: value })
                                    },
                                    min: 0,
                                    max: 100,
                                    value: backgroundOpacity,
                                })
                            ),
                            el(
                                PanelRow,
                                {},
                                el(wp.components.SelectControl, {
                                    label: 'Text Color',
                                    value: textColor,
                                    options: [
                                        { label: 'White', value: 'white' },
                                        { label: 'Black', value: 'black' }
                                    ],
                                    onChange: (value) => {
                                        setAttributes({ textColor: value })
                                    }
                                })
                            ),
                            el(
                                PanelRow,
                                {},
                                el(wp.components.SelectControl, {
                                    label: 'Content Position',
                                    value: contentPosition,
                                    options: [
                                        { label: 'Center', value: 'center' },
                                        { label: 'Bottom left', value: 'bottom-left' }
                                    ],
                                    onChange: (value) => {
                                        setAttributes({ contentPosition: value })
                                    }
                                })
                            ),
                            el(
                                PanelRow,
                                {},
                                el(wp.components.ToggleControl, {
                                    label: 'Add padding around content',
                                    onChange: (value) => {
                                        setAttributes({ contentPadding: value })
                                    },
                                    checked: contentPadding,
                                })
                            ),
                        ]
                    )
                ),
                el(
                    'div',
                    { className: `module-full-width ${contentPadding ? 'padded' : ''} ${contentPosition === 'center' ? 'centered' : ''} color-${textColor}`, style: { '--overlay': overlayOpacity + '%', '--bg': backgroundOpacity + '%' } },
                    [
						el('div', { className: 'module-wrapper' }, [
							el(wp.blockEditor.PlainText, {
								tagName: 'p',
								value: newSlug || slug,
								placeholder: 'Add Category...',
								className: 'module-category slug',
								onChange: (value) => {
									setAttributes({ newSlug: value });
								}
							}),
							el(wp.blockEditor.PlainText, {
								tagName: 'h1',
								value: replaceStraightApostrophes(title),
								placeholder: 'Add Title...',
								className: 'module-title',
								onChange: (value) => {
									setAttributes({ title: value });
								},
							}),
							el(wp.blockEditor.RichText, {
								tagName: 'p',
								value: replaceStraightApostrophes(excerpt),
								placeholder: 'Add Excerpt...',
								className: 'module-excerpt',
								onChange: (value) => {
									setAttributes({ excerpt: value });
								},
							}),
                            !hideByline && el('p', { className: "author" }, newByline || `by ${byline?.name}`)
                        ]),
                        el(
                            'div',
                            { className: 'featured-image' },
                            featuredImage && el('img', { src: featuredImage.source_url, alt: featuredImage.alt_text }),
                            featuredImage?.caption?.raw && el('p', {}, featuredImage.caption.raw)
                        )
                    ]
                ),
            ];
        },
    });
})();
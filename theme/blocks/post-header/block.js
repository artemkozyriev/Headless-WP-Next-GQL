(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { TextControl, TextareaControl, PanelBody, PanelRow, SelectControl } = window.wp.components;
    const { dispatch, select } = window.wp.data;
    const { useState } = window.wp.element;
    const { useDebounce } = window.wp.compose;
    const { useEntityRecords } = window.wp.coreData;
    const { useSelect } = window.wp.data;
    const { useEffect } = window.wp.element;

    const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/post-header', {
        title: 'Post Header (Custom)',
        icon: 'align-full-width',
        category: 'text',
        attributes: {
            title: {
                type: 'string',
                default: 'Add Title...',
            },
            excerpt: {
                type: 'string',
                default: 'Add Excerpt...',
            },
            postAuthor: {
                type: 'object',
                default: null,
            },
			byline: {
				type: 'string',
				default: ''
			},
			orientation: {
				type: 'string',
				default: 'landscape'
			},
            selectedAuthor: {
                type: 'object',
                default: null,
            },
            excerpt: {
                type: 'string',
                default: '',
            },
            slug: {
                type: 'string',
                default: '',
            },
            featuredImage: {
                type: 'object',
                default: null,
            },
            category: {
                type: 'string',
                default: '',
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
				default: 'default'
			},
            textColorHalf: {
                type: 'string',
				default: 'light'
            },
			contentPosition: {
				type: 'string',
				default: 'bottom-left'
			},
            layout: {
                type: 'string',
                default: 'default'
            },
            imagePosition: {
                type: 'string',
                default: 'top',
            },
            optionalImage: {
                type: 'object',
                default: null,
            },
            showCategories: {
                type: 'boolean',
                default: false,
            },
            showAuthor: {
                type: 'boolean',
                default: false,
            },
            titleFontSize: {
                type: 'number',
                default: 32,
            },
            orientation: {
                type: 'string',
            },
            newCategory: {
                type: 'string',
            },
            newAuthor: {
                type: 'string',
            },
            newCaption: {
                type: 'string',
            },
            photoCredit: {
                type: 'string',
            },
            sponsoredType: {
                type: 'object',
            },
            sponsored: {
                type: 'boolean',
                default: false,
            },
            sponsoredText: {
                type: 'string',
            },
            sponsoredLink: {
                type: 'string',
            },
            sponsoredImage: {
                type: 'object',
            },
            showNewsletterSidebar: {
                type: 'boolean',
                default: false,
            },
            newsletterLayout: {
                type: 'string',
                default: 'default',
            },
            newsletterImage: {
                type: 'object',
            },
            newsletterTitle: {
                type: 'string',
            },
            newsletterSubtitle: {
                type: 'string',
            },
            newsletterButtonText: {
                type: 'string',
            },
            newsletterLink: {
                type: 'string',
            }
        },
        
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { titleFontSize, 
                    title, 
                    excerpt, 
                    featuredImage, 
                    category, 
                    overlayOpacity, 
                    contentPadding, 
                    backgroundOpacity, 
                    textColor, 
                    textColorHalf, 
                    contentPosition, 
                    layout, 
                    orientation, 
                    imagePosition, 
                    optionalImage, 
                    showCategories, 
                    showAuthor, 
                    newCategory, 
                    newAuthor, 
                    newCaption,
                    photoCredit,
                    sponsoredType,
                    sponsored,
                    sponsoredText,
                    sponsoredLink,
                    sponsoredImage, 
                    showNewsletterSidebar,
                    newsletterLayout,
                    newsletterImage,
                    newsletterTitle,
                    newsletterSubtitle,
                    newsletterButtonText,
                    newsletterLink
                } = attributes;

            const selectOptions = [
                { label: 'Created by', value: 'default' },
                { label: 'Created for', value: '1' },
                { label: 'In Partnership with', value: '2' },
                { label: 'Special Advertising Feature', value: '3' },
                { label: 'Macleans.ca x', value: '4' },
            ];
            // const [sponsoredTypeValue, setSponsoredTypeValue] = useState('');

            const currentPost = useSelect((select) => select('core/editor').getCurrentPost(), []);

            const updatePostTitle = (newTitle) => {
                newTitle = replaceStraightApostrophes(newTitle || '');
                dispatch('core/editor').editPost({ title: newTitle || '' });
            };

            const updatePostExcerpt = (newExcerpt) => {
                newExcerpt = replaceStraightApostrophes(newExcerpt || '');
                dispatch('core/editor').editPost({ excerpt: newExcerpt || '' });
            };

            const postTitle = document.querySelector('.edit-post-visual-editor__post-title-wrapper');
            postTitle.style.display = 'none';

            const categories = useSelect((select) => {
                return select('core').getEntityRecords('taxonomy', 'category', { post: currentPost.id });
            }, [currentPost]);

            const author = useSelect((select) => {
                if (currentPost.author) {
                    return select('core').getEntityRecord('root', 'user', currentPost.author);
                }
            }, [currentPost]);

            const featuredImageId = useSelect(
                (select) => select('core/editor').getEditedPostAttribute('featured_media'),
                []
            );
            const featuredImageDetails = useSelect(
                (select) => (featuredImageId ? select('core').getMedia(featuredImageId) : null),
                [featuredImageId]
                
            );

            useEffect(() => {
                if (currentPost) {
                    const filteredSizes = ["medium_large", "medium", "landscape_thumbnail", "square_thumbnail", "landscape_thumbnail_large", "square_thumbnail_large", "full", "large"];
                    const filteredMediaDetails = {sizes: {}};

                    if (featuredImageDetails) {
                        Object.keys(featuredImageDetails?.media_details?.sizes)?.forEach(size => {
                            if (filteredSizes.includes(size)) {
                                filteredMediaDetails.sizes[size] = featuredImageDetails.media_details.sizes[size];
                            }
                        });
                    }

                    const filteredImage = {
                        source_url: featuredImageDetails?.media_details?.sizes?.medium_large?.source_url || featuredImageDetails?.media_details?.sizes?.medium?.source_url,
                        alt_text: featuredImageDetails?.alt_text,
                        caption: featuredImageDetails?.caption,
                        media_details: filteredMediaDetails,
                        id: featuredImageDetails?.id,
                    };

                    setAttributes({
                        title: currentPost.title || currentPost.title.rendered,
                        excerpt: currentPost.excerpt.rendered,
                        slug: currentPost.slug,
                        featuredImage: filteredImage,
                    });
                }
                if (categories && categories.length > 0) {
                    setAttributes({ category: categories[0].name });
                }
            }, [currentPost, categories, featuredImageDetails]);

            // wp.data.dispatch('core/editor').editPost({meta: {'sponsoredText': sponsoredText, 'sponsoredLink': sponsoredLink, 'sponsoredImage': sponsoredImage}});

            function getLayoutElement(layout) {
                switch (layout) {
                    case 'default':
                        return el(
                            'div',
                            { className: `default-header ${orientation}` },
                            [
                                (imagePosition === 'top') && el(
                                    'div',
                                    { className: 'featured-image' },
                                    (optionalImage || featuredImageDetails) && 
                                    el('img', { 
                                        src: optionalImage ? optionalImage.url : featuredImageDetails.source_url, 
                                        alt: optionalImage ? optionalImage.alt : featuredImageDetails.alt_text 
                                    }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(newCaption || optionalImage?.caption || featuredImageDetails?.caption?.raw || ''),
                                        placeholder: 'Add Caption...',
                                        className: 'editor-caption',
                                        onChange: (value) => { setAttributes( { newCaption: value } ) }
                                    }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(photoCredit || ''),
                                        placeholder: 'Add Photo Credit...',
                                        className: 'editor-credit',
                                        onChange: (value) => { setAttributes( { photoCredit: value } ) }
                                    }),
                                ),
                                showCategories && el(wp.blockEditor.PlainText, {
                                    tagName: 'p',
                                    value: replaceStraightApostrophes(newCategory || category || '' ),
                                    placeholder: newCategory || category || 'Add Category...',
                                    className: 'default-header-excerpt not-prose slug',
                                    onChange: (value) => {
                                        setAttributes({ newCategory: value });
                                    },
                                }),
                                el(
                                    wp.blockEditor.PlainText,
                                    {
                                        tagName: 'h1',
                                        value: replaceStraightApostrophes(currentPost.title || title || ''),
                                        placeholder: currentPost.title || title || 'Add Title...',
                                        className: 'default-header-title',
                                        style: { fontSize: `${titleFontSize}px` },
                                        onChange: (value) => {
                                            setAttributes({ title: value });
                                            updatePostTitle(value);
                                        },
                                    }
                                ),
                                el(wp.blockEditor.PlainText, {
                                    tagName: 'p',
                                    value: replaceStraightApostrophes(excerpt || ''),
                                    placeholder: currentPost.excerpt || 'Add Excerpt...',
                                    className: 'default-header-excerpt not-prose',
                                    onChange: (value) => {
                                        setAttributes({ excerpt: replaceStraightApostrophes(value) });
                                        updatePostExcerpt(value);
                                    },
                                }),
                                sponsored && el('div', { className: 'sponsored' }, 
                                    el('span', {}, sponsoredType?.label || 'Created by'),
                                    !sponsoredImage?.url && el('span', {}, replaceStraightApostrophes(sponsoredText || '')),
                                    el('a', { href: sponsoredLink || '', target: '_blank' }, 
                                        sponsoredImage?.url && el('img', { className: 'not-prose', src: sponsoredImage?.url || '' })
                                    )
                                ),
                                !sponsored && showAuthor && el(wp.blockEditor.PlainText, {
                                    tagName: 'p',
                                    value: replaceStraightApostrophes(newAuthor || author?.name || ''),
                                    placeholder: newAuthor ? 'By ' + newAuthor : author ? 'By ' + author.name : 'Add Author...',
                                    className: 'default-header-author not-prose',
                                    onChange: (value) => {
                                        setAttributes({ newAuthor: value });
                                    },
                                }),                                
                                (imagePosition !== 'top') && el(
                                    'div',
                                    { className: 'featured-image' },
                                    (optionalImage || featuredImageDetails) && 
                                        el('img', { 
                                            src: optionalImage ? optionalImage.url : featuredImageDetails.source_url, 
                                            alt: optionalImage ? optionalImage.alt : featuredImageDetails.alt_text 
                                        }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(newCaption || optionalImage?.caption || featuredImageDetails?.caption?.raw || ''),
                                        placeholder: 'Add Caption...',
                                        className: 'editor-caption',
                                        onChange: (value) => { setAttributes( { newCaption: value } ) }
                                    }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes (photoCredit || ''),
                                        placeholder: 'Add Photo Credit...',
                                        className: 'editor-credit',
                                        onChange: (value) => { setAttributes( { photoCredit: value } ) }
                                    }),
                                ),
                            ]
                        );
                    case 'half':
                        return el(
                            'div',
                            { className: `header-50-50 color-${textColorHalf} ${showNewsletterSidebar ? 'show-sidebar' : ''}`},
                            [
                                el(
                                    'div',
                                    {className: 'header-holder'},
                                    el(
                                        'div', 
                                        { className: 'header-content'},
                                        [
                                            // showCategories && el('div', { className: 'slug' }, category),
                                            showCategories && el(wp.blockEditor.PlainText, {
                                                tagName: 'p',
                                                value: replaceStraightApostrophes(newCategory || category || ''),
                                                placeholder: newCategory || category || 'Add Category...',
                                                className: ' slug',
                                                onChange: (value) => {
                                                    setAttributes({ newCategory: value });
                                                },
                                            }),
                                            el('div', {}, 
                                            el(wp.blockEditor.PlainText, {
                                                    tagName: 'h1',
                                                    value: replaceStraightApostrophes(currentPost.title || title || ''),
                                                    placeholder: currentPost.title || 'Add Title...',
                                                    className: 'header-title',
                                                    style: { fontSize: `${titleFontSize}px` },
                                                    onChange: (value) => {
                                                        setAttributes({ title: replaceStraightApostrophes(value) });
                                                        updatePostTitle(value);
                                                    },
                                                }
                                            ),
                                            ),
                                            el(wp.blockEditor.RichText, {
                                                tagName: 'p',
                                                value: replaceStraightApostrophes(excerpt || ''),
                                                placeholder: currentPost.excerpt || 'Add Excerpt...',
                                                className: 'header-excerpt not-prose',
                                                onChange: (value) => {
                                                    setAttributes({ excerpt: replaceStraightApostrophes(value) });
                                                    updatePostExcerpt(value);
                                                },
                                            }),
                                            showAuthor && el(wp.blockEditor.PlainText, {
                                                tagName: 'p',
                                                value: replaceStraightApostrophes(newAuthor || author?.name || ''),
                                                placeholder: newAuthor ? 'By ' + newAuthor : author ? 'By ' + author.name : 'Add Author...',
                                                className: 'header-author',
                                                onChange: (value) => {
                                                    setAttributes({ newAuthor: value });
                                                },
                                            }),     
                                        ]
                                    ),
                                    el(
                                        'div',
                                        { className: 'header-img not-prose' },
                                        (optionalImage || featuredImageDetails) && 
                                            el('img', { 
                                                src: optionalImage ? optionalImage.url : featuredImageDetails.source_url, 
                                                alt: optionalImage ? optionalImage.alt : featuredImageDetails.alt_text 
                                            }),
                                    ),
                                ),
                                el('div', { className: 'editor-caption' }, 
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(newCaption || optionalImage?.caption || featuredImageDetails?.caption?.raw || ''),
                                        placeholder: 'Add Caption...',
                                        onChange: (value) => { setAttributes( { newCaption: replaceStraightApostrophes(value) } ) }
                                    }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(photoCredit || ''),
                                        placeholder: 'Add Photo Credit...',
                                        className: 'editor-credit',
                                        onChange: (value) => { setAttributes( { photoCredit: replaceStraightApostrophes(value) } ) }
                                    }),
                                ),
                                showNewsletterSidebar && el(
                                    'div',
                                    { className: `block-editor-newsletter-sidebar ${newsletterLayout || 'default'}` },
                                    newsletterImage && el(
                                        'div',
                                        { className: "newsletter-image"},
                                        el('img', { src: newsletterImage?.url })
                                    ),
                                    el(
                                        'div',
                                        { className: "newsletter-top" },
                                        el(
                                            'h2',
                                            { className: "newsletter-title text-red" },
                                            replaceStraightApostrophes(newsletterTitle || '')
                                        ),
                                        el(
                                            'p',
                                            { className: `newsletter-subtitle ${newsletterLayout === 'layout-two' ? 'text-white' : 'text-black'}` },
                                            replaceStraightApostrophes(newsletterSubtitle || '')
                                        ),
                                    ),
                                    el(
                                        'div',
                                        { className: "newsletter-bottom" },
                                        el(
                                            'form',
                                            { className: "newsletter-form" },
                                            el(
                                                'button',
                                                { className: `newsletter-submit btn ${newsletterLayout === 'default' ? 'bg-black' : 'bg-red'}`, type: "submit" },
                                                replaceStraightApostrophes(newsletterButtonText || 'Subscribe')
                                            )
                                        )
                                    )
                                )
                            ]
                        );
                    case 'full':
                        return el(
                            'div',
                            { className: `post-header ${contentPadding ? 'padded' : ''} ${ contentPosition === 'center' ? 'centered' : ''} color-${textColor} ${showNewsletterSidebar ? 'show-sidebar' : ''}`, style: { '--overlay': overlayOpacity + '%', '--bg': backgroundOpacity + '%' } },
                            [
                                el('div', { className: 'header-wrapper' }, [
                                    showCategories && el(wp.blockEditor.PlainText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(newCategory || category || ''),
                                        placeholder: newCategory || category || 'Add Category...',
                                        className: 'slug',
                                        onChange: (value) => {
                                            setAttributes({ newCategory: value });
                                        },
                                    }),
                                    el(wp.blockEditor.PlainText,{
                                        tagName: 'h1',
                                        value: replaceStraightApostrophes(title || ''),
                                        placeholder: currentPost.title || 'Add Title...',
                                        className: 'header-title',
                                        style: { fontSize: `${titleFontSize}px` },
                                        onChange: (value) => {
                                            setAttributes({ title: value });
                                            updatePostTitle(value);
                                        },
                                    }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(excerpt || ''),
                                        placeholder: currentPost.excerpt || 'Add Excerpt...',
                                        className: 'header-excerpt',
                                        onChange: (value) => {
                                            setAttributes({ excerpt: value });
                                            updatePostExcerpt(value);
                                        },
                                    }),
                                    showAuthor && el(wp.blockEditor.PlainText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(newAuthor || author?.name || ''),
                                        placeholder: newAuthor ? 'By ' + newAuthor : author ? 'By ' + author.name : 'Add Author...',
                                        className: 'header-author author',
                                        onChange: (value) => {
                                            setAttributes({ newAuthor: value });
                                        },
                                    }),     
                                ]),
                                el(
                                    'div',
                                    { className: 'featured-image' },
                                    (optionalImage || featuredImageDetails) && 
                                        el('img', { 
                                            src: optionalImage ? optionalImage.url : featuredImageDetails.source_url, 
                                            alt: optionalImage ? optionalImage.alt : featuredImageDetails.alt_text 
                                        })
                                ),
                                el('div', { className: 'editor-caption' }, 
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(newCaption || optionalImage?.caption || featuredImageDetails?.caption?.raw || ''),
                                        placeholder: 'Add Caption...',
                                        onChange: (value) => { setAttributes( { newCaption: value } ) }
                                    }),
                                    el(wp.blockEditor.RichText, {
                                        tagName: 'p',
                                        value: replaceStraightApostrophes(photoCredit || ''),
                                        placeholder: 'Add Photo Credit...',
                                        className: 'editor-credit',
                                        onChange: (value) => { setAttributes( { photoCredit: value } ) }
                                    }),
                                ),
                                showNewsletterSidebar && el(
                                    'div',
                                    { className: `block-editor-newsletter-sidebar ${newsletterLayout || 'default'}` },
                                    newsletterImage && el(
                                        'div',
                                        { className: "newsletter-image"},
                                        el('img', { src: newsletterImage?.url })
                                    ),
                                    el(
                                        'div',
                                        { className: "newsletter-top" },
                                        el(
                                            'h2',
                                            { className: "newsletter-title text-red" },
                                            replaceStraightApostrophes(newsletterTitle || '')
                                        ),
                                        el(
                                            'p',
                                            { className: `newsletter-subtitle ${newsletterLayout === 'layout-two' ? 'text-white' : 'text-black'}` },
                                            replaceStraightApostrophes(newsletterSubtitle || '')
                                        ),
                                    ),
                                    el(
                                        'div',
                                        { className: "newsletter-bottom" },
                                        el(
                                            'form',
                                            { className: "newsletter-form" },
                                            el(
                                                'button',
                                                { className: `newsletter-submit btn ${newsletterLayout === 'default' ? 'bg-black' : 'bg-red'}`, type: "submit" },
                                                replaceStraightApostrophes(newsletterButtonText || 'Subscribe')
                                            )
                                        )
                                    )
                                )
                            ]
                        );
                }
            }

            return [
                el(
                    InspectorControls,
                    { className: 'block-editor-controls-custom' },
                    el(
                        wp.components.BaseControl,
                        { 
                            label: 'Header Layout', 
                            help: 'Select the Header Layout.' 
                        },
                    ),
                    el(
                        PanelRow,
                        {},
                        el(wp.components.SelectControl, {
                            label: 'Layout',
                            value: layout,
                            options: [
                                { label: 'Default', value: 'default' },
                                { label: '50/50', value: 'half' },
                                { label: 'Full Width', value: 'full' },
                            ],
                            onChange: (value) => {
                                setAttributes({ layout: value, sponsored: value !== 'default' ? false : sponsored });
                            },
                        })
                    ),
                    layout === 'default' && el(
                        PanelRow,
                        {},
                        el(wp.components.ToggleControl, {
                            label: 'Sponsored',
                            checked: sponsored,
                            onChange: (value) => {
                                setAttributes({ sponsored: layout === 'default' ? value : false });
                            },
                        }),
                    ),
                    layout === 'default' && sponsored && el(
                        SelectControl,
                        {
                            label: 'Type',
                            value: sponsoredType?.value || 'default',
                            options: selectOptions,
                            onChange: (value) => {
                                const selectedOption = selectOptions.find(option => option.value === value.toString());
                                if (selectedOption) {
                                    props.setAttributes({ sponsoredType: {label: selectedOption.label, value: selectedOption.value} });
                                }
                            },
                        }
                    ),
                    layout === 'default' && sponsored && el(TextControl, {
                        label: 'Sponsor Text',
                        value: sponsoredText,
                        onChange: (value) => {
                            setAttributes({ sponsoredText: value });
                        },
                    }),
                    layout === 'default' && sponsored && el(TextControl, {
                        label: 'Sponsor Link',
                        value: sponsoredLink,
                        onChange: (value) => {
                            setAttributes({ sponsoredLink: value });
                        },
                    }),
                    layout === 'default' && sponsored && el(wp.blockEditor.MediaUploadCheck, {}, 
                        el('div', {},
                            el(wp.blockEditor.MediaUpload, 
                                { 
                                    allowedTypes: ['image'],
                                    onSelect: (media) => setAttributes({ sponsoredImage: media }),
                                    value: sponsoredImage,
                                    render: ({ open }) => (
                                        el(wp.components.Button, {
                                            className: !sponsoredImage ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview',
                                            onClick: open
                                        },
                                            !sponsoredImage ? 'Upload Sponsored Logo' : el('img', { src: sponsoredImage.url })
                                        )
                                    )                                    
                                }
                            ),
                            sponsoredImage && el(wp.components.Button, {
                                className: 'editor-post-featured-image__remove',
                                onClick: () => setAttributes({ sponsoredImage: null })
                            }, 'Remove Image')
                        )
                    ),
                    el(
                        PanelRow,
                        {},
                        el(wp.components.ToggleControl, {
                            label: 'Show Category',
                            checked: showCategories,
                            onChange: (value) => {
                                setAttributes({ showCategories: value });
                            },
                        })
                    ),
                    !sponsored && el(
                        PanelRow,
                        {},
                        el(wp.components.ToggleControl, {
                            label: 'Show Author',
                            checked: showAuthor,
                            onChange: (value) => {
                                setAttributes({ showAuthor: value });
                            },
                        })
                    ),
                    el(wp.blockEditor.MediaUploadCheck, {}, 
                        el('div', {},
                            el(wp.blockEditor.MediaUpload, 
                                { 
                                    allowedTypes: ['image'],
                                    onSelect: (media) => setAttributes({ optionalImage: media }),
                                    value: optionalImage,
                                    render: ({ open }) => (
                                        el(wp.components.Button, {
                                            className: !optionalImage ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview',
                                            onClick: open
                                        },
                                            !optionalImage ? 'Replace Featured Image' : el('img', { src: optionalImage.url })
                                        )
                                    )                                    
                                }
                            ),
                            optionalImage && el(wp.components.Button, {
                                className: 'editor-post-featured-image__remove',
                                onClick: () => setAttributes({ optionalImage: null })
                            }, 'Remove Image')
                        )
                    ),
                    el(
                        PanelBody,
                        { title: 'Options' },
                            el(
                                wp.components.BaseControl,
                                { 
                                    label: 'Heading Size', 
                                    help: 'Select the Header text Size.' 
                                },
                            ),
                            el(
                                wp.components.FontSizePicker,
                                {
                                    __nextHasNoMarginBottom: true,
                                    value: titleFontSize,
                                    onChange: (value) => {
                                        setAttributes({ titleFontSize: value });
                                    },
                                    fontSizes: [
                                        { name: 'S', size: 24 },
                                        { name: 'M', size: 32 },
                                        { name: 'L', size: 40 },
                                        { name: 'XL', size: 44 },
                                    ],
                                }
                            ),
                       
                        [
                            layout === 'default' && el(
                                PanelRow,
                                {},
                                el(wp.components.SelectControl, {
                                    label: 'Image Position',
                                    value: imagePosition,
                                    options: [
                                        { label: 'Top', value: 'top' },
                                        { label: 'Bottom', value: 'bottom' },
                                    ],
                                    onChange: (value) => {
                                        setAttributes({ imagePosition: value });
                                    },
                                })
                            ),
                            layout === 'default' && el(
                                PanelRow,
                                {},
                                el(
                                    wp.components.BaseControl,
                                    { 
                                        label: 'Image Aspect Ratio',
                                        help: 'Select the aspect ration of the Image.'
                                    },
                                ),
                                el(wp.components.ButtonGroup, {},
									[
										el(wp.components.Button, { 
											icon: 'image-flip-horizontal', 
											variant: 'secondary', 
											isPrimary: orientation === 'landscape', 
											onClick: () => { setAttributes( { orientation: 'landscape' } ) }
										}),
										el(wp.components.Button, { 
											icon: 'image-flip-vertical', 
											isPrimary: orientation === 'portrait', 
											onClick: () => { setAttributes( { orientation: 'portrait' } ) }
										})
									]
								)
                            ),
                            !(layout === 'half' || layout === 'default') && el(
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
                            !(layout === 'half' || layout === 'default') && el(
                                PanelRow,
                                {},
                                el(wp.components.SelectControl, {
									label: 'Text Style',
									value: textColor,
									options: [
                                        { label: 'Default', value: 'default' },
										{ label: 'Dark', value: 'dark' },
										{ label: 'Light', value: 'light'}
									],
                                    onChange: (value) => {
										setAttributes({ textColor: value })
                                    }
                                })
                            ),
                            layout === 'half' && el(
                                PanelRow,
                                {},
                                el(wp.components.SelectControl, {
									label: 'Text Style',
									value: textColorHalf,
									options: [
										{ label: 'Dark', value: 'dark' },
										{ label: 'Light', value: 'light'}
									],
                                    onChange: (value) => {
										setAttributes({ textColorHalf: value })
                                    }
                                })
                            ),
                            !(layout === 'half' || layout === 'default') && el(
                                PanelRow,
                                {},
                                el(wp.components.RangeControl, {
									label: 'Text Background Opacity %',
                                    onChange: (value) => {
										setAttributes({ backgroundOpacity: value })
                                    },
									min: 0,
									max: 100,
                                    value: backgroundOpacity,
                                })
                            ),
                            !(layout === 'half' || layout === 'default') && el(
                                PanelRow,
                                {},
                                el(wp.components.SelectControl, {
									label: 'Content Position',
									value: contentPosition,
									options: [
										{ label: 'Center', value: 'center' },
										{ label: 'Bottom left', value: 'bottom-left'}
									],
                                    onChange: (value) => {
										setAttributes({ contentPosition: value })
                                    }
                                })
                            ),
                            !(layout === 'half' || layout === 'default') && el(
                                PanelRow,
                                {},
                                el(wp.components.ToggleControl, {
									label: 'Add padding around the text content',
                                    onChange: (value) => {
										setAttributes({ contentPadding: value })
                                    },
                                    checked: contentPadding,
                                })
                            ),
                            layout !== 'default' && el(
                                PanelRow,
                                {},
                                el(wp.components.ToggleControl, {
                                    label: 'Show Newsletter Sidebar',
                                    checked: showNewsletterSidebar,
                                    onChange: (value) => {
                                        setAttributes({ showNewsletterSidebar: value });
                                    },
                                })
                            ),
                            layout !== 'default' && showNewsletterSidebar && el(
                                PanelRow,
                                {},
                                el(
                                    PanelBody,
                                    { title: 'Newsletter Signup block options' },
                                    el(
                                        SelectControl,
                                        {
                                            label: 'Select layout',
                                            value: newsletterLayout || 'default',
                                            options: [
                                                { label: 'Default', value: 'default' },
                                                { label: 'Light', value: 'layout-one' },
                                                { label: 'Dark', value: 'layout-two' },
                                            ],
                                            onChange: (value) => props.setAttributes({ newsletterLayout: value }),
                                        }
                                    ),
                                    el(wp.blockEditor.MediaUpload, 
                                        { 
                                            allowedTypes: ['image'],
                                            onSelect: (media) => setAttributes({ newsletterImage: media }),
                                            value: newsletterImage,
                                            render: ({ open }) => (
                                                el(wp.components.Button, {
                                                    className: !newsletterImage ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview',
                                                    onClick: open
                                                },
                                                    !newsletterImage ? 'Upload Sponsored Logo' : el('img', { src: newsletterImage.url })
                                                )
                                            )                                    
                                        }
                                    ),
                                    el(wp.components.TextControl, {
                                        label: 'Newsletter Title',
                                        value: newsletterTitle,
                                        onChange: (value) => {
                                            setAttributes({ newsletterTitle: value });
                                        },
                                    }),
                                    el(
                                        TextareaControl,
                                        {
                                            label: 'Subtitle',
                                            value: newsletterSubtitle,
                                            onChange: (value) => props.setAttributes({ newsletterSubtitle: value }),
                                        }
                                    ),
                                    el(
                                        TextControl,
                                        {
                                            label: 'Button text',
                                            value: newsletterButtonText,
                                            onChange: (value) => props.setAttributes({ newsletterButtonText: value }),
                                        }
                                    ),
                                    el(
                                        TextControl,
                                        {
                                            label: 'Button link',
                                            value: newsletterLink,
                                            onChange: (value) => props.setAttributes({ newsletterLink: value }),
                                        }
                                    ),
                                ),
                            ),
                        ]
                    )
                ),
                getLayoutElement(layout),
            ];
        },
    });
})();

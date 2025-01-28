(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;
	const { useState } = window.wp.element;
	const { useDebounce } = window.wp.compose;
	const { useEntityRecords } = window.wp.coreData;

	const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/module-5050', {
        title: 'Module 50/50 (Custom)',
        icon: 'layout',
        category: 'text',
        attributes: {
            url: {
                type: 'string',
                default: '',
            },
            mediaId: {
                type: 'number',
                default: 0,
            },
            post: {
                type: 'object',
                default: null,
            },
            imagePosition: {
                type: 'string',
                default: 'left',
            },
            title: {
                type: 'string',
				default: '',
            },
			fontSize: {
				type: 'number',
				default: 40
			},
            subtitle: {
                type: 'string',
				default: ''
            },
			category: {
				type: 'string',
				default: ''
			},
			newCategory: {
				type: 'string',
				default: ''
			},
			categoryUri: {
				type: 'string',
				default: ''
			},
			author: {
				type: 'object'
			},
			newAuthor: {
				type: 'string',
				default: ''
			},
			featuredImage: {
				type: 'object',
			}
        },
        edit: (props) => {
			const { attributes, setAttributes } = props;
			const { url, mediaId, post, imagePosition, title, fontSize, subtitle, category, categoryUri, author, newAuthor, newCategory, featuredImage } = attributes;

			const [ search, setSearch ] = useState( '' );
			const { isResolving, records: posts } = useEntityRecords(
				'postType',
				'post',
				{
					per_page: 10,
					search,
					_embed: true
				}
			);

			const setSearchDebounced = useDebounce( ( value ) => {
				setSearch( value );
			}, 300 );

            return [
                el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Module Options' }, 
						[
							el(PanelRow, {}, 
								el(wp.components.ComboboxControl, { 
									label: 'Search a Post',
									onChange: (value) => {
										if ( ! value ) {
											setAttributes({
												post: null,
												mediaId: 0,
												title: '',
												author: '',
												subtitle: '',
												category: '',
												categoryUri: '',
												url: '',
												featuredImage: []
											});
										} else { 
											const { content, _embedded, ...postWithoutContent } = value;
											const primaryCategory = value._embedded['wp:term'][0].find(category => category.isPrimary) || value._embedded['wp:term'][0][0];
											setAttributes({ 
												post: postWithoutContent, 
												title: value.title.rendered,
												subtitle: value.excerpt.rendered,
												author: {
													name: value._embedded['author'][0].name,
													slug: value._embedded['author'][0].slug,
													id: value._embedded['author'][0].id
												} ?? [],
												mediaId: value.featured_media, 
												category: primaryCategory.name ?? value._embedded['wp:term'][0][0].name ?? '',
												categoryUri: primaryCategory.link ?? value._embedded['wp:term'][0][0].link ?? '',
												url: value._embedded['wp:featuredmedia'][0].media_details?.sizes?.medium_large?.source_url,
												featuredImage: value._embedded['wp:featuredmedia'][0] ?? []
											});
										}
									},
									onFilterValueChange: (value) => {
										setSearchDebounced( value );
									},
									value: post,
									options: 
										isResolving
											? [
													{
														label: 'Loading...',
														value: 'loading',
													},
											  ]
											: posts?.map( ( post ) => ( {
													label: post?.title?.rendered,
													value: post,
											  } ) ) || []
								})	
							),
							el(PanelRow, {}, 
								el(wp.blockEditor.MediaUploadCheck, {}, 
									el(wp.blockEditor.MediaUpload, 
										{ 
											allowedTypes: ['image'],
											onSelect: (media) => {
												setAttributes({ url: media.url, mediaId: 0 });
											},
											render: ({ open }) => (
												el(wp.components.Button, { className: mediaId ? 'editor-post-featured-image__preview' : 'editor-post-featured-image__toggle' , onClick: open },
													! mediaId && ! url ? 'Choose an Image' : el('img', { src: url })
												)
											)
										}
									),
								),
							),
							(mediaId === 0 && post !== null) && el(PanelRow, {}, 
								el(wp.components.Button, { isDestructive: false, isDefault: true, onClick: () => setAttributes( { mediaId: post?.featured_media ?? 0, url: post._embedded['wp:featuredmedia'][0].source_url})}, 'Use Featured Image' )
							),
							el(PanelRow, {},
								el(wp.components.BaseControl, { label: 'Image Position' } ),
							),
							el(wp.components.ButtonGroup, {},
								[
									el(wp.components.Button, { 
										icon: 'editor-alignleft', 
										isDefault: true, 
										isPrimary: imagePosition === 'left', 
										onClick: () => { setAttributes( { imagePosition: 'left' } ) }
									}),
									el(wp.components.Button, { 
										icon: 'editor-alignright', 
										isPrimary: imagePosition === 'right', 
										onClick: () => { setAttributes( { imagePosition: 'right' } ) }
									})
								]
							),
						]
                    ),
					el(
                        PanelBody,
                        { title: 'Title Typography' }, 
						el(wp.components.FontSizePicker, {
							fontSizes: [
								{
									name: 'S',
									slug: 'small',
									size: 26
								},
								{
									name: 'M',
									slug: 'medium',
									size: 30
								},
								{
									name: 'L',
									slug: 'large',
									size: 32
								},
								{
									name: 'XL',
									slug: 'extra-large',
									size: 40
								}
							],
							value: fontSize,
							fallbackFontSize: 40,
							onChange: (value) => setAttributes({ fontSize: value })
						})
                    ),
                ),
                el(
                    'div',
                    { className: 'module-50-50 ' + imagePosition },
					[
						el('div', { className: 'module-img'},
							el('img',
								{ src: url }
							),
						),
						el(
							'div', { className: 'module-content'},
							el('div', {},
							[
								el(wp.blockEditor.PlainText, {
									tagName: 'p',
									value: newCategory || category,
									placeholder: 'Add Category...',
									className: 'module-category',
									onChange: (value) => { setAttributes( { newCategory: value } ) }
								}),
								el('div', {style: { fontSize: fontSize + 'px' }}, 
									el(wp.blockEditor.PlainText, {
										tagName: 'h1',
										value: replaceStraightApostrophes(title),
										placeholder: 'Add Title...',
										className: 'module-title',
										style: { fontsize: fontSize + 'px'},
										onChange: (value) => { setAttributes( { title: value } ) }
									}),
								),
								el(wp.blockEditor.RichText, {
									tagName: 'p',
									value: replaceStraightApostrophes(subtitle),
									placeholder: 'Add Subtitle...',
									className: 'module-subtitle',
									onChange: (value) => { setAttributes( { subtitle: value } ) }
								}),
								el(wp.blockEditor.RichText, {
									tagName: 'p',
									value: newAuthor || author?.name,
									placeholder: 'Add Author...',
									className: 'module-author',
									onChange: (value) => { setAttributes( { newAuthor: value } ) }
								}),
							])
						)
					]
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;
			const { url, mediaId, imagePosition, title, fontSize, subtitle, category, newCategory, author, newAuthor } = attributes;

            return el(
				'div',
				{ className: `wp-block-module-50-50 ${imagePosition}` },
				[
					el(
						'img',
						{ src: url }
					),
					el(
						'div',
						{ className: 'module-content' },
						[
							category && el(
								'p',
								{ className: 'module-category'},
								category
							),
							title && el(
								'h1',
								{ className: 'module-title', style: `font-size: ${fontSize}px`},
								title
							),
							subtitle && el(
								'p',
								{ className: 'module-subtitle'},
								subtitle
							),
							author && el(
								'p',
								{ className: 'module-author'},
								author
							)
						]
					)
				]
			)
        },
    });
})();


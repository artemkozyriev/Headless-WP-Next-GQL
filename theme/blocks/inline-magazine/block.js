(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;

    registerBlockType('macleans/inline-magazine', {
        title: 'Inline Magazine (Custom)',
        icon: 'welcome-widgets-menus',
        category: 'media',
        attributes: {
            theme: {
                type: 'string',
                default: 'light',
            },
            isSingle: {
                type: 'boolean',
                default: true,
            },
            heading: {
                type: 'string',
                default: '',
            },
            description: {
                type: 'string',
                default: '',
            },
            covers: {
                type: 'array',
				default: [],
            },
			link: {
				type: 'string',
				default: '#'
			},
        },
        edit: (props) => {
			const { attributes, setAttributes } = props;
			const { theme, isSingle, heading, description, covers, link } = attributes;

            return [
                el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Inline Magazine Options' }, 
						[
							el(PanelRow, {}, 
								el(wp.components.ButtonGroup, {}, 
									[
										el(wp.components.Button, { isPrimary: theme === 'light', onClick: () => { setAttributes({ theme: 'light' }) }}, 'Light'),
										el(wp.components.Button, { isPrimary: theme === 'dark', onClick: () => { setAttributes({ theme: 'dark' }) }}, 'Dark')
									]
								),
							),
							el(PanelRow, {}, 
								el(wp.components.ToggleControl, { 
									label: 'Has 3 Covers', 
									checked: ! isSingle, 
									onChange: (value) => {
										let newCovers = [...covers];
										if ( ! value ) {
											newCovers = [covers[0]]
										}
										setAttributes({ isSingle: ! value, covers: newCovers })
									}
								})
							),
							el(PanelRow, {}, 
								el(wp.blockEditor.MediaUploadCheck, {}, 
									el(wp.blockEditor.MediaUpload, 
										{ 
											allowedTypes: ['image'],
											onSelect: (media) => {
												const newCovers = [...covers];
												newCovers[0] = media.url
												setAttributes({ covers: newCovers });
											},
											value: covers[0],
											render: ({ open }) => (
												el(wp.components.Button, {className: ! covers[0] ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview', onClick: open},
													! covers[0] ? 'Choose an Image' : el('img', { src: covers[0] })
												)
											)
										}
									)
								),
							),
							! isSingle && 
							el(PanelRow, {}, 
								el(wp.blockEditor.MediaUploadCheck, {}, 
									el(wp.blockEditor.MediaUpload, 
										{ 
											allowedTypes: ['image'],
											onSelect: (media) => {
												const newCovers = [...covers];
												newCovers[1] = media.url
												setAttributes({ covers: newCovers });
											},
											value: covers[1],
											render: ({ open }) => (
												el(wp.components.Button, {className: ! covers[1] ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview', onClick: open},
													! covers[1] ? 'Choose an Image' : el('img', { src: covers[1] })
												)
											)
										}
									)
								),
							),
							! isSingle && 
							el(PanelRow, {}, 
								el(wp.blockEditor.MediaUploadCheck, {}, 
									el(wp.blockEditor.MediaUpload, 
										{ 
											allowedTypes: ['image'],
											onSelect: (media) => {
												const newCovers = [...covers];
												newCovers[2] = media.url
												setAttributes({ covers: newCovers });
											},
											value: covers[2],
											render: ({ open }) => (
												el(wp.components.Button, {className: ! covers[2] ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview', onClick: open},
													! covers[2] ? 'Choose an Image' : el('img', { src: covers[2] })
												)
											)
										}
									)
								),
							),
							el(PanelRow, {}, 
								el(wp.blockEditor.URLInput, {
									__nextHasNoMarginBottom: true,
									value: link,
									label: 'Button Link',
									onChange: (value) => setAttributes({ link: value })
								})
							)
						]
                    ),
                ),
				el('div', { className: `inline-magazine ${theme} ${isSingle ? 'single' : 'triple'}` }, 
					[
						el('div', { className: 'inline-covers swiper' }, 
							[
								el('div', { className: 'swiper-wrapper' }, [
									covers.length > 0 && covers.map(cover => el('div', { className: 'inline-cover swiper-slide' }, el('img', { src: cover }))),
									covers.length === 0 && el('div', { className: 'inline-placeholder swiper-slide' })
								]),
								el('div', { className: 'swiper-actions'}, [
									el('div', { className: 'swiper-button-prev' }),
									el('div', { className: 'swiper-pagination' }),
									el('div', { className: 'swiper-button-next' }),
								])
							]
						),
						el('div', { className: 'inline-content' }, [
							el(wp.blockEditor.RichText, { 
								tagName: 'h3', 
								value: heading,
								className: 'inline-heading',
								placeholder: 'Add Heading...',
								onChange: (value) => setAttributes({ heading: value }) 
							}), 
							el(wp.blockEditor.RichText, { 
								tagName: 'p', 
								value: description, 
								className: 'inline-description',
								placeholder: 'Add Description...',
								onChange: (value) => setAttributes({ description: value }), 
							}),
							el('button', { className: `btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}` }, 'Subscribe')
						])
					]
				)
            ];
        },
        save: (props) => {
            const { attributes } = props;
			const { theme, isSingle, heading, description, covers, link } = attributes;

        },
    });
})();

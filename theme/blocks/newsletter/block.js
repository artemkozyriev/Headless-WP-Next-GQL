(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls, MediaUpload } = window.wp.blockEditor;
    const { TextControl, ToggleControl, PanelBody, PanelRow } = window.wp.components;

    const replaceStraightApostrophes = (text) => {
		// Regular expression to find straight apostrophes
		const regex = /'/g;
		const newText = text.replace(regex, '’');
		return newText;
	};

    registerBlockType('macleans/newsletter', {
        title: 'Newsletter',
        icon: 'buddicons-pm',
        category: 'text',
        attributes: {
            magazineLayout: {
                type: 'boolean',
                default: false,
            },
            magazineImage: {
                type: 'string',
                default: '',
            },
            title: {
                type: 'string',
                default: '',
            },
            subtitle: {
                type: 'string',
                default: '',
            },
            emailPlaceholder: {
                type: 'string',
                default: 'Email',
            },
            buttonText: {
                type: 'string',
                default: 'Subscribe',
            },
			buttonLink: {
				type: 'string',
				default: '#'
			}
        },
        edit: (props) => {
            const { attributes } = props;

            return [
                el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Newsletter block options' },
                        el(
                            ToggleControl,
                            {
                                label: 'Use magazine layout',
                                checked: attributes.magazineLayout,
                                onChange: (value) => props.setAttributes({ magazineLayout: value }),
                            }
                        ),
                        attributes.magazineLayout && el(
                            'div',
                            { className: "newsletter-image-upload" },
                            el(
                                MediaUpload,
                                {   
                                    onSelect: (media) => props.setAttributes({ magazineImage: media.url }),
                                    allowedTypes: ['image'],
                                    value: attributes.magazineImage,
                                    render: ({ open }) => el(
                                        'div',
                                        null,
                                        el('span', { className: 'label' }, 'Upload Magazine Image:'),
                                        el(
                                            'button',
                                            { onClick: open, className: 'btn btn-secondary' },
                                            'Select Image'
                                        )
                                    ),
                                }
                            ),
                            el(
                                'img',
                                { className: "newsletter-image-src", src: attributes.magazineImage }
                            )
                        ),
                        el(
                            TextControl,
                            {
                                label: 'Subtitle',
                                value: replaceStraightApostrophes(attributes.subtitle),
                                onChange: (value) => props.setAttributes({ subtitle: value }),
                            }
                        ),
                        !attributes.magazineLayout && el(
                            TextControl,
                            {
                                label: 'Email placeholder',
                                value: attributes.emailPlaceholder,
                                onChange: (value) => props.setAttributes({ emailPlaceholder: value }),
                            }
                        ),
                        el(
                            TextControl,
                            {
                                label: 'Button text',
                                value: attributes.buttonText,
                                onChange: (value) => props.setAttributes({ buttonText: value }),
                            }
                        ),
						el(
							PanelRow, {}, 
							el(wp.blockEditor.URLInput, {
								label: 'Button URL',
								value: attributes.buttonLink,
								onChange: (value) => props.setAttributes({ buttonLink: value })
							})
						)
                    ),
                ),
                el(
                    'div',
                    { className: "block-editor-newsletter" },
                    attributes.magazineLayout && el(
                        'img',
                        { className: "newsletter-image", src: attributes.magazineImage }
                    ),
                    el(
                        wp.blockEditor.RichText, {
							tagName: 'h3',
							placeholder: 'Title...',
							value: replaceStraightApostrophes(attributes.title),
							allowedFormats: [ 'core/bold', 'core/italic' ],
							onChange: (value) => props.setAttributes({ title: value }),
						}
                    ),
                    el(
                        'p',
                        { className: "newsletter-subtitle" },
                        replaceStraightApostrophes(attributes.subtitle)
                    ),
                    !attributes.magazineLayout && el(
                        'form',
                        { className: "newsletter-form" },
                        el(
                            'input',
                            {
                                type: "email",
                                placeholder: attributes.emailPlaceholder || 'Email',
                                className: "newsletter-email"
                            }
                        ),
                        el(
                            'button',
                            { className: "newsletter-submit btn btn-secondary", type: "submit" },
                            attributes.buttonText || 'Subscribe'
                        )
                    ),
                    attributes.magazineLayout && el(
                        'button',
                        { className: "newsletter-button btn btn-secondary" },
                        attributes.buttonText || 'Subscribe'
                    )
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;
            return el(
                'div',
                { className: "newsletter" },
                attributes.magazineLayout && el(
                    'img',
                    { className: "newsletter-image", src: attributes.magazineImage }
                ),
                el(
                    'h3',
                    { className: "newsletter-title" },
                    attributes.title
                ),
                el(
                    'p',
                    { className: "newsletter-subtitle" },
                    attributes.subtitle
                ),
                !attributes.magazineLayout && el(
                    'form',
                    { className: "newsletter-form" },
                    el(
                        'input',
                        {
                            type: "email",
                            placeholder: attributes.emailPlaceholder,
                            className: "newsletter-email"
                        }
                    ),
                    el(
                        'button',
                        { className: "newsletter-submit btn btn-secondary", type: "submit" },
                        attributes.buttonText
                    )
                ),
                attributes.magazineLayout && el(
                    'button',
                    { className: "newsletter-button btn btn-secondary" },
                    attributes.buttonText
                )
            );
        },
    });
})();
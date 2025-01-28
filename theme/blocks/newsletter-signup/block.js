(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { TextControl, TextareaControl, PanelBody, SelectControl } = window.wp.components;
    
    const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/newsletter-signup', {
        title: 'Newsletter Signup',
        icon: 'buddicons-pm',
        category: 'text',
        attributes: {
            title: {
                type: 'string',
                default: 'Get the Best of Maclean’s straight to your inbox.',
            },
            subtitle: {
                type: 'string',
                default: 'Sign up for news, commentary, analysis and promotions. Join 80,000+ Canadian readers.',
            },
            emailPlaceholder: {
                type: 'string',
                default: 'Email',
            },
            buttonText: {
                type: 'string',
                default: 'Subscribe',
            },
            layout: {
                type: 'string',
                default: 'default',
            },
            blockSource: {
                type: 'string',
                default: 'editor', // Default value set to 'editor'
            },
        },
        edit: (props) => {
            const { attributes } = props;
            const isAddedOnPostInit = attributes.blockSource === 'postInit';

            return [
                el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Newsletter Signup block options' },
                        el(
                            SelectControl,
                            {
                                label: 'Select layout',
                                value: attributes.layout || 'default',
                                options: [
                                    { label: 'Default', value: 'default' },
                                    { label: 'Light', value: 'layout-one' },
                                    { label: 'Dark', value: 'layout-two' },
                                ],
                                onChange: (value) => props.setAttributes({ layout: value }),
                            }
                        ),
                        el(
                            TextareaControl,
                            {
                                label: 'Title',
                                value: attributes.title,
                                placeholder: 'Get the Best of Maclean’s straight to your inbox.',
                                onChange: (value) => props.setAttributes({ title: value }),
                            }
                        ),
                        el(
                            TextareaControl,
                            {
                                label: 'Subtitle',
                                value: attributes.subtitle,
                                placeholder: 'Sign up for news, commentary, analysis and promotions. Join 80,000+ Canadian readers.',
                                onChange: (value) => props.setAttributes({ subtitle: value }),
                            }
                        ),
                         el(
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
                    ),
                ),
                el(
                    'div',
                    { className: `block-editor-newsletter-signup ${attributes.layout || 'default'} ${isAddedOnPostInit ? 'post-init' : ''}` },
                    el(
                        'div',
                        { className: "newsletter-left" },
                        el(
                            'h2',
                            { className: "newsletter-title text-red" },
                            replaceStraightApostrophes(attributes.title || 'Get the Best of Maclean’s straight to your inbox.')
                        ),
                        el(
                            'p',
                            { className: `newsletter-subtitle ${attributes.layout === 'layout-two' ? 'text-white' : 'text-black'}` },
                            replaceStraightApostrophes(attributes.subtitle || 'Sign up for news, commentary, analysis and promotions. Join 80,000+ Canadian readers.')
                        ),
                    ),
                    el(
                        'div',
                        { className: "newsletter-right" },
                        el(
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
                                { className: `newsletter-submit btn ${attributes.layout === 'default' ? 'bg-black' : 'bg-red'}`, type: "submit" },
                                attributes.buttonText || 'Subscribe'
                            )
                        )
                    )
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            // attributes.title = 'Get the Best of Maclean’s straight to your inbox.';
            // attributes.subtitle = 'Sign up for news, commentary, analysis and promotions. Join 80,000+ Canadian readers.'

            return el(
                'div',
                { className: `newsletter-signup ${attributes.layout} flex` },
                el(
                    'div',
                    { className: "newsletter-left" },
                    el(
                        'h2',
                        { className: "newsletter-title text-red" },
                        attributes.title
                    ),
                    el(
                        'p',
                        { className: `newsletter-subtitle ${attributes.layout === 'layout-two' ? 'text-white' : 'text-black'}` },
                        attributes.subtitle
                    ),
                ),
                el(
                    'div',
                    { className: "newsletter-right" },
                    el(
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
                            { className: `newsletter-submit btn ${attributes.layout === 'default' ? 'bg-black' : 'bg-red'}`, type: "submit" },
                            attributes.buttonText
                        )
                    )
                )
            );
        },
    });
})();
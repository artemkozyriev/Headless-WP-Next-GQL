(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks, InspectorControls } = window.wp.blockEditor;
    const { ToggleControl, PanelBody } = window.wp.components;

    registerBlockType('macleans/home-header', {
        title: 'Home Header (Custom)',
        icon: 'layout',
        category: 'text',
        attributes: {
            secondLayout: {
                type: 'boolean',
                default: false,
            },
        },
        edit: (props) => {
            const { attributes } = props;

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
                ),
                el(
                    'div',
                    { className: `block-editor-promo-block ${attributes.secondLayout ? 'second-layout' : ''}` },
                    el(
                        InnerBlocks,
                        {
                            className: "promo-block-holder",
                            template: [
                                ['macleans/post-grid'],
                                ['macleans/aside'],
                            ],
                            templateLock: "all"
                        }
                    )
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            return el(
                'div',
                { className: `promo-block flex ${attributes.secondLayout ? 'second-layout' : ''}` },
                InnerBlocks.Content({}),
            );
        },
    });
})();
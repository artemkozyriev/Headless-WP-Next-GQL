(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks, InspectorControls } = window.wp.blockEditor;
    const { ToggleControl, PanelBody } = window.wp.components;

    registerBlockType('macleans/aside', {
        title: 'Aside',
        icon: 'align-pull-right',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        edit: () => {
            return [
                el(
                    'div',
                    { className: `block-editor-aside` },
                    el(
                        InnerBlocks,
                        {
                            className: "aside-holder",
                            template: [
                                ['macleans/newsletter'],
                                ['macleans/latest-posts'],
                            ],
                            templateLock: "all"
                        }
                    )
                )
            ];
        },
        save: () => {
            return el(
                'div',
                { className: `aside` },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();

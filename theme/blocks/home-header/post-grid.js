(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks, InspectorControls } = window.wp.blockEditor;
    const { ToggleControl, PanelBody } = window.wp.components;

    registerBlockType('macleans/post-grid', {
        title: 'Post Grid',
        icon: 'layout',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        edit: () => {
            return [
                el(
                    'div',
                    { className: `block-editor-post-grid` },
                    el(
                        InnerBlocks,
                        {
                            className: "post-grid-holder",
                            template: [
                                ['macleans/two-posts'],
                                ['macleans/featured-post'],
                                ['macleans/three-posts'],
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
                { className: `post-grid` },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();

(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks } = window.wp.blockEditor;

    registerBlockType('macleans/featured-post', {
        title: 'Featured Post',
        icon: 'align-full-width',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        edit: () => {
            return [
                el(
                    'div',
                    { className: "block-editor-featured-post" },
                    el(
                        InnerBlocks,
                        {
                            template: [
                                ['macleans/post-selector'],
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
                { className: "featured-post" },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();
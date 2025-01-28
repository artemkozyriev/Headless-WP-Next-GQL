(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks } = window.wp.blockEditor;

    registerBlockType('macleans/three-posts', {
        title: 'Three Posts',
        icon: 'grid-view',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        edit: () => {
            return [
                el(
                    'div',
                    { className: "block-editor-three-posts" },
                    el(
                        InnerBlocks,
                        {
                            template: [
                                ['macleans/post-selector'],
                                ['macleans/post-selector'],
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
                { className: "three-posts" },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();
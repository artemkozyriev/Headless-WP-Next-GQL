(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks } = window.wp.blockEditor;

    registerBlockType('macleans/video-column', {
        title: 'Video Column Post',
        icon: 'align-full-width',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        edit: () => {
            return [
                el(
                    'div',
                    { className: "block-editor-video-column-post" },
                    el(
                        InnerBlocks,
                        {
                            template: [
                                ['macleans/post-selector', { className: 'my-custom-class-1' }],
                                ['macleans/post-selector', { className: 'my-custom-class-1' }],
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
                { className: "video-column-post" },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();
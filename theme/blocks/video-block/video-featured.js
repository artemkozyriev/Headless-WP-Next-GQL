(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks } = window.wp.blockEditor;

    registerBlockType('macleans/video-featured', {
        title: 'Video Featured Post',
        icon: 'align-full-width',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        edit: () => {
            return [
                el(
                    'div',
                    { className: "block-editor-video-featured-post" },
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
                { className: "video-featured-post" },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();
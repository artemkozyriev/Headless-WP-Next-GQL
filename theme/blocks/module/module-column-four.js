(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InnerBlocks } = window.wp.blockEditor;

    registerBlockType('macleans/module-column-four', {
        title: 'Four Posts',
        icon: 'grid-view',
        category: 'text',
        supports: {
            inserter: false, // Hide the block from the block inserter
        },
        attributes: {
            selectedModuleCategory: {
                type: 'string',
            },
        },
        edit: (props) => {
            const { attributes } = props;

            console.log(attributes.selectedModuleCategory);

            // if (!attributes.selectedModuleCategory) {
            //     return null;
            // }

            return [
                el(
                    'div',
                    { className: "block-editor-module-three-posts" },
                    el(
                        InnerBlocks,
                        {
                            template: [
                                ['macleans/post-selector'],
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
                { className: "module-three-posts" },
                InnerBlocks.Content({}) // Use InnerBlocks.Content to retrieve the content
            );
        },
    });
})();
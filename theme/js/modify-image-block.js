(function () {
    var el = wp.element.createElement;
    var TextControl = wp.components.TextControl;
    var ToggleControl = wp.components.ToggleControl;
    var hooks = wp.hooks;
    const allowedBlocks = ['core/image', 'core/paragraph'];

    hooks.addFilter(
        'blocks.registerBlockType',
        'mcaleans/custom-attributes',
        function (settings) {
            if (typeof settings.attributes !== 'undefined' && allowedBlocks.includes(settings.name)) {
                settings.attributes = Object.assign(settings.attributes, {
                    photoCredit: {
                        type: 'string',
                        default: '',
                    },
                    endStyle: {
                        type: 'boolean',
                        default: false,
                    }
                });
            }
            return settings;
        }
    );

    hooks.addFilter(
        'editor.BlockEdit',
        'mcaleans/modify-image-block',
        function (BlockEdit) {
            return function (props) {
                var blockName = props.name;
                var attributes = props.attributes;
                var setAttributes = props.setAttributes;

                if (blockName === 'core/image') {
                    return el(
                        wp.element.Fragment,
                        null,
                        el(
                            BlockEdit,
                            { ...props, attributes: { ...attributes, photoCredit: attributes.photoCredit } }
                        ),
                        el(
                            wp.editor.InspectorControls,
                            null,
                            el(TextControl, {
                                label: 'Photo Credit',
                                value: attributes.photoCredit,
                                onChange: function (value) {
                                    setAttributes({ ...attributes, photoCredit: value });
                                },
                            })
                        )
                    );
                }
                if (blockName === 'core/paragraph') {
                    return el(
                        wp.element.Fragment,
                        null,
                        el(
                            BlockEdit,
                            props
                        ),
                        el(
                            wp.editor.InspectorControls,
                            null,
                            el(ToggleControl, {
                                label: 'Add End Style',
                                checked: attributes.endStyle,
                                className: 'block-editor-block-card',
                                onChange: function (newEndStyle) {
                                    setAttributes({ ...attributes, endStyle: newEndStyle });
                                },
                            })
                        )
                    );
                }
                return el(BlockEdit, props);
            };
        }
    );

    hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'mcaleans/modify-image-block-save-element',
        function (props) {
            return {
                ...props,
            };
        }
    );
})();


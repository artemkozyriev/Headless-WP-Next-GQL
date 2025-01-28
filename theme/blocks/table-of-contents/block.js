(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;
    const { InnerBlocks } = window.wp.blockEditor;
	const { useState, useEffect } = window.wp.element;
	const { useDebounce } = window.wp.compose;
	const { useEntityRecords } = window.wp.coreData;

    registerBlockType('macleans/table-of-contents', {
        title: 'Table of Contents',
        icon: 'list-view',
        category: 'text',
        attributes: {
			columnCount: { type: 'number', default: 1 },
			items: { type: 'array', default: [] },
        },
        edit: (props) => {
            const { attributes, setAttributes, clientId } = props;
			const { columnCount, items } = attributes;

			const itemList = (value) => {
				return value.sort((a, b) => a.index - b.index).map((value) => el('div', { className: 'item-wrapper' }, [
					el('div', { className: 'item-remove' },
						el(wp.components.Button, { onClick: () => {
							const newitems = items.filter(item => item.index != value.index)
							setAttributes({ items: newitems });
						} }, 'X' )
					),
					el(wp.blockEditor.URLInputButton, { className: 'item-link', label: 'Link', url: value.url, onChange: url => { 
						const newObject = Object.assign({}, value, {
							url
						});
						setAttributes({
							items: [...items.filter(
								item => item.index != value.index
							), newObject]
						});
					}}),
					el(wp.blockEditor.RichText, { tagName: 'h4', value: value.title, onChange: title => {
						const newObject = Object.assign({}, value, {
							title
						});
						setAttributes({
							items: [...items.filter(
								item => item.index != value.index
							), newObject]
						});
					}, placeholder: 'Enter the title here' }),
					el(wp.blockEditor.RichText, { tagName: 'p', value: value.description, className: 'item-description', onChange: description => {
						const newObject = Object.assign({}, value, {
							description
						});
						setAttributes({
							items: [...items.filter(
								item => item.index != value.index
							), newObject]
						});
					}, placeholder: 'Enter description' })
				]))
			}

            return [
				el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Table Options' },
						el(PanelRow, {}, 
							el(wp.components.ButtonGroup, {}, 
								[
									el(wp.components.Button, { isPrimary: columnCount === 1, onClick: () => { setAttributes({ columnCount: 1 }) }}, '1 Column'),
									el(wp.components.Button, { isPrimary: columnCount === 2, onClick: () => { setAttributes({ columnCount: 2 }) }}, '2 Columns')
								]
							),
						),
                    ),
				),
                el(
                    'div',
                    { className: `block-editor-table-contents columns-${columnCount}` },
					(
						el('div', {}, 
							el('div', { className: 'item-wrap' }, 
								itemList(items)
							),
							el('div', { className: 'add-item' }, 
								el(wp.components.Button, { className: 'add-item', onClick: () => {
									setAttributes({
										items: [...items, {
											index: items.length,
											title: "",
											description: ""
										}]
									});
								}}, 'Add Item')
							)
						)
					)
                )
            ];
        }
    });
})();
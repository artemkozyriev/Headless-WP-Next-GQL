(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;
    const { InnerBlocks } = window.wp.blockEditor;
	const { useState, useEffect } = window.wp.element;
	const { useDebounce } = window.wp.compose;
	const { useEntityRecords } = window.wp.coreData;

	const replaceStraightApostrophes = (text) => {
		// Regular expression to find straight apostrophes
		const regex = /'/g;
		const newText = text.replace(regex, '’');
		return newText;
	};

    registerBlockType('macleans/carousel', {
        title: 'Carousel',
        icon: 'slides',
        category: 'text',
        attributes: {
			title: { type: 'string', default: '' },
			theme: { type: 'string', default: 'dark' },
			tag: { type: 'number', default: 0 },
			category: { type: 'number', default: 0 },
			count: { type: 'number', default: 4 }
        },
        edit: (props) => {
            const { attributes, setAttributes, clientId } = props;
			const { title, theme, tag, category, count } = attributes;

			const [ taxonomy, setTaxonomy ] = useState(tag ? 'tag' : category ? 'category' : 'manual');
			const [ categorySearch, setCategorySearch ] = useState( '' );
			const [ tagSearch, setTagSearch ] = useState( '' );

			const { categoriesIsResolving, records: categories } = useEntityRecords(
				'taxonomy',
				'category',
				{
					per_page: 10,
					search: categorySearch,
					_embed: true
				}
			);

			const { tagsIsResolving, records: tags } = useEntityRecords(
				'taxonomy',
				'post_tag',
				{
					per_page: 10,
					search: tagSearch,
					_embed: true
				}
			);

			const { postsIsResolving, records: posts } = useEntityRecords(
				'postType',
				'post',
				{
					per_page: count ?? 4,
					_embed: true,
					...(category && {categories: category}),
					...(tag && {tags: tag})
				}
			)

			const setCategorySearchDebounced = useDebounce( ( value ) => {
				setCategorySearch( value );
			}, 300 );

			const setTagSearchDebounced = useDebounce( ( value ) => {
				setTagSearch( value );
			}, 300 );

            return [
				el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Carousel Options' }, 
						[
							el(PanelRow, {},
								el(wp.components.TextControl, { label: 'Title', value: replaceStraightApostrophes(title), type: 'text', onChange: (value) => setAttributes( { title: value } ) } ),
							),
							el(PanelRow, {}, 
								el(wp.components.ButtonGroup, {}, 
									[
										el(wp.components.Button, { isPrimary: theme === 'light', onClick: () => { setAttributes({ theme: 'light' }) }}, 'Light'),
										el(wp.components.Button, { isPrimary: theme === 'dark', onClick: () => { setAttributes({ theme: 'dark' }) }}, 'Dark')
									]
								),
							),
							el(PanelRow, {}, 
								el(wp.components.SelectControl, {
									label: 'Posts from',
									value: taxonomy,
									options: [
										{ label: 'Manual', value: 'manual' },
										{ label: 'Tag', value: 'tag' },
										{ label: 'Category', value: 'category' }
									],
									onChange: (value) => {
										setAttributes({ tag: 0, category: 0 });
										setTaxonomy(value);
									}
								})	
							),
							taxonomy === 'category' && el(PanelRow, {}, 
								el(wp.components.ComboboxControl, { 
									label: 'Search a category',
									onChange: (value) => {
										setAttributes({ 
											category: value
										})
									},
									onFilterValueChange: (value) => {
										setCategorySearchDebounced( value );
									},
									value: category,
									options: 
										categoriesIsResolving
											? [
													{
														label: 'Loading...',
														value: 'loading',
													},
											  ]
											: categories?.map( ( category ) => ( {
													label: category.name,
													value: category.id,
											  } ) ) || []
								})
							),
							taxonomy === 'tag' && el(PanelRow, {}, 
								el(wp.components.ComboboxControl, { 
									label: 'Search a tag',
									onChange: (value) => {
										setAttributes({ 
											tag: value
										})
									},
									onFilterValueChange: (value) => {
										setTagSearchDebounced( value );
									},
									value: tag,
									options: 
										tagsIsResolving
											? [
													{
														label: 'Loading...',
														value: 'loading',
													},
											  ]
											: tags?.map( ( tag ) => ( {
													label: tag.name,
													value: tag.id,
											  } ) ) || []
								})
							),
							taxonomy !== 'manual' && el(PanelRow, {},
								el(wp.components.TextControl, {
									label: 'Amount of Posts',
									type: 'number',
									min: 4,
									max: 16,
									value: count,
									onChange: (value) => {
										setAttributes({ count: value })
									}
								})	
							)
						]
                    ),
				),
                el(
                    'div',
                    { className: `block-editor-carousel ${theme}` },
					[
						title && el( 'div', { className: 'carousel-title' }, 
							el( 'h2', {}, title),
						),
						(!category && !tag) && el(
							InnerBlocks,
							{
								template: [
									['macleans/post-selector'],
									['macleans/post-selector'],
									['macleans/post-selector'],
									['macleans/post-selector'],
								],
								renderAppender: () => 
									wp.data.select('core/block-editor').getBlocksByClientId(clientId)[0].innerBlocks.length < 16 && el(wp.components.Button, { 
										className: 'block-list-appender-button', 
										icon: 'plus', 
										onClick: () => {
										const newBlock = wp.blocks.createBlock( 'macleans/post-selector' );
										wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, wp.data.select('core/block-editor').getBlocksByClientId(clientId)[0].innerBlocks.length, clientId );
									} }
								),
								templateInsertUpdatesSelection: false,
								directInsert: true,
								defaultBlock: { name: 'macleans/post-selector', attributes: {}},
								allowedBlocks: ['macleans/post-selector']
							}
						),
						(category || tag) && 
							el('div', { className: 'block-editor-inner-blocks'},
								el('div', { className: 'block-editor-block-list__layout post-selector' }, posts?.map( (post) => (
									el('div', { className: 'wp-block post' }, [
										post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
										el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
										el('h2', {}, post.title.raw),
										el('div', {}, post.excerpt.raw)
									])
								)
							)
						))
					]
                )
            ];
        },
        save: (props) => {
            const { attributes } = props;

            return el(
                'div',
                { className: 'carousel' },
                InnerBlocks.Content({}),
            );
        },
    });
})();
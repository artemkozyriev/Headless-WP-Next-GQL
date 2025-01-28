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

    registerBlockType('macleans/video-block', {
        title: 'Video Block',
        icon: 'format-video',
        category: 'text',
        attributes: {
			title: { type: 'string', default: '' },
			tag: { type: 'number', default: 0 },
			category: { type: 'number', default: 0 }
        },
        edit: (props) => {
            const { attributes, setAttributes, clientId } = props;
			const { title, tag, category } = attributes;

			const [taxonomy, setTaxonomy] = useState( tag ? 'tag' : category ? 'category' : 'manual');
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
					per_page: 3,
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
                        { title: 'Video Block Options' }, 
						[
							el(PanelRow, {},
								el(wp.components.TextControl, { label: ' Block Title', value: replaceStraightApostrophes(title), type: 'text', onChange: (value) => setAttributes( { title: value } ) } ),
							),
							el(PanelRow, {}, 
								el(wp.components.SelectControl, {
									label: 'Select Posts from:',
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
									label: 'Search for a category',
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
									label: 'Search for a tag',
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
						]
                    ),
				),
                el(
                    'div',
                    { className: `block-editor-video` },
					[
						title && el( 'div', { className: 'video-title' }, 
							el( 'h2', {}, title),
						),
						(!category && !tag) && el(
							InnerBlocks,
							{
								template: [
									['macleans/video-featured'],
									['macleans/video-column'],
								],
								directInsert: true,
								defaultBlock: { name: 'macleans/video-block', attributes: {}},
								allowedBlocks: ['macleans/video-block']
							}
						),
						(category || tag) && 
							el('div', { className: 'block-editor-inner-blocks'},
								el('div', { className: 'block-editor-block-list__layout post-selector post-selector-big' }, posts?.map( (post, index) => (
									(index == 0) && el('div', { className: 'wp-block post' }, [
										post._embedded['wp:featuredmedia'] && el('img', {src: post._embedded['wp:featuredmedia'][0].source_url}),
										el('span', { className: 'slug'}, post._embedded['wp:term'] ? post._embedded['wp:term'][0][0].name : ''),
										el('h2', {}, post.title.raw),
										el('div', {}, post.excerpt.raw)
									])
								)
								)),
								el('div', { className: 'block-editor-block-list__layout post-selector' }, posts?.map( (post, index) => (
									(index == 1 || index == 2) && el('div', { className: 'wp-block post' }, [
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
                { className: 'grid' },
                InnerBlocks.Content({}),
            );
        },
    });
})();
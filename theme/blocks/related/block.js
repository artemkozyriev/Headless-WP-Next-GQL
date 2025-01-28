(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;
    const { InnerBlocks } = window.wp.blockEditor;
    const { useState, useEffect } = window.wp.element;
    const { useDebounce } = window.wp.compose;
    const { useEntityRecords, useEntityProp } = window.wp.coreData;
    const { useSelect } = window.wp.data;

	const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

    registerBlockType('macleans/related', {
        title: 'Related Posts (Custom)',
        icon: 'images-alt',
        category: 'text',
        attributes: {
			title: { type: 'string', default: 'Related Posts' },
			theme: { type: 'string', default: 'light' },
			tag: { type: 'number', default: 0 },
			category: { type: 'number', default: 0 },
			count: { type: 'number', default: 4 }
        },
        edit: (props) => {
            const { attributes, setAttributes, clientId } = props;
			const { title, theme, tag, category, count } = attributes;

			const [taxonomy, setTaxonomy] = useState( tag ? 'tag' : category ? 'category' : 'category');	
			const [filteredPosts, setFilteredPosts] = useState([]);		

			// Fetch the current post's tags and categories
			const [postType, postId] = useSelect(
				(select) => [
					select('core/editor').getCurrentPostType(),
					select('core/editor').getCurrentPostId(),
				],
				[]
			);
			const [postTags] = useEntityProp('postType', postType, 'tags', postId);
			const [postCategories] = useEntityProp('postType', postType, 'categories', postId);

			const { postsIsResolving, records: posts } = useEntityRecords(
				'postType',
				'post',
				{
					per_page: count ? parseInt(count)+1 : 4,
					_embed: true,
					...(category && {categories: category}),
					...(tag && {tags: tag})
				}
			)

			useEffect(() => {
				if (taxonomy === 'tag' && postTags && postTags.length > 0) {
					setAttributes({ tag: postTags[0] });
				}
			}, [taxonomy, postTags]);

			useEffect(() => {
				if (taxonomy === 'category' && postCategories && postCategories.length > 0) {
					setAttributes({ category: postCategories[0] });
				}
			}, [taxonomy, postCategories]);

			useEffect(() => {
				if (posts) {
					let postInArray = posts.filter(post => post.id !== postId).slice(0, parseInt(count));
	
					setFilteredPosts(postInArray);
				}
			}, [posts])

            return [
				el(
                    InspectorControls,
                    { className: "block-editor-controls-custom"},
                    el(
                        PanelBody,
                        { title: 'Related Post Options' }, 
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
									label: 'Related by',
									value: taxonomy,
									options: [
										{ label: 'Category', value: 'category' },
										{ label: 'Manual', value: 'manual' },
										{ label: 'Tag', value: 'tag' },
									],
									onChange: (value) => {
										setAttributes({ tag: 0, category: 0 });
										setTaxonomy(value);
									}
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
										setAttributes({ count: parseInt(value) })
									}
								})	
							)
						]
                    ),
				),
                el(
                    'div',
                    { className: `block-editor-related-posts ${theme}` },
					[
						title && el( 'div', { className: 'related-posts-title' }, 
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
								el('div', { className: `block-editor-block-list__layout post-selector ${count > 8 ? '' : 'grid'}` }, filteredPosts?.map( (post) => (
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
                { className: 'related-posts' },
                InnerBlocks.Content({}),
            );
        },
    });
})();
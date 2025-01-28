(() => {
    const el = window.wp.element.createElement;
    const { registerBlockType } = window.wp.blocks;
    const { InspectorControls } = window.wp.blockEditor;
    const { PanelBody, PanelRow } = window.wp.components;
    const { InnerBlocks } = window.wp.blockEditor;
	const { useState, useEffect } = window.wp.element;
	const { useDebounce } = window.wp.compose;
	const { useEntityRecords } = window.wp.coreData;

    registerBlockType('macleans/list-card', {
        title: 'List Card',
        icon: 'cover-image',
        category: 'text',
        attributes: {
			selectedPost: { type: 'object', default: {} },
			image: { type: 'string', default: '' },
			title: { type: 'string', default: '' },
			description: { type: 'string', default: '' },
			byline: { type: 'string', default: '' },
			buttonText: { type: 'string', default: 'On to the list' },
			buttonLink: { type: 'string', default: '#' }
        },
        edit: (props) => {
            const { attributes, setAttributes } = props;
			const { selectedPost, image, title, description, byline, buttonText, buttonLink } = attributes;
			const [resolvedPosts, setResolvedPosts] = React.useState([]);
            const [hasPostsResolved, setHasPostsResolved] = React.useState(false);
            const [postCount, setPostCount] = React.useState(20);
			const [searchTerm, setSearchTerm] = React.useState('');
			const currentDate = new Date();
            const oneYearAgo = new Date(currentDate);
            oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

			const setSearchDebounced = useDebounce(( value ) => {
                if (value === '') {
                    setPostCount(100);
                } else {
                    setPostCount(20);
                }
				setSearchTerm( value );
			}, 500);

			const latestPosts = () => {
                if (searchTerm === '') {
                    return wp.apiFetch({
                        path: `/wp/v2/posts/?after=${oneYearAgo.toISOString()}&per_page=${postCount}&_embed=true`,
                    });
                }
                // Use wp.apiFetch to make a request to the WordPress REST API
                return wp.apiFetch({
                    path: `/wp/v2/posts/?after=${oneYearAgo.toISOString()}&search=${encodeURIComponent(searchTerm)}&per_page=${postCount}&_embed=true`,
                });
            };

            // const [search, setSearch] = useState('');
            // const { isResolving, records: posts } = useEntityRecords(
            //     'postType', 
            //     'post',
            //     {
            //         per_page: 10,
            //         search,
			// 		_embed: true
            //     }
            // );

			React.useEffect(() => {
                latestPosts().then(posts => {
                    setResolvedPosts(posts);
                    setHasPostsResolved(true);
                });
            }, [searchTerm]);

            return [
				el(InspectorControls,
					{ className: "block-editor-controls-custom"},
					el(
						PanelBody,
						{ title: 'List Card options' }, 
						el(
							PanelRow,
							{},
							el(wp.components.ComboboxControl, { 
								label: 'Search a Post',
								onChange: (value) => {
									
									if ( !value ) {
										setAttributes({
											selectedPost: null,
											image: '',
											title: '',
											description: '',
											byline: '',
											buttonLink: ''
										})
									} else {
										setAttributes({
											selectedPost: value,
											image: value._embedded['wp:featuredmedia'][0]?.source_url,
											title: value.title?.rendered,
											description: value.excerpt?.rendered,
											byline: value._embedded?.author[0]?.name ?? '',
											buttonLink: value.link
										})
									};
								},
								onFilterValueChange: (value) => {
									setSearchDebounced( value );
								},
								value: selectedPost,
								options: 
									!hasPostsResolved
										? [
												{
													label: 'Loading...',
													value: 'loading',
												},
										  ]
										: resolvedPosts?.map( ( post ) => ( {
												label: post?.title?.rendered,
												value: post,
										  } ) ) || []
							}),
						),
						el(
							'div',
							{ className: "newsletter-image-upload" },
							el(
								wp.blockEditor.MediaUpload,
								{   
									onSelect: (media) => props.setAttributes({ image: media.url }),
									allowedTypes: ['image'],
									value: attributes.image,
									render: ({ open }) => el(
										'div',
										null,
										el('span', { className: 'label' }, 'Upload Image:'),
										el(
											'button',
											{ onClick: open, className: 'btn btn-secondary' },
											'Select Image'
										)
									),
								}
							),
							el(
								'img',
								{ className: "newsletter-image-src", src: image }
							)
						),
						el(
							wp.components.TextControl,
							{
								label: 'Title',
								value: title,
								onChange: (value) => props.setAttributes({ title: value }),
							}
						),
						el(
							wp.components.TextControl,
							{
								label: 'Byline',
								value: byline,
								onChange: (value) => props.setAttributes({ byline: value }),
							}
						),
						el(
							wp.components.TextControl,
							{
								label: 'Button Text',
								value: buttonText,
								onChange: (value) => props.setAttributes({ buttonText: value }),
							}
						),
						el(
							PanelRow, {}, 
							el(wp.blockEditor.URLInput, {
								label: 'Button URL',
								value: buttonLink,
								__nextHasNoMarginBottom: true,
								onChange: (value) => props.setAttributes({ buttonLink: value })
							})
						)
					),
				),
				el('div', { className: 'block-editor-list-card' }, 
					[
						el('div', { className: 'list-card-image' }, 
							el('img', { src: image })
						),
						el('div', { className: 'list-card-content' }, [
							el('h3', {}, title),
							el(wp.blockEditor.RichText, { value: description, tagName: 'div', onChange: (value) => props.setAttributes({ description: value }), placeholder: 'Enter description' }),
							el('span', {}, byline),
							el('div', { className: 'list-card-button' }, 
								el('a', { href: buttonLink, className: 'btn btn-primary' }, buttonText)
							)
						])
					]
				)
			];
        }
    });
})();
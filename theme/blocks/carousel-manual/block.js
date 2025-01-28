(() => {
	const el = window.wp.element.createElement;
	const { registerBlockType } = window.wp.blocks;
	const { InspectorControls, MediaUpload, RichText, URLInputButton } = window.wp.blockEditor;
	const { PanelBody, PanelRow, Button } = window.wp.components;

	const replaceStraightApostrophes = (text) => {
        // Regular expression to find straight apostrophes
        const regex = /'/g;
        const newText = text.replace(regex, '’');
        return newText;
    };

	registerBlockType('macleans/carousel-manual', {
		title: 'Manual Carousel (Custom)',
		icon: 'slides',
		category: 'text',
		attributes: {
			title: {
				type: 'string',
				default: '',
			},
			theme: {
				type: 'string',
				default: 'light',
			},
			slides: {
				type: 'array',
				default: [],
			},
		},
		edit: (props) => {
			let { attributes: { slides, title, theme }, setAttributes } = props;
		
			// Initialize with four empty slides if slides array is empty
			if (slides.length === 0) {
				slides = [
					{ image: '', title: '', link: '', text: '', byline: '' },
					{ image: '', title: '', link: '', text: '', byline: '' },
					{ image: '', title: '', link: '', text: '', byline: '' },
					{ image: '', title: '', link: '', text: '', byline: '' }
				];
				setAttributes({ slides: slides });
			}
		
			const updateSlide = (index, field, value) => {
				const newSlides = slides.map((slide, slideIndex) => {
					if (index !== slideIndex) return slide;
					return { ...slide, [field]: value };
				});
				setAttributes({ slides: newSlides });
			};
		
			const addSlide = () => {
				const newSlides = [...slides, { image: '', title: '', link: '', text: '', byline: ''}];
				setAttributes({ slides: newSlides });
			};
		
			const removeSlide = (index) => {
				const newSlides = slides.filter((slide, slideIndex) => index !== slideIndex);
				setAttributes({ slides: newSlides });
			};
		
			return [
				el(
					InspectorControls,
					{},
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
						]
					),
				),
				el(
					'div',
					{ className: `block-editor-manual-carousel ${theme}` },
					[
						title && el( 'div', { className: 'carousel-title' }, 
							el( wp.blockEditor.RichText, {
								tagName: 'h2',
								value: title,
								onChange: ( value ) => setAttributes( { title: value } ),
								placeholder: 'Enter title here...'
							})
						),
						el(
							'div',
							{ className: 'carousel-slides' },
							slides.map((slide, index) => 
								el('div',
									{ className: 'carousel-slide' },
									el('div', { className: 'slide-image-container' },
										slide.image ? 
											el('img', { className: 'slide-image', src: slide.image.url }) :
											el('div', { className: 'no-image' }, 'Add an Image'),
										el(MediaUpload, {
											onSelect: (media) => updateSlide(index, 'image', media),
											render: ({ open }) => el('div', { className: 'image-button-container' },
												el(Button, { onClick: slide.image ? () => updateSlide(index, 'image', null) : open }, slide.image ? 'Remove Image' : 'Upload Image')
											)
										})
									),
									el(RichText, {
										tagName: 'h2',
										className: 'slide-title',
										value: replaceStraightApostrophes(slide.title || ''),
										onChange: (value) => updateSlide(index, 'title', value),
										placeholder: 'Enter title here...'
									}),
									el(RichText, {
										tagName: 'p',
										className: 'slide-text',
										value: replaceStraightApostrophes(slide.text || ''),
										onChange: (value) => updateSlide(index, 'text', value),
										placeholder: 'Enter subtitle here...' 
									}),
									// el(RichText, {
									// 	tagName: 'p',
									// 	className: 'slide-byline',
									// 	value: slide.byline,
									// 	onChange: (value) => updateSlide(index, 'byline', value),
									// 	placeholder: 'Enter byline here...' 
									// }),
									el('div', {className: 'slide-link'},
										el(wp.components.BaseControl, 
											{ label: 'Slide Link' },
											el(wp.blockEditor.URLInput, {
												value: slide.link,
												onChange: (value) => updateSlide(index, 'link', value)
											})
										),
									),
									el(Button, { className: 'remove-slide-button', onClick: () => removeSlide(index) }, 'Remove Slide')
								)
							)
						),
					],
				),
				el(Button, { className: 'add-slide-button', onClick: addSlide }, 'Add Slide')
			];
		},
		
		save: (props) => {
			const { attributes } = props;
			const { slides, title, theme } = attributes;
		
			return el(
				'div',
				{ className: `carousel ${theme}` },
				el('h2', { className: 'carousel-title' }, title),
				slides.map((slide) => 
					el(
						'div',
						{ className: 'slide' },
						slide.image ? el('img', { src: slide.image.url }) : null,
						el('h2', { className: 'slide-title' }, slide.title),
						el('a', { href: slide.link }, 'Link'),
						el('p', { className: 'slide-text' }, slide.text),
						// el('p', { className: 'slide-byline' }, slide.byline)
					)
				)
			);
		},
	});
})();
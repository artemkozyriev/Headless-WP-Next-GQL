/* global wp */

/**
 * Block editor modifications
 *
 * This file is loaded only by the block editor. Use it to modify the block
 * editor via its APIs.
 *
 * The JavaScript code you place here will be processed by esbuild, and the
 * output file will be created at `../theme/js/block-editor.min.js` and
 * enqueued in `../theme/functions.php`.
 *
 * For esbuild documentation, please see:
 * https://esbuild.github.io/
 */
import Swiper from 'swiper/bundle';

wp.domReady(() => {
    const { registerBlockStyle } = window.wp.blocks;
    const { registerFormatType } = window.wp.richText;

	registerBlockStyle('core/button', {
		name: 'outline',
		label: 'Outline',
		isDefault: true
	})

	registerBlockStyle('core/button', {
		name: 'primary',
		label: 'Primary',
	})

	registerBlockStyle('core/button', {
		name: 'secondary',
		label: 'Secondary',
	})

    registerFormatType("macleans/smallcaps", {
		title: wp.i18n.__("Small Caps", "macleans"),
		tagName: "span",
		className: "all-small-caps",
		edit({ isActive, value, onChange }) {
		  const onToggle = () => onChange(
			wp.richText.toggleFormat(value, {
			  type: "macleans/smallcaps",
			  title: wp.i18n.__("Small Caps", "macleans")
			})
		  );
		  return window.wp.element.createElement(
			window.wp.element.Fragment,
			{},
			[
			//   window.wp.element.createElement(
			// 	wp.blockEditor.RichTextShortcut,
			// 	{ type: "primary", character: "c", onUse: onToggle }
			//   ),
			  window.wp.element.createElement(
				wp.blockEditor.RichTextToolbarButton,
				{ icon: "editor-textcolor", title: wp.i18n.__("Small Caps", "macleans"), onClick: onToggle, isActive }
			  )
			]
		  );
		}
	});

	window.addEventListener('load', () => {
		const sliders = document.querySelectorAll('.swiper');
		
		for (const slider of sliders) {
			const swiper = new Swiper(slider, {
				slidesPerView: 1,
				navigation: true,
				pagination: {
					el: ".swiper-pagination",
					type: "bullets"
				}
			});
			
			if (slider.closest(".inline-magazine").clientWidth > 767) {
				swiper.destroy(true, true);
			} else {
				swiper.init();
			}
			
			slider.addEventListener("resize", () => {
				if (slider.closest(".inline-magazine").clientWidth > 767) {
					swiper.destroy(true, true);
				} else {
					swiper.init();
				}
			});
		}
	})
});

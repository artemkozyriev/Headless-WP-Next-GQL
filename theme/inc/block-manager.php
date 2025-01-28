<?php

/**
 * Default list of enabled/disabled blocks.
 *
 * @author Overhaul Media
 * @since 1.0.0
 * @return array Array of disabled blocks.
 */

function disable_specific_blocks( $allowed_block_types, $post ) {
    if ( ! is_array( $allowed_block_types ) ) {
        $allowed_block_types = array(
			'core/block', 
			'core/columns',
			'core/paragraph',
			'core/image',
			'core/heading',
			'core/gallery',
			'core/list',
			'core/list-item',
			'core/pullquote',
			'core/quote',
			'core/audio',
			'core/button',
			'core/buttons',
			'core/file',
			'core/group',
			'core/separator',
			'core/media-text',
			'core/freeform',
			'core/embed',
			'core/spacer',
			'core/query',
			'core/post-template',
			'core/post-excerpt',
			'core/post-featured-image',
			'core/post-title',
			'core/post-terms',
			'core/query-no-results',
			'core/footnotes',
			'macleans/home-header',
			'macleans/module',
			'macleans/inline-magazine',
			'macleans/module-5050',
			'macleans/newsletter-signup',
			'macleans/related',
			'macleans/table-of-contents',
			'macleans/list-card',
			'variation;core/embed;tiktok',
			'variation;core/embed;reddit',
			'variation;core/embed;dailymotion',
			'macleans/post-selector',
			'macleans/carousel',
			'macleans/grid',
			'macleans/module-full-width',
			'macleans/post-header',
			'macleans/video-block',
			'macleans/video-featured',
			'macleans/video-column',
			'macleans/carousel-manual'
		);
    }
    
    // An array of block names to disable
    $disabled_blocks = array(
		'core/archives',
		'core/calendar',
		'core/html',
		'core/latest-comments',
		'core/more',
		'core/nextpage',
		'core/rss',
		'core/search',
		'core/shortcode',
		'core/tag-cloud',
		'core/table',
		'core/cover',
		'core/verse',
		'variation;core/embed;amazon-kindle',
		'variation;core/embed;animoto',
		'variation;core/embed;cloudup',
		'variation;core/embed;collegehumor',
		'variation;core/embed;crowdsignal',
		'variation;core/embed;flickr',
		'variation;core/embed;issuu',
		'variation;core/embed;kickstarter',
		'variation;core/embed;meetup-com',
		'variation;core/embed;reverbnation',
		'variation;core/embed;screencast',
		'variation;core/embed;scribd',
		'variation;core/embed;slideshare',
		'variation;core/embed;smugmug',
		'variation;core/embed;soundcloud',
		'variation;core/embed;ted',
		'variation;core/embed;tumblr',
		'variation;core/embed;videopress',
		'variation;core/embed;wordpress',
		'variation;core/embed;wordpress-tv',
    );
  
    // Use this condition to disable blocks on certain post types, otherwise you can remove this IF condition
    if ( $post->post_type === 'post' ) {
        $allowed_block_types = array_diff( $allowed_block_types, $disabled_blocks );
    }

    return $allowed_block_types;
}
add_filter( 'allowed_block_types_all', 'disable_specific_blocks', 10, 2 );

?>
<?php

add_action( 'init', 'register_longform_posttype' );
add_action( 'pre_get_posts', 'add_longforms_to_query' );
add_action( 'admin_init', 'add_longform_shortcode_button' );
add_shortcode( 'acf_longform', 'acf_longform_snippets' );

/**
 * Register Longform Post Type
 *
 */
function register_longform_posttype() {
	$labels = array(
		'name' => __('Longforms'),
		'singular_name' => __('Longform'),
		'add_new' => __('Add New'),
		'add_new_item' => __('Add New Longform'),
		'edit_item' => __('Edit Longform'),
		'new_item' => __('New Longform'),
		'all_items' => __('All Longforms'),
		'view_item' => __('View Longform'),
		'search_items' => __('Search Longforms'),
		'not_found' => __('No Longforms found'),
		'not_found_in_trash' => __('No Longforms found in Trash'),
		'parent_item_colon' => '',
		'menu_name' => __('Longforms', 'admin menu')
	);

	register_post_type(
		'sjh_longform',
		array(
			'labels' => $labels,
            'public' => true,
			'menu_position' => 5,
			'menu_icon' => 'dashicons-media-text',
			// 'rewrite' => array( 'slug' => 'longforms' ),
			'description' => 'Longform Articles',
			'show_in_rest' => true,
			'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'revisions', 'custom-fields'),
			'taxonomies' => array('category', 'post_tag'),
		)
	);
}

/**
 * Add Longforms to the main query so they can be displayed on site
 *
 * @param WP_Query $query The query to filter.
 * 
 */
function add_longforms_to_query( $query ) {
	if ( isset( $query->query_vars['suppress_filters'] ) && $query->query_vars['suppress_filters'] ) {
		return $query;
	}

	if ( ! is_admin() && $query->is_main_query() ) {

		$post_types = $query->get( 'post_type' );

		if ( ! $post_types || 'post' === $post_types ) {
			$post_types = array( 'post', 'sjh_longform' );
		} elseif ( is_array( $post_types ) ) {
			array_push( $post_types, 'sjh_longform' );
		}

		$query->set( 'post_type', $post_types );

	}
	return $query;
}

/**
 * Add Longform Shortcode Button to TinyMCE
 * 
 */
function add_longform_shortcode_button() {
	$post_type = get_post_type( @$_GET['post'] );
	if ( get_user_option( 'rich_editing' ) == 'true' && $post_type == 'sjh_longform' ) {
		add_filter( 'mce_external_plugins', 'longform_tinymce_plugin' );
		add_filter( 'mce_buttons', 'register_longform_button' );
	}
}

function longform_tinymce_plugin( $plugin_array ) {
	$plugin_array['longform_button'] = get_template_directory_uri() . '/assets/scripts/lib/tinymce-longform.min.js';
    return $plugin_array;
}

function register_longform_button( $buttons ) {
    array_push( $buttons, 'longform_button' );
    return $buttons;
}

/**
 * Define shortcodes for ACF values in Longform posts.
 * Currently supports Full Width Images, 2-Image Split Layouts, Pullquotes and Carousel Galleries
 * 
 */
function acf_longform_snippets( $atts ) {
	extract( shortcode_atts( array(
		'field'	=> '',
		'id' => ''
	), $atts ) );

	$id = intval($id) - 1; // repeater index starts at 0 in backend instead of 1

	// check which field is used and generate appropriate HTML snippet
	switch ( $field ) {
		case 'longform_full_width_image':
			$image = get_post_custom_values('longform_full_width_images_' . $id . '_full_width_image');
			if (!empty($image[0])) {
				$image_src = wp_get_attachment_image_url($image[0], 'full');
				if ($image_src === false) {
					$image_src = wp_get_attachment_image_url($image[0], 'large');
				}
				if ($image_src === false) {
					$image_src = wp_get_attachment_image_url($image[0], 'medium');
				}
				$caption = wp_get_attachment_caption( $image[0] );
			}
			
			$html = '<div class="longform-fwimg-container image-' . $id . '">';
			$html .= '<img class="full-width-image" src="' . $image_src . '" alt="' . $image['alt'] . '">';
			$html .= '<p class="wp-caption-text text-sm leading-sm">' . $caption . '</p>';
			$html .= '</div>';
		break;
		case 'longform_split_images':
			$image1 = get_post_custom_values('longform_split_images_' . $id . '_image_1');
			$image2 = get_post_custom_values('longform_split_images_' . $id . '_image_2');
			$image_src1 = wp_get_attachment_image_url($image1[0], 'full');
			if ($image_src1 === false) {
				$image_src1 = wp_get_attachment_image_url($image1[0], 'large');
			}
			$caption1 = wp_get_attachment_caption( $image1[0] );
			$image_src2 = wp_get_attachment_image_url($image2[0], 'full');
			if ($image_src2 === false) {
				$image_src2 = wp_get_attachment_image_url($image2[0], 'large');
			}
			$caption2 = wp_get_attachment_caption( $image2[0] );
			$html = '<div class="row split-images-container">';
			$html .= '<div class="col-12 col-md-6"><img src="' . $image_src1 . '" alt="' . $image1['alt'] . '"><p class="wp-caption-text text-sm leading-sm">' . $caption1 . '</p></div>';
			$html .= '<div class="col-12 col-md-6"><img src="' . $image_src2 . '" alt="' . $image2['alt'] . '"><p class="wp-caption-text text-sm leading-sm">' . $caption2 . '</p></div>';
			$html .= '</div>';
		break;
		case 'longform_pullquotes':
			$pullquote = get_post_custom_values('longform_pullquotes_' . $id . '_pullquote_text');
			$html = '<blockquote class="wp-pull-quote alignwide has-primary-color has-text-color has-small-font-size">';
			$html .= '<p class="longform-pullquote">' . $pullquote[0]  . '</p>';
			$html .= '</blockquote>';
		break;
		// case 'longform_sidebars':
			// $sidebar = get_post_custom_values('longform_sidebars_' . $id . '_sidebar');
			// $html = '</div>'; // end main content div
			// if (intval($sidebar['position']) != 1) {
			// 	$html .= '<aside class="longform-sidebar float-left">' . $sidebar['content'] . '</aside><div class="longform-main-content">';
			// } else {
			// 	$html .= '<aside class="longform-sidebar float-right">' . $sidebar['content'] . '</aside><div class="longform-main-content">';
			// }
			// break;
		case 'longform_carousel_gallery':
			$slide_html = '';
			$html = '<div id="longform-carousel-container" class="carousel slide glide" data-interval="false" data-ride="carousel"><div class="carousel-inner swiper-container glide__track" data-glide-el="track">';
			$carousel_images = get_post_custom_values( $field );
			$carousel_image_ids = unserialize($carousel_images[0]);
			$html .= '<div class="glide__slides">';
			foreach ( $carousel_image_ids as $i => $image ) {
				$image_src = wp_get_attachment_image_url($image, 'full');
				$image_alt = get_post_meta($image, '_wp_attachment_image_alt', TRUE);
				$caption = wp_get_attachment_caption( $image );
				if ( $i == 0 ) {
					$slide_html .= '<div class="carousel-item glide__slide active"><img src="' . $image_src . '" alt="' . $image_alt . '" class="d-block w-100"><p class="wp-caption-text">' . $caption . '</p></div>';
				} else {
					$slide_html .= '<div class="carousel-item glide__slide"><img src="' . $image_src . '" alt="' . $image_alt . '" class="d-block w-100"><p class="wp-caption-text">' . $caption . '</p></div>';
				}
			}
			$html .= $slide_html;
			$html .= '</div>';
			$html .= '</div>';
			$html .= '<div data-glide-el="controls"><a class="carousel-control-prev" role="button" data-target="#longform-carousel-container" data-slide="prev" data-glide-dir="<"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>';
			$html .= '<a class="carousel-control-next" role="button" data-target="#longform-carousel-container" data-slide="next" data-glide-dir=">"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div></div>';
		break;
	}
	return $html;
}

// Example loop to display both post and sjh_longform post types
// $args = array(
//     'post_type' => array( 'post', 'sjh_longform' ),
//     'posts_per_page' => 20 // Display all posts, you can adjust this number as needed
// );
// $query = new WP_Query( $args );

// if ( $query->have_posts() ) :
//     while ( $query->have_posts() ) : $query->the_post();
//         // Display post content
//         the_title();
//         the_content();
//     endwhile;
// endif;
// wp_reset_postdata();
<?php
/**
 * macleans functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package macleans
 */

if ( ! defined( 'MACLEANS_VERSION' ) ) {
	/*
	 * Set the theme’s version number.
	 *
	 * This is used primarily for cache busting. If you use `npm run bundle`
	 * to create your production build, the value below will be replaced in the
	 * generated zip file with a timestamp, converted to base 36.
	 */
	define( 'MACLEANS_VERSION', '0.1.0' );
}

if ( ! defined( 'MACLEANS_TYPOGRAPHY_CLASSES' ) ) {
	/*
	 * Set Tailwind Typography classes for the front end, block editor and
	 * classic editor using the constant below.
	 *
	 * For the front end, these classes are added by the `macleans_content_class`
	 * function. You will see that function used everywhere an `entry-content`
	 * or `page-content` class has been added to a wrapper element.
	 *
	 * For the block editor, these classes are converted to a JavaScript array
	 * and then used by the `./javascript/block-editor.js` file, which adds
	 * them to the appropriate elements in the block editor (and adds them
	 * again when they’re removed.)
	 *
	 * For the classic editor (and anything using TinyMCE, like Advanced Custom
	 * Fields), these classes are added to TinyMCE’s body class when it
	 * initializes.
	 */
	define(
		'MACLEANS_TYPOGRAPHY_CLASSES',
		'prose prose-neutral max-w-none prose-a:text-primary'
	);
}

if ( ! function_exists( 'macleans_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function macleans_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on macleans, use a find and replace
		 * to change 'macleans' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'macleans', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		// add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in two locations.
		register_nav_menus(
			array(
				'menu-1' => __( 'Primary', 'macleans' ),
				'menu-secondary' => __( 'Secondary', 'macleans' ),
				'menu-2' => __( 'Footer Menu', 'macleans' ),
				'footer-menu' => __( 'New Footer Menu', 'macleans' ),
				'footer-menu-secondary' => __( 'New Footer Secondary Menu', 'macleans' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		// Add support for editor styles.
		add_theme_support( 'editor-styles' );

		// Enqueue editor styles.
		add_editor_style( 'style-editor.css' );

		// Add support for responsive embedded content.
		add_theme_support( 'responsive-embeds' );

		// Remove support for block templates.
		remove_theme_support( 'block-templates' );
	}
endif;
add_action( 'after_setup_theme', 'macleans_setup' );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function macleans_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Footer', 'macleans' ),
			'id'            => 'sidebar-1',
			'description'   => __( 'Add widgets here to appear in your footer.', 'macleans' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'macleans_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function macleans_scripts() {
	wp_enqueue_style( 'macleans-style', get_stylesheet_uri(), array(), MACLEANS_VERSION );
	wp_enqueue_script( 'macleans-script', get_template_directory_uri() . '/js/script.min.js', array(), MACLEANS_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'macleans_scripts' );

/**
 * Enqueue the block editor script.
 */
function macleans_enqueue_block_editor_script() {
	wp_enqueue_script(
		'macleans-editor',
		get_template_directory_uri() . '/js/block-editor.min.js',
		array(
			'wp-blocks',
			'wp-edit-post',
		),
		MACLEANS_VERSION,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'macleans_enqueue_block_editor_script' );

/**
 * Enqueue the script necessary to support Tailwind Typography in the block
 * editor, using an inline script to create a JavaScript array containing the
 * Tailwind Typography classes from MACLEANS_TYPOGRAPHY_CLASSES.
 */
function macleans_enqueue_typography_script() {
	if ( is_admin() ) {
		wp_enqueue_script(
			'macleans-typography',
			get_template_directory_uri() . '/js/tailwind-typography-classes.min.js',
			array(
				'wp-blocks',
				'wp-edit-post',
			),
			MACLEANS_VERSION,
			true
		);
		wp_add_inline_script( 'macleans-typography', "tailwindTypographyClasses = '" . esc_attr( MACLEANS_TYPOGRAPHY_CLASSES ) . "'.split(' ');", 'before' );
	}
}
add_action( 'enqueue_block_assets', 'macleans_enqueue_typography_script' );

/**
 * Add the Tailwind Typography classes to TinyMCE.
 *
 * @param array $settings TinyMCE settings.
 * @return array
 */
function macleans_tinymce_add_class( $settings ) {
	$settings['body_class'] = MACLEANS_TYPOGRAPHY_CLASSES;
	return $settings;
}
add_filter( 'tiny_mce_before_init', 'macleans_tinymce_add_class' );

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Custom category.
 */
add_filter( 'block_categories_all' , function( $categories ) {

    // Adding a new category.
	$categories[] = array(
		'slug'  => 'custom',
		'title' => 'Custom'
	);

	return $categories;
} );

// Register and include custom field in REST API response
function register_featured_video_field() {
    register_rest_field(
        array('post'),
        'featured_video_url',
        array(
            'get_callback' => 'get_featured_video_url',
            'update_callback' => 'update_featured_video_url',
            'schema' => null,
        )
    );
}
add_action('rest_api_init', 'register_featured_video_field');

// Get callback for the custom field
function get_featured_video_url($object, $field_name, $request) {
    return get_post_meta($object['id'], $field_name, true);
}

// Update callback for the custom field
function update_featured_video_url($value, $post, $field_name) {
    update_post_meta($post->ID, $field_name, sanitize_text_field($value));
}

// Add custom meta box to the post sidebar after the featured image
function add_youtube_video_meta_box() {
    add_meta_box(
        'youtube_video_meta_box',
        'YouTube Video',
        'render_youtube_video_meta_box',
        'post', // You can change this to 'page' or any other post type
        'side', // Position of the meta box (e.g., 'normal', 'advanced', or 'side')
        'high' 
    );
}
add_action('add_meta_boxes', 'add_youtube_video_meta_box');

// Render the content of the meta box
function render_youtube_video_meta_box($post) {
    // Retrieve the current value of the featured video URL
    $featured_video_url = get_post_meta($post->ID, 'featured_video_url', true);

    // Output a nonce field for verification
    wp_nonce_field('featured_video_nonce', 'featured_video_nonce');

    // Output the text field
    ?>
    <label for="featured_video_url">YouTube Video URL:</label>
    <input type="text" id="featured_video_url" name="featured_video_url" value="<?php echo esc_attr($featured_video_url); ?>" style="width: 100%;">
    <?php
}

// Save the meta box data
function save_youtube_video_meta_box($post_id) {
    // Check if the nonce is set
    if (!isset($_POST['featured_video_nonce'])) {
        return;
    }

    // Verify that the nonce is valid
    if (!wp_verify_nonce($_POST['featured_video_nonce'], 'featured_video_nonce')) {
        return;
    }

    // Check if the current user has permission to save the post
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save the featured video URL
    if (isset($_POST['featured_video_url'])) {
        update_post_meta($post_id, 'featured_video_url', sanitize_text_field($_POST['featured_video_url']));
    }
}
add_action('save_post', 'save_youtube_video_meta_box');

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'featured_video_url', [
	   'type' => 'String',
	   'description' => __( 'Featured video url', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'featured_video_url', true );
		 return ! empty( $color ) ? $color : '';
	   }
	]);
});

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'sponsor_prefix', [
	   'type' => 'String',
	   'description' => __( 'Sponsor prefix', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'sponsor_prefix', true );
		 return ! empty( $color ) ? $color : '';
	   }
	]);
});

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'sponsor_logo', [
	   'type' => 'String',
	   'description' => __( 'Sponsor logo', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'sponsor_logo', true );
		 return ! empty( $color ) ? $color : '';
	   }
	]);
});

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'sponsor_url', [
	   'type' => 'String',
	   'description' => __( 'Sponsor url', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'sponsor_url', true );
		 return ! empty( $color ) ? $color : '';
	   }
	]);
});

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'sponsor_name', [
	   'type' => 'String',
	   'description' => __( 'Sponsor name', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'sponsor_name', true );
		 return ! empty( $color ) ? $color : '';
	   }
	]);
});

// Add a new field to GraphQL output
// add_filter( 'graphql_post_object_type', function( $type, $context ) {
//     // Add a new field to the post type
//     $type['fields']['featured_video_url'] = [
//         'type' => 'String',
//         'description' => 'The featured YouTube video URL',
//         'resolve' => function( $post ) {
//             // Get the value of the featured video URL for this post
//             return get_post_meta( $post->ID, '_featured_video_url', true );
//         },
//     ];

//     return $type;
// }, 10, 2 );

function enqueue_custom_styles() {
    wp_enqueue_style('custom-styles', get_template_directory_uri() . '/custom-styles.css');
}

add_action('admin_enqueue_scripts', 'enqueue_custom_styles');


/**
 * Post views.
 */
// function gt_get_post_view() {
//     $count = get_post_meta( get_the_ID(), 'post_views_count', true );
//     return $count;
// }

// function gt_set_post_view() {
//     $key = 'post_views_count';
//     $post_id = get_the_ID();
//     $count = (int) get_post_meta( $post_id, $key, true );
//     $count++;
//     update_post_meta( $post_id, $key, $count );
// }

// function gt_posts_column_views( $columns ) {
//     $columns['post_views'] = 'Views';
//     return $columns;
// }

// function gt_posts_custom_column_views( $column ) {
//     if ( $column === 'post_views') {
//         echo gt_get_post_view();
//     }
// }

// add_filter( 'manage_posts_columns', 'gt_posts_column_views' );
// add_action( 'manage_posts_custom_column', 'gt_posts_custom_column_views' );

// // Add post views count to REST API response
// function add_views_count_to_rest_api() {
//     register_rest_field(
//         'post',
//         'post_views',
//         array(
//             'get_callback' => 'gt_get_post_view_for_rest_api',
//             'update_callback' => 'gt_set_post_view',
//             'schema' => null,
//         )
//     );
// }

// add_action('rest_api_init', 'add_views_count_to_rest_api');

// // Callback function to get post views count for REST API
// function gt_get_post_view_for_rest_api($object) {
//     // $object contains the current post
//     $post_id = $object['id'];
//     return gt_get_post_view($post_id);
// }


function gt_get_post_view($post_id, $time_range = 'total') {
    $key = 'post_views_count';
    $count = get_post_meta($post_id, $key, true);

    // If total views are requested, return the count
    if ($time_range === 'total') {
        return $count;
    }

    // Calculate the timestamp for the start of the time range
    $start_timestamp = current_time('timestamp') - ($time_range === '24h' ? 24 * 60 * 60 : 60 * 60);

    // Get views within the specified time range
    $views = get_post_meta($post_id, 'post_views_timestamp', true);
    $views_within_range = 0;

    if ($views) {
        foreach ($views as $timestamp => $view_count) {
            if ($timestamp >= $start_timestamp) {
                $views_within_range += $view_count;
            }
        }
    }

    return (int) $views_within_range;
}

function gt_set_post_view($post_id) {
    $key = 'post_views_count';
    $timestamp_key = 'post_views_timestamp';
    // $post_id = get_the_ID();

    // Get the current timestamp
    $current_timestamp = current_time('timestamp');

    // Update total views count
    $count = (int) get_post_meta($post_id, $key, true);
    $count++;
    update_post_meta($post_id, $key, $count);

    // Update timestamped views
    $views = get_post_meta($post_id, $timestamp_key, true) ?: array();
    $views[$current_timestamp] = isset($views[$current_timestamp]) ? $views[$current_timestamp] + 1 : 1;
    update_post_meta($post_id, $timestamp_key, $views);
}

// Add post views count to REST API response
function add_views_count_to_rest_api() {
    register_rest_field(
        'post',
        'post_views',
        array(
            'get_callback'    => 'gt_get_post_view_for_rest_api',
            'update_callback' => 'gt_set_post_view',
            'schema'          => null,
        )
    );
}

add_action('rest_api_init', 'add_views_count_to_rest_api');

// Callback function to get post views count for REST API
function gt_get_post_view_for_rest_api($object, $field_name, $request) {
    // $object contains the current post
    $post_id = $object['id'];

    // Get total views for the last 24 hours and last 1 hour
    $total_views = gt_get_post_view($post_id, 'total');
    $views_last_24h = gt_get_post_view($post_id, '24h');
    $views_last_1h = gt_get_post_view($post_id, '1h');

    return array(
        'total_views'    => (int) $total_views,
        'views_last_24h' => (int) $views_last_24h,
        'views_last_1h'  => (int) $views_last_1h,
    );
}

function update_views_count_endpoint() {
    register_rest_route('your_namespace/v1', '/blog/update-views/(?P<post_id>\d+)', array(
        'methods'  => 'POST',
        'callback' => 'update_views_count_callback',
    ));
}

function update_views_count_callback($data) {
    $post_id = $data['post_id'];
    gt_set_post_view($post_id);
    return array('success' => true);
}

add_action('rest_api_init', 'update_views_count_endpoint');

function add_cors_headers($headers) {
    $headers['Access-Control-Allow-Origin'] = '*';
    $headers['Access-Control-Allow-Methods'] = 'POST';
    $headers['Access-Control-Allow-Credentials'] = true;
    return $headers;
}

add_filter('wp_headers', 'add_cors_headers');


/**
 * Custom blocks.
 */

 /**
 * Remove default blocks.
 */
require_once 'inc/block-manager.php';

/**
 * Custom blocks. Home header.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_assets');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets');

function my_enqueue_assets() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('my-block', $css_dir . '/block.css', []);
}

function my_enqueue_block_assets() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/home-header';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/home-header';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('my-block', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('post-grid', $js_dir . '/post-grid.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('aside', $js_dir . '/aside.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('my-block', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks.
 */

// add_action('wp_enqueue_scripts', 'my_enqueue_assets11');
// add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets11');

// function my_enqueue_assets11() {
// 	$css_dir = get_stylesheet_directory_uri() . '/css';
// 	wp_enqueue_style('two-posts', $css_dir . '/two-posts.css', []);
// }

// function my_enqueue_block_assets11() {
// 	$css_dir = get_stylesheet_directory_uri() . '/blocks/home-header';
// 	$js_dir = get_stylesheet_directory_uri() . '/blocks/home-header';

// 	wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
// 	wp_enqueue_style('two-posts', $css_dir . '/two-posts.css', [ 'wp-edit-blocks' ]);
// }

/**
 * Custom blocks.
 */

//  add_action('wp_enqueue_scripts', 'my_enqueue_assets12');
//  add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets12');
 
//  function my_enqueue_assets12() {
// 	 $css_dir = get_stylesheet_directory_uri() . '/css';
// 	 wp_enqueue_style('three-posts', $css_dir . '/three-posts.css', []);
//  }
 
//  function my_enqueue_block_assets12() {
// 	 $css_dir = get_stylesheet_directory_uri() . '/blocks/home-header';
// 	 $js_dir = get_stylesheet_directory_uri() . '/blocks/home-header';
 
// 	 wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
// 	 wp_enqueue_style('three-posts', $css_dir . '/three-posts.css', [ 'wp-edit-blocks' ]);
//  }

 /**
 * Custom blocks.
 */

//  add_action('wp_enqueue_scripts', 'my_enqueue_assets13');
//  add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets13');
 
//  function my_enqueue_assets13() {
// 	 $css_dir = get_stylesheet_directory_uri() . '/css';
// 	 wp_enqueue_style('featured-post', $css_dir . '/featured-post.css', []);
//  }
 
//  function my_enqueue_block_assets13() {
// 	 $css_dir = get_stylesheet_directory_uri() . '/blocks/home-header';
// 	 $js_dir = get_stylesheet_directory_uri() . '/blocks/home-header';
 
// 	 wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
// 	 wp_enqueue_style('featured-post', $css_dir . '/featured-post.css', [ 'wp-edit-blocks' ]);
//  }

/**
 * Custom blocks. Post selector.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_assets_post');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets_post');

function my_enqueue_assets_post() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('post-selector', $css_dir . '/block.css', []);
}

function my_enqueue_block_assets_post() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/post-selector';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/post-selector';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('post-selector', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('post-selector', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks. Newsletter Signup.
 */

 add_action('wp_enqueue_scripts', 'my_enqueue_assets_newsletter_signup');
 add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets_newsletter_signup');
 
 function my_enqueue_assets_newsletter_signup() {
	 $css_dir = get_stylesheet_directory_uri() . '/css';
	 wp_enqueue_style('newsletter', $css_dir . '/block.css', []);
 }
 
 function my_enqueue_block_assets_newsletter_signup() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/newsletter-signup';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/newsletter-signup';
 
	 // If in plugin, use this instead:
	 // $css_dir = plugin_dir_url(__FILE__) . 'css';
	 // $js_dir = plugin_dir_url(__FILE__) . 'js';
 
	 wp_enqueue_script('newsletter-signup', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('newsletter-signup', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }

/**
 * Custom blocks. Newsletter.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_assets_newsletter');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets_newsletter');

function my_enqueue_assets_newsletter() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('newsletter', $css_dir . '/block.css', []);
}

function my_enqueue_block_assets_newsletter() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/newsletter';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/newsletter';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('newsletter', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('newsletter', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks. Latest posts.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_assets_latest_posts');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_assets_latest_posts');

function my_enqueue_assets_latest_posts() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('latest-posts', $css_dir . '/block.css', []);
}

function my_enqueue_block_assets_latest_posts() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/latest-posts';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/latest-posts';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('latest-posts', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('latest-posts', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks. Module.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_module');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_module');

function my_enqueue_module() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('module', $css_dir . '/block.css', []);
}

function my_enqueue_block_module() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/module';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/module';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('module', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('module-featured', $js_dir . '/module-featured.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('module-column', $js_dir . '/module-column.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('module-column-two', $js_dir . '/module-column-two.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_script('module-column-four', $js_dir . '/module-column-four.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('module', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

 /**
  * Custom blocks. Module 50/50.
  */
 
add_action('enqueue_block_editor_assets', 'my_enqueue_block_module_5050');

function my_enqueue_block_module_5050() {
$css_dir = get_stylesheet_directory_uri() . '/blocks/module-50-50';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/module-50-50';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('macleans-module-50-50', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('module-50-50', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks. Module Full Width.
 */

add_action('enqueue_block_editor_assets', 'my_enqueue_block_module_full_width');

function my_enqueue_block_module_full_width() {
   $css_dir = get_stylesheet_directory_uri() . '/blocks/module-full-width';
   $js_dir = get_stylesheet_directory_uri() . '/blocks/module-full-width';

   // If in plugin, use this instead:
   // $css_dir = plugin_dir_url(__FILE__) . 'css';
   // $js_dir = plugin_dir_url(__FILE__) . 'js';

   wp_enqueue_script('macleans-module-full-width', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
   // wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
   // wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
   // wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
   wp_enqueue_style('module-full-width', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom block. Module Header Full Width.
 */

//  add_action('enqueue_block_editor_assets', 'my_enqueue_block_module_header_full_width');

//  function my_enqueue_block_module_header_full_width() {
// 	$css_dir = get_stylesheet_directory_uri() . '/blocks/module-header-full-width';
// 	$js_dir = get_stylesheet_directory_uri() . '/blocks/module-header-full-width';
 
// 	wp_enqueue_script('macleans-module-header-full-width', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
// 	wp_enqueue_style('module-header-full-width', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
//  }

/**
 * Custom blocks. Related Posts.
 */

 add_action('wp_enqueue_scripts', 'my_enqueue_related');
 add_action('enqueue_block_editor_assets', 'my_enqueue_block_related');
 
 function my_enqueue_related() {
	 $css_dir = get_stylesheet_directory_uri() . '/css';
	 wp_enqueue_style('related', $css_dir . '/block.css', []);
 }
 
 function my_enqueue_block_related() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/related';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/related';
 
	 wp_enqueue_script('related', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);;
	 wp_enqueue_style('related', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }


/**
 * Custom blocks. Carousel.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_carousel');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_carousel');

function my_enqueue_carousel() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('carousel', $css_dir . '/block.css', []);
}

function my_enqueue_block_carousel() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/carousel';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/carousel';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('carousel', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('carousel', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks. Grid.
 */

add_action('wp_enqueue_scripts', 'my_enqueue_grid');
add_action('enqueue_block_editor_assets', 'my_enqueue_block_grid');

function my_enqueue_grid() {
	$css_dir = get_stylesheet_directory_uri() . '/css';
	wp_enqueue_style('grid', $css_dir . '/block.css', []);
}

function my_enqueue_block_grid() {
	$css_dir = get_stylesheet_directory_uri() . '/blocks/grid';
	$js_dir = get_stylesheet_directory_uri() . '/blocks/grid';

	// If in plugin, use this instead:
	// $css_dir = plugin_dir_url(__FILE__) . 'css';
	// $js_dir = plugin_dir_url(__FILE__) . 'js';

	wp_enqueue_script('grid', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	// wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	wp_enqueue_style('grid', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

/**
 * Custom blocks. Video Block.
 */

 add_action('wp_enqueue_scripts', 'my_enqueue_video_block');
 add_action('enqueue_block_editor_assets', 'my_enqueue_block_video_block');
 
 function my_enqueue_video_block() {
	 $css_dir = get_stylesheet_directory_uri() . '/css';
	 wp_enqueue_style('video-block', $css_dir . '/block.css', []);
 }
 
 function my_enqueue_block_video_block() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/video-block';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/video-block';
 
	 // If in plugin, use this instead:
	 // $css_dir = plugin_dir_url(__FILE__) . 'css';
	 // $js_dir = plugin_dir_url(__FILE__) . 'js';
 
	 wp_enqueue_script('video-block', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_script('video-featured', $js_dir . '/video-featured.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_script('video-column', $js_dir . '/video-column.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 // wp_enqueue_script('two-posts', $js_dir . '/two-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 // wp_enqueue_script('three-posts', $js_dir . '/three-posts.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 // wp_enqueue_script('featured-post', $js_dir . '/featured-post.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('video-block', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }

/**
 * Custom blocks. Inline Magazine.
 */

 add_action('enqueue_block_editor_assets', 'my_enqueue_block_inline_magazine');

 function my_enqueue_block_inline_magazine() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/inline-magazine';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/inline-magazine';
 
	 // If in plugin, use this instead:
	 // $css_dir = plugin_dir_url(__FILE__) . 'css';
	 // $js_dir = plugin_dir_url(__FILE__) . 'js';
 
	 wp_enqueue_script('inline-magazine', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('inline-magazine', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }

/**
 * Custom blocks. Inline Magazine.
 */

 add_action('enqueue_block_editor_assets', 'my_enqueue_block_post_header');

 function my_enqueue_block_post_header() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/post-header';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/post-header';
 
	 // If in plugin, use this instead:
	 // $css_dir = plugin_dir_url(__FILE__) . 'css';
	 // $js_dir = plugin_dir_url(__FILE__) . 'js';
 
	 wp_enqueue_script('post-header', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('post-header', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }


/**
 * Custom blocks. Table of Contents.
 */

 add_action('enqueue_block_editor_assets', 'my_enqueue_block_table_contents');

 function my_enqueue_block_table_contents() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/table-of-contents';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/table-of-contents';
 
	 // If in plugin, use this instead:
	 // $css_dir = plugin_dir_url(__FILE__) . 'css';
	 // $js_dir = plugin_dir_url(__FILE__) . 'js';
 
	 wp_enqueue_script('table-of-contents', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('table-of-contents', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }


/**
 * Custom blocks. List Card.
 */

 add_action('enqueue_block_editor_assets', 'my_enqueue_block_list_card');

 function my_enqueue_block_list_card() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/list-card';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/list-card';
 
	 // If in plugin, use this instead:
	 // $css_dir = plugin_dir_url(__FILE__) . 'css';
	 // $js_dir = plugin_dir_url(__FILE__) . 'js';
 
	 wp_enqueue_script('list-card', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('list-card', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
 }

/**
 * Custom blocks. Manual Carousel .
 */

 add_action('wp_enqueue_scripts', 'my_enqueue_carousel_manual');
 add_action('enqueue_block_editor_assets', 'my_enqueue_block_carousel_manual');
 
 function my_enqueue_carousel_manual() {
	 $css_dir = get_stylesheet_directory_uri() . '/css';
	 wp_enqueue_style('carousel-manual', $css_dir . '/block.css', []);
 }
 
 function my_enqueue_block_carousel_manual() {
	 $css_dir = get_stylesheet_directory_uri() . '/blocks/carousel-manual';
	 $js_dir = get_stylesheet_directory_uri() . '/blocks/carousel-manual';
 
	 wp_enqueue_script('carousel-manual', $js_dir . '/block.js', [ 'wp-blocks', 'wp-dom' ] , null, true);
	 wp_enqueue_style('carousel-manual', $css_dir . '/block.css', [ 'wp-edit-blocks' ]);
}

add_filter('get_the_excerpt', function( $post_excerpt, $post ) {
	if ( has_excerpt( get_the_ID($post) ) ) {
		return $post_excerpt;
	}

	$excerpt = get_the_content('', false, $post);
	$excerpt = strip_shortcodes( $excerpt );
	$excerpt = strip_tags( $excerpt, ['<p>', '<br>', '<em>', '<strong>']);
	$excerpt = excerpt_remove_blocks( $excerpt );
	$excerpt = excerpt_remove_footnotes( $excerpt );
	
	if ( strpos($excerpt, '</p>') === false ) {
		return strtok( $excerpt, "\n");
	}
	else {
		return substr( $excerpt, 0, strpos($excerpt, '</p>') + 4 );
	}
}, 10, 2);

add_filter( 'user_contactmethods', 'macleans_modify_user_contact_methods' );

function macleans_modify_user_contact_methods( $methods ) {
	$methods['tiktok'] = 'Tiktok';

	unset( $methods['myspace'] );
	unset( $methods['pinterest'] );
	unset( $methods['soundcloud'] );
	unset( $methods['tumblr'] );

	return $methods;
}

add_filter( 'wpseo_person_social_profile_fields', function( $fields ) {
	$fields['tiktok'] = 'get_non_valid_url';
	return $fields;
}, 10, 1);

/**
 * Add custom blocks to post.
 */
function myplugin_register_template() {
	$post_type_object = get_post_type_object( 'post' );
	$post_type_object->template = array(
		array( 'macleans/post-header' ),
		array( 'macleans/newsletter-signup' ),
		array( 'macleans/related' ),
	);
}
add_action( 'init', 'myplugin_register_template' );

/**
 * Add custom options to the WordPress Customizer
 */
function custom_theme_customizer_register($wp_customize) {
    // Section for custom options
    $wp_customize->add_section('custom_header_options', array(
        'title'    => __('Custom Header Options', 'custom-theme'),
        'priority' => 30,
    ));

    // Image control
    $wp_customize->add_setting('custom_header_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'custom_header_image', array(
        'label'    => __('Select Image', 'custom-theme'),
        'section'  => 'custom_header_options',
        'settings' => 'custom_header_image',
    )));

    // Title control
    $wp_customize->add_setting('custom_header_title', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('custom_header_title', array(
        'label'    => __('Title', 'custom-theme'),
        'section'  => 'custom_header_options',
        'type'     => 'text',
    ));

    // Subtitle control
    $wp_customize->add_setting('custom_header_subtitle', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('custom_header_subtitle', array(
        'label'    => __('Subtitle', 'custom-theme'),
        'section'  => 'custom_header_options',
        'type'     => 'text',
    ));

    // Button text control
    $wp_customize->add_setting('custom_header_button_text', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('custom_header_button_text', array(
        'label'    => __('Button Text', 'custom-theme'),
        'section'  => 'custom_header_options',
        'type'     => 'text',
    ));

	// Button link control
	$wp_customize->add_setting('custom_header_button_link', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	));

	$wp_customize->add_control('custom_header_button_link', array(
		'label'    => __('Button Link', 'custom-theme'),
		'section'  => 'custom_header_options',
		'type'     => 'text',
	));
}

add_filter( 'graphql_resolve_field', function( $result, $source, $args, $context, $info, $type_name, $field_key, $field, $field_resolver ) {
	if ( 'user' === strtolower( $type_name ) && 'seo' === $field_key ) {
		$result['social']['tiktok'] = wp_gql_seo_format_string(get_the_author_meta('tiktok', $source->userId));
		return $result;
	}

	return $result;
}, 10, 9 );

add_action('customize_register', 'custom_theme_customizer_register');

add_filter( 'wpseo_person_social_profile_fields', function( $fields ) {
	$fields['tiktok'] = 'get_non_valid_url';
	return $fields;
}, 10, 1);

add_filter( 'graphql_resolve_field', function( $result, $source, $args, $context, $info, $type_name, $field_key, $field, $field_resolver ) {
	if ( 'user' === strtolower( $type_name ) && 'seo' === $field_key ) {
		$result['social']['tiktok'] = wp_gql_seo_format_string(get_the_author_meta('tiktok', $source->userId));
		return $result;
	}

	return $result;
}, 10, 9);

add_action('graphql_register_types', function () {
    register_graphql_field('SEOUserSocial', 'tiktok', [ 'type' => 'String']);

	// Register GraphQL field for custom_theme_options
	register_graphql_field('RootQuery', 'custom_header_options', [
		'type'        => 'CustomThemeOptionsType', // Create a new type for this field
		'description' => __('Custom Theme Options.'),
		'resolve'     => function ($source, $args, $context, $info) {
			return [
				'custom_header_image' => get_theme_mod('custom_header_image'),
				'custom_header_title' => get_theme_mod('custom_header_title'),
				'custom_header_subtitle' => get_theme_mod('custom_header_subtitle'),
				'custom_header_button_text' => get_theme_mod('custom_header_button_text'),
				'custom_header_button_link' => get_theme_mod('custom_header_button_link'),
			];
		},
	]);

	// Define a new GraphQL type for custom_theme_options
	register_graphql_object_type('CustomThemeOptionsType', [
		'description' => 'Custom header Options Type',
		'fields'      => [
			'custom_header_image' => [
				'type'        => 'String',
				'description' => __('Header image.'),
				'resolve'     => function ($source, $args, $context, $info) {
					// Resolve and return the value of the 'custom_header_image' field
					return $source['custom_header_image'];
				},
			],
			'custom_header_title' => [
				'type'        => 'String',
				'description' => __('Title.'),
				'resolve'     => function ($source, $args, $context, $info) {
					// Resolve and return the value of the 'custom_header_title' field
					return $source['custom_header_title'];
				},
			],
			'custom_header_subtitle' => [
				'type'        => 'String',
				'description' => __('Subtitle.'),
				'resolve'     => function ($source, $args, $context, $info) {
					// Resolve and return the value of the 'custom_header_subtitle' field
					return $source['custom_header_subtitle'];
				},
			],
			'custom_header_button_text' => [
				'type'        => 'String',
				'description' => __('Button Text.'),
				'resolve'     => function ($source, $args, $context, $info) {
					// Resolve and return the value of the 'custom_header_button_text' field
					return $source['custom_header_button_text'];
				},
			],
			'custom_header_button_link' => [
				'type'        => 'String',
				'description' => __('Button Link.'),
				'resolve'     => function ($source, $args, $context, $info) {
					// Resolve and return the value of the 'custom_header_button_link' field
					return $source['custom_header_button_link'];
				},
			],
		],
	]);
});

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'AuthorDisplayText', [
	   'type' => 'String',
	   'description' => __( 'AuthorDisplayText', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'AuthorDisplayText', true );
		 return ! empty( $color ) ? $color : 'AuthorDisplayText';
	   }
	] );
  } );

// Modify the registration of the core/image block
add_filter('register_block_type', function ($settings, $name) {
    if ($name === 'core/image') {
        // Add additional attributes to the block
        $settings['attributes']['photoCredit'] = [
            'type' => 'string',
            'default' => '',
        ];
    }

    return $settings;
}, 10, 2);

// Modify the registration of the core/paragraph block
add_filter('register_block_type', function ($settings, $name) {
    if ($name === 'core/paragraph') {
        // Add additional attributes to the block
        $settings['attributes']['endStyle'] = [
            'type' => 'Boolean',
            'default' => false,
        ];
    }

    return $settings;
}, 10, 2);

// Disable comments
add_action('admin_init', function () {
    // Redirect any user trying to access comments page
    global $pagenow;
     
    if ($pagenow === 'edit-comments.php') {
        wp_safe_redirect(admin_url());
        exit;
    }
 
    // Remove comments metabox from dashboard
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
 
    // Disable support for comments and trackbacks in post types
    foreach (get_post_types() as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
            remove_post_type_support($post_type, 'trackbacks');
        }
    }
});
 
// Close comments on the front-end
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);
 
// Hide existing comments
add_filter('comments_array', '__return_empty_array', 10, 2);
 
// Remove comments page in menu
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
});
 
// Remove comments links from admin bar
add_action('init', function () {
    if (is_admin_bar_showing()) {
        remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
    }
});

function new_excerpt_more($more) {
	global $post;
 return '...';
}
add_filter('excerpt_more', 'new_excerpt_more');

// Add photo credit to image block
function modify_image_block_editor_script() {
    wp_enqueue_script(
        'modify-image-block',
        get_template_directory_uri() . '/js/modify-image-block.js',
        array('wp-blocks', 'wp-editor', 'wp-components', 'wp-element', 'wp-hooks'),
        time(),
        true
    );
}
add_action('enqueue_block_editor_assets', 'modify_image_block_editor_script');

add_filter('rest_post_collection_params', function ($params, $post_type) {
	if (isset($params['per_page'])) {
		$params['per_page']['maximum'] = 600;//edit it as you want
	}

	return $params;
}, 10, 2);

function macleans_register_options_page() {
    add_menu_page(
        'Site Options',
        'Site Options',
        'manage_options',
        'site_options',
        'site_options_page_html'
    );
}
add_action( 'admin_menu', 'macleans_register_options_page' );

function site_options_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    if ( isset( $_GET['settings-updated'] ) ) {
        add_settings_error(
            'macleans_options_messages',
            'macleans_options_messsage',
            esc_html__( 'Settings Saved', 'text_domain' ),
            'updated'
        );
    }

    settings_errors( 'macleans_options_messages' );

    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
            <?php
                settings_fields( 'macleans_options_group' );
                do_settings_sections( 'macleans_options' );
                submit_button( 'Save Settings' );
            ?>
        </form>
    </div>
    <?php
}

function macleans_register_settings() {
    register_setting( 'macleans_options_group', 'macleans_options' );
	add_settings_section(
        'macleans_options_sections',
        false,
        false,
        'macleans_options'
    );

    add_settings_field(
        'preview_url',
        esc_html__( 'Preview URL', 'macleans' ),
        'render_preview_url_field',
        'macleans_options',
        'macleans_options_sections',
        [
            'label_for' => 'preview_url',
        ]
    );
}
add_action( 'admin_init', 'macleans_register_settings' );

function render_preview_url_field( $args ) {
    $value = get_option( 'macleans_options' )[$args['label_for']] ?? '';
    ?>
    <input
        type="url"
        id="<?php echo esc_attr( $args['label_for'] ); ?>"
        name="macleans_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
        value="<?php echo esc_attr( $value ); ?>"
		placeholder="https://macleans.ca">
    <p class="description"><?php esc_html_e( 'Front-End Base URL', 'macleans' ); ?></p>
    <?php
}

function macleans_post_link($permalink, $post, $leavename=true) {
    $slug = $post->post_name;

    // Get the primary category ID set by Yoast SEO
    $primary_category_id = get_post_meta($post->ID, '_yoast_wpseo_primary_category', true);

	// If a primary category is set, use it. Otherwise, get the first category
	if ($primary_category_id) {
		$primary_category = get_category($primary_category_id);
	} else {
		$categories = get_the_category($post->ID);
		$primary_category = !empty($categories) ? $categories[0] : null;
	}

    // Get the parent category slug
    $parent_category = '';
    if ($primary_category) {
        $parent_category = get_category_parents($primary_category->term_id, false, '/', true);
        $parent_category = !is_wp_error($parent_category) ? rtrim($parent_category, '/') . '/' : '';
    }

    $preview_url = get_option('macleans_options')['preview_url'] ?? home_url();

    if ($post->post_status !== 'draft') {
        return "$preview_url/$parent_category" . ($leavename ? '%postname%' : $slug);
    } else {
        return "$preview_url/draft/$post->ID";
    }
}
add_filter('post_link', 'macleans_post_link', 3, 10);

function macleans_preview_post_link($preview_link) {
	return substr($preview_link, 0, strpos($preview_link, '?'));
}
add_filter('preview_post_link', 'macleans_preview_post_link');

function macleans_page_link($permalink, $post_id, $leavename=true) {
	$post = get_post($post_id);

    // Check if post object exists
    if ($post) {
        // Check if the post is a child post
        $parent_id = $post->post_parent;

        // If the post has a parent, we need to construct the slug recursively
        if ($parent_id) {
            $slug = '';
            // Traverse up the hierarchy to build the slug
            while ($parent_id) {
                $parent_post = get_post($parent_id);
                $slug = $parent_post->post_name . '/' . $slug;
                $parent_id = $parent_post->post_parent;
            }
            // Append the current post's slug
            $slug .= $post->post_name;
        } else {
            // If it's not a child post, simply get the slug
            $slug = $post->post_name;
        }

        $preview_url = get_option('macleans_options')['preview_url'] ?? home_url();

        if ( $post->post_status !== 'draft' ) {
            return "$preview_url/" . ($leavename ? '%postname%' : $slug);
        } else {
            return "$preview_url/draft/$post_id";
        }
    } else {
        return $permalink; // Return original permalink if post doesn't exist
    }
}
add_filter('page_link', 'macleans_page_link', 3, 10);



// function macleans_preview_post_link($preview_link) {
// 	return substr($preview_link, 0, strpos($preview_link, '?'));
// }
// add_filter('preview_post_link', 'macleans_preview_post_link');

add_action( 'graphql_register_types', function() {
    register_graphql_field( 'RootQueryToPostConnectionWhereArgs', 'sticky', [
        'type' => 'Boolean',
        'description' => __( 'Whether to only include sticky posts', 'macleans' ),
    ] );
} );

add_filter( 'graphql_post_object_connection_query_args', function( $query_args, $source, $args, $context, $info ) {
    if ( isset( $args['where']['sticky'] ) && true === $args['where']['sticky'] ) {
        $sticky_ids = get_option( 'sticky_posts' );
        $query_args['posts_per_page'] = count( $sticky_ids );
	$query_args['post__in'] = $sticky_ids;
    }
    return $query_args;
}, 10, 5 );


$parent_includes  = array(
	// '/enqueue.php', // Enqueue parent theme scripts and styles.
	// '/class-wp-bootstrap-navwalker.php',    // Load custom WordPress nav walker.
	// '/class-rdm-customizer-settings.php',
	'/longform-post-type.php',
	// '/rankings-post-type.php',
	// '/grid-post-type.php',
	// '/contest-post-type.php',
);
foreach ( $parent_includes as $file ) {
	$filepath = locate_template( 'inc' . $file );
	if ( $filepath ) {
		require_once $filepath;
	}
}

// Add macleans image sizes
function macleans_thumbnail_sizes() {
    // Landscape size
    add_image_size( 'landscape_thumbnail', 1200, 800, true ); 
    // Square size
    add_image_size( 'square_thumbnail', 1200, 1200, true );
	add_image_size( 'landscape_thumbnail_large', 2400, 1600, true ); 
	add_image_size( 'square_thumbnail_large', 2400, 2400, true ); 
}

add_action( 'after_setup_theme', 'macleans_thumbnail_sizes' );
/**
 * Add Custom Content plugin to custom post types
 * 
 */
// add_filter( 'custom_content_post_types', 'add_additional_post_types' );

// function add_additional_post_types( $post_types ) {
// 	$custom_posts = ['sjh_contest', 'sjh_grid', 'sjh_longform', 'sjh_rankings'];
// 	if (is_che() || is_chf()) {
// 		$custom_posts[] = 'recipe';
// 	}
// 	if (is_mac()) {
// 		$custom_posts[] = 'schools';
// 	}
// 	foreach ($custom_posts as $name) {
//  		$post_types[$name] = true;
// 	}
// 	return $post_types;
// }

// add_filter( 'option_default_post_format', 'slimline_default_post_format' );
// function slimline_default_post_format( $format ) {
//     global $post_type;

//     return ( 'sjh_longform' === $post_type ? $format : $format );
// }

add_filter('wpseo_opengraph_url', 'change_opengraph_url');

function change_opengraph_url($url) {
    return str_replace('https://macleans.wpengine.com', 'https://macleans.ca', $url);
}

add_filter('graphql_object_visibility', function( $visibility, $model_name, $data, $owner, $user ) {
	$visibility = 'public';
	return $visibility;
}, 10, 5);
 
add_action('pre_get_posts', function( $query ) {
	if ( ! empty($query->query['graphql_args']['where']['hasPassword']) ){
		$query->set('post_status', ['draft']);
	}
}, 10);

add_filter('posts_pre_query', function( $posts, $query ) {
	if ( array_key_exists( 'graphql_args', $query->query ) && $query->query['graphql_args']['where']['hasPassword'] === false ) {
		$query->set('post_status', ['draft']);
	}
	return $posts;
}, 10, 2);

add_filter('graphql_connection_query_args', function ($args, $resolver) {
	if ( ! array_key_exists( 'graphql_args', $args ) ) {
		return $args;
	}

	if( ! isset($args['graphql_args']['where']['hasPassword']) ) {
		return $args;
	}

	if ( $args['graphql_args']['where']['hasPassword'] === false ) {
		$args['post_status'] = ['draft'];
	}

    return $args;
}, 10, 2);

// function get_custom_field_for_all_posts() {
//     // Get the custom field value for the current post
//     $custom_field_value = get_post_meta( get_the_ID(), 'longform_hero_image', true );

//     // Do something with $custom_field_value
//     print_r($custom_field_value);
// }
// add_action( 'wp', 'get_custom_field_for_all_posts' );

add_action( 'graphql_register_types', function() {
	register_graphql_field( 'Post', 'longform_hero_image', [
	   'type' => 'String',
	   'description' => __( 'longform_hero_image', 'wp-graphql' ),
	   'resolve' => function( $post ) {
		 $color = get_post_meta( $post->ID, 'longform_hero_image', true );
		 return ! empty( $color ) ? $color : 'longform_hero_image';
	   }
	] );
  } );

add_filter('apple_news_exporter_byline', function ($byline) {
	global $post;

	$author_display_text = get_post_meta($post->ID, 'AuthorDisplayText', TRUE);

	// suppress if just whitespace (e.g. typically no author on sponsored content)
	if (preg_match('/^\s+$/', $author_display_text))
		return preg_replace('/^by [^|]+\s*\|\s*/', '', $byline);

	// custom author
	if ($author_display_text) {
		$export = new Apple_Actions\Index\Export([]);
		return $export->format_byline($post, $author_display_text);
	}

	// Customied author from post header block
	// Get the post content.
	$post_content = get_post_field('post_content', $post->ID);

	// Parse the post content into blocks.
	$blocks = parse_blocks($post_content);

	// Find the block that contains the author attributes.
	$newAuthor = '';

	foreach ($blocks as $block) {
		if ($block['blockName'] === 'macleans/post-header') {
			$newAuthor = $block['attrs']['newAuthor'];
			break;
		}
	}

	if ($newAuthor) {
		$export = new Apple_Actions\Index\Export([]);
		return $export->format_byline($post, $newAuthor);
	}

	return $byline;
});

add_filter('apple_news_exporter_content_pre', function ($content, $post_id) {

	// Get the post content.
	$post_content = get_post_field('post_content', $post_id);

	// Parse the post content into blocks.
	$blocks = parse_blocks($post_content);

	// Find the block that contains the sponsor_url, sponsor_name and sponsor_image_url attributes.
	$sponsor_url = '';
	$sponsor_name = '';
	$sponsor_label = '';
	foreach ($blocks as $block) {
		if ($block['blockName'] === 'macleans/post-header') {
			$sponsor_url = $block['attrs']['sponsoredLink'];
			$sponsor_name = $block['attrs']['sponsoredText'];
			$sponsor_label = $block['attrs']['sponsoredType']['label'];
			break;
		}
	}

	// Filter out the 'macleans/newsletter-signup' block.
	$blocks = array_filter($blocks, function ($block) {
		return $block['blockName'] !== 'macleans/newsletter-signup';
	});

	// Rebuild the post content without the 'macleans/newsletter-signup' block.
	$post_content = '';
	foreach ($blocks as $block) {
		$post_content .= render_block($block);
	}

	// If the sponsor_url and sponsor_name were found, use them.
	if (!empty($sponsor_url) && !empty($sponsor_name)) {
		ob_start();
		?>
		<p><span><?php if (!empty($sponsor_label)){ echo $sponsor_label . ' '; } else { echo 'Sponsored By ' ;}?></span><strong><a href="<?php echo esc_url($sponsor_url); ?>" target="_blank"><?php echo esc_html($sponsor_name) ;?></a></strong></p>
		<?php
		$sponsor = ob_get_clean();
		$post_content = $sponsor . $post_content;
	}

	return $post_content;
}, 10, 2);

// newsletter signup block
add_filter('apple_news_write_json', function ($json) {
	$data = json_decode($json);
	if (@$data->components) {

		// add layout (not sure how to add to theme atm)
		$data->componentLayouts = @$data->componentLayouts ?: (object) [];
		$data->componentLayouts->newsletter = ['padding' => 30];
		$data->componentLayouts->newsletterBody = [
			'margin' => [
				'bottom' => 24,
				'top' => 24]];
		$data->componentLayouts->newsletterButton = [
			'padding' => [
				'left' => 24,
				'right' => 24,
				'top' => 12,
				'bottom' => 12]];

		// add component styles
		$data->componentStyles = @$data->componentStyles ?: (object) [];
		$data->componentStyles->newsletter = ['backgroundColor' => '#F4F4F4'];
		$data->componentStyles->newsletterButton = ['backgroundColor' => '#CC0A21'];

		// add text styles
		$data->componentTextStyles = @$data->componentTextStyles ?: (object) [];
		$data->componentTextStyles->newsletterBody = [
			'fontName' => 'HelveticaNeue-CondensedBold',
			'fontSize' => 16,
			'lineHeight' => 20,
			'textAlignment' => 'center'];
		$data->componentTextStyles->newsletterButton = [
			'fontName' => 'HelveticaNeue-CondensedBold',
			'fontSize' => 18,
			'lineHeight' => 22,
			'textAlignment' => 'center',
			'textColor' => '#FFFFFF',
			'textTransform' => 'uppercase'];
		$data->componentTextStyles->newsletterHeading = [
			'fontName' => 'HelveticaNeue-CondensedBold',
			'fontSize' => 32,
			'lineHeight' => 36,
			'textAlignment' => 'center'];

		// append component to body
		$data->components[] = [
			'components' => [
				[
					'role' => 'heading3',
					'text' => 'Stay Informed',
					'textStyle' => 'newsletterHeading'],
				[
					'layout' => 'newsletterBody',
					'role' => 'body',
					'text' => 'Get the Best of Maclean&apos;s sent straight to your inbox. Sign up for news, commentary and analysis.',
					'textStyle' => 'newsletterBody'],
				[
					'format' => 'html',
					'layout' => 'newsletterButton',
					'role' => 'link_button',
					'style' => 'newsletterButton',
					'text' => 'Sign up',
					'textStyle' => 'newsletterButton',
					'URL' => 'https://macleans.ca/newsletter/?utm_source=apple-news&utm_medium=newsletter-signup&utm_campaign=footer']],
			'layout' => 'newsletter',
			'role' => 'container',
			'style' => 'newsletter'];
	}

	return json_encode($data);
});

function macleans_get_primary_category_for_post($object, $field_name, $request) {
    $primary_category_id = get_post_meta($object['id'], '_yoast_wpseo_primary_category', true);
    return $primary_category_id == $object['id'];
}

add_action('rest_api_init', function () {
    register_rest_field('category', 'isPrimary', array(
        'get_callback' => 'macleans_get_primary_category_for_post',
        'schema' => array(
            'description' => __('Is this the primary category for the post'),
            'type' => 'boolean',
        ),
    ));
});

add_action('send_headers', function () {
	if (!is_admin() && !is_user_logged_in()) {
		header('cache-control:public,max-age=300'); // 5 minutes
	}
});

// limit login cookie expiry to 24hrs for sake of Assembly's CWAFTY setup
add_filter('auth_cookie_expiration', function ($_seconds, $_user_id, $remember) {
	return 86400 - ($remember ? 43200 : 0);
}, 10, 3);
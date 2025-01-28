import React, {useEffect, useState, lazy} from 'react';
import Image from 'next/image';
// const HomeHeader = lazy(() => import('./home-header'));
// const Module = lazy(() => import('./module'));
// const Button = lazy(() => import('./button'));
// const HeadingComponent = lazy(() => import('./headings'));
// const NewsletterSignup = lazy(() => import('./newsletter-signup'));
// const InlineMagazine = lazy(() => import('./inline-magazine'));
// const Module5050 = lazy(() => import('./module-50-50'));
// const Carousel = lazy(() => import('./carousel'));
// const ManualCarousel = lazy(() => import('./carousel-manual'));
// const Grid = lazy(() => import('./grid'));
// const ModuleFullWidth = lazy(() => import('./module-full-width'));
// const PostHeader = lazy(() => import('./post-header'));
// const PostsList = lazy(() => import('./posts-list'));
// const Related = lazy(() => import('./related'));
// const TableOfContents = lazy(() => import('./table-of-contents'));
// const ListCard = lazy(() => import('./list-card'));
// const VideoPosts = lazy(() => import('./post-video-posts'));

import HomeHeader from './home-header';
import Module from './module';
import Button from './button';
import HeadingComponent from './headings';
import ReactHtmlParser from 'html-react-parser';
import parseContentImages from '@/lib/utils/parseContentImages';
import NewsletterSignup from './newsletter-signup';
import InlineMagazine from './inline-magazine';
import Module5050 from './module-50-50';
import Carousel from './carousel';
import Grid from './grid';
import ModuleFullWidth from './module-full-width';
import PostHeader from './post-header';
import PostsList from './posts-list';
import Related from './related';
import TableOfContents from './table-of-contents';
import ListCard from './list-card';
import VideoPosts from './post-video-posts';
import Footnotes from './footnotes';
import ManualCarousel from './carousel-manual';
import { getMediaItem } from '@/lib/api';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

// Recursive function to render blocks
export default function RenderBlock({ block, index, isLastBlock, crop, postData, parentColumns, queryPosts, modulePosts }) {

    switch (block?.name) {
        case 'macleans/home-header':
            return <HomeHeader key={index} block={block} />;

        case 'macleans/module':
            return <Module key={index} block={block} modulePosts={modulePosts} />;

        case 'macleans/newsletter-signup':
            return <NewsletterSignup key={index} block={block} />;
			
		case 'macleans/carousel':
			return <Carousel key={index} block={block} />;

        case 'macleans/carousel-manual':
			return <ManualCarousel key={index} block={block} />;
			
		case 'macleans/grid':
			return <Grid key={index} block={block} />;

        case 'macleans/inline-magazine':
            return <InlineMagazine block={block} key={index} />

        case 'macleans/module-5050':
            return <Module5050 block={block} key={index} />  
		
		case 'macleans/post-header':
			return <PostHeader block={block} key={index} postData={postData} />

		case 'macleans/module-full-width':
			return <ModuleFullWidth block={block} key={index} /> 

        case 'macleans/related':
            return <Related block={block} key={index} postData={postData} /> 
		
		case 'macleans/table-of-contents':
			return <TableOfContents block={block} key={index} />
		
		case 'macleans/list-card':
			return <ListCard block={block} key={index} />
        
        case 'macleans/video-block':
            return <VideoPosts key={index} block={block} />

        case 'core/footnotes':
            return <Footnotes key={index} block={block} />
        
		case 'core/query':
			return <div className='ad-free-zone max-w-screen-desktop overflow-hidden mx-auto px-0 tablet:px-20 laptop:px-40' key={index}>
				<PostsList taxonomyQuery={block?.attributes?.query.taxQuery} queryPosts={queryPosts}/>
			</div>

        case 'core/heading':
            return (
                <HeadingComponent
                    key={index}
                    level={block?.attributes?.level}
                    textAlign={block?.attributes?.textAlign}
                    content={block?.attributes?.content}
                    htmlContent={block?.htmlContent}
                    { ...block?.attributes?.className ? `className=${block?.attributes?.className}` : '' }
                />
            );

        case 'core/paragraph':
            const typographyStyle = block?.attributes?.style?.typography;
        
            return (
                <p
                    key={index}
                    style={{ 
                        textAlign: block?.attributes?.textAlign, 
                        ...typographyStyle,
                    }}
                    className={`${block?.attributes?.dropCap ? 'has-drop-cap' : ''} ${block?.attributes?.fontSize ? `font-${block?.attributes?.fontSize}` : ''} ${block?.attributes?.textColor ?? ''} ${block?.attributes?.backgroundColor ? `bg-${block?.attributes?.backgroundColor}` : ''} ${block?.attributes?.endStyle ? 'endstyle' : ''} ${block?.attributes?.className}`}
                >
                    {ReactHtmlParser(replaceStraightApostrophes(block?.attributes?.content || ''))}
                </p>
            );

        case 'core/group':
            return (
                <div className={`wp-block-group ${block.attributes?.className}`} key={index}>
                    {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                        <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                    )}
                </div>
            );

        case 'core/list':
            const isOrdered = block.attributes && block.attributes.ordered;
            const ListComponent = isOrdered ? 'ol' : 'ul';

            return (
                <ListComponent key={index} className={`${isOrdered ? 'wp-blocks wp-list ordered-list' : 'wp-blocks wp-list'} ${block.attributes?.className}`}>
                    {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                        <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                    )}
                </ListComponent>
            );

        case 'core/list-item':
            return (
                <li key={index} className={'wp-blocks'}>
                    {ReactHtmlParser(replaceStraightApostrophes(block?.attributes?.content || ''))}
                </li>
            );

        case 'core/columns':
            return (
                <div
                    key={index}
                    className={`wp-block-columns ${block.attributes.isStackedOnMobile ? 'is-stacked-on-mobile' : ''} ${block?.attributes?.align == 'wide' ? 'alignwide' : ''} ${block.attributes?.className}`}
                    style={{
                        flex: (block.attributes.columns % 2 !== 0 && index === block.innerBlocks.length - 1) ? '0 0 100%' : `0 0 calc((100% - ${(block.attributes.columns - 1) * 10}px) / ${block.attributes.columns})`,
                        width: (block.attributes.columns % 2 !== 0 && index === block.innerBlocks.length - 1) ? '100%' : `calc((100% - ${(block.attributes.columns - 1) * 10}px) / ${block.attributes.columns})`
                    }}>
                    {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                        <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} parentColumns={block.innerBlocks.length}/>
                    )}
                </div>
            );

        case 'core/column':
            return (
                <div key={index} className={`wp-block-column ${block.attributes?.className}`}>
                    {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                        <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} parentColumns={parentColumns}/>
                    )}
                </div>
            );

        case 'core/image':
            const [figcaptionHtml, setFigcaptionHtml] = useState('');
            const columns = parentColumns || 1;
            const sizes = `(max-width: 640px) 100vw, (max-width: 1024px) ${100/columns}vw, ${100/columns}vw`;

            useEffect(() => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(block.htmlContent, 'text/html');
                let figcaption = doc.querySelector('figcaption');
                let figcaptionContent = figcaption ? figcaption.innerHTML : '';

                setFigcaptionHtml(figcaptionContent);
            }, []);

            const [coreImageData, setCoreImageData] = useState(null);
            const coreImage = coreImageData?.mediaDetails?.sizes.find(size => size.name === 'landscape_thumbnail' || size.name === 'medium_large' || size.name === 'large');
            const coreSourceUrl = coreImage?.sourceUrl ? coreImage?.sourceUrl : block?.attributes?.url;

            useEffect(() => {
                if (block?.attributes?.id) {
                    getMediaItem(block?.attributes?.id).then(data => {
                        setCoreImageData(data);
                    });
                }
            }, [block?.attributes?.mediaId]);

            return (
                <>
                    {block?.attributes ? 
                        <figure key={index} className={`wp-block-image ${block?.attributes?.align ? `align${block?.attributes?.align}` : 'aligndefault'} ${(block?.attributes?.height > block?.attributes?.width) && (block?.attributes?.align) ? '!max-w-[720px]' : ''}`}>
                            <Image
                                src={parentColumns ? coreSourceUrl : (block?.attributes?.url ? block.attributes.url : coreSourceUrl)}
                                width={600}
                                height={400}
                                sizes={sizes}
                                loading="lazy"
                                alt={block?.attributes?.alt || block?.attributes?.caption || 'alt tag missing'}
                            />
                            <figcaption className={crop ? 'realtive bottom-0 w-full' : 'w-full text-left'}>
                                {ReactHtmlParser(replaceStraightApostrophes(figcaptionHtml || ''))}
                                {block?.attributes?.photoCredit && <span className={`relative text-sm all-small-caps text-grey ${figcaptionHtml ? 'mx-5' : ''}`}>{replaceStraightApostrophes(block?.attributes?.photoCredit)}</span>}
                            </figcaption>
                        </figure>
                        :
                        parseContentImages(block.htmlContent || '')
                    }
                </>
            );

        case 'core/cover':
            const hasParallax = block?.attributes && block?.attributes?.hasParallax;
            const dimRatio = block?.attributes && block?.attributes?.dimRatio;

            return (
                <div key={index} className={`wp-block-cover ${hasParallax ? 'has-parallax' : ''} ${block?.attributes?.className}`}>
                    <span aria-hidden="true" className={`wp-block-cover__background has-background-dim-${dimRatio} has-background-dim`}></span>
                    <div
                        role="img"
                        alt={block?.attributes?.alt}
                        className={`wp-block-cover__image-background wp-image-${block?.attributes?.id} ${hasParallax ? 'has-parallax' : ''}`}
                        style={{ backgroundPosition: '50% 50%', backgroundImage: `url(${block?.attributes?.url})` }}
                    ></div>
                    <div className="wp-block-cover__inner-container is-layout-flow wp-block-cover-is-layout-flow">
                        {block?.innerBlocks && block?.innerBlocks.map((innerBlock, innerIndex) =>
                            <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                        )}
                    </div>
                </div>
            );

        case 'core/media-text':
            const [imageData, setImageData] = useState(null);

            useEffect(() => {
                if (block?.attributes?.mediaId) {
                    getMediaItem(block?.attributes?.mediaId).then(data => {
                        setImageData(data);
                    });
                }
            }, [block?.attributes?.mediaId]);
            
            const mediumLargeImage = imageData?.mediaDetails?.sizes.find(size => size.name === 'medium_large');
            const sourceUrl = mediumLargeImage?.sourceUrl;
            return (
                <div
                    key={index}
                    className={`wp-block-media-text ${block?.attributes?.align === 'wide' ? 'alignwide' : ''} ${block?.attributes?.mediaPosition ? `has-media-on-the-${block?.attributes?.mediaPosition}` : 'has-media-on-the-left'} ${block?.attributes?.isStackedOnMobile ? 'is-stacked-on-mobile' : ''} ${block?.attributes?.className}`}
                    style={{ gridTemplateColumns: `${block?.attributes?.mediaWidth ? `${block?.attributes?.mediaWidth}% 1fr` : `1fr 50%`}` }}
                >
                    {block?.attributes?.mediaPosition === 'right' ? (
                        <>
                            <div className="wp-block-media-text__content">
                                {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                                    <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                                )}
                            </div>
                            <figure className="wp-block-media-text__media">
                                <Image
                                    src={sourceUrl}
                                    width={600}
                                    height={400}
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 100vw"
                                    alt={block?.attributes?.alt || 'alt text missing'}
                                    loading="lazy"
                                    className={`wp-image-${block?.attributes.mediaId} size-full`}
                                />
                            </figure>
                        </>
                    ) : (
                        <>
                            <figure className="wp-block-media-text__media">
                                <Image
                                    src={sourceUrl}
                                    width={600}
                                    height={400}
                                    loading="lazy"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 100vw"
                                    alt={block?.attributes?.alt || 'alt text missing'}
                                    className={`wp-image-${block?.attributes?.mediaId} size-full`}
                                />
                            </figure>
                            <div className="wp-block-media-text__content">
                                {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                                    <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                                )}
                            </div>
                        </>
                    )}
                </div>
            );

        case 'core/gallery':
            return (
                <figure
                    key={index}
                    className={`wp-block-gallery relative is-layout-flex ${block?.attributes?.imageCrop ? 'is-cropped' : ''} ${block?.attributes?.className || 'article-container'}`}
                    style={{
                        display: 'flex',
                        flexWrap: block?.attributes?.columns ? 'wrap' : 'nowrap here',
                        flexDirection: block?.attributes?.columns ? 'row' : 'row ',
                        gap: '10px'
                    }}
                >
                    {block.innerBlocks.map((innerBlock, innerIndex) => {
                        const columns = block?.attributes?.columns || block.innerBlocks.length;
                        const isLastImage = innerIndex === block.innerBlocks.length - 1;
                        const isExtraImage = block.innerBlocks.length % columns !== 0;
                        return (
                            <div
                                key={innerIndex}
                                className={'mb-12 laptop:mb-12 overflow-x-hidden overflow-y-clip'}
                                style={{
                                    height: block?.attributes?.imageCrop ? 'unset' : '100%',
                                    flex: (isLastImage && isExtraImage) ? '0 0 100%' : `0 0 calc((100% - ${(columns - 1) * 10}px) / ${columns})`,
                                    width: (isLastImage && isExtraImage) ? '100%' : `calc((100% - ${(columns - 1) * 10}px) / ${columns})`
                                }}
                            >
                                <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} crop={block?.attributes?.imageCrop} parentColumns={columns}/>
                            </div>
                        );
                    })}
                </figure>
            );

        case 'core/embed':
            const providerNameSlug = block?.attributes?.providerNameSlug;
            const isYouTube = providerNameSlug === 'youtube';
            const isVimeo = providerNameSlug === 'vimeo';
            const isSoundCloud = providerNameSlug === 'soundcloud';
            const isSpotify = providerNameSlug === 'spotify';
            const isMixcloud = providerNameSlug === 'mixcloud';
            const isPocketCasts = providerNameSlug === 'pocket-casts';
            const isTikTok = providerNameSlug === 'tiktok';
            const isReddit = providerNameSlug === 'reddit';
            const isDailyMotion = providerNameSlug === 'dailymotion';
            const isTwitter = providerNameSlug === 'twitter';
            const [location, setLocation] = useState('');

            useEffect(() => {
                setLocation(window.location.href);
            }, [])

            return (
                <figure key={index} className={`wp-block-embed wp-block-embed-${block?.attributes?.providerNameSlug} is-type-${block?.attributes?.type} is-provider-${providerNameSlug} ${block?.attributes?.align == 'wide' ? 'alignwide' : 'aligndefault'} ${block?.attributes?.className}`}>
                    <div className="wp-block-embed__wrapper">
                        {isYouTube && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                src={`https://www.youtube.com/embed/${block?.attributes?.url?.split('v=')[1]}?feature=oembed`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen=""
                                aria-label="YouTube Video Player"
                            ></iframe>
                        )}

                        {isVimeo && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                src={`https://player.vimeo.com/video/${block?.attributes?.url?.split('/').pop()}`}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen=""
                                aria-label="Vimeo Video Player"
                            ></iframe>
                        )}

                        {isSoundCloud && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                allow="autoplay"
                                src={`https://w.soundcloud.com/player/?url=${block?.attributes?.url}`}
                                aria-label="SoundCloud Player"
                            ></iframe>
                        )}

                        {isSpotify && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                allowTransparency="true"
                                allow="encrypted-media"
                                src={`https://open.spotify.com/embed/playlist/${block?.attributes?.url?.split('/').pop()}?utm_source=oembed`}
                                aria-label="Spotify Player"
                            ></iframe>
                        )}

                        {isMixcloud && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                src={`https://www.mixcloud.com/widget/iframe/?feed=${block?.attributes?.url}`}
                                allow="autoplay"
                                aria-label="Mixcloud Player"
                            ></iframe>
                        )}

                        {isPocketCasts && (
                            <iframe
                                title={block?.attributes?.title}
                                src={`https://pca.st/embed/${block?.attributes?.url?.split('/').pop()}`}
                                allowFullScreen="true"
                                aria-label="Pocket Casts Player"
                            ></iframe>
                        )}

                        {isTikTok && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                src={`https://www.tiktok.com/embed/v2/${block?.attributes?.url?.split('/').pop()}?lang=en-US&embedFrom=oembed`}
                                aria-label="TikTok Player"
                            ></iframe>
                        )}

                        {isReddit && (
                            <iframe
                                loading="lazy"
                                title={block?.attributes?.title}
                                width={block?.attributes?.width}
                                height={block?.attributes?.height}
                                src={`https://embed.reddit.com/r/${block?.attributes?.url.split('/')[4]}/comments/${block?.attributes?.url?.split('/')[6]}/?embed=true&ref_source=embed&ref=share&utm_medium=widgets&utm_source=embedv2&utm_term=23&utm_name=post_embed&embed_host_url=https%3A%2F%2Fmacleans.wpengine.com%2Fwp-admin%2Fpost.php`}
                                aria-label="Reddit Player"
                            ></iframe>
                        )}

                        {isDailyMotion && (
                            <iframe
                                src={`https://www.dailymotion.com/embed/video/${block?.attributes?.url?.split('/').pop()}?autoplay=1`}
                                width="100%"
                                height="100%"
                                allowFullScreen
                                title="Dailymotion Video Player"
                                aria-label="Dailymotion Video Player"
                            ></iframe>
                        )}

                        {isTwitter && (
                            <iframe
                                style={{ border: 'none' }}
                                src={`https://platform.twitter.com/embed/index.html?dnt=false&embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=${block?.attributes?.url.split('/').pop()}&lang=en&origin=${encodeURIComponent(location)}&sessionId=${block?.attributes?.id}&theme=light&widgetsVersion=2615f7e52b7e0%3A1702314776716&width=550px`}
                                allowFullScreen
                                aria-label="Twitter Player"
                            ></iframe>
                        )}
                    </div>
                </figure>
            );

        case 'core/audio':
            return (
                <figure key={index} className={`wp-block-audio ${block?.attributes?.className}`}>
                    <audio controls src={block?.attributes?.src}></audio>
                </figure>
            );

        case 'core/buttons':
            return (
                <div
                    key={index}
                    className={`wp-block-buttons gap-10 ${block?.attributes?.className}`}
                    style={{
                        display: block?.attributes?.layout?.type || 'block',
                        flexDirection: block?.attributes?.layout?.orientation === 'vertical' ? 'column' : 'row'
                    }}
                >
                    {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                        <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                    )}
                </div>
            );

        case 'core/button':
            return (
                <Button
                    key={index}
                    type={block?.attributes?.className ? block?.attributes?.className.split('-').pop() : 'white'}
                    disabled={block?.attributes?.disabled}
                    href={block?.attributes?.url}
                    { ...block?.attributes?.className ? `className=${block?.attributes?.className}` : '' }
                >
                    {replaceStraightApostrophes(block?.attributes?.content)}
                </Button>
            );

        case 'core/separator':
            return (
                <hr key={index} className={`wp-block-separator ${block?.attributes?.className || 'default'}`} />
            );

        case 'core/spacer':
            return (
                ReactHtmlParser(block?.htmlContent || '')
                // <div key={index} className={'wp-block-spacer'} style={{ height: block.attributes?.height }}></div>
            );

        case 'core/pullquote':
            return (
                <blockquote key={index} className={`wp-pull-quote ${block?.attributes?.className}`}>
                    {ReactHtmlParser(replaceStraightApostrophes(block?.htmlContent || ''))}
                </blockquote>
            );

        case 'core/quote':
            return (
                <blockquote key={index} className={`wp-block-quote ${block?.attributes?.className}`}>
                    {block.innerBlocks && block.innerBlocks.map((innerBlock, innerIndex) =>
                        <RenderBlock block={innerBlock} index={innerIndex} key={innerIndex} />
                    )}
                </blockquote>
            );

        case 'core/table':
            return (
                <div key={index} className={`html-block-table ${block?.attributes?.className}`}>
                    {ReactHtmlParser(replaceStraightApostrophes(block?.htmlContent || ''))}
                </div>
            );
    }
};
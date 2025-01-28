import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayIcon from '../assets/icons/icon-video-play-sm.svg';
import PlayIcon from '../assets/icons/icon-video-play.svg';
import ReactHtmlParser from 'html-react-parser';
import { stripAnchorTags } from '@/lib/utils/stripTags';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

import { getPost, getMediaItem } from '@/lib/api';

export default function PostSelector({post, index, featured, featuredVideo, className, imageHolderClassName, contentWrapperClass, containerClasses = '', theme = 'light', priority = false}) {
    // const [isClient, setIsClient] = useState(true);
    const [sponsored, setSponsored] = useState(false);
    const [sponsoredType, setSponsoredType] = useState('');
    const [sponsoredText, setSponsoredText] = useState('');
    const [sponsoredImage, setSponsoredImage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [primaryCategory, setPrimaryCategory] = useState(null);
    const [sponsorLogo, setSponsorLogo] = useState(null);
    const [fetchedPost, setFetchedPost] = useState([]);
    
    const postBlockFetch = async () => {
        let fetchedData = null;
        if (post.attributes?.selectedPost?.slug) {
            const data = await getPost(post.attributes.selectedPost.slug);

            if (data.post) {
                setFetchedPost(data.post);
            }

            if (data?.post?.sponsorLogo) {
                const logo = await getMediaItem(parseInt(data.post.sponsorLogo));
                setSponsorLogo(logo);
            }

            if (data?.post?.blocks && data?.post?.blocks[0]?.attributes?.sponsored) {
                setSponsored(true);
                setSponsoredType(data?.post.blocks[0]?.attributes?.sponsoredType?.label);
                setSponsoredText(data?.post.blocks[0]?.attributes?.sponsoredText);
                setSponsoredImage(data?.post.blocks[0]?.attributes?.sponsoredImage);
            }
            if (data?.post?.featuredVideoUrl?.length > 0) {
                setVideoUrl(data?.post?.featuredVideoUrl);
            }
            fetchedData = data;
        }
        return fetchedData;
    }

    const sizes = featured ? 
    "(max-width: 640px) 100vw, (max-width: 834px) 50vw" : 
    "(max-width: 640px) 100vw, (max-width: 834px) 50vw, 25vw";

    useEffect(() => {
        const fetchPostData = async () => {
            const fetchedData = await postBlockFetch();
            const primaryCat = fetchedData?.post?.categories?.edges.find(edge => edge.isPrimary) || fetchedData?.post?.categories?.edges[0];
            setPrimaryCategory(primaryCat);
        }
        
        fetchPostData();
    }, [post]);

    return (
        <div className={`w-full ${featured ? 'border-black border-1 border-b-6 p-10 pb-50 text-center h-full' : `${className}`}`} key={index}>
            <div className={`${containerClasses}`}>
                {!post.attributes?.hideFeaturedImage && post?.attributes?.featuredImage?.media_details?.sizes &&
                    <div className={`relative overflow-hidden image-holder ${featured ? `mb-40 ${imageHolderClassName ? imageHolderClassName : 'aspect-square'}` : `tablet:mb-20 ${imageHolderClassName}`}`}>
                        <Link 
                            href={primaryCategory?.node?.uri ? 
                                    `${primaryCategory?.node?.uri.replace('category/', '')}${post?.attributes?.selectedPost?.slug}` : 
                                    `${primaryCategory?.node?.slug.replace('category/', '')}/${post?.attributes?.selectedPost?.slug}`
                                } 
                            className={`no-underline group group-post`}
                        >
                            <Image 
                                className='w-full h-full object-cover'
                                src={
                                        featured 
                                        ? (post?.attributes?.featuredImage?.media_details?.sizes?.square_thumbnail?.source_url 
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.large?.source_url
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium_large?.source_url 
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.full?.source_url )
                                        : (post?.attributes?.featuredImage?.media_details?.sizes?.landscape_thumbnail?.source_url  
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium_large?.source_url 
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium?.source_url)
                                }
                                priority={priority} 
                                loading={!priority ? 'lazy' : 'eager'}
                                quality={featured ? 80 : 80}  
                                width={
                                    (featured 
                                        ? (post?.attributes?.featuredImage?.media_details?.sizes?.square_thumbnail?.width
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.large?.width
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.full?.width) 
                                        : (post?.attributes?.featuredImage?.media_details?.sizes?.landscape_thumbnail?.width
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium_large?.width
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium?.width) 
                                    ) || 310
                                }

                                height={
                                    (featured 
                                        ? (post?.attributes?.featuredImage?.media_details?.sizes?.square_thumbnail?.height
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.large?.height
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.full?.height) 
                                        : (post?.attributes?.featuredImage?.media_details?.sizes?.landscape_thumbnail?.height
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium_large?.height
                                            || post?.attributes?.featuredImage?.media_details?.sizes?.medium?.height) 
                                    ) || 310
                                }
                                onError={(e) => { if ( e.target.src !== '/no-image.jpg') { e.target.src = '/no-image.jpg'; e.target.srcset = '' } }}
                                sizes={sizes}
                                alt={post.attributes.featuredImage.alt_text || 'post image alt text missing.' }
                            />
                            {!featuredVideo && (post.attributes.hasVideo || videoUrl.length > 0) && 
                                <div className='absolute w-60 h-60 left-0 bottom-0'>
                                    <VideoPlayIcon className='w-full h-auto' />
                                </div>
                            }
                            {featuredVideo && (post.attributes.hasVideo || videoUrl.length > 0) && 
                                <div className='absolute left-[calc(50%-40px)] bottom-[calc(50%-40px)]'>
                                    <PlayIcon className='w-80 h-80 object-contain' />
                                </div>
                            }
                        </Link>
                    </div>
                }
				<div className={contentWrapperClass ? contentWrapperClass : '' }>
                    {(primaryCategory?.node?.name?.length || post.attributes?.category?.name) && !post.attributes.hideCategory &&
                        <Link 
                            href={ primaryCategory?.node?.uri ? 
                                `${primaryCategory?.node?.uri?.replace('category/', '')}` : 
                                `${post.attributes?.category?.uri?.replace('category/', '')}`
                            }
                            className={`no-underline group group-post`}
                        >
                            <span className={`slug inline-block align-top mb-10  ${ theme === 'dark' ? 'text-white' : ''}`}>{post.attributes?.newCategory || primaryCategory?.node.name || post.attributes?.category?.name}</span>
                        </Link>
                    }
					{post.attributes?.selectedPost?.title?.rendered && 
                        <h3 
                            className={`mb-4 laptop:group-[.group-post]:group-hover:underline group-[.centered]:max-tablet:text-mdl group-[.centered]:max-tablet:leading-base ${featuredVideo ? 'heading-1' : ''} ${featured ? 'heading-1' : ''} ${ theme === 'dark' ? 'text-white' : ''}`}>
                                <Link 
                                    href={primaryCategory?.node?.uri ? 
                                            `${primaryCategory?.node?.uri?.replace('category/', '')}${post?.attributes?.selectedPost?.slug}` : 
                                            `${post.attributes?.category?.slug?.replace('category/', '')}/${post?.attributes?.selectedPost?.slug}`
                                        } 
                                    className={`no-underline laptop:hover:underline group group-post ${ theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                                    {ReactHtmlParser(replaceStraightApostrophes(post.attributes?.newTitle || post.attributes.selectedPost.title.rendered || ''))}
                                </Link>
                        </h3>
					}
					{post.attributes?.selectedPost?.excerpt?.rendered && 
						<div className={`${ theme === 'dark' ? 'text-grey-light' : (featured ? 'text-dark' : 'text-grey') } font-serif font-normal mb-10 ${featured ? 'text-md leading-smxxl tablet:text-mdm tablet:leading-md' : 'text-smm leading-smm'}`}>
							{ReactHtmlParser(replaceStraightApostrophes(stripAnchorTags(post.attributes.selectedPost.excerpt.rendered) || ''))}
						</div>
					}
                    {sponsored && <div className='flex gap-10 items-center max-tablet:group-[.centered]:justify-center'>
                        {sponsoredType && <span className={`text-xs leading-xs font-sans font-bold uppercase ${ theme === 'dark' ? 'text-grey-light' : 'text-dark' }`}>
                            { ReactHtmlParser(sponsoredType || '') }
                        </span>}
                        {!sponsoredImage && <span className={`text-xs leading-xs font-sans font-bold uppercase ${ theme === 'dark' ? 'text-grey-light' : 'text-dark' }`}>
                            { ReactHtmlParser(sponsoredText || '') }
                        </span>}
                        {sponsoredImage && <div className='max-w-[100px] h-auto object-contain'>
                            <Image 
                                src={sponsoredImage?.url} 
                                width={sponsoredImage?.width} 
                                height={sponsoredImage?.height} 
                                alt={sponsoredImage?.alt || 'sponsor logo'} 
                                
                            />
                        </div>}
                    </div>}
					{!sponsored && post.attributes?.author && post.attributes.hideByline == false &&
                        <p className={`author ${ theme === 'dark' ? 'text-white' : '' }`}>
                            <Link href={`author/${post.attributes?.author?.slug}`} className={`no-underline group group-post ${ theme === 'dark' ? 'text-white' : 'text-dark' }`}>
                                {`by ${post.attributes?.author.name}`}
                            </Link>
                        </p>
					}
                    {!sponsored && fetchedPost?.sponsorPrefix && <div className={`flex gap-10 items-center max-tablet:group-[.centered]:justify-center ${featured ? 'tablet:justify-center' : ''}`}>
                        {fetchedPost?.sponsorPrefix && <span className={`text-xs leading-xs font-sans font-bold uppercase ${ theme === 'dark' ? 'text-grey-light' : 'text-dark' }`}>
                            { ReactHtmlParser(fetchedPost?.sponsorPrefix || '') }
                        </span>}
                        {!sponsorLogo && fetchedPost?.sponsorName && <span className={`text-xs leading-xs font-sans font-bold uppercase ${ theme === 'dark' ? 'text-grey-light' : 'text-dark' }`}>
                            { ReactHtmlParser(fetchedPost?.sponsorName || '') }
                        </span>}
                        {sponsorLogo && <div className='max-w-[100px] h-auto object-contain'>
                            <Image 
                                src={sponsorLogo?.sourceUrl} 
                                width={100} 
                                height={100} 
                                alt={sponsorLogo?.altText || 'sponsor logo'} 
                                
                            />
                        </div>}
                    </div>}
				</div>
            </div>
        </div>
    )
}
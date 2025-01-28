import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import ReactHtmlParser from 'html-react-parser';
import Image from 'next/image';
import ShareButton from './share-button';
import {getPost, getPostById} from '@/lib/api';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function DefaultPostHeader({block, postData}) {
	if (!block.attributes) return;
	
	const { featuredImage = null, 
			orientation = 'landscape', 
			imagePosition = null, 
			showCategories, 
			newCategory, 
			newAuthor, 
			titleFontSize, 
			optionalImage, 
			newCaption, 
			showAuthor,
			sponsoredType,
			sponsored,
			sponsoredImage,
			sponsoredText,
			sponsoredLink,
			photoCredit
		} = block.attributes;
    const [post, setPost] = useState(postData || []);
    const formatDate = (string) => {
		var options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(string).toLocaleDateString([],options);
	}

    useEffect(() => {
		const fetchPosts = async () => {
			if (block.attributes.slug) {
				const data = await getPost(block.attributes.slug);
				if (data && data?.post) {
					setPost(data?.post);
				}
			}
			if (!block?.attributes?.slug && postData?.postId) {
				const data = await getPostById(postData?.postId);
				if (data && data?.post) {
					setPost(data?.post);
				}
			}
		}

		fetchPosts();
	}, [block]);

	const getFontSize = () => {
		if (titleFontSize == 40) {
			return `tablet:text-[40px] tablet:leading-[44px]`;
		} else if (titleFontSize == 44) {
			return `tablet:text-[44px] tablet:leading-[48px]`;
		} else if (titleFontSize == 24) {
			return `tablet:text-[24px] tablet:leading-[28px]`;
		} else {
			return '';
		}
	}

	const primaryCategory = postData?.categories?.edges?.find(edge => edge.isPrimary) || (postData?.categories?.edges ? postData?.categories?.edges[0] : '');

	return (
		<div className='ad-free-zone'>
            {!imagePosition && ((featuredImage && featuredImage?.source_url) || optionalImage) && <div className={` mx-auto max-w-full w-full ${!imagePosition ? '-mt-20 laptop:mt-0 laptop:pt-20' : 'laptop:px-20 pt-40'} ${orientation === 'landscape' ? 'max-w-[600px] laptop:max-w-[945px]' : 'max-w-[600px] laptop:max-w-[720px]'}`}>
                {(optionalImage || featuredImage) && !post?.featuredVideoUrl?.includes('http') && <div className={` max-w-full ${orientation === 'landscape' ? 'aspect-[945_/_630] laptop:h-[630px]' : 'aspect-[720_/_960] laptop:h-[960px]'}`}>
					{optionalImage && !post?.featuredVideoUrl?.includes('http') ? (
						<Image 
							src={optionalImage?.url}
							sizes="(max-width: 768px) 100vw, 945px"
							width={1000} 
							height={700} 
							alt={optionalImage.alt} 
							priority={true} 
							className='w-full h-full object-cover'
						/>
					) : featuredImage && featuredImage?.source_url && !post?.featuredVideoUrl?.includes('http') ? (
						<Image 
							src={featuredImage?.media_details?.sizes?.landscape_thumbnail_large?.source_url || featuredImage?.media_details?.sizes?.full?.source_url || featuredImage?.source_url}
							sizes="(max-width: 768px) 100vw, 945px"
							width={1000} 
							height={700} 
							alt={featuredImage?.alt_text} 
							priority={true} 
							className='w-full h-full object-cover'
						/>
					) : null}
					
                </div>}
				{post?.featuredVideoUrl?.includes('http') && <div className={`max-w-full ${orientation === 'landscape' ? 'aspect-[16/9] laptop:h-[532px]' : 'aspect-[16/9] laptop:h-[532px]'}`}>
					{post?.featuredVideoUrl?.includes('http') && 
						<div className='mb-20'>
							<iframe 
								className={`w-full h-auto ${orientation === 'landscape' ? 'aspect-[16/9] laptop:h-[532px]' : 'aspect-[16/9] laptop:h-[532px]'}`}
								width="560" 
								height="315" 
								src={post?.featuredVideoUrl?.includes('watch') ? post?.featuredVideoUrl?.replace('watch?v=', 'embed/') : post?.featuredVideoUrl?.replace('youtu.be/', 'www.youtube.com/embed/')}
								title="YouTube video player" 
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" 
								allowFullScreen
							>
							</iframe>
						</div>
					}
				</div>}

                {(newCaption || optionalImage?.caption || featuredImage?.caption || photoCredit) && 
					<div className='pt-6 laptop:pb-10 px-20 laptop:px-0 font-georgia text-xs leading-xm tablet:text-sm tablet:leading-sm'>
						{newCaption || optionalImage?.caption || featuredImage?.caption && ReactHtmlParser(replaceStraightApostrophes((newCaption || optionalImage?.caption || featuredImage?.caption?.rendered))) }
						{photoCredit && <span className='all-small-caps text-grey'> {ReactHtmlParser(replaceStraightApostrophes(photoCredit || ''))}</span>}
					</div>
				}
            </div>}
			<div className={`max-w-[640px] laptop:max-w-[600px] mx-auto px-20 laptop:px-0 ${!imagePosition ? (sponsored ? 'pt-20 laptop:pt-20' : 'py-20 laptop:py-20') : (sponsored ? 'pt-20 laptop:pt-40' : 'py-20 laptop:py-20')}`}>
                {showCategories && <div className='mb-10'>
				<Link 
					href={primaryCategory?.node?.uri.replace('/category', '')} 
					className={`slug no-underline`}
				>
					{replaceStraightApostrophes(newCategory || primaryCategory?.node?.name)}
				</Link>
					
                </div>}
				{post?.title && <div className='mb-8'>
					<h1 className={`text-mdl leading-base ${titleFontSize ? getFontSize() : 'tablet:text-xl tablet:leading-xl'}`}>{ replaceStraightApostrophes(post.title) }</h1>
				</div>}

				{post?.excerpt && <div className='text-smm leading-smm laptop:leading-smxl font-sans laptop:text-base text-grey font-lightmedium'>
					{ ReactHtmlParser(replaceStraightApostrophes(post.excerpt || '')) }
				</div>}

				{sponsored && <div className={`flex gap-10 items-center ${!imagePosition ? 'pt-20' : 'py-20'}`}>
					<span className='text-xs leading-xs font-sans font-bold uppercase'>
						{ReactHtmlParser(replaceStraightApostrophes(sponsoredType?.label || 'Sponsored by'))}
					</span>
					{!sponsoredImage?.url && <span className='text-xs leading-xs font-sans font-bold uppercase'>
						<a href={sponsoredLink} target='_blank' rel='noreferrer' className='max-w-[100px] h-auto object-contain no-underline text-inherit'>
							{ ReactHtmlParser(replaceStraightApostrophes(sponsoredText || '')) }
						</a>
					</span>}
					{sponsoredImage?.url && <a href={sponsoredLink} target='_blank' rel='noreferrer' className='max-w-[100px] h-auto object-contain'>
						<Image 
							src={sponsoredImage?.url} 
							width={sponsoredImage?.width} 
							height={sponsoredImage?.height} 
							alt={sponsoredImage?.alt || 'sponsor logo'} 
							
						/>
					</a>}
				</div>}

				{!sponsored && showAuthor && newAuthor && <div className='font-bold font-sans text-xs uppercase leading-xs mt-10'>
                    <span 
                        className={`author`}
                    >
                        {`${replaceStraightApostrophes(newAuthor || '')}`}
                    </span>
				</div>}
				{!sponsored && showAuthor && !newAuthor && post?.author?.node && <div className='font-bold font-sans text-xs uppercase leading-xs mt-10'>
                    <Link 
                        href={post?.author?.node?.uri} 
                        className={`author no-underline`}
                    >
                        {`By ${replaceStraightApostrophes(post.author.node.name || '')}`}
                    </Link>
				</div>}
			</div>

			{imagePosition && ((featuredImage && featuredImage?.source_url) || optionalImage) && <div className={`mx-auto max-w-full w-full laptop:px-20 ${orientation === 'landscape' ? 'max-w-[600px] laptop:max-w-[945px]' : 'max-w-[600px] laptop:max-w-[720px]'}`}>
				{(optionalImage || featuredImage) && !post?.featuredVideoUrl?.includes('http') && <div className={`max-w-full ${orientation === 'landscape' ? 'aspect-[945_/_630] laptop:h-[630px]' : 'aspect-[720_/_960] laptop:h-[960px]'}`}>
					{optionalImage && !post?.featuredVideoUrl?.includes('http') ? (
						<Image 
							src={optionalImage?.url} 
							sizes="(max-width: 768px) 100vw, 945px"
							width={1000} 
							height={700} 
							alt={optionalImage?.alt}
							priority={true} 
							className='w-full h-full object-cover'
						/>
					) : featuredImage && !post?.featuredVideoUrl?.includes('http') ? (
						<Image 
							src={featuredImage?.source_url} 
							sizes="(max-width: 768px) 100vw, 945px"
							width={1000} 
							height={700} 
							alt={featuredImage?.alt_text}
							priority={true} 
						 	className='w-full h-full object-cover'
						/>
					) : null}
					
                </div>}
				{post?.featuredVideoUrl?.includes('http') && <div className={`max-w-full ${orientation === 'landscape' ? 'aspect-[16/9] laptop:h-[532px]' : 'aspect-[16/9] laptop:h-[532px]'}`}>
					{post?.featuredVideoUrl?.includes('http') && 
						<div className='mb-20'>
							<iframe 
								className={`w-full h-auto ${orientation === 'landscape' ? 'aspect-[16/9] laptop:h-[532px]' : 'aspect-[16/9] laptop:h-[532px]'}`}
								width="560" 
								height="315" 
								src={post?.featuredVideoUrl?.includes('watch') ? post?.featuredVideoUrl?.replace('watch?v=', 'embed/') : post?.featuredVideoUrl?.replace('youtu.be/', 'www.youtube.com/embed/')}
								title="YouTube video player" 
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" 
								allowFullScreen
							>
							</iframe>
						</div>
					}
				</div>}

				{(newCaption || optionalImage?.caption || featuredImage?.caption || photoCredit) && 
					<div className='pt-6 laptop:pb-10 px-20 laptop:px-0 font-georgia text-xs leading-xm tablet:text-sm tablet:leading-sm'>
						{newCaption || optionalImage?.caption || featuredImage?.caption && ReactHtmlParser(replaceStraightApostrophes((newCaption || optionalImage?.caption || featuredImage?.caption?.rendered))) }
						{photoCredit && <span className='all-small-caps text-grey'> {ReactHtmlParser(replaceStraightApostrophes(photoCredit || ''))}</span>}
					</div>
				}
			</div>}

			<div className='max-w-[640px] mx-auto py-20 px-20'>
				<div className='mb-8 flex gap-6'>
					<ShareButton postTitle={post?.title}/>
				</div>

				<p className='uppercase text-xs leading-normal font-sans text-grey font-lightmedium'>{ formatDate(post?.date) }</p>
			</div>
		</div>
	)
}
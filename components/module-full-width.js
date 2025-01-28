import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactHtmlRender from 'html-react-parser';
import Link from 'next/link';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';
import {getPost} from '@/lib/api';

export default function ModuleFullWidth({ block }) {
	const { post, title, excerpt, category, categoryUri, newCategory, slug, newSlug, featuredImage, backgroundOpacity, overlayOpacity, contentPadding, textColor, contentPosition, hideByline, byline, newByline } = block.attributes;
	const [primaryCategory, setPrimaryCategory] = useState(null);
	
	const postCategoryFetch = async () => {
        let primaryCategoryData = null;
        if (block.attributes?.post?.slug) {
            const data = await getPost(block.attributes?.post?.slug);
            primaryCategoryData = data;
        }
        return primaryCategoryData;
    }

	useEffect(() => {
        const fetchPostData = async () => {
            const fetchedData = await postCategoryFetch();
            const primaryCat = fetchedData?.post?.categories?.edges.find(edge => edge.isPrimary);
            setPrimaryCategory(primaryCat);
        }
        fetchPostData();
    }, [post]);

	return (
		<div 
			className={`ad-free-zone w-full aspect-video isolate relative grid p-0 ${ contentPadding ? 'laptop:p-40' : ''} ${contentPosition === 'center' ? 'items-center tablet:justify-center' : 'tablet:justify-start items-end'}`}
			style={{ '--bg-opacity': (backgroundOpacity ?? 100) + '%', '--overlay-opacity': (overlayOpacity ?? 0) + '%' }}
			>
			
				<div className='laptop:absolute relative aspect-square tablet:aspect-auto tablet:inset-0 -z-10 after:bg-black after:absolute after:block after:inset-0 after:bg-opacity-[var(--overlay-opacity)] after:pointer-events-none'>
					<Link href={block.attributes.post?.link?.replace(process.env.NEXT_PUBLIC_APP_URL, '') || ''} className='no-underline block w-full h-full'>
						<Image 
							src={featuredImage?.media_details?.sizes?.landscape_thumbnail_large?.source_url || featuredImage?.media_details?.sizes?.full?.source_url}
							sizes="(max-width: 768px) 100vw, 100vw" 
							width={featuredImage?.media_details?.sizes?.landscape_thumbnail_large?.width || featuredImage?.media_details?.sizes?.medium_large?.width} 
							height={featuredImage?.media_details?.sizes?.landscape_thumbnail_large?.height || featuredImage?.media_details?.sizes?.medium_large?.height} 
							className='w-full h-full object-cover' 
							loading="lazy"
							alt={featuredImage.alt_text || title }
						/>
					</Link>
				</div>

				<div className={`${ textColor === 'black' ? 'text-dark bg-white' : 'bg-white text-dark laptop:text-white laptop:bg-black' } w-full laptop:max-w-[640px] p-20 tablet:px-40 laptop:p-40 !bg-opacity-100 tablet:!bg-opacity-[var(--bg-opacity)]`}>
					<div className='mb-10'>
						<span className='slug text-inherit'>
							<Link 
								href={primaryCategory?.node?.uri ? 
									`${primaryCategory?.node?.uri?.replace('/category', '')}` : 
									`${primaryCategory?.node?.slug?.replace('/category', '')}`
								} 
								className='no-underline text-inherit'
							>
								{ newCategory || primaryCategory?.node?.name || slug }
							</Link>
						</span>
					</div>

					<div className='mb-8'>
						<h1 className='laptop:text-3xl text-mdl leading-base laptop:leading-3xl text-inherit'>
							<Link href={block.attributes.post?.link?.replace(process.env.NEXT_PUBLIC_APP_URL, '') || ''} className='no-underline laptop:hover:underline text-inherit'>
								{ ReactHtmlRender(replaceStraightApostrophes(title || '')) }
							</Link>
						</h1>
					</div>

					<div className={`${ textColor === 'black' ? 'text-grey' : ''} leading-xm text-sm laptop:leading-sm font-lightmedium font-serif`}>
						{ ReactHtmlRender(replaceStraightApostrophes(excerpt || '')) }
					</div>

					{hideByline == false && !newByline && <div className='pt-10'>
						<p className={`author whitespace-break-spaces ${textColor === 'black' ? 'text-dark' : 'laptop:text-white'}`}>
							<Link href={`author/${byline.slug}` || ''} className='no-underline text-inherit'>
								{ReactHtmlRender(`by ${byline.name}` || '')}
							</Link>
						</p>
					</div>}

					{hideByline == false && newByline && <div className='pt-10'>
						<p className={`author whitespace-break-spaces ${textColor === 'black' ? 'text-dark' : 'laptop:text-white'}`}>{ReactHtmlRender(newByline || '')}</p>
					</div>}
				</div>
			
		</div>
	)
}

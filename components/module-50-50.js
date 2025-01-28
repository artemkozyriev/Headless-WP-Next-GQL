import React, { useCallback, useState, useEffect } from 'react';
import ReactHtmlParser from 'html-react-parser';
import Link from 'next/link';
import Image from 'next/image';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';
import { getPost } from '@/lib/api';

export default function Module5050({ block }) {
	const { imagePosition, title, fontSize, subtitle, author, newAuthor, category, categoryUri, newCategory, post, featuredImage} = block.attributes || [];
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
			if (primaryCat) {
				setPrimaryCategory(primaryCat);
			} else {
				setPrimaryCategory(fetchedData?.post?.categories?.edges[0]);
			}
            
        }
        fetchPostData();
    }, [post]);

	const renderContent = useCallback(() => {
		return (
			<div className={`grid place-content-center pb-40 pt-30 tablet:pt-40 px-20 ${imagePosition !== 'right' ? 'tablet:pl-10' : 'tablet:pr-10'}`}>
				<div className='flex flex-col items-center max-w-[500px] text-center'>
					<div className='font-sans font-medium text-xs leading-xs tablet:leading-xm tablet:text-xm uppercase py-2 underline-offset-[3px] decoration-red underline mb-10'>
						<Link 
							href={primaryCategory ? 
								`${primaryCategory?.node?.uri?.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, '').replace('category/', '')}` : 
								(
									categoryUri ? 
									`${categoryUri.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, '').replace('category/', '')}` : 
									`${category.toLowerCase()}`
								)
							} 
							className='no-underline text-inherit'
							>
								{ newCategory || primaryCategory?.node?.name || category }
						</Link>
					</div>

					<div style={ { fontSize: fontSize ?? 40 + 'px' } }>
						<h1 className='text-white text-[0.65em] laptop:text-[1em] leading-[1.1]'>
							<Link 
								href={primaryCategory ? 
									`${primaryCategory?.node?.uri?.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, '').replace('category/', '')}${post?.slug}` : 
									(
										categoryUri ? 
										`${categoryUri.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, '').replace('category/', '')}${post?.slug}` : 
										`${category.toLowerCase()}/${post?.slug}`
									)
								} 
								className='text-white no-underline laptop:hover:underline'
							>
								{ ReactHtmlParser(replaceStraightApostrophes(title.replace(/"(?=\w)/g, "&#8220;").replace(/"$/g, "&#8221;"))) }
							</Link>
						</h1>
					</div>

					<div className='text-sm leading-xm laptop:text-reg laptop:leading-smxl font-light font-serif text-grey-light mt-8'>
						{ subtitle && ReactHtmlParser(replaceStraightApostrophes(subtitle)) }
					</div>

					{author?.name && !newAuthor && <div className='font-sans font-bold text-xs leading-xs uppercase mt-10'>
						<Link 
							href={`author/${author.slug}`} 
							className='text-white no-underline'
						>
							{ ReactHtmlParser(author.name || '') }
						</Link>
					</div>}
					{newAuthor && <div className='font-sans font-bold text-xs leading-xs uppercase mt-10'>
						{ ReactHtmlParser(newAuthor || '') }
					</div>}
				</div>
			</div>
		)
	}, [title, subtitle, author, category, primaryCategory])
	
	return (
		
		<>
			{post && <div className='ad-free-zone px-20 tablet:px-40 max-w-screen-desktop mx-auto py-20 tablet:py-40'>
				<div className='grid tablet:grid-cols-2 bg-dark text-white'>
					{ imagePosition === 'right' && renderContent() }
					<div className='aspect-square p-10 tablet:row-start-auto row-start-1'>
						{featuredImage && 
							<Link 
								href={primaryCategory ? 
									`${primaryCategory?.node?.uri?.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, '').replace('category/', '')}${post?.slug}` : 
									(
										categoryUri ? 
										`${categoryUri.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, '').replace('category/', '')}${post?.slug}` : 
										`${category.toLowerCase()}/${post?.slug}`
									)
								} 
								className=' bg-dark text-white no-underline'
							>
								<Image 
									width={600} 
									height={600} 
									src={featuredImage?.media_details?.sizes?.square_thumbnail?.source_url || featuredImage?.media_details?.sizes?.full?.source_url} 
									alt={post?.title?.text || post?.slug}
									sizes="(max-width: 834px) 100vw, 100vw" 
									quality={80}
									loading="lazy"
									className='w-full h-full object-cover'
								/>
							</Link>
						}
					</div>
					{ imagePosition !== 'right' && renderContent() }
				</div>
			</div>}
		</>
	)
}

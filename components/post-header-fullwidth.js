import Image from 'next/image';
import React, {useState, useEffect, useRef, lazy} from 'react'
import ReactHtmlParser from 'html-react-parser';
import Link from 'next/link';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

// import {getPost} from '@/lib/api';
// import ShareButton from './share-button';
import ShareButton from './share-button';

export default function FullPostHeader({ block, postData }) {
	const { featuredImage, 
			backgroundOpacity, 
			overlayOpacity, 
			contentPadding, 
			textColor, 
			contentPosition = 'left', 
			showCategories, 
			optionalImage, 
			newCaption, 
			newCategory, 
			newAuthor, 
			showAuthor,
			titleFontSize, 
			photoCredit,
			showNewsletterSidebar,
			newsletterLayout,
			newsletterLink,
			newsletterSubtitle,
			newsletterTitle,
			newsletterImage,
			newsletterButtonText
		} = block.attributes;

		const formatDate = (string) => {
		var options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(string).toLocaleDateString([],options);
	}

	const getFontSize = () => {
		if (titleFontSize == 40) {
			return `text-2xl leading-xlm tablet:text-[40px] tablet:leading-[44px]`;
		} else if (titleFontSize == 44) {
			return `text-2xl leading-xlm tablet:text-[44px] tablet:leading-[48px]`;
		} else if (titleFontSize == 24) {
			return `text-2xl leading-xlm tablet:text-[24px] tablet:leading-[28px]`;
		} else {
			return 'text-2xl leading-xlm tablet:text-4xl tablet:leading-4xl';
		}
	}

	const sidebarBlockRef = useRef(null);
	const [clonedSidebarBlock, setClonedSidebarBlock] = useState(null);

	useEffect(() => {
		if (sidebarBlockRef.current) {
			const clone = sidebarBlockRef.current.cloneNode(true);
			const tagsBlock = document.querySelector('.tags-block');
			const lastBlock = document.querySelectorAll('.wp-block.wp-block-core')[document.querySelectorAll('.wp-block.wp-block-core').length - 1];
			const firstImage = document.querySelector('.article .wp-block-image');

            if (sidebarBlockRef.current.getBoundingClientRect().bottom > firstImage.getBoundingClientRect().top && firstImage.getBoundingClientRect().width > 600) {
                sidebarBlockRef.current.style.top = `calc(100% + 20px + ${firstImage.getBoundingClientRect().top + firstImage.getBoundingClientRect().height - sidebarBlockRef.current.getBoundingClientRect().top + 40}px)`;
            }
			
			sidebarBlockRef.current.classList.add('hidden');
			sidebarBlockRef.current.classList.add('desktopsm:block');
			clone.classList.add('desktopsm:hidden');
			insertAfter(tagsBlock ? tagsBlock : lastBlock, clone);
			setClonedSidebarBlock(clone);

			return () => {
				if (clonedSidebarBlock) {
					clonedSidebarBlock.remove();
				}
			};
		}
	}, [sidebarBlockRef]);

	const insertAfter = (referenceNode, newNode) => {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	const primaryCategory = postData?.categories?.edges?.find(edge => edge.isPrimary) || (postData?.categories?.edges ? postData?.categories?.edges[0] : '');

	return (
		<div className='relative ad-free-zone'>
			<div 
				className={`w-full -mt-20 laptop:h-[calc(100vh-44px)] isolate relative grid laptop:flex p-0 ${ contentPadding ? 'laptop:p-40' : ''} ${contentPosition === 'center' ? 'items-center tablet:justify-center laptop:text-center' : 'tablet:justify-start items-end'}`}
				style={{ '--bg-opacity': (backgroundOpacity ?? 100) + '%', '--overlay-opacity': (overlayOpacity ?? 0) + '%' }}
				>
				
					<div className={`laptop:absolute relative aspect-square tablet:aspect-auto tablet:inset-0 -z-10 after:bg-black after:absolute after:block after:inset-0 after:bg-opacity-[var(--overlay-opacity)] w-screen`}>
						{optionalImage ? (
							<Image 
								src={optionalImage.sizes?.landscape_thumbnail_large?.url || optionalImage?.sizes?.full?.url} 
								sizes="(max-width: 834px) 100vw, 100vw"
								width={optionalImage.sizes?.landscape_thumbnail_large?.width || '1920'} 
								height={optionalImage.sizes?.landscape_thumbnail_large?.height || '1024'} 
								alt={optionalImage.alt_text} 
								priority={true} 
								quality={80}
								placeholder="blur"
								blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk2AUAAMAAvMotNCIAAAAASUVORK5CYII="
								className='w-full h-full object-cover'
							/>
						) : featuredImage ? (
							<Image 
								src={featuredImage.media_details.sizes?.landscape_thumbnail_large?.source_url || featuredImage.media_details.sizes?.full?.source_url} 
								sizes="(max-width: 834px) 100vw, 100vw"
								width={featuredImage.media_details.sizes?.landscape_thumbnail_large?.width || featuredImage.media_details.sizes?.large?.width || '1920'} 
								height={featuredImage.media_details.sizes?.landscape_thumbnail_large?.height || featuredImage.media_details.sizes?.large?.height || '1024'} 
								alt={featuredImage.alt_text} 
								priority={true} 
								quality={80}
								placeholder="blur"
								blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk2AUAAMAAvMotNCIAAAAASUVORK5CYII="
								className='w-full h-full object-cover'
								/>
						) : null}
					</div>
					{(newCaption || optionalImage?.caption || featuredImage?.caption || photoCredit) && 
						<div className='pt-6 laptop:pb-10 tablet:px-40 px-20 font-georgia text-xs leading-xm tablet:text-sm tablet:leading-sm block laptop:hidden max-w-[900px]'>
							{newCaption || optionalImage?.caption || featuredImage?.caption && ReactHtmlParser(replaceStraightApostrophes((newCaption || optionalImage?.caption || featuredImage?.caption?.rendered))) } 
							{photoCredit && <span className='all-small-caps text-grey'> {ReactHtmlParser(replaceStraightApostrophes(photoCredit))}</span>}
						</div>
					}

					<div className={`${!textColor ? 'text-dark laptop:text-white' : textColor === 'dark' ? 'laptop:text-white laptop:bg-dark' : 'bg-white text-dark laptop:text-dark laptop:bg-white' } w-full mx-auto laptop:mx-0 max-w-[640px] laptop:max-w-[640px] p-20 laptop:p-40 bg-opacity-100 tablet:bg-opacity-[var(--bg-opacity)]`}>
						{showCategories && <div className='mb-10'>
							<Link 
								href={primaryCategory?.node?.uri.replace('/category', '')} 
								className={`slug no-underline ${!textColor ? 'text-dark laptop:text-white' : textColor === 'dark' ? 'laptop:text-white' : 'text-dark laptop:text-dark' }`}
							>
									{replaceStraightApostrophes(newCategory || primaryCategory?.node?.name || postData?.categories?.nodes[0].name)}
							</Link>
						</div>}

						<div className='mb-8'>
							<h1 className={`text-inherit ${getFontSize()} ${contentPosition === 'center' ? 'text-center' : ''}`}>
								{ ReactHtmlParser(replaceStraightApostrophes(postData?.title || '')) }
							</h1>
						</div>

						{postData?.excerpt && <div className={`${!textColor ? 'text-grey laptop:text-grey-light' : textColor === 'dark' ? 'text-text-grey-light' : 'text-grey'} leading-smm text-smm laptop:text-base laptop:leading-smxl font-lightmedium font-sans mb-10 ${contentPosition === 'center' ? 'text-center' : ''}`}>
							{ ReactHtmlParser(replaceStraightApostrophes(postData?.excerpt)) }
						</div>}

						{postData?.author?.node && showAuthor && newAuthor && <div className={`${!textColor ? 'text-dark laptop:text-white' : textColor === 'dark' ? 'laptop:text-white' : 'text-dark'} text-xs leading-xs font-heavy uppercase font-sans ${contentPosition === 'center' ? 'text-center' : ''}`}>
							<span 
								className={`author whitespace-break-spaces text-xs leading-xs ${!textColor ? 'text-dark laptop:text-white' : textColor === 'dark' ? 'laptop:text-white' : 'text-dark'}`}
							>
								{ReactHtmlParser(`${replaceStraightApostrophes(newAuthor || postData.author.node.name || '')}`)}
							</span>
						</div>}
						{postData?.author?.node && showAuthor && !newAuthor && <div className={`${!textColor ? 'text-dark laptop:text-white' : textColor === 'dark' ? 'laptop:text-white' : 'text-dark'} text-xs leading-xs font-heavy uppercase font-sans ${contentPosition === 'center' ? 'text-center' : ''}`}>
							<Link 
								href={postData.author.node.uri} 
								className={`author whitespace-break-spaces no-underline text-xs leading-xs ${!textColor ? 'text-dark laptop:text-white' : textColor === 'dark' ? 'laptop:text-white' : 'text-dark'}`}
							>
								{ReactHtmlParser(`By ${replaceStraightApostrophes(postData.author.node.name || '')}`)}
							</Link>
						</div>}
					</div>
				
			</div>
			{(newCaption || optionalImage?.caption || featuredImage?.caption || photoCredit) && 
					<div className='pt-6 laptop:pb-10 px-20 laptop:px-40 font-georgia text-xs leading-xm tablet:text-sm tablet:leading-sm hidden laptop:block max-w-[900px]'>
						{newCaption || optionalImage?.caption || featuredImage?.caption && ReactHtmlParser(replaceStraightApostrophes((newCaption || optionalImage?.caption || featuredImage?.caption?.rendered))) }
						{photoCredit && <span className='all-small-caps text-grey'> {ReactHtmlParser(replaceStraightApostrophes(photoCredit))}</span>}
					</div>
				}
			<div className='max-w-[640px] mx-auto pb-20 laptop:py-20 px-20'>
				<div className='mb-8 flex gap-6'>
					<ShareButton postTitle={postData?.title} />
				</div>

				{postData?.date && <p className='uppercase text-xs leading-normal font-sans text-grey font-lightmedium'>{ formatDate(postData?.date) }</p>}
			</div>
			{showNewsletterSidebar && 
				<div className='desktopsm:absolute desktopsm:left-[calc(50%-640px)] desktop:left-[calc(50%-680px)] top-[calc(100%+20px)] max-w-[640px] mx-auto px-20 py-20 desktopsm:px-0 desktopsm:py-0 desktopsm:max-w-[300px]' ref={sidebarBlockRef}>
					<div className={`w-full text-center px-20 py-40 ${!newsletterLayout ? 'border-t-6 border-dark bg-white' : ''} ${newsletterLayout == 'layout-one' ? 'border-1 border-b-6 border-dark bg-white' : ''} ${newsletterLayout == 'layout-two' ? 'bg-dark' : ''}`}>
						<div className='pb-20'>
							<Image className='mx-auto max-w-[200px]' src={newsletterImage.url} width={310} height={200} alt='image' />
						</div>
						{newsletterTitle && <h3 className='pb-10 text-red'>{ReactHtmlParser(replaceStraightApostrophes(newsletterTitle))}</h3>}
						{newsletterSubtitle && <p className={`pb-20 text-sm leading-sm font-sans font-lightmedium ${!newsletterLayout || newsletterLayout == 'layout-one' ? 'text-dark' : ''} ${newsletterLayout == 'layout-two' ? 'text-white' : ''}`}>{ReactHtmlParser(newsletterSubtitle || '')}</p>}
						<button className={`btn w-full max-w-[300px] ${!newsletterLayout || newsletterLayout == 'layout-one' ? 'btn-secondary' : ''} ${newsletterLayout == 'layout-two' ? 'btn-primary' : ''}`} onClick={() => window.open(newsletterLink ?? '#', newsletterLink ? '_blank' : '_self')}>{replaceStraightApostrophes(newsletterButtonText || 'Subscribe')}</button>
					</div>
				</div>
			}
		</div>
	)
}

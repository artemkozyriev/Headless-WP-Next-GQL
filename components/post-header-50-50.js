import React, { useState, useEffect, useRef } from 'react';
import ReactHtmlRender from 'html-react-parser';
import Link from 'next/link';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';
import Image from 'next/image';
import ShareButton from './share-button';

export default function HalfPostHeader({ block, postData }) {
    const { titleFontSize, 
            featuredImage, 
            textColorHalf, 
            showCategories, 
            optionalImage, 
            newCategory, 
            newAuthor, 
            showAuthor,
            newCaption, 
            photoCredit,
            showNewsletterSidebar,
			newsletterLayout,
			newsletterLink,
			newsletterSubtitle,
			newsletterTitle,
			newsletterImage,
			newsletterButtonText
        } = block.attributes;
    const [post, setPost] = useState(postData ?? []);
    const formatDate = (string) => {
		var options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(string).toLocaleDateString([],options);
	}

    const primaryCategory = postData?.categories?.edges?.find(edge => edge.isPrimary) || (postData?.categories?.edges ? postData?.categories?.edges[0] : '');

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

    return (
        <div className='relative ad-free-zone'>
            <div className='w-screen overflow-hidden -mt-20'>
                <div className={`tablet:h-[calc(100svh)] overflow-hidden flex flex-col-reverse tablet:grid tablet:grid-cols-2 ${textColorHalf === 'light' ? 'text-dark tablet:text-white' : textColorHalf === 'dark' ? 'tablet:text-white tablet:bg-dark' : 'bg-white text-dark tablet:text-dark tablet:bg-white tablet:border-b-1 border-b-grey-light'}`}>
                    <div className='grid place-content-center tablet:pt-40 px-20 tablet:pl-10'>
                        <div className={`${textColorHalf === 'light' ? 'text-dark tablet:text-white' : textColorHalf === 'dark' ? 'tablet:text-white ' : ' text-dark' } w-full max-w-[600px] mx-auto tablet:max-w-[640px] py-20 tablet:px-40 tablet:p-40 bg-opacity-100 tablet:bg-opacity-[var(--bg-opacity)] text-center`}>
                            {showCategories && <div className='mb-10'>
                                <Link 
                                    href={primaryCategory?.node?.uri.replace('/category', '')}
                                    className={`slug no-underline ${textColorHalf === 'light' ? 'text-dark tablet:text-white' : textColorHalf === 'dark' ? 'tablet:text-white ' : ' text-dark' } `}
                                >
                                        { replaceStraightApostrophes(newCategory || primaryCategory?.node?.name)}
                                </Link>
                            </div>}

                            {post?.title && <div className='mb-8'>
                                <h1 className={`${getFontSize()} text-inherit`}>
                                    { ReactHtmlRender(replaceStraightApostrophes(post?.title)) }
                                </h1>
                            </div>}

                            {post?.excerpt && <div className={`${textColorHalf === 'light' ? 'text-dark tablet:text-grey-light' : textColorHalf === 'dark' ? 'text-text-grey-light' : 'text-grey'} leading-smm text-smm tablet:text-base tablet:leading-smxl font-lightmedium font-sans mb-10`}>
                                { ReactHtmlRender(replaceStraightApostrophes(post?.excerpt)) }
                            </div>}

                            {post?.author?.node && showAuthor && newAuthor && <div className='font-bold font-sans text-xs leading-xs uppercase mt-10'>
                                <span 
                                    className={`${textColorHalf === 'light' ? 'text-dark tablet:text-white' : textColorHalf === 'dark' ? 'tablet:text-white ' : ' text-dark' } author text-xs leading-xs whitespace-break-spaces`}
                                >
                                    {`${ReactHtmlRender(replaceStraightApostrophes(newAuthor || post.author.node.name))}`}
                                </span>
                            </div>}
                            {post?.author?.node && showAuthor && !newAuthor && <div className='font-bold font-sans text-xs leading-xs uppercase mt-10'>
                                <Link 
                                    href={post.author.node.uri} 
                                    className={`${textColorHalf === 'light' ? 'text-dark tablet:text-white' : textColorHalf === 'dark' ? 'tablet:text-white ' : ' text-dark' } author no-underline text-xs leading-xs whitespace-break-spaces`}
                                >
                                    {`By ${ReactHtmlRender(replaceStraightApostrophes(post.author.node.name || ''))}`}
                                </Link>
                            </div>}
					    </div>
                    </div>
                    <div className='tablet:row-start-auto row-start-1 tablet:h-[calc(100svh)]'>
                        <Image
                            src={(optionalImage?.sizes?.square_thumbnail_large?.url || optionalImage?.url) || (featuredImage.media_details.sizes?.square_thumbnail_large?.source_url || featuredImage.media_details.sizes?.full?.source_url)}
                            sizes="(max-width: 834px) 50vw, (max-width: 1024px) 80vw, 100vw"
                            width={(optionalImage?.sizes?.square_thumbnail_large?.width || optionalImage?.width) || (featuredImage.media_details.sizes?.square_thumbnail_large?.width || featuredImage.media_details.sizes?.full?.width || '1920')} 
                            height={(optionalImage?.sizes?.square_thumbnail_large?.height || optionalImage?.height) || (featuredImage.media_details.sizes?.square_thumbnail_large?.height || featuredImage.media_details.sizes?.full?.height || '1024')} 
                            alt={(optionalImage || featuredImage).alt_text} 
                            priority={true}
                            quality={80}
                            className='w-full h-full object-cover'
                        />
                        {(newCaption || optionalImage?.caption || featuredImage?.caption || photoCredit) && 
                            <div className='text-left py-5 px-20 tablet:hidden block text-xs leading-xm tablet:text-sm tablet:leading-sm max-w-[900px]'>
                                {ReactHtmlRender(replaceStraightApostrophes(newCaption || optionalImage?.caption || featuredImage?.caption?.raw || '')) }
                                {photoCredit && <span className='all-small-caps text-grey'> {ReactHtmlRender(replaceStraightApostrophes(photoCredit))}</span>}
                            </div>
                        }
                    </div>
                </div>
                {(newCaption || optionalImage?.caption || featuredImage?.caption?.raw || photoCredit) && 
                    <div className='flex justify-end'>
                        <div className='text-right py-5 px-20 hidden tablet:block text-xs leading-xm tablet:text-sm tablet:leading-sm max-w-[900px]'>
                            { ReactHtmlRender(replaceStraightApostrophes(newCaption || optionalImage?.caption || featuredImage?.caption?.raw || '')) }
                            {photoCredit && <span className='all-small-caps text-grey'> {ReactHtmlRender(replaceStraightApostrophes(photoCredit))}</span>}
                        </div>
                    </div>
                }
            </div>
            <div className='max-w-[640px] mx-auto pb-20 px-20 pt-20'>
				<div className='mb-8 flex gap-6'>
					<ShareButton postTitle={post?.title}/>
				</div>

				<p className='uppercase text-xs leading-normal font-sans text-grey font-lightmedium'>{ formatDate(post.date) }</p>
			</div>
            {showNewsletterSidebar && 
				<div className='desktopsm:absolute desktopsm:left-[calc(50%-640px)] desktop:left-[calc(50%-680px)] top-[calc(100%+20px)] max-w-[640px] mx-auto px-20 py-20 desktopsm:px-0 desktopsm:py-0 desktopsm:max-w-[300px]' ref={sidebarBlockRef}>
					<div className={`w-full text-center px-20 py-40 ${!newsletterLayout ? 'border-t-6 border-dark bg-white' : ''} ${newsletterLayout == 'layout-one' ? 'border-1 border-b-6 border-dark bg-white' : ''} ${newsletterLayout == 'layout-two' ? 'bg-dark' : ''}`}>
						<div className='pb-20'>
							<Image className='mx-auto max-w-[200px]' src={newsletterImage.url} width={310} height={200} alt='image' />
						</div>
						{newsletterTitle && <h3 className='pb-10 text-red'>{ReactHtmlRender(replaceStraightApostrophes(newsletterTitle))}</h3>}
						{newsletterSubtitle && <p className={`pb-20 text-sm leading-sm font-sans font-lightmedium ${!newsletterLayout || newsletterLayout == 'layout-one' ? 'text-dark' : ''} ${newsletterLayout == 'layout-two' ? 'text-white' : ''}`}>{ReactHtmlRender(replaceStraightApostrophes(newsletterSubtitle || ''))}</p>}
						<button className={`btn w-full max-w-[300px] ${!newsletterLayout || newsletterLayout == 'layout-one' ? 'btn-secondary' : ''} ${newsletterLayout == 'layout-two' ? 'btn-primary' : ''}`} onClick={() => window.open(newsletterLink ?? '#', newsletterLink ? '_blank' : '_self')}>{replaceStraightApostrophes(newsletterButtonText || 'Subscribe')}</button>
					</div>
				</div>
			}
        </div>
    )
}
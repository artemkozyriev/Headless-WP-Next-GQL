import { useState, useEffect, useRef} from 'react';
import ReactHtmlParser from 'html-react-parser';
import RenderBlock from '../renderBlock';
// const RenderBlock = lazy(() => import('../renderBlock'));
import Link from 'next/link';
import Image from 'next/image';
// const ShareButton = lazy(() => import('../share-button'));
import ShareButton from '../share-button';
import parseContentImages from '@/lib/utils/parseContentImages';
import Glide from '@glidejs/glide';
// const Glide = lazy(() => import('@glidejs/glide'));
import {getMediaItem} from '@/lib/api';
import PostHeader from '../post-header';

export default function PostTemplate({ postData, wrapperData, draft = false }) {
    // const [isClient, setIsClient] = useState(false);
    const [parsedContent, setParsedContent] = useState(null);
    const [sponsorInExcerpt, setSponsorInExcerpt] = useState(false);
    const [customFieldImage, setCustomFieldImage] = useState(null);
    const tagsBlockRef = useRef(null);
    const article = useRef(null);
    let timer = 0;
    let i = 0;

    useEffect(() => {
        let timer;
        // setIsClient(true);
        timer = setInterval(() => {
            if (article.current) {
                clearInterval(timer);
                window.dispatchEvent(new CustomEvent('renderingComplete'));
            }
        }, 100);
    }, []);

    useEffect(() => {
        if (postData?.blocks && postData?.blocks.length <= 0 && postData?.content !== '') {
			let modifiedContent;
			if (postData?.featuredImage?.node?.sourceUrl) {
				modifiedContent = removeFeaturedImageFromContent(postData?.featuredImage?.node.sourceUrl, postData.content);
                if (postData?.featuredImage?.node?.mediaDetails?.sizes.find(size => size.name === 'full')?.sourceUrl) {
                    modifiedContent = removeFeaturedImageFromContent(postData?.featuredImage?.node?.mediaDetails?.sizes.find(size => size.name === 'full')?.sourceUrl, postData.content);
                }
                
			}
            const convertedBase64 = convertBase64ToImage(modifiedContent ?? postData?.content);
            setParsedContent(parseContentImages(convertedBase64));
            const parser = new DOMParser();
            const doc = parser.parseFromString(postData.excerpt, 'text/html');

            const aTagsWithTargetBlankImg = doc.querySelectorAll('a[target="_blank"] img');
            if (aTagsWithTargetBlankImg.length > 0) {
                setSponsorInExcerpt(true);
            }

            if (postData?.longformHeroImage && postData.longformHeroImage !== 'longform_hero_image') {
                const fetchImage = async () => {
                    const data = await getMediaItem(postData?.longformHeroImage);
        
                    setCustomFieldImage(data);
                };
        
                fetchImage();
            }
        }
        

        timer = setInterval(() => {
            if (document.querySelector('.glide') && i < 10) {
                clearInterval(timer);
                new Glide('.glide', {
                    type: 'slider',
                    startAt: 0,
                    perView: 1
                }).mount();
            }
            i++;
        }, 200);
    }, [postData]);

    useEffect(() => {
        defineSponsored();
    }, [parsedContent]);

    const formatDate = (string) => {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }

    const authorField = () => {
        if (postData?.author?.node?.posts?.nodes?.length > 1) {
            return (
                <>
                    {postData?.authorDisplayText !== 'AuthorDisplayText' && postData.author.node.name == postData?.authorDisplayText && <Link className='author no-underline' href={postData.author.node.uri}>
                        {postData.author.node.name}
                    </Link>}
                    {postData?.authorDisplayText == 'AuthorDisplayText' && postData.author.node.name !== postData?.authorDisplayText && <Link className='author no-underline' href={postData.author.node.uri}>
                        {postData.author.node.name}
                    </Link>}
                    {postData?.authorDisplayText !== 'AuthorDisplayText' && postData.author.node.name !== postData?.authorDisplayText && <span className='author no-underline' href={postData.author.node.uri}>
                        {postData?.authorDisplayText}
                    </span>}
                </>
            )
        } else {
            return (
                <span className='author'>{postData?.authorDisplayText || postData.author.node.name}</span>
            )
        }
    }

    const convertBase64ToImage = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const paragraphs = doc.querySelectorAll('p');
    
        paragraphs.forEach((p) => {
            const text = p.innerText.trim();
            if (text.startsWith('base64:::')) {
                p.remove();
            }
        });
    
        return doc.body.innerHTML;
    }

    const removeFeaturedImageFromContent = (imageUrl, content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const images = doc.querySelectorAll(`img`);
        const imageName = getImageNameFromUrl(imageUrl).substring(0, 11);
    
        const srcParts = images[0]?.src.split('/');
        const imgNameWithExtension = srcParts ? srcParts[srcParts.length - 1] : null;
        const imgName = imgNameWithExtension ? imgNameWithExtension.split('.')[0] : null;

        // console.log(imgName, imageName);

        if (imgName?.includes(imageName) && imageName) {
            if (images[0].closest('figure')) {
                images[0].closest('figure').remove();
            }
            if (images[0].closest('h2')) {
                images[0].closest('h2').remove();
            }
            if (images[0].closest('p')) {
                images[0].closest('p').remove();
            }
            if (images[0].closest('.longform-fwimg-container')) {
                images[0].closest('.longform-fwimg-container').remove();
            }
            // img.remove();
        }

        if (imageName?.includes(imgName) && imgName) {
            if (images[0].closest('figure')) {
                images[0].closest('figure').remove();
            }
            if (images[0].closest('h2')) {
                images[0].closest('h2').remove();
            }
            if (images[0].closest('p')) {
                images[0].closest('p').remove();
            }
            if (images[0].closest('.longform-fwimg-container')) {
                images[0].closest('.longform-fwimg-container').remove();
            }
            // img.remove();
        }
    
        return doc.body.innerHTML;
    };

    function getImageNameFromUrl(imageUrl) {
        const urlParts = imageUrl?.split('/');
        const imageNameWithExtension = urlParts ? urlParts[urlParts?.length - 1] : '';
        const imageName = imageNameWithExtension?.split('.')[0];
        return imageName;
    }

    const defineSponsored = () => {
        if (postData?.categories?.nodes && postData.categories.nodes.length > 0) {
            // if (postData.categories.nodes[0].name.toLowerCase() === 'sponsored') {
                const sponsorElement = document.querySelector('a[target="_blank"] img')?.closest('p, div');
                const p = document.createElement('p');
                
                if (!sponsorElement?.classList?.contains('wp-blocks')) {
                    sponsorElement?.classList.add('sponsored');
                } else {
                    if (sponsorElement?.querySelector('a[target="_blank"]')) {
                        sponsorElement.prepend(p);
                        p?.classList.add('sponsored');
                        p?.appendChild(sponsorElement.querySelector('a[target="_blank"]').previousElementSibling);
                        p?.appendChild(sponsorElement.querySelector('a[target="_blank"]'));
                    }
                }
                
            // }
        }
    };
    
    // for the post Image
    let image = postData?.featuredImage?.node?.mediaDetails?.sizes.find(size => size.name === 'landscape_thumbnail')?.sourceUrl;
    if (!image) {
        image = postData?.featuredImage?.node?.mediaDetails?.sizes.find(size => size.name === 'medium_large')?.sourceUrl;
    }

    // Determine the width of the post header
    let postHeaderWidth = 'default'
    if (postData?.blocks && postData?.blocks[0]?.name === 'macleans/post-header' && postData.blocks[0]?.attributes?.layout) {
        postHeaderWidth = postData.blocks[0].attributes.layout;
    }

    // Find the Primary Category
    const primaryCategory = postData?.categories?.edges?.find(edge => edge.isPrimary) || (postData?.categories?.edges ? postData?.categories?.edges[0] : '');

    return (
        <>
            <div ref={article} className={`article`} data-post-type={postData?.blocks && postData.blocks.length > 0 ? 'new-post' : 'legacy-post'} data-post-header-width={postHeaderWidth} data-post-id={`post-` + `${postData?.postId}`}>
                {postData?.blocks && postData.blocks.length > 0 ? (
                    <div className={'wp-blocks'}>
                        <div key={0} className={`wp-block ${postData.blocks[0].name.startsWith('core/') ? 'wp-block-core' : ''}`}>
                            {postData?.blocks[0]?.name == 'macleans/post-header' ? 
                                <PostHeader block={postData.blocks[0]} key={0} postData={postData} draft={draft} />
                                :
                                <RenderBlock block={postData.blocks[0]} index={0} postData={postData}/>
                            }
                        </div>
                        {postData.blocks.slice(1).map((block, index) => (
                            <div key={index+1} className={`wp-block ${block.name.startsWith('core/') ? 'wp-block-core' : ''}`}>
                                {
                                    block.name == 'macleans/newsletter-signup' ?
                                    <>
                                        {postData?.tags?.nodes?.length > 0 && <div className='max-w-[640px] mx-auto tags-block' ref={tagsBlockRef}>
                                            <div className='pt-10 px-20 desktopsm:pt-20 desktopsm:-mb-20 items-center justify-start text-xs leading-xs desktop:text-xm desktop:leading-xm'>
                                                <span className='pr-10 uppercase text-grey'>tags:</span>
                                                {postData?.tags?.nodes && postData.tags.nodes.map((tag, index) => (
                                                    <Link href={`tag/${tag.slug}`} key={index} className='pr-10 uppercase w-auto text-dark no-underline hover:opacity-60'>{tag.name}</Link>
                                                ))}
                                            </div>
                                        </div>}
                                        <RenderBlock block={block} index={index+1} postData={postData} />
                                    </>
                                    :
                                    <RenderBlock block={block} index={index+1} postData={postData} />
                                }
                            </div>
                        ))}
                    </div>
                ) : (  
                    <>
                        <div className='ad-free-zone max-w-[600px] mx-auto pb-40'>
                            {primaryCategory && 
                                <div className='mb-10'>
                                    <Link href={primaryCategory.node.uri.replace('/category/', '')} className='slug no-underline'>
                                        {primaryCategory.node.name}
                                    </Link>
                                </div>
                            }
                            {postData?.title && <h1 className='mb-8 text-mdl leading-base tablet:text-xl tablet:leading-xl'>{ReactHtmlParser(postData.title || '')}</h1>}  
                            <div className='mb-10 text-smm leading-smm laptop:leading-smxl font-sans laptop:text-base text-grey font-lightmedium'>{postData?.excerpt && !sponsorInExcerpt && ReactHtmlParser(postData.excerpt || '')}</div>
                            {postData?.author?.node?.name && <div className='pb-40 text-sm leading-xm laptop:text-xs laptop:leading-xs'>{authorField()}</div>}
                            {!postData?.featuredVideoUrl?.includes('http') && postData?.featuredImage?.node?.sourceUrl && 
                                <div className='mb-20'>
                                    {!customFieldImage && <Image 
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        src={image} 
                                        width={600} 
                                        height={400} 
                                        alt={postData?.featuredImage?.node.altText || postData?.featuredImage?.node.description || 'Content image'} 
                                    />}
                                    {!customFieldImage && postData?.featuredImage?.node?.caption && <div className='pt-6 laptop:pb-10 px-20 laptop:px-0 font-georgia text-xs leading-xm tablet:text-sm tablet:leading-sm'>
                                        {postData.featuredImage.node.caption && ReactHtmlParser(postData.featuredImage.node.caption || '')}
                                    </div>}
                                    {customFieldImage && <Image 
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        src={customFieldImage.mediaDetails.sizes.find(size => size.name === 'medium_large')?.sourceUrl} 
                                        width={600} 
                                        height={400} 
                                        alt={customFieldImage.altText || customFieldImage.description || 'Content image'} 
                                    />}
                                    {customFieldImage && customFieldImage.caption && <div className='pt-6 laptop:pb-10 px-20 laptop:px-0 font-georgia text-xs leading-xm tablet:text-sm tablet:leading-sm'>
                                        {customFieldImage.caption && ReactHtmlParser(customFieldImage.caption || '')}
                                    </div>}
                                </div>
                            }
                            {postData?.featuredVideoUrl.includes('http') && 
                                <div className='mb-20'>
                                    <iframe 
                                        className='w-full h-auto aspect-video'
                                        width="560" 
                                        height="315" 
                                        src={postData.featuredVideoUrl.includes('watch') ? postData.featuredVideoUrl.replace('watch?v=', 'embed/') : postData.featuredVideoUrl.replace('youtu.be/', 'www.youtube.com/embed/')}
                                        title="YouTube video player" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" 
                                        allowFullScreen
                                    >
                                    </iframe>
                                </div>
                            }
                            <div className='max-w-[44px]'><ShareButton title={postData.title} /></div>
                            {postData?.date && <time>{formatDate(postData.date)}</time>}
                        </div>
                        <div className={'wp-blocks legacy'}>
                            {parsedContent || ReactHtmlParser(postData.content || '')}
                        </div>
                        {postData?.tags?.nodes?.length > 0 && <div className='max-w-[600px] mx-auto'>
                            <div className='pt-24 pb-20 items-center justify-start text-xs leading-xs desktop:text-xm desktop:leading-xm'>
                                <span className='pr-10 uppercase text-grey'>tags:</span>
                                {postData?.tags?.nodes && postData.tags.nodes.map((tag, index) => (
                                    <Link href={`tag/${tag.slug}`} key={index} className='pr-10 uppercase w-auto text-dark no-underline hover:opacity-60'>{tag.name}</Link>
                                ))}
                            </div>
                        </div>}
                    </>
                    )} 
            </div>
        </>
    );
}

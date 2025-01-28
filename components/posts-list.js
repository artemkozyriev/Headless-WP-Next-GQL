import { getAllPosts, getAllPostsByCategories, getAllPostsByCategory, getAllPostsByTag, getPostsByAuthor, getAllPostsByTags, getPopularPosts, getLatestPosts, getMediaItem } from '@/lib/api';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Pagination from './pagination';
import Link from 'next/link';
import Image from 'next/image';
import ReactHtmlParser from 'html-react-parser';
import { stripAnchorTags } from '@/lib/utils/stripTags';
import PlayIcon from '../assets/icons/icon-video-play.svg';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function PostsList({ currentPage, handlePaginationClick, taxonomyType, taxonomySlug, taxonomyQuery, sidebarTitle, queryPosts }) {
    const [popularPosts, setPopularPosts] = useState([]);
	const router = useRouter();
    const queryParams = router.query;
    const initialPage = parseInt(queryParams.page) || 0;
	const [allPosts, setAllPosts] = useState(initialPage == 0 ? queryPosts?.edges : []);
	const [localPageInfo, setLocalPageInfo] = useState(initialPage == 0 ? queryPosts?.pageInfo : []);
	const [localCurrentPage, setLocalCurrentPage] = useState(initialPage);
	const [fetchFunction, setFetchFunction] = useState(() => {});
	const [localTaxonomySlug, setLocalTaxonomySlug] = useState(taxonomySlug ?? 'category');
	const postListBlock = useRef(null);
	const fetchPopularPosts = async () => {
		const data = await getPopularPosts(4, 0);
		setPopularPosts(data?.edges);
	}

	useEffect(() => {
		setLocalCurrentPage(initialPage);

		const fetchPosts = async () => {
			if ( taxonomySlug && taxonomyType === 'category' ) {
				const fetchedPosts = await getAllPostsByCategory(12, 12*initialPage, taxonomySlug);
				// setFetchFunction((prev) => async (size, offset) => await getAllPostsByCategory(size, offset, taxonomySlug));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('categories');
			}

			if ( taxonomySlug && taxonomyType === 'tag' ) {
				const fetchedPosts = await getAllPostsByTag(12, 12*initialPage, taxonomySlug);
				// setFetchFunction((prev) => async (size, offset) => await getAllPostsByTag(size, offset, taxonomySlug));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('tags');
			}

			if ( taxonomySlug && taxonomyType === 'author' ) {
				const fetchedPosts = await getPostsByAuthor(12, 12*initialPage, taxonomySlug);
				// setFetchFunction((prev) => async (size, offset) => await getAllPostsByTag(size, offset, taxonomySlug));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('author');
			}

			if ( taxonomySlug && taxonomySlug === 'categories' ) {
				const fetchedPosts = await getLatestPosts(12, 12*initialPage, taxonomySlug);
				// setFetchFunction((prev) => async (size, offset) => await getAllPostsByTag(size, offset, taxonomySlug));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('categories');
			}

			if (!taxonomySlug && taxonomyQuery?.category?.length ) {
				const fetchedPosts = await getAllPostsByCategories(12, 12*initialPage, taxonomyQuery.category[0]);
				// setFetchFunction((prev) => async (size, offset) => await getAllPostsByCategories(size, offset, taxonomyQuery.category));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('categories');
			}
			else if (!taxonomySlug &&  taxonomyQuery?.post_tag?.length ) {
				const fetchedPosts = await getAllPostsByTags(12, 12*initialPage, taxonomyQuery.post_tag);
				// setFetchFunction((prev) => async (size, offset) => await getAllPostsByTags(size, offset, taxonomyQuery.post_tag));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('tags');
			}
			else if (!taxonomySlug) {
				const fetchedPosts = await getAllPosts(12, 12*initialPage);
				// setFetchFunction((prev) => async (size, offset) => await getAllPosts(size, offset));
				setAllPosts(fetchedPosts?.edges);
				setLocalPageInfo(fetchedPosts?.pageInfo);
				setLocalTaxonomySlug('categories');
			}
		}

		fetchPosts();
		fetchPopularPosts();
	}, [])

	const handleClick = async (pageNumber) => {
		// e.preventDefault();
		// if (localPageInfo) {
		// 	const data = await fetchFunction(size, offset);
		// 	setLocalPageInfo(data.pageInfo);
		// 	setAllPosts(data.edges);
		// 	setLocalCurrentPage(offset/12);
		// }
		// const size = 12;
        // const offset = pageNumber * size;
		
        // if (localPageInfo) {
        //     const data = await fetchFunction(size, offset);
		// 	console.log(data);
        //     setLocalPageInfo(data.pageInfo);
        //     setAllPosts(data.edges);
        //     setLocalCurrentPage(pageNumber);
        // }
	}

	const [postLogos, setPostLogos] = useState([]);

	useEffect(() => {
		const fetchPostLogos = async () => {
			if (allPosts) {
				const logosArray = await Promise.all(
					allPosts?.map(async (node) => {
					  if (node.node.sponsorLogo) {
						const logo = await getMediaItem(parseInt(node.node.sponsorLogo));
						return { postId: node.node.postId, logo };
					  }
					  return { postId: node.node.postId };
					})
				  );
				  setPostLogos(logosArray);
			}
		};
	  
		fetchPostLogos();
	}, [allPosts])

	

  	return (
		<div className='ad-free-zone laptop:grid grid-cols-[1fr_300px] laptop:gap-60 desktop:gap-[155px] overflow-hidden'>
			<div className='pb-20' ref={postListBlock}>
				<div className={`${allPosts?.length > 0 ? '' : 'h-[3000px]'}`}>
					{allPosts?.length !== 0 && allPosts?.map((node, index) => {
						const sizes = node.node.featuredImage?.node?.mediaDetails?.sizes;
						let mediumImage;
						if (sizes) {
							mediumImage = sizes.find(size => size.name === "landscape_thumbnail") ||
										  sizes.find(size => size.name === "medium_large") ||
										  sizes.find(size => size.name === "medium") ||
										  sizes.find(size => size.name === "featured-image-landscape");
						}						
						const sponsored = node.node?.blocks?.length ? node.node?.blocks[0]?.attributes?.sponsored : false;
						const sponsoredText = node.node?.blocks?.length ? node.node?.blocks[0].attributes?.sponsoredText : '';
						const sponsoredImage = node.node?.blocks?.length ? node.node?.blocks[0].attributes?.sponsoredImage : '';
						const sponsoredType = node.node?.blocks?.length ? node.node?.blocks[0].attributes?.sponsoredType?.label : '';

						const sponsorPrefix = node?.node.sponsorPrefix;
						const sponsorLogo = postLogos[index]?.logo;
						const sponsorName = node.node.sponsorName;
						const sponsorUrl = node.node.sponsorUrl;

						const primaryCat = node?.node?.categories?.edges.find(edge => edge.isPrimary)?.node;
						const primaryCategory = primaryCat ? primaryCat : node.node.categories.edges[0].node;

						return (
							<div key={node.node.postId} className='py-20 border-b-grey-light border-b last:border-b-0'>
								<div className='no-underline tablet:grid tablet:grid-cols-[224px_1fr_1fr] laptop:grid-cols-[300px_1fr_1fr] group after:block after:clear-both'>
									<div className='tablet:w-full tablet:max-w-[224px] tablet:h-[150px] laptop:max-w-[300px] laptop:h-[200px] tablet:overflow-hidden object-cover'>
										<div className='relative tablet:float-none float-right ml-20 tablet:mb-0 tablet:ml-0 object-cover h-full'>
											<Link href={`${primaryCategory?.uri?.replace('/category', '')}${node.node.slug}`} className='no-underline'>
												<Image
													className='w-[90px] tablet:w-full aspect-square tablet:aspect-[300/200] object-cover'
													src={mediumImage?.sourceUrl ?? '/no-image.jpg'}
													alt={node.node.featuredImage?.node?.altText ?? 'no-image'}
													sizes="(max-width: 768px) 200px, 300px" 
													width={300}
													height={200}
													onError={(e) => { if ( e.target.src !== '/no-image.jpg') { e.target.src = '/no-image.jpg'; e.target.srcset = '' } }}
													quality={80}
													priority={index < 5 ? true : false}
													loading={index < 5 ? 'eager' : 'lazy'}
													rel={index < 5 ? 'preload' : 'prefetch'}
												/>
												{ (node.node.categories?.edges[0].node.name === 'Video' || taxonomySlug === 'Video' || node.node.featuredVideoUrl.includes('http')) && 
													<div className='absolute inset-0 grid place-content-center pointer-events-none'>
														<PlayIcon className='w-40 h-40 tablet:w-80 tablet:h-80 object-contain'/>
													</div> 
												}
											</Link>
										</div>
									</div>
									<div className='col-span-2 tablet:pl-20 desktop:pl-40 tablet:w-full w-[calc(100%-100px)]'>
										{sponsored && <div className='flex gap-10 items-center'>
											{sponsoredType && <span className='text-xs leading-xs font-sans font-bold uppercase text-dark'>
												{ ReactHtmlParser(sponsoredType || '') }
											</span>}
											{!sponsoredImage && <span className='text-xs leading-xs font-sans font-bold uppercase text-dark'>
												{ ReactHtmlParser(sponsoredText || '') }
											</span>}
											{sponsoredImage && <div className='max-w-[100px] h-auto object-contain'>
												<Image 
													src={sponsoredImage?.url} 
													width={sponsoredImage?.width} 
													height={sponsoredImage?.height} 
													alt={sponsoredImage?.alt || 'sponsor logo'} 
													loading="lazy"
												/>
											</div>}
										</div>}
										{!sponsored && taxonomyType !== 'category' && taxonomyType !== 'tag' && taxonomyType !== 'author' && 
											<span className='slug'>
												<Link href={`${primaryCategory?.uri.replace('/category', '')}`} className='no-underline text-dark'>
													{primaryCategory?.name ?? localTaxonomySlug}
												</Link>
											</span>
										}
										{!sponsored && sponsorPrefix && <div className='flex gap-10 items-center'>
											{sponsorPrefix && <span className='text-xs leading-xs font-sans font-bold uppercase text-dark'>
												{ ReactHtmlParser(sponsorPrefix || '') }
											</span>}
											{!sponsorLogo && sponsorName && <span className='text-xs leading-xs font-sans font-bold uppercase text-dark'>
												{ ReactHtmlParser(sponsorName || '') }
											</span>}
											{sponsorLogo && <div className='max-w-[100px] h-auto object-contain'>
												<Image 
													src={sponsorLogo?.sourceUrl} 
													width={100} 
													height={100} 
													alt={sponsorLogo?.altText || 'sponsor logo'} 
													loading="lazy"
												/>
											</div>}
										</div>}
										<h3 className='mt-5 tablet:mt-10 mb-4'>
											<Link href={`${primaryCategory?.uri.replace('/category', '')}${node.node.slug}`} className='no-underline laptop:hover:underline text-dark'>
												{ReactHtmlParser(replaceStraightApostrophes(node.node.title || ''))}
											</Link>
										</h3>
										<div className='text-smm leading-smm text-grey font-serif font-normal'>
											{ReactHtmlParser(stripAnchorTags(replaceStraightApostrophes(node.node.excerpt)) || '')}
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
				<div className='py-20'>
					<Pagination 
						handlePaginationClick={handleClick } 
						currentPage={localCurrentPage} 
						pageInfo={localPageInfo} 
						postListBlock={postListBlock}
					/>
				</div>
			</div>
			
			<aside className='pt-10 pb-40 flex-col hidden laptop:flex'>
				<div>
					<h2 className='text-3xl font-grotesk font-medium leading-3xlm uppercase text-center py-5 border-t-dark border-t-6'>{ sidebarTitle ?? 'Popular'}</h2>

					<div>
						{ popularPosts?.map(({ node: post }, idx) => {
							const sizes = post.featuredImage?.node?.mediaDetails?.sizes
							let mediumImage;
							if (sizes) {
								mediumImage = sizes.find(size => size.name === "thumbnail") ||
											  sizes.find(size => size.name === "medium") ||
											  sizes.find(size => size.name === "medium_large") ||
											  sizes.find(size => size.name === "extra-large") ||
											  sizes.find(size => size.name === "large") || 
											  sizes.find(size => size.name === "full");
							}
							const primaryCat = post?.categories?.edges.find(edge => edge.isPrimary)?.node;
							const primaryCategory = primaryCat ? primaryCat : post.categories.edges[0].node;

							return (
								<div key={idx} className='grid grid-cols-[1fr_90px] no-underline py-20 border-t border-t-grey-light group'>
									<div className='pr-20'>
										<span className='slug'>
											<Link href={`${primaryCategory?.uri?.replace('/category', '')}`} className='no-underline text-dark'>
												{ primaryCategory.name }
											</Link>
										</span>

										<h3 className='mt-4 font-medium text-reg leading-smxl'>
											<Link href={`${primaryCategory?.uri?.replace('/category', '')}${post.slug}`} className='no-underline laptop:hover:underline text-dark'>
												{ ReactHtmlParser(post.title || '') }
											</Link>
										</h3>
									</div>
									<div className='relative'>
										<Link href={`${primaryCategory?.uri?.replace('/category', '')}${post.slug}`} className='no-underline'>
											<div className='aspect-square'>
												<Image
													className='w-full h-full object-cover'
													src={mediumImage?.sourceUrl ?? '/no-image.jpg'}
													alt={post.featuredImage?.node?.altText ?? 'no-image'}
													width={mediumImage?.width ?? 150}
													height={mediumImage?.height ?? 100}
													onError={(e) => { if ( e.target.src !== '/no-image.jpg') { e.target.src = '/no-image.jpg'; e.target.srcset = '' } }}
													priority={false}
													loading="lazy"
													quality={80}
												/>
											</div>
											{ post.categories.edges[0].node.name === 'Video' && 
												<div className='absolute inset-0 grid place-content-center pointer-events-none'>
													<PlayIcon className='w-40 h-40 object-contain'/>
												</div> 
											}
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</aside>
		</div>
	)
}

import { useState, useEffect, useRef } from 'react';
import PostSelector from './post-selector';
import { useDynamicPosts } from '@/lib/utils/useDynamicPostsHook';
// import Image from 'next/image';
// import { getAllPostsByCategory, getAllPostsByTag, getCategories, getCategoryById, getTagById, getAuthorById, getTags } from '@/lib/api';

export default function Module({block, index}) {
	const { category, tag } = block.attributes || {};
    // const [isClient, setIsClient] = useState(false);
    const moduleBlock = useRef(null);
    const blocksMobile = useRef(null);
	// const [ dynamicPosts, setDynamicPosts ] = useState([]);

	const dynamicPosts = useDynamicPosts(category, tag, 7); // block.attributes.selectedPosts && block.attributes.selectedPosts.length > 0 ? [] : 

    useEffect(() => {
        // setIsClient(true);
        moveBlocks();
    }, [])

    useEffect(() => {
        // setIsClient(true);
        moveBlocks();
    }, [dynamicPosts])

    const moveBlocks = () => {
        if (block?.attributes?.secondLayout) return;
		// if ( (category || tag) && !dynamicPosts.length ) return;

        const columnFirst = moduleBlock.current?.querySelectorAll('.column')[0];
        const columnSecond = moduleBlock.current?.querySelectorAll('.column')[1];
        const postBlocksFirst = columnFirst?.querySelectorAll('.post-block');
        const postBlocksSecond = columnSecond?.querySelectorAll('.post-block');

        if (postBlocksFirst && postBlocksFirst[1] && postBlocksSecond && postBlocksSecond[1] && blocksMobile.current.children.length === 0) {
            blocksMobile.current.appendChild(postBlocksFirst[1].cloneNode(true));
            blocksMobile.current.appendChild(postBlocksFirst[2].cloneNode(true));
            blocksMobile.current.appendChild(postBlocksSecond[1].cloneNode(true));
            blocksMobile.current.appendChild(postBlocksSecond[2].cloneNode(true));
            columnFirst.appendChild(postBlocksSecond[0].cloneNode(true));

            blocksMobile.current.querySelectorAll('img').forEach(image => {
                image.onerror = function() {
                    const noImage = document.createElement('img');
                    noImage.src = '/no-image.jpg';
                    noImage.classList.add('w-full');
                    noImage.classList.add('h-full');
                    noImage.classList.add('object-cover');
                    image.closest('a').appendChild(noImage);
                    image.remove();
                }
            });

            columnFirst.querySelectorAll('img').forEach(image => {
                image.onerror = function() {
                    const noImage = document.createElement('img');
                    noImage.src = '/no-image.jpg';
                    noImage.classList.add('w-full');
                    noImage.classList.add('h-full');
                    noImage.classList.add('object-cover');
                    image.closest('a').appendChild(noImage);
                    image.remove();
                }
            });
        }
    };

	// useEffect(() => {
	// 	const fetchPostsByCategory = async () => {
	// 		const cat = (await getCategoryById(category)).category;
	// 		// const allPosts = await getAllPostsByCategory(parseInt(count), 0, cat.slug);

	// 		const fetchedPosts = block.attributes.selectedPosts.map(post => ({ 
	// 			attributes: {
	// 				postId: post?.id,
	// 				category: {
	// 					slug: cat.slug,
	// 					name: cat.name,
	// 					uri: cat.uri
	// 				},
	// 				author: {
	// 					name: post.author?.node.name
	// 				},
	// 				selectedPost: {
	// 					slug: post.slug,
	// 					title: {
	// 						rendered: post.title
	// 					},
	// 					excerpt: {
	// 						rendered: post.excerpt
	// 					},
	// 				},
	// 				featuredImage: post.featuredImage ? {
	// 					media_details: {
	// 						sizes: { 
	// 							medium_large: {
	// 								...post.featuredImage.node.mediaDetails.sizes[post.featuredImage.node.mediaDetails.sizes.length - 1], 
	// 								source_url: post.featuredImage.node.mediaDetails.sizes[post.featuredImage.node.mediaDetails.sizes.length - 1].sourceUrl 
	// 							}
	// 						}
	// 					}
	// 				} : null,
	// 			}
	// 		}));
	// 		setDynamicPosts( fetchedPosts );
	// 	}

	// 	const fetchPostsByTag = async () => {
	// 		// const fetchedTag = (await getTagById(tag)).tag;
	// 		const fetchedPosts = await Promise.all(
	// 			block.attributes.selectedPosts.map(async (post) => {
	// 				const category = await getCategoryById(post.categories[0]);
	// 				const author = await getAuthorById(post.author);

	// 				// console.log(post);

	// 				return {
	// 					attributes: {
	// 						postId: post?.id,
	// 						category: {
	// 							slug: category.category.slug,
	// 							name: category.category.name,
	// 							uri: category.category.uri,
	// 						},
	// 						author: {
	// 							name: author.name,
	// 						},
	// 						selectedPost: {
	// 							slug: post.slug,
	// 							title: {
	// 								rendered: post.title.rendered,
	// 							},
	// 							excerpt: {
	// 								rendered: post.excerpt.rendered,
	// 							},
	// 						},
	// 						featuredImage: post.featuredImage
	// 							? {
	// 								  media_details: {
	// 									  sizes: {
	// 										  medium_large: {
	// 											  ...post.featuredImage.node.mediaDetails.sizes[
	// 												  post.featuredImage.node.mediaDetails.sizes
	// 													  .length - 1
	// 											  ],
	// 											  source_url:
	// 												  post.featuredImage.node.mediaDetails.sizes[
	// 													  post.featuredImage.node.mediaDetails.sizes
	// 														  .length - 1
	// 												  ].sourceUrl,
	// 										  },
	// 									  },
	// 								  },
	// 							  }
	// 							: null,
	// 					},
	// 				};
	// 			})
	// 		);
	// 		console.log(fetchedPosts);
	// 		setDynamicPosts( fetchedPosts );
	// 	}

	// 	if ( category ) fetchPostsByCategory();
	// 	else if ( tag ) fetchPostsByTag();
	// }, [])

    return (
        <div className='ad-free-zone container max-laptop:!max-w-none alignwide' key={index}>
            <div className={`flex gap-20 w-full items-start laptop:items-stretch flex-wrap laptop:flex-nowrap pt-40 tablet:pb-40 module-block ${block?.attributes?.secondLayout ? 'second-layout' : ''}`} ref={moduleBlock}>
                {(!category && !tag) && block.innerBlocks.map((postBlock, index) => {
                    switch (postBlock.name) {
                        case 'macleans/module-column':
                            return (
                                <div className={`${block?.attributes?.secondLayout ? 'flex-row laptop:flex-col order-2 gap-20 tablet:w-1/4 border-t-1 pt-20 laptop:border-t-0 laptop:pt-0  laptop:border-l-1 border-grey-light laptop:pl-20' : 'tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20'} flex w-full gap-20 column`} 
                                    key={index}
                                >
                                    {postBlock.innerBlocks.map((post, index) => {
                                        switch (post.name) {
                                            case 'macleans/post-selector':
                                                return (
                                                    <PostSelector 
                                                        post={post} 
                                                        key={index} 
                                                        featured={false} 
                                                        className={`${block?.attributes?.secondLayout ? 'w-full laptop:border-t-1 laptop:pt-20 first:border-0 first:pt-0' : 'pb-20 first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20'} post-block`}
                                                        imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full aspect-[309/206]' : 'aspect-[309/206]'}`} 
                                                    />
                                                )
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            )
                        case 'macleans/module-column-four':
                            return (
                                <div className={`${block?.attributes?.secondLayout ? 'flex-row laptop:flex-col order-2 gap-20 laptop:w-1/4 border-t-1 pt-20 laptop:border-t-0 laptop:pt-0 laptop:border-l-1 border-grey-light laptop:pl-20' : 'tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20'} flex w-full gap-20 column`} 
                                    key={index}
                                >
                                    {postBlock.innerBlocks.map((post, index) => {
                                        switch (post.name) {
                                            case 'macleans/post-selector':
                                                return (
                                                    <PostSelector 
                                                        post={post} 
                                                        key={index} 
                                                        featured={false} 
                                                        className={`${block?.attributes?.secondLayout ? 'w-full first:border-0' : 'pb-20 tablet:first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20'} post-block`}
                                                        imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full aspect-[309/206]' : 'aspect-[309/206]'}`} 
                                                    />
                                                )
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            )
                        case 'macleans/module-column-two':
                            return (
                                <div className={`${block?.attributes?.secondLayout ? 'flex-col tablet:flex-col order-2 gap-20 tablet:w-1/4 tablet:border-l-1 border-grey-light tablet:pl-20' : 'tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20'} flex w-full gap-20 column-two`} 
                                    key={index}
                                >
                                    {postBlock.innerBlocks.map((post, index) => {
                                        switch (post.name) {
                                            case 'macleans/post-selector':
                                                return (
                                                    <PostSelector 
                                                        post={post} 
                                                        key={index} 
                                                        featured={false} 
                                                        className={`${block?.attributes?.secondLayout ? 'w-full border-t-1 pt-20 first:border-0 first:pt-0' : 'pb-20 tablet:first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20'} post-block`}
                                                        imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full aspect-[309/206]' : 'aspect-[309/206]'}`} 
                                                    />
                                                )
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            )
                        case 'macleans/module-featured':
                            return (
                                <div className={`${block?.attributes?.secondLayout ? 'order-1 tablet:w-[calc(75%_-_20px)] laptop:w-1/2' : 'order-1 laptop:pb-0 laptop:pl-0 tablet:w-[calc(75%_-_20px)] laptop:w-1/2 tablet:pr-20 laptop:pr-0 laptop:order-2 border-grey-light tablet:border-r-1 laptop:border-r-0'} w-full pb-0 module-featured`} key={index}>
                                    {postBlock.innerBlocks.map((post, index) => {
                                        switch (post.name) {
                                            case 'macleans/post-selector':
                                                return (
                                                    <PostSelector 
                                                        post={post} 
                                                        key={index} 
                                                        featured={true} 
                                                        imageHolderClassName={`${block?.attributes?.secondLayout ? 'aspect-square' : ''}`} 
                                                    />
                                                )
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            )
                        default:
                            return null;
                    }
                })}

                {/* {(category || tag) && block.attributes.selectedPosts && (
					<>
						{!block.attributes?.secondLayout && 
							<>
								<div className='tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20 flex w-full gap-20 column' 
									key={index}
								>
									{block.attributes.selectedPosts?.slice(1,4).map((post, index) => {
										return (
											<PostSelector 
												post={post} 
												key={index} 
												featured={false} 
												className='pb-20 first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20 post-block'
												imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full aspect-[309/206]' : 'aspect-[309/206]'}`} 
                                                contentWrapperClass={`tablet:w-full w-[calc(100%-100px)]`}
											/>
										)
									})}
								</div>
								<div className='order-1 laptop:pb-0 laptop:pl-0 tablet:w-[calc(75%_-_20px)] laptop:w-1/2 tablet:pr-20 laptop:pr-0 laptop:order-2 border-grey-light tablet:border-r-1 laptop:border-r-0 w-full pb-0 module-featured' key={index}>
									{block.attributes.selectedPosts?.slice(0,1).map((post, index) => {
										return (
											<PostSelector 
												post={post} 
												key={index} 
												featured={true} 
												imageHolderClassName=''
											/>
										)
									})}
								</div>
								<div className='tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20 flex w-full gap-20 column' 
									key={index}
								>
									{block.attributes.selectedPosts?.slice(4).map((post, index) => {
										return (
											<PostSelector 
												post={post} 
												key={index} 
												featured={false} 
												className='pb-20 first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20 post-block'
												imageHolderClassName='aspect-[309/206]'
											/>
										)
									})}
								</div>
							</>
						}

						{block.attributes?.secondLayout && <>
							<div className='order-1 tablet:w-[calc(75%_-_20px)] laptop:w-1/2 w-full pb-0 module-featured' key={index}>
								{block.attributes.selectedPosts?.slice(0,1).map((post, index) => {
									return (
										<PostSelector 
											post={post} 
											key={index} 
											featured={true} 
											imageHolderClassName='aspect-square'
										/>
									)
								})}
							</div>
							<div className='flex-col tablet:flex-col order-2 gap-20 tablet:w-1/4 tablet:border-l-1 border-grey-light tablet:pl-20 flex w-full column-two'
                                    key={index}
                                >
								{block.attributes.selectedPosts?.slice(1, 3).map((post, index) => {
									return (
										<PostSelector 
											post={post} 
											key={index} 
											featured={false} 
											className='w-full border-t-1 pt-20 first:border-0 first:pt-0 post-block'
											imageHolderClassName='max-w-full aspect-[309/206]' 
										/>
									)
								})}
							</div>
							<div className='flex-row laptop:flex-col order-2 gap-20 laptop:w-1/4 border-t-1 pt-20 laptop:border-t-0 laptop:pt-0 laptop:border-l-1 border-grey-light laptop:pl-20 flex w-full column'
                                    key={index}
                                >
								{block.attributes.selectedPosts?.slice(3).map((post, index) => {
									return (
										<PostSelector 
											post={post} 
											key={index} 
											featured={false} 
											className='w-full first:border-0 post-block'
											imageHolderClassName='max-w-full aspect-[309/206]' 
										/>
									)
								})}
							</div>
						</>}
					</>
				)} */}
				{/* dynamicPosts?.length > 0 && (!block.attributes.selectedPosts || block.attributes.selectedPosts.length == 0) && */}
				{(category || tag) &&  (
					<>
						{!block.attributes?.secondLayout && 
							<>
								<div className='tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20 flex w-full gap-20 column' 
									key={index}
								>
									{dynamicPosts.slice(1,4).map((post, index) => {
										return (
											<PostSelector 
												post={post} 
												key={index} 
												featured={false} 
												className='pb-20 first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20 post-block'
												imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full aspect-[309/206]' : 'aspect-[309/206]'}`} 
                                                contentWrapperClass={`tablet:w-full w-[calc(100%-100px)]`}
											/>
										)
									})}
								</div>
								<div className='order-1 laptop:pb-0 laptop:pl-0 tablet:w-[calc(75%_-_20px)] laptop:w-1/2 tablet:pr-20 laptop:pr-0 laptop:order-2 border-grey-light tablet:border-r-1 laptop:border-r-0 w-full pb-0 module-featured' key={index}>
									{dynamicPosts.slice(0,1).map((post, index) => {
										return (
											<PostSelector 
												post={post} 
												key={index} 
												featured={true} 
												imageHolderClassName=''
											/>
										)
									})}
								</div>
								<div className='tablet:w-1/4 flex-col tablet:flex-col laptop:flex-col order-2 laptop:order-3 laptop:first:order-1 laptop:border-l-1 laptop:first:border-l-0 laptop:first:border-r-1 border-grey-light laptop:pl-20 laptop:first:pl-0 laptop:first:pr-20 laptop:gap-20 flex w-full gap-20 column' 
									key={index}
								>
									{dynamicPosts.slice(4).map((post, index) => {
										return (
											<PostSelector 
												post={post} 
												key={index} 
												featured={false} 
												className='pb-20 first:border-b-1 tablet:first:pb-20 laptop:first:border-b-0 laptop:border-b-0 laptop:pb-0 laptop:first:pb-0 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-t-0 laptop:border-t-1 border-grey-light laptop:first:pt-0 laptop:pt-20 post-block'
												imageHolderClassName='aspect-[309/206]'
											/>
										)
									})}
								</div>
							</>
						}

						{block.attributes?.secondLayout && <>
							<div className='order-1 tablet:w-[calc(75%_-_20px)] laptop:w-1/2 w-full pb-0 module-featured' key={index}>
								{dynamicPosts.slice(0,1).map((post, index) => {
									return (
										<PostSelector 
											post={post} 
											key={index} 
											featured={true} 
											imageHolderClassName='aspect-square'
										/>
									)
								})}
							</div>
							<div className='flex-col tablet:flex-col order-2 gap-20 tablet:w-1/4 tablet:border-l-1 border-grey-light tablet:pl-20 flex w-full column-two'
                                    key={index}
                                >
								{dynamicPosts.slice(1, 3).map((post, index) => {
									return (
										<PostSelector 
											post={post} 
											key={index} 
											featured={false} 
											className='w-full border-t-1 pt-20 first:border-0 first:pt-0 post-block'
											imageHolderClassName='max-w-full aspect-[309/206]' 
										/>
									)
								})}
							</div>
							<div className='flex-row laptop:flex-col order-2 gap-20 laptop:w-1/4 border-t-1 pt-20 laptop:border-t-0 laptop:pt-0 laptop:border-l-1 border-grey-light laptop:pl-20 flex w-full column'
                                    key={index}
                                >
								{dynamicPosts.slice(3).map((post, index) => {
									return (
										<PostSelector 
											post={post} 
											key={index} 
											featured={false} 
											className='w-full first:border-0 post-block'
											imageHolderClassName='max-w-full aspect-[309/206]' 
										/>
									)
								})}
							</div>
						</>}
					</>
				)}
            </div>
            <div className='w-full flex flex-wrap laptop:hidden module-blocks-mobile' ref={blocksMobile}></div>
        </div>
    )
}
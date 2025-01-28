import React, { useState, useEffect, useRef, lazy } from 'react';
import PostSelector from './post-selector';
import Newsletter from './newsletter';
import LatestPosts from './latest-posts';
// const Newsletter = lazy(() => import('./newsletter'));
// const LatestPosts = lazy(() => import('./latest-posts'));

export default function HomeHeader({block, index}) {
    // const [isClient, setIsClient] = useState(false);
    const postGrid = useRef(null);
    const newsletterBlock = useRef(null);
    const latestBlock = useRef(null);
    const threeBlocks = useRef(null);
    const threeBlocksMobile = useRef(null);
    const [moreLatestPosts, showMoreLatestPosts] = useState(false);

    useEffect(() => {
        // setIsClient(true);
        moveThreeBlocks();
        
        if (document.readyState === 'complete') {
            setLatestHeight();
        } else {
            window.addEventListener('load', setLatestHeight, false);
            return () => window.removeEventListener('load', setLatestHeight);
        }
        
        window.addEventListener('resize', setLatestHeight);
        window.addEventListener('resize', moveThreeBlocks);
        return () => {
            window.removeEventListener('resize', setLatestHeight);
            window.removeEventListener('resize', moveThreeBlocks);
        };
    }, [])

    const setLatestHeight = () => {
		if ( ! latestBlock.current ) return;

        if (window.innerWidth < 834) {
            latestBlock.current.style.height = '346px';
        }else{
            latestBlock.current.style.height = `${postGrid.current.offsetHeight - newsletterBlock.current?.offsetHeight ?? 0}px`;
        }
    };

    const moveThreeBlocks = () => {
        if (window.innerWidth < 1024 && window.innerWidth > 834) {
            threeBlocksMobile.current.appendChild(threeBlocks.current);
        } else {
            postGrid.current.appendChild(threeBlocks.current);
        }
        setLatestHeight();
    };

    useEffect(() => {
        if (moreLatestPosts) {
            latestBlock.current.style.height = '';
        } else {
            setLatestHeight();
        }
    }, [moreLatestPosts]);

    const showMore = () => {
        showMoreLatestPosts(!moreLatestPosts);
    };

    return (
        <div className='container ad-free-zone max-laptop:!max-w-none ' key={index}>
            <div className='flex gap-20 w-full items-start flex-wrap tablet:flex-nowrap pb-40'>
                {block.innerBlocks.map((innerBlock, index) => {
                    switch (innerBlock.name) {
                        case 'macleans/post-grid':
                            return (
                                <div className={`${block?.attributes?.secondLayout ? 'tablet:pr-20 tablet:border-r-1 border-grey-light' : 'tablet:pr-20 tablet:border-r-1 border-grey-light'} flex flex-wrap w-full tablet:w-[calc(66.666%_+_39px)] laptop:w-[calc(75%_+_39px)]`} key={index} ref={postGrid}>
                                    {innerBlock.innerBlocks.map((postBlock, index) => {
                                        switch (postBlock.name) {
                                            case 'macleans/two-posts':
                                                return (
                                                    <div className={`${block?.attributes?.secondLayout ? 'flex-col tablet:flex-row order-2 gap-20' : 'laptop:w-[calc(33.33%+8px)] flex-col tablet:flex-row laptop:flex-col order-2 laptop:order-1 laptop:border-r-1 border-grey-light laptop:pr-20 laptop:gap-0'} flex w-full gap-20 max-tablet:text-center group centered`} 
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
                                                                            className={`${block?.attributes?.secondLayout ? 'w-full tablet:max-w-[calc(50%-20px)] first:tablet:max-w-[calc(50%)] tablet:first:border-r-1 tablet:first:pr-20 border-grey-light' : 'border-b-1 pb-20 tablet:border-b-0 tablet:pb-0 tablet:max-w-[calc(50%-20px)] tablet:first:max-w-[calc(50%)] tablet:first:border-r-1 tablet:first:pr-20 laptop:max-w-full laptop:first:max-w-full laptop:first:border-r-0 laptop:first:pr-0 laptop:first:border-b-1 border-grey-light laptop:first:mb-20 laptop:first:pb-20'} `}
                                                                            imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full aspect-[309/206] mb-20' : 'aspect-[309/206] mb-20'}`} 
                                                                        />
                                                                    )
                                                                default:
                                                                    return null;
                                                            }
                                                        })}
                                                    </div>
                                                )
                                            case 'macleans/featured-post':
                                                return (
                                                    <div className={`${block?.attributes?.secondLayout ? 'order-1' : 'order-1 laptop:pb-0 laptop:pl-20 laptop:w-[calc(66.66%-8px)] laptop:order-2'} h-fit w-full pb-40`} key={index}>
                                                        {postBlock.innerBlocks.map((post, index) => {
                                                            switch (post.name) {
                                                                case 'macleans/post-selector':
                                                                    return (
                                                                        <PostSelector 
                                                                            post={post} 
                                                                            key={index} 
                                                                            featured={true} 
                                                                            imageHolderClassName={`${block?.attributes?.secondLayout ? 'aspect-[15/10] max-h-[660px]' : ''}`} 
                                                                            priority={true}
                                                                        />
                                                                    )
                                                                default:
                                                                    return null;
                                                            }
                                                        })}
                                                    </div>
                                                )
                                            case 'macleans/three-posts':
                                                return (
                                                    <div className='flex w-full flex-col tablet:flex-row tablet:flex-nowrap justify-between gap-20 tablet:mt-20 pt-20 tablet:border-t-1 border-grey-light order-3' key={index} ref={threeBlocks}>
                                                        {postBlock.innerBlocks.map((post, index) => {
                                                            switch (post.name) {
                                                                case 'macleans/post-selector':
                                                                    return (
                                                                        <PostSelector 
                                                                            post={post} 
                                                                            key={index} 
                                                                            featured={false} 
                                                                            className={'pb-20 border-b-1 tablet:border-b-0 tablet:pb-0 tablet:border-l-1 border-grey-light first:border-l-0 tablet:pl-20 first:pl-0 first:tablet:w-[calc(33.3333%-20px)] tablet:w-[calc(33.3333%-1px)]'} 
                                                                            imageHolderClassName={'max-tablet:w-90 max-tablet:h-90 float-right ml-20 mb-0 tablet:mb-20 tablet:ml-0 tablet:float-none tablet:max-w-[100%]  aspect-[309/206]'}
                                                                            contentWrapperClass={`tablet:w-full w-[calc(100%-100px)]`}
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
                                </div>
                            )
                        case 'macleans/aside':
                            return (
                                <div className='w-full tablet:w-[calc(33%_-_20px)] laptop:w-[calc(25%_-_20px)]' key={index}>
                                    {innerBlock.innerBlocks.map((postBlock, index) => {
                                        switch (postBlock.name) {
                                            case 'macleans/newsletter':
                                                return (
                                                    <Newsletter postBlock={postBlock} key={index} ref={newsletterBlock} />
                                                )
                                            case 'macleans/latest-posts':
                                                return (
                                                    <LatestPosts key={index} postBlock={postBlock} showMore={showMore} moreLatestPosts={moreLatestPosts} ref={latestBlock}/>
                                                )
											case 'macleans/three-posts':
												return (
													<div className={`${postBlock?.attributes?.secondLayout ? 'flex-col tablet:flex-row order-2 gap-20' : 'desktop:max-w-[330px] flex-col tablet:flex-row desktop:flex-col order-2 desktop:order-1 desktop:border-r-1 border-grey-light desktop:pr-20 desktop:gap-0'} flex w-full gap-20 `} 
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
																			className={`${block?.attributes?.secondLayout ? 'w-full border-b-1 last:border-b-0 last:pb-0 last:mb-0 pb-20 mb-20 border-grey-light' : 'border-b-1 last:border-b-0 last:pb-0 last:mb-0 pb-20 mb-20 tablet:max-w-[calc(50%-20px)] tablet:first:max-w-[calc(50%)] tablet:first:border-r-1 tablet:first:pr-20 desktop:max-w-full desktop:first:max-w-full desktop:first:border-r-0 desktop:first:pr-0 desktop:first:border-b-1 border-grey-light'} `}
																			imageHolderClassName={`${block?.attributes?.secondLayout ? 'max-w-full desktop:max-h-[323px]' : ''}`} 
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
                                </div>
                            )
                        default:
                            return null;
                    }
                })}
            </div>
            <div className='w-full' ref={threeBlocksMobile}></div>
        </div>
    )
}
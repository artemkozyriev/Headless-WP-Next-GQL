import React from 'react';
import PostSelector from './post-selector';
import { useDynamicPosts } from '../lib/utils/useDynamicPostsHook';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function VideoPosts({ block }) {
	const { innerBlocks: posts, attributes } = block;
	const { title, category, tag } = attributes ?? {};
	const dynamicPosts = useDynamicPosts(category, tag, 3);

	return (
		<div className={`ad-free-zone mt-20 tablet:mt-0`}>
			<div className='max-w-screen-desktop overflow-hidden mx-auto px-20 tablet:px-40'>
				{ title && <h2 className={`mb-20 mt-20 font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-medium py-5 border-t-6 border-b border-t-dark border-b-grey-light`}>{replaceStraightApostrophes(title)}</h2>}
				<div className={`grid grid-cols-1 tablet:px-20 tablet:grid-cols-3 tablet:-mx-40`}>
                    {(!category && !tag) && posts.map((post, idx) => (
                        <div 
                            key={idx} 
                            className={`grid-item first:border-l-0 first:ml-0 tablet:px-20 tablet:border-l-1 tablet:border-t-0 tablet:mb-40 border-l-grey-light ${post.name === "macleans/video-featured" ? 'tablet:col-span-2 tablet:row-span-2' : 'col-span-1 tablet:pb-20 tablet:last:pb-0'}`}
                        >
                            {post.name === 'macleans/video-featured' ? (
                                <PostSelector 
                                    post={post.innerBlocks[0]}
                                    key={idx} 
                                    featured={false}
                                    featuredVideo={true}
                                    className='w-full text-left tablet:text-center'
                                    containerClasses={`block after:hidden tablet:after:block tablet:py-0 gap-20 group after:clear-both mb-20`}
                                    imageHolderClassName={`!aspect-[1010_/_568] !max-h-[unset] !mb-20 media h-full tablet:h-auto w-[calc(100%+40px)] -ml-20 tablet:w-full tablet:ml-auto`}
                                />
                            ) : (
                                post.innerBlocks.map((innerBlock, innerIdx) => (
                                    <PostSelector 
                                        post={innerBlock} 
                                        key={innerIdx} 
                                        featured={false} 
                                        className='tablet:py-20 tablet:first:pt-0 last:pb-0 border-t py-20 border-t-grey-light'
                                        containerClasses={`block after:hidden tablet:after:block tablet:py-0 gap-20 group after:clear-both`}
                                        imageHolderClassName={`w-full !aspect-[1010_/_568] !max-h-[unset] !mb-20 media h-full tablet:h-auto`}
                                    />
                                ))
                            )}
                        </div>
                    ))}
					{(category || tag) && dynamicPosts.map( (post, idx) => (
						<div key={idx} className={`grid-item first:border-l-0 first:ml-0 px-0 tablet:px-20 tablet:border-l-1 tablet:border-t-0 first:border-t-0 border-t border-t-grey-light border-l-grey-light py-20 tablet:py-0  ${idx === 0 ? 'tablet:col-span-2 tablet:row-span-2' : 'col-span-1 tablet:pb-20 tablet:last:pb-0'}`}>
							<PostSelector 
								post={post} 
								key={idx}
                                featuredVideo={ idx === 0 ? true : false}
								featured={false} 
								className={`w-full ${idx === 0 ? 'text-left tablet:text-center py-0' : 'text-left'}`}
								containerClasses={`block after:hidden tablet:after:block tablet:py-0 gap-20 group after:clear-both `}
								imageHolderClassName={`${ idx === 0 ? 'w-[calc(100%+40px)] -ml-20 tablet:w-full tablet:ml-auto' : 'full'} !aspect-[1010_/_568] !max-h-[unset] !mb-20 media h-full tablet:h-auto`}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

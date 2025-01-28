import React from 'react';
import PostSelector from './post-selector';
import { useDynamicPosts } from '../lib/utils/useDynamicPostsHook';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function Grid({ block }) {
	const { innerBlocks: posts, attributes } = block;
	const { title, columnCount = 4, theme = 'light', category, tag, selectedPosts } = attributes ?? {};
	const dynamicPosts = useDynamicPosts(category, tag, 4); //selectedPosts && selectedPosts.length > 0 ? [] : 

	return (
		<div className={`ad-free-zone grid-block ${theme === 'dark' ? 'bg-dark mt-20 tablet:mt-0' : 'mt-20 tablet:mt-0'}`}>
			<div className='max-w-screen-desktop overflow-hidden mx-auto px-20 tablet:px-40'>
				{ title && <h2 className={`mb-20 mt-20 font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-medium py-5 border-t-6 border-b border-t-dark ${theme === 'dark' ? 'text-white border-b-0' : 'border-b-grey-light'}`}>{replaceStraightApostrophes(title)}</h2>}
				<div className={`grid grid-cols-1 ${ columnCount === 4 ? 'laptop:px-20 laptop:grid-cols-4 laptop:-mx-40' : 'tablet:px-20 tablet:grid-cols-2 tablet:-mx-40' }`}>
					{(!category && !tag) && posts.map( (post, idx) => (
						<div key={idx} className={`grid-item first:border-l-0 first:ml-0 px-20 overflow-hidden ${ columnCount === 4 ? 'laptop:border-l-1 laptop:border-t-0 laptop:mb-40' : 'tablet:border-l-1 tablet:border-t-0 tablet:mb-40' } first:border-t-0 border-t border-t-grey-light ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}>
							<PostSelector 
								post={post} 
								key={idx} 
								theme={theme}
								featured={false} 
								className='w-full'
								containerClasses={columnCount === 4 ? 'grid grid-cols-[224px_2fr] overflow-hidden laptop:block py-20 after:hidden laptop:after:block laptop:py-0 gap-20 group after:clear-both max-[600px]:block' : 'grid grid-cols-[224px_2fr] tablet:block py-20 after:hidden tablet:after:block tablet:py-0 gap-20 group after:clear-both max-[600px]:block'}
								imageHolderClassName={`w-full !aspect-[660_/_440] !max-h-[unset] max-[600px]:float-right max-[600px]:w-[90px] max-[600px]:!aspect-square !mb-0 ${ columnCount === 4 ? 'laptop:!mb-20' : 'tablet:!mb-20' } max-[600px]:ml-20 media ${ columnCount === 4 ? 'h-full laptop:h-auto' : 'h-full tablet:h-auto'}`}
								contentWrapperClass={`mobilexl:w-full w-[calc(100%-100px)]`}
							/>
						</div>
					))}
					{/* {(category || tag) && selectedPosts && selectedPosts.length > 0 && selectedPosts.map( (post, idx) => (
						<div key={idx} className={`grid-item first:border-l-0 first:ml-0 px-20 ${ columnCount === 4 ? 'laptop:border-l-1 laptop:border-t-0 laptop:mb-40' : 'tablet:border-l-1 tablet:border-t-0 tablet:mb-40' } first:border-t-0 border-t border-t-grey-light ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}>
							<PostSelector 
								post={post} 
								key={idx} 
								theme={theme}
								featured={false} 
								className='w-full'
								containerClasses={columnCount === 4 ? 'grid grid-cols-[224px_2fr] overflow-hidden laptop:block py-20 after:hidden laptop:after:block laptop:py-0 gap-20 group after:clear-both max-[600px]:block' : 'grid grid-cols-[224px_2fr] tablet:block py-20 after:hidden tablet:after:block tablet:py-0 gap-20 group after:clear-both max-[600px]:block'}
								imageHolderClassName={`w-full !aspect-[660_/_440] !max-h-[unset] max-[600px]:float-right max-[600px]:w-[90px] max-[600px]:!aspect-square !mb-0 ${ columnCount === 4 ? 'laptop:!mb-20' : 'tablet:!mb-20' } max-[600px]:ml-20 media ${ columnCount === 4 ? 'h-full laptop:h-auto' : 'h-full tablet:h-auto'}`}
								contentWrapperClass={`mobilexl:w-full w-[calc(100%-100px)]`}
							/>
						</div>
					))} */}
					{(category || tag) && dynamicPosts.map( (post, idx) => (
						<div key={idx} className={`grid-item first:border-l-0 first:ml-0 px-20 ${ columnCount === 4 ? 'laptop:border-l-1 laptop:border-t-0 laptop:mb-40' : 'tablet:border-l-1 tablet:border-t-0 tablet:mb-40' } first:border-t-0 border-t border-t-grey-light ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}>
							<PostSelector 
								post={post} 
								key={idx} 
								theme={theme}
								featured={false} 
								className='w-full'
								containerClasses={columnCount === 4 ? 'grid grid-cols-[224px_2fr] overflow-hidden laptop:block py-20 after:hidden laptop:after:block laptop:py-0 gap-20 group after:clear-both max-[600px]:block' : 'grid grid-cols-[224px_2fr] tablet:block py-20 after:hidden tablet:after:block tablet:py-0 gap-20 group after:clear-both max-[600px]:block'}
								imageHolderClassName={`w-full !aspect-[660_/_440] !max-h-[unset] max-[600px]:float-right max-[600px]:w-[90px] max-[600px]:!aspect-square !mb-0 ${ columnCount === 4 ? 'laptop:!mb-20' : 'tablet:!mb-20' } max-[600px]:ml-20 media ${ columnCount === 4 ? 'h-full laptop:h-auto' : 'h-full tablet:h-auto'}`}
								contentWrapperClass={`mobilexl:w-full w-[calc(100%-100px)]`}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

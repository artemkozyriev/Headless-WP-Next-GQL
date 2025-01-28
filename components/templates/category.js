// 'use client'
import {useEffect, useRef} from 'react';
// import dynamic from "next/dynamic";
// const PostsList = dynamic(() => import("../posts-list"));
import PostsList from '../posts-list';

export default function CategoryTemplate({category, queryPosts}) {
	const article = useRef(null);
	// const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
	// 	// setIsClient(true);
	// 	console.log(111111);
    // }, []);

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

    return (
		<>
			<div className="max-w-screen-desktop mx-auto pt-20" ref={article}>
				<div className='px-20 tablet:px-40'>
					<div className='max-w-screen-desktop mx-auto'>
						<h1 className='font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-medium py-5 border-t-6 border-b border-b-grey-light border-t-dark'>{ category.name }</h1>
					</div>
				</div>
				<div className='px-20 tablet:px-40'>
					<div className='max-w-screen-desktop mx-auto'>
						
							<PostsList 
								// posts={posts.edges} 
								// pageInfo={posts.pageInfo} 
								// currentPage={currentPage}
								// handlePaginationClick={handlePaginationClick} 
								queryPosts={queryPosts}
								taxonomyType={'category'}
								taxonomySlug={category.slug} />
					</div>
				</div>
			</div>
		</>
    )
}
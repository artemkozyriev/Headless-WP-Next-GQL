import { useEffect, useRef } from 'react';
import PostsList from '../posts-list';

export default function TagTemplate({tag, queryPosts}) {
	const article = useRef(null);
    // const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     setIsClient(true);
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
			<div className="max-w-screen-desktop mx-auto" ref={article}>
				<div className='px-20 tablet:px-40'>
					<div className='max-w-screen-desktop mx-auto'>
						<h1 className='font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-medium py-5 border-t-6 border-b border-b-grey-light border-t-dark'>{ tag.name }</h1>
					</div>
				</div>
				<div className='px-20 tablet:px-40'>
					<div className='max-w-screen-desktop mx-auto'>
						<PostsList
							// posts={posts.edges} 
							// pageInfo={posts.pageInfo} 
							queryPosts={queryPosts}
							taxonomyType={'tag'}
							taxonomySlug={tag.slug} />
					</div>
				</div>
			</div>
		</>
    )
}
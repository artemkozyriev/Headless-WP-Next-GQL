import PostsList from '../posts-list';
import AuthorBio from '../author-bio';
import { useEffect, useRef } from 'react';

export default function AuthorTemplate({author, queryPosts}) {
	const article = useRef(null);

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
			<div className='px-20 tablet:px-40' ref={article}>
				<div className='max-w-screen-desktop mx-auto'>
					<AuthorBio author={author}/>
					<PostsList
						queryPosts={queryPosts}
						taxonomyType={'author'}
						taxonomySlug={author.slug} />
				</div>
			</div>
        </>
    )
}
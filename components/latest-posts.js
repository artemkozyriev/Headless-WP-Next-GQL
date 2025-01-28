import { forwardRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactHtmlParser from 'html-react-parser';
import {getLatestPosts} from '@/lib/api';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

const LatestPosts = forwardRef(function LatestPosts(props, ref) {
 	const { postBlock, showMore, moreLatestPosts } = props;
    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getLatestPosts(12, 0);
			setLatestPosts(fetchedPosts?.edges);
        }
        fetchPosts();
    }, [])

    return (
		<>
            <div className='w-full border-t-3 tablet:border-t-6 border-black overflow-hidden latest-overlay' ref={ref}>
                <h3 className='heading-1 border-b-1 border-grey-light max-tablet:text-2xl max-tablet:leading-xll uppercase text-center px-10 py-5 font-grotesk'>{replaceStraightApostrophes(postBlock.attributes.title || 'The Latest')}</h3>
                <div className='pt-20 overflow-hidden tablet:overflow-y-auto tablet:h-[calc(100%-55px)] no-scrollbar'>
                    <div className="pb-40">
                        {(!latestPosts || latestPosts.length == 0) && postBlock?.attributes?.posts?.map((post, index) => {
                            return (
                                <div className='w-full pb-20' key={index}>
                                    <Link href={`${post?.uri?.replace(process.env.NEXT_PUBLIC_APP_URL, '')}`} className='no-underline group group-post'>
                                        <div className='pr-20'>
                                            {post.featured_image && !postBlock.attributes.hideImages && postBlock.attributes.hideImages !== undefined &&
                                                <Image src={post.featured_image} width={310} height={200} alt='image' loading="lazy" />
                                            }
                                        </div>
                                        <div>
                                            <h4 className='heading-5 mb-4 laptop:group-[.group-post]:group-hover:underline'>{ReactHtmlParser(post.title.rendered || '')}</h4>
                                            {post.excerpt.rendered && 
                                                <div className='text-smx leading-smx text-grey font-serif font-normal'>
                                                    {ReactHtmlParser(replaceStraightApostrophes(post.excerpt.rendered || ''))}
                                                </div>
                                            }
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                        {latestPosts && latestPosts.length && latestPosts?.map((post, index) => {
                            return (
                                <div className='w-full pb-20' key={index}>
                                    <Link href={`${post?.node?.uri?.replace(process.env.NEXT_PUBLIC_APP_URL, '')}`} className='no-underline group group-post'>
                                        <div className='pr-20'>
                                            {post.node?.featured_image && !postBlock.attributes.hideImages && postBlock.attributes.hideImages !== undefined &&
                                                <Image src={post.featured_image} width={310} height={200} alt='image' loading="lazy" />
                                            }
                                        </div>
                                        <div>
                                            <h4 className='heading-5 mb-4 laptop:group-[.group-post]:group-hover:underline'>{ReactHtmlParser(post.node?.title || '')}</h4>
                                            {post.node?.excerpt && 
                                                <div className='text-smx leading-smx text-grey font-serif font-normal'>
                                                    {ReactHtmlParser(replaceStraightApostrophes(post.node?.excerpt || ''))}
                                                </div>
                                            }
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <button className='btn btn-outline w-full max-w-[202px] mx-auto tablet:hidden' onClick={showMore}>{moreLatestPosts ? 'Show Less' : 'Show More'}</button>
            </div>
        </>
	)
});

export default LatestPosts;
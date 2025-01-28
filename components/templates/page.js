import { useEffect, useRef } from 'react';
import RenderBlock from '../renderBlock';
import parseContentImages from '@/lib/utils/parseContentImages';

export default function PageTemplate({page, queryPosts, modulePosts}) {
    const article = useRef(null);
    // const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     setIsClient(true)
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
        <div className='page' ref={article}>
            <div className={'wp-blocks pt-20'}>
                {page?.title && 
                    <h1 className='font-grotesk relative w-[calc(100%-40px)] max-w-[834px] laptop:max-w-[1440px] mx-auto text-center mt-20 laptop:mt-0 py-3 my-20 uppercase top-border bottom-border'>
                        {page.title}
                    </h1>
                }
                {page?.blocks?.length > 0 ? (
                    page.blocks.map((block, index) => (
                        <div key={index} className={`wp-block ${block.name.startsWith('core/') ? 'wp-block-core' : ''}`}>
                            <RenderBlock block={block} index={index} queryPosts={queryPosts} modulePosts={modulePosts} />
                        </div>
                    ))
                ) : (
                    <div className={'wp-blocks legacy'}>
                        {page?.title && <h1>{page.title}</h1>}
                        {page?.content && parseContentImages(page.content)}
                    </div>
                )}
            </div>
        </div>
    );
}
import { useEffect, useRef } from 'react';
import {  
    getPageById, 
    getHomePageFromSettings, 
    getMenuItems, 
    getMenuBlock, 
    getBatch, 
    getAllPosts, 
    getAllPostsByCategories, 
    getAllPostsByTags, 
} from '../lib/api';
import RenderBlock from '../components/renderBlock';
// const RenderBlock = lazy(() => import('../components/renderBlock'));
import ReactHtmlParser from 'html-react-parser';
// import Helmet from '../components/helmet';
import Head from 'next/head';

export default function Home({ page, queryPosts, modulePosts }) {
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
        <div className='pt-[60px] tablet:pt-[143px] index-wrapper' ref={article}>
            {/* {page?.seo && <Helmet seo={page} type={'WebSite'} />} */}
            <Head>{page?.seo && ReactHtmlParser(page?.seo?.fullHead || '')}</Head>
            <div className={'wp-blocks'}>
                {page?.blocks && page?.blocks?.length > 0 &&
                    <div key={0} className={`wp-block ${page.blocks[0].name.startsWith('core/') ? 'wp-block-core' : ''}`}>
                        <RenderBlock block={page.blocks[0]} index={0} queryPosts={queryPosts} modulePosts={modulePosts} />
                    </div>}
                
                {page?.blocks && page?.blocks?.length > 0 ? (
                    page.blocks.slice(1).map((block, index) => (
                        <div key={index + 1} className={`wp-block ${block.name.startsWith('core/') ? 'wp-block-core' : ''}`}>
                            <RenderBlock block={block} index={index + 1} queryPosts={queryPosts} modulePosts={modulePosts} />
                        </div>
                    ))
                ) : (
                    <div className={'wp-blocks legacy'}>
                        {page?.content && ReactHtmlParser(page.content)}
                    </div>
                )}
            </div>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    //   const page = await getPageBySlug('home');
    const [ firstMenu, secondMenu, mainMenu, mainMenuSecondary, menuBlock, redirections]
		= await getBatch([
			getMenuItems('footer_menu'), 
			getMenuItems('footer_menu_secondary'),
			getMenuItems('MENU_1'),
			getMenuItems('MENU_SECONDARY'),
			getMenuBlock()
		]);
    
    const homePageId = await getHomePageFromSettings();
    const home = await getPageById(homePageId?.allSettings?.readingSettingsPageOnFront);

    
    const queryBlocks = home?.page?.blocks?.filter(block => block.name == 'core/query');
    let queryPosts = [];
    
    if (queryBlocks) {
        await Promise.all(queryBlocks.map(async queryBlock => {
            if (queryBlock.attributes.query.taxQuery?.post_tag?.length) {
                const postsByTags = await getAllPostsByTags(12, 0, queryBlock.attributes.query.taxQuery.post_tag);
                queryPosts = postsByTags;
            }
            if (queryBlock.attributes.query.taxQuery?.category?.length) {
                const postsByCategories = await getAllPostsByCategories(12, 0, queryBlock.attributes.query.taxQuery.category[0]);
                queryPosts = postsByCategories;
            }
            if (!queryBlock.attributes.query.taxQuery) {
                const postsByCategories = await getAllPosts(12, 0);
                queryPosts = postsByCategories;
            }
        }));
    }
    
    return {
        props: {
            page: home?.page || null,
            queryPosts: queryPosts || null,
            firstMenu: firstMenu || null,
            secondMenu: secondMenu || null,
            mainMenu: mainMenu || null,
            mainMenuSecondary: mainMenuSecondary || null,
            menuBlock: menuBlock || null,
            isHomePage: true,
        },
    };
}
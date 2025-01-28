import {useEffect} from 'react';
import { 
    getPageBySlug, 
    getPageByName, 
    getCategoryBySlug, 
    getPost, 
    getMenuItems, 
    getMenuBlock, 
    getBatch, 
    getAllPosts, 
    getAllPostsByCategories, 
    getAllPostsByTags, 
} from '../../lib/api'; //getMenuItems, getMenuBlock, getBatch, getRedirections
import PageTemplate from '@/components/templates/page';
import CategoryTemplate from '@/components/templates/category';
import PostTemplate from '@/components/templates/post';
import { useRouter } from 'next/router';

export default function Page({page, category, postData, halfWidthLayout, queryPosts, modulePosts}) {
    const router = useRouter();
    const topSpacing = () => {
        if (halfWidthLayout) {
            return 'pt-header-compact header-half-width tablet:pt-0';
        }
        if (page || category || postData) {
            return 'pt-header-compact';
        }
        return 'pt-header';
    }

    useEffect(() => {
        if ((page && !category && !postData) || (page && category && page.slug == category.slug)) {
            if (window.location.pathname !== page?.uri?.replace(process.env.NEXT_PUBLIC_APP_URL, '')) {
                router?.push(page?.uri?.replace(process.env.NEXT_PUBLIC_APP_URL, '') + window.location.search);
            }
        }
        if ((category && !page && !postData) || (category && page && page.slug !== category.slug)) {
            if (window.location.pathname !== category?.uri?.replace('category/', '')) {
                router?.push(category?.uri?.replace('category/', '').replace(process.env.NEXT_PUBLIC_APP_URL, '') + window.location.search);
            }
        }
        if (postData) {
            if (window.location.pathname !== postData?.uri?.replace(process.env.NEXT_PUBLIC_APP_URL, '')) {
                router?.push(postData?.uri?.replace(process.env.NEXT_PUBLIC_APP_URL, '') + window.location.search);
            }
        }
    }, []);

    useEffect(() => {
        const { hash } = window.location;
        
        if (hash) {
            let timer;
            let i = 0;

            timer = setInterval(() => {
                const element = document.getElementById(hash.substring(1));
                if (element && i < 10) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const offset = element.offsetTop - headerHeight - 50;

                    window.scrollTo({ top: offset, behavior: 'smooth' });
                    if (window.scrollY !== offset) {
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                    } else {
                        clearInterval(timer);
                    }
                } else {
                    clearInterval(timer);
                }
                i++;
            }, 300);
        }

        if ((page && !category && !postData) || (page && category && page.slug == category.slug)) {
            document.body.setAttribute('data-page-type', 'page');
        }
        if ((category && !page && !postData) || (category && page && page.slug !== category.slug)) {
            document.body.setAttribute('data-page-type', 'category');
        }
        if (postData) {
            document.body.setAttribute('data-page-type', 'post');
        }
    }, []);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        window.dispatchEvent(new CustomEvent('hydrationComplete'));
        window._hydrationComplete = true;

        const dispatchRouterComplete = () => {
            window.dispatchEvent(
                new CustomEvent('routeChangeComplete')
            );
        };

        router.events.on('routeChangeComplete', dispatchRouterComplete);

        return () => {
            router.events.off('routeChangeComplete', dispatchRouterComplete);
        };
    }, [router.isReady, router.events]);

    return (
        <>
            <div className={`content-wrapper z-[4] ${topSpacing()}`}>
                {((page && !category && !postData) || (page && category && page.slug == category.slug)) && (
                    <>
                        <PageTemplate page={page} queryPosts={queryPosts} modulePosts={modulePosts} />
                    </>
                )}
                {((category && !page && !postData) || (category && page && page.slug !== category.slug)) && (
                    <>
                        <CategoryTemplate category={category} queryPosts={queryPosts} />
                    </>
                )}
                {postData && (
                    <>
                        <PostTemplate postData={postData} wrapperData={halfWidthLayout}/>
                    </>
                )}
            </div>
        </>
    )
};

export async function getServerSideProps({ params }) {
    const fullSlug = params.slug.join('/');
	const [ firstMenu, secondMenu, mainMenu, mainMenuSecondary, menuBlock, redirections]
		= await getBatch([
			getMenuItems('footer_menu'), 
			getMenuItems('footer_menu_secondary'),
			getMenuItems('MENU_1'),
			getMenuItems('MENU_SECONDARY'),
			getMenuBlock()
		]);

    

    let page = await getPageBySlug(`${fullSlug}`);
    if (!page.page) {
        page = await getPageByName(`${fullSlug}`);
    }
    
    if (page?.page || page?.pages?.nodes?.length) {
        const queryBlocks = page.page?.blocks?.filter(block => block.name == 'core/query') || page?.pages.nodes[0].blocks?.filter(block => block.name == 'core/query');
        let queryPosts = [];

        if (queryBlocks) {
            await Promise.all(queryBlocks?.map(async queryBlock => {
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
                page: page.page || page.pages.nodes[0] || null,
                category: null,
                postData: null,
                firstMenu: firstMenu || null,
                secondMenu: secondMenu || null,
                mainMenu: mainMenu || null,
                mainMenuSecondary: mainMenuSecondary || null,
                menuBlock: menuBlock || null,
                queryPosts: queryPosts || null,
            },
        };
    }

    let category = await getCategoryBySlug(`${fullSlug}`);
    if (!category.category) {
        category = await getCategoryBySlug(`category/${fullSlug}`);
    }
    
    if (category?.category) {
        const queryPosts = category.category.posts;

        return {
            props: {
                page: null,
                category: category.category || null,
                postData: null,
                firstMenu: firstMenu || null,
                secondMenu: secondMenu || null,
                mainMenu: mainMenu || null,
                mainMenuSecondary: mainMenuSecondary || null,
                menuBlock: menuBlock || null,
                queryPosts: queryPosts || null
            },
        };
    }

    const data = await getPost(`${fullSlug}`);
    if (data?.post) {
        return {
            props: {
                page: null,
                category: null,
                postData: data.post || null,
                firstMenu: firstMenu || null,
                secondMenu: secondMenu || null,
                mainMenu: mainMenu || null,
                mainMenuSecondary: mainMenuSecondary || null,
                menuBlock: menuBlock || null,
            },
        };
    }

    if (!page?.page && !category?.category && !data?.post) {
        return {
            notFound: true,
        };
    }
}
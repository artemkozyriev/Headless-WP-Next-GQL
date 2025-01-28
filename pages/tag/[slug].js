import {useState, useEffect, lazy } from "react";
import { getTagBySlug, getMenuItems, getMenuBlock } from '../../lib/api'; //getTags, getMenuItems, getMenuBlock
import TagTemplate from '@/components/templates/tag';
// const TagTemplate = lazy(() => import('@/components/templates/tag'));
import Helmet from '@/components/helmet';
import { useRouter } from 'next/router';

export default function Tag({tag, queryPosts}) {
    // const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // setIsClient(true);
        document.body.setAttribute('data-page-type', 'category');
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

    // const seo = () => {
	// 	let type;
	// 	let seoData;
	// 	let author;
	// 	let tags;
	// 	let date;
	// 	let modified;

	// 	type = 'Tag page';
	// 	seoData = tag.seo;
	// 	tags = null;
	// 	author = null;
	// 	modified = null;
	
	// 	return { type, seoData, tags, author, date, modified };
	//   };

	// const { type, seoData, tags, author, date, modified } = seo();

    return (
		<>
            { tag && <Helmet seo={tag.seo} /> }
			<div className='pt-header-compact content-wrapper'>
				{ tag && <TagTemplate tag={tag} queryPosts={queryPosts} /> }
			</div>
		</>
    );
}

// export async function getStaticPaths() {
//     const allTags = await getTags();

//     return {
//         paths: allTags?.edges?.map(({ node }) => `/tag/${node.slug}`) || [],
//         fallback: true
//     }
// };

// export async function getStaticProps({ params }) {
//     const data = await getTagBySlug(params.slug);
//     const firstMenu = await getMenuItems('footer_menu');
//     const secondMenu = await getMenuItems('footer_menu_secondary');
//     const mainMenu = await getMenuItems('MENU_1');
//     const mainMenuSecondary = await getMenuItems('MENU_SECONDARY');
//     const menuBlock = await getMenuBlock();
    
//     return {
//         props: {
//             tag: data.tag,
//             firstMenu,
//             secondMenu,
//             mainMenu,
//             mainMenuSecondary,
//             menuBlock,
//         },
//         revalidate: 10,
//     };
// }

export async function getServerSideProps({ params }) {
    const data = await getTagBySlug(params.slug);
    const firstMenu = await getMenuItems('footer_menu');
    const secondMenu = await getMenuItems('footer_menu_secondary');
    const mainMenu = await getMenuItems('MENU_1');
    const mainMenuSecondary = await getMenuItems('MENU_SECONDARY');
    const menuBlock = await getMenuBlock();
    
    if (data.tag) {
        const queryPosts = data.tag.posts;
        
        return {
            props: {
                tag: data.tag,
                firstMenu,
                secondMenu,
                mainMenu,
                mainMenuSecondary,
                menuBlock,
                queryPosts: queryPosts || null
            },
        };
    }
    
    return {
        notFound: true,
    };
}
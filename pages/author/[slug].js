import React, { useEffect} from "react";
import { getAuthorBySlug, getMenuItems, getMenuBlock } from '../../lib/api'; // getAllAuthors, getMenuItems, getMenuBlock
import AuthorTemplate from "@/components/templates/author";
import Helmet from "@/components/helmet";
import { useRouter } from 'next/router';

export default function Author({author, queryPosts}) {
	const router = useRouter();

    useEffect(() => {
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

	const seo = () => {
		let type;
		let seoData;
		let tags;
		let date;
		let modified;

		type = 'Person';
		seoData = author?.seo;
		tags = null;
		modified = null;
	
		return { type, seoData, tags, date, modified };
	  };

	const { type, seoData, tags, date, modified } = seo();

    return (
        <>
			<Helmet seo={seoData} type={type} tags={tags} author={author} date={date} modified={modified} />
            <div className='pt-header content-wrapper'>
				{ author && <AuthorTemplate author={author} queryPosts={queryPosts}/> }
            </div>
        </>
    )
};

// export const getStaticPaths = async () => {
// 	const authors = await getAllAuthors();

// 	const paths = authors?.nodes?.map((node) => `/author/${node.slug}`) || [];

// 	return {
// 		paths: paths,
// 		fallback: true,
// 	};
// };

// export async function getStaticProps({ params }) {
// 	const author = await getAuthorBySlug(params?.slug);
// 	const firstMenu = await getMenuItems('footer_menu');
//     const secondMenu = await getMenuItems('footer_menu_secondary');
//     const mainMenu = await getMenuItems('MENU_1');
//     const mainMenuSecondary = await getMenuItems('MENU_SECONDARY');
//     const menuBlock = await getMenuBlock();

// 	return {
// 		props: {
// 			author: author || null,
// 			firstMenu: firstMenu || null,
//             secondMenu: secondMenu || null,
//             mainMenu: mainMenu || null,
//             mainMenuSecondary: mainMenuSecondary || null,
//             menuBlock: menuBlock || null,
// 		},
// 		revalidate: 10,
// 	};
// }

export async function getServerSideProps({ params }) {
	const author = await getAuthorBySlug(params?.slug);
	const firstMenu = await getMenuItems('footer_menu');
    const secondMenu = await getMenuItems('footer_menu_secondary');
    const mainMenu = await getMenuItems('MENU_1');
    const mainMenuSecondary = await getMenuItems('MENU_SECONDARY');
    const menuBlock = await getMenuBlock();

    if (author) {
        const queryPosts = author.posts;
        return {
            props: {
                author: author || null,
                firstMenu: firstMenu || null,
                secondMenu: secondMenu || null,
                mainMenu: mainMenu || null,
                mainMenuSecondary: mainMenuSecondary || null,
                menuBlock: menuBlock || null,
                queryPosts: queryPosts || null
            },
        };
    }

    return {
        notFound: true,
    };
}
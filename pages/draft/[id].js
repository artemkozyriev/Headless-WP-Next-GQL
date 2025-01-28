import React from "react";
import { getDraft, getMenuItems, getMenuBlock } from '../../lib/api'; // getAllAuthors, getAuthorBySlug, getPostsByAuthor, getMenuItems, getMenuBlock, getAllDrafts,
// import AuthorTemplate from "@/components/templates/author";
// import Head from "next/head";
import Helmet from "@/components/helmet";
import PostTemplate from "@/components/templates/post";

export default function Draft({postData}) {
    return (
        <>
            <div className='pt-header-compact'>
                {postData && (
                    <>
                        <Helmet seo={postData.seo} tags={postData.tags}/>
                        <PostTemplate postData={postData} draft={true} />
                    </>
                )}
            </div>
        </>
    )
};

// export const getStaticPaths = async () => {
// 	const drafts = await getAllDrafts();

// 	const paths = drafts?.nodes?.map((node) => `/draft/${node.databaseId}`) || [];

// 	return {
// 		paths: paths,
// 		fallback: true,
// 	};
// };

// export async function getStaticProps({ params }) {
// 	const post = await getDraft(params?.id);
// 	// const firstMenu = await getMenuItems('footer_menu');
//     // const secondMenu = await getMenuItems('footer_menu_secondary');
//     // const mainMenu = await getMenuItems('MENU_1');
//     // const mainMenuSecondary = await getMenuItems('MENU_SECONDARY');
//     // const menuBlock = await getMenuBlock();

// 	return {
// 		props: {
// 			postData: post || null,
// 			// firstMenu: firstMenu || null,
//             // secondMenu: secondMenu || null,
//             // mainMenu: mainMenu || null,
//             // mainMenuSecondary: mainMenuSecondary || null,
//             // menuBlock: menuBlock || null,
// 		},
// 		revalidate: 10,
// 	};
// }

export async function getServerSideProps({ params }) {
	const post = await getDraft(params?.id);
	const firstMenu = await getMenuItems('footer_menu');
    const secondMenu = await getMenuItems('footer_menu_secondary');
    const mainMenu = await getMenuItems('MENU_1');
    const mainMenuSecondary = await getMenuItems('MENU_SECONDARY');
    const menuBlock = await getMenuBlock();

	return {
		props: {
			postData: post || null,
			firstMenu: firstMenu || null,
            secondMenu: secondMenu || null,
            mainMenu: mainMenu || null,
            mainMenuSecondary: mainMenuSecondary || null,
            menuBlock: menuBlock || null,
		},
		// revalidate: 10,
	};
}
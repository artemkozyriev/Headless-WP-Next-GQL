import PostsList from "@/components/posts-list";
import { useEffect, useState } from "react";
import { getLatestPosts, getMenuItems, 
    getMenuBlock, 
    getBatch } from "@/lib/api";

const BATCH_SIZE = 12;

export default function Custom404() {
	const [ allPosts, setAllPosts ] = useState([]);
	const [ pageInfo, setPageInfo ] = useState(null);
	const [ currentPage, setCurrentPage ] = useState(0);

    useEffect(() => {
		const fetchPosts = async () => {
            const data = await getLatestPosts(BATCH_SIZE, 0);

            setAllPosts(data?.edges);
            setPageInfo(data?.pageInfo);
        };

		fetchPosts();
    }, []);

    const clickHandler = async (e, size, offset) => {
        e.preventDefault();
        if (pageInfo) {
            const data = await getLatestPosts(size, offset);
            setPageInfo(data.pageInfo);
            setAllPosts(data.edges);
            setCurrentPage(offset/BATCH_SIZE);
        }
    };

    return (
		<>
			<div className="pt-header-compact content-wrapper">
				<div className="max-w-screen-desktop w-full mx-auto px-20 tablet:px-40">
					<div className="border-b border-b-grey-light">
						<div className="py-40 tablet:py-80 text-center max-w-[640px] mx-auto px-20 tablet:px-40">
							<h1 className="mb-20">Whoops! We're having trouble finding the page you're looking for.</h1>

							<p className="font-georgia text-base leading-base">But here are some stories that may interest you.</p>
						</div>
					</div>
				</div>

				<div className="">
					<div className="max-w-screen-desktop w-full mx-auto px-20 tablet:px-40">
						{ allPosts && 
							<PostsList 
								posts={allPosts} 
								pageInfo={pageInfo} 
								currentPage={currentPage}
								clickHandler={clickHandler}
								taxonomySlug={'categories'} /> }
					</div>
				</div>
			</div>
		</>
    )
}

export async function getStaticProps({ params }) {
	const [ firstMenu, secondMenu, mainMenu, mainMenuSecondary, menuBlock, redirections]
		= await getBatch([
			getMenuItems('footer_menu'), 
			getMenuItems('footer_menu_secondary'),
			getMenuItems('MENU_1'),
			getMenuItems('MENU_SECONDARY'),
			getMenuBlock(),
		]);

	return {
		props: {
			firstMenu: firstMenu || null,
			secondMenu: secondMenu || null,
			mainMenu: mainMenu || null,
			mainMenuSecondary: mainMenuSecondary || null,
			menuBlock: menuBlock || null,
			// queryPosts: queryPosts || null,
			// modulePosts: modulePosts || null
		},
		// revalidate: 100,
	};
}
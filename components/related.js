import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import PrevArrow from '../assets/icons/icon-arrow-prev.svg';
import NextArrow from '../assets/icons/icon-arrow-next.svg';
import 'swiper/css';
import 'swiper/css/pagination';
import PostSelector from './post-selector';
import Grid from './grid';
import { useDynamicPosts } from '../lib/utils/useDynamicPostsHook';
import {getAllPostsByCategories, getAllPostsByTags} from '../lib/api';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function Related({ block, postData }) {
	const { attributes } = block;
	const { title, theme = 'light', category, tag, count = 4 } = attributes ?? {};
	const [posts, setPosts] = useState([]);

	const dynamicPosts = useDynamicPosts(category, tag, count+1);

	const swiperRef = useRef(null);

	const renderSliderActions = useCallback(() => (
		<div slot='container-end' className={`${theme === 'dark' ? 'text-white' : 'text-dark'} w-fit mx-auto flex gap-10 items-center pt-40 pb-20`}>
			{ [ 
				{ icon: <PrevArrow/>, f: () => swiperRef.current?.slidePrev() }, 
				{},
				{ icon: <NextArrow/>, f: () => swiperRef.current?.slideNext() } 
			].map((action, idx) => {
				if ( action.f ) return (
					<button onClick={action.f} key={`slider_btn_${idx}`} className={`p-7 rounded-full border ${theme === 'dark' ? 'border-grey' : 'border-grey-light'}`}>
						{ action.icon }
					</button>
				)
				else return (
					<div key={`slider_paging_${idx}`} className='slider-paging inline-flex gap-0 !w-fit' 
						style={{ 
							'--swiper-pagination-color': theme === 'dark' ? '#FFF' : '#121212',
							'--swiper-pagination-bullet-inactive-color': theme === 'dark' ? '#525252' : '#E0E0E0',
							'--swiper-pagination-bullet-inactive-opacity': 1,
							'--swiper-pagination-bullet-horizontal-gap': '3px',
							'--swiper-pagination-bullet-size': '5px'
						}}></div>
				)
			} ) }
		</div>
	))

	const renderCarousel = () => {
		return (
			<div className={`carousel tablet:overflow-hidden ${!title && 'pt-20 tablet:pt-20'}`}>
				<Swiper
					modules={[Navigation, Pagination]}
					onBeforeInit={(swiper) => {
						swiperRef.current = swiper;
					}}
					spaceBetween={0}
					pagination={{ el: '.slider-paging', type: 'bullets' }}
					breakpoints={{ 0: { slidesPerView: 1.15 }, 834: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }}}
				>
					{dynamicPosts.length === 0 && posts.map((post, idx) => (
						<SwiperSlide key={idx} className={`pl-20 pr-20 border-l-1 ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}>
							<PostSelector 
								post={post} 
								key={idx} 
								theme={theme}
								featured={false} 
								className='w-full'
								imageHolderClassName='w-full aspect-[309/206]'
							/>
						</SwiperSlide>
					))}

					{dynamicPosts.length !== 0 && dynamicPosts.filter(post => post.attributes.postId !== postData?.postId).slice(0, count).map((post, idx) => (
						<SwiperSlide key={idx} className={`pl-20 pr-20 border-l-1 ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}>
							<PostSelector 
								post={post} 
								key={idx} 
								theme={theme}
								featured={false} 
								className='w-full'
								imageHolderClassName='w-full aspect-[309/206]'
							/>
						</SwiperSlide>
					))}

					{ renderSliderActions() }
				</Swiper>
			</div>
		)
	}

	useEffect(() => {
		const fetchPosts = async () => {
			if ( category ) {
				const posts = await getAllPostsByCategories(parseInt(count+1), 0, category);
				const postInArray = posts.edges.filter(post => post.node.postId !== postData?.postId).slice(0, count);

				setPosts(postInArray);
			}
			if ( tag ) {
				const posts = await getAllPostsByTags(parseInt(count+1), 0, tag);
				const postInArray = posts.edges.filter(post => post.node.postId !== postData?.postId).slice(0, count);

				setPosts(postInArray);
			}
			if (!category && !tag) {
				setPosts(block?.innerBlocks);
			}
		}
		fetchPosts();
	}, [category, tag, count]);

	return (
		<div className={`ad-free-zone ${theme === 'dark' ? 'bg-dark' : ''} ${ !title ? '' : ''} `}>
			<div className={`max-w-screen-desktop mx-auto overflow-hidden ${posts.length > 4 && dynamicPosts.length > 4 ? 'px-20 tablet:px-40 pb-20' : '' }`}>
				{ posts.length > 8 || dynamicPosts.length > 8 && <h2 className={`mb-20 mt-20 font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-medium py-5 border-t-6 border-t-dark ${theme === 'dark' ? 'text-white border-b-0' : 'border-b border-b-grey-light'}`}>
					{ replaceStraightApostrophes(title || 'Related Posts') }
				</h2> }
				{ dynamicPosts.length === 0 && 
					posts.length <= 8 && <Grid block={{ innerBlocks: posts, attributes: { title: title || 'Related Posts', columnCount: 4, theme: theme } }}/> }
				{ dynamicPosts.length === 0 && 
					posts.length > 8 && renderCarousel() }

				{ dynamicPosts.length !== 0 &&
					dynamicPosts.length <= 8 && <Grid block={{ innerBlocks: dynamicPosts.filter(post => post.attributes.postId !== postData?.postId).slice(0, count), attributes: { title: title || 'Related Posts', columnCount: 4, theme: theme } }}/> }
				{ dynamicPosts.length !== 0 &&
					dynamicPosts.length > 8 && renderCarousel() }
			</div>
		</div>
	)
}

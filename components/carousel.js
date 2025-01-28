import React, { useRef, useCallback } from 'react';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import PrevArrow from '../assets/icons/icon-arrow-prev.svg';
import NextArrow from '../assets/icons/icon-arrow-next.svg';
import 'swiper/css';
import 'swiper/css/pagination';
import PostSelector from './post-selector';
import Grid from './grid';
import { useDynamicPosts } from '../lib/utils/useDynamicPostsHook';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function Carousel({ block }) {
	const { innerBlocks: posts, attributes } = block;
	const { title, theme = 'dark', category, tag, count = 4 } = attributes ?? {};

	const dynamicPosts = useDynamicPosts(category, tag, count);

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
			<div className={`carousel ad-free-zone tablet:overflow-hidden px-20 ${!title && 'pt-20 laptop:pt-40'}`}>
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
								imageHolderClassName='w-full aspect-[310/200] mb-20'
							/>
						</SwiperSlide>
					))}

					{dynamicPosts.length !== 0 && dynamicPosts.map((post, idx) => (
						<SwiperSlide key={idx} className={`pl-20 pr-20 border-l-1 ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}>
							<PostSelector 
								post={post} 
								key={idx} 
								theme={theme}
								featured={false} 
								className='w-full'
								imageHolderClassName='w-full aspect-[310/200] mb-20'
							/>
						</SwiperSlide>
					))}

					{ renderSliderActions() }
				</Swiper>
			</div>
		)
	}

	return (
		<div className={`${theme === 'dark' ? 'bg-dark' : ''} ${ !title ? 'laptop:pt-40' : ''} `}>
			<div className={`max-w-screen-desktop mx-auto overflow-hidden ${posts.length > 4 && dynamicPosts.length > 4 ? 'px-20 tablet:px-40 pb-20' : '' }`}>
				{ title && (posts.length > 4 || dynamicPosts.length > 4) && <h2 className={`mb-20 mt-20 font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-medium py-5 border-t-6 border-t-dark ${theme === 'dark' ? 'text-white border-b-0' : 'border-b border-b-grey-light'}`}>
					{ replaceStraightApostrophes(title) }
				</h2> }
				{ dynamicPosts.length === 0 && 
					posts.length <= 4 && <Grid block={{ innerBlocks: posts, attributes: { title: title, columnCount: 4, theme: theme } }}/> }
				{ dynamicPosts.length === 0 && 
					posts.length > 4 && renderCarousel() }

				{ dynamicPosts.length !== 0 &&
					dynamicPosts.length <= 4 && <Grid block={{ innerBlocks: dynamicPosts, attributes: { title: title, columnCount: 4, theme: theme } }}/> }
				{ dynamicPosts.length !== 0 &&
					dynamicPosts.length > 4 && renderCarousel() }
			</div>
		</div>
	)
}

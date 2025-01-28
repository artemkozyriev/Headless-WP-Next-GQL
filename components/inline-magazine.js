import React, { useCallback, useRef } from 'react';
import parse from 'html-react-parser';
import Button from './button';
import Image from 'next/image';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import PrevArrow from '../assets/icons/icon-arrow-prev.svg';
import NextArrow from '../assets/icons/icon-arrow-next.svg';
import 'swiper/css';
import 'swiper/css/pagination';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function InlineMagazine({ block }) {
	const { theme, isSingle, heading, description, covers, link } = block.attributes;

	const hasOneCover = isSingle || covers.length === 1;

	const swiperRef = useRef(null);

	const renderContent = useCallback(() => (
		<div className={`${hasOneCover ? 'px-20 pb-40' : 'max-w-[400px] mx-auto'} text-center laptop:pr-20`}>
			<div>
				{hasOneCover 
					? <h3 className='text-red'>{ parse(replaceStraightApostrophes(heading || '')) }</h3>
					: <h2 className='text-red'>{ parse(replaceStraightApostrophes(heading || '')) }</h2>
				}
			</div>

			<div className={`${hasOneCover ? 'mt-10' : 'mt-10 laptop:mt-5 laptop:text-reg laptop:leading-smxl'} ${theme === 'dark' ? 'text-grey-light' : 'text-grey'} tablet:text-smm tablet:leading-smm text-sm leading-xm font-lightmedium font-sans`}>
				{ parse(description || '') }
			</div>

			<div className={`mt-20 ${hasOneCover ? 'flex flex-col items-stretch' : 'flex flex-col items-stretch tablet:block'}`}>
				<Button href={link ?? '#'} type={ theme === 'dark' ? 'primary' : 'secondary' }>Subscribe</Button>
			</div>
		</div>
	))

	const renderSliderActions = useCallback(() => (
		<div slot='container-end' className={`${theme === 'dark' ? 'text-white' : 'text-dark'} w-fit mx-auto flex gap-10 items-center py-20 ${hasOneCover ? 'hidden' : 'tablet:hidden'}`}>
			{ [ 
				{ icon: <PrevArrow/>, f: () => swiperRef.current?.slidePrev() }, 
				{},
				{ icon: <NextArrow/>, f: () => swiperRef.current?.slideNext() } 
			].map((action, idx) => {
				if ( action.f ) return (
					<button onClick={action.f} key={`slider_btn_${idx}`} className={`p-6 rounded-full border ${theme === 'dark' ? 'border-grey' : 'border-grey-light'}`}>
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

	return (
		<div className='inline-magazine-block ad-free-zone max-w-screen-desktop mx-auto px-20 tablet:px-40 py-20 tablet:py-40'>
			<div className={`border border-dark border-b-6 
				${ hasOneCover ? 'flex flex-col gap-20' : 'flex flex-col-reverse tablet:grid grid-cols-[2fr_repeat(3,_1fr)] gap-0 tablet:gap-20 desktop:gap-40 items-center px-20 py-40 laptop:p-40' } 
				${ theme === 'dark' ? 'bg-dark text-white' : '' }`}
				>
				{ ! hasOneCover && renderContent() }
					<div className={`${hasOneCover ? 'w-full pt-40 px-45' : 'w-full px-24 tablet:px-0 col-span-3'}`}>
					<Swiper 
						modules={[Navigation, Pagination]}
						onBeforeInit={(swiper) => {
						swiperRef.current = swiper;
						}}
						init={ hasOneCover }
						pagination={{ el: '.slider-paging', type: 'bullets' }}
						breakpoints={{ 0: { slidesPerView: 1, spaceBetween: 20 }, 834: { slidesPerView: hasOneCover ? 1 : 3, spaceBetween: 20 }, 1024: { spaceBetween: 20, slidesPerView: hasOneCover ? 1 : 3 }, 1440: { spaceBetween: 40, slidesPerView: hasOneCover ? 1 : 3 } }} 
						spaceBetween={40}
						>
					{ covers.map((cover, idx) => (
						<SwiperSlide key={`cover_${idx}_${cover}`}>
							<div className='aspect-[260_/_355]'>
								<Image width={260} height={355} src={cover} className='w-full h-full object-cover' alt='magazine cover' loading="lazy" />
							</div>
						</SwiperSlide>
					)) }
					{ renderSliderActions() }
					</Swiper>
					</div>
				{ hasOneCover && renderContent()}
			</div>
		</div>
	)
}

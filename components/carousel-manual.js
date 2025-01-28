import React, { useRef, useCallback } from 'react';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import PrevArrow from '../assets/icons/icon-arrow-prev.svg';
import NextArrow from '../assets/icons/icon-arrow-next.svg';
import PostSelector from './post-selector';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

export default function ManualCarousel({ block }) {

    const { attributes } = block;
	const { title, theme, slides } = attributes ?? {};
    const swiperRef = useRef(null);
    const priority = false

    const renderSliderActions = useCallback(() => (
		<div slot='container-end' className={`${theme === 'dark' ? 'text-white' : 'text-dark'} ${slides.length > 4 ? 'flex' : 'flex laptop:hidden' } w-fit mx-auto gap-10 items-center pt-40 pb-20`}>
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
					<div key={`slider_paging_${idx}`} className={`slider-paging inline-flex gap-0 !w-fit`} 
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
        <div className={`carousel ad-free-zone tablet:overflow-hidden px-20 ${!title && 'pt-20 laptop:pt-40'} ${theme === 'dark' ? 'bg-dark' : ''} ${ !title ? 'laptop:pt-40' : ''} `}>
            <div className={`max-w-screen-desktop mx-auto overflow-hidden ${slides.length > 4 ? 'px-20 tablet:px-40 pb-20' : '' }`}>
				{ title && <h2 className={`mb-20 mt-20 font-grotesk uppercase text-center text-2xl tablet:text-3xl leading-3xlm font-large py-5 border-t-6 border-t-dark ${theme === 'dark' ? 'text-white border-b-0' : 'border-b border-b-grey-light'}`}>
					{ replaceStraightApostrophes(title) }
				</h2> }
                <Swiper
                    modules={[Navigation, Pagination]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    spaceBetween={0}
                    pagination={{ el: '.slider-paging', type: 'bullets' }}
                    breakpoints={{ 0: { slidesPerView: 1.15 }, 834: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }}}
                >

                    {slides.length !== 0 && slides.map((slide, idx) => (
                        <SwiperSlide 
                            key={idx} 
                            className={`pl-20 pr-20 border-l-1 ${ theme === 'dark' ? 'border-l-grey' : 'border-l-grey-light'}`}
                        >
                            <a href={slide?.link || '#'} className={`no-underline ${slide.link ? 'cursor-pointer' : 'cursor-default'}`}>
                                <div className={`w-full relative overflow-hidden image-holder pb-[100%]`}>
                                    <Image 
                                        className='w-full h-full object-cover absolute top-0 left-0'
                                        src={slide.image?.sizes?.large.url || slide.image?.sizes?.full.url || '/no-image.jpg'}
                                        loading={!priority ? 'lazy' : 'eager'}
                                        quality={80}  
                                        width={slide.image?.sizes?.large ? slide.image?.sizes?.large?.width : slide.image?.sizes?.full?.width || '900'}
                                        height={slide.image?.sizes?.large ? slide.image?.sizes?.large?.height : slide.image?.sizes?.full?.height || '600'}
                                        onError={(e) => { if ( e.target.src !== '/no-image.jpg') { e.target.src = '/no-image.jpg'; e.target.srcset = '' } }}
                                        sizes={`(max-width: 640px) 66vw, (max-width: 834px) 33vw, 25vw"`}
                                        alt={slide.image?.alt_text || 'post image alt text missing.' }
                                    />
                                </div>
                                <div className={`${ theme === 'dark' ? 'text-white' : 'text-dark'} text-center px-10 mt-20`}>
                                    {slide.title && <h5 className={`${ theme === 'dark' ? 'text-white' : 'text-dark'}`}>{slide.title}</h5>}
                                    {slide.text && <p className={`subheading small pt-4 !leading-sm ${ theme === 'dark' ? '!text-white' : 'text-dark'}`}>{slide.text}</p>}
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                    { renderSliderActions() }
                </Swiper>
            </div>
        </div>
    )

}
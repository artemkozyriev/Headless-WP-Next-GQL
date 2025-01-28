import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../assets/logo.svg';
import LogoWhite from '../assets/logo-white.svg';
import IconMenu from '../assets/icons/icon-menu.svg';
import IconMenuWhite from '../assets/icons/icon-menu-white.svg';
import IconMenuClose from '../assets/icons/icon-menu-close.svg';
// import IconSearch from '../assets/icons/icon-search.svg';
// import IconSearchWhite from '../assets/icons/icon-search-white.svg';
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
  } from 'body-scroll-lock-upgrade';

export default function Header({menu, menuSecondary, menuBlock, compactHeader, halfWidthLayout, headerColorDark}) {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [minimizeHeader, setMinimizeHeader] = useState(false);
    const headerRef = useRef(null);
    const dropDownRef = useRef(null);
    const [headerMobile, setHeaderMobile] = useState(false);
    const [fullWidth, setFullWidth] = useState(!halfWidthLayout);
    const [colorDark, setColorDark] = useState(headerColorDark);
    const router = useRouter();

    const showMenuHandler = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu);
        disableBodyScroll(dropDownRef.current);
    };

    const hideMenuHandler = (e) => {
        e.preventDefault();
        setShowMenu(false);
        enableBodyScroll(dropDownRef.current);
    };

    const hideMenuHandlerLink = (e) => {
        e.preventDefault();
        if(e.target.tagName.toLowerCase() === 'a') {
            router.push(e.target.href);
        }else{
            router.push(e.target.closest('a').href);
        }
        setShowMenu(false);
        enableBodyScroll(dropDownRef.current);
    };

    const showSearchHandler = (e) => {
        e.preventDefault();
        setShowSearch(!showMenu);
    };

    const hideSearchHandler = (e) => {
        e.preventDefault();
        setShowSearch(false);
    };

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 100) {
            setMinimizeHeader(true);
        } else {
            setMinimizeHeader(false);
        }

        if (halfWidthLayout) {
            if (scrollPosition > window.innerHeight) {
                setFullWidth(true);
                setColorDark(false)
            } else {
                setFullWidth(false);
                if (headerColorDark && window.innerWidth > 833) setColorDark(true);
            }
        }
        
    };

    const halfIndex = Math.ceil(menuSecondary?.nodes?.length / 2);
    const firstHalf = menuSecondary?.nodes?.slice(0, halfIndex);
    const secondHalf = menuSecondary?.nodes?.slice(halfIndex);

    const resizeHandler = () => {
        if (window.innerWidth < 1024) {
            setHeaderMobile(true);
        } else {
            setHeaderMobile(false);
        }
        if (window.innerWidth < 834) {
            setColorDark(false);
        } else if (headerColorDark && window.innerWidth > 833) {
            setColorDark(true)
        }
    };

    useEffect(() => {
        resizeHandler();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', resizeHandler);
            clearAllBodyScrollLocks();
        }
    }, []);

    return (
        <header className={`${headerColorDark ? 'bg-white tablet:bg-dark' : ''} ${minimizeHeader || compactHeader ? 'fixed bg-white' : 'absolute' } ${minimizeHeader && ! compactHeader ? 'animate-fadeInOut' : ''} z-[5] top-0 left-0 transition-[opacity] border-grey-light ${compactHeader ? 'tablet:h-header-compact border-b bg-white' : minimizeHeader ? 'tablet:h-header-compact border-b' : 'tablet:h-header'} ${halfWidthLayout ? (fullWidth ? 'tablet:fixed w-[100vw] tablet:bg-white' : 'tablet:absolute right-0 tablet:right-auto tablet:w-[50vw] tablet:border-b-0') : 'right-0'}`} ref={headerRef}>
            <div className={`container ${compactHeader || minimizeHeader ? '!max-w-none' : 'tablet:!max-w-none laptop:!max-w-screen-desktop'}`}>
                <div className={`${compactHeader ? 'pt-12 pb-12' : minimizeHeader ? 'pt-12 pb-12' : 'pt-10 pb-10 tablet:pt-20 tablet:pb-20'}`}>
                    <div className={`relative ${compactHeader ? 'border-t-0 border-dark pt-0' : minimizeHeader ? 'border-t-0 border-dark pt-0' : 'border-t-[6px] tablet:border-t-[12px] border-dark pt-10 tablet:pt-18'}`}>
                        <div className={`flex justify-between items-center ${minimizeHeader ? 'tablet:items-start' : 'tablet:items-start'} relative after:content-[""] after:absolute after:left-0 after:right-0 after:top-1/2 after:h-1 after:bg-grey-light ${compactHeader ? 'after:hidden' : minimizeHeader ? 'after:hidden' : 'after:hidden tablet:after:block'}`}>
                            <div className='flex items-center w-full max-w-[30%] leading-normal'>
                                {!fullWidth && <button aria-label='Menu Icon' className='px-5 py-5 -my-5 -ml-5 mr-5 hidden tablet:block' onClick={showMenuHandler}>{headerColorDark ? <IconMenuWhite /> : <IconMenu />}</button>}
                                {!fullWidth && <button aria-label='Menu Icon' className='px-5 py-5 -my-5 -ml-5 mr-5 tablet:hidden' onClick={showMenuHandler}><IconMenu /></button>}
                                {fullWidth && <button aria-label='Menu Icon' className='px-5 py-5 -my-5 -ml-5 mr-5' onClick={showMenuHandler}><IconMenu /></button>}
                                {/* <div className='relative hidden tablet:flex'>
                                    {!fullWidth && <button aria-label='Search Icon' className='mx-10 laptop:mx-[clamp(4px,_1.439vw_+_-10.72px,_10px)] hidden tablet:block' onClick={showSearchHandler}>{headerColorDark ? <IconSearchWhite /> : <IconSearch />}</button>}
                                    {!fullWidth && <button aria-label='Search Icon' className='mx-10 laptop:mx-[clamp(4px,_1.439vw_+_-10.72px,_10px)] tablet:hidden' onClick={showSearchHandler}><IconSearch /></button>}
                                    {fullWidth && <button aria-label='Search Icon' className='mx-10 laptop:mx-[clamp(4px,_1.439vw_+_-10.72px,_10px)]' onClick={showSearchHandler}><IconSearch /></button>}
                                </div> */}
                                {!compactHeader && 
                                    <ul className='list-none uppercase font-sans px-0 hidden laptop:flex'>
                                        {firstHalf?.map((menuItem) => (
                                            <li className='px-[clamp(4px,_1.439vw_+_-10.72px,_10px)]' key={menuItem.id}>
                                                <Link href={menuItem.url} prefetch={false} className='text-dark font-bold no-underline hover:underline'>{menuItem.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </div>
                            <div className={`relative z-10 ${headerColorDark ? (fullWidth ? '' : 'tablet:bg-dark') : 'bg-white'} px-8 tablet:px-18`}>
                                {!fullWidth && <Link aria-label="Maclean's Logo" href={'/'} className={`hidden tablet:block ${compactHeader ? 'w-[108px] tablet:w-[119px]' : minimizeHeader ? 'w-[108px] tablet:w-[119px]' : 'w-[108px] tablet:w-[440px]'}`}>
                                    {headerColorDark ? <LogoWhite className={`h-auto w-full`} /> : <Logo className={`h-auto w-full`} />}
                                </Link>}
                                {!fullWidth && <Link aria-label="Maclean's Logo" href={'/'} className={`block tablet:hidden ${compactHeader ? 'w-[108px] tablet:w-[119px]' : minimizeHeader ? 'w-[108px] tablet:w-[119px]' : 'w-[108px] tablet:w-[440px]'}`}>
                                    <Logo className={`h-auto w-full`} />
                                </Link>}
                                {fullWidth && <Link aria-label="Maclean's Logo" href={'/'} className={`block ${compactHeader ? 'w-[108px] tablet:w-[119px]' : minimizeHeader ? 'w-[108px] tablet:w-[119px]' : 'w-[145px] tablet:w-[440px]'}`}>
                                    <Logo className={`h-auto w-full`} />
                                </Link>}
                            </div>
                            <div className='w-full max-w-[30%] flex justify-end leading-normal'>
                                <ul className='list-none uppercase -mx-10 font-sans px-0 flex'>
                                    {!compactHeader && secondHalf?.map((menuItem) => (
                                            <li className='px-10 hidden laptop:block' key={menuItem.id}>
                                                <Link aria-label={menuItem.label} prefetch={false} href={menuItem.url} className={`text-dark font-bold no-underline hover:underline ${minimizeHeader ? 'tablet:leading-smm' : 'tablet:leading-smm'}`}>{menuItem.label}</Link>
                                            </li>
                                        ))
                                    }
                                    <li className='px-10'><Link aria-label="Subscribe" href="https://secure.macleans.ca/W42ASHPM" className={`${headerColorDark ? (fullWidth ? 'text-red' : 'text-red tablet:text-white') : 'text-red'} font-bold text-sm leading-xm tablet:text-smm ${minimizeHeader ? 'tablet:leading-smm' : 'tablet:leading-smm'} no-underline hover:underline`}>subscribe</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className={`fixed z-10 top-0 left-0 right-0 bottom-0 bg-dark transition-opacity duration-300 ${showMenu ? 'opacity-20 visible' : 'opacity-0 invisible'}`} onClick={hideMenuHandler}></div>
                        <div className={`popout-menu fixed top-0 left-0 bottom-0 bg-white px-20 w-full tablet:max-w-[272px] z-20 ${showMenu ? 'popout-open' : ''}`}>
                            <div className={`flex tablet:justify-end justify-between pt-10 pb-20 tablet:py-20 items-center ${ minimizeHeader ? 'mt-2' : 'border-t-6'} border-t-dark mt-10 tablet:border-t-0 tablet:mt-0`}>
								<div className='w-70 tablet:w-auto flex items-center leading-normal'>
                                	<button aria-label="Close Menu Icon" className='p-5 -m-5 laptop:hover:opacity-50' onClick={hideMenuHandler}><IconMenuClose /></button>
								</div>

                                <Link aria-label="Macleans Logo" href={'/'} className={`tablet:hidden block px-8 mr-6`} onClick={hideMenuHandlerLink}>
                                    <Logo className={`h-auto w-[144px]`} />
                                </Link>
                                    
								<li className='tablet:hidden block uppercase leading-normal'><Link href="https://secure.macleans.ca/W42ASHPM" prefetch={false} className={`text-red text-sm leading-xm font-bold font-sans no-underline hover:underline`}>subscribe</Link></li>
                            </div>
                            <div className='max-h-[calc(100lvh-60px)] overflow-y-auto' ref={dropDownRef}>
                                {/* <form action='#' className='pb-10'>
                                    <div className='flex border-1 border-grey-light rounded-sm px-10 py-10'>
                                        <input type='text' className='w-full text-smm leading-md text-dark placeholder:text-dark font-sans font-lightmedium h-[24px] outline-none' placeholder='Search Maclean’s' />
                                        <button aria-label="Search Icon" type='submit' className='ml-10 border-0 p-0 w-[24px] h-[24px] hover:opacity-50'><IconSearch /></button>
                                    </div>
                                </form> */}
                                <ul className='list-none uppercase px-0 pb-20'>
                                    {(compactHeader || headerMobile) && firstHalf?.map((menuItem) => (
                                            <li className={`border-t-1 border-grey-light first:border-t-0 py-12`} key={menuItem.id}>
                                                <Link aria-label={menuItem.label} prefetch={false} href={menuItem.url} className='text-dark font-bold no-underline hover:opacity-50 font-sans text-smm leading-smm' onClick={hideMenuHandlerLink}>{menuItem.label}</Link>
                                            </li>
                                        ))
                                    }
                                    {menu?.nodes?.map((item, index) => {
                                        return (
                                            <li key={index} className='border-t-1 border-grey-light first:border-t-0 py-12'>
                                                <Link
                                                    aria-label={item?.label}
                                                    href={`${item?.url}`} 
                                                    prefetch={false}
                                                    className='text-dark font-bold no-underline hover:opacity-50 font-sans text-smm leading-smm'
                                                    onClick={hideMenuHandlerLink}
                                                >
                                                        {item?.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                    {(compactHeader || headerMobile) && secondHalf?.map((menuItem) => (
                                            <li className='border-t-1 border-grey-light first:border-t-0 py-12' key={menuItem.id}>
                                                <Link aria-label={menuItem.label} prefetch={false} href={menuItem.url} className='text-dark font-bold no-underline hover:opacity-50 font-sans text-smm leading-smm' onClick={hideMenuHandlerLink}>{menuItem.label}</Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                                {menuBlock && showMenu && 
                                    <div className={`w-full border-t-6 border-black px-20 pt-40 pb-20`}>
                                        <div className='w-full text-center tablet:max-w-none max-w-[280px] mx-auto'>
                                            <div className='pb-15 px-40 tablet:px-0'>
                                                <Image className='mx-auto' src={menuBlock.customHeaderOptions?.custom_header_image} width={310} height={200} alt='image' loading="lazy" priority={false} />
                                            </div>
                                            {menuBlock.customHeaderOptions?.custom_header_title && <h3 className='pb-10 text-red'>{menuBlock.customHeaderOptions.custom_header_title}</h3>}
                                            {menuBlock.customHeaderOptions?.custom_header_subtitle && <p className='pb-15 text-sm leading-smxl text-grey font-sans font-lightmedium'>{menuBlock.customHeaderOptions.custom_header_subtitle}</p>}
                                            <a aria-label={menuBlock.customHeaderOptions?.custom_header_button_text || 'Subscribe'} href={menuBlock.customHeaderOptions?.custom_header_button_link ?? '/'} target='_blank' className='btn btn-secondary w-full'>{menuBlock.customHeaderOptions?.custom_header_button_text || 'Subscribe'}</a>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {/* <div className={`fixed top-0 left-0 bottom-0 right-0 bg-white px-20 z-20 transition-opacity duration-300 ${showSearch ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className='flex justify-end py-20'>
                                <button aria-label="Close Menu Icon" className='hover:opacity-50' onClick={hideSearchHandler}><IconMenuClose /></button>
                            </div>
                            <form action='#' className={`w-full max-w-[600px] mx-auto py-40`}>
                                <div className='flex border-1 border-grey-light rounded-sm px-10 py-10'>
                                    <input type='text' className='w-full text-smm leading-md text-dark placeholder:text-dark font-sans font-lightmedium h-[24px] outline-none' placeholder='Search Maclean’s' />
                                    <button aria-label="Search Icon" type='submit' className='ml-10 borde-0 p-0 w-[24px] h-[24px] hover:opacity-50'><IconSearch /></button>
                                </div>
                            </form>
                        </div> */}
                    </div>
                </div>
            </div>
        </header>
    )
}

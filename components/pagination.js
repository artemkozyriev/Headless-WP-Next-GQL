// components/Pagination.js

import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import querystring from 'querystring';
import IconArrowBack from '../assets/icons/icon-arrow-back.svg';
import IconArrowForward from '../assets/icons/icon-arrow-forward.svg';
import Link from "next/link";

const Pagination = ({ pageInfo, postListBlock }) => {
    const BATCH_SIZE = 12; // Set your BATCH_SIZE value or use it as a prop
    const router = useRouter();
    const queryParams = router.query;
    const initialPage = parseInt(queryParams.page) || 0;
    const totalPages = Math.ceil(pageInfo?.offsetPagination?.total / BATCH_SIZE);
    const pageNumbers = Array.from({ length: totalPages-1 }, (_, i) => i);

    const [activeIndex, setActiveIndex] = useState(initialPage);
    const [maxVisible, setMaxVisible] = useState(9);
    let start = 1;
    let end = totalPages;

    if (totalPages <= maxVisible) {
        start = 1;
        end = totalPages;
    } else if (activeIndex < maxVisible - 2) {
        start = 1;
        end = maxVisible;
    } else if (activeIndex >= totalPages - maxVisible + 2) {
        start = totalPages - maxVisible;
        end = totalPages;
    } else {
        start = activeIndex - 3;
        end = activeIndex + 3;
    }

    const visiblePages = pageNumbers.slice(start, end);

    const changeMaxVisible = () => {
        if (window.innerWidth < 768) {
            setMaxVisible(5);
        } else {
            setMaxVisible(9);
        }
    }

    const onClickPagination = (e) => {
        e.preventDefault();
        router.push(e.currentTarget.href, undefined, { shallow: true });
        window.scrollTo(0, postListBlock.current.offsetTop - 50);
    };

    const getPaginationUrl = (pageNumber) => {
        const newQueryParams = { ...queryParams, page: pageNumber.toString() };
        const newQueryString = querystring.stringify(newQueryParams);
        return `${router.pathname}?${newQueryString}`
    }

    useEffect(() => {
        setActiveIndex(initialPage);
    }, [initialPage]);

    useEffect(() => {
        changeMaxVisible();
        window.addEventListener('resize', changeMaxVisible);
        return () => {
            window.removeEventListener('resize', changeMaxVisible);
        }
    }, [pageInfo]);

    return (
        <>
            {totalPages !== 1 && totalPages !== 0 && <div className='flex items-center justify-center font-normal font-sans'>
                <Link
                    aria-label="Previous Page"
                    onClick={e => onClickPagination(e)}
                    shallow={true}
                    href={getPaginationUrl(activeIndex-1)}
                    className={`${
                        activeIndex === 0 ? 'pointer-events-none opacity-20' : ''
                    } mx-5 text-sm leading-smm laptop:hover:bg-grey-light w-[28px] h-[28px] border-1 border-grey-light rounded-full flex items-center justify-center`}
                >
                    <IconArrowBack />
                </Link>
                <Link
                    href={getPaginationUrl(0)}
                    onClick={e => onClickPagination(e)}
                    shallow={true}
                    className={`${
                        activeIndex === 0 ? 'font-bold pointer-events-none text-dark' : 'text-dark'
                    } px-5 text-sm leading-smm laptop:hover:opacity-60 min-w-[22px] no-underline`}
                >
                    1
                </Link>
                {activeIndex > maxVisible - 3 && maxVisible + 2 < totalPages && (
                    <span className="px-10 text-sm leading-smm">...</span>
                )}
                {visiblePages.map((number) => (
                    <Link
                        href={getPaginationUrl(number)}
                        onClick={e => onClickPagination(e)}
                        aria-label="Page Number"
                        key={number}
                        shallow={true}
                        className={`${
                            activeIndex === number ? 'font-bold pointer-events-none text-dark' : 'text-dark'
                        } px-5 text-sm leading-smm laptop:hover:opacity-60 min-w-[22px] no-underline`}>
                        {number + 1}
                    </Link>
                ))}
				{activeIndex < totalPages - 2 && maxVisible + 2 < totalPages && (
					<span className="px-10 text-sm leading-smm">...</span>
				)}
				<Link
                    aria-label="Last Page"
                    href={getPaginationUrl(totalPages - 1)}
                    onClick={e => onClickPagination(e)}
                    shallow={true}
					className={`${
						activeIndex === totalPages - 1 ? 'font-bold pointer-events-none' : 'text-dark'
					} px-5 text-sm leading-smm laptop:hover:opacity-60 min-w-[22px] no-underline`}
				>
					{totalPages.toString()}
				</Link>
				<Link
                    aria-label="Next Page"
					onClick={e => onClickPagination(e)}
                    href={getPaginationUrl(activeIndex + 1)}
                    shallow={true}
					className={`${
						activeIndex === totalPages - 1 ? 'font-bold pointer-events-none' : ''
					} mx-5 text-sm leading-smm laptop:hover:bg-grey-light w-[28px] h-[28px] border-1 border-grey-light rounded-full flex items-center justify-center`}
				>
					<IconArrowForward />
				</Link>
            </div>}
        </>
    );
};

export default Pagination;

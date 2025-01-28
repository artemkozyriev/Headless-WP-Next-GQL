import React from 'react';
import ReactHtmlParser from 'html-react-parser';
import Image from 'next/image';

export default function ListCard({block, index}) {
	const { title, description, image, byline, buttonText = 'On to the list', buttonLink = '#' } = block.attributes || {};

	return (
		<div className='ad-free-zone mx-auto max-w-[600px] px-20 tablet:px-0'>
			<div className="border border-b-6 border-dark p-10">
				<div className='w-full aspect-[580_/_387]'>
					<Image 
						className="w-full h-full object-cover"
						sizes="(max-width: 768px) 100vw, 600px"
						src={image} 
						width={600} 
						height={400} 
						priority={false}
						alt={title || 'Content image'} 
					/>
				</div>
				<div className="w-full md:w-1/2 px-20 tablet:px-40 py-20 text-center">
					<h2 className="text-mdl leading-base tablet:text-lg font-bold text-red mb-10 uppercase font-sans tablet:leading-lg">{ ReactHtmlParser(title || '') }</h2>
					{description && Array.isArray(ReactHtmlParser(description)) && <div className="mb-10 font-sans font-lightmedium text-sm tablet:text-reg text-grey leading-xm tablet:leading-smxl">
						{ ReactHtmlParser(description).map((str, idx) => str.type !== 'br' ? <div key={idx} className='first:mt-0 mt-16 tablet:mt-20'>{str}</div> : null) }
					</div>}
					{description && !Array.isArray(ReactHtmlParser(description)) && <div className="mb-10 font-sans font-lightmedium text-sm tablet:text-reg text-grey leading-xm tablet:leading-smxl">
						{ ReactHtmlParser(description) }
					</div>}
					<p className="text-xs font-sans uppercase font-bold text-grey">{ byline }</p>
					<a href={buttonLink} className="btn btn-primary mt-20">{ buttonText }</a>
				</div>
			</div>
		</div>
	)
}

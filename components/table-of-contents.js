import React from 'react';
import ReactHtmlParser from 'html-react-parser';
import Link from 'next/link';

export default function TableOfContents({block, index}) {
	const { columnCount = 1, items = [] } = block.attributes || {};

	return (
		<div className={`ad-free-zone cols-${columnCount} ${columnCount === 2 ? 'tablet:grid tablet:grid-cols-2 gap-x-20' : ''} container max-laptop:!max-w-none`}>
			{items.map((item, i) => (
				<a key={i} shallow={true} href={item.url ?? '#'} className={`group no-underline mb-4 ${item.description ? 'grid grid-cols-2' : 'block'} justify-between items-center content-table-row py-10`}>
					<h3 className="text-reg leading-smxl font-medium only:text-center group-hover:underline">{ ReactHtmlParser(item.title) }</h3>
					{ item.description && <p className='text-right text-sm font-sans font-lightmedium text-grey'>{item.description}</p>}
				</a>
			))}
		</div>
	)
}

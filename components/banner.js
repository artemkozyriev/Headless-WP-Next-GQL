import React from 'react'

export default function Banner({ children, bordered = true, className }) {
	return (
		<div className='@container'>
			<div className={`text-center pt-10 @tablet:px-40 @tablet:pb-40 @tablet:pt-16 sjc-ad ${ bordered ? 'border-y-grey-light border-y bg-grey-lighter px-20 pb-20' : 'pb-40 px-0'} ${className}`}>
				{/* <p className={`uppercase font-sans font-medium text-xs text-grey leading-normal ${ bordered ? 'mb-10 @tablet:mb-16' : 'mb-12'}`}>Advertisement</p>

				<div className='flex justify-center'>
					{children}
				</div> */}
			</div>
		</div>
	)
}

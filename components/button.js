import Link from 'next/link'
import React, { useCallback } from 'react'

export default function Button({ href, children, type, disabled }) {
	const typeClasses = useCallback(() => {
		switch( type ) {
			case 'primary': return `btn btn-primary text-center ${ disabled ? 'bg-hightlight border-hightlight' : '' }`;
			case 'outline': return `btn btn-outline text-center ${ disabled ? 'bg-hightlight border-hightlight' : '' }`;
			case 'secondary': default: return `btn btn-secondary text-center ${ disabled ? 'border-disabled' : ''}`;
		}
	}, [type, disabled])

	return (
		<Link 
			href={href || '#'}
			aria-label={children}
			disabled={disabled}
			aria-disabled={disabled} 
			tabIndex={disabled? -1 : undefined}
			className={`${typeClasses()} transition-colors inline-block font-sans font-normal border px-23 py-12 uppercase text-sm rounded-sm no-underline ${ disabled ? 'pointer-events-none text-disabled' : '' }`}
		>
			{children}
		</Link>
	)
}

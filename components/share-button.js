import { useState, useRef, useEffect, useMemo } from 'react'
import ShareIcon from '../assets/icons/ico-share.svg'
import CloseIcon from '../assets/icons/ico-close.svg'
import LinkIcon from '../assets/icons/ico-link.svg'
import EmailIcon from '../assets/icons/ico-email.svg'
import FacebookIcon from '../assets/icons/ico-facebook.svg'
import TwitterIcon from '../assets/icons/ico-x.svg'
import LinkedinIcon from '../assets/icons/ico-linkedin.svg'
import WhatsappIcon from '../assets/icons/ico-whatsapp.svg'
import RedditIcon from '../assets/icons/ico-reddit.svg'

export default function ShareButton({ postTitle: title }) {
	const [ active, setActive ] = useState(false);
	const [ above, setAbove ] = useState(false);
	const [ copied, setCopied ] = useState(false);

	const btnRef = useRef(null);

	useEffect(() => {
		if ( btnRef.current ) {
			const rect = btnRef.current.getBoundingClientRect();
			const height = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );

			setAbove( document.documentElement.scrollTop + rect.top + 404 >= height );
		}

		document.addEventListener('click', () => {
			setActive(false)
		})
	}, []);

	useEffect(() => {
		if ( ! copied ) return;

		setTimeout(() => setCopied(false), 4000);
	}, [copied])

	const buttons = [
		{
			icon: <LinkIcon/>,
			label: 'Copy Link',
			action: () => {
				navigator.clipboard.writeText(window.location.href);
				setCopied(true);
			}
		},
		{
			icon: <EmailIcon/>,
			label: 'Email',
			action: () => {
				window.open(`mailto:?subject=${title}&body=${window.location.href}`);
			}
		},
		{
			icon: <FacebookIcon/>,
			label: 'Facebook',
			action: () => {
				// Doesn't work with localhost URLs
				window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
			}
		},
		{
			icon: <TwitterIcon/>,
			label: 'X',
			action: () => {
				window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${title}`, '_blank');
			}
		},
		{
			icon: <LinkedinIcon className='rounded-md'/>,
			label: 'LinkedIn',
			action: () => {
				window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${title}`, '_blank');
			}
		},
		{
			icon: <WhatsappIcon/>,
			label: 'WhatsApp',
			action: () => {
				window.open(`https://api.whatsapp.com/send?text=${title} - ${window.location.href}`, '_blank');
			}
		},
		{
			icon: <RedditIcon/>,
			label: 'Reddit',
			action: () => {
				window.open(`http://www.reddit.com/submit?title=${title}&url=${window.location.href}`, '_blank');
			}
		},
	]

	const renderButtons = useMemo(() => 
		buttons.map((btn, idx) => 
		<li className='border-b border-b-grey-light text-dark last:border-b-0 group' key={idx}>
			<button className='flex items-center gap-10 py-7 group-last:pb-0 w-full font-light group' onClick={ btn.action }>
				<div className='rounded-full border border-grey-light p-6 w-32 transition-colors group-hover:bg-grey-lighter'>
					{ btn.icon }
				</div>

				{ copied && btn.label === 'Copy Link' ? 
					<strong className='font-medium'>Link Copied</strong>
					: <span>{ btn.label }</span>
				}
			</button>
		</li>	
	), [buttons, copied] )

  	return (
		<div className='relative inline-block' onClick={(e) => e.stopPropagation()}>
			<button aria-label="Sharing Button" ref={btnRef} className='rounded-xl border border-grey-light px-12 py-6 hover:bg-grey-lighter transition-colors' onClick={() => setActive(true)}>
				<ShareIcon/>
			</button>

			<div className={`fixed laptop:absolute max-laptop:bottom-0 ${ above ? 'laptop:bottom-[calc(100%+25px)]' : 'laptop:top-[calc(100%+20px)]' } left-0 right-0 laptop:right-auto w-full laptop:w-[190px] p-20 rounded-lg bg-white font-sans shadow-[0px_0px_10px_rgba(0,0,0,0.15)] ${ active ? 'visible' : 'invisible' }`}>
				<div className='flex justify-between mb-16'>
					<h6>Share</h6>

					<button aria-label="Close Sharing Modal" onClick={() => setActive(false)} className='hover:opacity-50 transition-opacity'>
						<CloseIcon/>
					</button>
				</div>

				<ul className='list-none p-0'>
					{ renderButtons }
				</ul>
			</div>
		</div>
	)
}
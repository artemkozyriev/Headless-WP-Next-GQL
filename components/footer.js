import React from 'react'
import SJCLogo from '../assets/logos/logo-sjc.svg'
import CanadianBusinessLogo from '../assets/logos/logo-canadianbusiness.svg'
import ChatelaineLogo from '../assets/logos/logo-chatelaine.svg'
import FashionLogo from '../assets/logos/logo-fashion.svg'
import HelloCanadaLogo from '../assets/logos/logo-hellocanada.svg'
import MacleansLogo from '../assets/logos/logo-macleans.svg'
import TodaysParentLogo from '../assets/logos/logo-todaysparent.svg'
import TorontoLifeLogo from '../assets/logos/logo-torontolife.svg'
import FacebookIcon from '../assets/icons/icon-facebook.svg'
import TwitterIcon from '../assets/icons/icon-x.svg'
import InstaIcon from '../assets/icons/icon-instagram.svg'
import YoutubeIcon from '../assets/icons/icon-youtube.svg'
import LinkedinIcon from '../assets/icons/icon-linkedin.svg'
import TiktokIcon from '../assets/icons/icon-tiktok.svg'
import Link from 'next/link'

const logos = [
	<CanadianBusinessLogo href="http://canadianbusiness.com/" className='mobile:w-[min(116px,29vw)] tablet:w-[176px]'/>,
	<ChatelaineLogo href="http://chatelaine.com/" className='mobile:w-[min(90px,23vw)] tablet:w-[97px]'/>,
	<FashionLogo href="http://fashionmagazine.com/" className='mobile:w-[min(76px,19vw)] tablet:w-[90px]'/>,
	<HelloCanadaLogo href="http://hellomagazine.com/ca" className='mobile:w-[min(60px,15vw)] tablet:w-[51px]'/>,
	<MacleansLogo href="http://macleans.ca/" className='mobile:w-[min(96px,24vw)] tablet:w-[122px]'/>,
	<TodaysParentLogo href="http://todaysparent.com/" className='mobile:w-[min(80px,20vw)] tablet:w-[74px]'/>,
	<TorontoLifeLogo href="http://torontolife.com/" className='mobile:w-[min(70px,18vw)] tablet:w-[54px]'/>
]

const socials = [
	{
		link: 'https://twitter.com/macleans',
		icon: <TwitterIcon/>
	},
	{
		link: 'https://www.tiktok.com/@macleansmag',
		icon: <TiktokIcon/>
	},
	{
		link: 'https://www.linkedin.com/company/maclean\'s/',
		icon: <LinkedinIcon/>
	},
]

export default function Footer({ firstMenu, secondMenu }) {
	return (
		<footer className='pt-80 pb-[140px] px-20 tablet:px-40 mt-auto'>
			<div className='pb-40 mb-40 max-w-[1360px] mx-auto border-b-grey-light border-b'>
				<div className='text-center mb-40'>
					<Link aria-label='St.Joseph Communiactions Logo' href="https://www.stjoseph.com/" target={'_blank'} className='hover:opacity-50 transition-opacity inline-block align-top'>
						<SJCLogo className='mx-auto'/>
					</Link>
				</div>

				<div className='mx-auto flex flex-wrap justify-center gap-x-30 tablet:gap-x-42 gap-y-24 laptop:max-w-full tablet:max-w-[660px] mobile:max-w-[300px] max-[375px]:max-w-[220px]'>
					{ logos?.map((logo, idx) => 
						<Link aria-label={`logo-`+ idx} href={logo.props.href} key={`fLogos_${idx}`} className={`after:block relative after:absolute after:top-0 after:bottom-0 hover:opacity-50 transition-opacity after:w-1 after:left-[calc(100%_+_15px)] tablet:after:left-[calc(100%_+_20px)] last:after:hidden after:bg-grey-light h-20 grid place-content-center ${idx === 3 ? 'tablet:after:hidden laptop:after:block' : ''} ${idx === 1 || idx === 4 ? 'mobile:after:hidden tablet:after:block' : ''}`}>
							{ logo }
						</Link>
					)}
				</div>
			</div>

			<div>
				<ul className='list-none p-0 uppercase font-sans text-sm tablet:text-smm flex flex-wrap items-center justify-center gap-x-20 gap-y-10 mb-20'>
					{ firstMenu && firstMenu?.nodes?.map((node, idx) => 
						<li key={`ffMenu_${idx}`}>
							<Link aria-label={node.label} href={node.url} target={node.target} className='text-dark no-underline font-bold hover:underline hover:decoration-2'>{node.label}</Link>
						</li>
					)}
				</ul>
				
				<ul className='list-none p-0 uppercase font-sans text-[10px] flex flex-wrap items-center justify-center gap-x-20 gap-y-10'>
					<li className='text-dark no-underline font-light w-full text-center tablet:w-auto'>
						© 2024 SJC Media
					</li>

					{ secondMenu && secondMenu?.nodes?.map((node, idx) => 
						<li key={`fsMenu_${idx}`}>
							<Link aria-label={node.label} href={node.url} target={node.target} className='text-dark no-underline font-light hover:opacity-50 transition-opacity'>{node.label}</Link>
						</li>
					)}
				</ul>

				<ul className='list-none p-0 flex flex-wrap items-center justify-center gap-x-30 tablet:gap-x-20 gap-y-10 mt-20'>
					{ socials?.map((item, idx) => 
						<li key={`fSoc_${idx}`}>
							<Link aria-label={`social-link-` + idx} href={item.link} className='hover:opacity-50 transition-opacity'>
								{ item.icon }
							</Link>
						</li>
					)}
				</ul>
			</div>
		</footer>
	)
}

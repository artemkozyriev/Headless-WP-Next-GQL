import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import WebIcon from '../assets/icons/icon-website.svg'
import WikipediaIcon from '../assets/icons/icon-wiki.svg'
import FacebookIcon from '../assets/icons/icon-facebook.svg'
import LinkedInIcon from '../assets/icons/icon-linkedin.svg'
import TwitterIcon from '../assets/icons/icon-x.svg'
import InstagramIcon from '../assets/icons/icon-instagram.svg'
import TikTokIcon from '../assets/icons/icon-tiktok.svg'

export default function AuthorBio({author}) {
	const { avatar, description, firstName, lastName, nickname, slug, url, seo: { social: socials } } = author;
	const [ hasAvatar, setHasAvatar ] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState('');

	const getName = useCallback(() => {
		if ( firstName && lastName ) return firstName + ' ' + lastName
		else if ( nickname ) return nickname
		else return slug.slice(0, 1).toUpperCase() + slug.slice(1)
	}, [firstName, lastName, nickname, slug])

	const sortedSocials = useMemo(() => {
		var sortOrder = [ 'twitter', 'facebook', 'linkedIn', 'instagram', 'tiktok', 'wikipedia' ];

		return Object.entries(socials).sort(
			(a, b) => {
				if(a[0] == b[0]) return a[0].localeCompare(b[0]);
				else return sortOrder.indexOf(a[0]) - sortOrder.indexOf(b[0]);
			}
		);
	}, [socials])

	const getIcon = (name) => {
		switch(name) {
			case 'wikipedia': return <WikipediaIcon/>;
			case 'facebook': return <FacebookIcon/>;
			case 'linkedIn': return <LinkedInIcon/>;
			case 'twitter': return <TwitterIcon/>;
			case 'instagram': return <InstagramIcon/>;
			case 'tiktok': return <TikTokIcon/>;
			default: return <WebIcon/>;
		}
	}

	const renderSocial = ([ key, value ]) => {
		if (!value || key === '__typename') return;

		switch (key) {
			case 'twitter':
				if (!value.startsWith('https://')) {
					value = 'https://twitter.com/' + value;
				}
				break;
			case 'wikipedia':
				if (!value.startsWith('https://')) {
					value = 'https://www.wikipedia.org/wiki/' + value;
				}
				break;
			case 'facebook':
				if (!value.startsWith('https://')) {
					value = 'https://www.facebook.com/' + value;
				}
				break;
			case 'linkedin':
				if (!value.startsWith('https://')) {
					value = 'https://www.linkedin.com/in/' + value;
				}
				break;
			case 'instagram':
				if (!value.startsWith('https://')) {
					value = 'https://www.instagram.com/' + value;
				}
				break;
			case 'tiktok':
				if (!value.startsWith('https://')) {
					value = 'https://www.tiktok.com/@' + value;
				}
				break;
			default:
				break;
		}

		return (
			<Link aria-label={`${key}-link`} href={value} key={"social_" + key} target="_blank" className='hover:opacity-50 transition-opacity'>
				{getIcon(key)}
			</Link>
		);
	}

	const areSocialsEmpty = useCallback(() => {
		return Object.values(socials).every(social => social === '');
	}, [socials])

	useEffect(() => {
        const fetchAvatar = async () => {
            const newAvatarUrl = avatar.url.replace('?s=96', '?s=200');
            const response = await fetch(newAvatarUrl + '&d=404');

            if (response.status === 200) {
                setHasAvatar(true);
                setAvatarUrl(newAvatarUrl);
            }
        }

        fetchAvatar();
    }, [])

	return (
		<div className='px-20 tablet:px-40 py-20 border-b border-b-grey-light border-t-dark border-t-6 mb-20'>
			<div className='max-w-[650px] mx-auto'>
				{ hasAvatar && 
					<div className='w-fit mx-auto rounded-full overflow-hidden mb-20 max-w-[100px] tablet:max-w-[124px]'>
						<img aria-label="author image" src={avatarUrl} width="124" height="124"/>
					</div>
				}

				<div className='mb-10'>
					<h1 className='font-grotesk text-center mobile:text-3xl mobile:leading-4xl'>{ getName() }</h1>
				</div>

				<div className='text-center font-sans font-lightmedium text-smm tablet:text-reg leading-sm tablet:leading-smxl text-grey'>
					{ description }
				</div>

				{ ( ! areSocialsEmpty() || url) && <div className='flex items-center justify-center mt-20 gap-12'>
					{ ! areSocialsEmpty() && sortedSocials.map(social => renderSocial(social))}
					{ url && <Link aria-label="Author Website Link" href={url} target='_blank' className='hover:opacity-50 transition-opacity'><WebIcon/></Link>}
				</div>}
			</div>
		</div>
	)
}

import React, {useEffect} from 'react';
import Head from 'next/head';

const Helmet = ({ seo = {}, tags, author, type, date, modified }) => {
    const defaultImageUrl = 'https://macleans.ca/no-image.jpg';
    let title, metaDesc, opengraphTitle, opengraphDescription, opengraphType, opengraphUrl, canonical, focuskw, opengraphImage, cornerstone, twitterTitle, twitterDescription, readingTime;
    let authorCanonical = null;

    if (type === "Person") {
        title = author?.firstName + ' ' + author?.lastName
        title = seo?.opengraphTitle
        opengraphDescription = seo?.opengraphDescription;
        metaDesc = seo?.metaDesc;
    } else if (seo){
        ({ title, metaDesc, opengraphTitle, opengraphDescription, opengraphType, opengraphUrl, canonical, focuskw, opengraphImage, cornerstone, twitterTitle, twitterDescription, readingTime } = seo);
    }

    if (opengraphUrl && opengraphUrl.endsWith('/home/')) {
        opengraphUrl = opengraphUrl.replace('/home/', '/')
    }

    if (opengraphUrl && opengraphUrl.endsWith('/home-new/')) {
        opengraphUrl = opengraphUrl.replace('/home-new/', '/')
    }


    let customSchema = {
        "@context": "https://schema.org",
        "@type": type || "WebPage",
        "name": title || opengraphTitle || seo?.opengraphTitle || 'Macleans.ca',
        "description": metaDesc || opengraphDescription,
        "url": opengraphUrl || canonical || seo?.opengraphUrl || 'https://macleans.ca'
    };

    if (type === "WebSite") {
        customSchema = {
            ...customSchema,
            "headline": opengraphDescription || metaDesc,
            "keywords": tags?.nodes.length > 0 ? tags.nodes.map(tag => tag.name).join(', ') : focuskw
        }
    }

    if (type === "NewsArticle") {
        customSchema = {
            ...customSchema,
            "articleBody": seo.content,
            "alternativeHeadline": opengraphDescription,
            "publisher": {
                "@type": "Organization",
                "name": "St. Joseph Media",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://macleans.ca/no-image.jpg"
                }
            },
            "author": {
                "@type": "Person",
                "name": author?.node?.name
            },
            "datePublished": date + 'Z',
            "dateModified": modified + 'Z',
            "headline": seo?.seo?.opengraphTitle || title,
            "image": seo?.seo?.opengraphImage?.sourceUrl || defaultImageUrl,
            "mainEntityOfPage": seo?.seo?.opengraphUrl || opengraphUrl,
            "keywords": tags?.nodes.length > 0 ? tags.nodes.map(tag => tag.name).join(', ') : focuskw || seo?.seo?.opengraphTitle || title
        };
    }

    if (type === "Person") {
        customSchema = {
            ...customSchema,
            "name": seo?.seo?.firstName + ' ' + seo?.seo?.lastName || author?.nickname,
            "givenName": seo?.seo?.firstName,
            "familyName": seo?.seo?.lastName,
            // "sameAs": seo.social ? Object.values(seo.social).filter(Boolean) : [],
            "description": seo?.seo?.description,
            "image": seo?.seo?.avatar?.url || defaultImageUrl,
            "jobTitle": author?.role || 'Author',
            "url": seo?.seo?.url || 'https://macleans.ca/author/' + author?.slug
        }
        
    }
    
    if (type === "BreadcrumbList") {
        customSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": seo?.breadcrumbs?.map((crumb, index) => {
                return {
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": crumb.text,
                    "item": crumb.url
                }
            })
        }
    }

    useEffect(() => {
        if (type === "Person") {
            authorCanonical = window.location.host + '/author/' + author?.slug;
        }
    }, [])

    return (
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{title || opengraphTitle || 'Macleans'}</title>
            <meta name="description" content={ metaDesc || author?.description || seo?.opengraphDescription } />
            <meta property="og:site_name" content='Macleans.ca' />
            <meta property="og:title" content={ opengraphTitle || title } />
            <meta property="og:description" content={seo?.opengraphDescription || opengraphDescription || metaDesc} />
            <meta property="og:type" content={type === 'Person' ? 'profile' : (opengraphType || 'article')} />
            <meta property="og:url" content={ opengraphUrl || author?.url || 'https://macleans.ca' + seo?.uri || 'https://macleans.ca/author/' + author?.slug } />
            {(opengraphUrl || canonical || seo?.opengraphUrl || authorCanonical) && <link rel="canonical" href={opengraphUrl || canonical || seo?.opengraphUrl || authorCanonical} />}
            {focuskw && <meta name="focus-keyword" content={focuskw} />}
            <meta property="og:image" content={opengraphImage?.sourceUrl || author?.avatar?.url || defaultImageUrl } />
            {cornerstone && <meta name="cornerstone" content="true" />}
            <meta property="og:locale" content="en_US" />
            <meta name="twitter:title" content={twitterTitle || title || seo?.opengraphTitle} />
            <meta name="twitter:description" content={twitterDescription || metaDesc || seo?.opengraphDescription} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="reading-time" content={`${readingTime} mins`} />
            {customSchema && <script type="application/ld+json">{JSON.stringify(customSchema)}</script>}
            {author && 
                <>
                    <meta name="author" content={author?.node?.name || author?.firstName + ' ' + author?.lastName } />
                    <meta property="article:author" content={author?.node?.name} />
                </>
            }
            {type === "Person" && (
                <>
                    <meta name="content-type" content={'contributor'}/>
                </>
            )}
            {tags?.nodes.map((tag, index) => <meta property="article:tag" content={tag.name} key={index} />)}
            <meta name="msapplication-TileImage" content="/windows-tile-icon.png"/>
            <meta name="msapplication-TileColor" content="#000000"/>
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"></link>
            <meta name="msapplication-TileColor" content="#000000"/>
            <meta name="theme-color" content="#ffffff"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
            <meta name="msapplication-TileColor" content="#000000"/>
            <meta name="msapplication-TileImage" content="/mstile-144x144.png"/>
            <meta name="theme-color" content="#ffffff"></meta>
        </Head>
    );
};

export default Helmet;
import React, {useState, useEffect, lazy} from 'react';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import { useRouter } from 'next/router';
const Footer = lazy(() => import('@/components/footer'));
import Helmet from '@/components/helmet';
import Header from '@/components/header';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [headerHalfWidth, setHeaderHalfWidth] = useState(false);
  const [headerColorDark, setHeaderColorDark] = useState(false);
  const [loadTypekit, setLoadTypekit] = useState(false);

  useEffect(() => {
    if (!pageProps?.postData?.blocks?.length) {
      setHeaderHalfWidth(false);
      setHeaderColorDark(false);
    }
    if (pageProps?.postData?.blocks?.length && pageProps.postData.blocks[0].name == 'macleans/post-header' && pageProps.postData.blocks[0].attributes?.layout == 'half') {
      setHeaderHalfWidth(true);
      if (pageProps.postData.blocks[0].attributes?.textColorHalf == 'dark') {
        setHeaderColorDark(true);
      }
    }
    
    setLoadTypekit(true);
  }, []);

  const seo = () => {
    let type;
    let seoData;
    let author;
    let tags;
    let date;
    let modified;

    if (pageProps?.page) {
      type = 'Website';
      seoData = pageProps.page.seo;
      tags = pageProps.page.tags;
      author = pageProps.page.author;
    } else if (pageProps?.postData) {
      type = 'NewsArticle';
      seoData = pageProps.postData.seo;
      tags = pageProps.postData.tags;
      author = pageProps.postData.author;
      date = pageProps.postData.date;
      modified = pageProps.postData.modified;
    } else if (pageProps?.author) {
      type = 'Person';
      author = pageProps.author;
      seoData = pageProps.author.seo;
    } else if (pageProps?.category) {
      type = 'BreadcrumbList';
      seoData = pageProps.category.seo;
    } else {
      type = null;
      seoData = null;
      tags = null;
      author = null;
    }

    return { type, seoData, tags, author, date, modified };
  };

  const { type, seoData, tags, author, date, modified } = seo();

  const scriptContent = `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
    `;

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/dpc3rky.css" media="all" />
        <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
        <script src={`${process.env.NEXT_PUBLIC_ASSEMBLY_URL}`} ></script>
      </Head>
      <Helmet seo={seoData} type={type} tags={tags} author={author} date={date} modified={modified} />
      <div className='flex flex-col min-h-screen'>
        <Header 
          menu={pageProps?.mainMenu} 
          menuSecondary={pageProps?.mainMenuSecondary} 
          menuBlock={pageProps?.menuBlock} 
          compactHeader={pageProps?.isHomePage ? false : true} 
          halfWidthLayout={headerHalfWidth}
          headerColorDark={headerColorDark}
        />
        <Component {...pageProps} key={router.asPath} halfWidthLayout={headerHalfWidth} />
        {pageProps?.firstMenu && pageProps?.secondMenu && <Footer firstMenu={pageProps?.firstMenu} secondMenu={pageProps?.secondMenu} />}
      </div>
    </>
  )
}
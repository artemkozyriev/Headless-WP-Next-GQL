 import React from 'react';
 import ReactHtmlParser from 'html-react-parser';
 import { replaceStraightApostrophes } from '@/lib/utils/textUtils';
 
// Component for rendering different heading levels
export default function HeadingComponent({ level, textAlign, content, htmlContent }) {
    const HeadingTag = `h${level || 6}`;
    const match = htmlContent.match(/id="([^"]*)"/);
    const id = match ? match[1] : '';

    return (
        <HeadingTag className='wp-block-heading' style={{ textAlign }} id={id}>
            {ReactHtmlParser(replaceStraightApostrophes(content))}
        </HeadingTag>
    );
}
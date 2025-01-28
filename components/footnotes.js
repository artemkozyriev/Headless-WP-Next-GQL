import React, {useEffect} from 'react';
import ReactHtmlParser from 'html-react-parser';

export default function Footnotes({block}) {
    useEffect(() => {
        const footnotesItems = document.querySelectorAll('.wp-block-footnotes li');

        footnotesItems?.forEach((item) => {
            const link = document.querySelector(`a[href="#${item.getAttribute('id')}"]`);
            link.addEventListener('click', linkClickHandler);
        });
        
    }, [block]);

    const linkClickHandler = (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth', block: "center", inline: "nearest" });
    }

	return (
		<>
            {block?.htmlContent && <div className='max-w-[600px] mx-auto'>
                {ReactHtmlParser(block?.htmlContent)}
            </div>}
        </>
	)
}
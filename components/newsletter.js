import { forwardRef, useCallback, useState } from 'react';
import Image from 'next/image';
import ReactHtmlParser from 'html-react-parser';
import axios from 'axios';

const Newsletter = forwardRef(function Newsletter(props, ref) {
 	const { postBlock } = props;
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = useCallback(
        async (e) => {
          e.preventDefault();

          try {
              const response = await axios.post(
                  `/api/newsletter`,
                  {email}
              );

              if (response.data.success) {
                  console.log('Successfully subscribed to Campaign Monitor!');
                  setErrorMessage('Thank you for subscribing!');
              } else {
                  console.error('Failed to subscribe to Campaign Monitor');
                  setErrorMessage('Failed to subscribe. Please try again.');
              }
          } catch (error) {
              console.error('Error:', error);
              setErrorMessage(error.toString());
          }
        },
        [email]
    );

	return (
		<div className={`newsletter-block w-full border-t-3 tablet:border-t-6 border-black px-20 ${postBlock.attributes?.magazineLayout ? 'pt-40 pb-40' : 'pt-20 pb-20'}`} ref={ref}>
        {
            postBlock.attributes?.magazineLayout ? 
            <div className='w-full text-center'>
                <div className='pb-15'>
                    <Image className='mx-auto' src={postBlock.attributes.magazineImage} width={310} height={200} alt='image' loading="lazy" />
                </div>
                {postBlock.attributes?.title && <h3 className='pb-10 text-red'>{ReactHtmlParser(postBlock.attributes.title)}</h3>}
                {postBlock.attributes?.subtitle && <p className='pb-15 text-sm leading-sm text-grey font-sans font-lightmedium'>{postBlock.attributes.subtitle}</p>}
                <button className='btn btn-secondary w-full' onClick={() => window.open(postBlock.attributes.buttonLink ?? '#', postBlock.attributes.buttonLink ? '_blank' : '_self')}>{postBlock.attributes.buttonText || 'Subscribe'}</button>
            </div>
            :
            <div className='w-full text-center'>
                {postBlock.attributes?.title && <h3 className='pb-10 text-red text-mdl leading-base desktop:text-lg desktop:leading-lg'>{ReactHtmlParser(postBlock.attributes.title)}</h3>}
                {postBlock.attributes?.subtitle && <p className='pb-15 text-sm leading-sm text-grey font-sans font-lightmedium'>{ReactHtmlParser(postBlock.attributes.subtitle || '')}</p>}
                <form method='post' action={postBlock?.attributes?.buttonLink ?? '#'} onSubmit={handleSubmit}>
                    <div className="pb-10">
                        <input 
                            className="input" 
                            type="email" 
                            placeholder="Email" 
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required  
                        />
                    </div>
                    <button className='btn btn-secondary w-full' type='submit'>{postBlock.attributes?.buttonText || 'Subscribe'}</button>
                    {errorMessage && (
                        <p className={`error-message font-sans font-light medium text-red`}>
                            {ReactHtmlParser(errorMessage || '')}
                        </p>
                    )}
                </form>
            </div>
        }
    </div>
	)
});

export default Newsletter;
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'html-react-parser';
import { replaceStraightApostrophes } from '@/lib/utils/textUtils';

const NewsletterSignup = ({ block }) => {
  const { 
    layout, 
    title = 'Get the Best of <em>Maclean’s</em> straight to your inbox.', 
    subtitle = 'Sign up for news, commentary, analysis and promotions. Join 80,000+ Canadian readers.',
  } = block?.attributes ? block?.attributes : [];

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

  const renderContent = useCallback(() => {
    return (
      <div className='max-w-screen-desktop mx-auto px-20 tablet:px-40'>
        <div
          className={`wp-newsletter-signup max-w-screen-desktop mx-auto w-full py-20 my-20 tablet:my-40 tablet:py-80 
          ${ layout === 'default' || !layout
              ? 'border-t-3 tablet:border-t-[6px] border-dark bg-white'
              : layout === 'layout-one'
              ? 'bg-grey-lighter'
              : 'bg-dark'
          }`}
          
        >
          <div className='flex flex-col tablet:flex-row max-w-[800px] w-full mx-auto tablet:items-center'>
            <div className='flex flex-col tablet:w-7/12 space-y-10 text-center tablet:text-left px-20'>
              {title && <h2 className='text-red'>{ReactHtmlParser(replaceStraightApostrophes(title))}</h2>}
              {subtitle && (
                <p
                  className={`newsletter-subtitle font-sans text-sm leading-xm tablet:leading-smm font-lightmedium ${
                    layout === 'layout-two' ? 'text-white' : 'text-grey'
                  }`}
                >
                  {ReactHtmlParser(replaceStraightApostrophes(subtitle))}
                </p>
              )}
            </div>
            <div className='flex flex-col tablet:w-5/12 tablet:pl-30'>
              <form
                onSubmit={handleSubmit}
                className='newsletter-form flex flex-col space-y-10 pt-20 tablet:pt-0 mx-auto tablet:mx-0 w-full max-w-[500px] tablet:max-w-full'
              >
                <input
                  type='email'
                  placeholder='Email'
                  className={`newsletter-email w-full p-10 rounded-sm font-sans font-light ${
                    layout === 'layout-two' ? 'border-none' : 'border border-grey-light'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className={`newsletter-submit btn !w-full text-white font-normal medium ${layout} ${
                    (layout === undefined || layout === 'default') ? 'bg-black hover:bg-red' : 'bg-red hover:bg-black'
                  }`}
                  type='submit'
                >
                  Subscribe
                </button>
                {errorMessage && (
                  <p className={`error-message font-sans font-light medium ${layout === 'layout-two' ? 'text-white' : 'text-red'}`}>
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }, [layout, title, subtitle, email, handleSubmit, errorMessage]);

  return <div className='ad-free-zone laptop:px-0'>{renderContent()}</div>;
};

export default NewsletterSignup;

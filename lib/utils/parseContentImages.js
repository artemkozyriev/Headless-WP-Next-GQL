import React from 'react';
import ReactHtmlParser from 'html-react-parser';
import Image from 'next/image';

const parseContentImages = (htmlContent) => {
    const convertImageElement = (imgElement, imageFull) => {
      const src = imgElement.props.src;
      const alt = imgElement.props.alt;

      return React.createElement(Image, {
        src,
        alt,
        width: imageFull ? 1900 : 600,
        height: imageFull ? 1000 : 400,
        priority: false,
        rel: 'preload',
        placeholder: "blur",
				blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk2AUAAMAAvMotNCIAAAAASUVORK5CYII="
      });
    };

    const processNode = (node) => {
      if (React.isValidElement(node)) {
        if (node.type === 'img') {
          return convertImageElement(node, node?.props?.className?.includes('full-width-image'));
        }
  
        const processedChildren = React.Children.map(node.props.children, processNode);
  
        return React.cloneElement(node, {}, processedChildren);
      }
  
      if (Array.isArray(node)) {
        return node.map(processNode);
      }
  
      return node;
    };
  
    const parsedContent = ReactHtmlParser(htmlContent, { transform: processNode });
  
    return parsedContent;
};

export default parseContentImages;
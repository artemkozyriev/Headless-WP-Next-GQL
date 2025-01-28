import React, {lazy} from 'react';
// const DefaultPostHeader = lazy(() => import('./post-header-default'));
// const HalfPostHeader = lazy(() => import('./post-header-50-50'));
// const FullPostHeader = lazy(() => import('./post-header-fullwidth'));
import DefaultPostHeader from './post-header-default';
import HalfPostHeader from './post-header-50-50';
import FullPostHeader from './post-header-fullwidth';

const PostHeader = ({ block, postData, draft }) => {
    const layout = block.attributes?.layout;

    switch (layout) {
        case 'half':
            return <HalfPostHeader block={ block } postData={postData} draft={draft} />;
        case 'full':
            return <FullPostHeader block={ block } postData={postData} draft={draft} />;
        default:
            return <DefaultPostHeader block={ block } postData={postData} draft={draft} />;
    }
};

export default PostHeader;

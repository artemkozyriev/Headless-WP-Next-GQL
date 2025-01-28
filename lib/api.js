// import getConfig from 'next/config';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
// import { BatchHttpLink } from '@apollo/client/link/batch-http';

// const { publicRuntimeConfig } = getConfig();
// const API_URL = publicRuntimeConfig.NEXT_PUBLIC_WP_API_URL;
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;
// const API_URL = 'https://macleans.wpengine.com/graphql';

const client = new ApolloClient({
  ssrMode: true,
	link: createHttpLink({
		uri: API_URL,
		useGETForQueries: true,
    // credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      // 'Access-Control-Allow-Origin': '*'
    },
	}),
	cache: new InMemoryCache(),
	defaultOptions: {
	  query: {
		  fetchPolicy: "network-only", //cache-first network-only
	  },
	},
  // fetchOptions: {
  //   mode: 'no-cors'
  // }
  // connectToDevTools: true,
});

async function fetchAPI(query, { variables } = {}) {
  try {
    const res = await client.query({
      query: gql`${query}`,
      variables
    });

    if (!res || res.errors) {
      console.log(res.errors);
      console.log('error details', query, variables);
      // Handle the error and return a default value or empty object
      return {};
    }

    return res.data;
  } catch (error) {
    console.error('Failed to fetch API', error);
    return {};
  }
}

// export async function getBatch(functions) {
// 	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   const results = [];
//   for (let i = 0; i < functions.length; i++) {
//       results.push(await functions[i]);
//       if (i < functions.length - 1) {
//           await delay(0);
//       }
//   }

//   return results;
// }

export async function getBatch(functions) {
  const results = await Promise.all(functions);
  return results;
}

const featuredImageFragment = `
    altText
    mediaDetails {
      sizes {
        sourceUrl
        name
        width
        height
      }
    }
`;

const buildPostsQuery = `
  edges {
    node {
      featuredImage {
        node {
         ${featuredImageFragment}
       }
      }
      featuredVideoUrl
      categories {
        edges {
          isPrimary
          node {
            slug
            name
            uri
            id
            databaseId
          }
        }
      }
      author {
        node {
          name
          uri
        }
      }
      tags(first: 1) {
        edges {
          node {
            name
            slug
            uri
          }
        }
      }
      title(format: RENDERED)
      slug
      postId
      uri
      excerpt
      blocks
      sponsorPrefix
      sponsorLogo
      sponsorName
      sponsorUrl
      seo {
        canonical
        cornerstone
        focuskw
        fullHead
        metaDesc
        metaKeywords
        metaRobotsNofollow
        opengraphDescription
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        opengraphImage {
          sourceUrl
        }
        readingTime
        title
        twitterDescription
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
  pageInfo {
    endCursor
    hasNextPage
    offsetPagination {
      total
    }
  }
`;

async function fetchPosts(query, { size = 12, offset = 0, variables = {} } = {}) {
  return fetchAPI(
    query,
    {
      variables: { ...variables, size, offset },
    }
  );
}

export async function getAllPosts(size = 12, offset = 0) {
  const data = await fetchPosts(`
    query AllPosts($size: Int, $offset: Int) {
      posts(where: { offsetPagination: { size: $size, offset: $offset } }) {
        ${buildPostsQuery}
      }
    }
  `, { size, offset });

  return data?.posts;
}

export async function getLatestPosts(size = 12, offset = 0) {
  const data = await fetchPosts(`
    query LatestPosts($size: Int, $offset: Int) {
      posts(where: { offsetPagination: { size: $size, offset: $offset }, orderby: {field: DATE, order: DESC} }) {
        ${buildPostsQuery}
      }
    }
  `, { size, offset });

  return data?.posts;
}

export async function getPopularPosts(size = 4, offset = 0) {
  const data = await fetchAPI(
    `
	  query PopularPosts($size: Int, $offset: Int) {
		posts(where: { sticky: true, offsetPagination: { size: $size, offset: $offset } }) {
		  edges {
        node {
          featuredImage {
            node {
             altText
             mediaDetails {
              sizes {
                sourceUrl
                name
                width
                height
              }
             }
           }
          }
          featuredVideoUrl
          categories {
            edges {
              isPrimary
              node {
                name
                slug
                uri
              }
            }
          }
          title(format: RENDERED)
          slug
          uri
        }
		  }
		  pageInfo {
        endCursor
        hasNextPage
        offsetPagination {
          total
        }
		  }
		}
	  }
	  `,
    {
      variables: { size, offset },
    }
  );

  return data?.posts;
}

export async function getMenuItems(location) {
  const data = await fetchAPI(
    `
    query MenuItems($location: MenuLocationEnum) {
      menuItems(where: {location: $location}) {
        nodes {
        id
        label
        url
        target
        }
      }
    }
    `,
    {
      variables: {
        location: location.toUpperCase()
      }
    }
  );

  return data?.menuItems;
}

export async function getAllPostsWithSlug() {
  let allPosts = [];
  let hasNextPage = true;
  let afterCursor = null;
  let i = 0;

  while (hasNextPage && i < 2) {
    const data = await fetchAPI(
      `
      query AllPostsWithSlug($after: String) {
        posts(first: 1, after: $after, where: {orderby: {field: MODIFIED, order: DESC}}) {
          edges {
            node {
              slug
              uri
              categories {
                edges {
                  isPrimary
                  node {
                    slug
                  }
                }
              }
              featuredVideoUrl
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
      {
        variables: { 
          after: afterCursor 
        },
      }
    );

    const posts = data?.posts?.edges?.map((edge) => edge);

    if (posts) {
      allPosts = [...allPosts, ...posts];
      hasNextPage = data?.posts.pageInfo.hasNextPage;
      afterCursor = data?.posts.pageInfo.endCursor;
    }
    i++;
  }

  return allPosts;
}

export async function getAllPostsSitemap() {
  let allPosts = [];
  let hasNextPage = true;
  let afterCursor = null;
  let i = 0;

  while (hasNextPage && i < 2) {
    const data = await fetchAPI(
      `
      query AllPostsWithSlug($after: String) {
        posts(first: 1, after: $after, where: {orderby: {field: MODIFIED, order: DESC}}) {
          edges {
            node {
              slug
              uri
              modified
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
      {
        variables: { 
          after: afterCursor 
        },
      }
    );

    const posts = data?.posts?.edges?.map((edge) => edge);

    if (posts) {
      allPosts = [...allPosts, ...posts];
      hasNextPage = data?.posts.pageInfo.hasNextPage;
      afterCursor = data?.posts.pageInfo.endCursor;
    }
    i++;
  }

  return allPosts;
}

export async function getMediaItem(id) {
  const data = await fetchAPI(
    `query MediaItem($id: ID!, $idType: MediaItemIdType) {
      mediaItem(id: $id, idType: $idType) {
        mediaDetails {
          sizes {
            name
            sourceUrl
            width
            height
          }
        }
        caption(format: RENDERED)
        altText
        description
        sourceUrl
      }
    }`,
    {
      variables: {
        id: id,
        idType: 'DATABASE_ID'
      }
    }
  )

  return data.mediaItem;
}

export async function getPost(slug) {
  if (slug) {
    const data = await fetchAPI(
      `
      query PostBySlug($id: ID!, $idType: PostIdType) {
        post(id: $id, idType: $idType) {
          title
          longformHeroImage
          excerpt
          slug
          date
          modified
          id
          postId
          guid
          uri
          sponsorPrefix
          sponsorLogo
          sponsorName
          sponsorUrl
          authorDisplayText
          tags {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
              uri
              seo {
                title
              }
              posts(first: 2) {
                nodes {
                  uri
                }
              }
            }
          }
          categories {
            edges {
              isPrimary
              node {
                name
                uri
                slug
              }
            }
          }
          featuredImage {
            node {
              mediaDetails {
                sizes(exclude: [_1536X1536, _2048X2048, THUMBNAIL]) {
                  sourceUrl
                  name
                }
              }
              altText
              sourceUrl(size: MEDIUM)
              description
              caption
            }
          }
          featuredVideoUrl
          template {
            templateName
          }
          blocks(attributes: true, htmlContent: true)
          content
          seo {
            canonical
            cornerstone
            focuskw
            fullHead
            metaDesc
            metaKeywords
            metaRobotsNofollow
            opengraphDescription
            opengraphTitle
            opengraphType
            opengraphUrl
            opengraphImage {
              sourceUrl
            }
            readingTime
            title
            twitterDescription
            twitterTitle
            schema {
              raw
            }
          }
        }
      }
    `,
      {
        variables: {
          id: slug,
          idType: 'SLUG'
        }
      }
    );
  
    return data;
  }
}

export async function getPostById(id) {
  if (id) {
    const data = await fetchAPI(
      `
      query PostById($id: ID!, $idType: PostIdType) {
        post(id: $id, idType: $idType) {
          title
          longformHeroImage
          excerpt
          slug
          date
          modified
          id
          postId
          guid
          uri
          sponsorPrefix
          sponsorLogo
          sponsorName
          sponsorUrl
          authorDisplayText
          tags {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
              uri
              seo {
                title
              }
              posts(first: 2) {
                nodes {
                  uri
                }
              }
            }
          }
          categories(first: 1) {
            nodes {
              name
              uri
            }
          }
          featuredImage {
            node {
              mediaDetails {
                sizes(exclude: [_1536X1536, _2048X2048, THUMBNAIL]) {
                  sourceUrl
                  name
                }
              }
              altText
              sourceUrl(size: MEDIUM)
              description
              caption
            }
          }
          featuredVideoUrl
          template {
            templateName
          }
          blocks(attributes: true, htmlContent: true)
          content
          seo {
            canonical
            cornerstone
            focuskw
            fullHead
            metaDesc
            metaKeywords
            metaRobotsNofollow
            opengraphDescription
            opengraphTitle
            opengraphType
            opengraphUrl
            opengraphImage {
              sourceUrl
            }
            readingTime
            title
            twitterDescription
            twitterTitle
            schema {
              raw
            }
          }
        }
      }
    `,
      {
        variables: {
          id: id,
          idType: 'DATABASE_ID'
        }
      }
    );
  
    return data;
  }
}

export async function getPostBlocks(slug) {
  if (slug) {
    const data = await fetchAPI(
      `
      query PostBySlug($id: ID!, $idType: PostIdType) {
        post(id: $id, idType: $idType) {
          blocks(attributes: true, htmlContent: true)
        }
      }
    `,
      {
        variables: {
          id: slug,
          idType: 'SLUG'
        }
      }
    );
  
    return data;
  }
}

export async function getPageBySlug(uri) {
  const data = await fetchAPI(
    `query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        uri
        slug,
        blocks(attributes: true, htmlContent: true)
        content
        title
        preview {
          node {
            blocks
          }
        }
        seo {
          fullHead
          canonical
          cornerstone
          focuskw
          metaDesc
          metaKeywords
          metaRobotsNofollow
          opengraphDescription
          opengraphTitle
          opengraphType
          opengraphUrl
          opengraphImage {
            sourceUrl
          }
          readingTime
          title
          twitterDescription
          twitterTitle
          schema {
            raw
          }
        }
      }
    }`,
    {
      variables: {
        id: uri,
        idType: 'URI'
      }
    }
  );

  return data;
}

export async function getPageByName(uri) {
  const data = await fetchAPI(
    `query PageByName($id: String) {
      pages(where: {name: $id}) {
        nodes {
          uri
          slug,
          blocks(attributes: true, htmlContent: true)
          content
          title
          preview {
            node {
              blocks
            }
          }
          seo {
            fullHead
            canonical
            cornerstone
            focuskw
            metaDesc
            metaKeywords
            metaRobotsNofollow
            opengraphDescription
            opengraphTitle
            opengraphType
            opengraphUrl
            opengraphImage {
              sourceUrl
            }
            readingTime
            title
            twitterDescription
            twitterTitle
            schema {
              raw
            }
          }
        }
      }
    }`,
    {
      variables: {
        id: uri,
      }
    }
  );

  return data;
}

export async function getHomePageFromSettings(){
  const data = await fetchAPI(
    `query GetHomePage {
      allSettings {
        readingSettingsPageOnFront
        readingSettingsShowOnFront
      }
    }`
  );

  return data;
}

export async function getPageById(id) {
  const data = await fetchAPI(
    `query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        uri
        slug,
        blocks(attributes: true, htmlContent: true)
        title
        preview {
          node {
            blocks
          }
        }
        seo {
          fullHead
          canonical
          cornerstone
          focuskw
          metaDesc
          metaKeywords
          metaRobotsNofollow
          opengraphDescription
          opengraphTitle
          opengraphType
          opengraphUrl
          opengraphImage {
            sourceUrl
          }
          readingTime
          title
          twitterDescription
          twitterTitle
          schema {
            raw
          }
        }
      }
    }`,
    {
      variables: {
        id: id,
        idType: 'DATABASE_ID'
      }
    }
  );

  return data;
}

export async function getAllPages(page, perPage) {
  let allPages = [];
  let hasNextPage = true;
  let afterCursor = null;
  let i = 0;

  while (hasNextPage && i < 2) {
    const data = await fetchAPI(
      `query AllPages($after: String) {
        pages(first: 1, after: $after) {
          edges {
            node {
              title
              slug
              uri
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }`,
      {
        variables: { 
          after: afterCursor 
        },
      }
    );
    
    const pages = data?.pages?.edges?.map((edge) => edge);
    if (pages) {
      allPages = [...allPages, ...pages];
      hasNextPage = data.pages.pageInfo.hasNextPage;
      afterCursor = data.pages.pageInfo.endCursor;
    }
    i++;
  }

  return allPages;
}

export async function updatePostViews(id) {
  const data = await fetchAPI(
    `
    mutation UpdatePostViews($postId: ID!) {
      updatePostViews(input: { postId: $postId }) {
        post {
          postId
          postViews {
            totalViews
            viewsLast1h
            viewsLast24h
          }
        }
      }
    }
    `
  );

  return data;
}

export async function getCategories() {
  let allCategories = [];
  let hasNextPage = true;
  let afterCursor = '';
  let i = 0;

  while (hasNextPage && i<2) {
    const data = await fetchAPI(
      `query AllCategories($after: String = "") {
        categories(first: 1, after: $after) {
          edges {
            isPrimary
            node {
              slug
              uri
              id
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }`,
      {
        variables: { 
          after: afterCursor 
        },
      }
    );

    const categories = data?.categories?.edges?.map((edge) => edge);

    if (categories) {
      allCategories = [...allCategories, ...categories];
      hasNextPage = data.categories.pageInfo.hasNextPage;
      afterCursor = data.categories.pageInfo.endCursor;
    }
    i++;
  }

  return allCategories;
}

export async function getCategoryBySlug(uri) {
  const data = await fetchAPI(
    `query CategoryBySlug($id: ID!, $idType: CategoryIdType!) {
      category(id: $id, idType: $idType) {
        uri
        slug
        description
        name
        seo {
          title
          fullHead
          breadcrumbs {
            text
            url
          }
        }
        posts(first: 12) {
          edges {
            node {
              featuredImage {
                node {
                  altText
                  mediaDetails {
                    sizes {
                      sourceUrl
                      name
                      width
                      height
                    }
                  }
                }
              }
              featuredVideoUrl
              categories(first: 1) {
                edges {
                  node {
                    name
                    uri
                  }
                }
              }
              excerpt
              title(format: RENDERED)
              slug
              uri
              postId
              sponsorPrefix
              sponsorLogo
              sponsorName
              sponsorUrl
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            offsetPagination {
              total
            }
          }
        }
      }
    }`,
    {
      variables: {
        id: uri,
        idType: 'URI'
      }
    }
  );

  return data;
}

export async function getAllPostsByCategory(size = 12, offset = 0, categoryName = "") {
  const data = await fetchPosts(`
    query AllPosts($size: Int!, $offset: Int!, $categoryName: String!) {
      posts(where: { offsetPagination: { size: $size, offset: $offset }, categoryName: $categoryName }) {
        edges {
          node {
            featuredImage {
              node {
                altText
                mediaDetails {
                  sizes {
                    sourceUrl
                    name
                    width
                    height
                  }
                }
              }
            }
            featuredVideoUrl
            categories {
              edges {
                isPrimary
                node {
                  name
                  uri
                }
              }
            }
            blocks
            excerpt
            title(format: RENDERED)
            slug
            uri
            postId
            sponsorPrefix
            sponsorLogo
            sponsorName
            sponsorUrl
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          offsetPagination {
          total
          }
        }
      }
    }
    `, 
    {
      size: size, 
      offset: offset, 
      // categoryName: categoryName
      variables: {
        // size: size, 
        // offset: offset, 
        categoryName: categoryName
      }
    }
  );
  
  return data?.posts;
}

export async function getAllPostsByCategories(size = 12, offset, categoryId) {
	const data = await fetchPosts(`
	  query AllPostsByCategories($size: Int = 12, $offset: Int = 0, $categoryId: Int = 0) {
      posts(where: { offsetPagination: { size: $size, offset: $offset }, categoryId: $categoryId }) {
        ${buildPostsQuery}
      }
	  }
	`, 
  { 
    size: size, 
    offset: offset, 
    // categoryId: categoryId 
    variables: {
      // size: size, 
      // offset: offset, 
      categoryId: categoryId
    }
  }
  );
  
	return data?.posts;
}


export async function getAllPostsByTag(size = 12, offset = 0, tagName = null) {
  const data = await fetchAPI(
    `
    query AllPosts($size: Int, $offset: Int, $tagName: String) {
      posts(where: { offsetPagination: { size: $size, offset: $offset }, tag: $tagName }) {
        edges {
          node {
            featuredImage {
              node {
                altText
                mediaDetails {
                  sizes {
                  sourceUrl
                  name
                  width
                  height
                  }
                }
              }
            }
            featuredVideoUrl
            categories {
              edges {
                isPrimary
                node {
                  name
                  uri
                  slug
                }
              }
            }
            blocks
            excerpt
            title(format: RENDERED)
            slug
            uri
            postId
            sponsorPrefix
            sponsorLogo
            sponsorName
            sponsorUrl
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          offsetPagination {
          total
          }
        }
      }
    }
    `,
    {
      variables: { 
        size: size, 
        offset: offset, 
        tagName: tagName 
      },
    }
  );

  return data?.posts;
}

export async function getAllPostsByTags(size = 12, offset = 0, tags = []) {
	const data = await fetchAPI(`
      query AllPostsByTags($size: Int, $offset: Int, $tags: [ID] = []) {
        posts(where: { offsetPagination: { size: $size, offset: $offset }, tagIn: $tags }) {
          ${buildPostsQuery}
        }
      }
    `, 
    { 
      variables: { 
        size: size, 
        offset: offset, 
        tags: tags 
      } 
    }
  );
  
	return data?.posts;
}

export async function getTags() {
  const data = await fetchAPI(
    `query AllTags {
      tags(first: 100) {
        edges {
          node {
            slug
          }
        }
      }
    }
    `
  );

  return data.tags;
}

export async function getTagBySlug(slug) {
  const data = await fetchAPI(
    `query TagBySlug($id: ID!, $idType: TagIdType!) {
      tag(id: $id, idType: $idType) {
        uri
        slug
        description
        name
        seo {
          fullHead
          title
          metaDesc
          opengraphTitle
          opengraphType
          opengraphUrl
          canonical
          focuskw
          opengraphImage {
            sourceUrl
          }
          twitterDescription
          twitterTitle
          schema {
            raw
          }
        }
        posts(first: 12) {
          edges {
            node {
              featuredImage {
                node {
                  altText
                  mediaDetails {
                    sizes {
                      sourceUrl
                      name
                      width
                      height
                    }
                  }
                }
              }
              featuredVideoUrl
              categories(first: 1) {
                edges {
                  node {
                    name
                    uri
                  }
                }
              }
              excerpt
              title(format: RENDERED)
              slug
              uri
              postId
              sponsorPrefix
              sponsorLogo
              sponsorName
              sponsorUrl
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            offsetPagination {
              total
            }
          }
        }
      }
    }`,
    {
      variables: {
        id: slug,
        idType: 'SLUG'
      }
    }
  );

  return data;
}

export async function getAllDrafts() {
	const data = await fetchAPI(
	  `
		query Drafts {
		  posts( where: { hasPassword: false } ) {
			nodes {
			  databaseId
			}
		  }
		}
	  `
	)
  
	return data?.posts;
}

export async function getDraft(id) {
	const data = await fetchAPI(
	  `
		query Drafts( $id: Int ) {
		  posts( where: { hasPassword: false, id: $id } ) {
			nodes {
				title
				excerpt
				slug
				date
				id
				postId
				guid
				uri
				authorDisplayText
				tags {
				  nodes {
					name
					slug
				  }
				}
				author {
				  node {
					name
					uri
					posts {
					  nodes {
						uri
					  }
					}
				  }
				}
				categories {
				  edges {
            isPrimary
            node {
              name
              uri
            }
          }
				}
				featuredImage {
				  node {
					altText
					sourceUrl(size: MEDIUM)
					description
					caption
				  }
				}
				featuredVideoUrl
				template {
				  templateName
				}
				blocks(attributes: true, htmlContent: true)
				content
				seo {
				  canonical
				  cornerstone
				  focuskw
				  fullHead
				  metaDesc
				  metaKeywords
				  metaRobotsNofollow
				  opengraphDescription
				  opengraphTitle
				  opengraphType
				  opengraphUrl
				  opengraphImage {
					sourceUrl
				  }
				  readingTime
				  title
				  twitterDescription
				  twitterTitle
				  schema {
					raw
				  }
				}
			}
		  }
		}
	  `, {
		variables: {
			id: parseInt(id)
		}
	  }
	)

	return data?.posts.nodes[0];
}

export async function getAllAuthors() {
  const data = await fetchAPI(
    `
      query Authors {
      users {
        nodes {
          slug
          id
        }
      }
      }
    `
  )

  return data?.users;
}

export async function getAuthorBySlug(slug) {
  const data = await fetchAPI(
    `
    query AuthorBySlug($id: ID!, $idType: UserNodeIdTypeEnum) {
      user(id: $id, idType: $idType) {
        avatar {
          url
        }
        seo {
          social {
            facebook
            instagram
            linkedIn
            twitter
            wikipedia
            tiktok
          }
          title
          opengraphTitle
          opengraphDescription
          twitterDescription
          twitterTitle
          canonical
        }
        lastName
        firstName
        nickname
        description
        url
        slug
        posts(first: 12) {
          edges {
            node {
              featuredImage {
                node {
                  altText
                  mediaDetails {
                    sizes {
                      sourceUrl
                      name
                      width
                      height
                    }
                  }
                }
              }
              featuredVideoUrl
              categories {
                edges {
                  isPrimary
                  node {
                    name
                    uri
                  }
                }
              }
              excerpt
              title(format: RENDERED)
              slug
              uri
              postId
              sponsorPrefix
              sponsorLogo
              sponsorName
              sponsorUrl
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            offsetPagination {
              total
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: 'SLUG'
      }
    }
  )

  return data?.user;
}

export async function getAuthorById(id) {
  const data = await fetchAPI(
    `
    query AuthorBySlug($id: ID!, $idType: UserNodeIdTypeEnum) {
      user(id: $id, idType: $idType) {
        avatar {
          url
        }
        seo {
          social {
            facebook
            instagram
            linkedIn
            twitter
            wikipedia
            tiktok
          }
          title
          opengraphTitle
          opengraphDescription
          twitterDescription
          twitterTitle
          canonical
        }
        lastName
        firstName
        nickname
        description
        url
        slug
        name
        posts(first: 12) {
          edges {
            node {
              featuredImage {
                node {
                  altText
                  mediaDetails {
                    sizes {
                      sourceUrl
                      name
                      width
                      height
                    }
                  }
                }
              }
              featuredVideoUrl
              categories {
                edges {
                  isPrimary
                  node {
                    name
                    uri
                  }
                }
              }
              excerpt
              title(format: RENDERED)
              slug
              uri
              postId
              sponsorPrefix
              sponsorLogo
              sponsorName
              sponsorUrl
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            offsetPagination {
              total
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: id,
        idType: 'DATABASE_ID'
      }
    }
  )

  return data?.user;
}

export async function getPostsByAuthor(size = 12, offset = 0, slug = null) {
  const data = await fetchAPI(
    `
		query PostsByAuthor($size: Int, $offset: Int, $slug: String) {
		  posts(where: { offsetPagination: { size: $size, offset: $offset }, authorName: $slug }) {
        edges {
          node {
            featuredImage {
              node {
                altText
                mediaDetails {
                  sizes {
                  sourceUrl
                  name
                  width
                  height
                  }
                }
              }
            }
            featuredVideoUrl
            categories {
              edges {
                isPrimary
                node {
                  name
                  uri
                }
              }
            }
            blocks
            excerpt
            title(format: RENDERED)
            slug
            uri
            sponsorPrefix
            sponsorLogo
            sponsorName
            sponsorUrl
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          offsetPagination {
          total
          }
        }
		  }
		}
		`,
    {
      variables: { size: size, offset: offset, slug: slug },
    }
  );

  return data?.posts;
}

export async function getMainMenu() {
  const data = await fetchAPI(
    `query MainMenu {
        menu(id: "desktop-menu", idType: SLUG) {
          slug
          name
          menuItems {
            nodes {
              title
              target
              uri
              url
              label
            }
          }
        }
      }
      `
  );

  return data.menu;
}

export async function getMenuBlock() {
  const data = await fetchAPI(
    `query MenuBlock {
        customHeaderOptions {
          custom_header_button_text
          custom_header_image
          custom_header_subtitle
          custom_header_title
          custom_header_button_link
        }
      }
      `
  );

  return data;
}

export async function getCategoryById(id) {
  const data = await fetchAPI(
  `query CategoryById($id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
      slug
      name
      uri
      id
      databaseId
      posts(first: 7) {
        edges {
          node {
            featuredImage {
              node {
                altText
                mediaDetails {
                  sizes {
                    sourceUrl
                    name
                    width
                    height
                  }
                }
              }
            }
            featuredVideoUrl
            categories {
              edges {
                isPrimary
                node {
                  name
                  uri
                }
              }
            }
            excerpt
            title(format: RENDERED)
            slug
            uri
            postId
            sponsorPrefix
            sponsorLogo
            sponsorName
            sponsorUrl
            author {
              node {
                name
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          offsetPagination {
            total
          }
        }
      }
    }
  }`,
  {
    variables: {
      id: id,
    }
  }
  );

  return data;
}

export async function getTagById(id) {
  const data = await fetchAPI(
    `query TagById($id: ID!) {
      tag(id: $id, idType: DATABASE_ID) {
        slug
        databaseId
        posts(first: 7) {
          edges {
            node {
              featuredImage {
                node {
                  altText
                  mediaDetails {
                    sizes {
                      sourceUrl
                      name
                      width
                      height
                    }
                  }
                }
              }
              featuredVideoUrl
              categories {
                edges {
                  isPrimary
                  node {
                    slug
                    name
                    uri
                  }
                }
              }
              excerpt
              title(format: RENDERED)
              slug
              uri
              postId
              sponsorPrefix
              sponsorLogo
              sponsorName
              sponsorUrl
              author {
                node {
                  name
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            offsetPagination {
              total
            }
          }
        }
      }
    }`,
    {
      variables: {
        id: id,
      }
    }
  );

  return data;
}

export async function getRedirections() {
  const data = await fetchAPI(
    `query Redirections {
        redirection {
          redirects {
            target
            origin
            type
            matchType
            groupName
            groupId
            code
          }
        }
      }
      `
  );

  return data.redirection;
}
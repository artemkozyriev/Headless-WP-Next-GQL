import { getAllPostsSitemap } from "../lib/api";

function generateSiteMap(posts) {
    const chunks = [];
    const chunkSize = 5000;

    for (let i = 0; i < posts.length; i += chunkSize) {
        chunks.push(posts.slice(i, i + chunkSize));
    }

    const sitemaps = chunks.map((chunk, index) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
                <!-- Add the static URLs manually -->
                ${chunk
                    .map(({ node }) => {
                        return `
                            <url>
                                <loc>${node.uri}</loc>
                                <lastmod>${node.modified}</lastmod>
                            </url>
                        `;
                    })
                    .join("")}
            </urlset>
        `;
    });

    return sitemaps;
}

export async function getServerSideProps({ res }) {
    const posts = await getAllPostsSitemap();

    const sitemaps = generateSiteMap(posts);
    
    sitemaps.forEach((sitemap, index) => {
        res.setHeader("Content-Type", "text/xml");
        res.write(sitemap);
        res.write("\n\n");
    });
    
    res.end();
   
    return {
      props: {},
    };
}

export default function SiteMap() {}
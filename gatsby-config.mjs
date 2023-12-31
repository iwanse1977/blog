/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  siteMetadata: {
    title: `jpatrickfulton.dev`,
    author: `J. Patrick Fulton`,
    description: `A personal blog on occasionally useful technical topics.`,
    image: `/icon.png`,
    siteUrl: `https://www.jpatrickfulton.dev/`,
    social: {
      twitter: `jpatrickfulton`,
      github: `jpfulton`,
      linkedin: `jpatrickfulton`,
    },
    ads: {
      msPubCenter: {
        siteId: `10321170`,
        publisherId: `252759103`,
      },
    },
  },
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-plugin-sass",
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
              pageContext
            }
          }
        }
        `,
        serialize: ({ path, pageContext }) => {
          return {
            url: path,
            lastmod: pageContext?.lastMod,
          };
        },
      },
    },
    `gatsby-plugin-git-lastmod`,
    `gatsby-plugin-root-import`,
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "blog",
        engine: "flexsearch",
        engineOptions: {
          encode: "icase",
          tokenize: "forward",
          async: false,
        },
        query: `
          query LocalSearch {
            openGraphDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
              childImageSharp {
                gatsbyImageData(layout: FIXED, height: 580, width: 1200)
              }
            }
            allMdx(sort: { frontmatter: { date: ASC } }) {
              nodes {
                id
                fields { 
                  slug
                  timeToRead {
                    text
                    words
                  } 
                }
                excerpt
                body
                frontmatter {
                  title
                  description
                  date(formatString: "MMMM DD, YYYY")
                  keywords
                  openGraphImage {
                    childImageSharp {
                      gatsbyImageData(layout: FIXED, width: 150)
                    }
                  }
                  primaryImage {
                    childImageSharp {
                      gatsbyImageData(layout: FIXED, width: 150)
                    }
                  }
                }
              }
            }
          }
        `,
        ref: "id",
        index: ["title", "body", "keywords"],
        store: [
          "id",
          "slug",
          "date",
          "title",
          "excerpt",
          "description",
          "timeToReadText",
          "timeToReadWords",
          "keywords",
          "image",
        ],
        normalizer: ({ data }) =>
          data.allMdx.nodes.map((node) => ({
            id: node.id,
            slug: node.fields.slug,
            body: node.body,
            excerpt: node.excerpt,
            title: node.frontmatter.title,
            description: node.frontmatter.description,
            date: node.frontmatter.date,
            timeToReadText: node.fields.timeToRead.text,
            timeToReadWords: node.fields.timeToRead.words,
            keywords: node.frontmatter.keywords,
            image:
              node.frontmatter.primaryImage?.childImageSharp.gatsbyImageData ||
              node.frontmatter.openGraphImage?.childImageSharp
                .gatsbyImageData ||
              data.openGraphDefaultImage.childImageSharp.gatsbyImageData,
          })),
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 896,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
          },
          {
            resolve: `@jpfulton/gatsby-remark-copy-button`,
            options: {
              // Provide a text label for the copy button.
              // Default: null
              buttonText: null,
              // Provide a complete SVG tag string to replace the default
              // copy icon.
              copySvg: null,
              // Provide a complete SVG tag string to replace the default
              // success icon.
              successSvg: null,
              // Provide a custom container class for the <div> tag that contains
              // the copy button to apply custom styling.
              // Default: "gatsby-remark-copy-button-container"
              customButtonContainerClass: null,
              // Provide a custom button class for the copy button to apply
              // custom styling.
              // Default: "gatsby-remark-copy-button"
              customButtonClass: null,
            },
          },
          {
            resolve: `gatsby-remark-code-titles`,
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              prompt: {
                user: "jpfulton",
                host: "localhost",
                global: true,
              },
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: `gatsby-remark-smartypants`,
          },
        ],
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkToc],
          rehypePlugins: [
            [
              rehypeExternalLinks,
              { target: `_blank`, rel: [`nofollow`, `noopener`] },
            ],
          ],
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `J. Patrick Fulton - Blog`,
        short_name: `JPF.dev Blog`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `static/icon.png`, // This path is relative to the root of the site.
        icon_options: {
          purpose: `any maskable`,
        },
        cache_busting_mode: "none",
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-LMTS3H55FP", // Google Analytics / GA
          //"AW-CONVERSION_ID", // Google Ads / Adwords / AW
          //"DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          //optimize_id: "OPT_CONTAINER_ID",
          //anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          // exclude: ["/preview/**", "/do-not-track/me/too/"],
          // Defaults to https://www.googletagmanager.com
          // origin: "YOUR_SELF_HOSTED_ORIGIN",
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
    {
      resolve: `gatsby-plugin-clarity`,
      options: {
        // String value for your clarity project ID
        clarity_project_id: "ing53a9v5i",
        // Boolean value for enabling clarity while developing
        // true will enable clarity tracking code on both development and production environments
        // false will enable clarity tracking code on production environment only
        enable_on_dev_env: false,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-remove-serviceworker`,
  ],
};

export default config;

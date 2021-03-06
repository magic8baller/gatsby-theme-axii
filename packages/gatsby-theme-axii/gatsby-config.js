const path = require("path");
const queries = require("./src/utils/algolia");

module.exports = (options) => {
  const { siteMetadata } = options;

  const layout = {
    resolve: `gatsby-plugin-layout`,
    options: {
      component: require.resolve(`./src/layout/index.tsx`),
    },
  };

  const manifest = {
    resolve: `gatsby-plugin-manifest`,
    options: {
      background_color: `#ffffff`,
      display: `standalone`,
      icon: `content/images/icon.png`,
      name: siteMetadata.manifest.name,
      short_name: siteMetadata.manifest.short_name,
      start_url: `/`,
      theme_color: `#000000`,
    },
  };

  const algolia = {
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: siteMetadata.search.algolia.posts.applicationId,
      apiKey: siteMetadata.search.algolia.posts.adminApiKey,
      indexName: siteMetadata.search.algolia.posts.indexName,
      queries,
      chunkSize: 10000, // default: 1000
      enablePartialUpdates: true,
    },
  };

  const mdx = {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`, `.md`],
      defaultLayouts: {
        default: require.resolve("./src/templates/page/index.tsx"),
      },
      gatsbyRemarkPlugins: [
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-embedder`,
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 960,
            quality: 80,
            linkImagesToOriginal: true,
            withWebp: true,
            showCaptions: false,
            backgroundColor: "transparent",
          },
        },
        {
          resolve: "gatsby-remark-external-links",
          options: {
            target: "_blank",
            rel: "noreferrer",
          },
        },
      ],
    },
  };

  const seo = {
    resolve: "gatsby-plugin-next-seo",
    options: {
      title: siteMetadata.author.name,
      titleTemplate: `%s | ${siteMetadata.author.name}`,
      language: "en",
      description: siteMetadata.siteDescription,
      canonical: siteMetadata.siteUrl,
      openGraph: {
        type: "website",
        locale: "en_US",
        url: siteMetadata.siteUrl,
        images: [
          {
            url: `${siteMetadata.siteUrl}/og-default.png`,
            width: 1200,
            height: 630,
          },
        ],
        profile: {
          firstName: siteMetadata.author.firstName,
          lastName: siteMetadata.author.lastName,
          username: siteMetadata.author.nickname,
          gender: siteMetadata.author.gender,
        },
      },
      twitter: {
        handle: siteMetadata.social.twitter.handle,
        site: siteMetadata.social.twitter.handle,
        cardType: "summary_large_image",
      },
    },
  };

  const rss = {
    resolve: `gatsby-plugin-feed`,
    options: {
      query: `{
        site {
          siteMetadata {
            description: siteDescription
            siteUrl
            site_url: siteUrl
          }
        }
      }`,
      setup: ({
        query: {
          site: { siteMetadata },
        },
        ...rest
      }) => {
        const siteMetadataModified = siteMetadata;
        siteMetadataModified.feed_url = `${siteMetadata.siteUrl}/rss/index.xml`;
        siteMetadataModified.image_url = `${siteMetadata.siteUrl}/icons/icon-144x144.png`;
        return {
          ...siteMetadataModified,
          ...rest,
        };
      },
      feeds: siteMetadata.feeds.map((feedConfig) => {
        return {
          serialize: ({ query: { site, allArticle } }) => {
            return allArticle.edges.map((edge) => {
              return {
                ...edge.node,
                description: edge.node.excerpt,
                url: site.siteMetadata.siteUrl + edge.node.slug,
                guid: site.siteMetadata.siteUrl + edge.node.slug,
              };
            });
          },
          ...feedConfig,
        };
      }),
    },
  };

  const sitemap = {
    resolve: `gatsby-plugin-advanced-sitemap`,
    options: {
      query: `
        {
          allArticle {
            edges {
              node {
                id
                updated_at: date
                slug
              }
            }
          }
        }`,
      mapping: {
        allArticle: {
          sitemap: `posts`,
        },
      },
      exclude: [
        `/dev-404-page`,
        `/404`,
        `/404.html`,
        `/offline-plugin-app-shell-fallback`,
      ],
      createLinkInHead: true,
      addUncaughtPages: true,
    },
  };

  const sentry = {
    resolve: "gatsby-plugin-sentry",
    options: {
      dsn: siteMetadata.errorReporting.sentry.dsn,
      environment: process.env.NODE_ENV,
      enabled: () => process.env.NODE_ENV === "production",
    },
  };

  const gitinfo = {
    resolve: `gatsby-transformer-gitinfo`,
    options: {
      include: /\.mdx$/i,
    },
  };

  return {
    siteMetadata,
    plugins: [
      `gatsby-image`,
      layout, // it has to be before gatsby-plugin-material-ui
      `gatsby-plugin-material-ui`,
      `gatsby-plugin-remove-trailing-slashes`,
      `gatsby-plugin-twitter`,
      `gatsby-plugin-typescript`,
      `gatsby-plugin-robots-txt`,
      `gatsby-plugin-sharp`,
      `gatsby-remark-copy-linked-files`,
      `gatsby-remark-images`,
      `gatsby-transformer-sharp`,
      gitinfo,
      seo,
      sitemap,
      manifest,
      algolia,
      rss,
      mdx,
      sentry,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `posts`,
          path: `content/posts`,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `images`,
          path: `content/images`,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `images`,
          path: `content/pages/images`,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `images`,
          path: path.resolve(__dirname, `content/pages/images`),
        },
      },
      {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          name: `pages`,
          path: `content/pages`,
        },
      },
      {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          name: `pages`,
          path: path.resolve(__dirname, `content/pages`),
        },
      },
    ],
  };
};

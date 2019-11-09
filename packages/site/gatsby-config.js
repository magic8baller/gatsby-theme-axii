const siteMetadata = {
  siteUrl: `https://gatsby-theme-axii.netlify.com`,
  siteTitle: `AXII - A Gatsby theme`,
  siteDescription: `Very simple blog theme.`,
  author: {
    nickname: `eshlox`,
    name: `Przemysław Kołodziejczyk`,
    email: `eshlox@vertolabs.com`
  },
  social: {
    twitter: {
      username: "eshlox",
      url: "https://twitter.com/eshlox"
    },
    github: {
      url: "https://github.com/eshlox/gatsby-theme-axii"
    },
    linkedin: {
      url: "https://linkedin.com/eshlox"
    },
    telegram: {
      url: "https://telegram.me/eshlox"
    }
  },
  support: {
    buymeacoffee: {
      url: "https://www.buymeacoffee.com/eshlox"
    }
  },
  comments: {
    disqus: {
      shortname: "axii-a-gatsby-theme"
    }
  },
  search: {
    algolia: {
      posts: {
        applicationId: process.env.ALGOLIA_APPLICATION_ID,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY
      }
    }
  }
};

const plugins = [
  {
    resolve: "@eshlox/gatsby-theme-axii",
    options: {
      contentPosts: "content/posts"
    }
  }
];

module.exports = {
  plugins,
  siteMetadata
};
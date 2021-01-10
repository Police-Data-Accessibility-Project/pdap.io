/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `Police Data Accessibility Project`,
    siteUrl: `https://www.policedap.org/`,
    description: `We gather data, then educate citizens and empower the public. PDAP aggregates and consolidates open-source, law-enforcement activity data into digestible records.`,
  },
  pathPrefix: "/Police-Data-Accessibility-Project.github.io",
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: "gatsby-plugin-html-attributes",
      options: {
        lang: "en",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 2048,
            },
          },
          `gatsby-remark-line-breaks`,
        ],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Police Data Accessibility Project`,
        short_name: `PDAP`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `standalone`,
        icon: `content/assets/img/pdap_logo_final.png`,
      },
    },
    `gatsby-plugin-transition-link`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-playground`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-smoothscroll`,
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/volunteer`, `/faq`],
      },
    },
  ],
}

/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `Police Data Accessibility Project`,
    siteUrl: `https://pdap.io`,
    description: `We're building a source of truth for police data.`,
    pages: [
      {
        title: "Home",
        path: "/",
      },
      {
        title: "FAQ",
        path: "/faq",
      },
      {
        title: "Docs",
        path: "https://docs.pdap.io"
      },
      {
        title: "Blog",
        path: "http://blog.pdap.io/"
      },
    ],
  },
  pathPrefix: "/Police-Data-Accessibility-Project.github.io",
  plugins: [
    {
      resolve: "gatsby-plugin-html-attributes",
      options: {
        lang: "en",
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
        icon: `src/assets/img/pdap_logo_final.png`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-transition-link`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-playground`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-smoothscroll`,
  ],
}

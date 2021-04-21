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
    pages: [
      {
        title: "Learn",
        path: "/",
      },
      {
        title: "Volunteer",
        path: "/volunteer",
      },
      {
        title: "FAQ",
        path: "/faq",
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

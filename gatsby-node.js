exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const page = require.resolve(`./src/templates/pageTemplate.js`)

  const templates = {
    page,
  }

  // get pages and blog posts
  const result = await graphql(`
    {
      pages: allMarkdownRemark(
        sort: { order: ASC, fields: [frontmatter___order] }
        limit: 1000
        filter: { frontmatter: { type: { eq: "page" } } }
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
              template
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // page array for nav
  const pages = result.data.pages.edges.map(({ node }) => {
    return { path: node.frontmatter.slug, title: node.frontmatter.title }
  })

  // build pages
  result.data.pages.edges.forEach(({ node }) => {
    const { slug, template } = node.frontmatter
    createPage({
      path: slug,
      component: templates[template],
      context: {
        slug: slug,
        pages,
      },
    })
  })
}

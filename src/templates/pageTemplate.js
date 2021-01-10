import React from "react"
import { graphql } from "gatsby"

// CSS
import homeStyles from "../css/home.module.css"

// COMPONENTS
import Hero from "../components/Hero"
import Layout from "../components/Layout"
import PageSection from "../components/PageSection"

export default function Template(props) {
  const {
    pageContext: { pages },
  } = props
  const { markdownRemark } = props.data
  const { frontmatter } = markdownRemark
  const { hero, sections, slug } = frontmatter
  return (
    <Layout pages={pages}>
      {hero && <Hero hero={hero} />}
      <div
        className={
          hero
            ? homeStyles.content
            : `${homeStyles.content} ${homeStyles.content__no__hero}`
        }
      >
        {sections &&
          sections.map((section, i) => {
            return (
              <PageSection
                key={`${slug} section ${i}`}
                index={i}
                page={slug}
                section={section}
              />
            )
          })}
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        sections {
          title
          layout
          anchor
          columns
          items {
            title
            titleColor
            collapsible
            links {
              to
              link
            }
            content {
              type
              text
              action
              actionText
              listType
              items {
                text
                listType
                items {
                  text
                }
              }
            }
          }
          links {
            link
            to
          }
        }
        hero {
          title
          message
          links {
            link
            isAnchor
            to
          }
          background {
            childImageSharp {
              fluid(maxWidth: 2048, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

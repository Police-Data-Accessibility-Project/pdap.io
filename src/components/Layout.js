// DEPENDENCIES
import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

// COMPONENTS
import { Header, Footer } from "../components"
// CSS
// import "../css/main.css"

export default function Layout(props) {
  return (
    <StaticQuery
      query={graphql`
        query siteMetadata {
          site {
            siteMetadata {
              title
              pages {
                title
                path
                internal
              }
            }
          }
        }
      `}
      render={data => (
        <div id="main">
          <Helmet>
            <meta charSet="utf-8" />
            <meta
              name="description"
              content="A source of truth for police data."
            ></meta>
            <title>{data.site.siteMetadata.title}</title>
            {/* Global site tag (gtag.js) - Google Analytics */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-REKS6B95BL"
            ></script>
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-REKS6B95BL');
              `}
            </script>
          </Helmet>
          <Header pages={data.site.siteMetadata.pages} />
          <main className="container">{props.children}</main>
          <Footer />
        </div>
      )}
    />
  )
}

Layout.defaultProps = {
  pages: [],
  title: "Title",
  children: null,
}

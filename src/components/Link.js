import React from "react"
import AniLink from "gatsby-plugin-transition-link/AniLink"

export default function Link(props) {
  return (
    <AniLink cover duration={1} bg="#442645" {...props}>
      {props.children}
    </AniLink>
  )
}

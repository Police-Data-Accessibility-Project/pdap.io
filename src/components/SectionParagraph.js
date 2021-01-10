import React from "react"
import sectionStyles from "../css/pageSection.module.css"

export default function SectionParagraph({ paragraph }) {
  return (
    <p className={sectionStyles.section__item__paragraph}>{paragraph.text}</p>
  )
}

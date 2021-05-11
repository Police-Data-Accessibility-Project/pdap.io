import React from "react"
import * as sectionStyles from "../css/pageSection.module.css"

export default function SectionParagraph({ paragraph }) {
  return (
    <p className={sectionStyles.section__item__paragraph} dangerouslySetInnerHTML={{ __html: paragraph.text }}></p>
  )
}

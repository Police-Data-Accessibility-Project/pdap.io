import React from "react"
import Link from "./Link"
import sectionStyles from "../css/pageSection.module.css"
import SectionItem from "./SectionItem"

export default function PageSection({ section, page, index }) {
  return (
    <section
      key={section.title}
      className={`${sectionStyles.section} ${sectionStyles[section.layout]} ${
        sectionStyles[`section__${section.columns}`]
      }`}
    >

      {section.anchor && (
        <span
          className={sectionStyles.section__anchor}
          id={section.anchor}
        ></span>
      )}
      <h1 className={sectionStyles.section__title}>{section.title}</h1>
      <div className={sectionStyles.section__items}>
        {section.items.map((sectionItem, i) => {
          return (
            <SectionItem
              key={`${page} section ${index} content ${i}`}
              page={page}
              index={index}
              i={i}
              sectionItem={sectionItem}
            />
          )
        })}
      </div>
      {section.links && (
        <div className={sectionStyles.section__links}>
          {section.links.map(link => {
            if (link.to.includes("https")) {
              return (
                <a key={link.to} className="button" href={link.to}>
                  {link.link}
                </a>
              )
            } else {
              return (
                <Link key={link.link} className="button" to={link.to}>
                  {link.link}
                </Link>
              )
            }
          })}
        </div>
      )}
    </section>
  )
}

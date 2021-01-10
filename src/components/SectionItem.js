import React, { useState } from "react"
import sectionStyles from "../css/pageSection.module.css"
import Link from "./Link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import SectionParagraph from "./SectionParagraph"
import SectionList from "./SectionList"
import SubscribeButton from "./SubscribeButton"

export default function SectionItem({ page, index, sectionItem }) {
  const [collapsed, setCollapsed] = useState(
    sectionItem.collapsible ? true : false
  )
  return (
    <div
      className={
        sectionItem.title
          ? collapsed
            ? `${sectionStyles.section__item} ${sectionStyles.section__item__detailed} ${sectionStyles.section__item__collapsed}`
            : `${sectionStyles.section__item} ${sectionStyles.section__item__detailed}`
          : sectionStyles.section__item
      }
    >
      {sectionItem.image && (
        <span className={sectionStyles.section__item__image}>
          {/* {sectionItem.image} */}
        </span>
      )}
      {sectionItem.title && (
        <button
          style={{
            cursor: sectionItem.collapsible ? "pointer" : "default",
          }}
          className={
            sectionItem.titleColor
              ? `${sectionStyles.section__item__title} ${sectionStyles.section__item__title__alt}`
              : `${sectionStyles.section__item__title}`
          }
          onClick={() => sectionItem.collapsible && setCollapsed(!collapsed)}
        >
          {sectionItem.title}
          {sectionItem.collapsible && (
            <FontAwesomeIcon
              className={sectionStyles.section__item__collapse__icon}
              icon={collapsed ? faChevronDown : faChevronUp}
            />
          )}
        </button>
      )}
      {!collapsed && (
        <div className={sectionStyles.section__item__content}>
          {sectionItem.content && sectionItem.content.map((contentItem, i) => {
            switch (contentItem.type) {
              case "subtitle":
                return (
                  <span
                    key={`${page} section ${index} subtitle ${i}`}
                    className={sectionStyles.section__item__subtitle}
                  >
                    {contentItem.text}
                  </span>
                )
              case "list":
                return (
                  <SectionList
                    key={`${page} section ${index} list ${i}`}
                    items={contentItem.items}
                    listType={contentItem.listType}
                  />
                )

              case "paragraph":
                return (
                  <SectionParagraph
                    paragraph={contentItem}
                    key={`${page} section ${index} paragraph ${i}`}
                  />
                )

              case "action":
                switch (contentItem.action) {
                  case "SubscriptionButton":
                    return (
                      <SubscribeButton
                        buttonText={contentItem.actionText}
                        key={`${page} section ${index} action ${i}`}
                      />
                    )
                  
                  default:
                    return null
                }
                
              default:
                return null
            }
          })}
        </div>
      )}
      {!collapsed && sectionItem.links && (
        <div className={sectionStyles.section__item__links}>
          {sectionItem.links.map(link => {
                
            if (link.to.includes("https")) {
              return (
                <a
                  key={link.to}>
                  href={link.to}
                  className={"button " + link.type === "cta" ? "btnPrimary" : "y"}
                  {link.link}
                </a>
              )
            } else {
              return (
                <Link
                  key={link.link}
                  to={link.to}
                  className={"button " + link.type === "cta" ? "btnPrimary" : "y"}>
                  {link.link}
                </Link>
              )
            }              
            
          })}
        </div>
      )}
    </div>
  )
}

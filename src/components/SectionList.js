import React from "react"
import * as sectionStyles from "../css/pageSection.module.css"

function SectionListItem({ text, number, children }) {
  return (
    <div className={sectionStyles.list__item}>
      <div className={sectionStyles.list__item__number}>{number}.</div>
      <div className={sectionStyles.list__item__text}>{text}</div>
      {children && (
        <div className={`${sectionStyles.list} ${sectionStyles.list__inner}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function SectionList({ items, listType }) {
  return (
    <div className={sectionStyles.list}>
      {items.map((item, i) => {
        return (
          <SectionListItem
            text={item.text}
            number={listType === "number" ? i + 1 : String.fromCharCode(i + 65)}
            key={item.text}
          >
            {item.items &&
              item.items.map((itemItem, ii) => {
                return (
                  <SectionListItem
                    key={itemItem.text}
                    text={itemItem.text}
                    number={
                      itemItem.listType === "number"
                        ? i + 1
                        : String.fromCharCode(ii + 65)
                    }
                  />
                )
              })}
          </SectionListItem>
        )
      })}
    </div>
  )
}

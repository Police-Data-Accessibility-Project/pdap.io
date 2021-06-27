import React from "react"
import Layout from "../components/Layout"
import { PageSection } from "../components"
import * as homeStyles from "../css/home.module.css"

const sections = [
  {
    title: "Frequently Asked Questions",
    columns: 2,
    layout: "section__row",
    items: [
      {
        title: `Where can I learn more about your process and trajectory?`,
        content: [
          {
            type: "paragraph",
            text: `Check out our pitch deck <a href="https://docs.google.com/presentation/d/1chFR2AZPf8T3-jxl_w00oaYNZJF0yFD8ibDhh28NQJo/preview">here</a>.`,
          },
        ],
      },
      {
        title: `What is the purpose of the Police Data Accessibility Project a.k.a. PDAP?`,
        content: [
          {
            type: "paragraph",
            text: `We're compiling police data that's already public into a unified, accessible resource.`,
          },
        ],
      },
      {
        title: `Why are you different from other watchdog-type groups?`,
        content: [
          {
            type: "paragraph",
            text: `We aren't a watchdog&mdash;our activism is data collection, not analysis or research.`,
          },
        ],
      },
      {
        title: "Who started the project?",
        content: [
          {
            type: "paragraph",
            text:
              "Kristin Tynski kicked off this project by scraping records from her own community. Our community gained momentum on Reddit.",
          },
        ],
      },
      {
        title: "Is this legal?",
        content: [
          {
            type: "paragraph",
            text: `Yes. We're consolidating public information, in accordance with <a href="https://docs.pdap.io/meta/legal">established legal precedents</a>.`,
          },
        ],
      },
      {
        title: `Are you affiliated with a political party or have a political agenda?`,
        content: [
          {
            type: "paragraph",
            text: `No. Our only motivation is to provide trusted data in an age of disinformation.`,
          },
        ],
      },
      {
        title: `How do we know you work with good data and that we can trust you?`,
        content: [
          {
            type: "paragraph",
            text: `Every step in our process is <a href="https://github.com/Police-Data-Accessibility-Project">accessible and transparent</a> for anyone curious in our procedure for procuring data.`,
          },
        ],
      },
      {
        title: `Where do you get your funding?`,
        content: [
          {
            type: "paragraph",
            text: `We've applied for 501c3 non-profit status, and can accept donations via PayPal below.`,
          },
        ],
      },
    ],
  },
]

export default function faq() {
  return (
    <Layout>
      <div className={`${homeStyles.content} ${homeStyles.content__no__hero}`}>
        {sections &&
          sections.map((section, i) => {
            return (
              <PageSection
                key={`${"/faq"} section ${i}`}
                index={i}
                page={"/faq"}
                section={section}
              />
            )
          })}
      </div>
    </Layout>
  )
}

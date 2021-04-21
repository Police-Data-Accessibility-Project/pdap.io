import React from "react"

// components
import { Layout, Hero, PageSection } from "../components"
import "../css/main.css"
import * as homeStyles from "../css/home.module.css"

const sections = [
  {
    title: " The problem",
    layout: "section__column",
    anchor: "learn",
    columns: 2,
    items: [
      {
        content: [
          {
            type: "paragraph",
            text: `Local law enforcement data is hidden in the corners of the internet, obfuscated by bureaucracy, and only accessible via low quality user experiences. It's difficult for data scientists, journalists, and ordinary citizens to access, consolidate, and use the data. The simple act of collecting the data in one place creates an <b>unprecedented starting point for full-scale analysis</b> of our criminal justice system.`,
          },
          {
            type: "paragraph",
            text: `Our goals are to ease data collection, standardize formats from disparate sources, store the data to archival standards, and facilitate open source software analytics. Our data is publicly available, free of charge.`,
          },
          {
            type: "paragraph",
            text: `We speculate that the <b>key audience is data scientists and journalists</b>. They do the analysis, and are the critical channel for information to flow from police organizations to policymakers and the general public. The platform will also benefit broader swathes of the population, such as academics, government oversight bodies, elected officials, and the law enforcement agencies themselves.`,
          },
          {
            type: "action",
            action: "SubscriptionButton",
            actionText: `Subscribe to our newsletter`,
          },
        ],
      },
    ],
  },
  {
    title: "Project goals",
    layout: "section__row",
    columns: 2,
    items: [
      {
        content: [
          {
            type: "list",
            listType: "number",
            items: [
              {
                text: `Be a trusted, complete source for easily-downloadable police data.`,
              },
              {
                text: `Create processes for routinely gathering data`,
                listType: "alpha",
                items: [
                  {
                    text:
                      "Automatically gather, validate, and publish data from some sources",
                  },
                  {
                    text:
                      "Manually collect some data via FOIA request for human-powered validation and publishing",
                  },
                ],
              },
              { text: "Identify gaps in the police data landscape." },
              { text: "Support the analysis and publication of police data." },
            ],
          },
        ],
      },
    ],
  },
]

export default function index() {
  return (
    <Layout>
      <Hero
        hero={{
          title: "A source of truth for police data",
          message:
            "There are about 18,000 police organizations, and each has a unique way to make data public. This means that, effectively, the data is not public. We can make it public by consolidating it.",
          links: [
            {
              link: "Help us achieve our mission",
              isAnchor: true,
              to: "#learn",
            },
          ],
        }}
      />
      <div className={homeStyles.content}>
        {sections &&
          sections.map((section, i) => {
            return (
              <PageSection
                key={`${"/"} section ${i}`}
                index={i}
                page={"/"}
                section={section}
              />
            )
          })}
      </div>
    </Layout>
  )
}

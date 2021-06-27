import React from "react"

// components
import { Layout, Hero, PageSection } from "../components"
import "../css/main.css"
import * as homeStyles from "../css/home.module.css"

export default function index() {
  return (
    <Layout>
      <Hero
        hero={{
          title: "A source of truth for police data.",
          message:
            "Each of us has a different vision for the future of law enforcement, but the first step is always the same: understanding the current state of policing.",
          links: [
            {
              link: "Help us achieve our mission",
              isAnchor: true,
              to: "#contribute",
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

const sections = [
  {
    title: "We can't fix what we can't measure.",
    titleColor: false,
    layout: "section__row",
    columns: 2,
    items: [
      {
        content: [
          {
            type: "paragraph",
            text: `The simple act of collecting the data in one place creates an opportunity to <b>make a positive impact on our criminal justice system.</b>`,
          },
          {
            type: "paragraph",
            text: `Our goals are to ease data collection, standardize formats from disparate sources, store the data to archival standards, and facilitate open source software analytics. Our data is publicly available, free of charge.`,
          },
        ],
      },
      {
        title: "The challenge",
        collapsible: false,
        content: [
          {
            type: "paragraph",
            text: `Local law enforcement data is hidden in slow corners of the internet, obfuscated by bureaucracy. There are about 18,000 police organizations, and each has a unique way to make data public. This means that, effectively, <b>the data is not public</b>.`,
          },
        ],
      },
    ],
  },
  {
    title: "How to help",
    titleColor: false,
    layout: "section__row",
    columns: 2,
    anchor: "contribute",
    items: [
      {
        collapsible: false,
        content: [
          {
            type: "paragraph",
            text: `<b>Contribute time.</b> <a href="https://docs.pdap.io">Volunteering starts with our docs.</a>` ,
          },
          {
            type: "paragraph",
            text: `<b>Contribute money.</b> Donate, and we'll spend it on <a href="https://docs.pdap.io/updates/blog/may-2021-dolt-bounty">Data Bounties</a> and infrastructure improvements. Small recurring donations are most helpful. Stability helps us chart a path.`,
          },
          {
            type: "paragraph",
            text: `<b>Share our work.</b> Send it to people who are experts in data.`,
          },
          {
            type: "paragraph",
            text: `<b>Use our data.</b> <a href="https://docs.pdap.io/components/data-access">Head here</a> to use the data.`,
          },
        ],
      },
    ],
  },
  {
    title: "How we use resources",
    titleColor: false,
    layout: "section__row",
    columns: 2,
    items: [
      {
        collapsible: false,
        content: [
          {
            type: "paragraph",
            text: `Our time, money, and energy goes into <a href="https://docs.pdap.io/components/data-access">centralizing public police data</a>.`,
          },
          {
            type: "paragraph",
            text: `As an open source organization, we need a bare minimum of services to allow our core volunteer group to keep the lights on.`,
          },
          {
            type: "paragraph",
            text: `We can spend money on Data Bounties by financially rewarding contributors. Since we're paying for specific data, we can make larger and more focused improvements.`
          },
        ],
      },
    ],
  },
]

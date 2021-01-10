import React from "react"
import homeStyles from "../css/home.module.css"
import HeroImage from "../assets/pdap_logo_final.svg"
import NewsletterSignup from "./forms/NewsletterSignup"

import Link from "../components/Link"
import scrollTo from "gatsby-plugin-smoothscroll"

export default function Hero({ hero }) {
  return (
    <div className={homeStyles.hero}>
      <HeroImage className={homeStyles.hero__image} />
      <div className={homeStyles.hero__content}>
        <h1 className={homeStyles.hero__title}>{hero.title}</h1>
        <p className={homeStyles.hero__message}>{hero.message}</p>
        <div className={homeStyles.hero__links}>
          {hero.links.map(link => {
            if (link.isAnchor) {
              return (
                <button
                  key={link.link}
                  className="button"
                  onClick={() => scrollTo(link.to)}
                >
                  {link.link}
                </button>
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
      </div>
    </div>
  )
}

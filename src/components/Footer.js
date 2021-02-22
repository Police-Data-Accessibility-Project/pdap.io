import React from "react"
import footerStyles from "../css/footer.module.css"
import Logo from "../assets/pdap_acronym_final.svg"
import Link from "../components/Link"
import SubscribeButton from "./SubscribeButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLinkedin,
  faSlack
} from "@fortawesome/free-brands-svg-icons"
import PaypalDonate from "./PaypalDonate"

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <Link to="/" className={footerStyles.footer__logo}>
        <Logo className={footerStyles.footer__logo__image} title="Police Data Accessibility Project - Home" />
      </Link>
      <div className={footerStyles.footer__content}>
        <SubscribeButton buttonText="Subscribe to our newsletter" />
        <PaypalDonate />
        <div className={footerStyles.social__icons}>
          <a
            href="https://www.linkedin.com/company/police-data-accessibility-project/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - LinkedIn"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faLinkedin} title="Police Data Accessibility Project - LinkedIn Page" />
          </a>
          <a
            href="policeaccessibility.slack.com"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Slack"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faSlack} title="Police Data Accessibility Project Slack" />
          </a>
        </div>
        <span className={footerStyles.copyright}>
          © 2021 Police Data Accessibility Project
        </span>
      </div>
    </footer>
  )
}

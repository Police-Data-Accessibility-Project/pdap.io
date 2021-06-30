import React from "react"
import Logo from "../assets/pdap_acronym_final.svg"
import Link from "../components/Link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithub,
  faLinkedin,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons"
import DonationButtons from "./DonationButtons"
import * as footerStyles from "../css/footer.module.css"

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <Link to="/" className={footerStyles.footer__logo}>
        <Logo
          className={footerStyles.footer__logo__image}
          title="Police Data Accessibility Project - Home"
        />
      </Link>
      <div className={footerStyles.footer__content}>
        <DonationButtons showPatreon={true} showPaypal={true} />
        <div className={footerStyles.social__icons}>
          <a
            href="https://github.com/Police-Data-Accessibility-Project/Police-Data-Accessibility-Project/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - GitHub"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon
              icon={faGithub}
              title="Police Data Accessibility Project - Github"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/police-data-accessibility-project/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - LinkedIn"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              title="Police Data Accessibility Project - LinkedIn Page"
            />
          </a>
          <a
            href="https://discord.gg/wMqex8nKZJ"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Discord"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon
              icon={faDiscord}
              title="Police Data Accessibility Project - Discord"
            />
          </a>
        </div>
        <span className={footerStyles.copyright}>
          <span>© 2021 Police Data Accessibility Project</span>
          <a href="https://docs.pdap.io/meta/policy/pdap-privacy-policy" alt="Privacy Policy">Privacy Policy</a>
        </span>
      </div>
    </footer>
  )
}

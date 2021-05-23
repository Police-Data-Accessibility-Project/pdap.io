import React from "react"
import Logo from "../assets/pdap_acronym_final.svg"
import Link from "../components/Link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithub,
  faLinkedin,
  faSlack,
} from "@fortawesome/free-brands-svg-icons"
import PaypalDonate from "./PaypalDonate"
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
        <PaypalDonate />
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
            href="https://join.slack.com/t/policeaccessibility/shared_invite/zt-ial0bvnm-D_T7R6za4aKh1f9jGUM0pg"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Slack"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon
              icon={faSlack}
              title="Police Data Accessibility Project - Slack"
            />
          </a>
        </div>
        <span className={footerStyles.copyright}>
          © 2021 Police Data Accessibility Project
        </span>
      </div>
    </footer>
  )
}

import React from "react"
import footerStyles from "../css/footer.module.css"
import Logo from "../assets/pdap_acronym_final.svg"
import Link from "../components/Link"
import SubscribeButton from "./SubscribeButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faReddit,
  faInstagram,
  faTwitter,
  faLinkedin,
  faFacebook
} from "@fortawesome/free-brands-svg-icons"

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <Link to="/" className={footerStyles.footer__logo}>
        <Logo className={footerStyles.footer__logo__image} title="Police Data Accessibility Project - Home" />
      </Link>
      <div className={footerStyles.footer__content}>
        {/* TODO toggling off subscribe until we figure out mailchimp */}
        {/* <SubscribeButton buttonText="Subscribe to our mailing list" /> */}
        <div className={footerStyles.social__icons}>
          <a
            href="https://www.facebook.com/Police-Data-Accessibility-Project-PDAP-109798477433389/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Facebook Page"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faFacebook} title="Police Data Accessibility Project - Facebook Page" />
          </a>
          <a
            href="https://twitter.com/DataPdap"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Twitter Page"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faTwitter} title="Police Data Accessibility Project - Twitter Page" />
          </a>
          <a
            href="https://www.linkedin.com/company/police-data-accessibility-project/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Page"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faLinkedin} title="Police Data Accessibility Project - LinkedIn Page" />
          </a>
          <a
            href="https://www.instagram.com/pdapdataaccessibility/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Instagram Page"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faInstagram} title="Police Data Accessibility Project - Instagram Page" />
          </a>
          <a
            href="https://www.reddit.com/r/DataPolice/"
            target="_blank"
            rel="noreferrer"
            alt="Police Data Accessibility Project - Reddit Page"
            className={footerStyles.social__icon}
          >
            <FontAwesomeIcon icon={faReddit} title="Police Data Accessibility Project - Reddit Page" />
          </a>
        </div>
        <span className={footerStyles.copyright}>
          © 2020 Police Data Accessibility Project
        </span>
      </div>
    </footer>
  )
}

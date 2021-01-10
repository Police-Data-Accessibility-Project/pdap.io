import React from "react"
import Link from "../components/Link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faMapSigns } from "@fortawesome/free-solid-svg-icons"
import Layout from "../components/Layout"

export default function fourOhFour() {
  return (
    <Layout>
      <div className="four__oh__four">
        <FontAwesomeIcon
          className="four__oh__four__background"
          icon={faMapSigns}
        />
        <div className="four__oh__four__content">
          <p className="four__oh__four__message">It looks like you're lost.</p>
          <Link to="/" className="button button--borderless">
            Go this way
            <FontAwesomeIcon className="button__icon" icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </Layout>
  )
}

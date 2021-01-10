import React from "react"
import Navbar from "./Navbar"
import Link from "../components/Link"
import headerStyles from "../css/header.module.css"
import Logo from "../assets/pdap_full_lockup_final.svg"

export default function Header({ pages }) {
  return (
    <header className={headerStyles.header}>
      <div className={headerStyles.header__content}>
        <Link to="/" className={headerStyles.header__logo}>
          <Logo
            className={headerStyles.header__logo__image}
            title="PDAP Home"
          />
        </Link>
        {pages.length > 0 && <Navbar pages={pages} />}
      </div>
    </header>
  )
}

Header.defaultProps = {
  pages: [],
}

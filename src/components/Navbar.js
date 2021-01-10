import React from "react"
import PropTypes from 'prop-types'
import Link from "./Link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"

import navStyles from "../css/nav.module.css"
import NewsletterSignup from "./forms/NewsletterSignup"
import SubscribeButton from "./SubscribeButton"

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSubscribeModal: false,
      showNav: false,
      header: "I am Header",
      footer: "I am Footer",
      desc: "Hello! I am modal box"
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  };


  showModal = () => {
    this.setState({ showSubscribeModal: true });
  };

  hideModal = () => {
    this.setState({ showSubscribeModal: false });
  };


  render() {
    return (
      <nav className={navStyles.nav}>
        <button
          className={navStyles.nav__menu__button}
          onClick={() => this.setState({ showNav: !this.state.showNav})}
        >
          <FontAwesomeIcon
            title="navigation menu icon"
            icon={this.state.showNav ? faTimes : faBars}
          />
        </button>
        <div
          className={
            this.state.showNav
              ? `${navStyles.nav__menu} ${navStyles.nav__menu__open}`
              : navStyles.nav__menu
          }
        >
          {this.props.pages.map(page => {
            return (
              <Link
                activeClassName={navStyles.nav__link__active}
                partiallyActive={page.path !== "/" ? true : false}
                className={navStyles.nav__link}
                to={page.path}
                key={page.path}
              >
                {page.title}
              </Link>
            )
          })}
        </div>

      </nav>
    )
  }
};


Navbar.defaultProps = {
  pages: [],
};

Navbar.propTypes = {
  pages: PropTypes.array.isRequired,
};
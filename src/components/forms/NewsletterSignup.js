import React from "react"
import * as styles from "../../css/forms/newsletterSignup.module.css"

export default class NewsletterSignup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      EMAIL: "",
      FNAME: "",
      b_9dc01a9a37589968ba23ac286_da393c802e: "",
      valid: false,
    }

    this.changeHandler = this.changeHandler.bind(this)
  }

  changeHandler = event => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value,
    })
  }

  render() {
    const { handleClose, show } = this.props
    const showHideDisplayStyle =
      show === false ? "display-none" : "display-block"

    return (
      <div
        id="mailchimp-signup-form"
        className={(styles.form__wrapper, showHideDisplayStyle)}
      >
        {show && (
          <div id="newsletterModal" className={styles.modal}>
            <form
              className={styles.modal__content}
              action="https://pdap.us7.list-manage.com/subscribe/post?u=9dc01a9a37589968ba23ac286&amp;id=da393c802e"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
            >
              <button className={styles.close} onClick={handleClose}>
                x
              </button>
              <div className={styles.form__grid}>
                <div className={styles.form__header}>
                  <h2 className={styles.form__header__text}>
                    Subscribe to our newsletter
                  </h2>
                </div>
                <div className={styles.form__message}>
                  <p>
                    Yes, we have a newsletter! Thank you for asking. Add your
                    email to our list to receive new information and updates on
                    our mission and activities.
                  </p>
                </div>
                <div className={styles.form__content}>
                  <div className={styles.form__content__wrapper}>
                    <div
                      style={{ position: "absolute", left: -5000 + "px" }}
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        onChange={this.changeHandler}
                        name="b_9dc01a9a37589968ba23ac286_da393c802e"
                        tabIndex={"-1"}
                        value={this.state.mc_honeypot}
                      />
                    </div>
                    <div className={styles.input__wrapper}>
                      <label htmlFor={"mce-EMAIL"}>
                        Email Address
                        <span className={"asterisk"}>*</span>
                      </label>
                      <input
                        type="email"
                        value={this.state.EMAIL}
                        onChange={this.changeHandler}
                        name="EMAIL"
                        className={"required email"}
                        id="mce-EMAIL"
                        required
                        autoComplete={"off"}
                      />
                    </div>
                    <div className={styles.input__wrapper}>
                      <label htmlFor={"mce-FNAME"}>
                        Your Name
                        <span className={"asterisk"}> (optional)</span>
                      </label>
                      <input
                        type="text"
                        value={this.state.FNAME}
                        onChange={this.changeHandler}
                        name="FNAME"
                        id="mce-FNAME"
                        autoComplete={"off"}
                      />
                    </div>
                    <button className={"button btnPrimary"}>Subscribe</button>
                    <button onClick={handleClose}>
                      <span className={styles.closeText}>
                        No thanks, I want to continue reading
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }
}

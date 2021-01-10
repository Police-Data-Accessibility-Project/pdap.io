import React from "react";
import styles from "../../css/forms/newsletterSignup.module.css";

export default class NewsletterSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            EMAIL: '',
            FNAME: '',
            b_21d968d1e76c32ee1d25a616c_116eb23f41: '',
            valid: false,
        };

        this.changeHandler = this.changeHandler.bind(this);
    }

    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { handleClose, desc, show, header, footer } = this.props
        const showHideDisplayStyle = show === false ? 'display-none' : 'display-block'

        return (
            <div id="mailchimp-signup-form" className={styles.form__wrapper, showHideDisplayStyle}>
                {show && (
                <div id="newsletterModal" className={styles.modal}>
                    <form
                        className={styles.modal__content}
                        action="https://gmail.us20.list-manage.com/subscribe/post?u=21d968d1e76c32ee1d25a616c&amp;id=116eb23f41"
                        method="post"
                        id="mc-embedded-subscribe-form"
                        name="mc-embedded-subscribe-form"
                    >
                        <button className={styles.close} onClick={handleClose}>x</button>
                        <div className={styles.form__grid}>
                            <div className={styles.form__header}>
                                <h2 className={styles.form__header__text}>Subscribe to our mailing list</h2>
                            </div>
                            <div className={styles.form__message}>
                                <p>Want to keep up with our progress? Add your email to our list to receive new information and updates on our mission and activities.</p>
                            </div>
                            <div className={styles.form__content}>
                                <div className={styles.form__content__wrapper}>
                                    <div style={{ position: 'absolute', left: -5000 + 'px' }} aria-hidden="true">
                                        <input type="text" onChange={this.changeHandler} name="b_21d968d1e76c32ee1d25a616c_116eb23f41" tabIndex={"-1"} value={this.state.mc_honeypot} />
                                    </div>
                                    <div className={styles.input__wrapper}>
                                        <label htmlFor={"mce-EMAIL"}>Email Address
                                            <span className={"asterisk"}>*</span>
                                        </label>
                                        <input type="email" value={this.state.EMAIL} onChange={this.changeHandler} name="EMAIL" className={"required email"} id="mce-EMAIL" required autoComplete={"off"}/>
                                    </div>
                                    <div className={styles.input__wrapper}>
                                        <label htmlFor={"mce-FNAME"}>Your Name
                                            <span className={"asterisk"}> (optional)</span>
                                        </label>
                                        <input type="text" value={this.state.FNAME} onChange={this.changeHandler} name="FNAME" id="mce-FNAME" autoComplete={"off"}/>
                                    </div>
                                    <button 
                                        className={"button btnPrimary"}
                                    >
                                        Subscribe
                                    </button>
                                    <div onClick={handleClose} styles={styles.closeText__wrapper}>
                                        <span className={styles.closeText}>No thanks, I want to continue reading</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>)}
            </div>
        )
    }
}
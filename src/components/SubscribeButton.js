import React from "react"
import PropTypes from 'prop-types'
import NewsletterSignup from "./forms/NewsletterSignup"

export default class SubscribeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSubscribeModal: false,
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    
    showModal = () => {
        this.setState({ showSubscribeModal: true });
    };

    hideModal = () => {
        this.setState({ showSubscribeModal: false });
    };

    render() {
        const { buttonText, wrapperClass } = this.props;
        return (
            <div className={wrapperClass} style={{display: 'flex', textAlign: 'center', width: '100%'}}>
                <button type="button" style={{width: 'inherit'}} className="button btnPrimary" onClick={this.showModal}>
                    {buttonText}
                </button>
                <NewsletterSignup show={this.state.showSubscribeModal} handleClose={this.hideModal} />
            </div>
        )
    }
}

SubscribeButton.defaultProps = {
    buttonText: "Subscribe",
    wrapperClass: ""
};
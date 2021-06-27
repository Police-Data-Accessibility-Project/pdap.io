import React from "react"
const PaypalDonate = () => {
  var hostedButtonIdVal = process.env.GATSBY_PAYPAL_HOSTED_BUTTON_ID
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_blank">
      <input type="hidden" name="hosted_button_id" value={hostedButtonIdVal} />
      <button
        type="submit"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
        border="0"
        name="submit"
        value="Donate"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
        className="button button--small btnPrimary"
      >
        Donate
        {/* Donate on PayPal --- breaks out of button width */}
      </button>
      {/* <img
        alt=""
        border="0"
        src="https://www.paypal.com/en_US/i/scr/pixel.gif"
        width="1"
        height="1"
      /> */}
    </form>
  )
}

export default PaypalDonate

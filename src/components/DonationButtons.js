import React from 'react'
import PaypalDonate from "./PaypalDonate"
import PatreonDonate from "./PatreonDonate"

export default function DonationButtons({showPatreon, showPaypal}) {
    return (
        <div className="donation__buttons">
{showPaypal &&
        <PaypalDonate />
}
{showPatreon &&
        <PatreonDonate />
}
        </div>
    )
}

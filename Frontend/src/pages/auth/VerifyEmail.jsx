import styles from "./VerifyEmail.module.css"
import emailIcon from "../../assets/images/emailIcon.svg"
import global from "../../css/Global.module.css"
import apiFetch from "../../components/utils/Api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function VerifyEmail({ notify }) {
    const email = localStorage.getItem("email")

    const [isLoading, setIsLoading] = useState(false)
    const nav = useNavigate();

    async function resendVerificationEmail() {


        if (email) {
            try {
                        setIsLoading(true)
                const res = await apiFetch("/email/resend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                }, notify, nav)


                if (!res) {return};

                const data = await res.json();

                if (!res.ok) {
                    notify(data.message || "Something went wrong, please try again", "ERROR");
                    return;
                }

                notify(data.message, "SUCCESS");
            }  finally {
                setIsLoading(false);
            }
        }
    }



    return (

        <div className={styles.verifyContainer}>

            <div className={`${styles.verifyWrapper} ${global.glassyBackground}`}>

                <h1>Verify your email</h1>
                <p>Account activiation link has been sent to the e-mail address your provided</p>
                <img src={emailIcon} className={styles.verifyIcon} />

                <a className={styles.resend}
                onClick={resendVerificationEmail}>Didn't get the mail? Send it again</a>

            </div>
        </div>

    )
}
import styles from "./VerifyEmail.module.css"
import emailIcon from "../../../assets/images/emailIcon.svg"
import global from "../../../css/Global.module.css"
import ApiFetch from "../../../components/utils/Api"
import { useState } from "react"

export default function VerifyEmail({ notify }) {
    const email = localStorage.getItem("email")

    const [isLoading, setLoading] = useState(false)

    async function Resend() {
        setLoading(true)

        if (email) {
            try {
                const res = await ApiFetch("/api/email/resend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                })


                if (!res) return;

                const data = await res.json();

                if (!res.ok) {
                    notify(data.message || "Something went wrong, please try again", "ERROR");
                    return;
                }

                console.log(data);

                notify(data.message, "SUCCESS");
            } catch (err) {
                notify("Something went wrong, pleasey try again", "ERROR");
                return;

            } finally {
                setLoading(false);
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
                onClick={Resend}>Didn't get the mail? Send it again</a>

            </div>
        </div>

    )
}
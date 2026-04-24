import { useEffect, useState } from "react";
import styles from "./Notification.module.css"
import global from "../../css/Global.module.css"
import { FiCheckCircle, FiInfo } from "react-icons/fi";

export default function Notification({ message, type, key }) {
    
    const [visible, setVisible] = useState(false);

    useEffect(() => {

        if (message) {
            setVisible(false);

            setTimeout(() => {
                setVisible(true)
            }, 10)

        } else {
            setVisible(false);
        }

    }, [message])

    return (


        <div className={`${styles.notification} ${global.glassyBackground} ${visible ? styles.show : ""}`}>

            <div className = {`${styles.iconBox} ${type === "SUCCESS" ? styles.success
                 : styles.error}`}>

                    {type === "SUCCESS" ? (
                         <FiCheckCircle className={`${styles.notifIcon} ${styles.success}`} />
                    ) : (
                         <FiInfo className={`${styles.notifIcon} ${styles.error}`} />
                    )}


            </div>

            <div className={styles.textWrapper}>
                <p className={styles.notifTypeText}>
                    {type === "SUCCESS" ? "Success" : "Error"}
                </p>
                <p className={styles.notifMessage}>{message}</p>
            </div>

        </div>

    );
}
import logo from "../../assets/images/logo.svg"
import styles from "./SmallComponents.module.css"
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { useState } from "react";


export function EmailField({ email, setEmail, title }) {

    return (
        <div className={styles.field}>
            <label className={styles.fieldLabel}>{title}</label>

            <input className={styles.fieldInput}

                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" >

            </input>
        </div>
    );

}


export function PasswordField({ password, setPassword, title }) {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <div className={styles.field}>
            <label className={styles.fieldLabel}>{title}</label>
            <input className={styles.fieldInput}

                placeholder="•••••"
                value={password}
                type={isToggled ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
            >
            </input>


            <FiEye className={styles.togglePassword}
                onClick={() => setIsToggled(!isToggled)} />

        </div>
    )
}

export function CodeField({code, setCode, title}){
    return (
        <div className = {styles.field}>
  <label className={styles.fieldLabel}>{title}</label>

      <input className={styles.fieldInput}

                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            >
            </input>
            

        </div>
    )
}



export function BrandField() {
    const nav = useNavigate();

    return (

        <div className={styles.brandContainer}
            onClick={() => nav("/")}>
            <img src={logo} className={styles.brandLogo} />
            <p className={styles.brandText}>SNIPR</p>
        </div>

    )
}

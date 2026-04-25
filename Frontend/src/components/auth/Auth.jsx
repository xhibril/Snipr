import { useNavigate } from "react-router-dom";
import { BrandField, EmailField, PasswordField } from "../../components/ui/SmallComponents.jsx"
import ApiFetch from "../utils/Api.jsx";
import { ValidateEmail, ValidatePassword } from "../utils/Validation.jsx";
import global from "../../css/Global.module.css"
import styles from "./Auth.module.css";
import { useState, useEffect } from "react";

export default function Auth({ mode, notify, setIsAuth }) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [remember, setRemember] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const nav = useNavigate();
    const isLogin = mode === "LOGIN"


    function checkIfVerified() {

        const params = new URLSearchParams(window.location.search);
        const isVerified = params.get("verified");

        if (isVerified === "true") {
            notify("Successfully verified", "SUCCESS");
        }

        if (isVerified === "false") {
            notify("Verification failed", "ERROR");
        }
    }

    useEffect(() => {
        checkIfVerified();
    }, [])


    async function submitCredentials(path) {

        const emailRes = ValidateEmail(email);
        if(emailRes !== "VALID"){
            notify(emailRes, "ERROR");
            return;
        }

        const passwordRes = ValidatePassword(password);
        if(passwordRes !== "VALID"){
            notify(passwordRes, "ERROR");
            return;
        }

        setIsLoading(true);

    
        try {
            const res = await ApiFetch(path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember })
            }, notify, nav)

            console.log(res.status);
            
            if (!res) return;

            if (!res.ok) {
                const data = await res.json();
                notify(data.message || "Something went wrong, please try again", "ERROR");
                return;
            }


            if(isLogin){
                localStorage.removeItem("email")
                setIsAuth(true)
                nav("/dashboard")

            } else {
                localStorage.setItem("email", email);
                setEmail("");
                setPassword("");
                nav("/verify/email")
            }

        }   catch (err) {
            notify("Something went wrong. Please try again.", "ERROR");
        } finally {
            setIsLoading(false);
        }
    }






    return <>
        <div className={global.mainContainer}>

            <form className={`${global.inputContainer} ${global.glassyBackground}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitCredentials(isLogin ? "/api/login" : "/api/signup")
                }}>

                <BrandField />

                {isLogin ? (
                    <h1>Login</h1>
                ) : (
                    <h1>Sign up</h1>
                )}
                <EmailField email={email} setEmail={setEmail} title={"Email"} />
                <PasswordField password={password} setPassword={setPassword} title={"Password"} />


                <div className={styles.remember}>
                    <input type="checkbox" />
                    <p>Remember me</p>
                </div>


                <button className={global.submit} type="submit"
                disabled= {isLoading}>
                    {isLoading ? "Loading..." : (isLogin ? "Login" : "Sign up")}
                    
                </button>

                {isLogin && (
                    <a className={styles.forgot}>Forgot your password? </a>
                )}



                {isLogin ? (
                    <div className={styles.redirect}>
                        <p>Don't have an account? </p>
                        <a
                            onClick={() => nav("/signup")}>Sign up</a>
                    </div>

                ) : (
                    <div className={styles.redirect}>
                        <p>Already have an account? </p>
                        <a
                            onClick={() => nav("/login")}>Login</a>
                    </div>
                )}

            </form>

        </div>
    </>
}
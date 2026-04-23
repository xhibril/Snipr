import { useNavigate } from "react-router-dom";
import { BrandField, EmailField, PasswordField } from "../../components/ui/SmallComponents.jsx"
import global from "../../css/Global.module.css"
import styles from "./Auth.module.css";
import { useState } from "react";

export default function Auth({ mode }) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const nav = useNavigate();


     const isLogin = mode === "LOGIN"




    return <>


        <div className={global.mainContainer}>

            <div className={`${global.inputContainer} ${global.glassyBackground}`}>




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


                <button className={global.submit}>
                    {isLogin ? "Login" : "Sign up"}
                </button>

                {isLogin && (
                    <a className={styles.forgot}>Forgot your password? </a>
                )}



                {isLogin ? ( 
                    <div className = {styles.redirect}> 
                        <p>Don't have an account? </p>
                        <a
                        onClick={() => nav("/signup")}>Sign up</a>
                        </div>
            
                ): (
                         <div className = {styles.redirect}> 
                        <p>Already have an account? </p>
                        <a
                        onClick= {() => nav("/login")}>Login</a>
                        </div>
                )}

            </div>


        </div>
    </>
}
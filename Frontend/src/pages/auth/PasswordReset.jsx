import global from "../../css/Global.module.css"
import { ValidateEmail, ValidateCode, ValidatePassword } from "../../components/utils/Validation"
import { useState } from "react"
import { EmailField, PasswordField, CodeField, BrandHeader } from "../../components/ui/SmallComponents"
import apiFetch from "../../components/utils/Api"
import { useNavigate } from "react-router-dom"

export default function PasswordReset({ notify }) {

    const nav = useNavigate();

    const jsonHeaders = { "Content-Type": "application/json" };

    const [step, setStep] = useState("EMAIL")
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [resetToken, setResetToken] = useState("")



    async function resetPassword() {

        if (step === "EMAIL") {

            const validateEmail = ValidateEmail(email);

            if (validateEmail !== "VALID") {
                notify(validateEmail, "ERROR");
                return;
            }

          

            try {
                  setIsLoading(true);
                const emailRes = await apiFetch("/password/reset/init", {
                    method: "POST",
                    headers: jsonHeaders,
                    body: JSON.stringify({ email })
                }, notify, nav)

                if (!emailRes) {
                    return;
                }

                const data = await emailRes.json();

                if (!emailRes.ok) {
                    notify(data.message || "Something went wrong, please try again", "ERROR")
                    return;
                }

                notify(data.message, "SUCCESS");
                setStep("CODE");
                return;

            } finally {
                setIsLoading(false);
            }
        }



        if (step === "CODE") {
            const validateCode = ValidateCode(code);

            if (validateCode !== "VALID") {
                notify(validateCode, "ERROR");
                return;
            }


       

            try {
                     setIsLoading(true);
                const codeRes = await apiFetch("/password/reset/verify", {
                    method: "POST",
                    headers: jsonHeaders,
                    body: JSON.stringify({ email, code })
                }, notify, nav);

                if (!codeRes) {return};

                const data = await codeRes.json();

                if (!codeRes.ok) {
                    notify(data.message || "Something went wrong, please try again", "ERROR");
                    return;
                }

                setResetToken(data.resetToken);
                setStep("RESET")
                return;

            } finally {
                setIsLoading(false);
            }
        }



        if (step === "RESET") {
            const validatePassword = ValidatePassword(newPassword);

            if (validatePassword !== "VALID") {
                notify(validatePassword, "ERROR");
                return;
            }

            if (newPassword !== confirmPassword) {
                notify("Passwords must match", "ERROR");
                return;
            }

      

            try {
                 setIsLoading(true);
                const passwordRes = await apiFetch("/password/reset/complete", {
                    method: "POST",
                    headers: jsonHeaders,
                    body: JSON.stringify({ email, newPassword, confirmPassword, resetToken })
                }, notify, nav);


                if (!passwordRes) return;

                const data = await passwordRes.json();

                if (!passwordRes.ok) {
                    notify(data.message || "Something went wrong, please try again", "ERROR");
                    return;
                }

                notify(data.message, "SUCCESS");
                setNewPassword("")
                setConfirmPassword("");
                setStep("COMPLETED")
                return;

            } finally {
                setIsLoading(false);
            }

        }
    }

    return (



        <div className={global.mainContainer}>
            <form className={`${global.inputContainer} ${global.glassyBackground}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    resetPassword();
                }}>

                <BrandHeader title={"Reset Password"} />


                {step === "EMAIL" && (
                    <EmailField email={email} setEmail={setEmail} title={"Email"} />
                )}


                {step === "CODE" && (
                    <CodeField code={code} setCode={setCode} title={"Code"} />
                )}


                {step === "RESET" && (
                    <>
                        <PasswordField password={newPassword} setPassword={setNewPassword} title={"New Password"} />
                        <PasswordField password={confirmPassword} setPassword={setConfirmPassword} title={"Confirm Password"} />
                    </>
                )
                }


                {
                    step === "COMPLETED" ? (
                        <button className={global.submit}
                            type="submit"
                            onClick={() => nav("/dashboard", {replace: true})}
                            disabled={isLoading}>

                            {isLoading ? "Loading..." : "Back"}
                        </button>
                    ) : (
                        <button className={global.submit}
                            type="submit"
                            disabled={isLoading} >

                            {isLoading ? "Loading..." : "Continue"}
                        </button>
                    )
                }

            </form>
        </div>

    )

}
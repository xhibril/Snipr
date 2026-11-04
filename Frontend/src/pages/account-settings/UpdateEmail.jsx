import { useState } from "react";
import {
  BrandHeader,
  EmailField,
  CodeField,
  PasswordField,
} from "../../components/ui/SmallComponents";
import apiFetch from "../../components/utils/Api";
import global from "../../css/Global.module.css";

import { DEFAULT_FAILURE_MESSAGE } from "../../components/ui/SmallComponents";
import { useNavigate } from "react-router-dom";
import { ValidateEmail } from "../../components/utils/Validation";

export default function UpdateEmail({ notify, setAuth }) {
  const [pendingEmail, setPendingEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("INIT");
  const jsonHeaders = { "Content-Type": "application/json" };
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const nav = useNavigate();

  async function updateEmail() {


    const validateEmail = ValidateEmail(pendingEmail);

    if(validateEmail !== "VALID"){
      notify(validateEmail, "ERROR");
      return;
    }


    if (step === "INIT") {
      try {
        setIsLoading(true);

        const res = await apiFetch(
          "/account/email/request",
          {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify({ pendingEmail, password }),
          },
          notify,
          nav,
        );

        if(!res){
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          notify(data.message || DEFAULT_FAILURE_MESSAGE, "ERROR");
          return;
        }

        notify(data.message || "Verification code sent", "SUCCESS");
        setStep("VERIFY");
      } finally {
        setIsLoading(false);
      }
    }

    if (step === "VERIFY") {
      try {
        setIsLoading(true);

        const verifyRes = await apiFetch(
          "/account/email/verify",
          {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify({ code }),
          },
          notify,
          nav,
        );

        if(!verifyRes){
          return;
        }
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          notify(verifyData.message || DEFAULT_FAILURE_MESSAGE, "ERROR");
          return;
        }

        const resetToken = verifyData.resetToken;

        const changeRes = await apiFetch(
          "/account/email",
          {
            method: "PATCH",
            headers: jsonHeaders,
            body: JSON.stringify({ pendingEmail, resetToken }),
          },
          notify,
          nav,
        );

        if(!changeRes){
          return;
        }

        const changeData = await changeRes.json();

        if (!changeRes.ok) {
          notify(changeData.message || DEFAULT_FAILURE_MESSAGE, "ERROR");
          return;
        }

        setCode("");
        setPendingEmail("");
        setPassword("");
        setStep("COMPLETED");

        setAuth((prev) => ({
            ...prev,
            user : {
                ...prev.user,
                email: pendingEmail
            }
        }))

        notify(changeData.message || "Email successfully changed", "SUCCESS");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className={global.mainContainer}>
      <form
        onSubmit={(e) => {
          updateEmail();
          e.preventDefault();
        }}
        className={`${global.inputContainer} ${global.glassyBackground}`}
      >
        <BrandHeader title="Update email" />

        {step === "INIT" && (
          <>
            <EmailField
              title="New Email"
              email={pendingEmail}
              setEmail={setPendingEmail}
            />
            <PasswordField
              title="Password"
              password={password}
              setPassword={setPassword}
            />
          </>
        )}

        {step === "VERIFY" && (
          <CodeField title="6-digit code" code={code} setCode={setCode} />
        )}

        {step === "COMPLETED" ? (
          <>
            <p>Your email address has been updated.</p>

            <button
              className={global.submit}
              type="button"
              onClick={() => nav("/dashboard", { replace: true })}
            >
              Back to dashboard
            </button>
          </>
        ) : (
          <button
            className={`${global.submit} ${global.continueButton}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Continue"}
          </button>
        )}
      </form>
    </div>
  );
}

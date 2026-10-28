import ApiFetch from "../../components/utils/Api";
import { DEFAULT_FAILURE_MESSAGE } from "../../components/ui/SmallComponents";
import {
  BrandHeader,
  PasswordField,
} from "../../components/ui/SmallComponents";
import { useNavigate } from "react-router-dom";

import global from "../../css/Global.module.css";
import { useState } from "react";

export default function DeleteAccount({ notify, setAuth }) {
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  async function deleteAccount() {
    if(!confirmDeletion){
        notify("Please confirm account deletion");
        return;
    }


    try {
        setIsLoading(true);

        const res = await ApiFetch("/account", 
            {
                method: "DELETE",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({password})

        })


        if(!res?.ok){
            const data = await res.json();
            notify(data.message || "Could not delete account", "ERROR");
            return;
        }


       setAuth({
            authenticated: false,
    user: null,
       });
       nav("/", { replace: true });

    } catch (err){
        notify(DEFAULT_FAILURE_MESSAGE, "ERROR");

    } finally{
        setIsLoading(false);
    }

  }

  return (
    <div className={global.mainContainer}>
      <form
        onSubmit={(e) => {
          deleteAccount();
          e.preventDefault();
        }}
        className={`${global.inputContainer} ${global.glassyBackground}`}
      >
        <BrandHeader title="Delete account" />

        <PasswordField
          title="Password"
          password={password}
          setPassword={setPassword}
        />

        <div>
          <input
            type="checkbox"
            checked={confirmDeletion}
            onChange={(e) => setConfirmDeletion(e.target.checked)}
          />

          <p> Confirm deletion</p>
        </div>

        <div className={global.actionButtons}>
          <button
            className={`${global.submit} ${global.backButton}`}
            type="button"
            onClick={() => nav("/dashboard", { replace: true })}
          >
            Back
          </button>

          <button
            className={`${global.submit} ${global.continueButton}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </form>
    </div>
  );
}

import apiFetch from "../../components/utils/Api";
import {
  BrandHeader,
  PasswordField,
} from "../../components/ui/SmallComponents";
import { useNavigate } from "react-router-dom";

import global from "../../css/Global.module.css";
import { useState } from "react";
import { HandleBack, BackButton } from "../../components/ui/SmallComponents";

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

        const res = await apiFetch("/account", 
            {
                method: "DELETE",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({password})

        }, notify, nav)


        if(!res){
          return;
        }


        if(!res.ok){
            const data = await res.json();
            notify(data.message || "Could not delete account", "ERROR");
            return;
        }


       setAuth({
            authenticated: false,
    user: null,
       });
       nav("/", { replace: true });

    }
    finally{
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
        className={`${global.formCard} ${global.glassyBackground}`}
      >
        <BrandHeader title="Delete account" />

        <PasswordField
          title="Password"
          password={password}
          setPassword={setPassword}
        />

   <div style={{ display: "flex", flexDirection: "row", gap:".25rem" }}>
          <input 
            type="checkbox"
            checked={confirmDeletion}
            onChange={(e) => setConfirmDeletion(e.target.checked)}
          />

          <span> Confirm deletion</span>
        </div>

      
          <button
             className={`${global.btn} ${global.btnPrimary} ${global.fullWidthBtn}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete account"}
          </button>
        
        <BackButton onClick={() => nav("/dashboard")}/>
      </form>
    </div>
  );
}

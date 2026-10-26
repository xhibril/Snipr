import global from "../../css/Global.module.css";
import ApiFetch from "../../components/utils/Api";

import { useState } from "react";
import {
  BrandHeader,
  UsernameField,
  PasswordField,
} from "../../components/ui/SmallComponents";
import { useNavigate } from "react-router-dom";
import { ValidateInput } from "../../components/utils/Validation";

export default function UpdateUsername({ notify, isAuth, setIsAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  async function updateUsername() {
    const trimmedName = username.trim();

    if (!trimmedName) {
      notify("Username cannot be empty", "ERROR");
      return;
    }

    const nameRes = ValidateInput(trimmedName, "USERNAME");

    if (nameRes !== "VALID") {
      notify(
        "Username can only contain letters, numbers, underscores, and periods.",
        "ERROR",
      );
      return;
    }
    if (trimmedName.length < 3) {
      notify("Username cannot be shorter than 3 characters", "ERROR");
      return;
    }

    if (
      trimmedName.toLocaleLowerCase() ===
      isAuth?.user.username.toLocaleLowerCase()
    ) {
      notify("Username cannot be same as old", "ERROR");
      return;
    }

    try {
      setIsLoading(true);
      const res = await ApiFetch(
        "/account/profile",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmedName, password: password }),
        },
        notify,
        nav,
      );

      const data = await res.json();

      if (!res?.ok) {
        notify(
          data.message || "Something went wrong, please try again",
          "ERROR",
        );
        return;
      }

      setIsAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          username: trimmedName,
        },
      }));
      setUsername("");
      setPassword("");

      notify("Username successfully changed", "SUCCESS");
    } catch (err) {
      notify("Something went wrong, please try again", "ERROR");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={global.mainContainer}>
      <form
        onSubmit={(e) => {
          updateUsername();
          e.preventDefault();
        }}
        className={`${global.inputContainer} ${global.glassyBackground}`}
      >
        <BrandHeader title="Update username" />

        <UsernameField
          title="Username"
          username={username}
          setUsername={setUsername}
        />

        <PasswordField
          title="Password"
          password={password}
          setPassword={setPassword}
        />

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
            {isLoading ? "Changing..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

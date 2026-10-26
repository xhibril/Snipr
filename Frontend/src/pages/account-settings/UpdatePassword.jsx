import { useState } from "react";
import global from "../../css/Global.module.css";
import { ValidatePassword } from "../../components/utils/Validation";
import ApiFetch from "../../components/utils/Api";
import {
  BrandHeader,
  PasswordField,
} from "../../components/ui/SmallComponents";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword({ notify }) {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  async function updatePassword() {
    const oldPasswordRes = ValidatePassword(oldPassword);

    if (oldPasswordRes !== "VALID") {
      notify(oldPasswordRes, "ERROR");
      return;
    }

    const newPasswordRes = ValidatePassword(newPassword);

    if (newPasswordRes !== "VALID") {
      notify(newPasswordRes, "ERROR");
      return;
    }

    const confirmPasswordRes = ValidatePassword(confirmPassword);

    if (confirmPasswordRes !== "VALID") {
      notify(confirmPasswordRes, "ERROR");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify("Passwords do not match", "ERROR");
      return;
    }

    if (oldPassword === newPassword) {
      notify("New password must be different from the old password", "ERROR");
      return;
    }

    try {
      setIsLoading(true);

      const res = await ApiFetch(
        "/account/password",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
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

      notify(data.message || "Password successfully changed", "SUCCESS");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
          updatePassword();
          e.preventDefault();
        }}
        className={`${global.inputContainer} ${global.glassyBackground}`}
      >
        <BrandHeader title="Update Password" />

        <PasswordField
          password={oldPassword}
          setPassword={setOldPassword}
          title="Old Password"
        />
        <PasswordField
          password={newPassword}
          setPassword={setNewPassword}
          title="New Password"
        />
        <PasswordField
          password={confirmPassword}
          setPassword={setConfirmPassword}
          title="Confirm Password"
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

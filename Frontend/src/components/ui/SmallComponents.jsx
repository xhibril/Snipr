import logo from "../../assets/images/logo.svg";
import styles from "./SmallComponents.module.css";
import global from "../../css/Global.module.css"
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import OffcutLogo from "./OffcutLogo.jsx";
import { Moon, Sun } from "lucide-react";

export const DEFAULT_FAILURE_MESSAGE = "Something went wrong, please try again";

export function EmailField({ email, setEmail, title }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{title}</label>

      <input
        className={styles.fieldInput}
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      ></input>
    </div>
  );
}

export function PasswordField({ password, setPassword, title }) {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{title}</label>
      <input
        className={styles.fieldInput}
        placeholder="•••••"
        value={password}
        type={isToggled ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
      ></input>

      <FiEye
        className={styles.togglePassword}
        onClick={() => setIsToggled(!isToggled)}
      />
    </div>
  );
}

export function CodeField({ code, setCode, title }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{title}</label>

      <input
        className={styles.fieldInput}
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></input>
    </div>
  );
}

export function UsernameField({ username, setUsername, title }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{title}</label>

      <input
        className={styles.fieldInput}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
    </div>
  );
}

export function BrandHeader({ title }) {
  const nav = useNavigate();

  return (
    <div className={styles.brandContainer} onClick={() => nav("/")}>
      <div className={styles.brandTop}>
        <OffcutLogo className = {styles.logo}/>
        <p className={styles.brandText}>Offcut</p>
      </div>

      <h1>{title}</h1>
    </div>
  );
}

export function BackButton({ onClick }) {
  return (
    <button className={styles.back} type="button" onClick={onClick}>
      <ArrowLeft className={styles.backArrow} />
      <p>Back</p>
    </button>
  );
}

export function HandleBack(steps, currentStep, setStep, nav, destination) {
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex <= 0) {
    nav(destination);
    return;
  }

  setStep(steps[currentIndex - 1]);
}



export function ThemeIcon({theme, className}){
 return (
    <>
      {theme === "light" ? (
        <Moon className = {`${global.themeBtns} ${className || ""}`} />
      ) : (
        <Sun className = {`${global.themeBtns} ${className || ""}`}/>
      )}
    </>
  );

}
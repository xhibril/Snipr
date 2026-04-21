import styles from "./Landing.module.css"
import logo from "../../assets/images/logo.png"

export default function Landing() {


  return <>

    <div className={styles.mainContainer}>


      <div className={styles.topRow}>

        <div className={styles.brand}>
          <img src={logo} className={styles.brandLogo} />
          <h1 className={styles.brandTitle}> SNIPR</h1>
        </div>

        <nav className={styles.navBar}>
          <a>Home</a>
          <a>About us</a>
          <a>Features</a>
          <a>Contact</a>

        </nav>


        <div className={styles.authRow}>
          <button className={styles.signupBtn}>Sign up</button>
          <button className={styles.loginBtn}>Login</button>
        </div>

      </div>


      <div className = {styles.heroSection}>


<h1 className = {styles.heroText}>
  Manage your code snippets with ease
</h1>

<p className = {styles.miniDesc}>Stay organized, save snippets quickly, and access them anytime you need.</p>

      </div>



    </div>
  </>
}




import styles from "./Landing.module.css"
import logo from "../../assets/images/logo.png"
import folder from "../../assets/images/folderIcon.svg"
import cloud from "../../assets/images/cloudIcon.svg"
import search from "../../assets/images/searchIcon.svg"
import copy from "../../assets/images/copyIcon.svg"
import pin from "../../assets/images/pin.svg"

import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { useState } from "react"

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
          <a href = "#features">Features</a>
          <a>Support</a>

        </nav>


        <div className={styles.authRow}>
          <button className={styles.signupBtn}>Sign up</button>
          <button className={styles.loginBtn}>Login</button>
        </div>

      </div>


      <div className={styles.heroSection}>
        <h1 className={styles.heroText}>
          Manage your code snippets with ease
        </h1>

        <p className={styles.miniDesc}>Stay organized, save snippets quickly, and access them anytime you need.</p>

        <button className={styles.heroSectionBtn}>Try now</button>
      </div>





      <div className={styles.features} id = "features">
        <h1 className={styles.featuresText}>FEATURES</h1>


        <div className={styles.topRowFeatures}>

          <div className={styles.feature}>
            <img src={folder} className={styles.featureIcon} />
            <h2>Stay organized</h2>
            <p>Save, group, and access your code in a way that actually makes sense when you come back later.</p>

          </div>


          <div className={styles.feature}>
            <img src={cloud} className={styles.featureIcon} />
            <h2>Access anywhere</h2>
            <p>Your snippets are securely stored and available wherever you log in.</p>
          </div>

        </div>






        <div className={styles.bottomRowFeatures}>

          <div className={styles.feature}>
            <img src={search} className={styles.featureIcon} />
            <h2>Access anywhere</h2>
            <p>Instantly find any snippet with keywords, tags, or filters.</p>


          </div>

          <div className={styles.feature}>
            <img src={copy} className={styles.featureIcon} />
            <h2>Copy in one click</h2>
            <p>Copy any snippet instantly without wasting time.</p>

          </div>


          <div className={styles.feature}>
            <img src={pin} className={styles.featureIcon} />
            <h2>Favorites</h2>
            <p>Keep your most-used snippets at the top for quick access.</p>
          </div>

        </div>








      </div>

      <FAQ />


              <div className={styles.footerContainer}>

                <footer> © 2026 Xhibril </footer>
                <a href="https://github.com/xhibril" target="_blank">GitHub</a>
                <a href="https://www.linkedin.com/in/xhibril-lleshi/" target="_blank">LinkedIn </a>
                <a href="mailto:xhibril.dev@gmail.com" target="_blank">Email</a>
            </div>
    </div>
  </>
}


function FAQ() {

  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Do I need an account?",
      answer: "Yes. It lets you save and access your snippets from anywhere."
    },

    {
      question: "Is it free?",
      answer: "Yes, core features are free to use."
    },

    {
      question: "Can I access my snippets on multiple devices?",
      answer: "Yes, just log in and everything is there."
    },

    {
      question: "Is my code private?",
      answer: "Yes, your snippets are only visible to you."
    }
  ]


  return <>
    <div className={styles.faqs}>
      <h1 className={styles.faqsText}>FAQS</h1>



      <div className={styles.faqWrapper}>
        {faqs.map((faqs, index) =>


          <div className={styles.question}>

            <h2 onClick={() => setActiveIndex(activeIndex === index ? null : index)}> {faqs.question}


           
                        {activeIndex === index ? (
                            <FiArrowUp className={styles.arrowUp} />
                        ) :
                            <FiArrowDown className={styles.arrowDown}
                            />}


              
            </h2>


            {activeIndex === index && (
              <p className={`${styles.answer} ${styles.show}`}>{faqs.answer}</p>
            )
            }


          </div>
        )}


      </div>

    </div>

  </>

}

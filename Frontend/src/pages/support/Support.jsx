import Header from "../../components/landing/LandingHeader.jsx";
import Footer from "../../components/landing/LandingFooter.jsx";
import styles from "./Support.module.css";
import global from "../../css/Global.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What happens to my snippets if I delete my account?",
    answer: "Your snippets alongside all your data will be deleted.",
  },

  {
    question: "Can I restore a snippet after deleting it?",
    answer: "A snippet can be restored within 30 days after being deleted.",
  },

  {
    question: "Why isn't my snippet saving?",
    answer: `Higzo automatically saves your changes as you edit. 
        If your changes aren't being saved, check your internet connection and try refreshing the page. 
        Make sure you give the save operation time to complete before leaving the editor.
        `,
  },

  {
    question: "Can I access my snippets on another device?",
    answer:
      "Yes, you can log in your Higzo account from another device and access your snippets",
  },

  {
    question: "What happens if I change my email address?",
    answer: `Your account will be associated with your new email address. 
        You may need to verify it before the change takes effect.`,
  },

  {
    question: "Are my snippets private?",
    answer:
      "Your snippets are private and can only be accessed through your account.",
  },

  {
    question: "Can Higzo be used on mobile?",
    answer: `Higzo can be used on mobile, but is not recommended. 
    Higzo is best used on larger screens such desktops or tablets.`,
  },
];

export default function Support() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <Header />

      <main>
        <div className={styles.supportLayout}>
          <section>
            <div className={global.container}>
              <div className={styles.faqs}>
                <h1>FAQS</h1>

                <ul className={styles.questionsList}>
                  {faqs.map((faq, index) => (
                    <li
                      className={styles.questionItem}
                      key={index}
                      onClick={() =>
                        setActiveIndex(activeIndex === index ? null : index)
                      }
                    >
                      <div className={styles.questionItemTop}>
                        <h3 className={styles.question}>{faq.question}</h3>

                        {activeIndex === index ? (
                          <ChevronUp className={styles.arrow} />
                        ) : (
                          <ChevronDown className={styles.arrow} />
                        )}
                      </div>

                      {activeIndex === index && (
                        <p className={`${styles.answer} ${styles.toggle}`}>
                          {faq.answer}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className={global.container}>
              <div className={styles.contact}>
                <header className={styles.contactHeader}>
                  <h1>Still need more help?</h1>
                  <p>Feel free to send a message</p>
                </header>
                <form
                  className={styles.contactForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className={styles.formGroupContainer}>
                    <div className={styles.formGroup}>
                      <label>Name</label>
                      <input type="text" />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input type="email" />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subject</label>
                    <input type="text" />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Message</label>
                    <input type="text" />
                  </div>

                  <button
                    type="submit"
                    className={`${global.landingBtn} ${global.landingPrimary}`}
                  >
                    Send message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

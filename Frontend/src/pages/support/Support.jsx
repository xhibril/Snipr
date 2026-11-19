import Header from "../../components/landing/LandingHeader.jsx";
import Footer from "../../components/landing/LandingFooter.jsx";
import styles from "./Support.module.css";
import global from "../../css/Global.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ValidateEmail } from "../../components/utils/Validation.jsx";
import apiFetch from "../../components/utils/Api.jsx";
import { useNavigate } from "react-router-dom";

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
    answer: `Offcut automatically saves your changes as you edit. 
        If your changes aren't being saved, check your internet connection and try refreshing the page. 
        Make sure you give the save operation time to complete before leaving the editor.
        `,
  },

  {
    question: "Can I access my snippets on another device?",
    answer:
      "Yes, you can log in your Offcut account from another device and access your snippets",
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
    question: "Can Offcut be used on mobile?",
    answer: `Offcut can be used on mobile, but is not recommended. 
    Offcut is best used on larger screens such desktops or tablets.`,
  },
];

export default function Support({ notify }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  async function sumbitTicket() {
    const validateEmail = ValidateEmail(email);

    if (validateEmail !== "VALID") {
      notify(validateEmail, "ERROR");
      return;
    }

    if (message.length < 10) {
      notify("Message must be at least 10 characters", "ERROR");
      return;
    }

    if (message.length > 2000) {
      notify("Message cannot exceed 2000 characters", "ERROR");
      return;
    }

    try {
      setIsLoading(true);

      const res = await apiFetch("/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, email, message }),
      }, notify, nav);

      if (!res) {
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        notify(
          data.message || "Could not send message, please try again.",
          "ERROR",
        );
        return;
      }

      notify("Message successfully sent", "SUCCESS");

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  }

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
                    sumbitTicket();
                  }}
                >
                  <div className={styles.formGroupContainer}>
                    <div className={styles.formGroup}>
                      <label>Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Message</label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${global.btn} ${global.btnPrimary} ${styles.btn}`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send message"}
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

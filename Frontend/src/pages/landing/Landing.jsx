import styles from "./Landing.module.css";
import { Folder, File } from "lucide-react";
import { SiPython, SiJavascript } from "react-icons/si";
import { FaJava } from "react-icons/fa";


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FaJ } from "react-icons/fa6";

export default function Landing() {
  const nav = useNavigate();

  const effectSnippet = `const [value, setValue] = useState(0);
                         useEffect(() => {
                         console.log(value);
                         }, [value]);`;

  const mergerSnippet = `defaults = {"theme": "dark", "lang": "en"}
                         user = {"lang": "fr"}
                         merged = {**defaults, **user}`;

  const apiSnippet = `export async function getSnippets() {
                      const response = await fetch("/api/snippets");

                      if (!response.ok) {
                        throw new Error("Could not load snippets");
                      }

                      return response.json();
                    }`;


  const javaSnippet = `public class App {
  public static void main(String[] args) {
    System.out.println("Hello, Snipr!");
  }
}`

  const [code, setCode] = useState(effectSnippet);
  const [title, setTitle] = useState("useEffect.js");

  const sections = {
    organize: {
      label: "Organize",
      features: [
        {
          title: "Folders & nesting",
          desc: "Folders inside folders, like your file tree.",
        },
        { title: "Tags", desc: "Label snippets and filter by them." },
        { title: "Favorites", desc: "Star the ones you use all the time." },
        {
          title: "Pin to top",
          desc: "Keep a few snippets above the rest of a folder.",
        },
        { title: "Drag & drop", desc: "Move snippets between folders." },
      ],
    },

    search: {
      label: "Search",
      features: [
        {
          title: "Instant search",
          desc: "Find by title, code or tag as you type.",
        },
        {
          title: "Filter by language",
          desc: "Show only Python, only React, and so on.",
        },
        {
          title: "Recent snippets",
          desc: "The last ones you opened or copied.",
        },
      ],
    },

    storage: {
      label: "Storage & account",
      features: [
        {
          title: "Saved to your account",
          desc: "Snippets are stored on the server, not in your browser, so clearing your cache won't delete them.",
        },
        {
          title: "Login from anywhere",
          desc: "Log in on any device and your whole library is there.",
        },
        {
          title: "Email verification",
          desc: "Confirm your address when you sign up.",
        },
        {
          title: "Password reset",
          desc: "Get back in with a code sent to your email.",
        },
        {
          title: "Export your data",
          desc: "Download everything as JSON whenever you want.",
        },
      ],
    },
  };

  const [activeKey, setActiveKey] = useState("organize");
  const active = sections[activeKey];

  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTop}>
            <h1>HIGZO</h1>

            <div className={styles.headerNav}>
              <nav className={styles.nav}>
                <a href="#about">About</a>
                <a href="#features">Features</a>
                <a href="#support">Support</a>
              </nav>
            </div>

            <div className={styles.headerActions}>
              <a class={`${styles.button} ${styles.primary}`}>Signup</a>
              <a class={`${styles.button} ${styles.secondary}`}>Login</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <h1>Stop digging through old projects for that one snippet.</h1>
              <p>
                Save your snippets, group them in folders, copy them when you
                need them.
              </p>

              <div className={styles.heroActions}>
                <a class={`${styles.button} ${styles.primary}`}>Get started</a>
                <a class={`${styles.button} ${styles.secondary}`}>
                  Explore features
                </a>
              </div>
            </div>

            <div className={styles.preview}>
              <aside className={styles.previewFiles}>
                <ul className={styles.fileList}>
                  <li className={styles.fileItem}>
                    <Folder className={styles.folderIcon} />
                    <span>Javascript</span>
                  </li>

                  <li className={styles.fileItem}>
                    <Folder className={styles.folderIcon} />
                    <span>React</span>
                  </li>

                  <li
                    className={styles.fileItem}
                    onClick={() => {
                      setTitle("useEffect.js");
                      setCode(effectSnippet);
                    }}
                  >
                    <SiJavascript className={styles.fileIcon} />
                    <span>useEffect.js</span>
                  </li>

                  <li
                    className={styles.fileItem}
                    onClick={() => {
                      setTitle("Merger.py");
                      setCode(mergerSnippet);
                    }}
                  >
                    <SiPython className={styles.fileIcon} />
                    <span>Merger.py</span>
                  </li>


                  <li
                    className={styles.fileItem}
                    onClick={() => {
                      setTitle("api.js");
                      setCode(apiSnippet);
                    }}
                  >
                    <SiJavascript className={styles.fileIcon} />
                    <span>api.js</span>
                  </li>

                     <li
                    className={styles.fileItem}
                    onClick={() => {
                      setTitle("App.java");
                      setCode(javaSnippet);
                    }}
                  >
                    <FaJava className={styles.fileIcon} />
                    <span>App.java</span>
                  </li>
                </ul>
              </aside>
              <div className={styles.previewCode}>
                <h4 className={styles.previewCodeTitle}>{title}</h4>

                <p
                  style={{ whiteSpace: "pre-wrap" }}
                  className={styles.previewCodeBody}
                >
                  {code}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.aboutContainer}>
            <h2 className={styles.sectionTitle}>ABOUT</h2>

            <div className={styles.grid}>
              <article>
                <h2>Why Higzo?</h2>
                <p>
                  {`
                  Higzo was made to make life a little easier for developers.
                  Save snippets, find them when you need them, and reuse them
                  without having to dig through old projects or files.`}
                </p>
              </article>

              <article>
                <h2>The idea</h2>
                <p>
                  {`
                  Keep the interface simple, avoid unnecessary clutter, and
                  focus on getting things done. And you don't have to be a
                  developer to use it. Higzo works just as well for keeping
                  notes and other useful information.`}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.sectionTitle}> FEATURES</h2>

            <div className={styles.featuresLayout}>
              <aside className={styles.featuresSideBar}>
                <ul className={styles.featuresList}>
                  {Object.entries(sections).map(([key, section]) => (
                    <li
                      key={key}
                      onClick={() => setActiveKey(key)}
                      className={styles.featuresItem}
                    >
                      <span>{section.label}</span>
                      <span>{section.features.length}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className={styles.featureDetails}>
                <h3>{active.label}</h3>
                {active.features.map((f) => (
                  <div key={f.title} className={styles.featureDetailItem}>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <h2>HIGZO</h2>

            <div className={styles.footerLinks}>
              <a>Github</a>
              <a>Email</a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 Higzo. All rights reserved.</p>
            <p>Personal project</p>
          </div>
        </div>
      </footer>
    </>
  );
}

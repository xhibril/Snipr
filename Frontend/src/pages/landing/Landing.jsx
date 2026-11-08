import styles from "./Landing.module.css";
import { Folder } from "lucide-react";
import { SiPython, SiJavascript } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ui/ThemeToggle";

const effectSnippet = `const [value, setValue] = useState(0);
const [isSaving, setIsSaving] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    console.log(value);
    setIsSaving(false);
  }, 500);
  return () => clearTimeout(timer);
}, [value]);`;

const mergerSnippet = `defaults = {"theme": "dark", "lang": "en"}
user = {"lang": "fr", "font_size": 16}

merged = defaults.copy()
merged.update(user)
merged["updated_at"] = "today"

print(f"Theme: {merged['theme']}")
print(f"Language: {merged['lang']}")
print(merged)`;

const apiSnippet = `export async function getSnippets() {
  const response = await fetch("/api/snippets");

  if (!response.ok) {
    throw new Error("Could not load snippets");
  }

  const snippets = await response.json();
  return snippets;
}`;

const javaSnippet = `public class App {
  public static void main(String[] args) {
    String name = "Snipr";
    int snippetCount = 4;
    
    String message = "Welcome to " + name;
    System.out.println(message);
    System.out.println("Saved snippets: " + snippetCount);
    System.out.println("Your library is ready");
  }
}`;

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
        title: "Export your data",
        desc: "Download everything as JSON whenever you want.",
      },
    ],
  },
};

export default function Landing() {
  const [code, setCode] = useState(effectSnippet);
  const detailsRef = useRef(null);
  const [title, setTitle] = useState("useEffect.js");
  const nav = useNavigate();

  return (
    <>
      <header>
        <div className={styles.headerContainer}>
          <div className={styles.headerTop}>
            <h1>HIGZO</h1>

            <div className={styles.headerNav}>
              <nav className={styles.nav}>
                <a href="#about">About</a>
                <a href="#features">Features</a>
                <a onClick={() => nav("/support")}>Support</a>
              </nav>
            </div>

            <div className={styles.headerActions}>
              <ThemeToggle />
              <a
                className={`${styles.button} ${styles.primary}`}
                onClick={() => nav("/signup")}
              >
                Signup
              </a>
              <a
                className={`${styles.button} ${styles.secondary}`}
                onClick={() => nav("/login")}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1>Stop digging through old projects for that one snippet.</h1>
              <p>
                Save your snippets, group them in folders, copy them when you
                need them.
              </p>

              <div className={styles.heroActions}>
                <a
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => nav("/dashboard")}
                >
                  Get started
                </a>
                <a
                  className={`${styles.button} ${styles.secondary}`}
                  href="#features"
                >
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
                <p className={styles.previewCodeBody}>{code}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>ABOUT</h2>

            <div className={styles.aboutGrid}>
              <article>
                <h2>Why Higzo?</h2>
                <p>
                  {`Higzo was made to make life a little easier for developers.
                  Save snippets, find them when you need them, and reuse them
                  without having to dig through old projects or files.`}
                </p>
              </article>

              <article>
                <h2>The idea</h2>
                <p>
                  {`Keep the interface simple, avoid unnecessary clutter, and
                  focus on getting things done. And you don't have to be a
                  developer to use it. Higzo works just as well for keeping
                  notes and other useful information.`}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="features">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>FEATURES</h2>

            <div className={styles.featuresLayout}>
              <aside className={styles.featuresSideBar}>
                <ul className={styles.featuresList}>
                  {Object.entries(sections).map(([key, section]) => (
                    <li
                      key={key}
                      onClick={(e) => {
                        const container = detailsRef.current;
                        const target = document.getElementById(
                          `feature-${key}`,
                        );

                        container.scrollTo({
                          top: target.offsetTop - container.offsetTop,
                          behavior: "smooth",
                        });
                      }}
                      className={styles.featuresItem}
                    >
                      <span>{section.label}</span>
                      <span>{section.features.length}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className={styles.featuresDetailsList} ref={detailsRef}>
                <div className={styles.featuresDetails}>
                  {Object.entries(sections).map(([key, section]) => (
                    <div
                      className={styles.featuresDetailItemContainer}
                      key={key}
                      id={`feature-${key}`}
                    >
                      <h3 className = {styles.featureSectionTitle}>{section.label}</h3>

                      {section.features.map((f) => (
                        <div
                          key={f.title}
                          className={styles.featuresDetailItem}
                        >
                          <h4>{f.title}</h4>
                          <p>{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <h2>HIGZO</h2>

            <div className={styles.footerLinks}>
              <a
                href="https://github.com/xhibril"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
              <a href="mailto:contact@xhibril.dev" target="_blank">
                Email
              </a>
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

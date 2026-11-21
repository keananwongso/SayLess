import Image from "next/image";
import Link from "next/link";
import { LandingPreview } from "@/components/landing-preview";
import styles from "./landing.module.css";

const steps = [
  { title: "Notice your patterns.", text: "Start with Communication Wrapped. See the words and phrases you come back to.", mark: "··", color: "yellow" },
  { title: "Try one small change.", text: "Record a short pitch. Get one specific suggestion to try in your next take.", mark: "〰", color: "pink" },
  { title: "Hear the difference.", text: "Replay both takes, compare your habits, and take what works into your next conversation.", mark: "⌣", color: "green" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className="wordmark" aria-label="SayLess home"><span className={styles.brandDot} aria-hidden="true">··</span>sayless</Link>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a className={styles.howLink} href="#how-it-works">How it works</a>
          <Link className={styles.demoLink} href="/demo">Demo</Link>
        </nav>
      </header>
      <main className={styles.main} id="main">
        <section className={styles.hero} aria-labelledby="landing-title">
          <p className={styles.eyebrow}>A little practice. A little more you.</p>
          <h1 id="landing-title">say less.<br /><span>mean more.</span></h1>
          <p className={styles.intro}>Your ideas deserve to be heard.<br />Discover your habits, practice your pitch, and find a clearer way to say what matters.</p>
          <div className={styles.actions}>
            <Link className="primary" href="/demo">Try the demo</Link>
            <a className={styles.textLink} href="#how-it-works">See how it works</a>
          </div>
          <p className={styles.note}>No account. No pressure. Start with a sample.</p>
        </section>
        <LandingPreview />
        <section className={styles.howSection} id="how-it-works" aria-labelledby="how-title">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Small steps. Real conversations.</p>
            <h2 id="how-title">a clearer voice.<br />still entirely yours.</h2>
          </div>
          <div className={styles.steps}>
            {steps.map((step) => (
              <article key={step.title}>
                <span className={`${styles.dot} ${styles[step.color]}`} aria-hidden="true">{step.mark}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.closing} aria-labelledby="closing-title">
          <figure className={styles.art}>
            <Image src="/landing/sayless-coaching-collage.png" alt="Playful illustrated phones showing speech, voice practice, and progress." width={1536} height={1024} sizes="(max-width: 700px) 90vw, 320px" />
          </figure>
          <div>
            <p className={styles.kicker}>Built for the next time you speak up</p>
            <h2 id="closing-title">not a perfect speaker.<br />a more confident you.</h2>
            <p>A pitch, a presentation, an idea worth sharing. Give yourself a little space to practice.</p>
            <Link className="primary" href="/practice#practice">Practice your pitch</Link>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href="/" className="wordmark">sayless</Link>
        <p>Say it your way.</p>
        <Link href="/demo">Explore the demo</Link>
      </footer>
    </div>
  );
}

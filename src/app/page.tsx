import Link from "next/link";
import { LandingPreview } from "@/components/landing-preview";
import { SayLessDot } from "@/components/sayless-dot";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className="wordmark" aria-label="SayLess home"><SayLessDot mood="pause" color="lavender" className={styles.brandDot} />sayless</Link>
        <nav className={styles.navigation} aria-label="Main navigation">
          <Link className={styles.howLink} href="/architecture">Architecture</Link>
          <Link href="/demo">Demo</Link>
          <Link className={styles.demoLink} href="/app">Use SayLess</Link>
        </nav>
      </header>
      <main className={styles.main} id="main">
        <section className={styles.hero} aria-labelledby="landing-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Your AI communication coach</p>
            <h1 id="landing-title">say less.<br /><span>mean more.</span></h1>
            <p className={styles.intro}>Find your patterns. Practice your pitch.<br />Sound more like you.</p>
            <div className={styles.actions}>
              <Link className="primary" href="/app">Use SayLess</Link>
              <Link className={styles.textLink} href="/demo">Try the demo</Link>
            </div>
            <p className={styles.note}>No account needed.</p>
          </div>
          <figure className={styles.dotArt} aria-label="Colorful SayLess dot characters">
            <SayLessDot mood="curious" color="lavender" className={styles.dotCurious} />
            <SayLessDot mood="pause" color="melon" className={styles.dotPause} />
            <SayLessDot mood="bright" color="jonquil" className={styles.dotBright} />
            <SayLessDot mood="calm" color="mint" className={styles.dotCalm} />
          </figure>
        </section>
        <LandingPreview />
        <section className={styles.howSection} id="how-it-works" aria-labelledby="how-title">
          <h2 id="how-title">notice. practice. repeat.</h2>
          <div className={styles.steps}>
            <article><SayLessDot mood="curious" color="jonquil" className={styles.stepDot} /><h3>Find your patterns</h3><p>See the words you lean on.</p></article>
            <article><SayLessDot mood="pause" color="lavender" className={styles.stepDot} /><h3>Make one change</h3><p>Record a pitch. Get a focused tip.</p></article>
            <article><SayLessDot mood="calm" color="mint" className={styles.stepDot} /><h3>Hear your progress</h3><p>Replay both takes. Keep what works.</p></article>
          </div>
        </section>
        <section className={styles.closing} aria-labelledby="closing-title">
          <h2 id="closing-title">your next take starts here.</h2>
          <Link className="primary" href="/app#practice">Practice your pitch</Link>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href="/" className="wordmark">sayless</Link>
        <p>Say it your way.</p>
        <Link href="/architecture">Architecture</Link>
        <Link href="/demo">Demo</Link>
      </footer>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className="wordmark" aria-label="SayLess home"><span className={styles.brandDot} aria-hidden="true">··</span>sayless</Link>
        <nav className={styles.tabs} aria-label="Main navigation">
          <Link href="/" aria-current="page">Home</Link>
          <Link href="/demo">Demo <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="landing-title">
          <div className={styles.copy}>
            <p className={styles.eyebrow}><span aria-hidden="true" /> A little practice. A little more you.</p>
            <h1 id="landing-title">say less.<br /><span>mean more.</span></h1>
            <p className={styles.intro}>Meet your AI communication coach. Discover your habits, practice your pitch, and find a clearer way to say what matters.</p>
            <Link className="primary" href="/demo">Try the demo <span aria-hidden="true">↗</span></Link>
            <p className={styles.note}>Start with a sample. No account needed.</p>
          </div>
          <figure className={styles.art}>
            <div className={styles.artLabel}><span aria-hidden="true">✳</span> A little self-discovery looks good on you.</div>
            <Image src="/landing/sayless-coaching-collage.png" alt="Illustrated phones with speech bubbles, a voice waveform, and progress bars, surrounded by colorful dot characters." width={1536} height={1024} sizes="(max-width: 700px) 100vw, 55vw" preload />
            <figcaption>Discover. Practice. Find your voice.</figcaption>
          </figure>
        </section>
        <section className={styles.steps} aria-label="How SayLess works">
          <article><span className={`${styles.dot} ${styles.yellow}`} aria-hidden="true">··</span><div><h2>Notice your patterns.</h2><p>Your Communication Wrapped brings familiar words and phrases into focus.</p></div></article>
          <article><span className={`${styles.dot} ${styles.pink}`} aria-hidden="true">〰</span><div><h2>Give it a go.</h2><p>Record a short pitch and get one specific suggestion for your next take.</p></div></article>
          <article><span className={`${styles.dot} ${styles.green}`} aria-hidden="true">↗</span><div><h2>See what changes.</h2><p>Compare your takes and build confidence, one small practice at a time.</p></div></article>
        </section>
      </main>
      <footer className={styles.footer}><span>sayless · say it your way.</span><span>Made for real people. And real conversations.</span></footer>
    </div>
  );
}

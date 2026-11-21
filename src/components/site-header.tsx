import Link from "next/link";
import { SayLessDot } from "./sayless-dot";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link className="wordmark" href="/" aria-label="SayLess home">
          <SayLessDot mood="pause" color="lavender" className={styles.brandDot} />
          sayless
        </Link>
        <nav className={styles.navigation} aria-label="Main navigation">
          <Link href="/architecture">Architecture</Link>
          <Link href="/demo">Demo</Link>
          <Link className={styles.appLink} href="/app">Use SayLess</Link>
        </nav>
      </header>
    </>
  );
}

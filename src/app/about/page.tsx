import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.eyebrow}>Methodology</div>
        <h1 className={styles.title}>How It Works</h1>
        <p className={styles.subtitle}>
          Or: how we reduced the entirety of human ethics to a JavaScript function
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What Is This?</h2>
          <div className={styles.body}>
            <p>
              The Monsters Calculator is a tool for thinking through one of culture&apos;s most
              persistent questions: <em>can you separate the art from the artist?</em> It doesn&apos;t
              give you the answer. It gives you a number. Which is basically the same thing, but
              with more decimal places.
            </p>
            <p>
              The framework is inspired by critic Claire Dederer&apos;s essay &ldquo;What Do We Do
              with the Art of Monstrous Men?&rdquo; and her subsequent book <em>Monsters: A Fan&apos;s Dilemma</em>,
              which asks whether the stain of an artist&apos;s acts bleeds into their work — and whether
              that should change how we engage with it.
            </p>
            <p>
              We tried to answer that with math. We&apos;re sorry.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Four Lenses</h2>
          <div className={styles.body}>
            <p>
              Each artist is evaluated through four ethical frameworks, weighted equally. Because
              if one branch of moral philosophy was enough, philosophers would have stopped at one.
            </p>
          </div>
          <div className={styles.lenses}>
            <div className={styles.lens}>
              <h3 className={styles.lensTitle}>Consequentialism</h3>
              <p>
                What was the actual harm? How many victims? How severe and irreversible were the
                acts? Utilitarian math: the greatest suffering for the greatest number scores
                highest on the monster scale.
              </p>
            </div>
            <div className={styles.lens}>
              <h3 className={styles.lensTitle}>Deontology</h3>
              <p>
                Were categorical moral rules violated? Acts involving children, coercion, violence,
                and bodily autonomy trigger hard penalties regardless of context. Kant doesn&apos;t
                do nuance.
              </p>
            </div>
            <div className={styles.lens}>
              <h3 className={styles.lensTitle}>Virtue Ethics</h3>
              <p>
                What kind of person does this behavior reveal? A consistent pattern of abuse across
                time suggests not a lapse in judgment but a character. Aristotle would not be amused.
              </p>
            </div>
            <div className={styles.lens}>
              <h3 className={styles.lensTitle}>Care Ethics</h3>
              <p>
                How did this person treat those in their immediate circle — collaborators, partners,
                the vulnerable? Power differentials and proximity to victims are weighted here.
                Caring matters.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Art Side</h2>
          <div className={styles.body}>
            <p>
              The art score is separate from the monster score — and that tension is the whole
              point. We evaluate art on three axes:
            </p>
            <ul className={styles.list}>
              <li><strong>Significance</strong> — does the work matter culturally, historically?</li>
              <li><strong>Influence</strong> — did it change what came after it?</li>
              <li><strong>Replaceability</strong> — could someone else have made this? (Low
                replaceability = harder to dismiss.)</li>
            </ul>
            <p>
              We also consider whether the medium &ldquo;carries&rdquo; the artist&apos;s persona — a director&apos;s
              face is not on screen, a singer&apos;s voice is — and how much the biographical context
              has contaminated the work itself.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Time &amp; Accountability</h2>
          <div className={styles.body}>
            <p>
              A monster who faced consequences is different from one who evaded them. A crime
              committed fifty years ago and a crime committed last year are morally equivalent
              but practically different. The calculator tries to encode both.
            </p>
            <p>
              If an artist is still alive, still profiting, still being feted at award ceremonies
              while their victims are still alive — that changes the calculus. A dead painter
              can&apos;t cash your streaming royalties.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Final Score</h2>
          <div className={styles.body}>
            <p>
              The <strong>Consumability Index</strong> is a 0–100 score combining the monster
              score, the art score, temporal factors, and accountability. Higher means more
              defensible to consume. Lower means you&apos;re on your own.
            </p>
            <p>
              The score is not a permission slip. It is not absolution. It is a tool for thinking,
              not for avoiding thought. The question of whether to watch <em>Chinatown</em> is
              one you will have to answer yourself. We just wanted to give you a number to argue with.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Disclaimer</h2>
          <div className={styles.body}>
            <p>
              This calculator is not a court of law. The scores are not verdicts. The data is
              imperfect. The framework is imperfect. We are imperfect. This is an exercise in
              structured thinking about a problem that doesn&apos;t have clean answers, and anyone
              who tells you otherwise is selling something.
            </p>
            <p>
              We do not claim objectivity. We claim rigor and honesty about our assumptions.
              That&apos;s the best any of us can do.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

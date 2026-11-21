export function ConversationStub() {
  return (
    <section className="conversation-stub" aria-labelledby="simulator-title">
      <div>
        <p className="eyebrow stub-label">AI conversation simulator · next</p>
        <h2 id="simulator-title">Practice the back-and-forth.</h2>
        <p>Today’s MVP coaches one recorded project pitch. The next step is an AI partner that can respond in the moment and tailor the next question to your habits.</p>
      </div>
      <ul className="scenario-list" aria-label="Planned simulator scenarios">
        <li>Job interview</li>
        <li>Networking</li>
        <li>Difficult conversation</li>
      </ul>
    </section>
  );
}

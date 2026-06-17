export function Hero() {
  return (
    <section className="hero section section--top" id="top">
      <div className="hero__copy reveal reveal--one">
        <h1>
          Stop every model from
          <br />
          relearning the same mess.
        </h1>
        <p className="hero__lede">
          Latchet keeps decisions, failed attempts, environment quirks, and the next action in one local ledger so each coding agent starts from real task state instead of chat residue.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#tooling">
            See the workflow
          </a>
          <a className="button button--ghost" href="https://github.com/aviralgarg05/latchet" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="hero__terminal">
          <span className="hero__prompt">$ latchet init</span>
          <span className="hero__caption">Create a durable source of truth in <code>.taskledger/</code>.</span>
        </div>
      </div>

      <div className="mockup reveal reveal--two" aria-label="Latchet product mockup">
        <div className="mockup__chrome">
          <span />
          <span />
          <span />
          <p>task / org-rbac / state</p>
        </div>

        <div className="mockup__tabs">
          <span className="is-active">State</span>
          <span>Timeline</span>
          <span>Artifacts</span>
          <span>Questions</span>
        </div>

        <div className="mockup__body">
          <div className="mockup__cluster">
            <div className="mockup__card mockup__card--decision">
              <p className="mockup__label">Decision</p>
              <h3>Use PostgreSQL row-level security</h3>
              <p>Tenant isolation must hold outside the API too.</p>
            </div>

            <div className="mockup__card mockup__card--failure">
              <p className="mockup__label">Failure</p>
              <h3>Fixture users missing organization_id</h3>
              <p>Integration tests still fail on scoped claims.</p>
            </div>
          </div>

          <div className="mockup__rail">
            <div className="mockup__mini">
              <p className="mockup__label">Env quirk</p>
              <p><code>FEATURE_TENANT_RBAC=1</code> must be set for local test runs.</p>
            </div>
            <div className="mockup__mini mockup__mini--action">
              <p className="mockup__label">Next action</p>
              <p>Patch auth fixtures, rerun tenant tests, and verify branch freshness.</p>
            </div>
            <div className="mockup__status">
              <span>git: main @ 89f2e77</span>
              <span>artifacts: 3 tracked</span>
              <span>freshness: 2 warnings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

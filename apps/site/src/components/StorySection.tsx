import { painPoints } from "../content";

export function StorySection() {
  return (
    <section className="section story" id="why">
      <div className="story__intro reveal reveal--one">
        <p className="section-kicker">AI work breaks between sessions, not inside them.</p>
        <h2>The hard part is not memory. It is continuity you can actually trust.</h2>
      </div>

      <div className="story__rows">
        {painPoints.map((point, index) => (
          <article className={`story-row reveal reveal--${(index % 3) + 1}`} key={point.title}>
            <div className="story-row__index">{point.index}</div>
            <div className="story-row__body">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="story__statement reveal reveal--three">
        Latchet gives every agent the same source of truth,
        <span> on your machine.</span>
      </p>
    </section>
  );
}

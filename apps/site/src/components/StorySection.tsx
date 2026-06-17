import { painPoints } from "../content";

export function StorySection() {
  return (
    <section className="section story" id="why">
      <div className="section-heading reveal reveal--one">
        <p className="section-kicker">AI work breaks in the gaps between sessions.</p>
        <h2>The hard part is not memory. It is continuity you can actually trust.</h2>
      </div>

      <div className="story__grid">
        {painPoints.map((point, index) => (
          <article className={`story-card reveal reveal--${index + 1}`} key={point.title}>
            <span className="story-card__index">0{index + 1}</span>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
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

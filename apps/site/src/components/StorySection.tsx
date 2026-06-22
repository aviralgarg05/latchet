import { painPoints } from "../content";

export function StorySection() {
  return (
    <section className="section story" id="why">
      <div className="section-intro">
        <h2>Work breaks between sessions, not inside them.</h2>
        <p>Most coding-agent pain is not model quality. It is lost context — decisions that evaporate, failures that get retried, env quirks that vanish.</p>
      </div>

      <ol className="problem-list">
        {painPoints.map((point) => (
          <li className="problem-list__item" key={point.title}>
            <span className="problem-list__index">{point.index}</span>
            <div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
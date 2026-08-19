import React from 'react'

export default function Timeline() {
  const milestones = [
    {
      year: "2026 - Present",
      title: "SPCL Infotech Pvt. Ltd.",
      subtitle: "Internship Reference Under Mr. Sanjay Shah (Founder President)",
      desc: "Actively learning software engineering workflows, including system integration testing, Big Data Analytics tools, database queries, and web application design."
    },
    {
      year: "2024 - 2027",
      title: "Computer Science / Engineering Degree",
      subtitle: "Academic Studies",
      desc: "Studying OOP concepts, database structures, algorithms, version control, and multi-tier application layouts."
    },
    {
      year: "2026",
      title: "YAURA & Dyniq System Architectures",
      subtitle: "Featured Systems Deployment",
      desc: "Successfully designed and deployed backend AI agents (YAURA) and full-stack next-gen restaurant platform prototypes (Dyniq) showcasing technical competency."
    }
  ]

  return (
    <section id="timeline">
      <div className="container">
        <div className="section-header">
          <h3>Chronology</h3>
          <h2>Education &amp; Experience</h2>
        </div>
        <div className="timeline-container">
          {milestones.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-year">{item.year}</div>
                <h3>{item.title}</h3>
                <h4>{item.subtitle}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

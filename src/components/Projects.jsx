import React, { useState } from 'react'

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeIframeUrl, setActiveIframeUrl] = useState(null)
  const [iframeTitle, setIframeTitle] = useState('')

  const projectList = [
    {
      category: "web",
      img: "dyniq_project_mockup.jpg",
      icon: "fa-solid fa-utensils",
      title: "Dyniq Smart Dining",
      desc: "A high-tech dining optimization dashboard for automated queue control, live reservation bookings, digital menu editors, and analytics.",
      tags: ["Next.js 16", "React 19", "Tailwind v4", "TS"],
      url: "https://dabhadeyash22-del.github.io/Portfolio-website/" // fallback mockup
    },
    {
      category: "web",
      img: "printzone_project_mockup.jpg",
      icon: "fa-solid fa-print",
      title: "Print Zone Portal",
      desc: "An elegant, premium landing site for digital printing and signage services, featuring theme styling configurations, scroll-progress bars, and Google Maps integration.",
      tags: ["HTML5", "CSS3", "JavaScript", "Maps API"],
      url: "https://printzone-unit.github.io/print-zone-website/index.html"
    },
    {
      category: "ai",
      img: "yaura_jarvis_actual.jpg",
      icon: "fa-solid fa-robot",
      title: "YAURA AI Agent",
      desc: "A modular python multi-agent execution framework with Flask visual logging, local database indexing, and Gemini integration pipelines.",
      tags: ["Python", "Flask", "Gemini API", "SQLite"],
      url: "https://dabhadeyash22-del.github.io/Portfolio-website/" // local agent telemetry simulation
    },
    {
      category: "web",
      img: "expense_tracker_actual.jpg",
      icon: "fa-solid fa-wallet",
      title: "Budget Expense Tracker",
      desc: "A client-side budget dashboard for document logging, categorization systems, and visual expense tracking analytics.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      url: "https://dabhadeyash22-del.github.io/Expense_tracker/"
    },
    {
      category: "game",
      img: "guessing_game_actual.jpg",
      icon: "fa-solid fa-dice",
      title: "Number Guessing Game",
      desc: "An interactive browser-based arcade guessing game with color-coded hints, score logging, and retro visual designs.",
      tags: ["Flask", "HTML5", "CSS3", "JavaScript"],
      url: "https://dabhadeyash22-del.github.io/Guess-Number-Game/"
    },
    {
      category: "ai",
      img: "library_system_actual.jpg",
      icon: "fa-solid fa-book",
      title: "Library Database Manager",
      desc: "A backend database system designed for catalog control, borrower index booking, and book reservations.",
      tags: ["Java", "MySQL", "OOP Design"],
      url: "https://dabhadeyash22-del.github.io/Library-System/"
    }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projectList 
    : projectList.filter(p => p.category === activeFilter)

  const openProjectPreview = (url, title) => {
    setIframeTitle(title)
    setActiveIframeUrl(url)
  }

  const closePreview = () => {
    setActiveIframeUrl(null)
  }

  return (
    <section id="projects">
      <div className="container">
        <div className="section-header">
          <h3>Showcase</h3>
          <h2>Featured Projects</h2>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
            onClick={() => setActiveFilter('web')}
          >
            Web Dev
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ai')}
          >
            AI &amp; Systems
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'game' ? 'active' : ''}`}
            onClick={() => setActiveFilter('game')}
          >
            Games
          </button>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="project-card" data-category={project.category}>
              <div className="project-img-wrapper">
                <img src={project.img} alt={project.title} />
              </div>
              <div className="project-info">
                <i className={project.icon}></i>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-tags">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx}>{tag}</span>
                  ))}
                </div>
                <button 
                  className="btn"
                  onClick={() => openProjectPreview(project.url, project.title)}
                  style={{ width: '100%', border: 'none', background: 'var(--accent)', color: 'var(--bg)', cursor: 'pointer', padding: '12px 20px', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  Launch Live Sandbox
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive MacBook Simulator Modal */}
      {activeIframeUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '90%', maxWidth: '1000px', background: '#202124', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
            {/* Browser top-bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#35363a', padding: '10px 20px', borderBottom: '1px solid #202124' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span onClick={closePreview} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block', cursor: 'pointer' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
              </div>
              <div style={{ background: '#202124', color: '#fff', fontSize: '0.8rem', padding: '4px 20px', borderRadius: '15px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {iframeTitle} Simulator Portal
              </div>
              <div onClick={closePreview} style={{ color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
            {/* Simulator content viewport */}
            <div style={{ background: '#fff', height: '65vh', width: '100%', position: 'relative' }}>
              <iframe 
                src={activeIframeUrl} 
                title={iframeTitle}
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

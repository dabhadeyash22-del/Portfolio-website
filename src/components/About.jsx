import React, { useState, useRef } from 'react'

export default function About() {
  const [expandedIdx, setExpandedIdx] = useState(null)
  const detailsRefs = useRef([])

  const skills = [
    {
      name: "Java",
      percent: "85%",
      icon: "fa-brands fa-java",
      summary: "OOP classes, multithreading, structures.",
      focus: "Focus: JDBC DB integration, Thread pools, collections, file structures, inheritance, polymorphism."
    },
    {
      name: "Python",
      percent: "80%",
      icon: "fa-brands fa-python",
      summary: "Fundamentals, logic, scripting, backend.",
      focus: "Focus: AI agent orchestrations, Flask API routing, Gemini model integrations, web scraping, automation."
    },
    {
      name: "MySQL",
      percent: "75%",
      icon: "fa-solid fa-database",
      summary: "Relational databases, queries, indexes.",
      focus: "Focus: Normalization models, complex inner/outer joins, nested queries, index optimizations, transactions."
    },
    {
      name: "C / C++",
      percent: "70%",
      icon: "fa-solid fa-code",
      summary: "Pointers, memory control, logic grids.",
      focus: "Focus: Low-level memory controls, pointer arrays, class references, templates, custom logic optimization."
    },
    {
      name: "HTML5 & CSS3",
      percent: "90%",
      icon: "fa-brands fa-html5",
      summary: "Responsive design, variables, page layouts.",
      focus: "Focus: Grid/Flex structures, glassmorphism UI layouts, animated keyframes, media breakpoints, fluid variables."
    },
    {
      name: "Git & GitHub",
      percent: "85%",
      icon: "fa-brands fa-git-alt",
      summary: "Version tracking, repos, releases.",
      focus: "Focus: Branch merge workflows, conflict fixes, deployment to GitHub Pages, repository analytics."
    },
    {
      name: "OOP",
      percent: "80%",
      icon: "fa-solid fa-cube",
      summary: "Encapsulation, interfaces, abstractions.",
      focus: "Focus: Modular class structures, SOLID code design, Singleton/Factory patterns, abstraction models."
    },
    {
      name: "Tools",
      percent: "90%",
      icon: "fa-solid fa-laptop-code",
      summary: "VS Code, linters, debug configs.",
      focus: "Focus: Code extensions, workspace setups, compiler flags, automated build scripts, task runners."
    }
  ]

  const toggleAccordion = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx)
  }

  return (
    <>
      {/* About Section */}
      <section id="about">
        <div class="container">
          <div class="section-header">
            <h3>Discovery</h3>
            <h2>About Me</h2>
          </div>
          <div class="about-grid">
            <div class="about-intro">
              <p>I am Yash Rakesh Dabhade, a dedicated student software engineer focusing on building scalable web interfaces, structured database backends, and agentic AI systems.</p>
              <p>I believe that clean systems design, architectural code practices, and standard logic formatting can turn simple project outlines into high-quality software platforms.</p>
              <div class="about-highlight">
                "Code structures become beautiful when they are built with absolute logic, clean separation of concerns, and robust error safeguards."
              </div>
            </div>
            <div class="about-qualities">
              <div class="qualities-layout">
                <div class="quality-box">
                  <h4>Strengths & Mindset</h4>
                  <ul>
                    <li>Work-oriented and highly consistent</li>
                    <li>Growth-driven attitude toward emerging AI tools</li>
                    <li>Analytical algorithm design capabilities</li>
                    <li>Clean code structure and file organization</li>
                  </ul>
                </div>
                <div class="quality-box">
                  <h4>Areas of Improvement</h4>
                  <ul>
                    <li>Perfecting task completion times and delegation</li>
                    <li>Improving public presentation and code walkthrough skills</li>
                    <li>Studying advanced data structures and design patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <div class="container">
          <div class="section-header">
            <h3>Capabilities</h3>
            <h2>Technical Skills</h2>
          </div>
          <div class="skills-grid">
            {skills.map((skill, idx) => {
              const isExpanded = expandedIdx === idx;
              return (
                <div 
                  key={idx}
                  className={`skill-card ${isExpanded ? 'expanded' : ''}`}
                  style={{ '--percent': skill.percent }}
                  onClick={() => toggleAccordion(idx)}
                >
                  <i className={skill.icon}></i>
                  <h3>{skill.name}</h3>
                  <p>{skill.summary}</p>
                  
                  <div 
                    className="skill-details"
                    ref={el => detailsRefs.current[idx] = el}
                    style={isExpanded ? { maxHeight: detailsRefs.current[idx]?.scrollHeight + 'px' } : { maxHeight: '0px' }}
                  >
                    <div className="skill-bar">
                      <div className="skill-fill"></div>
                    </div>
                    <p>{skill.focus}</p>
                  </div>
                  
                  <div className="expand-hint">
                    <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

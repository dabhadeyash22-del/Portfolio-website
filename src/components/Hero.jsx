import React, { useState, useEffect } from 'react'

export default function Hero() {
  const [text, setText] = useState('')
  const roles = ["Programmer", "Web Developer", "AI Agent Architect", "Software Engineer"]

  useEffect(() => {
    let roleIdx = 0
    let charIdx = 0
    let deleting = false
    let timer

    const typeLoop = () => {
      const current = roles[roleIdx]
      
      if (deleting) {
        setText(current.substring(0, charIdx - 1))
        charIdx--
      } else {
        setText(current.substring(0, charIdx + 1))
        charIdx++
      }

      let typeSpeed = deleting ? 30 : 60

      if (!deleting && charIdx === current.length) {
        typeSpeed = 2000
        deleting = true
      } else if (deleting && charIdx === 0) {
        deleting = false
        roleIdx = (roleIdx + 1) % roles.length
        typeSpeed = 400
      }

      timer = setTimeout(typeLoop, typeSpeed)
    }

    timer = setTimeout(typeLoop, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-details">
          <h3>Welcome to my space</h3>
          <h1>Hi, I'm <span>Yash R. Dabhade</span></h1>
          <div className="typewriter-container">
            <span id="typewriter">{text}</span>
            <span className="cursor-blink">|</span>
          </div>
          <div className="hero-buttons">
            <a href="Yash Rakesh Dabhade Resume.pdf" download className="btn primary">Download CV</a>
            <a href="#contact" className="btn">Get In Touch</a>
          </div>
          <div className="social-links">
            <a href="https://github.com/dabhadeyash22-del" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/yash-dabhade-aa4a79327" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://www.instagram.com/_yash__dabhade_?igsh=MWY5N29vbHJqbWt2ag==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="hero-img-wrapper">
          <img src="img.jpeg" alt="Yash R Dabhade Portrait" />
        </div>
      </div>
    </section>
  )
}

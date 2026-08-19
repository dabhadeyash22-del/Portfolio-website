import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Timeline from './components/Timeline.jsx'
import Contact from './components/Contact.jsx'
import AIChatWidget from './components/AIChatWidget.jsx'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    // 1. Preloader Timeout
    const handleLoad = () => {
      setLoading(false)
    }
    
    window.addEventListener('load', handleLoad)
    const fallbackTimer = setTimeout(() => {
      setLoading(false)
    }, 1200)

    // 2. Scroll Progress Tracker
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)

    // 3. Mouse Gravity coordinates hook
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <>
      {/* 1. BIOS Loader */}
      {loading && (
        <div id="loader" style={{ opacity: 1, visibility: 'visible' }}>
          <h1>YASH</h1>
        </div>
      )}

      {/* 2. Scroll Progress Bar */}
      <div 
        className="progress-bar" 
        id="scroll-progress" 
        style={{ width: `${scrollProgress}%`, zIndex: 99999 }}
      ></div>

      {/* 3. Core Layout Components */}
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Contact />
      </main>

      {/* 4. Chat widget */}
      <AIChatWidget />

      {/* 5. Footer */}
      <footer>
        <p>&copy; {new Date().getFullYear()} Yash R Dabhade. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#timeline">Timeline</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </>
  )
}

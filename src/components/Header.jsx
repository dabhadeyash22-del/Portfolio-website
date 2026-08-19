import React, { useState, useEffect } from 'react'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [navActive, setNavActive] = useState(false)

  useEffect(() => {
    // Sync initial theme
    const cachedTheme = localStorage.getItem('theme')
    if (cachedTheme === 'dark' || (!cachedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header>
      <div className="header-container">
        <a href="#home" className="logo">Yash <span className="logo-expand">Dabhade</span><span className="logo-collapse">D.</span></a>
        
        <nav className={navActive ? 'active' : ''}>
          <a href="#home" onClick={() => setNavActive(false)}>Home</a>
          <a href="#about" onClick={() => setNavActive(false)}>About</a>
          <a href="#skills" onClick={() => setNavActive(false)}>Skills</a>
          <a href="#projects" onClick={() => setNavActive(false)}>Projects</a>
          <a href="#timeline" onClick={() => setNavActive(false)}>Timeline</a>
          <a href="#contact" onClick={() => setNavActive(false)}>Contact</a>
        </nav>

        <div className="header-actions">
          <button 
            id="theme-toggle" 
            className="theme-btn" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            <i className={isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          </button>
          
          <button 
            id="menu-toggle" 
            className="menu-btn" 
            onClick={() => setNavActive(!navActive)}
            aria-label="Toggle Menu"
          >
            <i className={navActive ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>
      </div>
    </header>
  )
}

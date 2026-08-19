import React, { useState, useEffect, useRef } from 'react'

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hi! I am Yash's virtual assistant. Ask me anything about his work, skills, or projects.", sender: "bot" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [promptsDisabled, setPromptsDisabled] = useState(false)
  const chatBodyRef = useRef(null)

  const promptAnswers = {
    who: "Yash R Dabhade is a software engineering student based in Pune, India. He builds responsive web layouts, database structures, and backend automation pipelines.",
    strengths: "Yash is highly consistent and detail-oriented, with a positive mindset toward learning. His core technical strengths lie in Java, Python scripting, MySQL database schemas, and OOP concepts.",
    projects: "Yash's key projects include Dyniq (a smart Next.js 16 restaurant platform), Print Zone (a marketing services portal), and YAURA (an AI Multi-agent framework built with Python and Gemini API).",
    contact: "You can reach Yash via email at dabhadeyash22@gmail.com, mobile phone at +91 70280 11811, or check out his Github profile (github.com/dabhadeyash22-del)."
  }

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const voiceEnabledRef = useRef(voiceEnabled)

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled
  }, [voiceEnabled])

  // Stop TTS when chat is closed
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }, [isOpen])

  const triggerPrompt = (key, label) => {
    if (promptsDisabled) return

    // Browser Security Bypass: Warm up the speech engine inside the user click loop.
    if (voiceEnabledRef.current && window.speechSynthesis) {
      try {
        const silentUtterance = new SpeechSynthesisUtterance('')
        silentUtterance.lang = 'en-US'
        window.speechSynthesis.speak(silentUtterance)
      } catch (e) {
        console.error("Speech warm-up failed:", e)
      }
    }

    setPromptsDisabled(true)
    
    // Add user message
    setMessages(prev => [...prev, { text: label, sender: "user" }])

    // Wait and show typing indicator
    setTimeout(() => {
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        const responseText = promptAnswers[key] || "I am Yash's automated AI assistant. How can I assist you today?"
        
        // Add bot message
        setMessages(prev => [...prev, { text: responseText, sender: "bot" }])
        setPromptsDisabled(false)

        // Trigger TTS Speech if enabled
        if (voiceEnabledRef.current && window.speechSynthesis) {
          try {
            window.speechSynthesis.cancel() // Stop any previous speech
            const utterance = new SpeechSynthesisUtterance(responseText)
            utterance.lang = 'en-US'
            
            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => setIsSpeaking(false)
            utterance.onerror = (e) => {
              console.error("Speech utterance error:", e)
              setIsSpeaking(false)
            }
            
            window.speechSynthesis.speak(utterance)
          } catch (err) {
            console.error("Speech synthesis failed to speak:", err)
            setIsSpeaking(false)
          }
        }
      }, 1000)
    }, 400)
  }

  const toggleVoice = (e) => {
    e.stopPropagation()
    const nextVoice = !voiceEnabled
    setVoiceEnabled(nextVoice)
    if (nextVoice && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
        const activationUtterance = new SpeechSynthesisUtterance("Voice mode activated.")
        activationUtterance.lang = 'en-US'
        activationUtterance.onstart = () => setIsSpeaking(true)
        activationUtterance.onend = () => setIsSpeaking(false)
        activationUtterance.onerror = (err) => {
          console.error("Activation voice error:", err)
          setIsSpeaking(false)
        }
        window.speechSynthesis.speak(activationUtterance)
      } catch (err) {
        console.error("Activation speech failed:", err)
        setIsSpeaking(false)
      }
    } else {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button 
          id="ai-chat-bubble" 
          className="ai-chat-bubble" 
          onClick={() => setIsOpen(true)}
          aria-label="Chat with AI Assistant"
        >
          <i className="fa-solid fa-comments"></i>
        </button>
      )}

      {/* AI Chat Panel */}
      <div id="ai-chat-panel" className={`ai-chat-panel ${isOpen ? 'active' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-header-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-robot"></i>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Yash's Assistant</h4>
              {isSpeaking && (
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '10px', marginTop: '2px' }}>
                  <span style={{ width: '2px', height: '100%', background: 'var(--accent)', display: 'inline-block', animation: 'voiceWave 0.6s infinite ease-in-out alternate' }}></span>
                  <span style={{ width: '2px', height: '70%', background: 'var(--accent)', display: 'inline-block', animation: 'voiceWave 0.6s infinite ease-in-out alternate 0.15s' }}></span>
                  <span style={{ width: '2px', height: '100%', background: 'var(--accent)', display: 'inline-block', animation: 'voiceWave 0.6s infinite ease-in-out alternate 0.3s' }}></span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Voice Toggle Switch Button */}
            <button 
              onClick={toggleVoice}
              style={{ background: 'none', border: 'none', color: voiceEnabled ? 'var(--accent)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
              title={voiceEnabled ? "Voice Output Enabled" : "Voice Output Disabled"}
            >
              <i className={voiceEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark"}></i>
            </button>
            <button 
              id="ai-chat-close" 
              className="ai-chat-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div id="ai-chat-body" className="ai-chat-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg bot typing">
              <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          )}
        </div>

        <div className="ai-chat-prompts">
          <p>Suggested Questions:</p>
          <button 
            className="ai-prompt-btn" 
            onClick={() => triggerPrompt('who', 'Who is Yash?')}
            disabled={promptsDisabled}
            style={promptsDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            Who is Yash?
          </button>
          <button 
            className="ai-prompt-btn" 
            onClick={() => triggerPrompt('strengths', 'What are his core strengths?')}
            disabled={promptsDisabled}
            style={promptsDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            What are his core strengths?
          </button>
          <button 
            className="ai-prompt-btn" 
            onClick={() => triggerPrompt('projects', 'Tell me about his key projects')}
            disabled={promptsDisabled}
            style={promptsDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            Tell me about his key projects
          </button>
          <button 
            className="ai-prompt-btn" 
            onClick={() => triggerPrompt('contact', 'How can I contact him?')}
            disabled={promptsDisabled}
            style={promptsDisabled ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            How can I contact him?
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes voiceWave {
          0% { height: 3px; }
          100% { height: 12px; }
        }
      `}} />
    </>
  )
}

import React from 'react'

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="section-header">
          <h3>Connection</h3>
          <h2>Contact Me</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-meta">
            <div className="contact-block">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <a href="mailto:dabhadeyash22@gmail.com">dabhadeyash22@gmail.com</a>
              </div>
            </div>
            <div className="contact-block">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h3>Call</h3>
                <a href="tel:+917028011811">+91 70280 11811</a>
              </div>
            </div>
            <div className="contact-block">
              <i className="fa-brands fa-github"></i>
              <div>
                <h3>GitHub</h3>
                <a href="https://github.com/dabhadeyash22-del" target="_blank" rel="noopener noreferrer">github.com/dabhadeyash22-del</a>
              </div>
            </div>
            <div className="contact-block">
              <i className="fa-brands fa-linkedin"></i>
              <div>
                <h3>LinkedIn</h3>
                <a href="https://www.linkedin.com/in/yash-dabhade-aa4a79327" target="_blank" rel="noopener noreferrer">linkedin.com/in/yash-dabhade</a>
              </div>
            </div>
          </div>

          <form className="contact-form" action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="access_key" value="d7aca53d-30ce-4936-8cd6-3bb30cb3754e" />
            <input type="hidden" name="redirect" value="success.html" />

            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email Address" required />
            <textarea name="message" rows="6" placeholder="Message Details" required></textarea>

            <button type="submit" className="btn primary">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  )
}

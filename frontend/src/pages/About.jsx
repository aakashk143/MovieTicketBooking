import { useEffect, useRef, useState } from 'react'

export default function About() {
  const [visibleSections, setVisibleSections] = useState(new Set())
  const sectionRefs = useRef([])

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, index]))
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(ref)
      return observer
    })

    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
        minHeight: '100vh',
      }}
    >
      <div className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h1 className="display-4 fw-bold mb-3 text-white">🎬 About BookScreen</h1>
          <p className="lead text-light">
            Your ultimate destination for booking movie tickets with ease and excitement!
          </p>
          <p className="text-light">
            We believe that every movie experience should start long before you enter the theater — 
            it begins with a smooth, fun, and interactive booking journey.
          </p>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-lg-10 mx-auto">
            {/* Who We Are */}
            <div 
              ref={el => sectionRefs.current[0] = el}
              className={`card shadow-sm mb-4 about-card ${visibleSections.has(0) ? 'visible' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none' }}
            >
              <div className="card-body p-4 text-light">
                <h3 className="fw-bold mb-3 text-white">Who We Are</h3>
                <p>
                  We are a passionate team of movie lovers and tech enthusiasts who wanted to simplify 
                  the way people book movie tickets. Our goal is to make your cinema experience faster, 
                  smarter, and more enjoyable, right from choosing your favorite movie to selecting the perfect seat.
                </p>
                <p className="mb-0">
                  At BookScreen, we combine technology, creativity, and comfort to bring the magic of movies closer to you.
                </p>
              </div>
            </div>

            {/* Vision and Mission */}
            <div className="row g-4 mb-4">
              <div 
                ref={el => sectionRefs.current[2] = el}
                className={`col-md-6 about-card ${visibleSections.has(2) ? 'visible' : ''}`}
              >
                <div className="card shadow-sm h-100"
                     style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none' }}>
                  <div className="card-body p-4 text-light">
                    <h4 className="fw-bold mb-3 text-white">Our Vision</h4>
                    <p>
                      To create a platform that not only sells tickets but connects people through movies. 
                      We aim to make BookScreen the most trusted and user-friendly online movie booking system — 
                      where every booking feels like a cinematic journey.
                    </p>
                  </div>
                </div>
              </div>

              <div 
                ref={el => sectionRefs.current[3] = el}
                className={`col-md-6 about-card ${visibleSections.has(3) ? 'visible' : ''}`}
              >
                <div className="card shadow-sm h-100"
                     style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none' }}>
                  <div className="card-body p-4 text-light">
                    <h4 className="fw-bold mb-3 text-white">Our Mission</h4>
                    <p>
                      To revolutionize the movie ticket booking experience by providing a seamless, fast, 
                      and reliable platform for all moviegoers. We strive to deliver entertainment with 
                      excellence through innovation and passion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Behind the Scenes */}
            <div 
              ref={el => sectionRefs.current[4] = el}
              className={`card shadow-sm mb-4 about-card ${visibleSections.has(4) ? 'visible' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none' }}
            >
              <div className="card-body p-4 text-light">
                <h3 className="fw-bold mb-3 text-white">Behind the Scenes</h3>
                <p className="mb-3">
                  Our platform is built using cutting-edge technologies:
                </p>
                <div className="row g-3">
                  {[
                    { badge: 'bg-primary', label: 'Frontend', text: 'React.js for dynamic and responsive interfaces' },
                    { badge: 'bg-success', label: 'Backend', text: 'Node.js & Express.js for powerful APIs' },
                    { badge: 'bg-info', label: 'Database', text: 'MySQL for secure and efficient data management' },
                    { badge: 'bg-warning text-dark', label: 'Auth', text: 'JWT-based login for safe user access' }
                  ].map((tech, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="d-flex align-items-center tech-item">
                        <span className={`badge ${tech.badge} me-2`}>{tech.label}</span>
                        <span>{tech.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 mb-0">
                  We constantly upgrade our features to ensure your movie experience stays smooth, fun, and futuristic.
                </p>
              </div>
            </div>

            {/* Our Team */}
            <div 
              ref={el => sectionRefs.current[5] = el}
              className={`card shadow-sm mb-4 about-card ${visibleSections.has(5) ? 'visible' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none' }}
            >
              <div className="card-body p-4 text-light">
                <h3 className="fw-bold mb-3 text-white">👥 Our Team</h3>
                <p>We collaboratively built this Movie Ticket Booking System with a focus on a smooth, user-friendly experience.</p>
                <div className="row g-3">
                  {[ 
                    { name: 'Aakash Kharade' },
                    { name: 'Kiran Mahajan' },
                    { name: 'Someshwar Tiwari' }
                  ].map((member, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="border rounded p-3 h-100 text-center bg-transparent">
                        <div className="fw-bold text-white">{member.name}</div>
                        <div className="text-light small">Project Contributor</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div 
              ref={el => sectionRefs.current[6] = el}
              className={`card shadow-sm bg-primary text-white about-card ${visibleSections.has(6) ? 'visible' : ''}`}
            >
              <div className="card-body p-4 text-center">
                <h3 className="fw-bold mb-3">Join the Show</h3>
                <p className="lead mb-0">
                  At BookScreen, we don't just book tickets — we bring stories to life.
                </p>
                <p className="mb-0 mt-3">
                  So, grab your popcorn, pick your favorite seat, and let the show begin!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .about-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        .about-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tech-item {
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        .tech-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }
        .tech-item:hover .badge {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

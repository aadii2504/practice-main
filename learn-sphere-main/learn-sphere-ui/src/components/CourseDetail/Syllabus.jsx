import React, { useState } from "react";

const GlassSyllabus = () => {
  const courseData = {
    title: "Full Stack Cohort 3.0",
    instructor: "Harkirat Singh",
    price: "₹4,999",
    overview: "Master the MERN stack, Devops, and Open Source. We start from 'Hello World' and go to advanced Microservices.",
    
    requirements: [
      "No prior coding experience required (we start from scratch).",
      "A laptop with at least 8GB RAM (16GB recommended for DevOps).",
      "Willingness to dedicate 10-12 hours per week for 6 months.",
      "Basic understanding of how to use a web browser and file manager.",
      "A stable internet connection for live classes and video streaming."
    ],

    chapters: [
      { id: 1, title: "Foundation: JavaScript & Node", detail: "Learn Variables, Loops, Promises, and Asynchronous programming.", duration: "15 Hours" },
      { id: 2, title: "Frontend: React & Tailwind", detail: "Master Hooks, Context API, and building responsive UI with Tailwind CSS.", duration: "25 Hours" },
      { id: 3, title: "Backend: Databases & Auth", detail: "Deep dive into MongoDB, PostgreSQL, and JWT Authentication.", duration: "20 Hours" }
    ],

    faqs: [
      { q: "Is this course for absolute beginners?", a: "Yes! We assume you know nothing about coding and build your foundation step-by-step." },
      { q: "What happens if I miss a live session?", a: "All live sessions are recorded and uploaded to your dashboard within 2 hours." },
      { q: "Is there a refund policy?", a: "We offer a 7-day no-questions-asked refund policy if you find the course isn't for you." },
      { q: "Will I get access to the Discord community?", a: "Yes, you get lifetime access to the private Cohort 3.0 community for networking and doubt solving." },
      { q: "Do I need to pay for any software?", a: "No. We use open-source tools like VS Code, Docker, and free tiers of AWS/MongoDB." }
    ]
  };

  const [openId, setOpenId] = useState(null);

  return (
    <div className="app-shell" data-theme="dark">
      <div style={styles.container}>
        
        <header style={styles.header}>
          <div style={styles.badge}>BATCH 2026</div>
          <h1 style={styles.mainTitle}>{courseData.title}</h1>
          <p style={styles.subTitle}>{courseData.overview}</p>
        </header>

        <div style={styles.mainLayout}>
          <div style={styles.leftColumn}>
            
            <section style={styles.sectionMargin}>
              <h2 style={styles.sectionTitle}>WHAT YOU NEED BEFORE STARTING</h2>
              <div style={styles.glassCard}>
                <ul style={styles.reqList}>
                  {courseData.requirements.map((req, i) => (
                    <li key={i} style={styles.reqItem}>
                      <span style={styles.checkIcon}>✔</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section style={styles.sectionMargin}>
              <h2 style={styles.sectionTitle}>COURSE CURRICULUM</h2>
              {courseData.chapters.map((ch) => (
                <div 
                  key={ch.id} 
                  style={{ ...styles.glassCard, borderColor: openId === ch.id ? "#6366f1" : "var(--border)", marginBottom: '15px' }}
                >
                  <div style={styles.cardHeader} onClick={() => setOpenId(openId === ch.id ? null : ch.id)}>
                    <div style={styles.titleArea}>
                      <span style={styles.chNumber}>0{ch.id}</span>
                      <span style={styles.chTitle}>{ch.title}</span>
                    </div>
                    <span style={styles.toggleIcon}>{openId === ch.id ? "−" : "+"}</span>
                  </div>

                  {openId === ch.id && (
                    <div style={styles.cardBody}>
                      <p style={styles.detailText}>{ch.detail}</p>
                      <div style={styles.duration}>⏳ Duration: {ch.duration}</div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.glassCard}>
              <h3 style={styles.cardHeading}>Limited Time Offer</h3>
              <p style={styles.priceText}>{courseData.price}</p>
              <button style={styles.buyBtn}>Enroll Now</button>
            </div>

            <div style={{...styles.glassCard, marginTop: '20px'}}>
              <h3 style={styles.cardHeading}>Frequently Asked Questions</h3>
              <div style={styles.faqList}>
                {courseData.faqs.map((faq, i) => (
                  <div key={i} style={styles.faqItem}>
                    <p style={styles.faqQ}>{faq.q}</p>
                    <p style={styles.faqA}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" },
  header: { textAlign: 'center', marginBottom: '60px' },
  badge: { color: '#6366f1', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' },
  mainTitle: { fontSize: '48px', margin: '15px 0', fontWeight: '800' },
  subTitle: { maxWidth: '700px', margin: '0 auto', color: '#94a3b8', lineHeight: '1.6' },

  mainLayout: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  leftColumn: { flex: '2', minWidth: '350px' },
  rightColumn: { flex: '1', minWidth: '300px' },

  sectionTitle: { fontSize: '14px', color: '#6366f1', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' },
  sectionMargin: { marginBottom: '40px' },
  
  glassCard: { 
    background: 'var(--card)', 
    backdropFilter: 'blur(10px)', 
    border: '1px solid var(--border)', 
    borderRadius: '16px', 
    transition: '0.3s' 
  },

  reqList: { listStyle: 'none', padding: '20px' },
  reqItem: { marginBottom: '15px', color: '#94a3b8', fontSize: '15px', display: 'flex', alignItems: 'flex-start', gap: '10px' },
  checkIcon: { color: '#6366f1', fontWeight: 'bold' },

  cardHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' },
  titleArea: { display: 'flex', gap: '15px', alignItems: 'center' },
  chNumber: { color: '#6366f1', fontWeight: 'bold' },
  chTitle: { fontSize: '18px', fontWeight: '600' },
  toggleIcon: { fontSize: '20px', color: '#6366f1' },
  cardBody: { padding: '0 20px 20px 55px', color: '#94a3b8', fontSize: '15px' },
  duration: { marginTop: '10px', fontSize: '12px', fontWeight: 'bold', color: '#6366f1' },

  cardHeading: { fontSize: '20px', fontWeight: 'bold', padding: '20px 20px 10px 20px' },
  priceText: { fontSize: '28px', fontWeight: 'bold', padding: '0 20px 15px 20px', color: '#fff' },
  buyBtn: { width: 'calc(100% - 40px)', margin: '0 20px 20px 20px', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },

  faqList: { padding: '0 20px 20px 20px' },
  faqItem: { marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' },
  faqQ: { fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#fff' },
  faqA: { color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }
};

export default GlassSyllabus;
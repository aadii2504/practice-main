
import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  {
    src: '/assets/web3.jpg',
    title: 'Complete Web3 Cohort',
    bullets: ['Web3 development', 'Smart contracts', 'Projects'],
  },
  {
    src: '/assets/adhoc.jpg',
    title: 'ADHOC',
    bullets: ['Practice', 'Deep dives', 'Community'],
  },
  {
    src: '/assets/webdev.jpg',
    title: 'Complete Web Development Cohort',
    bullets: ['Web development', 'Projects', 'Open source project setup'],
  },
  // add more as you like
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 pt-16 pb-10 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">LearnSphere</span>, because{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Curves</span>{' '}
            ain’t enough!
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--text)]/80">
            A beginner-friendly platform for mastering programming skills.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg hover:shadow-xl transition"
            >
              Explore Courses
            </Link>
            
          </div>
        </div>
      </section>

      {/* Auto‑sliding carousel (like the screenshot) */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="overflow-hidden hide-scrollbar">
          {/* Duplicate items so the track can scroll continuously */}
          <div className="marquee flex gap-4">
            {[...items, ...items].map((item, idx) => (
              <div
                key={idx}
                className="min-w-[280px] sm:min-w-[320px] rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden"
              >
                <div
                  className="h-40 w-full bg-center bg-cover"
                  style={{ backgroundImage: `url('${item.src}')` }}
                />
                <div className="p-4">
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  {item.bullets?.length ? (
                    <ul className="mt-2 text-sm text-[var(--text)]/80 list-disc list-inside space-y-0.5">
                      {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
           </section>
    </div>
  );
};

export default LandingPage;
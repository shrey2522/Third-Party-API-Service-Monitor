import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Play, Activity, Lock, LineChart, Bell, Zap, Route, Loader2, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const isDark = theme === 'dark';

  const mainCtaLink = user ? '/dashboard' : '/signup';
  const mainCtaText = user ? 'Go to Dashboard' : 'Start Monitoring Free';
  const navCtaText = user ? 'Dashboard →' : 'Start Free →';

  const handleDemoClick = async (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      setIsDemoLoading(true);
      const success = await login('demo@vendorvigil.com', 'demo123');
      setIsDemoLoading(false);
      if (success) navigate('/dashboard');
    }
  };

  // Theme-aware class helpers
  const bg = isDark ? 'bg-[#050d1a]' : 'bg-gray-50';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';
  const navBg = isDark ? 'bg-[#050d1a]/80 border-[#1e293b]' : 'bg-white/80 border-gray-200';
  const navLink = isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const pillBg = isDark ? 'bg-[#0c1629] border-[#1e293b]' : 'bg-blue-50 border-blue-200';
  const pillText = isDark ? 'text-gray-300' : 'text-blue-700';
  const mockupBg = isDark ? 'bg-[#0d1117] border-[#1e293b] shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]';
  const mockupChrome = isDark ? 'bg-[#161b22] border-[#1e293b]' : 'bg-gray-100 border-gray-200';
  const statCard = isDark ? 'bg-[#161b22] border-[#1e293b]' : 'bg-gray-50 border-gray-200';
  const tableHeader = isDark ? 'bg-[#0d1117] border-[#1e293b] text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-500';
  const tableRow = isDark ? 'hover:bg-[#0d1117] divide-[#1e293b]' : 'hover:bg-gray-50 divide-gray-200';
  const tableText = isDark ? 'text-white' : 'text-gray-800';
  const socialProofBg = isDark ? 'bg-[#161b22] border-[#1e293b]' : 'bg-gray-100 border-gray-200';
  const featureCard = isDark ? 'bg-[#0d1117] border-[#1e293b] hover:border-[#388bfd]/50' : 'bg-white border-gray-200 hover:border-[#388bfd]/50 shadow-sm';
  const stepCircle = isDark ? 'bg-[#0d1117] border-[#1e293b] text-gray-500' : 'bg-white border-gray-300 text-gray-400';
  const ctaBand = isDark ? 'bg-[#0d1117] border-[#1e293b]' : 'bg-gray-100 border-gray-200';
  const footerBg = isDark ? 'bg-[#050d1a] border-[#1e293b]' : 'bg-gray-100 border-gray-200';
  const footerText = isDark ? 'text-gray-500' : 'text-gray-400';
  const demoBtn = isDark ? 'text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white' : 'text-gray-600 border-gray-300 hover:bg-gray-200 hover:text-gray-900';

  return (
    <div className={`min-h-screen ${bg} ${text} font-['Space_Grotesk'] selection:bg-[#388bfd] selection:text-white pb-0 transition-colors duration-300`}>

      {/* SECTION 1 — STICKY NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${navBg} backdrop-blur-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#388bfd]" />
              <span className="text-xl font-bold tracking-tight">
                Vendor<span className="text-[#388bfd]">Vigil</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${navLink} transition-colors text-sm font-medium`}>Features</a>
              <a href="#how-it-works" className={`${navLink} transition-colors text-sm font-medium`}>How it Works</a>
              <a href="#pricing" className={`${navLink} transition-colors text-sm font-medium`}>Pricing</a>
              {user && <Link to="/dashboard" className="text-[#388bfd] hover:text-[#2b6fcb] transition-colors text-sm font-bold">My Dashboard</Link>}
            </div>

            {/* CTA + Theme Toggle */}
            <div className="flex items-center gap-3">
              {/* Pill Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`relative flex items-center w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 border ${isDark ? 'bg-[#0d1117] border-[#1e293b]' : 'bg-gray-200 border-gray-300'}`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                <span className="sr-only">Toggle theme</span>
                <div className="absolute inset-x-0 px-1.5 flex justify-between items-center pointer-events-none">
                  <Sun size={11} className={isDark ? 'text-gray-600' : 'text-orange-400'} />
                  <Moon size={11} className={isDark ? 'text-[#388bfd]' : 'text-gray-400'} />
                </div>
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                  className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full shadow-md ${isDark ? 'bg-[#388bfd] ml-auto' : 'bg-white'}`}
                >
                  {isDark ? <Moon size={10} className="text-white" /> : <Sun size={10} className="text-orange-500" />}
                </motion.div>
              </button>

              {!user && <Link to="/login" className={`text-sm font-medium ${navLink} transition-colors`}>Log in</Link>}
              <Link to={mainCtaLink} className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-[#388bfd] hover:bg-[#2b6fcb] rounded-lg transition-all shadow-[0_0_15px_rgba(56,139,253,0.3)]">
                {navCtaText}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 md:pt-32">
        {/* SECTION 2 — HERO */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

          {/* Background glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#388bfd] ${isDark ? 'opacity-[0.07]' : 'opacity-[0.04]'} blur-[120px] rounded-full pointer-events-none`}></div>

          {/* Pill Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${pillBg} mb-8 shadow-sm`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3fb950]"></span>
            </span>
            <span className={`text-xs font-['JetBrains_Mono'] ${pillText} uppercase tracking-widest`}>Live API Watchdog — Now in Beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.1]">
            Stop Discovering API Failures <br className="hidden md:block" />
            <span className="text-[#388bfd]">From Your Users</span>
          </h1>

          {/* Sub-headline */}
          <p className={`text-lg md:text-xl ${subText} mb-10 max-w-2xl leading-relaxed`}>
            VendorVigil continuously monitors every third-party API your app depends on. When something breaks, YOU know first — not your customers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link to={mainCtaLink} className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-[#388bfd] hover:bg-[#2b6fcb] rounded-lg transition-all shadow-[0_0_20px_rgba(56,139,253,0.4)] gap-2">
              {mainCtaText}
              <span className="text-lg">→</span>
            </Link>
            <button onClick={handleDemoClick} disabled={isDemoLoading} className={`inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold bg-transparent border rounded-lg transition-all gap-2 cursor-pointer disabled:opacity-50 ${demoBtn}`}>
              {isDemoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {isDemoLoading ? 'Loading Demo...' : 'See Live Demo'}
            </button>
          </div>

          {/* Trust line */}
          <p className={`text-xs font-['JetBrains_Mono'] ${subText} mb-20`}>
            No credit card required · 5 APIs free forever · Setup in 2 minutes
          </p>

          {/* Hero Visual — Fake Dashboard Mockup */}
          <div className={`w-full max-w-5xl rounded-xl overflow-hidden border ${mockupBg} relative z-10 mx-auto text-left flex flex-col transition-colors duration-300`}>
            {/* macOS Chrome */}
            <div className={`h-10 ${mockupChrome} border-b flex items-center px-4 gap-2`}>
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>

            <div className="p-6 md:p-8 flex-1">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className={`${statCard} rounded-lg border p-4`}>
                  <div className={`text-sm ${subText} mb-1`}>APIs Monitored</div>
                  <div className={`text-2xl font-bold font-['JetBrains_Mono'] ${text}`}>24</div>
                </div>
                <div className={`${statCard} rounded-lg border p-4 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#3fb950] opacity-5 blur-xl"></div>
                  <div className={`text-sm ${subText} mb-1`}>Healthy</div>
                  <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#3fb950]">21</div>
                </div>
                <div className={`${statCard} rounded-lg border p-4 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#d29922] opacity-5 blur-xl"></div>
                  <div className={`text-sm ${subText} mb-1`}>Degraded</div>
                  <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#d29922]">2</div>
                </div>
                <div className={`${statCard} rounded-lg border p-4 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#f85149] opacity-5 blur-xl"></div>
                  <div className={`text-sm ${subText} mb-1`}>Incidents Today</div>
                  <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#f85149]">1</div>
                </div>
              </div>

              {/* Data Table */}
              <div className={`${statCard} rounded-lg border overflow-hidden`}>
                <div className={`grid grid-cols-5 text-xs font-medium tracking-wider uppercase ${tableHeader} px-6 py-3 border-b`}>
                  <div className="col-span-2">Service</div>
                  <div>Status</div>
                  <div>Latency</div>
                  <div className="text-right">Uptime & Last Check</div>
                </div>

                <div className={`divide-y ${isDark ? 'divide-[#1e293b]' : 'divide-gray-200'}`}>
                  {/* Row 1 */}
                  <div className={`grid grid-cols-5 items-center px-6 py-4 ${tableRow} transition-colors`}>
                    <div className={`col-span-2 font-medium flex items-center gap-3 ${tableText}`}>
                      <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>Stripe API
                    </div>
                    <div><span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] bg-[#3fb950]/10 text-[#3fb950]">UP</span></div>
                    <div className={`font-['JetBrains_Mono'] text-sm ${tableText}`}>142ms</div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">{[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-[#3fb950] rounded-sm opacity-80"></div>)}</div>
                      <div className={`text-xs ${subText} font-['JetBrains_Mono']`}>Now</div>
                    </div>
                  </div>

                  {/* Row 2 (Down) */}
                  <div className={`grid grid-cols-5 items-center px-6 py-4 bg-[#f85149]/5 border-l-2 border-l-[#f85149] hover:bg-[#f85149]/10 transition-colors`}>
                    <div className={`col-span-2 font-medium flex items-center gap-3 ${tableText}`}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f85149] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f85149]"></span>
                      </span>Twilio SMS
                    </div>
                    <div><span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] bg-[#f85149]/10 text-[#f85149]">DOWN</span></div>
                    <div className="font-['JetBrains_Mono'] text-sm text-[#f85149]">timeout</div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-[#3fb950] rounded-sm opacity-80"></div>)}
                        <div className="w-1.5 h-3 bg-[#f85149] rounded-sm opacity-80"></div>
                      </div>
                      <div className={`text-xs ${subText} font-['JetBrains_Mono']`}>14s ago</div>
                    </div>
                  </div>

                  {/* Row 3 (Degraded) */}
                  <div className={`grid grid-cols-5 items-center px-6 py-4 ${tableRow} transition-colors`}>
                    <div className={`col-span-2 font-medium flex items-center gap-3 ${tableText}`}>
                      <div className="w-2 h-2 rounded-full bg-[#d29922]"></div>SendGrid Mail
                    </div>
                    <div><span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] bg-[#d29922]/10 text-[#d29922]">SLOW</span></div>
                    <div className="font-['JetBrains_Mono'] text-sm text-[#d29922]">1840ms</div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-[#3fb950] rounded-sm opacity-80"></div>)}
                        <div className="w-1.5 h-3 bg-[#d29922] rounded-sm opacity-80"></div>
                      </div>
                      <div className={`text-xs ${subText} font-['JetBrains_Mono']`}>1m ago</div>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className={`grid grid-cols-5 items-center px-6 py-4 ${tableRow} transition-colors`}>
                    <div className={`col-span-2 font-medium flex items-center gap-3 ${tableText}`}>
                      <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>AWS S3 Main
                    </div>
                    <div><span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] bg-[#3fb950]/10 text-[#3fb950]">UP</span></div>
                    <div className={`font-['JetBrains_Mono'] text-sm ${tableText}`}>88ms</div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">{[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-[#3fb950] rounded-sm opacity-80"></div>)}</div>
                      <div className={`text-xs ${subText} font-['JetBrains_Mono']`}>2m ago</div>
                    </div>
                  </div>

                  {/* Row 5 */}
                  <div className={`grid grid-cols-5 items-center px-6 py-4 ${tableRow} transition-colors`}>
                    <div className={`col-span-2 font-medium flex items-center gap-3 ${tableText}`}>
                      <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>Google Maps API
                    </div>
                    <div><span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] bg-[#3fb950]/10 text-[#3fb950]">UP</span></div>
                    <div className={`font-['JetBrains_Mono'] text-sm ${tableText}`}>204ms</div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">{[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-3 bg-[#3fb950] rounded-sm opacity-80"></div>)}</div>
                      <div className={`text-xs ${subText} font-['JetBrains_Mono']`}>2m ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — SOCIAL PROOF STRIP */}
        <section className={`w-full ${socialProofBg} border-y mt-24 mb-24 py-8 transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 text-center font-['JetBrains_Mono'] text-sm sm:text-base ${subText}`}>
              <div className="flex flex-col gap-1 items-center">
                <span className={`${text} font-bold text-xl`}>99.98%</span>
                <span>alert delivery rate</span>
              </div>
              <div className={`flex flex-col gap-1 items-center md:border-l ${isDark ? 'border-[#1e293b]' : 'border-gray-300'}`}>
                <span className="text-[#3fb950] font-bold text-xl">&lt;30s</span>
                <span>avg detection time</span>
              </div>
              <div className={`flex flex-col gap-1 items-center md:border-l ${isDark ? 'border-[#1e293b]' : 'border-gray-300'}`}>
                <span className={`${text} font-bold text-xl`}>AES-256</span>
                <span>credential encryption</span>
              </div>
              <div className={`flex flex-col gap-1 items-center md:border-l ${isDark ? 'border-[#1e293b]' : 'border-gray-300'}`}>
                <span className={`${text} font-bold text-xl`}>5-min</span>
                <span>minimum ping interval</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h3 className="text-sm font-['JetBrains_Mono'] text-[#388bfd] tracking-wider mb-4">CORE CAPABILITIES</h3>
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${text}`}>Everything you need to monitor with confidence</h2>
            <p className={`${subText} text-lg max-w-2xl mx-auto`}>Built for developers who refuse to let third-party failures become their problem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Activity, color: '#388bfd', bgColor: '#388bfd', title: 'Automated Pinger Engine', desc: 'Cron-powered health checks at configurable intervals. Always actively pinging so you don\'t have to.' },
              { icon: Lock, color: '#3fb950', bgColor: '#3fb950', title: 'Secure Credential Vault', desc: 'AES-256 encryption for all stored API keys. We decrypt on the fly inside memory, never persisting plaintext.' },
              { icon: LineChart, color: '#d29922', bgColor: '#d29922', title: 'Real-time Observability', desc: 'Live dashboard with semantic status badges and latency graphs. Know the health of your stack at a glance.' },
              { icon: Bell, color: '#f85149', bgColor: '#f85149', title: 'Instant Alert Dispatch', desc: 'Email, Slack, webhook alerts within seconds of a registered failure. Catch it before the customer tickets roll in.' },
              { icon: Route, color: '#8957e5', bgColor: '#8957e5', title: 'Multi-Vendor Coverage', desc: 'Monitor unlimited REST APIs across unlimited providers from one unified dashboard.' },
              { icon: Zap, color: '#388bfd', bgColor: '#388bfd', title: 'Latency Intelligence', desc: 'Track p50/p95 response times. Identify degrading API performance before it turns into a complete timeout.' },
            ].map(({ icon: Icon, color, bgColor, title, desc }) => (
              <div key={title} className={`${featureCard} border p-8 rounded-xl transition-colors group`}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${bgColor}1A` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h4 className={`text-xl font-bold mb-3 ${text}`}>{title}</h4>
                <p className={`${subText} leading-relaxed`}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — HOW IT WORKS */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h2 className={`text-3xl font-bold ${text}`}>How it Works</h2>
          </div>

          <div className="relative">
            <div className={`hidden md:block absolute top-6 left-0 w-full h-[2px] ${isDark ? 'bg-[#1e293b]' : 'bg-gray-200'} -z-10`}></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
              {[
                { step: '01', title: 'Register your APIs', desc: 'Add endpoints and securely attach any encrypted authentication credentials required.', active: true },
                { step: '02', title: 'Configure intervals', desc: 'Set specific ping frequencies and strict timeout thresholds per individual vendor.', active: false },
                { step: '03', title: 'VendorVigil watches', desc: 'Background jobs quietly execute precision requests, logging latency and HTTP status.', active: false },
                { step: '04', title: 'Get alerted instantly', desc: 'When a check fails, notifications fire instantly. You know before users notice.', active: false, danger: true },
              ].map(({ step, title, desc, active, danger }) => (
                <div key={step} className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-['JetBrains_Mono'] mb-6 ${active ? 'border-2 border-[#388bfd] text-white bg-[#0d1117] shadow-[0_0_15px_rgba(56,139,253,0.3)]' : `border-2 ${stepCircle}`}`}>
                    {step}
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${danger ? 'text-[#f85149]' : text}`}>{title}</h4>
                  <p className={`${subText} text-sm`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — BOTTOM CTA BAND */}
        <section className={`relative py-24 overflow-hidden border-t ${ctaBand} transition-colors duration-300`}>
          <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#388bfd] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
            <div className={`inline-block px-3 py-1 ${isDark ? 'bg-[#1e293b]' : 'bg-gray-200'} rounded text-xs font-['JetBrains_Mono'] text-[#388bfd] font-semibold tracking-wider mb-6`}>
              FREE TIER — NO CARD NEEDED
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${text}`}>
              Your APIs are breaking right now. <br className="hidden md:block" />
              Do you know which ones?
            </h2>
            <p className={`text-xl ${subText} mb-10`}>
              Join hundreds of engineering teams who stopped finding out from their users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={mainCtaLink} className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#388bfd] hover:bg-[#2b6fcb] rounded-lg transition-all shadow-[0_0_20px_rgba(56,139,253,0.4)]">
                {mainCtaText} →
              </Link>
              <a href="#docs" className={`inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-transparent border rounded-lg transition-all ${isDark ? 'text-gray-300 border-gray-700 hover:bg-[#161b22] hover:text-white' : 'text-gray-600 border-gray-300 hover:bg-gray-200 hover:text-gray-900'}`}>
                Read the Docs
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 7 — FOOTER */}
      <footer className={`${footerBg} border-t py-8 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`text-sm ${footerText} font-['JetBrains_Mono']`}>
            © 2026 VendorVigil · Built for engineers who sleep at night.
          </div>
          <div className={`flex space-x-6 text-sm ${footerText}`}>
            <a href="#" className="hover:text-[#388bfd] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#388bfd] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#388bfd] transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

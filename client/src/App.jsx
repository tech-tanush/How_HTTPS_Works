import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import HttpVsHttpsComparison from './components/HttpVsHttpsComparison';
import CommunicationFlow from './components/CommunicationFlow';
import TcpHandshakeVisualizer from './components/TcpHandshakeVisualizer';
import TlsHandshakeVisualizer from './components/TlsHandshakeVisualizer';
import CertificateExplorer from './components/CertificateExplorer';
import EncryptionPlayground from './components/EncryptionPlayground';
import SecurityAndMitm from './components/SecurityAndMitm';
import WiresharkGuide from './components/WiresharkGuide';
import PresentationGuide from './components/PresentationGuide';
import Footer from './components/Footer';

export default function App() {
  const [httpStatus, setHttpStatus] = useState({ online: false, protocol: 'HTTP', isTls: false });
  const [httpsStatus, setHttpsStatus] = useState({ online: false, protocol: 'HTTPS', isTls: true });
  const [certData, setCertData] = useState(null);
  const [isLoadingCert, setIsLoadingCert] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Check HTTP server status on port 3000
  const checkHttpStatus = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/health');
      if (res.ok) {
        const data = await res.json();
        setHttpStatus({ online: true, ...data });
      } else {
        setHttpStatus({ online: false, error: res.statusText });
      }
    } catch (err) {
      setHttpStatus({ online: false, error: err.message });
    }
  };

  // Check HTTPS server status on port 3443
  const checkHttpsStatus = async () => {
    try {
      const res = await fetch('https://localhost:3443/api/health');
      if (res.ok) {
        const data = await res.json();
        setHttpsStatus({ online: true, ...data });
      } else {
        setHttpsStatus({ online: false, error: res.statusText });
      }
    } catch (err) {
      // In browser, self-signed certificate may throw TypeError: Failed to fetch
      setHttpsStatus({ online: false, error: 'Self-signed certificate requires user browser authorization' });
    }
  };

  // Fetch certificate details from backend
  const fetchCertificateData = async () => {
    setIsLoadingCert(true);
    try {
      // Fetch via HTTP port 3000 so browser doesn't block on cert verification
      const res = await fetch('http://localhost:3000/api/certificate');
      if (res.ok) {
        const data = await res.json();
        setCertData(data);
      }
    } catch (err) {
      console.warn('Could not load certificate data:', err);
    } finally {
      setIsLoadingCert(false);
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkHttpStatus();
    checkHttpsStatus();
    fetchCertificateData();

    // Periodic heartbeat every 15 seconds
    const interval = setInterval(() => {
      checkHttpStatus();
      checkHttpsStatus();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('overview');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Navigation Bar */}
      <Navbar
        httpStatus={httpStatus}
        httpsStatus={httpsStatus}
        certData={certData}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Educational Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* Section A: Dashboard Overview */}
        <div id="overview" className="scroll-mt-24">
          <DashboardOverview
            httpStatus={httpStatus}
            httpsStatus={httpsStatus}
            certData={certData}
            onStartDemo={() => handleNavigate('flow')}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Section B: HTTP vs HTTPS Comparison */}
        <div id="comparison" className="scroll-mt-24">
          <HttpVsHttpsComparison />
        </div>

        {/* Section C: Interactive 11-Step Communication Flow */}
        <div id="flow" className="scroll-mt-24">
          <CommunicationFlow />
        </div>

        {/* Section D: TCP Three-Way Handshake */}
        <div id="tcp" className="scroll-mt-24">
          <TcpHandshakeVisualizer />
        </div>

        {/* Section E: TLS 1.3 Handshake Visualization */}
        <div id="tls" className="scroll-mt-24">
          <TlsHandshakeVisualizer />
        </div>

        {/* Section F: Digital Certificate Explorer */}
        <div id="certificate" className="scroll-mt-24">
          <CertificateExplorer
            certData={certData}
            onRefreshCert={fetchCertificateData}
            isLoadingCert={isLoadingCert}
          />
        </div>

        {/* Section G: Encryption Playground */}
        <div id="playground" className="scroll-mt-24">
          <EncryptionPlayground />
        </div>

        {/* Section H: Security Benefits & MITM Defense */}
        <div id="security" className="scroll-mt-24">
          <SecurityAndMitm />
        </div>

        {/* Section I: Wireshark Guide */}
        <div id="wireshark" className="scroll-mt-24">
          <WiresharkGuide />
        </div>

        {/* Section J: Presentation & Viva Voice Guide */}
        <div id="presentation" className="scroll-mt-24">
          <PresentationGuide />
        </div>
      </main>

      {/* Footer */}
      <Footer onScrollTop={handleScrollTop} />
    </div>
  );
}

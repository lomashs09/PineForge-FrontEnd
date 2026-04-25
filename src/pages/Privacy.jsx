import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300">

          <p className="text-gray-400 text-sm">Last updated: April 14, 2026</p>

          <p>PineForge ("we", "us", "our") operates the website getpineforge.com and provides automated trading bot services. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our Service, in compliance with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 of India.</p>

          <h2 className="text-xl font-semibold text-white mt-8">1. Information We Collect</h2>

          <h3 className="text-lg font-medium text-gray-200 mt-4">a) Information You Provide</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Information:</strong> Full name, email address, and password when you register.</li>
            <li><strong>Broker Credentials:</strong> MT5 login number, server name, and trading password when connecting a broker account. Your trading password is used once for account verification and is <strong>never stored</strong> in our database.</li>
            <li><strong>Payment Information:</strong> When adding funds, payment is processed by Stripe. We do not store your credit card, debit card, or bank account details. Stripe's privacy policy governs payment data processing.</li>
            <li><strong>Bot Configuration:</strong> Strategy scripts, trading parameters (symbol, timeframe, lot size), and bot settings you create.</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-200 mt-4">b) Information Collected Automatically</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Usage Data:</strong> Bot runtime hours, deployment counts, and account hosting hours for billing purposes.</li>
            <li><strong>Log Data:</strong> Bot execution logs, trade signals, and error messages generated during bot operation.</li>
            <li><strong>Trade Data:</strong> Trade history (entry/exit prices, P&L, volumes) fetched from your broker account via our trading infrastructure.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and access timestamps from server logs.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide, operate, and maintain the Service (running bots, backtesting, billing).</li>
            <li>To process transactions and send billing-related communications.</li>
            <li>To send verification emails and account notifications.</li>
            <li>To monitor and improve the Service's performance and reliability.</li>
            <li>To detect, prevent, and address technical issues, fraud, or abuse.</li>
            <li>To comply with applicable laws and legal obligations.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">3. Disclosure of Your Information</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Payment Processors:</strong> Stripe processes payments on our behalf. Your payment data is subject to Stripe's privacy policy.</li>
            <li><strong>Trading Infrastructure Providers:</strong> Your broker account credentials (login, server) are transmitted via encrypted connections for bot execution. Trading passwords are not stored.</li>
            <li><strong>Legal Authorities:</strong> If required by law, regulation, court order, or governmental request under Indian law or applicable jurisdiction.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">4. Data Security</h2>
          <p>We implement reasonable security practices and procedures as required under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>All data in transit is encrypted using TLS/SSL.</li>
            <li>Passwords are hashed using bcrypt before storage.</li>
            <li>Broker trading passwords are used once for verification and never stored.</li>
            <li>Database access is restricted to authorized application services only.</li>
            <li>Payment processing is handled entirely by Stripe (PCI DSS compliant).</li>
            <li>We conduct periodic reviews of our security practices.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">5. Data Retention</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account data is retained as long as your account is active.</li>
            <li>Bot logs are retained for 30 days and automatically deleted.</li>
            <li>Trade records are retained for 90 days and automatically deleted.</li>
            <li>You may request deletion of your account and associated data by contacting us.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">6. Your Rights</h2>
          <p>Under applicable Indian data protection laws, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access and review the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete personal data.</li>
            <li>Request deletion of your account and personal data.</li>
            <li>Withdraw consent for data processing (which may result in inability to use the Service).</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:lomash@getpineforge.com" className="text-emerald-400 hover:text-emerald-300">lomash@getpineforge.com</a>.</p>

          <h2 className="text-xl font-semibold text-white mt-8">7. Cookies</h2>
          <p>We use essential cookies and local storage to maintain your login session and user preferences. We do not use third-party tracking cookies or analytics services.</p>

          <h2 className="text-xl font-semibold text-white mt-8">8. Children's Privacy</h2>
          <p>The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors.</p>

          <h2 className="text-xl font-semibold text-white mt-8">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Service constitutes acceptance of the updated policy.</p>

          <h2 className="text-xl font-semibold text-white mt-8">10. Grievance Officer</h2>
          <p>In accordance with the Information Technology Act, 2000 and rules made thereunder, the Grievance Officer for the purpose of this Privacy Policy is:</p>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 mt-2">
            <p><strong>Name:</strong> Lomash Sharma</p>
            <p><strong>Email:</strong> <a href="mailto:lomash@getpineforge.com" className="text-emerald-400 hover:text-emerald-300">lomash@getpineforge.com</a></p>
            <p><strong>Phone:</strong> +91 7827XXXXXX</p>
            <p><strong>Address:</strong> New Delhi, India</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

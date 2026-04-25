import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300">

          <p className="text-gray-400 text-sm">Last updated: April 6, 2026</p>

          <h2 className="text-xl font-semibold text-white mt-8">1. Acceptance of Terms</h2>
          <p>By creating an account or using PineForge ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

          <h2 className="text-xl font-semibold text-white mt-8">2. Service Description</h2>
          <p>PineForge is a software platform that allows users to create, backtest, and run automated trading strategies (bots) on MetaTrader 5 (MT5) broker accounts. The Service includes strategy backtesting, live bot execution, trade monitoring, and usage-based billing.</p>

          <h2 className="text-xl font-semibold text-white mt-8">3. Risk Disclaimer</h2>
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
            <p className="text-amber-300 font-medium mb-2">Important: Trading involves substantial risk of loss.</p>
            <ul className="list-disc pl-5 space-y-1 text-amber-400/80 text-sm">
              <li>Trading financial instruments (forex, commodities, indices, crypto) involves significant risk and may result in partial or total loss of your invested capital.</li>
              <li>Automated trading bots execute trades based on programmatic rules and may produce unexpected results due to market conditions, technical failures, or strategy limitations.</li>
              <li>Past performance, backtesting results, and simulated returns do not guarantee future performance.</li>
              <li>You should not trade with money you cannot afford to lose.</li>
              <li>PineForge does not provide financial, investment, or trading advice. All trading decisions are your sole responsibility.</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-white mt-8">4. Account & Billing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must provide accurate information when creating your account.</li>
            <li>Backtesting and strategy analysis are free.</li>
            <li>Live bot execution is billed on a usage basis: per-hour for running bots, per-deployment for bot starts, and per-account for broker connections.</li>
            <li>A minimum balance of $5.00 is required to start bots. Each bot start is charged a minimum of 1 hour.</li>
            <li>When your balance drops below $1.00, all running bots will be automatically stopped.</li>
            <li>Funds added to your balance are non-refundable.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">5. Broker Accounts</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are responsible for your own MT5 broker account, including maintaining sufficient margin and complying with your broker's terms.</li>
            <li>Your MT5 login credentials are used once for account verification and are never stored in our database.</li>
            <li>PineForge is not affiliated with any broker and is not responsible for broker outages, execution delays, or slippage.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">6. Cancellation Policy</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may stop any running bot at any time. Billing stops immediately, subject to the minimum 1-hour charge per bot start.</li>
            <li>You may disconnect broker accounts at any time. All bots must be stopped first.</li>
            <li>You may request account deletion by emailing lomash@getpineforge.com. All bots will be stopped and data permanently deleted.</li>
            <li>Any remaining wallet balance at the time of cancellation or account deletion is non-refundable.</li>
          </ul>
          <p>For the complete cancellation policy, see our <a href="/cancellation" className="text-emerald-400 hover:text-emerald-300">Cancellation & Refund Policy</a>.</p>

          <h2 className="text-xl font-semibold text-white mt-8">7. Refund Policy</h2>
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
            <p className="text-amber-300 font-medium">All funds added to your PineForge wallet are non-refundable.</p>
            <p className="text-amber-400/80 text-sm mt-1">Once credited, wallet balance can only be used for PineForge services. Funds cannot be withdrawn, transferred, or refunded to your original payment method.</p>
          </div>
          <p>For the complete refund policy, see our <a href="/cancellation" className="text-emerald-400 hover:text-emerald-300">Cancellation & Refund Policy</a>.</p>

          <h2 className="text-xl font-semibold text-white mt-8">8. Limitation of Liability</h2>
          <p>PineForge is provided "as is" without warranties of any kind. To the maximum extent permitted by law, PineForge and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to trading losses, missed opportunities, or technical failures.</p>

          <h2 className="text-xl font-semibold text-white mt-8">9. Prohibited Use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may not use the Service for any illegal purpose.</li>
            <li>You may not attempt to exploit, reverse-engineer, or abuse the platform.</li>
            <li>You may not upload malicious scripts or content.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">10. Termination</h2>
          <p>We reserve the right to suspend or terminate your account at any time for violation of these terms or for any reason at our discretion. Upon termination, all running bots will be stopped, open positions will be closed, and remaining wallet balance will be forfeited.</p>

          <h2 className="text-xl font-semibold text-white mt-8">11. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.</p>

          <h2 className="text-xl font-semibold text-white mt-8">12. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

          <h2 className="text-xl font-semibold text-white mt-8">13. Contact</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 mt-2">
            <p><strong>PineForge</strong></p>
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

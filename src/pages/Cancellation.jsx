import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';

export default function Cancellation() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Seo
        title="Cancellation & Refund Policy"
        description="PineForge usage-based billing refund policy and account top-up terms."
        path="/cancellation"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Cancellation', url: '/cancellation' },
        ])}
      />
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Cancellation & Refund Policy</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300">

          <p className="text-gray-400 text-sm">Last updated: April 14, 2026</p>

          <p>This Cancellation & Refund Policy applies to all users of PineForge (getpineforge.com), operated from India. By using our Service, you agree to this policy.</p>

          <h2 className="text-xl font-semibold text-white mt-8">1. Usage-Based Billing Model</h2>
          <p>PineForge operates on a <strong>pay-as-you-go, usage-based billing model</strong>. There are no recurring subscriptions. You add funds to your PineForge wallet balance, which is consumed based on actual usage:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Bot Runtime:</strong> $0.022 per hour per active bot</li>
            <li><strong>Bot Deployment:</strong> $0.13 per bot start (minimum 1 hour charged)</li>
            <li><strong>Account Hosting:</strong> $0.002 per hour per connected broker account</li>
            <li><strong>Account Setup:</strong> $3.00 one-time fee per new broker account connection</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">2. Adding Funds</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Minimum top-up amount: $10.00 (USD)</li>
            <li>Maximum top-up amount: $1,000.00 (USD) per transaction</li>
            <li>Payments are processed securely via Stripe.</li>
            <li>Funds are credited to your PineForge wallet balance upon successful payment.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">3. Refund Policy</h2>
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
            <p className="text-amber-300 font-medium mb-2">No Refunds on Added Funds</p>
            <p className="text-amber-400/80 text-sm">
              All funds added to your PineForge wallet balance are <strong>non-refundable</strong>. Once credited, the balance can only be used to pay for PineForge services (bot runtime, deployments, account hosting, and account setup fees). Funds cannot be withdrawn, transferred, or refunded to your original payment method.
            </p>
          </div>
          <p>This no-refund policy applies because:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Usage charges are deducted in real-time as services are consumed.</li>
            <li>Bot deployment fees and account setup fees are charged immediately upon use.</li>
            <li>The minimum 1-hour charge per bot start prevents abuse of the pay-per-use model.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">4. Cancellation of Services</h2>
          <h3 className="text-lg font-medium text-gray-200 mt-4">a) Stopping Bots</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>You can stop any running bot at any time from the My Bots page.</li>
            <li>Billing for bot runtime stops immediately when the bot is stopped.</li>
            <li>The minimum 1-hour charge applies — if a bot runs for less than 1 hour, you are still charged for the full hour (prepaid at bot start).</li>
            <li>Stopping a live bot will close all open positions for that bot's symbol on your broker account.</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-200 mt-4">b) Disconnecting Broker Accounts</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>You can disconnect a broker account at any time from the Accounts page.</li>
            <li>All bots using that account must be stopped first.</li>
            <li>Account hosting charges stop upon disconnection.</li>
            <li>The one-time account setup fee ($3.00) is non-refundable.</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-200 mt-4">c) Account Deletion</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may request deletion of your PineForge account by emailing <a href="mailto:lomash@getpineforge.com" className="text-emerald-400 hover:text-emerald-300">lomash@getpineforge.com</a>.</li>
            <li>Upon account deletion, all running bots will be stopped, all open positions will be closed, and all account data will be permanently deleted.</li>
            <li>Any remaining wallet balance at the time of account deletion is <strong>non-refundable</strong> and will be forfeited.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">5. Automatic Bot Stoppage</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>If your PineForge wallet balance drops below $1.00, all running bots will be automatically stopped.</li>
            <li>You will need a minimum balance of $5.00 to start new bots.</li>
            <li>We are not liable for any trading losses resulting from automatic bot stoppage due to insufficient balance.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">6. Disputes</h2>
          <p>If you believe there is an error in billing or charges, please contact us within 7 days at <a href="mailto:lomash@getpineforge.com" className="text-emerald-400 hover:text-emerald-300">lomash@getpineforge.com</a> with details. We will review and resolve billing disputes in good faith.</p>

          <h2 className="text-xl font-semibold text-white mt-8">7. Governing Law</h2>
          <p>This Cancellation & Refund Policy is governed by and construed in accordance with the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of courts in New Delhi, India.</p>

          <h2 className="text-xl font-semibold text-white mt-8">8. Contact Us</h2>
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

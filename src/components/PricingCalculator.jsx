import { useState, useMemo } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RATES = {
  activeBotPerHour: 0.022,
  hostingPerHour: 0.002,
  deploymentFee: 0.13,
};

const HOURS_PER_MONTH = 24 * 30;

export default function PricingCalculator() {
  const [bots, setBots] = useState(2);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [accounts, setAccounts] = useState(1);
  const [deploysPerMonth, setDeploysPerMonth] = useState(4);

  const breakdown = useMemo(() => {
    const safeBots = Math.max(0, Number(bots) || 0);
    const safeHours = Math.max(0, Math.min(24, Number(hoursPerDay) || 0));
    const safeAccounts = Math.max(0, Number(accounts) || 0);
    const safeDeploys = Math.max(0, Number(deploysPerMonth) || 0);

    const botActiveHrs = safeBots * safeHours * 30;
    const botCost = botActiveHrs * RATES.activeBotPerHour;

    const hostingHrs = Math.max(0, safeAccounts * HOURS_PER_MONTH - botActiveHrs);
    const hostingCost = hostingHrs * RATES.hostingPerHour;

    const deployCost = safeDeploys * RATES.deploymentFee;

    const total = botCost + hostingCost + deployCost;

    return {
      botActiveHrs: Math.round(botActiveHrs),
      botCost,
      hostingHrs: Math.round(hostingHrs),
      hostingCost,
      deployCost,
      total,
    };
  }, [bots, hoursPerDay, accounts, deploysPerMonth]);

  return (
    <section className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <Calculator className="h-5 w-5 text-emerald-400" />
        <h2 className="text-2xl font-bold text-white">Cost Calculator</h2>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Estimate your monthly cost. Inputs update instantly — no signup required.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Slider label="Active bots" value={bots} setValue={setBots} min={0} max={10} suffix="" />
          <Slider label="Hours/day each runs" value={hoursPerDay} setValue={setHoursPerDay} min={1} max={24} suffix="h" />
          <Slider label="MT5 accounts" value={accounts} setValue={setAccounts} min={1} max={5} suffix="" />
          <Slider label="Deploys / month" value={deploysPerMonth} setValue={setDeploysPerMonth} min={0} max={30} suffix="" />
        </div>

        {/* Breakdown */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <Row label={`Bot runtime (${breakdown.botActiveHrs} hrs)`} cost={breakdown.botCost} hint={`$${RATES.activeBotPerHour}/hr × ${bots} bots × ${hoursPerDay}h × 30d`} />
          <Row label={`Account hosting (${breakdown.hostingHrs} hrs)`} cost={breakdown.hostingCost} hint={`$${RATES.hostingPerHour}/hr — only when bots aren't running`} />
          <Row label={`Bot deployments`} cost={breakdown.deployCost} hint={`$${RATES.deploymentFee} × ${deploysPerMonth} restarts`} />
          <div className="mt-4 flex items-baseline justify-between border-t border-gray-800 pt-4">
            <span className="text-sm font-semibold text-gray-300">Estimated monthly cost</span>
            <span className="text-3xl font-bold text-emerald-400">${breakdown.total.toFixed(2)}</span>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Setup fees ($3 per new account) are billed once and not included above.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-400">
          Compare: monthly subscriptions on similar platforms run <strong className="text-white">$22–$79/mo</strong>.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
        >
          Start free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Slider({ label, value, setValue, min, max, suffix }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
        <span className="text-sm font-bold text-emerald-400">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-2 w-full accent-emerald-500"
      />
      <div className="mt-1 flex justify-between text-[10px] text-gray-600">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </label>
  );
}

function Row({ label, cost, hint }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <div>
        <p className="text-sm text-gray-200">{label}</p>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
      <span className="text-sm font-semibold text-gray-200 tabular-nums">${cost.toFixed(2)}</span>
    </div>
  );
}

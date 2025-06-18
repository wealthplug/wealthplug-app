// Wealthplug Telegram Mini App - Fixed Trailing Comma and ReferenceError

import { useState, useEffect } from "react";
import { Loader2, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

let TelegramWebApp;
if (typeof window !== 'undefined') {
  TelegramWebApp = window.Telegram?.WebApp;
}

const plans = [
  { name: "Starter", amount: 40, roi: 2.8, duration: 120 },
  { name: "Silver", amount: 100, roi: 3.1, duration: 120 },
  { name: "Gold", amount: 200, roi: 3.5, duration: 150 },
  { name: "Platinum", amount: 500, roi: 3.5, duration: 365 },
  { name: "Diamond", amount: 1000, roi: 4.0, duration: 365 }
];

export default function WealthplugApp() {
  const [user, setUser] = useState({ name: "John Doe", invested: 1000, roi: 320, referrals: 5, earnings: 50, withdrawable: 250 });
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    if (TelegramWebApp?.expand) TelegramWebApp.expand();
    const tgUser = TelegramWebApp?.initDataUnsafe?.user;
    if (tgUser && tgUser.first_name) {
      setUser(prev => ({ ...prev, name: tgUser.first_name }));
    }
  }, []);

  const walletAddress = "0x456e7199B2D9b990AA3F4c95c0E1fb6e9B09CD2D";
  const referralLink = "https://t.me/wealthplugbot?start=123456";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderPlanCards = () => (
    <motion.div className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {plans.map(plan => (
        <motion.div
          key={plan.name}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260 }}
          className="rounded-lg border p-4 shadow-md bg-white text-left hover:shadow-lg hover:border-teal-400 transition-all duration-300"
        >
          <h3 className="text-lg font-bold text-teal-700">{plan.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{plan.amount} USDT – {plan.roi}% daily for {plan.duration} days</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage("invest")}
            className="mt-3 px-4 py-1.5 rounded-full bg-teal-600 text-white text-sm font-semibold shadow hover:bg-teal-700 transition duration-300"
          >
            Invest Now
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  );

  const pageContent = {
    dashboard: (
      <div className="space-y-2 text-gray-800">
        <div>Welcome, <strong>{user.name}</strong> 👋</div>
        <div>Total Invested: <CountUp end={user.invested} duration={1.2} /> USDT</div>
        <div>Total ROI: <CountUp end={user.roi} duration={1.2} /> USDT</div>
        <div>Referral Earnings: <CountUp end={user.earnings} duration={1.2} /> USDT</div>
      </div>
    ),
    plans: renderPlanCards(),
    invest: (
      <div className="space-y-3">
        <div className="font-medium text-gray-800">Send USDT (BEP20) to:</div>
        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
          <span className="truncate mr-2">{walletAddress}</span>
          <button onClick={handleCopy} className="ml-auto text-teal-600 hover:text-teal-800">
            <Copy size={16} />
          </button>
        </div>
        {copied && <div className="text-xs text-green-600 mt-1">Copied!</div>}
        <div>
          <label className="block text-sm mb-1">Upload payment proof:</label>
          <input type="file" className="w-full border px-3 py-1 rounded-md" />
        </div>
      </div>
    ),
    referrals: (
      <div className="space-y-2">
        <div>Your referral link:</div>
        <div className="bg-gray-100 p-2 rounded-md text-sm text-blue-700 font-mono break-all">{referralLink}</div>
        <div>Successful Referrals: {user.referrals}</div>
        <div>Bonus: {user.earnings} USDT (5% on first deposit)</div>
      </div>
    ),
    withdraw: (
      <div className="space-y-2">
        <div>Withdrawable Balance: {user.withdrawable} USDT</div>
        <form className="space-y-2">
          <input type="text" placeholder="Enter USDT Wallet" className="w-full border px-3 py-1 rounded-md" />
          <button type="submit" className="w-full bg-teal-600 text-white py-1 rounded-md hover:bg-teal-700 transition duration-300">
            Request Withdrawal
          </button>
          <p className="text-xs text-gray-500">Note: Withdrawals are free from 28–30th. 10% charge on other days.</p>
        </form>
      </div>
    ),
    about: (
      <div className="space-y-3 text-gray-800">
        <h2 className="text-lg font-bold">About Wealthplug</h2>
        <p>
          At <strong>Wealthplug</strong>, we are more than just an investment platform—we are a gateway to financial empowerment, innovation, and sustainable wealth-building.
        </p>
        <p>
          Our ecosystem is built on diversified income streams driven by:
          <ul className="list-disc list-inside pl-4">
            <li><strong>Forex Trading</strong>: AI-driven strategies</li>
            <li><strong>Cryptocurrency</strong>: Digital assets & DeFi</li>
            <li><strong>Real Estate</strong>: Rentals & flipping</li>
            <li><strong>Strategic Partnerships</strong>: Fintech growth</li>
          </ul>
        </p>
        <p>
          <strong>Mission:</strong> To plug every dreamer into the wealth system with smart, scalable opportunities.
        </p>
        <p>
          <strong>Vision:</strong> To become Africa’s most trusted digital wealth ecosystem.
        </p>
      </div>
    )
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto text-sm bg-gradient-to-br from-white to-teal-50 min-h-screen">
      {/* Header and Navigation */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-teal-800 drop-shadow"
          style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.25)' }}
        >
          Wealthplug
        </motion.div>
        <div className="text-sm font-medium text-gray-500 italic mt-1">
          Plugging People to Wealth
        </div>
      </div>

      {/* Page Buttons */}
      <div className="flex justify-center gap-2 flex-wrap">
        {["dashboard", "plans", "invest", "referrals", "withdraw", "about"].map(p => (
          <motion.button
            key={p}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
              currentPage === p ? "bg-teal-600 text-white" : "bg-gray-200 hover:bg-teal-100"
            }`}
            onClick={() => setCurrentPage(p)}
          >
            {p.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {pageContent[currentPage]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { Link } from "react-router-dom"


export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 text-xs uppercase mb-6 hover:underline">
        &larr; BACK TO SYSTEM
      </Link>
      <h1 className="font-display text-3xl font-bold text-white uppercase mb-6">Terms of Service</h1>
      <div className="space-y-4 text-xs leading-relaxed">
        <p>Last updated: September 26, 2026</p>
        <h2 className="text-white text-base font-bold">1. Agreement to Terms</h2>
        <p>By accessing or using the Solo Leveling System application, you agree to be bound by these Terms of Service.</p>
        <h2 className="text-white text-base font-bold">2. Subscriptions & Billing</h2>
        <p>Subscriptions to Shadow Monarch Premium are billed monthly or annually via Stripe. You may cancel at any time via the Customer Portal.</p>
        <h2 className="text-white text-base font-bold">3. Acceptable Use</h2>
        <p>The service is provided for personal habit tracking and gamified productivity.</p>
      </div>
    </div>
  )
}

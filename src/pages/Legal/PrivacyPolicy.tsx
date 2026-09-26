import { Link } from "react-router-dom"


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 text-xs uppercase mb-6 hover:underline">
        &larr; BACK TO SYSTEM
      </Link>
      <h1 className="font-display text-3xl font-bold text-white uppercase mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-xs leading-relaxed">
        <p>Last updated: September 26, 2026</p>
        <h2 className="text-white text-base font-bold">1. Information We Collect</h2>
        <p>We collect account data, habit logs, and subscription status via Supabase & Stripe. We never sell your personal data.</p>
        <h2 className="text-white text-base font-bold">2. Data Security</h2>
        <p>All data is encrypted in transit and at rest using industry standard SSL and PostgreSQL Row-Level Security.</p>
      </div>
    </div>
  )
}

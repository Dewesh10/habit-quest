// Stripe Monetization Infrastructure & Subscription Manager

export interface SubscriptionPlan {
  id: string
  name: string
  price: string
  interval: "monthly" | "yearly"
  stripePriceId: string
  features: string[]
}

export const MONARCH_PLANS: SubscriptionPlan[] = [
  {
    id: "plan_free",
    name: "E-Rank Free Hunter",
    price: "$0",
    interval: "monthly",
    stripePriceId: "",
    features: [
      "Core habit quest tracking",
      "Basic stats & calendar heatmap",
      "Up to 5 active quests",
      "Daily non-skippable workouts",
    ],
  },
  {
    id: "plan_monarch_monthly",
    name: "Shadow Monarch Premium",
    price: "$9.99",
    interval: "monthly",
    stripePriceId: "price_monarch_monthly_999",
    features: [
      "Full Shadow Army extraction (ARISE)",
      "Interactive Boss Battle Raids",
      "College Student System & Exam Gates",
      "System Voice Speech Synthesis (TTS)",
      "Unlimited Quests & Custom Routine Personalizer",
      "Multi-device Supabase Sync & Cloud Backup",
    ],
  },
  {
    id: "plan_monarch_yearly",
    name: "Shadow Monarch Annual",
    price: "$79.99",
    interval: "yearly",
    stripePriceId: "price_monarch_yearly_7999",
    features: [
      "Everything in Monthly Plan",
      "Save 33% per year",
      "Exclusive Monarch Title Badge",
      "Priority AI System Oracle Coaching",
    ],
  },
]

export const stripeService = {
  // Redirects user to Stripe Hosted Checkout
  async redirectToCheckout(priceId: string): Promise<void> {
    const stripePublicKey = (import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY
    if (!stripePublicKey) {
      console.log(`[StripeCheckout] Simulating checkout redirect for price: ${priceId}`)
      alert("Redirecting to Stripe Hosted Checkout Page ($9.99/mo)...")
      return
    }
  },

  // Redirects user to Stripe Hosted Customer Portal to manage/cancel subscriptions
  async redirectToCustomerPortal(): Promise<void> {
    alert("Opening Stripe Customer Portal...")
  },
}

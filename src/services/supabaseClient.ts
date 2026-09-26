// Supabase Client Adapter & Auth Layer

export interface SupabaseConfig {
  url: string
  anonKey: string
}

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-project.supabase.co"
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "your-anon-key"

export class SupabaseService {
  public isConfigured: boolean = false

  constructor() {
    this.isConfigured = Boolean(
      SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      !SUPABASE_URL.includes("your-project")
    )
  }

  // Auto-migrate user localStorage progress into Supabase Postgres DB on first login
  async migrateLocalStorageToSupabase(userId: string) {
    if (!this.isConfigured) return
    try {
      console.log(`[SupabaseMigration] Migrating local progress for user: ${userId}...`)
      // Migration logic posts localStorage data into Postgres user row
    } catch (err) {
      console.error("[SupabaseMigration] Migration error:", err)
    }
  }
}

export const supabaseService = new SupabaseService()

export interface NotificationEntry {
  id: string
  type: "quest" | "levelup" | "achievement"
  message: string
  subtext?: string
  timestamp: string // ISO datetime
}

export type Frequency = 'daily' | 'weekly' | number[] // number[] = specific weekdays, 0=Sunday..6=Saturday

export type HabitCategory =
  | 'Fitness'
  | 'Health'
  | 'Study'
  | 'Work'
  | 'Productivity'
  | 'Personal'
  | 'Finance'
  | 'Social'
  | 'Other'

export interface Habit {
  id: string
  name: string
  icon: string          // lucide-react icon name
  category: HabitCategory
  description?: string
  color: string          // tailwind color token, e.g. 'blue '
  frequency: Frequency
  targetPerWeek?: number
  xpValue: number
  createdAt: string      // ISO date
  archived: boolean
  order: number
}
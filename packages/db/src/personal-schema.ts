// Public Data API surface only; SQL migrations remain the source of truth.
export interface PersonalDatabase {
  public: {
    Tables: {
      followed_people: {
        Row: { user_id: string; person_id: string; created_at: string }
        Insert: { user_id: string; person_id: string; created_at?: string }
        Update: { user_id?: string; person_id?: string; created_at?: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

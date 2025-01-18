export type Database = {
    public: {
      Tables: {
        // Define your table types here
        profiles: {
          Row: {
            id: string
            updated_at?: string
            username?: string
            full_name?: string
            avatar_url?: string
            website?: string
          }
          Insert: {
            id: string
            updated_at?: string
            username?: string
            full_name?: string
            avatar_url?: string
            website?: string
          }
          Update: {
            id?: string
            updated_at?: string
            username?: string
            full_name?: string
            avatar_url?: string
            website?: string
          }
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        [_ in never]: never
      }
    }
  }
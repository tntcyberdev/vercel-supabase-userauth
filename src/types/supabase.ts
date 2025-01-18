export type Database = {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string
            username: string | null
            updated_at: string
          }
          Insert: {
            id: string
            username?: string | null
            updated_at?: string
          }
          Update: {
            id?: string
            username?: string | null
            updated_at?: string
          }
        }
      }
    }
  }
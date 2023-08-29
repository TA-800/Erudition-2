export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          code: string
          created_at: string
          ei_id: number
          id: number
          name: string | null
        }
        Insert: {
          code: string
          created_at?: string
          ei_id: number
          id?: number
          name?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          ei_id?: number
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_ei_id_fkey"
            columns: ["ei_id"]
            referencedRelation: "educational_institutions"
            referencedColumns: ["id"]
          }
        ]
      }
      educational_institutions: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          created_at: string
          ei_id: number | null
          id: string
          Year: number
        }
        Insert: {
          created_at?: string
          ei_id?: number | null
          id: string
          Year?: number
        }
        Update: {
          created_at?: string
          ei_id?: number | null
          id?: string
          Year?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_ei_id_fkey"
            columns: ["ei_id"]
            referencedRelation: "educational_institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
      assignments: {
        Row: {
          completed: boolean
          created_at: string
          deadline: string
          enroll_id: number
          id: number
          name: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          deadline?: string
          enroll_id: number
          id?: number
          name: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          deadline?: string
          enroll_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_enroll_id_fkey"
            columns: ["enroll_id"]
            referencedRelation: "enrollment"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          comment: string
          created_at: string
          id: number
          post_id: number
          student_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: number
          post_id: number
          student_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: number
          post_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
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
      enrollment: {
        Row: {
          course_id: number
          created_at: string
          id: number
          student_id: string
        }
        Insert: {
          course_id: number
          created_at?: string
          id?: number
          student_id: string
        }
        Update: {
          course_id?: number
          created_at?: string
          id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      modules: {
        Row: {
          created_at: string
          enroll_id: number
          id: number
          name: string
          notes: string
        }
        Insert: {
          created_at?: string
          enroll_id: number
          id?: number
          name: string
          notes?: string
        }
        Update: {
          created_at?: string
          enroll_id?: number
          id?: number
          name?: string
          notes?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_enroll_id_fkey"
            columns: ["enroll_id"]
            referencedRelation: "enrollment"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          author: string
          created_at: string
          description: string
          ei_id: number
          id: number
          title: string
        }
        Insert: {
          author: string
          created_at?: string
          description?: string
          ei_id: number
          id?: number
          title: string
        }
        Update: {
          author?: string
          created_at?: string
          description?: string
          ei_id?: number
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_fkey"
            columns: ["author"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_ei_id_fkey"
            columns: ["ei_id"]
            referencedRelation: "educational_institutions"
            referencedColumns: ["id"]
          }
        ]
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
      createassignment:
        | {
            Args: {
              student_id_input: string
              name_input: string
              course_id_input: number
              number_input: number
              frequency: string
              deadline_input: string
            }
            Returns: {
              id: number
              name: string
              deadline: string
              course_code: string
            }[]
          }
        | {
            Args: {
              student_id_input: string
              name_input: string
              course_id_input: number
              number_input: number
              frequency: string
              deadline_input: string
              filter: string
            }
            Returns: {
              id: number
              name: string
              deadline: string
              course_code: string
              completed: boolean
            }[]
          }
      createnewcourseandenroll: {
        Args: {
          code_input: string
          name_input: string
          student_id_input: string
        }
        Returns: {
          course_id: number
          created_at: string
          id: number
          student_id: string
        }[]
      }
      getallassignmentsforstudent: {
        Args: {
          student_id_input: string
        }
        Returns: {
          id: number
          name: string
          deadline: string
          course_code: string
          completed: boolean
        }[]
      }
      getassignmentsforcourse: {
        Args: {
          enroll_id_input: number
        }
        Returns: {
          id: number
          name: string
          deadline: string
          course_code: string
          completed: boolean
        }[]
      }
      getpostswithcommentnumber: {
        Args: {
          ei_id_input?: number
          post_id_input?: number
        }
        Returns: {
          id: number
          title: string
          description: string
          created_at: string
          comment_count: number
        }[]
      }
      getstudentcourses: {
        Args: {
          student_id_input: string
        }
        Returns: {
          id: number
          code: string
          name: string
          ei_id: number
          created_at: string
        }[]
      }
      updateassignmentscompletionstatus: {
        Args: {
          id_array: number[]
          tomark: boolean
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

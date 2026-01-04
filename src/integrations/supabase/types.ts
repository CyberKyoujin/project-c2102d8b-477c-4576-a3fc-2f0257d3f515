export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      nurse_applications: {
        Row: {
          city: string
          created_at: string | null
          current_step: number | null
          diploma_url: string | null
          districts: string[] | null
          documents_submitted_at: string | null
          email: string
          experience_years: number | null
          full_name: string
          has_transport: boolean | null
          id: string
          interview_notes: string | null
          interview_scheduled_at: string | null
          medical_book_url: string | null
          night_shifts_available: boolean | null
          passport_url: string | null
          phone: string
          phone_verified: boolean | null
          photo_url: string | null
          specializations:
            | Database["public"]["Enums"]["nurse_specialization"][]
            | null
          status: Database["public"]["Enums"]["nurse_application_status"] | null
          test_completed_at: string | null
          test_passed: boolean | null
          test_score: number | null
          test_started_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          current_step?: number | null
          diploma_url?: string | null
          districts?: string[] | null
          documents_submitted_at?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          has_transport?: boolean | null
          id?: string
          interview_notes?: string | null
          interview_scheduled_at?: string | null
          medical_book_url?: string | null
          night_shifts_available?: boolean | null
          passport_url?: string | null
          phone: string
          phone_verified?: boolean | null
          photo_url?: string | null
          specializations?:
            | Database["public"]["Enums"]["nurse_specialization"][]
            | null
          status?:
            | Database["public"]["Enums"]["nurse_application_status"]
            | null
          test_completed_at?: string | null
          test_passed?: boolean | null
          test_score?: number | null
          test_started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          current_step?: number | null
          diploma_url?: string | null
          districts?: string[] | null
          documents_submitted_at?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          has_transport?: boolean | null
          id?: string
          interview_notes?: string | null
          interview_scheduled_at?: string | null
          medical_book_url?: string | null
          night_shifts_available?: boolean | null
          passport_url?: string | null
          phone?: string
          phone_verified?: boolean | null
          photo_url?: string | null
          specializations?:
            | Database["public"]["Enums"]["nurse_specialization"][]
            | null
          status?:
            | Database["public"]["Enums"]["nurse_application_status"]
            | null
          test_completed_at?: string | null
          test_passed?: boolean | null
          test_score?: number | null
          test_started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nurse_test_answers: {
        Row: {
          answered_at: string | null
          application_id: string
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: string
        }
        Insert: {
          answered_at?: string | null
          application_id: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: string
        }
        Update: {
          answered_at?: string | null
          application_id?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "nurse_test_answers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "nurse_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurse_test_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "nurse_test_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      nurse_test_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          is_case_study: boolean | null
          options: Json
          order_index: number
          question_text: string
          question_type: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          is_case_study?: boolean | null
          options: Json
          order_index: number
          question_text: string
          question_type?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          is_case_study?: boolean | null
          options?: Json
          order_index?: number
          question_text?: string
          question_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "nurse"
      nurse_application_status:
        | "new"
        | "documents_verified"
        | "test_passed"
        | "interview"
        | "activated"
        | "rejected"
      nurse_specialization:
        | "injections"
        | "ivs"
        | "wound_care"
        | "elderly_care"
        | "pediatric"
        | "postoperative"
        | "palliative"
        | "rehabilitation"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "nurse"],
      nurse_application_status: [
        "new",
        "documents_verified",
        "test_passed",
        "interview",
        "activated",
        "rejected",
      ],
      nurse_specialization: [
        "injections",
        "ivs",
        "wound_care",
        "elderly_care",
        "pediatric",
        "postoperative",
        "palliative",
        "rehabilitation",
      ],
    },
  },
} as const

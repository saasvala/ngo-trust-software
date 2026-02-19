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
      apks: {
        Row: {
          file_hash: string | null
          file_name: string
          file_size: number | null
          id: string
          package_name: string | null
          product_id: string
          storage_path: string | null
          upload_date: string
          version: string | null
        }
        Insert: {
          file_hash?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          package_name?: string | null
          product_id: string
          storage_path?: string | null
          upload_date?: string
          version?: string | null
        }
        Update: {
          file_hash?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          package_name?: string | null
          product_id?: string
          storage_path?: string | null
          upload_date?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_violations: {
        Row: {
          created_at: string
          detected_string: string | null
          id: string
          product_id: string | null
          resolved: boolean
          violation_type: string | null
        }
        Insert: {
          created_at?: string
          detected_string?: string | null
          id?: string
          product_id?: string | null
          resolved?: boolean
          violation_type?: string | null
        }
        Update: {
          created_at?: string
          detected_string?: string | null
          id?: string
          product_id?: string | null
          resolved?: boolean
          violation_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_violations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          donation_date: string
          donation_number: string
          donor_id: string | null
          id: string
          notes: string | null
          payment_mode: string
          payment_reference: string | null
          project_id: string | null
          purpose: string | null
          receipt_issued: boolean
          receipt_number: string | null
          tax_benefit_eligible: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          donation_date?: string
          donation_number: string
          donor_id?: string | null
          id?: string
          notes?: string | null
          payment_mode: string
          payment_reference?: string | null
          project_id?: string | null
          purpose?: string | null
          receipt_issued?: boolean
          receipt_number?: string | null
          tax_benefit_eligible?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          donation_date?: string
          donation_number?: string
          donor_id?: string | null
          id?: string
          notes?: string | null
          payment_mode?: string
          payment_reference?: string | null
          project_id?: string | null
          purpose?: string | null
          receipt_issued?: boolean
          receipt_number?: string | null
          tax_benefit_eligible?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          donor_type: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          notes: string | null
          pan_number: string | null
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          donor_type?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          notes?: string | null
          pan_number?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          donor_type?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          pan_number?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      download_logs: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          license_key: string | null
          product_id: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          license_key?: string | null
          product_id?: string | null
          status?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          license_key?: string | null
          product_id?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      license_verification_logs: {
        Row: {
          attempt_count: number
          created_at: string
          device_id: string | null
          id: string
          ip_address: string | null
          license_key: string | null
          product_id: string | null
          result: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: string | null
          license_key?: string | null
          product_id?: string | null
          result?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: string | null
          license_key?: string | null
          product_id?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_verification_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          activated_at: string | null
          app_hash: string | null
          created_at: string
          device_id: string | null
          expiry_date: string | null
          id: string
          license_key: string
          payment_reference: string | null
          product_id: string
          status: string
        }
        Insert: {
          activated_at?: string | null
          app_hash?: string | null
          created_at?: string
          device_id?: string | null
          expiry_date?: string | null
          id?: string
          license_key: string
          payment_reference?: string | null
          product_id: string
          status?: string
        }
        Update: {
          activated_at?: string | null
          app_hash?: string | null
          created_at?: string
          device_id?: string | null
          expiry_date?: string | null
          id?: string
          license_key?: string
          payment_reference?: string | null
          product_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          apk_url: string | null
          app_hash: string | null
          category: string | null
          created_at: string
          deep_category: string | null
          demo_click_count: number
          demo_enabled: boolean
          demo_login_id: string | null
          demo_password: string | null
          demo_url: string | null
          description: string | null
          device_bind: boolean
          device_limit: number
          expiry_type: string
          feature_list_json: Json | null
          featured: boolean
          id: string
          keywords_json: Json | null
          license_enabled: boolean
          log_downloads: boolean
          micro_category: string | null
          name: string
          nano_category: string | null
          package_name: string | null
          price: number
          repo_branch: string | null
          repo_url: string | null
          require_payment: boolean
          screenshots_json: Json | null
          secure_download: boolean
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          source_method: string
          status: string
          storage_path: string | null
          sub_category: string | null
          tags_json: Json | null
          target_industry: string | null
          tech_stack_json: Json | null
          thumbnail_url: string | null
          trending: boolean
          updated_at: string
          use_case: string | null
          version: string | null
        }
        Insert: {
          apk_url?: string | null
          app_hash?: string | null
          category?: string | null
          created_at?: string
          deep_category?: string | null
          demo_click_count?: number
          demo_enabled?: boolean
          demo_login_id?: string | null
          demo_password?: string | null
          demo_url?: string | null
          description?: string | null
          device_bind?: boolean
          device_limit?: number
          expiry_type?: string
          feature_list_json?: Json | null
          featured?: boolean
          id?: string
          keywords_json?: Json | null
          license_enabled?: boolean
          log_downloads?: boolean
          micro_category?: string | null
          name: string
          nano_category?: string | null
          package_name?: string | null
          price?: number
          repo_branch?: string | null
          repo_url?: string | null
          require_payment?: boolean
          screenshots_json?: Json | null
          secure_download?: boolean
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          source_method?: string
          status?: string
          storage_path?: string | null
          sub_category?: string | null
          tags_json?: Json | null
          target_industry?: string | null
          tech_stack_json?: Json | null
          thumbnail_url?: string | null
          trending?: boolean
          updated_at?: string
          use_case?: string | null
          version?: string | null
        }
        Update: {
          apk_url?: string | null
          app_hash?: string | null
          category?: string | null
          created_at?: string
          deep_category?: string | null
          demo_click_count?: number
          demo_enabled?: boolean
          demo_login_id?: string | null
          demo_password?: string | null
          demo_url?: string | null
          description?: string | null
          device_bind?: boolean
          device_limit?: number
          expiry_type?: string
          feature_list_json?: Json | null
          featured?: boolean
          id?: string
          keywords_json?: Json | null
          license_enabled?: boolean
          log_downloads?: boolean
          micro_category?: string | null
          name?: string
          nano_category?: string | null
          package_name?: string | null
          price?: number
          repo_branch?: string | null
          repo_url?: string | null
          require_payment?: boolean
          screenshots_json?: Json | null
          secure_download?: boolean
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          source_method?: string
          status?: string
          storage_path?: string | null
          sub_category?: string | null
          tags_json?: Json | null
          target_industry?: string | null
          tech_stack_json?: Json | null
          thumbnail_url?: string | null
          trending?: boolean
          updated_at?: string
          use_case?: string | null
          version?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          spent: number | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          spent?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          spent?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const

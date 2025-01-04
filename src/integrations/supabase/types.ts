export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          business_id: string
          cost: number
          created_at: string
          id: string
          notes: string | null
          service_name: string
          status: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          business_id: string
          cost: number
          created_at?: string
          id?: string
          notes?: string | null
          service_name: string
          status?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          business_id?: string
          cost?: number
          created_at?: string
          id?: string
          notes?: string | null
          service_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      business_portfolio: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_portfolio_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_products: {
        Row: {
          business_id: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          business_id: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          category: string
          contact: string | null
          created_at: string
          description: string
          hours: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          user_id: string
          verified: boolean | null
          video_url: string | null
        }
        Insert: {
          category: string
          contact?: string | null
          created_at?: string
          description: string
          hours?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          user_id: string
          verified?: boolean | null
          video_url?: string | null
        }
        Update: {
          category?: string
          contact?: string | null
          created_at?: string
          description?: string
          hours?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          user_id?: string
          verified?: boolean | null
          video_url?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          file_type: string
          file_url: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees: number | null
          created_at: string
          date: string
          description: string
          id: string
          image_url: string | null
          location: string
          time: string
          title: string
          user_id: string
        }
        Insert: {
          attendees?: number | null
          created_at?: string
          date: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          time: string
          title: string
          user_id: string
        }
        Update: {
          attendees?: number | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          muted: boolean | null
          read: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          muted?: boolean | null
          read?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          muted?: boolean | null
          read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          options: Json
          question: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          options: Json
          question: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          options?: Json
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          location: string | null
          profile_id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          profile_id: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_discounted: boolean | null
          is_used: boolean | null
          price: number
          service_product_id: string | null
          stock: number
          subcategory: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_discounted?: boolean | null
          is_used?: boolean | null
          price: number
          service_product_id?: string | null
          stock?: number
          subcategory?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_discounted?: boolean | null
          is_used?: boolean | null
          price?: number
          service_product_id?: string | null
          stock?: number
          subcategory?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_service_product_id_fkey"
            columns: ["service_product_id"]
            isOneToOne: false
            referencedRelation: "service_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      service_portfolio: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          service_id: string
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          service_id: string
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          service_id?: string
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_portfolio_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          service_product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          service_product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          service_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_product_images_service_product_id_fkey"
            columns: ["service_product_id"]
            isOneToOne: false
            referencedRelation: "service_products"
            referencedColumns: ["id"]
          },
        ]
      }
      service_products: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          price: number
          service_id: string
          stock: number | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          price: number
          service_id: string
          stock?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          service_id?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          availability: string | null
          category: string
          contact_info: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string | null
          price: number
          title: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          category: string
          contact_info?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location?: string | null
          price: number
          title: string
          user_id: string
        }
        Update: {
          availability?: string | null
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_contacts: {
        Row: {
          contact_data: Json
          created_at: string
          id: string
          shared_with_id: string
          user_id: string
        }
        Insert: {
          contact_data: Json
          created_at?: string
          id?: string
          shared_with_id: string
          user_id: string
        }
        Update: {
          contact_data?: Json
          created_at?: string
          id?: string
          shared_with_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_sample_user_id: {
        Args: Record<PropertyKey, never>
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

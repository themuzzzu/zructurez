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
      ad_analytics: {
        Row: {
          ad_id: string | null
          clicks: number | null
          conversions: number | null
          id: string
          impressions: number | null
          last_updated: string | null
        }
        Insert: {
          ad_id?: string | null
          clicks?: number | null
          conversions?: number | null
          id?: string
          impressions?: number | null
          last_updated?: string | null
        }
        Update: {
          ad_id?: string | null
          clicks?: number | null
          conversions?: number | null
          id?: string
          impressions?: number | null
          last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_analytics_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_auctions: {
        Row: {
          category: string
          created_at: string | null
          current_bid: number
          id: string
          keyword: string
          min_bid: number
          status: string
          updated_at: string | null
          winning_ad_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_bid?: number
          id?: string
          keyword: string
          min_bid?: number
          status?: string
          updated_at?: string | null
          winning_ad_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_bid?: number
          id?: string
          keyword?: string
          min_bid?: number
          status?: string
          updated_at?: string | null
          winning_ad_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_auctions_winning_ad_id_fkey"
            columns: ["winning_ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          min_bid: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          min_bid?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          min_bid?: number
          name?: string
        }
        Relationships: []
      }
      ad_placements: {
        Row: {
          active: boolean
          cpc_rate: number
          cpm_rate: number
          created_at: string | null
          description: string | null
          id: string
          location: string
          max_size_kb: number | null
          name: string
          priority: number | null
          size: string | null
          type: string
        }
        Insert: {
          active?: boolean
          cpc_rate?: number
          cpm_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          max_size_kb?: number | null
          name: string
          priority?: number | null
          size?: string | null
          type: string
        }
        Update: {
          active?: boolean
          cpc_rate?: number
          cpm_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          max_size_kb?: number | null
          name?: string
          priority?: number | null
          size?: string | null
          type?: string
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          budget: number
          business_id: string | null
          carousel_images: Json | null
          clicks: number | null
          created_at: string
          description: string
          end_date: string
          format: string | null
          id: string
          image_url: string | null
          location: string
          reach: number | null
          reference_id: string
          start_date: string
          status: string
          targeting_age_max: number | null
          targeting_age_min: number | null
          targeting_gender: string | null
          targeting_interests: Json | null
          targeting_locations: Json | null
          title: string
          type: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          budget: number
          business_id?: string | null
          carousel_images?: Json | null
          clicks?: number | null
          created_at?: string
          description: string
          end_date: string
          format?: string | null
          id?: string
          image_url?: string | null
          location: string
          reach?: number | null
          reference_id: string
          start_date: string
          status?: string
          targeting_age_max?: number | null
          targeting_age_min?: number | null
          targeting_gender?: string | null
          targeting_interests?: Json | null
          targeting_locations?: Json | null
          title: string
          type: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          budget?: number
          business_id?: string | null
          carousel_images?: Json | null
          clicks?: number | null
          created_at?: string
          description?: string
          end_date?: string
          format?: string | null
          id?: string
          image_url?: string | null
          location?: string
          reach?: number | null
          reference_id?: string
          start_date?: string
          status?: string
          targeting_age_max?: number | null
          targeting_age_min?: number | null
          targeting_gender?: string | null
          targeting_interests?: Json | null
          targeting_locations?: Json | null
          title?: string
          type?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          query: string
          query_type: string | null
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          query_type?: string | null
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          query_type?: string | null
          response?: string
          user_id?: string
        }
        Relationships: []
      }
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
          token: string | null
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
          token?: string | null
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
          token?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          service_id: string | null
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_analytics: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          last_updated: string | null
          page_views: number | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          page_views?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          page_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_booking_messages: {
        Row: {
          business_id: string
          created_at: string
          id: string
          message_template: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          message_template?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          message_template?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_booking_messages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_comments: {
        Row: {
          business_id: string
          content: string
          created_at: string
          id: string
          profile_id: string
          rating: number | null
          reply_to: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          content: string
          created_at?: string
          id?: string
          profile_id: string
          rating?: number | null
          reply_to?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          rating?: number | null
          reply_to?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_comments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_comments_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "business_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      business_commission_settings: {
        Row: {
          business_id: string
          commission_rate: number
          created_at: string
          custom_platform_fee_percentage: number | null
          custom_transaction_fee_flat: number | null
          id: string
          is_custom_fee_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          business_id: string
          commission_rate?: number
          created_at?: string
          custom_platform_fee_percentage?: number | null
          custom_transaction_fee_flat?: number | null
          id?: string
          is_custom_fee_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          commission_rate?: number
          created_at?: string
          custom_platform_fee_percentage?: number | null
          custom_transaction_fee_flat?: number | null
          id?: string
          is_custom_fee_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_commission_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_likes: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_likes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_memberships: {
        Row: {
          business_id: string
          created_at: string
          end_date: string | null
          id: string
          membership_details: Json | null
          membership_type: string
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          membership_details?: Json | null
          membership_type?: string
          start_date?: string
          status?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          membership_details?: Json | null
          membership_type?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_memberships_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_menus: {
        Row: {
          business_id: string | null
          created_at: string | null
          display_type: string
          id: string
          is_draft: boolean | null
          is_published: boolean | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          display_type?: string
          id?: string
          is_draft?: boolean | null
          is_published?: boolean | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          display_type?: string
          id?: string
          is_draft?: boolean | null
          is_published?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_menus_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_portfolio: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          title: string
          views: number | null
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
          views?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
          views?: number | null
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
      business_ratings: {
        Row: {
          business_id: string
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_ratings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_subscriptions: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          aadhar_number: string | null
          appointment_price: number | null
          bio: string | null
          category: string
          closure_reason: string | null
          consultation_price: number | null
          contact: string | null
          created_at: string
          description: string
          gst_number: string | null
          hours: string | null
          id: string
          image_position: Json | null
          image_scale: number | null
          image_url: string | null
          is_open: boolean | null
          location: string | null
          membership_plans: Json | null
          name: string
          owners: Json | null
          pan_number: string | null
          show_in_services: boolean | null
          staff_details: Json | null
          user_id: string
          verification_documents: Json | null
          verification_status: string | null
          verification_submitted_at: string | null
          verified: boolean | null
          video_url: string | null
          wait_time: string | null
          website: string | null
        }
        Insert: {
          aadhar_number?: string | null
          appointment_price?: number | null
          bio?: string | null
          category: string
          closure_reason?: string | null
          consultation_price?: number | null
          contact?: string | null
          created_at?: string
          description: string
          gst_number?: string | null
          hours?: string | null
          id?: string
          image_position?: Json | null
          image_scale?: number | null
          image_url?: string | null
          is_open?: boolean | null
          location?: string | null
          membership_plans?: Json | null
          name: string
          owners?: Json | null
          pan_number?: string | null
          show_in_services?: boolean | null
          staff_details?: Json | null
          user_id: string
          verification_documents?: Json | null
          verification_status?: string | null
          verification_submitted_at?: string | null
          verified?: boolean | null
          video_url?: string | null
          wait_time?: string | null
          website?: string | null
        }
        Update: {
          aadhar_number?: string | null
          appointment_price?: number | null
          bio?: string | null
          category?: string
          closure_reason?: string | null
          consultation_price?: number | null
          contact?: string | null
          created_at?: string
          description?: string
          gst_number?: string | null
          hours?: string | null
          id?: string
          image_position?: Json | null
          image_scale?: number | null
          image_url?: string | null
          is_open?: boolean | null
          location?: string | null
          membership_plans?: Json | null
          name?: string
          owners?: Json | null
          pan_number?: string | null
          show_in_services?: boolean | null
          staff_details?: Json | null
          user_id?: string
          verification_documents?: Json | null
          verification_status?: string | null
          verification_submitted_at?: string | null
          verified?: boolean | null
          video_url?: string | null
          wait_time?: string | null
          website?: string | null
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
          profile_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
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
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_settings: {
        Row: {
          created_at: string
          id: string
          platform_fee_percentage: number
          transaction_fee_flat: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform_fee_percentage?: number
          transaction_fee_flat?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          platform_fee_percentage?: number
          transaction_fee_flat?: number
          updated_at?: string
        }
        Relationships: []
      }
      commission_transactions: {
        Row: {
          appointment_id: string | null
          business_id: string
          commission_amount: number
          created_at: string
          id: string
          net_amount: number
          order_id: string | null
          original_amount: number
          platform_fee_amount: number
          processed_at: string | null
          status: string
          transaction_fee_amount: number
        }
        Insert: {
          appointment_id?: string | null
          business_id: string
          commission_amount: number
          created_at?: string
          id?: string
          net_amount: number
          order_id?: string | null
          original_amount: number
          platform_fee_amount: number
          processed_at?: string | null
          status?: string
          transaction_fee_amount: number
        }
        Update: {
          appointment_id?: string | null
          business_id?: string
          commission_amount?: number
          created_at?: string
          id?: string
          net_amount?: number
          order_id?: string | null
          original_amount?: number
          platform_fee_amount?: number
          processed_at?: string | null
          status?: string
          transaction_fee_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
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
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
          is_business: boolean | null
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
          is_business?: boolean | null
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
          is_business?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      image_searches: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          user_id?: string | null
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
      menu_categories: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          is_custom: boolean | null
          name: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          availability: string | null
          business_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          price_unit: string | null
          subcategory_id: string | null
        }
        Insert: {
          availability?: string | null
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          price_unit?: string | null
          subcategory_id?: string | null
        }
        Update: {
          availability?: string | null
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          price_unit?: string | null
          subcategory_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "menu_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_subcategories: {
        Row: {
          business_id: string | null
          category_id: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          business_id?: string | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          business_id?: string | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_subcategories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
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
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          muted: boolean | null
          read: boolean | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          muted?: boolean | null
          read?: boolean | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          muted?: boolean | null
          read?: boolean | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          product_id: string
          quantity: number
          status: string
          total_price: number
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          status?: string
          total_price: number
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          status?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          concurrent_users: number | null
          cpu_usage: number | null
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          memory_usage: number | null
          metadata: Json | null
          response_time: number
          success: boolean
          timestamp: string
          user_id: string
        }
        Insert: {
          concurrent_users?: number | null
          cpu_usage?: number | null
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          memory_usage?: number | null
          metadata?: Json | null
          response_time: number
          success: boolean
          timestamp?: string
          user_id: string
        }
        Update: {
          concurrent_users?: number | null
          cpu_usage?: number | null
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          memory_usage?: number | null
          metadata?: Json | null
          response_time?: number
          success?: boolean
          timestamp?: string
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
          business_id: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          location: string | null
          profile_id: string
          user_id: string
          views: number | null
        }
        Insert: {
          business_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          profile_id: string
          user_id: string
          views?: number | null
        }
        Update: {
          business_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          profile_id?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          analytics_level: string | null
          billing_period: string
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_listings: number | null
          message_quota: number | null
          name: string
          price: number
          support_level: string | null
        }
        Insert: {
          analytics_level?: string | null
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_listings?: number | null
          message_quota?: number | null
          name: string
          price: number
          support_level?: string | null
        }
        Update: {
          analytics_level?: string | null
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_listings?: number | null
          message_quota?: number | null
          name?: string
          price?: number
          support_level?: string | null
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          allow_direct_messages: boolean | null
          anonymize_number: boolean | null
          created_at: string
          id: string
          show_contact_info: boolean | null
          show_location: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_direct_messages?: boolean | null
          anonymize_number?: boolean | null
          created_at?: string
          id?: string
          show_contact_info?: boolean | null
          show_location?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_direct_messages?: boolean | null
          anonymize_number?: boolean | null
          created_at?: string
          id?: string
          show_contact_info?: boolean | null
          show_location?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      product_labels: {
        Row: {
          attributes: Json
          created_at: string | null
          id: string
          name: string
          product_id: string | null
        }
        Insert: {
          attributes?: Json
          created_at?: string | null
          id?: string
          name: string
          product_id?: string | null
        }
        Update: {
          attributes?: Json
          created_at?: string | null
          id?: string
          name?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_labels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_purchases: {
        Row: {
          id: string
          product_id: string | null
          purchase_date: string | null
          quantity: number
          user_id: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          purchase_date?: string | null
          quantity?: number
          user_id?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          purchase_date?: string | null
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_name: string | null
          category: string
          condition: string | null
          created_at: string
          description: string
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_branded: boolean | null
          is_discounted: boolean | null
          is_used: boolean | null
          model: string | null
          original_price: number | null
          price: number
          reach: number | null
          service_product_id: string | null
          size: string | null
          stock: number
          subcategory: string | null
          title: string
          user_id: string | null
          views: number | null
        }
        Insert: {
          brand_name?: string | null
          category: string
          condition?: string | null
          created_at?: string
          description: string
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_branded?: boolean | null
          is_discounted?: boolean | null
          is_used?: boolean | null
          model?: string | null
          original_price?: number | null
          price: number
          reach?: number | null
          service_product_id?: string | null
          size?: string | null
          stock?: number
          subcategory?: string | null
          title: string
          user_id?: string | null
          views?: number | null
        }
        Update: {
          brand_name?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          description?: string
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_branded?: boolean | null
          is_discounted?: boolean | null
          is_used?: boolean | null
          model?: string | null
          original_price?: number | null
          price?: number
          reach?: number | null
          service_product_id?: string | null
          size?: string | null
          stock?: number
          subcategory?: string | null
          title?: string
          user_id?: string | null
          views?: number | null
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
          location: string | null
          name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          location?: string | null
          name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reposts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reposts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_product_labels: {
        Row: {
          attributes: Json
          created_at: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          attributes?: Json
          created_at?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          attributes?: Json
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          gif_url: string | null
          group_id: string | null
          id: string
          image_url: string | null
          location: string | null
          poll_id: string | null
          profile_id: string
          scheduled_for: string
          status: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          gif_url?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          poll_id?: string | null
          profile_id: string
          scheduled_for: string
          status?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          gif_url?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          poll_id?: string | null
          profile_id?: string
          scheduled_for?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_posts_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          corrected_query: string | null
          created_at: string | null
          id: string
          model_used: string
          query: string
          results_count: number | null
          user_id: string | null
        }
        Insert: {
          corrected_query?: string | null
          created_at?: string | null
          id?: string
          model_used: string
          query: string
          results_count?: number | null
          user_id?: string | null
        }
        Update: {
          corrected_query?: string | null
          created_at?: string | null
          id?: string
          model_used?: string
          query?: string
          results_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      search_result_clicks: {
        Row: {
          created_at: string | null
          id: string
          is_sponsored: boolean | null
          query: string
          result_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_sponsored?: boolean | null
          query: string
          result_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_sponsored?: boolean | null
          query?: string
          result_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      search_suggestions: {
        Row: {
          category: string | null
          created_at: string | null
          frequency: number | null
          id: string
          term: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          term: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          term?: string
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
          views: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          service_id: string
          title: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          service_id?: string
          title?: string
          video_url?: string | null
          views?: number | null
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
          is_open: boolean | null
          location: string | null
          price: number
          title: string
          user_id: string
          views: number | null
        }
        Insert: {
          availability?: string | null
          category: string
          contact_info?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          location?: string | null
          price: number
          title: string
          user_id: string
          views?: number | null
        }
        Update: {
          availability?: string | null
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          location?: string | null
          price?: number
          title?: string
          user_id?: string
          views?: number | null
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
      sponsored_search_terms: {
        Row: {
          bid_amount: number
          business_id: string | null
          created_at: string | null
          id: string
          status: string
          term: string
        }
        Insert: {
          bid_amount?: number
          business_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          term: string
        }
        Update: {
          bid_amount?: number
          business_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          term?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          is_online: boolean | null
          last_seen_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          is_online?: boolean | null
          last_seen_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          is_online?: boolean | null
          last_seen_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_recordings: {
        Row: {
          audio_url: string
          created_at: string | null
          id: string
          transcription: string | null
          user_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          id?: string
          transcription?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          id?: string
          transcription?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_search_suggestion_exists: {
        Args: {
          term_param: string
        }
        Returns: boolean
      }
      cleanup_expired_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_marketplace_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_search_suggestion: {
        Args: {
          term_param: string
          category_param: string
        }
        Returns: string
      }
      create_test_user: {
        Args: {
          input_email: string
          input_username: string
          input_avatar_url: string
          input_bio: string
          input_location: string
        }
        Returns: string
      }
      delete_business_cascade: {
        Args: {
          business_id_param: string
        }
        Returns: boolean
      }
      delete_product_safely: {
        Args: {
          product_id_param: string
          is_business_product?: boolean
        }
        Returns: boolean
      }
      delete_service_safely: {
        Args: {
          service_id_param: string
        }
        Returns: boolean
      }
      get_group_members: {
        Args: {
          group_id: string
        }
        Returns: {
          count: number
          members: string[]
        }[]
      }
      get_image_search_url: {
        Args: {
          image_id_param: string
        }
        Returns: Json
      }
      get_sample_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_presence: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_voice_recording_url: {
        Args: {
          recording_id_param: string
        }
        Returns: Json
      }
      increment_ad_clicks: {
        Args: {
          ad_id: string
        }
        Returns: undefined
      }
      increment_ad_views: {
        Args: {
          ad_id: string
        }
        Returns: undefined
      }
      increment_business_views: {
        Args: {
          business_id_param: string
        }
        Returns: undefined
      }
      increment_post_views: {
        Args: {
          post_id_param: string
        }
        Returns: undefined
      }
      increment_product_views: {
        Args: {
          product_id_param: string
        }
        Returns: undefined
      }
      increment_search_suggestion: {
        Args: {
          term_param: string
        }
        Returns: undefined
      }
      increment_service_views: {
        Args: {
          service_id_param: string
        }
        Returns: undefined
      }
      increment_views: {
        Args: {
          table_name: string
          record_id: string
        }
        Returns: undefined
      }
      insert_image_search: {
        Args: {
          user_id_param: string
          image_url_param: string
        }
        Returns: string
      }
      insert_image_search_with_description: {
        Args: {
          user_id_param: string
          image_url_param: string
          description_param: string
        }
        Returns: string
      }
      insert_search_query: {
        Args: {
          user_id_param: string
          query_param: string
          corrected_query_param: string
          model_used_param: string
          results_count_param: number
        }
        Returns: string
      }
      insert_voice_recording: {
        Args: {
          user_id_param: string
          audio_url_param: string
        }
        Returns: string
      }
      insert_voice_recording_with_transcription: {
        Args: {
          user_id_param: string
          audio_url_param: string
          transcription_param: string
        }
        Returns: string
      }
      publish_scheduled_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      record_search_result_click: {
        Args: {
          user_id_param: string
          query_param: string
          result_id_param: string
          is_sponsored_param: boolean
        }
        Returns: string
      }
      update_image_search_description: {
        Args: {
          image_id_param: string
          description_param: string
        }
        Returns: undefined
      }
      update_user_presence: {
        Args: {
          user_id: string
          last_seen_time: string
        }
        Returns: boolean
      }
      update_voice_recording_transcription: {
        Args: {
          recording_id_param: string
          transcription_param: string
        }
        Returns: undefined
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

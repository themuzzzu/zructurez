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
        Relationships: []
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
      ad_clicks: {
        Row: {
          ad_id: string
          clicked_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          ad_id: string
          clicked_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          ad_id?: string
          clicked_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_impressions: {
        Row: {
          ad_id: string
          id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          ad_id: string
          id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          ad_id?: string
          id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
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
      admin_activity_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          status: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          status?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          status?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          admin_badge: string | null
          admin_level: string | null
          assigned_cities: string[] | null
          assigned_districts: string[] | null
          created_at: string | null
          department: string | null
          id: number
          is_active: boolean | null
          permissions: string[] | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          admin_badge?: string | null
          admin_level?: string | null
          assigned_cities?: string[] | null
          assigned_districts?: string[] | null
          created_at?: string | null
          department?: string | null
          id?: number
          is_active?: boolean | null
          permissions?: string[] | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          admin_badge?: string | null
          admin_level?: string | null
          assigned_cities?: string[] | null
          assigned_districts?: string[] | null
          created_at?: string | null
          department?: string | null
          id?: number
          is_active?: boolean | null
          permissions?: string[] | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_analytics: {
        Row: {
          ad_clicks: number | null
          ad_frequency: number | null
          ad_id: string
          ad_impressions: number | null
          bounce_rate: number | null
          budget_utilized: number | null
          business_id: string
          campaign_id: string | null
          click_through_rate: number | null
          conversion_count: number | null
          conversion_rate: number | null
          cost_per_click: number | null
          cost_per_conversion: number | null
          cost_per_impression: number | null
          created_at: string | null
          date_tracked: string
          demographic_performance: Json | null
          device_performance: Json | null
          geographic_performance: Json | null
          id: string
          interaction_rate: number | null
          leads_generated: number | null
          negative_feedback: number | null
          page_views_per_session: number | null
          quality_score: number | null
          regional_cpc: Json | null
          relevance_score: number | null
          return_on_ad_spend: number | null
          revenue_attributed: number | null
          sales_generated: number | null
          time_of_day_performance: Json | null
          time_on_ad_seconds: number | null
          top_performing_regions: Json | null
          total_spend: number | null
          unique_clicks: number | null
          unique_impressions: number | null
          updated_at: string | null
          video_completion_rate: number | null
        }
        Insert: {
          ad_clicks?: number | null
          ad_frequency?: number | null
          ad_id: string
          ad_impressions?: number | null
          bounce_rate?: number | null
          budget_utilized?: number | null
          business_id: string
          campaign_id?: string | null
          click_through_rate?: number | null
          conversion_count?: number | null
          conversion_rate?: number | null
          cost_per_click?: number | null
          cost_per_conversion?: number | null
          cost_per_impression?: number | null
          created_at?: string | null
          date_tracked?: string
          demographic_performance?: Json | null
          device_performance?: Json | null
          geographic_performance?: Json | null
          id?: string
          interaction_rate?: number | null
          leads_generated?: number | null
          negative_feedback?: number | null
          page_views_per_session?: number | null
          quality_score?: number | null
          regional_cpc?: Json | null
          relevance_score?: number | null
          return_on_ad_spend?: number | null
          revenue_attributed?: number | null
          sales_generated?: number | null
          time_of_day_performance?: Json | null
          time_on_ad_seconds?: number | null
          top_performing_regions?: Json | null
          total_spend?: number | null
          unique_clicks?: number | null
          unique_impressions?: number | null
          updated_at?: string | null
          video_completion_rate?: number | null
        }
        Update: {
          ad_clicks?: number | null
          ad_frequency?: number | null
          ad_id?: string
          ad_impressions?: number | null
          bounce_rate?: number | null
          budget_utilized?: number | null
          business_id?: string
          campaign_id?: string | null
          click_through_rate?: number | null
          conversion_count?: number | null
          conversion_rate?: number | null
          cost_per_click?: number | null
          cost_per_conversion?: number | null
          cost_per_impression?: number | null
          created_at?: string | null
          date_tracked?: string
          demographic_performance?: Json | null
          device_performance?: Json | null
          geographic_performance?: Json | null
          id?: string
          interaction_rate?: number | null
          leads_generated?: number | null
          negative_feedback?: number | null
          page_views_per_session?: number | null
          quality_score?: number | null
          regional_cpc?: Json | null
          relevance_score?: number | null
          return_on_ad_spend?: number | null
          revenue_attributed?: number | null
          sales_generated?: number | null
          time_of_day_performance?: Json | null
          time_on_ad_seconds?: number | null
          top_performing_regions?: Json | null
          total_spend?: number | null
          unique_clicks?: number | null
          unique_impressions?: number | null
          updated_at?: string | null
          video_completion_rate?: number | null
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          budget: number | null
          business_id: string | null
          clicks: number | null
          created_at: string | null
          cta_text: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          impressions: number | null
          language_primary: string | null
          link_url: string | null
          location: string | null
          location_hierarchy: Json | null
          location_tag: string[] | null
          position: string | null
          price: number | null
          reach: number | null
          reference_id: string | null
          section: string | null
          start_date: string
          status: string
          target_city: string | null
          target_country: string | null
          target_precision: number | null
          target_state: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          budget?: number | null
          business_id?: string | null
          clicks?: number | null
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          impressions?: number | null
          language_primary?: string | null
          link_url?: string | null
          location?: string | null
          location_hierarchy?: Json | null
          location_tag?: string[] | null
          position?: string | null
          price?: number | null
          reach?: number | null
          reference_id?: string | null
          section?: string | null
          start_date?: string
          status?: string
          target_city?: string | null
          target_country?: string | null
          target_precision?: number | null
          target_state?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          budget?: number | null
          business_id?: string | null
          clicks?: number | null
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          impressions?: number | null
          language_primary?: string | null
          link_url?: string | null
          location?: string | null
          location_hierarchy?: Json | null
          location_tag?: string[] | null
          position?: string | null
          price?: number | null
          reach?: number | null
          reference_id?: string | null
          section?: string | null
          start_date?: string
          status?: string
          target_city?: string | null
          target_country?: string | null
          target_precision?: number | null
          target_state?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_advertisements_business_id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_advertisements_business_id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      age_demographics_analytics: {
        Row: {
          age_group: string
          average_order_value: number | null
          business_id: string
          call_clicks: number | null
          comments_count: number | null
          contact_clicks: number | null
          created_at: string | null
          date_tracked: string
          id: string
          likes_count: number | null
          message_clicks: number | null
          purchases_count: number | null
          revenue_generated: number | null
          shares_count: number | null
          views_count: number | null
          website_clicks: number | null
          wishlist_additions: number | null
          wishlist_conversions: number | null
        }
        Insert: {
          age_group: string
          average_order_value?: number | null
          business_id: string
          call_clicks?: number | null
          comments_count?: number | null
          contact_clicks?: number | null
          created_at?: string | null
          date_tracked?: string
          id?: string
          likes_count?: number | null
          message_clicks?: number | null
          purchases_count?: number | null
          revenue_generated?: number | null
          shares_count?: number | null
          views_count?: number | null
          website_clicks?: number | null
          wishlist_additions?: number | null
          wishlist_conversions?: number | null
        }
        Update: {
          age_group?: string
          average_order_value?: number | null
          business_id?: string
          call_clicks?: number | null
          comments_count?: number | null
          contact_clicks?: number | null
          created_at?: string | null
          date_tracked?: string
          id?: string
          likes_count?: number | null
          message_clicks?: number | null
          purchases_count?: number | null
          revenue_generated?: number | null
          shares_count?: number | null
          views_count?: number | null
          website_clicks?: number | null
          wishlist_additions?: number | null
          wishlist_conversions?: number | null
        }
        Relationships: []
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
        Relationships: []
      }
      batch_analytics_events: {
        Row: {
          created_at: string | null
          events: Json
          id: string
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          events: Json
          id?: string
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          events?: Json
          id?: string
          processed?: boolean | null
        }
        Relationships: []
      }
      best_work_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          work_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          work_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          work_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "best_work_likes_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "best_works"
            referencedColumns: ["id"]
          },
        ]
      }
      best_works: {
        Row: {
          business_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          testimonial: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          testimonial?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          testimonial?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
            foreignKeyName: "bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_analytics: {
        Row: {
          average_order_value: number | null
          bookings_made: number | null
          bounce_rate: number | null
          business_custom_id: string | null
          business_id: string
          call_clicks: number | null
          comments_count: number | null
          commission_revenue: number | null
          contact_clicks: number | null
          conversion_rate: number | null
          created_at: string | null
          customer_retention_rate: number | null
          customer_satisfaction: number | null
          date_recorded: string | null
          date_tracked: string
          direction_clicks: number | null
          email_clicks: number | null
          engagement_score: number | null
          enquiries_count: number | null
          feedback_count: number | null
          follow_actions: number | null
          gallery_views: number | null
          id: string
          leads_generated: number | null
          likes_received: number | null
          menu_clicks: number | null
          message_clicks: number | null
          new_customers: number | null
          overview_clicks: number | null
          page_views: number | null
          performance_score: number | null
          photo_views: number | null
          popularity_score: number | null
          portfolio_clicks: number | null
          product_revenue: number | null
          profile_visits: number | null
          purchases_completed: number | null
          quality_score: number | null
          quotes_requested: number | null
          returning_customers: number | null
          revenue_total: number | null
          saved_business_count: number | null
          saves_count: number | null
          service_revenue: number | null
          session_duration_avg: number | null
          shares_count: number | null
          social_media_clicks: number | null
          subscription_revenue: number | null
          testimonial_views: number | null
          total_revenue: number | null
          total_visits: number | null
          trending_score: number | null
          unique_visitors: number | null
          updated_at: string | null
          verified_badge_boost: number | null
          website_clicks: number | null
          whatsapp_clicks: number | null
          wishlist_additions: number | null
          wishlist_removals: number | null
          wishlist_to_purchase: number | null
        }
        Insert: {
          average_order_value?: number | null
          bookings_made?: number | null
          bounce_rate?: number | null
          business_custom_id?: string | null
          business_id: string
          call_clicks?: number | null
          comments_count?: number | null
          commission_revenue?: number | null
          contact_clicks?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_retention_rate?: number | null
          customer_satisfaction?: number | null
          date_recorded?: string | null
          date_tracked?: string
          direction_clicks?: number | null
          email_clicks?: number | null
          engagement_score?: number | null
          enquiries_count?: number | null
          feedback_count?: number | null
          follow_actions?: number | null
          gallery_views?: number | null
          id?: string
          leads_generated?: number | null
          likes_received?: number | null
          menu_clicks?: number | null
          message_clicks?: number | null
          new_customers?: number | null
          overview_clicks?: number | null
          page_views?: number | null
          performance_score?: number | null
          photo_views?: number | null
          popularity_score?: number | null
          portfolio_clicks?: number | null
          product_revenue?: number | null
          profile_visits?: number | null
          purchases_completed?: number | null
          quality_score?: number | null
          quotes_requested?: number | null
          returning_customers?: number | null
          revenue_total?: number | null
          saved_business_count?: number | null
          saves_count?: number | null
          service_revenue?: number | null
          session_duration_avg?: number | null
          shares_count?: number | null
          social_media_clicks?: number | null
          subscription_revenue?: number | null
          testimonial_views?: number | null
          total_revenue?: number | null
          total_visits?: number | null
          trending_score?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          verified_badge_boost?: number | null
          website_clicks?: number | null
          whatsapp_clicks?: number | null
          wishlist_additions?: number | null
          wishlist_removals?: number | null
          wishlist_to_purchase?: number | null
        }
        Update: {
          average_order_value?: number | null
          bookings_made?: number | null
          bounce_rate?: number | null
          business_custom_id?: string | null
          business_id?: string
          call_clicks?: number | null
          comments_count?: number | null
          commission_revenue?: number | null
          contact_clicks?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_retention_rate?: number | null
          customer_satisfaction?: number | null
          date_recorded?: string | null
          date_tracked?: string
          direction_clicks?: number | null
          email_clicks?: number | null
          engagement_score?: number | null
          enquiries_count?: number | null
          feedback_count?: number | null
          follow_actions?: number | null
          gallery_views?: number | null
          id?: string
          leads_generated?: number | null
          likes_received?: number | null
          menu_clicks?: number | null
          message_clicks?: number | null
          new_customers?: number | null
          overview_clicks?: number | null
          page_views?: number | null
          performance_score?: number | null
          photo_views?: number | null
          popularity_score?: number | null
          portfolio_clicks?: number | null
          product_revenue?: number | null
          profile_visits?: number | null
          purchases_completed?: number | null
          quality_score?: number | null
          quotes_requested?: number | null
          returning_customers?: number | null
          revenue_total?: number | null
          saved_business_count?: number | null
          saves_count?: number | null
          service_revenue?: number | null
          session_duration_avg?: number | null
          shares_count?: number | null
          social_media_clicks?: number | null
          subscription_revenue?: number | null
          testimonial_views?: number | null
          total_revenue?: number | null
          total_visits?: number | null
          trending_score?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          verified_badge_boost?: number | null
          website_clicks?: number | null
          whatsapp_clicks?: number | null
          wishlist_additions?: number | null
          wishlist_removals?: number | null
          wishlist_to_purchase?: number | null
        }
        Relationships: []
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
        Relationships: []
      }
      business_booking_slots: {
        Row: {
          business_id: string | null
          created_at: string | null
          day_of_week: string
          end_time: string
          id: string
          max_bookings: number | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          day_of_week: string
          end_time: string
          id?: string
          max_bookings?: number | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          id?: string
          max_bookings?: number | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      business_comments: {
        Row: {
          business_id: string
          content: string | null
          contentascomment: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          profile_id: string | null
          rating: number | null
          reply_to: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id: string
          content?: string | null
          contentascomment?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          profile_id?: string | null
          rating?: number | null
          reply_to?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string
          content?: string | null
          contentascomment?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          profile_id?: string | null
          rating?: number | null
          reply_to?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_comments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
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
        Relationships: []
      }
      business_competitive_analytics: {
        Row: {
          business_id: string
          competitor_avg_rating: number | null
          competitor_business_id: string
          competitor_content_engagement_rate: number | null
          competitor_conversion_rate: number | null
          competitor_engagement_rate: number | null
          competitor_views: number | null
          content_engagement_gap: number | null
          conversion_gap: number | null
          created_at: string | null
          date_tracked: string
          engagement_gap: number | null
          id: string
          market_share_percentage: number | null
          our_avg_rating: number | null
          our_content_engagement_rate: number | null
          our_conversion_rate: number | null
          our_engagement_rate: number | null
          our_views: number | null
          ranking_position: number | null
          relative_growth_rate: number | null
          views_gap: number | null
        }
        Insert: {
          business_id: string
          competitor_avg_rating?: number | null
          competitor_business_id: string
          competitor_content_engagement_rate?: number | null
          competitor_conversion_rate?: number | null
          competitor_engagement_rate?: number | null
          competitor_views?: number | null
          content_engagement_gap?: number | null
          conversion_gap?: number | null
          created_at?: string | null
          date_tracked: string
          engagement_gap?: number | null
          id?: string
          market_share_percentage?: number | null
          our_avg_rating?: number | null
          our_content_engagement_rate?: number | null
          our_conversion_rate?: number | null
          our_engagement_rate?: number | null
          our_views?: number | null
          ranking_position?: number | null
          relative_growth_rate?: number | null
          views_gap?: number | null
        }
        Update: {
          business_id?: string
          competitor_avg_rating?: number | null
          competitor_business_id?: string
          competitor_content_engagement_rate?: number | null
          competitor_conversion_rate?: number | null
          competitor_engagement_rate?: number | null
          competitor_views?: number | null
          content_engagement_gap?: number | null
          conversion_gap?: number | null
          created_at?: string | null
          date_tracked?: string
          engagement_gap?: number | null
          id?: string
          market_share_percentage?: number | null
          our_avg_rating?: number | null
          our_content_engagement_rate?: number | null
          our_conversion_rate?: number | null
          our_engagement_rate?: number | null
          our_views?: number | null
          ranking_position?: number | null
          relative_growth_rate?: number | null
          views_gap?: number | null
        }
        Relationships: []
      }
      business_deals: {
        Row: {
          badge_text: string | null
          business_id: string
          created_at: string | null
          current_redemptions: number | null
          deal_type: string | null
          description: string | null
          discount_percentage: number | null
          discounted_price: number | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_redemptions: number | null
          original_price: number | null
          start_date: string | null
          terms_conditions: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          badge_text?: string | null
          business_id: string
          created_at?: string | null
          current_redemptions?: number | null
          deal_type?: string | null
          description?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_redemptions?: number | null
          original_price?: number | null
          start_date?: string | null
          terms_conditions?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          badge_text?: string | null
          business_id?: string
          created_at?: string | null
          current_redemptions?: number | null
          deal_type?: string | null
          description?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_redemptions?: number | null
          original_price?: number | null
          start_date?: string | null
          terms_conditions?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_event_analytics: {
        Row: {
          business_id: string
          city: string | null
          country: string | null
          created_at: string | null
          event_source: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          referrer: string | null
          session_id: string | null
          state: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
          user_location: unknown | null
        }
        Insert: {
          business_id: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          event_source?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          referrer?: string | null
          session_id?: string | null
          state?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_location?: unknown | null
        }
        Update: {
          business_id?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          event_source?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          referrer?: string | null
          session_id?: string | null
          state?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_location?: unknown | null
        }
        Relationships: []
      }
      business_extended_metadata: {
        Row: {
          amenities_json: string | null
          business_id: string
          seo_data_json: string | null
          social_media_json: string | null
          tags_json: string | null
          updated_at: string | null
        }
        Insert: {
          amenities_json?: string | null
          business_id: string
          seo_data_json?: string | null
          social_media_json?: string | null
          tags_json?: string | null
          updated_at?: string | null
        }
        Update: {
          amenities_json?: string | null
          business_id?: string
          seo_data_json?: string | null
          social_media_json?: string | null
          tags_json?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_interactions: {
        Row: {
          action_type: string
          business_category: string | null
          business_custom_id: string | null
          business_id: string
          business_region: string | null
          campaign_id: string | null
          created_at: string | null
          device_type: string | null
          id: string
          interaction_duration_ms: number | null
          interaction_value: number | null
          ip_address: unknown | null
          is_authenticated: boolean | null
          is_business_verified: boolean | null
          metadata: Json | null
          platform: string | null
          referrer_source: string | null
          session_id: string | null
          source_page: string | null
          user_agent: string | null
          user_area: string | null
          user_city: string | null
          user_colony: string | null
          user_id: string | null
          user_lat: number | null
          user_location_accuracy: number | null
          user_lon: number | null
          user_pincode: string | null
          user_region: string | null
        }
        Insert: {
          action_type: string
          business_category?: string | null
          business_custom_id?: string | null
          business_id: string
          business_region?: string | null
          campaign_id?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          interaction_duration_ms?: number | null
          interaction_value?: number | null
          ip_address?: unknown | null
          is_authenticated?: boolean | null
          is_business_verified?: boolean | null
          metadata?: Json | null
          platform?: string | null
          referrer_source?: string | null
          session_id?: string | null
          source_page?: string | null
          user_agent?: string | null
          user_area?: string | null
          user_city?: string | null
          user_colony?: string | null
          user_id?: string | null
          user_lat?: number | null
          user_location_accuracy?: number | null
          user_lon?: number | null
          user_pincode?: string | null
          user_region?: string | null
        }
        Update: {
          action_type?: string
          business_category?: string | null
          business_custom_id?: string | null
          business_id?: string
          business_region?: string | null
          campaign_id?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          interaction_duration_ms?: number | null
          interaction_value?: number | null
          ip_address?: unknown | null
          is_authenticated?: boolean | null
          is_business_verified?: boolean | null
          metadata?: Json | null
          platform?: string | null
          referrer_source?: string | null
          session_id?: string | null
          source_page?: string | null
          user_agent?: string | null
          user_area?: string | null
          user_city?: string | null
          user_colony?: string | null
          user_id?: string | null
          user_lat?: number | null
          user_location_accuracy?: number | null
          user_lon?: number | null
          user_pincode?: string | null
          user_region?: string | null
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      business_photos: {
        Row: {
          business_id: string
          created_at: string
          id: string
          image_url: string
          photo_url: string | null
          title: string
          url: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          image_url: string
          photo_url?: string | null
          title: string
          url?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          image_url?: string
          photo_url?: string | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      business_portfolio: {
        Row: {
          business_id: string
          category: string | null
          client_name: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          order_num: number | null
          project_date: string | null
          project_status: string | null
          tags: string[] | null
          title: string
          views: number | null
        }
        Insert: {
          business_id: string
          category?: string | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          order_num?: number | null
          project_date?: string | null
          project_status?: string | null
          tags?: string[] | null
          title: string
          views?: number | null
        }
        Update: {
          business_id?: string
          category?: string | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          order_num?: number | null
          project_date?: string | null
          project_status?: string | null
          tags?: string[] | null
          title?: string
          views?: number | null
        }
        Relationships: []
      }
      business_ratings: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      business_real_time_stats: {
        Row: {
          avg_rating: number | null
          avg_session_duration_ms: number | null
          business_id: string
          content_engagement_rate: number | null
          conversion_rate: number | null
          customer_retention_rate: number | null
          engagement_rate: number | null
          growth_rate: number | null
          last_updated: string | null
          month_check_ins: number | null
          month_conversions: number | null
          month_menu_clicks: number | null
          month_overview_clicks: number | null
          month_photos_clicks: number | null
          month_portfolio_clicks: number | null
          month_promotion_redemptions: number | null
          month_revenue: number | null
          month_views: number | null
          region_distribution: Json | null
          today_bookings: number | null
          today_calls: number | null
          today_check_ins: number | null
          today_follows: number | null
          today_likes: number | null
          today_menu_clicks: number | null
          today_messages: number | null
          today_overview_clicks: number | null
          today_photos_clicks: number | null
          today_portfolio_clicks: number | null
          today_promotion_clicks: number | null
          today_shares: number | null
          today_views: number | null
          top_region: string | null
          top_traffic_source: string | null
          total_followers: number | null
          total_menu_clicks: number | null
          total_overview_clicks: number | null
          total_photos_clicks: number | null
          total_portfolio_clicks: number | null
          total_reviews: number | null
          total_views: number | null
          trend_direction: string | null
          week_calls: number | null
          week_conversions: number | null
          week_likes: number | null
          week_menu_clicks: number | null
          week_overview_clicks: number | null
          week_photos_clicks: number | null
          week_portfolio_clicks: number | null
          week_views: number | null
        }
        Insert: {
          avg_rating?: number | null
          avg_session_duration_ms?: number | null
          business_id: string
          content_engagement_rate?: number | null
          conversion_rate?: number | null
          customer_retention_rate?: number | null
          engagement_rate?: number | null
          growth_rate?: number | null
          last_updated?: string | null
          month_check_ins?: number | null
          month_conversions?: number | null
          month_menu_clicks?: number | null
          month_overview_clicks?: number | null
          month_photos_clicks?: number | null
          month_portfolio_clicks?: number | null
          month_promotion_redemptions?: number | null
          month_revenue?: number | null
          month_views?: number | null
          region_distribution?: Json | null
          today_bookings?: number | null
          today_calls?: number | null
          today_check_ins?: number | null
          today_follows?: number | null
          today_likes?: number | null
          today_menu_clicks?: number | null
          today_messages?: number | null
          today_overview_clicks?: number | null
          today_photos_clicks?: number | null
          today_portfolio_clicks?: number | null
          today_promotion_clicks?: number | null
          today_shares?: number | null
          today_views?: number | null
          top_region?: string | null
          top_traffic_source?: string | null
          total_followers?: number | null
          total_menu_clicks?: number | null
          total_overview_clicks?: number | null
          total_photos_clicks?: number | null
          total_portfolio_clicks?: number | null
          total_reviews?: number | null
          total_views?: number | null
          trend_direction?: string | null
          week_calls?: number | null
          week_conversions?: number | null
          week_likes?: number | null
          week_menu_clicks?: number | null
          week_overview_clicks?: number | null
          week_photos_clicks?: number | null
          week_portfolio_clicks?: number | null
          week_views?: number | null
        }
        Update: {
          avg_rating?: number | null
          avg_session_duration_ms?: number | null
          business_id?: string
          content_engagement_rate?: number | null
          conversion_rate?: number | null
          customer_retention_rate?: number | null
          engagement_rate?: number | null
          growth_rate?: number | null
          last_updated?: string | null
          month_check_ins?: number | null
          month_conversions?: number | null
          month_menu_clicks?: number | null
          month_overview_clicks?: number | null
          month_photos_clicks?: number | null
          month_portfolio_clicks?: number | null
          month_promotion_redemptions?: number | null
          month_revenue?: number | null
          month_views?: number | null
          region_distribution?: Json | null
          today_bookings?: number | null
          today_calls?: number | null
          today_check_ins?: number | null
          today_follows?: number | null
          today_likes?: number | null
          today_menu_clicks?: number | null
          today_messages?: number | null
          today_overview_clicks?: number | null
          today_photos_clicks?: number | null
          today_portfolio_clicks?: number | null
          today_promotion_clicks?: number | null
          today_shares?: number | null
          today_views?: number | null
          top_region?: string | null
          top_traffic_source?: string | null
          total_followers?: number | null
          total_menu_clicks?: number | null
          total_overview_clicks?: number | null
          total_photos_clicks?: number | null
          total_portfolio_clicks?: number | null
          total_reviews?: number | null
          total_views?: number | null
          trend_direction?: string | null
          week_calls?: number | null
          week_conversions?: number | null
          week_likes?: number | null
          week_menu_clicks?: number | null
          week_overview_clicks?: number | null
          week_photos_clicks?: number | null
          week_portfolio_clicks?: number | null
          week_views?: number | null
        }
        Relationships: []
      }
      business_review_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          order_num: number | null
          review_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          order_num?: number | null
          review_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          order_num?: number | null
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "business_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      business_reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_services: {
        Row: {
          business_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      business_tags: {
        Row: {
          business_id: string | null
          id: string
          tag: string | null
        }
        Insert: {
          business_id?: string | null
          id?: string
          tag?: string | null
        }
        Update: {
          business_id?: string | null
          id?: string
          tag?: string | null
        }
        Relationships: []
      }
      business_updates: {
        Row: {
          business_id: string
          content: string
          created_at: string | null
          expiry_date: string | null
          external_link: string | null
          id: string
          image_url: string | null
          is_pinned: boolean | null
          is_published: boolean | null
          priority: string | null
          scheduled_date: string | null
          tags: string[] | null
          title: string
          update_type: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          content: string
          created_at?: string | null
          expiry_date?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          priority?: string | null
          scheduled_date?: string | null
          tags?: string[] | null
          title: string
          update_type?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          content?: string
          created_at?: string | null
          expiry_date?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          priority?: string | null
          scheduled_date?: string | null
          tags?: string[] | null
          title?: string
          update_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_verification_queue: {
        Row: {
          admin_notes: string | null
          assigned_at: string | null
          assigned_to: string | null
          business_id: string
          completed_at: string | null
          created_at: string | null
          documents: Json | null
          estimated_completion: string | null
          id: string
          priority: number | null
          status: string | null
          submission_notes: string | null
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string | null
          verification_checklist: Json | null
        }
        Insert: {
          admin_notes?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          business_id: string
          completed_at?: string | null
          created_at?: string | null
          documents?: Json | null
          estimated_completion?: string | null
          id?: string
          priority?: number | null
          status?: string | null
          submission_notes?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          verification_checklist?: Json | null
        }
        Update: {
          admin_notes?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          business_id?: string
          completed_at?: string | null
          created_at?: string | null
          documents?: Json | null
          estimated_completion?: string | null
          id?: string
          priority?: number | null
          status?: string | null
          submission_notes?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          verification_checklist?: Json | null
        }
        Relationships: []
      }
      business_videos: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          order_num: number | null
          thumbnail_url: string | null
          title: string | null
          url: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          order_num?: number | null
          thumbnail_url?: string | null
          title?: string | null
          url: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          order_num?: number | null
          thumbnail_url?: string | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          address_line1: string | null
          address_line2: string | null
          average_rating: number | null
          business_hours: Json | null
          business_name: string
          business_type: string | null
          category: string | null
          city: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          district: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          metadata: Json | null
          name: string | null
          owner_id: string | null
          phone: string | null
          pincode: string | null
          rating: number | null
          state: string | null
          status: string | null
          subcategory: string | null
          total_ratings: number | null
          total_reviews: number | null
          total_views: number | null
          updated_at: string | null
          user_id: string
          verification_date: string | null
          verified: boolean | null
          views: number | null
          website: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          address_line1?: string | null
          address_line2?: string | null
          average_rating?: number | null
          business_hours?: Json | null
          business_name: string
          business_type?: string | null
          category?: string | null
          city: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          metadata?: Json | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          pincode?: string | null
          rating?: number | null
          state?: string | null
          status?: string | null
          subcategory?: string | null
          total_ratings?: number | null
          total_reviews?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id: string
          verification_date?: string | null
          verified?: boolean | null
          views?: number | null
          website?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          address_line1?: string | null
          address_line2?: string | null
          average_rating?: number | null
          business_hours?: Json | null
          business_name?: string
          business_type?: string | null
          category?: string | null
          city?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          metadata?: Json | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          pincode?: string | null
          rating?: number | null
          state?: string | null
          status?: string | null
          subcategory?: string | null
          total_ratings?: number | null
          total_reviews?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
          verification_date?: string | null
          verified?: boolean | null
          views?: number | null
          website?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      cart_events: {
        Row: {
          age: number | null
          created_at: string | null
          event_type: string
          gender: string | null
          id: string
          location: string | null
          product_id: string | null
          quantity: number
          service_id: string | null
          session_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          event_type: string
          gender?: string | null
          id?: string
          location?: string | null
          product_id?: string | null
          quantity: number
          service_id?: string | null
          session_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string | null
          event_type?: string
          gender?: string | null
          id?: string
          location?: string | null
          product_id?: string | null
          quantity?: number
          service_id?: string | null
          session_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          delivery_available: boolean
          district: string
          id: string
          is_serviceable: boolean
          latitude: number | null
          longitude: number | null
          mandal: string | null
          name: string
          pincode: string | null
          population: number | null
          priority_order: number | null
          state: string
        }
        Insert: {
          created_at?: string
          delivery_available?: boolean
          district: string
          id?: string
          is_serviceable?: boolean
          latitude?: number | null
          longitude?: number | null
          mandal?: string | null
          name: string
          pincode?: string | null
          population?: number | null
          priority_order?: number | null
          state?: string
        }
        Update: {
          created_at?: string
          delivery_available?: boolean
          district?: string
          id?: string
          is_serviceable?: boolean
          latitude?: number | null
          longitude?: number | null
          mandal?: string | null
          name?: string
          pincode?: string | null
          population?: number | null
          priority_order?: number | null
          state?: string
        }
        Relationships: []
      }
      city_availability: {
        Row: {
          city_name: string
          created_at: string | null
          district: string | null
          id: number
          is_available: boolean | null
          latitude: number | null
          longitude: number | null
          region: string | null
        }
        Insert: {
          city_name: string
          created_at?: string | null
          district?: string | null
          id?: number
          is_available?: boolean | null
          latitude?: number | null
          longitude?: number | null
          region?: string | null
        }
        Update: {
          city_name?: string
          created_at?: string | null
          district?: string | null
          id?: number
          is_available?: boolean | null
          latitude?: number | null
          longitude?: number | null
          region?: string | null
        }
        Relationships: []
      }
      click_events: {
        Row: {
          age: number | null
          created_at: string | null
          event_type: string
          gender: string | null
          id: string
          location: string | null
          session_id: string
          target_id: string
          target_type: string
          timestamp: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          event_type: string
          gender?: string | null
          id?: string
          location?: string | null
          session_id: string
          target_id: string
          target_type: string
          timestamp?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string | null
          event_type?: string
          gender?: string | null
          id?: string
          location?: string | null
          session_id?: string
          target_id?: string
          target_type?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
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
            foreignKeyName: "commission_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          application_conversion_rate: number | null
          avg_hiring_time_days: number | null
          banner_image_url: string | null
          benefits_offered: Json | null
          career_growth_rating: number | null
          company_size: string | null
          company_stage: string | null
          company_values: Json | null
          compensation_rating: number | null
          contact_privacy_settings: Json | null
          created_at: string | null
          culture_rating: number | null
          description: string | null
          diversity_initiatives: Json | null
          email: string | null
          founded_year: number | null
          geographic_footprint: Json | null
          glassdoor_url: string | null
          headquarters_location: string | null
          hiring_volume_trend: string | null
          id: string
          industry: string | null
          is_verified: boolean | null
          job_posting_views: number | null
          linkedin_url: string | null
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          mission_statement: string | null
          name: string
          office_locations: Json | null
          overall_rating: number | null
          perks_and_amenities: Json | null
          profile_views: number | null
          remote_policy: string | null
          response_rate_percentage: number | null
          seo_keywords: Json | null
          slug: string | null
          social_media_links: Json | null
          sub_industry: string | null
          total_reviews: number | null
          twitter_url: string | null
          updated_at: string | null
          verification_date: string | null
          website: string | null
          work_life_balance_rating: number | null
        }
        Insert: {
          application_conversion_rate?: number | null
          avg_hiring_time_days?: number | null
          banner_image_url?: string | null
          benefits_offered?: Json | null
          career_growth_rating?: number | null
          company_size?: string | null
          company_stage?: string | null
          company_values?: Json | null
          compensation_rating?: number | null
          contact_privacy_settings?: Json | null
          created_at?: string | null
          culture_rating?: number | null
          description?: string | null
          diversity_initiatives?: Json | null
          email?: string | null
          founded_year?: number | null
          geographic_footprint?: Json | null
          glassdoor_url?: string | null
          headquarters_location?: string | null
          hiring_volume_trend?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          job_posting_views?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          mission_statement?: string | null
          name: string
          office_locations?: Json | null
          overall_rating?: number | null
          perks_and_amenities?: Json | null
          profile_views?: number | null
          remote_policy?: string | null
          response_rate_percentage?: number | null
          seo_keywords?: Json | null
          slug?: string | null
          social_media_links?: Json | null
          sub_industry?: string | null
          total_reviews?: number | null
          twitter_url?: string | null
          updated_at?: string | null
          verification_date?: string | null
          website?: string | null
          work_life_balance_rating?: number | null
        }
        Update: {
          application_conversion_rate?: number | null
          avg_hiring_time_days?: number | null
          banner_image_url?: string | null
          benefits_offered?: Json | null
          career_growth_rating?: number | null
          company_size?: string | null
          company_stage?: string | null
          company_values?: Json | null
          compensation_rating?: number | null
          contact_privacy_settings?: Json | null
          created_at?: string | null
          culture_rating?: number | null
          description?: string | null
          diversity_initiatives?: Json | null
          email?: string | null
          founded_year?: number | null
          geographic_footprint?: Json | null
          glassdoor_url?: string | null
          headquarters_location?: string | null
          hiring_volume_trend?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          job_posting_views?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          mission_statement?: string | null
          name?: string
          office_locations?: Json | null
          overall_rating?: number | null
          perks_and_amenities?: Json | null
          profile_views?: number | null
          remote_policy?: string | null
          response_rate_percentage?: number | null
          seo_keywords?: Json | null
          slug?: string | null
          social_media_links?: Json | null
          sub_industry?: string | null
          total_reviews?: number | null
          twitter_url?: string | null
          updated_at?: string | null
          verification_date?: string | null
          website?: string | null
          work_life_balance_rating?: number | null
        }
        Relationships: []
      }
      company_reviews: {
        Row: {
          career_growth_rating: number | null
          company_id: string | null
          compensation_rating: number | null
          created_at: string | null
          culture_rating: number | null
          employment_duration: string | null
          employment_status: string | null
          helpful_count: number | null
          id: string
          is_anonymous: boolean | null
          is_verified: boolean | null
          job_title: string | null
          management_rating: number | null
          rating: number
          review_text: string
          reviewer_id: string | null
          title: string | null
          updated_at: string | null
          work_life_balance_rating: number | null
        }
        Insert: {
          career_growth_rating?: number | null
          company_id?: string | null
          compensation_rating?: number | null
          created_at?: string | null
          culture_rating?: number | null
          employment_duration?: string | null
          employment_status?: string | null
          helpful_count?: number | null
          id?: string
          is_anonymous?: boolean | null
          is_verified?: boolean | null
          job_title?: string | null
          management_rating?: number | null
          rating: number
          review_text: string
          reviewer_id?: string | null
          title?: string | null
          updated_at?: string | null
          work_life_balance_rating?: number | null
        }
        Update: {
          career_growth_rating?: number | null
          company_id?: string | null
          compensation_rating?: number | null
          created_at?: string | null
          culture_rating?: number | null
          employment_duration?: string | null
          employment_status?: string | null
          helpful_count?: number | null
          id?: string
          is_anonymous?: boolean | null
          is_verified?: boolean | null
          job_title?: string | null
          management_rating?: number | null
          rating?: number
          review_text?: string
          reviewer_id?: string | null
          title?: string | null
          updated_at?: string | null
          work_life_balance_rating?: number | null
        }
        Relationships: []
      }
      content_moderation: {
        Row: {
          auto_flagged: boolean | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          moderator_id: string | null
          moderator_notes: string | null
          reason: string | null
          reported_by: string | null
          resolved_at: string | null
          reviewed_at: string | null
          severity_level: number | null
          status: string | null
        }
        Insert: {
          auto_flagged?: boolean | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          reason?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          reviewed_at?: string | null
          severity_level?: number | null
          status?: string | null
        }
        Update: {
          auto_flagged?: boolean | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          reason?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          reviewed_at?: string | null
          severity_level?: number | null
          status?: string | null
        }
        Relationships: []
      }
      deleted_businesses: {
        Row: {
          backup_data: Json | null
          business_name: string | null
          city: string | null
          deleted_at: string | null
          id: string
          original_business_id: string
          permanent_delete_at: string | null
          state: string | null
          user_id: string | null
        }
        Insert: {
          backup_data?: Json | null
          business_name?: string | null
          city?: string | null
          deleted_at?: string | null
          id?: string
          original_business_id: string
          permanent_delete_at?: string | null
          state?: string | null
          user_id?: string | null
        }
        Update: {
          backup_data?: Json | null
          business_name?: string | null
          city?: string | null
          deleted_at?: string | null
          id?: string
          original_business_id?: string
          permanent_delete_at?: string | null
          state?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_analytics: {
        Row: {
          actual_delivery_time_mins: number | null
          actual_preparation_time: number | null
          business_id: string
          created_at: string | null
          current_status: string | null
          customer_rating: number | null
          date_tracked: string
          delay_minutes: number | null
          delay_reason: string | null
          delivery_area: string | null
          delivery_city: string | null
          delivery_cost: number | null
          delivery_density_score: number | null
          delivery_latitude: number | null
          delivery_longitude: number | null
          delivery_partner_rating: number | null
          estimated_delivery_time: string | null
          estimated_delivery_time_mins: number | null
          estimated_preparation_time: number | null
          eta_accuracy_percentage: number | null
          id: string
          last_status_update: string | null
          live_latitude: number | null
          live_longitude: number | null
          on_time_delivery: boolean | null
          order_id: string
          orders_accepted: number | null
          orders_cancelled: number | null
          orders_delivered: number | null
          orders_out_for_delivery: number | null
          orders_picked_up: number | null
          orders_placed: number | null
          orders_prepared: number | null
          pickup_area: string | null
          pickup_city: string | null
          pickup_latitude: number | null
          pickup_longitude: number | null
          route_efficiency_score: number | null
          surge_multiplier: number | null
          total_distance_km: number | null
          traffic_conditions: string | null
          updated_at: string | null
          weather_impact: string | null
        }
        Insert: {
          actual_delivery_time_mins?: number | null
          actual_preparation_time?: number | null
          business_id: string
          created_at?: string | null
          current_status?: string | null
          customer_rating?: number | null
          date_tracked?: string
          delay_minutes?: number | null
          delay_reason?: string | null
          delivery_area?: string | null
          delivery_city?: string | null
          delivery_cost?: number | null
          delivery_density_score?: number | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_partner_rating?: number | null
          estimated_delivery_time?: string | null
          estimated_delivery_time_mins?: number | null
          estimated_preparation_time?: number | null
          eta_accuracy_percentage?: number | null
          id?: string
          last_status_update?: string | null
          live_latitude?: number | null
          live_longitude?: number | null
          on_time_delivery?: boolean | null
          order_id: string
          orders_accepted?: number | null
          orders_cancelled?: number | null
          orders_delivered?: number | null
          orders_out_for_delivery?: number | null
          orders_picked_up?: number | null
          orders_placed?: number | null
          orders_prepared?: number | null
          pickup_area?: string | null
          pickup_city?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          route_efficiency_score?: number | null
          surge_multiplier?: number | null
          total_distance_km?: number | null
          traffic_conditions?: string | null
          updated_at?: string | null
          weather_impact?: string | null
        }
        Update: {
          actual_delivery_time_mins?: number | null
          actual_preparation_time?: number | null
          business_id?: string
          created_at?: string | null
          current_status?: string | null
          customer_rating?: number | null
          date_tracked?: string
          delay_minutes?: number | null
          delay_reason?: string | null
          delivery_area?: string | null
          delivery_city?: string | null
          delivery_cost?: number | null
          delivery_density_score?: number | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_partner_rating?: number | null
          estimated_delivery_time?: string | null
          estimated_delivery_time_mins?: number | null
          estimated_preparation_time?: number | null
          eta_accuracy_percentage?: number | null
          id?: string
          last_status_update?: string | null
          live_latitude?: number | null
          live_longitude?: number | null
          on_time_delivery?: boolean | null
          order_id?: string
          orders_accepted?: number | null
          orders_cancelled?: number | null
          orders_delivered?: number | null
          orders_out_for_delivery?: number | null
          orders_picked_up?: number | null
          orders_placed?: number | null
          orders_prepared?: number | null
          pickup_area?: string | null
          pickup_city?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          route_efficiency_score?: number | null
          surge_multiplier?: number | null
          total_distance_km?: number | null
          traffic_conditions?: string | null
          updated_at?: string | null
          weather_impact?: string | null
        }
        Relationships: []
      }
      delivery_locations: {
        Row: {
          delivery_id: string | null
          driver_id: string | null
          id: string
          lat: number
          lng: number
          timestamp: string | null
        }
        Insert: {
          delivery_id?: string | null
          driver_id?: string | null
          id?: string
          lat: number
          lng: number
          timestamp?: string | null
        }
        Update: {
          delivery_id?: string | null
          driver_id?: string | null
          id?: string
          lat?: number
          lng?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_locations_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "delivery_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "delivery_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_orders: {
        Row: {
          actual_time: number | null
          business_id: string
          created_at: string | null
          customer_feedback: string | null
          customer_id: string | null
          customer_rating: number | null
          delivery_address: string
          delivery_location: unknown
          delivery_partner_id: string | null
          estimated_time: number | null
          id: string
          order_number: string
          payment_status: string | null
          pickup_address: string
          pickup_location: unknown
          status: string | null
          total_amount: number | null
          total_distance: number | null
          updated_at: string | null
        }
        Insert: {
          actual_time?: number | null
          business_id: string
          created_at?: string | null
          customer_feedback?: string | null
          customer_id?: string | null
          customer_rating?: number | null
          delivery_address: string
          delivery_location: unknown
          delivery_partner_id?: string | null
          estimated_time?: number | null
          id?: string
          order_number: string
          payment_status?: string | null
          pickup_address: string
          pickup_location: unknown
          status?: string | null
          total_amount?: number | null
          total_distance?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_time?: number | null
          business_id?: string
          created_at?: string | null
          customer_feedback?: string | null
          customer_id?: string | null
          customer_rating?: number | null
          delivery_address?: string
          delivery_location?: unknown
          delivery_partner_id?: string | null
          estimated_time?: number | null
          id?: string
          order_number?: string
          payment_status?: string | null
          pickup_address?: string
          pickup_location?: unknown
          status?: string | null
          total_amount?: number | null
          total_distance?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_orders_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_partners: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          rating: number | null
          status: string | null
          total_deliveries: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_number: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          rating?: number | null
          status?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          rating?: number | null
          status?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          business_id: string | null
          created_at: string | null
          delivery_fee: number | null
          id: string
          is_active: boolean | null
          location_id: string | null
          max_delivery_time: number | null
          min_order_amount: number | null
          polygon: unknown | null
          zone_name: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          delivery_fee?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_delivery_time?: number | null
          min_order_amount?: number | null
          polygon?: unknown | null
          zone_name?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          delivery_fee?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_delivery_time?: number | null
          min_order_amount?: number | null
          polygon?: unknown | null
          zone_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zones_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_zones_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_zones_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      detailed_location_analytics: {
        Row: {
          avg_session_duration: number | null
          bounce_rate: number | null
          business_id: string
          call_clicks: number | null
          comments_count: number | null
          contact_clicks: number | null
          conversion_rate: number | null
          created_at: string | null
          customers_acquired: number | null
          date_tracked: string
          direction_clicks: number | null
          exact_address: string | null
          id: string
          likes_count: number | null
          location_code: string
          message_clicks: number | null
          peak_activity_hour: number | null
          revenue_generated: number | null
          saves_count: number | null
          shares_count: number | null
          views_count: number | null
          website_clicks: number | null
        }
        Insert: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          business_id: string
          call_clicks?: number | null
          comments_count?: number | null
          contact_clicks?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customers_acquired?: number | null
          date_tracked?: string
          direction_clicks?: number | null
          exact_address?: string | null
          id?: string
          likes_count?: number | null
          location_code: string
          message_clicks?: number | null
          peak_activity_hour?: number | null
          revenue_generated?: number | null
          saves_count?: number | null
          shares_count?: number | null
          views_count?: number | null
          website_clicks?: number | null
        }
        Update: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          business_id?: string
          call_clicks?: number | null
          comments_count?: number | null
          contact_clicks?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customers_acquired?: number | null
          date_tracked?: string
          direction_clicks?: number | null
          exact_address?: string | null
          id?: string
          likes_count?: number | null
          location_code?: string
          message_clicks?: number | null
          peak_activity_hour?: number | null
          revenue_generated?: number | null
          saves_count?: number | null
          shares_count?: number | null
          views_count?: number | null
          website_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detailed_location_analytics_location_code_fkey"
            columns: ["location_code"]
            isOneToOne: false
            referencedRelation: "location_hierarchy"
            referencedColumns: ["location_code"]
          },
        ]
      }
      device_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string | null
          created_at: string | null
          device_id: string | null
          id: string
          ip_address: unknown | null
          location_data: Json | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_activities_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "user_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_sessions: {
        Row: {
          created_at: string | null
          device_id: string | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          location_data: Json | null
          session_data: Json | null
          session_token: string | null
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          location_data?: Json | null
          session_data?: Json | null
          session_token?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          location_data?: Json | null
          session_data?: Json | null
          session_token?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "user_devices"
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
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          contact_info: string | null
          created_at: string | null
          current_attendees: number | null
          description: string | null
          event_date: string
          event_time: string | null
          id: string
          image_url: string | null
          is_free: boolean | null
          location: string
          max_attendees: number | null
          organizer_name: string
          price: number | null
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          contact_info?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          location: string
          max_attendees?: number | null
          organizer_name?: string
          price?: number | null
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          contact_info?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          location?: string
          max_attendees?: number | null
          organizer_name?: string
          price?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          payment_method: string | null
          processed_at: string | null
          reference_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          reference_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          reference_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type?: string
          user_id?: string | null
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
        Relationships: []
      }
      geo_analytics: {
        Row: {
          business_id: string
          city: string | null
          conversions_count: number | null
          country: string | null
          created_at: string | null
          date_recorded: string
          id: string
          interactions_count: number | null
          postal_code: string | null
          revenue_generated: number | null
          state_province: string | null
          visitors_count: number | null
        }
        Insert: {
          business_id: string
          city?: string | null
          conversions_count?: number | null
          country?: string | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          interactions_count?: number | null
          postal_code?: string | null
          revenue_generated?: number | null
          state_province?: string | null
          visitors_count?: number | null
        }
        Update: {
          business_id?: string
          city?: string | null
          conversions_count?: number | null
          country?: string | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          interactions_count?: number | null
          postal_code?: string | null
          revenue_generated?: number | null
          state_province?: string | null
          visitors_count?: number | null
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
      interaction_analytics: {
        Row: {
          avg_response_time: number | null
          business_id: string
          conversion_rate: number | null
          created_at: string | null
          date_tracked: string
          device_breakdown: Json | null
          id: string
          interaction_type: string
          peak_hour: number | null
          source_breakdown: Json | null
          total_clicks: number | null
          unique_users: number | null
        }
        Insert: {
          avg_response_time?: number | null
          business_id: string
          conversion_rate?: number | null
          created_at?: string | null
          date_tracked?: string
          device_breakdown?: Json | null
          id?: string
          interaction_type: string
          peak_hour?: number | null
          source_breakdown?: Json | null
          total_clicks?: number | null
          unique_users?: number | null
        }
        Update: {
          avg_response_time?: number | null
          business_id?: string
          conversion_rate?: number | null
          created_at?: string | null
          date_tracked?: string
          device_breakdown?: Json | null
          id?: string
          interaction_type?: string
          peak_hour?: number | null
          source_breakdown?: Json | null
          total_clicks?: number | null
          unique_users?: number | null
        }
        Relationships: []
      }
      interview_schedules: {
        Row: {
          agenda: string | null
          application_id: string | null
          created_at: string | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          interview_type: string | null
          interviewer_id: string | null
          location: string | null
          meeting_url: string | null
          notes: string | null
          rating: number | null
          scheduled_at: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agenda?: string | null
          application_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?: string | null
          interviewer_id?: string | null
          location?: string | null
          meeting_url?: string | null
          notes?: string | null
          rating?: number | null
          scheduled_at: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agenda?: string | null
          application_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?: string | null
          interviewer_id?: string | null
          location?: string | null
          meeting_url?: string | null
          notes?: string | null
          rating?: number | null
          scheduled_at?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          category_ids: string[] | null
          created_at: string | null
          employment_types: string[] | null
          experience_level: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          last_sent_at: string | null
          location: string | null
          name: string
          remote_only: boolean | null
          salary_min: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_ids?: string[] | null
          created_at?: string | null
          employment_types?: string[] | null
          experience_level?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          last_sent_at?: string | null
          location?: string | null
          name: string
          remote_only?: boolean | null
          salary_min?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_ids?: string[] | null
          created_at?: string | null
          employment_types?: string[] | null
          experience_level?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          last_sent_at?: string | null
          location?: string | null
          name?: string
          remote_only?: boolean | null
          salary_min?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          additional_documents: Json | null
          ai_match_score: number | null
          application_quality_score: number | null
          application_source: string | null
          available_start_date: string | null
          certifications: Json | null
          consent_ip_address: unknown | null
          consent_timestamp: string | null
          cover_letter: string | null
          created_at: string | null
          current_location: string | null
          data_retention_consent: boolean | null
          education_level: string | null
          email: string
          engagement_score: number | null
          expected_salary_max: number | null
          expected_salary_min: number | null
          experience_match_score: number | null
          experience_years: number | null
          first_name: string
          hiring_stage: string | null
          id: string
          job_posting_id: string
          languages: Json | null
          last_contact_date: string | null
          last_name: string
          linkedin_profile: string | null
          marketing_consent_given: boolean | null
          next_action: string | null
          notice_period_days: number | null
          phone: string | null
          portfolio_url: string | null
          preferred_locations: Json | null
          privacy_consent_given: boolean
          profile_completeness_score: number | null
          qualification_gaps: Json | null
          referral_code: string | null
          rejection_reason: string | null
          remote_work_preference: string | null
          response_rate: number | null
          resume_text: string | null
          resume_url: string | null
          salary_negotiable: boolean | null
          skill_match_percentage: number | null
          skills_listed: Json | null
          status: string | null
          strengths_identified: Json | null
          time_spent_on_application: number | null
          updated_at: string | null
          utm_parameters: Json | null
          willing_to_relocate: boolean | null
        }
        Insert: {
          additional_documents?: Json | null
          ai_match_score?: number | null
          application_quality_score?: number | null
          application_source?: string | null
          available_start_date?: string | null
          certifications?: Json | null
          consent_ip_address?: unknown | null
          consent_timestamp?: string | null
          cover_letter?: string | null
          created_at?: string | null
          current_location?: string | null
          data_retention_consent?: boolean | null
          education_level?: string | null
          email: string
          engagement_score?: number | null
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          experience_match_score?: number | null
          experience_years?: number | null
          first_name: string
          hiring_stage?: string | null
          id?: string
          job_posting_id: string
          languages?: Json | null
          last_contact_date?: string | null
          last_name: string
          linkedin_profile?: string | null
          marketing_consent_given?: boolean | null
          next_action?: string | null
          notice_period_days?: number | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_locations?: Json | null
          privacy_consent_given?: boolean
          profile_completeness_score?: number | null
          qualification_gaps?: Json | null
          referral_code?: string | null
          rejection_reason?: string | null
          remote_work_preference?: string | null
          response_rate?: number | null
          resume_text?: string | null
          resume_url?: string | null
          salary_negotiable?: boolean | null
          skill_match_percentage?: number | null
          skills_listed?: Json | null
          status?: string | null
          strengths_identified?: Json | null
          time_spent_on_application?: number | null
          updated_at?: string | null
          utm_parameters?: Json | null
          willing_to_relocate?: boolean | null
        }
        Update: {
          additional_documents?: Json | null
          ai_match_score?: number | null
          application_quality_score?: number | null
          application_source?: string | null
          available_start_date?: string | null
          certifications?: Json | null
          consent_ip_address?: unknown | null
          consent_timestamp?: string | null
          cover_letter?: string | null
          created_at?: string | null
          current_location?: string | null
          data_retention_consent?: boolean | null
          education_level?: string | null
          email?: string
          engagement_score?: number | null
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          experience_match_score?: number | null
          experience_years?: number | null
          first_name?: string
          hiring_stage?: string | null
          id?: string
          job_posting_id?: string
          languages?: Json | null
          last_contact_date?: string | null
          last_name?: string
          linkedin_profile?: string | null
          marketing_consent_given?: boolean | null
          next_action?: string | null
          notice_period_days?: number | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_locations?: Json | null
          privacy_consent_given?: boolean
          profile_completeness_score?: number | null
          qualification_gaps?: Json | null
          referral_code?: string | null
          rejection_reason?: string | null
          remote_work_preference?: string | null
          response_rate?: number | null
          resume_text?: string | null
          resume_url?: string | null
          salary_negotiable?: boolean | null
          skill_match_percentage?: number | null
          skills_listed?: Json | null
          status?: string | null
          strengths_identified?: Json | null
          time_spent_on_application?: number | null
          updated_at?: string | null
          utm_parameters?: Json | null
          willing_to_relocate?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_categories: {
        Row: {
          avg_salary: number | null
          category_level: number | null
          category_path: string | null
          color_theme: string | null
          common_skills: Json | null
          created_at: string | null
          demand_level: string | null
          description: string | null
          display_order: number | null
          growth_rate: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_category_id: string | null
          required_qualifications: Json | null
          seo_keywords: Json | null
          slug: string | null
          total_jobs: number | null
          typical_career_progression: Json | null
          updated_at: string | null
        }
        Insert: {
          avg_salary?: number | null
          category_level?: number | null
          category_path?: string | null
          color_theme?: string | null
          common_skills?: Json | null
          created_at?: string | null
          demand_level?: string | null
          description?: string | null
          display_order?: number | null
          growth_rate?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_category_id?: string | null
          required_qualifications?: Json | null
          seo_keywords?: Json | null
          slug?: string | null
          total_jobs?: number | null
          typical_career_progression?: Json | null
          updated_at?: string | null
        }
        Update: {
          avg_salary?: number | null
          category_level?: number | null
          category_path?: string | null
          color_theme?: string | null
          common_skills?: Json | null
          created_at?: string | null
          demand_level?: string | null
          description?: string | null
          display_order?: number | null
          growth_rate?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_category_id?: string | null
          required_qualifications?: Json | null
          seo_keywords?: Json | null
          slug?: string | null
          total_jobs?: number | null
          typical_career_progression?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      job_market_metrics: {
        Row: {
          avg_application_quality_score: number | null
          avg_applications_per_job: number | null
          avg_response_time_hours: number | null
          avg_salary_offered: number | null
          avg_time_to_hire_days: number | null
          candidate_satisfaction_score: number | null
          competition_ratio: number | null
          created_at: string | null
          emerging_skills: Json | null
          employer_satisfaction_score: number | null
          fill_rate_percentage: number | null
          id: string
          industry: string | null
          job_category_id: string | null
          location: string | null
          median_salary_offered: number | null
          metric_date: string
          salary_growth_rate: number | null
          skill_shortage_areas: Json | null
          top_skills_demanded: Json | null
          total_applications: number | null
          total_jobs_posted: number | null
        }
        Insert: {
          avg_application_quality_score?: number | null
          avg_applications_per_job?: number | null
          avg_response_time_hours?: number | null
          avg_salary_offered?: number | null
          avg_time_to_hire_days?: number | null
          candidate_satisfaction_score?: number | null
          competition_ratio?: number | null
          created_at?: string | null
          emerging_skills?: Json | null
          employer_satisfaction_score?: number | null
          fill_rate_percentage?: number | null
          id?: string
          industry?: string | null
          job_category_id?: string | null
          location?: string | null
          median_salary_offered?: number | null
          metric_date: string
          salary_growth_rate?: number | null
          skill_shortage_areas?: Json | null
          top_skills_demanded?: Json | null
          total_applications?: number | null
          total_jobs_posted?: number | null
        }
        Update: {
          avg_application_quality_score?: number | null
          avg_applications_per_job?: number | null
          avg_response_time_hours?: number | null
          avg_salary_offered?: number | null
          avg_time_to_hire_days?: number | null
          candidate_satisfaction_score?: number | null
          competition_ratio?: number | null
          created_at?: string | null
          emerging_skills?: Json | null
          employer_satisfaction_score?: number | null
          fill_rate_percentage?: number | null
          id?: string
          industry?: string | null
          job_category_id?: string | null
          location?: string | null
          median_salary_offered?: number | null
          metric_date?: string
          salary_growth_rate?: number | null
          skill_shortage_areas?: Json | null
          top_skills_demanded?: Json | null
          total_applications?: number | null
          total_jobs_posted?: number | null
        }
        Relationships: []
      }
      job_posting_skills: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          job_posting_id: string | null
          proficiency_level: string | null
          skill_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          job_posting_id?: string | null
          proficiency_level?: string | null
          skill_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          job_posting_id?: string | null
          proficiency_level?: string | null
          skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posting_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "job_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posting_templates: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          template_data: Json
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          ai_match_score: number | null
          application_conversion_rate: number | null
          application_count: number | null
          application_deadline: string | null
          application_instructions: string | null
          benefits: Json | null
          bonus_structure: string | null
          boost_score: number | null
          category_id: string
          city: string | null
          click_through_rate: number | null
          company_id: string
          competition_level: string | null
          country: string | null
          created_at: string | null
          description: string
          difficulty_score: number | null
          employment_type: string
          equity_offered: boolean | null
          estimated_applicants: number | null
          experience_level: string
          expires_at: string | null
          external_apply_url: string | null
          filled_at: string | null
          flexible_schedule: boolean | null
          health_insurance: boolean | null
          id: string
          interview_process_description: string | null
          is_featured: boolean | null
          is_premium: boolean | null
          languages_required: Json | null
          last_activity_at: string | null
          location: string | null
          meta_description: string | null
          meta_title: string | null
          min_education_level: string | null
          nice_to_have: string | null
          perks: Json | null
          postal_code: string | null
          preferred_skills: Json | null
          priority_level: string | null
          professional_development: boolean | null
          pto_days: number | null
          published_at: string | null
          quick_apply_enabled: boolean | null
          relocation_assistance: boolean | null
          required_certifications: Json | null
          required_experience_years: number | null
          required_skills: Json | null
          requirements: string | null
          responsibilities: string | null
          retirement_benefits: boolean | null
          salary_currency: string | null
          salary_frequency: string | null
          salary_max: number | null
          salary_min: number | null
          save_count: number | null
          seniority_level: string | null
          seo_keywords: Json | null
          share_count: number | null
          skills_extracted: Json | null
          slug: string | null
          state_province: string | null
          status: string | null
          tags: Json | null
          timezone: string | null
          title: string
          travel_required: string | null
          unique_view_count: number | null
          updated_at: string | null
          view_count: number | null
          work_mode: string
        }
        Insert: {
          ai_match_score?: number | null
          application_conversion_rate?: number | null
          application_count?: number | null
          application_deadline?: string | null
          application_instructions?: string | null
          benefits?: Json | null
          bonus_structure?: string | null
          boost_score?: number | null
          category_id: string
          city?: string | null
          click_through_rate?: number | null
          company_id: string
          competition_level?: string | null
          country?: string | null
          created_at?: string | null
          description: string
          difficulty_score?: number | null
          employment_type: string
          equity_offered?: boolean | null
          estimated_applicants?: number | null
          experience_level: string
          expires_at?: string | null
          external_apply_url?: string | null
          filled_at?: string | null
          flexible_schedule?: boolean | null
          health_insurance?: boolean | null
          id?: string
          interview_process_description?: string | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          languages_required?: Json | null
          last_activity_at?: string | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_education_level?: string | null
          nice_to_have?: string | null
          perks?: Json | null
          postal_code?: string | null
          preferred_skills?: Json | null
          priority_level?: string | null
          professional_development?: boolean | null
          pto_days?: number | null
          published_at?: string | null
          quick_apply_enabled?: boolean | null
          relocation_assistance?: boolean | null
          required_certifications?: Json | null
          required_experience_years?: number | null
          required_skills?: Json | null
          requirements?: string | null
          responsibilities?: string | null
          retirement_benefits?: boolean | null
          salary_currency?: string | null
          salary_frequency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          save_count?: number | null
          seniority_level?: string | null
          seo_keywords?: Json | null
          share_count?: number | null
          skills_extracted?: Json | null
          slug?: string | null
          state_province?: string | null
          status?: string | null
          tags?: Json | null
          timezone?: string | null
          title: string
          travel_required?: string | null
          unique_view_count?: number | null
          updated_at?: string | null
          view_count?: number | null
          work_mode: string
        }
        Update: {
          ai_match_score?: number | null
          application_conversion_rate?: number | null
          application_count?: number | null
          application_deadline?: string | null
          application_instructions?: string | null
          benefits?: Json | null
          bonus_structure?: string | null
          boost_score?: number | null
          category_id?: string
          city?: string | null
          click_through_rate?: number | null
          company_id?: string
          competition_level?: string | null
          country?: string | null
          created_at?: string | null
          description?: string
          difficulty_score?: number | null
          employment_type?: string
          equity_offered?: boolean | null
          estimated_applicants?: number | null
          experience_level?: string
          expires_at?: string | null
          external_apply_url?: string | null
          filled_at?: string | null
          flexible_schedule?: boolean | null
          health_insurance?: boolean | null
          id?: string
          interview_process_description?: string | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          languages_required?: Json | null
          last_activity_at?: string | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_education_level?: string | null
          nice_to_have?: string | null
          perks?: Json | null
          postal_code?: string | null
          preferred_skills?: Json | null
          priority_level?: string | null
          professional_development?: boolean | null
          pto_days?: number | null
          published_at?: string | null
          quick_apply_enabled?: boolean | null
          relocation_assistance?: boolean | null
          required_certifications?: Json | null
          required_experience_years?: number | null
          required_skills?: Json | null
          requirements?: string | null
          responsibilities?: string | null
          retirement_benefits?: boolean | null
          salary_currency?: string | null
          salary_frequency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          save_count?: number | null
          seniority_level?: string | null
          seo_keywords?: Json | null
          share_count?: number | null
          skills_extracted?: Json | null
          slug?: string | null
          state_province?: string | null
          status?: string | null
          tags?: Json | null
          timezone?: string | null
          title?: string
          travel_required?: string | null
          unique_view_count?: number | null
          updated_at?: string | null
          view_count?: number | null
          work_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_popular: boolean | null
          name: string
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_popular?: boolean | null
          name: string
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_popular?: boolean | null
          name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      job_views: {
        Row: {
          id: string
          ip_address: unknown | null
          job_posting_id: string | null
          referrer: string | null
          user_agent: string | null
          viewed_at: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          job_posting_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          job_posting_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_deadline: string | null
          application_url: string | null
          applications_received: number | null
          benefits: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          education_required: string | null
          employer_id: number
          experience_level: string | null
          expires_at: string | null
          id: number
          industry: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_remote: boolean | null
          is_urgent: boolean | null
          job_city: string
          job_district: string
          job_state: string | null
          job_type: string
          location_service_id: number | null
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          skills_required: string[] | null
          title: string
          total_positions: number | null
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          application_url?: string | null
          applications_received?: number | null
          benefits?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          education_required?: string | null
          employer_id: number
          experience_level?: string | null
          expires_at?: string | null
          id?: number
          industry?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_remote?: boolean | null
          is_urgent?: boolean | null
          job_city: string
          job_district: string
          job_state?: string | null
          job_type: string
          location_service_id?: number | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          skills_required?: string[] | null
          title: string
          total_positions?: number | null
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          application_url?: string | null
          applications_received?: number | null
          benefits?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          education_required?: string | null
          employer_id?: number
          experience_level?: string | null
          expires_at?: string | null
          id?: number
          industry?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_remote?: boolean | null
          is_urgent?: boolean | null
          job_city?: string
          job_district?: string
          job_state?: string | null
          job_type?: string
          location_service_id?: number | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          skills_required?: string[] | null
          title?: string
          total_positions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_location_service_id_fkey"
            columns: ["location_service_id"]
            isOneToOne: false
            referencedRelation: "location_service_config"
            referencedColumns: ["id"]
          },
        ]
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
      list_items: {
        Row: {
          added_at: string | null
          business_id: string
          id: string
          list_id: string
          notes: string | null
          sort_order: number | null
        }
        Insert: {
          added_at?: string | null
          business_id: string
          id?: string
          list_id: string
          notes?: string | null
          sort_order?: number | null
        }
        Update: {
          added_at?: string | null
          business_id?: string
          id?: string
          list_id?: string
          notes?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      location_hierarchy: {
        Row: {
          area_sq_km: number | null
          created_at: string | null
          district: string | null
          id: string
          is_urban: boolean | null
          latitude: number | null
          location_code: string
          location_name: string
          location_type: string
          longitude: number | null
          parent_location_code: string | null
          pincode: string | null
          population_estimate: number | null
          state: string | null
        }
        Insert: {
          area_sq_km?: number | null
          created_at?: string | null
          district?: string | null
          id?: string
          is_urban?: boolean | null
          latitude?: number | null
          location_code: string
          location_name: string
          location_type: string
          longitude?: number | null
          parent_location_code?: string | null
          pincode?: string | null
          population_estimate?: number | null
          state?: string | null
        }
        Update: {
          area_sq_km?: number | null
          created_at?: string | null
          district?: string | null
          id?: string
          is_urban?: boolean | null
          latitude?: number | null
          location_code?: string
          location_name?: string
          location_type?: string
          longitude?: number | null
          parent_location_code?: string | null
          pincode?: string | null
          population_estimate?: number | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_hierarchy_parent_location_code_fkey"
            columns: ["parent_location_code"]
            isOneToOne: false
            referencedRelation: "location_hierarchy"
            referencedColumns: ["location_code"]
          },
        ]
      }
      location_management_logs: {
        Row: {
          action_type: string
          admin_user_id: number | null
          created_at: string | null
          id: number
          location_service_id: number | null
          new_values: Json | null
          old_values: Json | null
          reason: string | null
        }
        Insert: {
          action_type: string
          admin_user_id?: number | null
          created_at?: string | null
          id?: number
          location_service_id?: number | null
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: number | null
          created_at?: string | null
          id?: number
          location_service_id?: number | null
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_management_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_management_logs_location_service_id_fkey"
            columns: ["location_service_id"]
            isOneToOne: false
            referencedRelation: "location_service_config"
            referencedColumns: ["id"]
          },
        ]
      }
      location_master: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          parent_id: string | null
          population: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          parent_id?: string | null
          population?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          parent_id?: string | null
          population?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_master_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["id"]
          },
        ]
      }
      location_service_config: {
        Row: {
          admin_notes: string | null
          city_name: string
          created_at: string | null
          delivery_enabled: boolean | null
          delivery_fee: number | null
          district_name: string
          estimated_businesses: number | null
          estimated_daily_orders: number | null
          estimated_launch_cost: number | null
          id: number
          is_active: boolean | null
          job_posting_enabled: boolean | null
          launch_date: string | null
          local_contact_person: string | null
          local_contact_phone: string | null
          market_research_completed: boolean | null
          max_delivery_radius_km: number | null
          min_order_amount: number | null
          pickup_enabled: boolean | null
          population_estimate: number | null
          priority_level: number | null
          region_name: string | null
          service_type: string | null
          showcase_enabled: boolean | null
          state_name: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          city_name: string
          created_at?: string | null
          delivery_enabled?: boolean | null
          delivery_fee?: number | null
          district_name: string
          estimated_businesses?: number | null
          estimated_daily_orders?: number | null
          estimated_launch_cost?: number | null
          id?: number
          is_active?: boolean | null
          job_posting_enabled?: boolean | null
          launch_date?: string | null
          local_contact_person?: string | null
          local_contact_phone?: string | null
          market_research_completed?: boolean | null
          max_delivery_radius_km?: number | null
          min_order_amount?: number | null
          pickup_enabled?: boolean | null
          population_estimate?: number | null
          priority_level?: number | null
          region_name?: string | null
          service_type?: string | null
          showcase_enabled?: boolean | null
          state_name?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          city_name?: string
          created_at?: string | null
          delivery_enabled?: boolean | null
          delivery_fee?: number | null
          district_name?: string
          estimated_businesses?: number | null
          estimated_daily_orders?: number | null
          estimated_launch_cost?: number | null
          id?: number
          is_active?: boolean | null
          job_posting_enabled?: boolean | null
          launch_date?: string | null
          local_contact_person?: string | null
          local_contact_phone?: string | null
          market_research_completed?: boolean | null
          max_delivery_radius_km?: number | null
          min_order_amount?: number | null
          pickup_enabled?: boolean | null
          population_estimate?: number | null
          priority_level?: number | null
          region_name?: string | null
          service_type?: string | null
          showcase_enabled?: boolean | null
          state_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          district: string | null
          geo: unknown | null
          id: string
          lat: number | null
          lng: number | null
          mandal: string | null
          name: string | null
          pincode: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          district?: string | null
          geo?: unknown | null
          id?: string
          lat?: number | null
          lng?: number | null
          mandal?: string | null
          name?: string | null
          pincode?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          district?: string | null
          geo?: unknown | null
          id?: string
          lat?: number | null
          lng?: number | null
          mandal?: string | null
          name?: string | null
          pincode?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      marketing_analytics: {
        Row: {
          business_id: string
          campaign_name: string | null
          campaign_type: string | null
          click_through_rate: number | null
          clicks: number | null
          conversion_rate: number | null
          conversions: number | null
          cost_per_click: number | null
          cost_per_conversion: number | null
          created_at: string | null
          date_recorded: string
          id: string
          impressions: number | null
          return_on_ad_spend: number | null
        }
        Insert: {
          business_id: string
          campaign_name?: string | null
          campaign_type?: string | null
          click_through_rate?: number | null
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cost_per_click?: number | null
          cost_per_conversion?: number | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          impressions?: number | null
          return_on_ad_spend?: number | null
        }
        Update: {
          business_id?: string
          campaign_name?: string | null
          campaign_type?: string | null
          click_through_rate?: number | null
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cost_per_click?: number | null
          cost_per_conversion?: number | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          impressions?: number | null
          return_on_ad_spend?: number | null
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
      order_events: {
        Row: {
          age: number | null
          business_id: string | null
          created_at: string | null
          event_type: string
          gender: string | null
          id: string
          location: string | null
          order_id: string
          session_id: string
          timestamp: string
          total_amount: number
          user_id: string
        }
        Insert: {
          age?: number | null
          business_id?: string | null
          created_at?: string | null
          event_type: string
          gender?: string | null
          id?: string
          location?: string | null
          order_id: string
          session_id: string
          timestamp?: string
          total_amount: number
          user_id: string
        }
        Update: {
          age?: number | null
          business_id?: string | null
          created_at?: string | null
          event_type?: string
          gender?: string | null
          id?: string
          location?: string | null
          order_id?: string
          session_id?: string
          timestamp?: string
          total_amount?: number
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
        Relationships: []
      }
      page_views: {
        Row: {
          age: number | null
          business_id: string | null
          created_at: string | null
          gender: string | null
          id: string
          location: string | null
          page_type: string
          product_id: string | null
          service_id: string | null
          session_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          age?: number | null
          business_id?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          page_type: string
          product_id?: string | null
          service_id?: string | null
          session_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          age?: number | null
          business_id?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          page_type?: string
          product_id?: string | null
          service_id?: string | null
          session_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_views_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_views_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_views_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_views_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
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
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          resource?: string
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
        Relationships: []
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
      product_analytics: {
        Row: {
          average_rating: number | null
          business_id: string
          cart_additions: number | null
          cart_removals: number | null
          checkout_completions: number | null
          checkout_starts: number | null
          conversion_rate: number | null
          created_at: string | null
          date_tracked: string
          description_reads: number | null
          detail_page_views: number | null
          five_star_count: number | null
          four_star_count: number | null
          id: string
          image_views: number | null
          one_star_count: number | null
          orders_cancelled: number | null
          orders_completed: number | null
          orders_placed: number | null
          product_id: string
          profit_margin: number | null
          ratings_count: number | null
          return_rate: number | null
          revenue_generated: number | null
          three_star_count: number | null
          two_star_count: number | null
          unique_viewers: number | null
          updated_at: string | null
          video_views: number | null
          views_count: number | null
          wishlist_additions: number | null
          wishlist_removals: number | null
          wishlist_shares: number | null
          wishlist_to_cart: number | null
        }
        Insert: {
          average_rating?: number | null
          business_id: string
          cart_additions?: number | null
          cart_removals?: number | null
          checkout_completions?: number | null
          checkout_starts?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date_tracked?: string
          description_reads?: number | null
          detail_page_views?: number | null
          five_star_count?: number | null
          four_star_count?: number | null
          id?: string
          image_views?: number | null
          one_star_count?: number | null
          orders_cancelled?: number | null
          orders_completed?: number | null
          orders_placed?: number | null
          product_id: string
          profit_margin?: number | null
          ratings_count?: number | null
          return_rate?: number | null
          revenue_generated?: number | null
          three_star_count?: number | null
          two_star_count?: number | null
          unique_viewers?: number | null
          updated_at?: string | null
          video_views?: number | null
          views_count?: number | null
          wishlist_additions?: number | null
          wishlist_removals?: number | null
          wishlist_shares?: number | null
          wishlist_to_cart?: number | null
        }
        Update: {
          average_rating?: number | null
          business_id?: string
          cart_additions?: number | null
          cart_removals?: number | null
          checkout_completions?: number | null
          checkout_starts?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date_tracked?: string
          description_reads?: number | null
          detail_page_views?: number | null
          five_star_count?: number | null
          four_star_count?: number | null
          id?: string
          image_views?: number | null
          one_star_count?: number | null
          orders_cancelled?: number | null
          orders_completed?: number | null
          orders_placed?: number | null
          product_id?: string
          profit_margin?: number | null
          ratings_count?: number | null
          return_rate?: number | null
          revenue_generated?: number | null
          three_star_count?: number | null
          two_star_count?: number | null
          unique_viewers?: number | null
          updated_at?: string | null
          video_views?: number | null
          views_count?: number | null
          wishlist_additions?: number | null
          wishlist_removals?: number | null
          wishlist_shares?: number | null
          wishlist_to_cart?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
        }
        Relationships: []
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
        Relationships: []
      }
      product_likes: {
        Row: {
          id: string
          liked_at: string | null
          product_id: string
          user_id: string
        }
        Insert: {
          id?: string
          liked_at?: string | null
          product_id: string
          user_id: string
        }
        Update: {
          id?: string
          liked_at?: string | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_purchases: {
        Row: {
          business_id: string
          delivery_address: Json | null
          delivery_date: string | null
          id: string
          notes: string | null
          order_status: string | null
          payment_method: string | null
          product_id: string
          purchase_date: string | null
          quantity: number
          total_price: number
          transaction_id: string | null
          unit_price: number
          user_id: string
        }
        Insert: {
          business_id: string
          delivery_address?: Json | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          order_status?: string | null
          payment_method?: string | null
          product_id: string
          purchase_date?: string | null
          quantity?: number
          total_price: number
          transaction_id?: string | null
          unit_price: number
          user_id: string
        }
        Update: {
          business_id?: string
          delivery_address?: Json | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          order_status?: string | null
          payment_method?: string | null
          product_id?: string
          purchase_date?: string | null
          quantity?: number
          total_price?: number
          transaction_id?: string | null
          unit_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_purchases_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_purchases_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          admin_approved_at: string | null
          admin_rejected_at: string | null
          admin_status: string | null
          brand: string | null
          business_id: string
          category: string | null
          city: string | null
          color: string | null
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          delivery_charge: number | null
          description: string | null
          dimensions: Json | null
          discount_percentage: number | null
          district: string | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          is_active: boolean | null
          is_available: boolean | null
          is_branded: boolean | null
          is_digital: boolean | null
          is_discounted: boolean | null
          is_featured: boolean | null
          is_used: boolean | null
          labels: string[] | null
          latitude: number | null
          likes_count: number | null
          longitude: number | null
          main_image_url: string | null
          marketplace_approved: boolean | null
          metadata: Json | null
          min_order_quantity: number | null
          model: string | null
          original_price: number | null
          price: number
          product_name: string
          purchases_count: number | null
          rating: number | null
          reach: number | null
          rejection_reason: string | null
          review_count: number | null
          seo_description: string | null
          seo_title: string | null
          show_in_marketplace: boolean | null
          size: string | null
          sku: string | null
          specifications: Json | null
          state: string | null
          stock_quantity: number | null
          subcategory: string | null
          tags: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
          video_urls: string[] | null
          views: number | null
          views_count: number | null
          weight: number | null
        }
        Insert: {
          admin_approved_at?: string | null
          admin_rejected_at?: string | null
          admin_status?: string | null
          brand?: string | null
          business_id: string
          category?: string | null
          city?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_charge?: number | null
          description?: string | null
          dimensions?: Json | null
          discount_percentage?: number | null
          district?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_branded?: boolean | null
          is_digital?: boolean | null
          is_discounted?: boolean | null
          is_featured?: boolean | null
          is_used?: boolean | null
          labels?: string[] | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          main_image_url?: string | null
          marketplace_approved?: boolean | null
          metadata?: Json | null
          min_order_quantity?: number | null
          model?: string | null
          original_price?: number | null
          price: number
          product_name: string
          purchases_count?: number | null
          rating?: number | null
          reach?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          seo_description?: string | null
          seo_title?: string | null
          show_in_marketplace?: boolean | null
          size?: string | null
          sku?: string | null
          specifications?: Json | null
          state?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          tags?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_urls?: string[] | null
          views?: number | null
          views_count?: number | null
          weight?: number | null
        }
        Update: {
          admin_approved_at?: string | null
          admin_rejected_at?: string | null
          admin_status?: string | null
          brand?: string | null
          business_id?: string
          category?: string | null
          city?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_charge?: number | null
          description?: string | null
          dimensions?: Json | null
          discount_percentage?: number | null
          district?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_branded?: boolean | null
          is_digital?: boolean | null
          is_discounted?: boolean | null
          is_featured?: boolean | null
          is_used?: boolean | null
          labels?: string[] | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          main_image_url?: string | null
          marketplace_approved?: boolean | null
          metadata?: Json | null
          min_order_quantity?: number | null
          model?: string | null
          original_price?: number | null
          price?: number
          product_name?: string
          purchases_count?: number | null
          rating?: number | null
          reach?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          seo_description?: string | null
          seo_title?: string | null
          show_in_marketplace?: boolean | null
          size?: string | null
          sku?: string | null
          specifications?: Json | null
          state?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          tags?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_urls?: string[] | null
          views?: number | null
          views_count?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      "products_backup_2025-06-06_172252_975853+00": {
        Row: {
          admin_approved_at: string | null
          admin_rejected_at: string | null
          admin_status: string | null
          brand: string | null
          business_id: string | null
          category: string | null
          city: string | null
          color: string | null
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          delivery_charge: number | null
          description: string | null
          dimensions: Json | null
          discount_percentage: number | null
          district: string | null
          id: string | null
          image_urls: string[] | null
          is_active: boolean | null
          is_branded: boolean | null
          is_digital: boolean | null
          is_discounted: boolean | null
          is_featured: boolean | null
          is_used: boolean | null
          labels: string[] | null
          latitude: number | null
          likes_count: number | null
          longitude: number | null
          main_image_url: string | null
          marketplace_approved: boolean | null
          metadata: Json | null
          min_order_quantity: number | null
          model: string | null
          original_price: number | null
          price: number | null
          product_name: string | null
          purchases_count: number | null
          rating: number | null
          reach: number | null
          rejection_reason: string | null
          seo_description: string | null
          seo_title: string | null
          show_in_marketplace: boolean | null
          size: string | null
          sku: string | null
          state: string | null
          stock_quantity: number | null
          subcategory: string | null
          tags: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
          video_urls: string[] | null
          views_count: number | null
          weight: number | null
        }
        Insert: {
          admin_approved_at?: string | null
          admin_rejected_at?: string | null
          admin_status?: string | null
          brand?: string | null
          business_id?: string | null
          category?: string | null
          city?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_charge?: number | null
          description?: string | null
          dimensions?: Json | null
          discount_percentage?: number | null
          district?: string | null
          id?: string | null
          image_urls?: string[] | null
          is_active?: boolean | null
          is_branded?: boolean | null
          is_digital?: boolean | null
          is_discounted?: boolean | null
          is_featured?: boolean | null
          is_used?: boolean | null
          labels?: string[] | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          main_image_url?: string | null
          marketplace_approved?: boolean | null
          metadata?: Json | null
          min_order_quantity?: number | null
          model?: string | null
          original_price?: number | null
          price?: number | null
          product_name?: string | null
          purchases_count?: number | null
          rating?: number | null
          reach?: number | null
          rejection_reason?: string | null
          seo_description?: string | null
          seo_title?: string | null
          show_in_marketplace?: boolean | null
          size?: string | null
          sku?: string | null
          state?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          tags?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_urls?: string[] | null
          views_count?: number | null
          weight?: number | null
        }
        Update: {
          admin_approved_at?: string | null
          admin_rejected_at?: string | null
          admin_status?: string | null
          brand?: string | null
          business_id?: string | null
          category?: string | null
          city?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_charge?: number | null
          description?: string | null
          dimensions?: Json | null
          discount_percentage?: number | null
          district?: string | null
          id?: string | null
          image_urls?: string[] | null
          is_active?: boolean | null
          is_branded?: boolean | null
          is_digital?: boolean | null
          is_discounted?: boolean | null
          is_featured?: boolean | null
          is_used?: boolean | null
          labels?: string[] | null
          latitude?: number | null
          likes_count?: number | null
          longitude?: number | null
          main_image_url?: string | null
          marketplace_approved?: boolean | null
          metadata?: Json | null
          min_order_quantity?: number | null
          model?: string | null
          original_price?: number | null
          price?: number | null
          product_name?: string | null
          purchases_count?: number | null
          rating?: number | null
          reach?: number | null
          rejection_reason?: string | null
          seo_description?: string | null
          seo_title?: string | null
          show_in_marketplace?: boolean | null
          size?: string | null
          sku?: string | null
          state?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          tags?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_urls?: string[] | null
          views_count?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_preferences: Json | null
          full_name: string | null
          id: string
          name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_preferences?: Json | null
          full_name?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_preferences?: Json | null
          full_name?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      regional_analytics: {
        Row: {
          business_id: string
          call_clicks: number | null
          city: string
          contact_clicks: number | null
          conversion_rate: number | null
          country: string
          created_at: string | null
          customers_acquired: number | null
          date_tracked: string
          direction_clicks: number | null
          id: string
          latitude: number | null
          likes_count: number | null
          location_code: string | null
          longitude: number | null
          postal_code: string | null
          revenue_generated: number | null
          saves_count: number | null
          shares_count: number | null
          state: string
          views_count: number | null
        }
        Insert: {
          business_id: string
          call_clicks?: number | null
          city: string
          contact_clicks?: number | null
          conversion_rate?: number | null
          country?: string
          created_at?: string | null
          customers_acquired?: number | null
          date_tracked?: string
          direction_clicks?: number | null
          id?: string
          latitude?: number | null
          likes_count?: number | null
          location_code?: string | null
          longitude?: number | null
          postal_code?: string | null
          revenue_generated?: number | null
          saves_count?: number | null
          shares_count?: number | null
          state?: string
          views_count?: number | null
        }
        Update: {
          business_id?: string
          call_clicks?: number | null
          city?: string
          contact_clicks?: number | null
          conversion_rate?: number | null
          country?: string
          created_at?: string | null
          customers_acquired?: number | null
          date_tracked?: string
          direction_clicks?: number | null
          id?: string
          latitude?: number | null
          likes_count?: number | null
          location_code?: string | null
          longitude?: number | null
          postal_code?: string | null
          revenue_generated?: number | null
          saves_count?: number | null
          shares_count?: number | null
          state?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regional_analytics_location_code_fkey"
            columns: ["location_code"]
            isOneToOne: false
            referencedRelation: "location_hierarchy"
            referencedColumns: ["location_code"]
          },
        ]
      }
      regional_business_analytics: {
        Row: {
          active_businesses: number | null
          area: string | null
          avg_business_revenue: number | null
          avg_content_engagement_rate: number | null
          avg_conversion_rate: number | null
          avg_distance_to_business: number | null
          avg_engagement_rate: number | null
          category_distribution: Json | null
          city: string
          created_at: string | null
          date_tracked: string
          demographic_distribution: Json | null
          id: string
          new_businesses: number | null
          new_user_count: number | null
          peak_activity_hour: number | null
          peak_day_of_week: number | null
          region: string
          returning_user_count: number | null
          top_category: string | null
          total_bookings: number | null
          total_businesses: number | null
          total_calls: number | null
          total_likes: number | null
          total_menu_clicks: number | null
          total_messages: number | null
          total_overview_clicks: number | null
          total_photos_clicks: number | null
          total_portfolio_clicks: number | null
          total_revenue: number | null
          total_views: number | null
          verified_businesses: number | null
        }
        Insert: {
          active_businesses?: number | null
          area?: string | null
          avg_business_revenue?: number | null
          avg_content_engagement_rate?: number | null
          avg_conversion_rate?: number | null
          avg_distance_to_business?: number | null
          avg_engagement_rate?: number | null
          category_distribution?: Json | null
          city: string
          created_at?: string | null
          date_tracked: string
          demographic_distribution?: Json | null
          id?: string
          new_businesses?: number | null
          new_user_count?: number | null
          peak_activity_hour?: number | null
          peak_day_of_week?: number | null
          region: string
          returning_user_count?: number | null
          top_category?: string | null
          total_bookings?: number | null
          total_businesses?: number | null
          total_calls?: number | null
          total_likes?: number | null
          total_menu_clicks?: number | null
          total_messages?: number | null
          total_overview_clicks?: number | null
          total_photos_clicks?: number | null
          total_portfolio_clicks?: number | null
          total_revenue?: number | null
          total_views?: number | null
          verified_businesses?: number | null
        }
        Update: {
          active_businesses?: number | null
          area?: string | null
          avg_business_revenue?: number | null
          avg_content_engagement_rate?: number | null
          avg_conversion_rate?: number | null
          avg_distance_to_business?: number | null
          avg_engagement_rate?: number | null
          category_distribution?: Json | null
          city?: string
          created_at?: string | null
          date_tracked?: string
          demographic_distribution?: Json | null
          id?: string
          new_businesses?: number | null
          new_user_count?: number | null
          peak_activity_hour?: number | null
          peak_day_of_week?: number | null
          region?: string
          returning_user_count?: number | null
          top_category?: string | null
          total_bookings?: number | null
          total_businesses?: number | null
          total_calls?: number | null
          total_likes?: number | null
          total_menu_clicks?: number | null
          total_messages?: number | null
          total_overview_clicks?: number | null
          total_photos_clicks?: number | null
          total_portfolio_clicks?: number | null
          total_revenue?: number | null
          total_views?: number | null
          verified_businesses?: number | null
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
      retention_tracking: {
        Row: {
          age: number | null
          created_at: string | null
          first_visit_date: string
          gender: string | null
          id: string
          last_visit_date: string
          location: string | null
          retention_days: number | null
          user_id: string
          visit_count: number
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          first_visit_date: string
          gender?: string | null
          id?: string
          last_visit_date: string
          location?: string | null
          retention_days?: number | null
          user_id: string
          visit_count?: number
        }
        Update: {
          age?: number | null
          created_at?: string | null
          first_visit_date?: string
          gender?: string | null
          id?: string
          last_visit_date?: string
          location?: string | null
          retention_days?: number | null
          user_id?: string
          visit_count?: number
        }
        Relationships: []
      }
      revenue_analytics: {
        Row: {
          advertising_revenue: number | null
          affiliate_revenue: number | null
          average_order_value: number | null
          business_id: string
          commission_earned: number | null
          created_at: string | null
          customer_lifetime_value: number | null
          date_tracked: string
          failed_transactions: number | null
          id: string
          product_sales: number | null
          refunded_amount: number | null
          repeat_customer_rate: number | null
          revenue_anantapur: number | null
          revenue_by_age_18_24: number | null
          revenue_by_age_25_34: number | null
          revenue_by_age_35_44: number | null
          revenue_by_age_45_54: number | null
          revenue_by_age_55_plus: number | null
          revenue_chittoor: number | null
          revenue_kadapa: number | null
          revenue_kurnool: number | null
          revenue_other_regions: number | null
          service_revenue: number | null
          subscription_revenue: number | null
          successful_transactions: number | null
          total_revenue: number | null
          total_transactions: number | null
        }
        Insert: {
          advertising_revenue?: number | null
          affiliate_revenue?: number | null
          average_order_value?: number | null
          business_id: string
          commission_earned?: number | null
          created_at?: string | null
          customer_lifetime_value?: number | null
          date_tracked?: string
          failed_transactions?: number | null
          id?: string
          product_sales?: number | null
          refunded_amount?: number | null
          repeat_customer_rate?: number | null
          revenue_anantapur?: number | null
          revenue_by_age_18_24?: number | null
          revenue_by_age_25_34?: number | null
          revenue_by_age_35_44?: number | null
          revenue_by_age_45_54?: number | null
          revenue_by_age_55_plus?: number | null
          revenue_chittoor?: number | null
          revenue_kadapa?: number | null
          revenue_kurnool?: number | null
          revenue_other_regions?: number | null
          service_revenue?: number | null
          subscription_revenue?: number | null
          successful_transactions?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
        }
        Update: {
          advertising_revenue?: number | null
          affiliate_revenue?: number | null
          average_order_value?: number | null
          business_id?: string
          commission_earned?: number | null
          created_at?: string | null
          customer_lifetime_value?: number | null
          date_tracked?: string
          failed_transactions?: number | null
          id?: string
          product_sales?: number | null
          refunded_amount?: number | null
          repeat_customer_rate?: number | null
          revenue_anantapur?: number | null
          revenue_by_age_18_24?: number | null
          revenue_by_age_25_34?: number | null
          revenue_by_age_35_44?: number | null
          revenue_by_age_45_54?: number | null
          revenue_by_age_55_plus?: number | null
          revenue_chittoor?: number | null
          revenue_kadapa?: number | null
          revenue_kurnool?: number | null
          revenue_other_regions?: number | null
          service_revenue?: number | null
          subscription_revenue?: number | null
          successful_transactions?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_replies: {
        Row: {
          created_at: string | null
          id: string
          is_from_owner: boolean | null
          review_id: string
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_from_owner?: boolean | null
          review_id: string
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_from_owner?: boolean | null
          review_id?: string
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          images: string[] | null
          is_hidden: boolean | null
          is_verified: boolean | null
          likes_count: number | null
          parent_id: string | null
          rating: number
          reports_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_hidden?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          rating: number
          reports_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_hidden?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          rating?: number
          reports_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_posting_id: string | null
          notes: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_posting_id?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_posting_id?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
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
          group_id: string | null
          id: string
          image_url: string | null
          location: string | null
          profile_id: string
          scheduled_for: string
          status: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          group_id?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          profile_id: string
          scheduled_for: string
          status: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          group_id?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
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
      service_analytics: {
        Row: {
          analytics_date: string
          bookings_count: number
          clicks_count: number
          created_at: string
          id: number
          revenue_amount: number
          service_id: string | null
          updated_at: string
          views_count: number
        }
        Insert: {
          analytics_date?: string
          bookings_count?: number
          clicks_count?: number
          created_at?: string
          id?: number
          revenue_amount?: number
          service_id?: string | null
          updated_at?: string
          views_count?: number
        }
        Update: {
          analytics_date?: string
          bookings_count?: number
          clicks_count?: number
          created_at?: string
          id?: number
          revenue_amount?: number
          service_id?: string | null
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_analytics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_analytics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_analytics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_analytics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          booking_date: string
          booking_status: string | null
          booking_time: string | null
          created_at: string | null
          customer_email: string | null
          customer_id: string
          customer_name: string
          customer_phone: string
          id: string
          service_id: string
          special_requirements: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_status?: string | null
          booking_time?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_id: string
          customer_name: string
          customer_phone: string
          id?: string
          service_id: string
          special_requirements?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_status?: string | null
          booking_time?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          service_id?: string
          special_requirements?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      service_bookings_enhanced: {
        Row: {
          booking_date: string
          created_at: string | null
          customer_email: string | null
          customer_id: string
          customer_name: string | null
          customer_notes: string | null
          customer_phone: string | null
          duration: string | null
          id: string
          location_address: string | null
          num_rooms: number | null
          payment_status: string | null
          provider_id: string
          provider_notes: string | null
          selected_time: string | null
          service_date: string | null
          service_id: string
          special_requirements: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          customer_email?: string | null
          customer_id: string
          customer_name?: string | null
          customer_notes?: string | null
          customer_phone?: string | null
          duration?: string | null
          id?: string
          location_address?: string | null
          num_rooms?: number | null
          payment_status?: string | null
          provider_id: string
          provider_notes?: string | null
          selected_time?: string | null
          service_date?: string | null
          service_id: string
          special_requirements?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string
          customer_name?: string | null
          customer_notes?: string | null
          customer_phone?: string | null
          duration?: string | null
          id?: string
          location_address?: string | null
          num_rooms?: number | null
          payment_status?: string | null
          provider_id?: string
          provider_notes?: string | null
          selected_time?: string | null
          service_date?: string | null
          service_id?: string
          special_requirements?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_enhanced_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_enhanced_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_enhanced_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_enhanced_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories_enhanced: {
        Row: {
          color_class: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_category_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_category_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_category_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_enhanced_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories_enhanced"
            referencedColumns: ["id"]
          },
        ]
      }
      service_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_order: number | null
          image_type: string | null
          image_url: string
          is_primary: boolean | null
          service_id: string
          updated_at: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_order?: number | null
          image_type?: string | null
          image_url: string
          is_primary?: boolean | null
          service_id: string
          updated_at?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_order?: number | null
          image_type?: string | null
          image_url?: string
          is_primary?: boolean | null
          service_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_portfolio_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_portfolio_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_portfolio_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_pricing_tiers: {
        Row: {
          created_at: string | null
          delivery_days: number | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_revisions: number | null
          price: number
          service_id: string
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_revisions?: number | null
          price: number
          service_id: string
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_revisions?: number | null
          price?: number
          service_id?: string
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_tiers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_pricing_tiers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_pricing_tiers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_pricing_tiers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
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
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reviews: {
        Row: {
          created_at: string | null
          customer_id: string
          customer_name: string | null
          helpful_votes: number | null
          id: string
          is_helpful_count: number | null
          rating: number
          review_text: string | null
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          customer_name?: string | null
          helpful_votes?: number | null
          id?: string
          is_helpful_count?: number | null
          rating: number
          review_text?: string | null
          service_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          customer_name?: string | null
          helpful_votes?: number | null
          id?: string
          is_helpful_count?: number | null
          rating?: number
          review_text?: string | null
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          advance_booking_required: boolean | null
          availability: string | null
          bookings_count: number | null
          business_id: number | null
          cancellation_policy: string | null
          category: string
          city: string | null
          contact_email: string | null
          contact_info: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          currency: string | null
          daily_views: number | null
          description: string
          district: string | null
          duration: string | null
          features: string[] | null
          home_service: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_available: boolean | null
          is_featured: boolean | null
          is_open: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          monthly_views: number | null
          portfolio_images: string[] | null
          price: number
          pricing_type: string | null
          provider_id: string | null
          rating: number | null
          requirements: string | null
          reviews_count: number | null
          service_area: string | null
          service_duration: string | null
          state: string | null
          subcategory: string | null
          title: string
          total_reviews: number | null
          trending_score: number | null
          updated_at: string | null
          user_id: string
          views: number | null
          views_count: number | null
          weekly_views: number | null
        }
        Insert: {
          advance_booking_required?: boolean | null
          availability?: string | null
          bookings_count?: number | null
          business_id?: number | null
          cancellation_policy?: string | null
          category: string
          city?: string | null
          contact_email?: string | null
          contact_info?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          currency?: string | null
          daily_views?: number | null
          description: string
          district?: string | null
          duration?: string | null
          features?: string[] | null
          home_service?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_open?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monthly_views?: number | null
          portfolio_images?: string[] | null
          price: number
          pricing_type?: string | null
          provider_id?: string | null
          rating?: number | null
          requirements?: string | null
          reviews_count?: number | null
          service_area?: string | null
          service_duration?: string | null
          state?: string | null
          subcategory?: string | null
          title: string
          total_reviews?: number | null
          trending_score?: number | null
          updated_at?: string | null
          user_id: string
          views?: number | null
          views_count?: number | null
          weekly_views?: number | null
        }
        Update: {
          advance_booking_required?: boolean | null
          availability?: string | null
          bookings_count?: number | null
          business_id?: number | null
          cancellation_policy?: string | null
          category?: string
          city?: string | null
          contact_email?: string | null
          contact_info?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          currency?: string | null
          daily_views?: number | null
          description?: string
          district?: string | null
          duration?: string | null
          features?: string[] | null
          home_service?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_open?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monthly_views?: number | null
          portfolio_images?: string[] | null
          price?: number
          pricing_type?: string | null
          provider_id?: string | null
          rating?: number | null
          requirements?: string | null
          reviews_count?: number | null
          service_area?: string | null
          service_duration?: string | null
          state?: string | null
          subcategory?: string | null
          title?: string
          total_reviews?: number | null
          trending_score?: number | null
          updated_at?: string | null
          user_id?: string
          views?: number | null
          views_count?: number | null
          weekly_views?: number | null
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
      skills_intelligence: {
        Row: {
          automation_risk_score: number | null
          avg_salary_premium: number | null
          cross_industry_applicability: number | null
          demand_score: number | null
          demand_trend: string | null
          future_demand_projection: string | null
          id: string
          last_updated: string | null
          learning_resources: Json | null
          primary_industries: Json | null
          related_certifications: Json | null
          related_emerging_skills: Json | null
          remote_friendly: boolean | null
          salary_percentile: number | null
          skill_category: string | null
          skill_name: string
          skill_prerequisites: Json | null
          top_locations: Json | null
          total_mentions: number | null
        }
        Insert: {
          automation_risk_score?: number | null
          avg_salary_premium?: number | null
          cross_industry_applicability?: number | null
          demand_score?: number | null
          demand_trend?: string | null
          future_demand_projection?: string | null
          id?: string
          last_updated?: string | null
          learning_resources?: Json | null
          primary_industries?: Json | null
          related_certifications?: Json | null
          related_emerging_skills?: Json | null
          remote_friendly?: boolean | null
          salary_percentile?: number | null
          skill_category?: string | null
          skill_name: string
          skill_prerequisites?: Json | null
          top_locations?: Json | null
          total_mentions?: number | null
        }
        Update: {
          automation_risk_score?: number | null
          avg_salary_premium?: number | null
          cross_industry_applicability?: number | null
          demand_score?: number | null
          demand_trend?: string | null
          future_demand_projection?: string | null
          id?: string
          last_updated?: string | null
          learning_resources?: Json | null
          primary_industries?: Json | null
          related_certifications?: Json | null
          related_emerging_skills?: Json | null
          remote_friendly?: boolean | null
          salary_percentile?: number | null
          skill_category?: string | null
          skill_name?: string
          skill_prerequisites?: Json | null
          top_locations?: Json | null
          total_mentions?: number | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
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
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan_type: string
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_type: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_type?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          tags: Json | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          tags?: Json | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          tags?: Json | null
          timestamp?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          business_id: string | null
          certifications: string[] | null
          created_at: string | null
          experience_years: number | null
          id: string
          is_active: boolean | null
          name: string
          order_num: number | null
          photo_url: string | null
          role: string | null
          specialties: string[] | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          business_id?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          order_num?: number | null
          photo_url?: string | null
          role?: string | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          business_id?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_num?: number | null
          photo_url?: string | null
          role?: string | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      time_analytics: {
        Row: {
          business_id: string
          created_at: string | null
          date_recorded: string
          day_of_week: number
          hour_of_day: number
          id: string
          interactions_count: number | null
          revenue_generated: number | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          date_recorded?: string
          day_of_week: number
          hour_of_day: number
          id?: string
          interactions_count?: number | null
          revenue_generated?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          date_recorded?: string
          day_of_week?: number
          hour_of_day?: number
          id?: string
          interactions_count?: number | null
          revenue_generated?: number | null
        }
        Relationships: []
      }
      time_spent: {
        Row: {
          age: number | null
          business_id: string | null
          created_at: string | null
          duration_seconds: number
          gender: string | null
          id: string
          location: string | null
          page_type: string
          product_id: string | null
          service_id: string | null
          session_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          age?: number | null
          business_id?: string | null
          created_at?: string | null
          duration_seconds: number
          gender?: string | null
          id?: string
          location?: string | null
          page_type: string
          product_id?: string | null
          service_id?: string | null
          session_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          age?: number | null
          business_id?: string | null
          created_at?: string | null
          duration_seconds?: number
          gender?: string | null
          id?: string
          location?: string | null
          page_type?: string
          product_id?: string | null
          service_id?: string | null
          session_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_spent_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_spent_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_spent_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_spent_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          address_label: string | null
          address_line1: string
          address_line2: string | null
          address_type: string | null
          city: string
          created_at: string | null
          delivery_instructions: string | null
          district: string
          id: number
          is_active: boolean | null
          is_default: boolean | null
          is_delivery_available: boolean | null
          landmark: string | null
          latitude: number | null
          location_service_id: number | null
          longitude: number | null
          postal_code: string | null
          recipient_name: string | null
          recipient_phone: string | null
          state: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          address_label?: string | null
          address_line1: string
          address_line2?: string | null
          address_type?: string | null
          city: string
          created_at?: string | null
          delivery_instructions?: string | null
          district: string
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          is_delivery_available?: boolean | null
          landmark?: string | null
          latitude?: number | null
          location_service_id?: number | null
          longitude?: number | null
          postal_code?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          address_label?: string | null
          address_line1?: string
          address_line2?: string | null
          address_type?: string | null
          city?: string
          created_at?: string | null
          delivery_instructions?: string | null
          district?: string
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          is_delivery_available?: boolean | null
          landmark?: string | null
          latitude?: number | null
          location_service_id?: number | null
          longitude?: number | null
          postal_code?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_location_service_id_fkey"
            columns: ["location_service_id"]
            isOneToOne: false
            referencedRelation: "location_service_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_behavior_analytics: {
        Row: {
          application_abandonment_stage: string | null
          applications_completed: number | null
          applications_started: number | null
          bounce_rate: number | null
          browser: string | null
          conversion_rate: number | null
          created_at: string | null
          date_recorded: string
          device_type: string | null
          experiment_variants: Json | null
          feature_flags: Json | null
          filters_used: Json | null
          id: string
          jobs_saved: number | null
          jobs_viewed: number | null
          location_data: Json | null
          operating_system: string | null
          page_views: number | null
          referral_source: string | null
          results_clicked: number | null
          search_queries: Json | null
          search_refinements: number | null
          session_duration_minutes: number | null
          session_id: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          application_abandonment_stage?: string | null
          applications_completed?: number | null
          applications_started?: number | null
          bounce_rate?: number | null
          browser?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          date_recorded: string
          device_type?: string | null
          experiment_variants?: Json | null
          feature_flags?: Json | null
          filters_used?: Json | null
          id?: string
          jobs_saved?: number | null
          jobs_viewed?: number | null
          location_data?: Json | null
          operating_system?: string | null
          page_views?: number | null
          referral_source?: string | null
          results_clicked?: number | null
          search_queries?: Json | null
          search_refinements?: number | null
          session_duration_minutes?: number | null
          session_id?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          application_abandonment_stage?: string | null
          applications_completed?: number | null
          applications_started?: number | null
          bounce_rate?: number | null
          browser?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          date_recorded?: string
          device_type?: string | null
          experiment_variants?: Json | null
          feature_flags?: Json | null
          filters_used?: Json | null
          id?: string
          jobs_saved?: number | null
          jobs_viewed?: number | null
          location_data?: Json | null
          operating_system?: string | null
          page_views?: number | null
          referral_source?: string | null
          results_clicked?: number | null
          search_queries?: Json | null
          search_refinements?: number | null
          session_duration_minutes?: number | null
          session_id?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          bookmark_type: string | null
          business_id: string | null
          created_at: string | null
          id: string
          service_id: string | null
          user_id: string
        }
        Insert: {
          bookmark_type?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id: string
        }
        Update: {
          bookmark_type?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_details_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "trending_services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_device_tokens: {
        Row: {
          created_at: string
          device_token: string
          id: string
          platform: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_token: string
          id?: string
          platform: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_token?: string
          id?: string
          platform?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          app_version: string | null
          created_at: string | null
          device_fingerprint: string | null
          device_id: string | null
          device_model: string | null
          device_name: string | null
          device_type: string | null
          id: string
          is_active: boolean | null
          is_trusted: boolean | null
          last_ip_address: unknown | null
          last_location: unknown | null
          last_used_at: string | null
          os_type: string | null
          os_version: string | null
          push_token: string | null
          trust_score: number | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          device_id?: string | null
          device_model?: string | null
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          is_trusted?: boolean | null
          last_ip_address?: unknown | null
          last_location?: unknown | null
          last_used_at?: string | null
          os_type?: string | null
          os_version?: string | null
          push_token?: string | null
          trust_score?: number | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          device_id?: string | null
          device_model?: string | null
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          is_trusted?: boolean | null
          last_ip_address?: unknown | null
          last_location?: unknown | null
          last_used_at?: string | null
          os_type?: string | null
          os_version?: string | null
          push_token?: string | null
          trust_score?: number | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_lists: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_private: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_location_history: {
        Row: {
          accuracy_radius_meters: number | null
          city: string
          detection_method: string | null
          district: string
          id: number
          ip_address: unknown | null
          location_service_id: number | null
          recorded_at: string | null
          session_id: string | null
          used_for: string | null
          user_agent: string | null
          user_id: number
        }
        Insert: {
          accuracy_radius_meters?: number | null
          city: string
          detection_method?: string | null
          district: string
          id?: number
          ip_address?: unknown | null
          location_service_id?: number | null
          recorded_at?: string | null
          session_id?: string | null
          used_for?: string | null
          user_agent?: string | null
          user_id: number
        }
        Update: {
          accuracy_radius_meters?: number | null
          city?: string
          detection_method?: string | null
          district?: string
          id?: number
          ip_address?: unknown | null
          location_service_id?: number | null
          recorded_at?: string | null
          session_id?: string | null
          used_for?: string | null
          user_agent?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_location_history_location_service_id_fkey"
            columns: ["location_service_id"]
            isOneToOne: false
            referencedRelation: "location_service_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_location_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          city: string
          created_at: string
          district: string
          id: string
          is_current_location: boolean
          is_serviceable: boolean
          latitude: number | null
          longitude: number | null
          mandal: string | null
          pincode: string | null
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          district: string
          id?: string
          is_current_location?: boolean
          is_serviceable?: boolean
          latitude?: number | null
          longitude?: number | null
          mandal?: string | null
          pincode?: string | null
          state?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          district?: string
          id?: string
          is_current_location?: boolean
          is_serviceable?: boolean
          latitude?: number | null
          longitude?: number | null
          mandal?: string | null
          pincode?: string | null
          state?: string
          updated_at?: string | null
          user_id?: string
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
      user_profiles: {
        Row: {
          auto_location_detection: boolean | null
          avatar_url: string | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          first_name: string | null
          gender: string | null
          id: number
          is_verified: boolean | null
          last_name: string | null
          last_profile_update: string | null
          notification_sound: boolean | null
          primary_city: string | null
          primary_district: string | null
          primary_location_service_id: number | null
          profile_completion_percentage: number | null
          profile_visibility: string | null
          show_email: boolean | null
          show_location: boolean | null
          show_phone: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: number
          username: string | null
          verification_badge: string | null
          verification_date: string | null
          website: string | null
        }
        Insert: {
          auto_location_detection?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          is_verified?: boolean | null
          last_name?: string | null
          last_profile_update?: string | null
          notification_sound?: boolean | null
          primary_city?: string | null
          primary_district?: string | null
          primary_location_service_id?: number | null
          profile_completion_percentage?: number | null
          profile_visibility?: string | null
          show_email?: boolean | null
          show_location?: boolean | null
          show_phone?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: number
          username?: string | null
          verification_badge?: string | null
          verification_date?: string | null
          website?: string | null
        }
        Update: {
          auto_location_detection?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          is_verified?: boolean | null
          last_name?: string | null
          last_profile_update?: string | null
          notification_sound?: boolean | null
          primary_city?: string | null
          primary_district?: string | null
          primary_location_service_id?: number | null
          profile_completion_percentage?: number | null
          profile_visibility?: string | null
          show_email?: boolean | null
          show_location?: boolean | null
          show_phone?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: number
          username?: string | null
          verification_badge?: string | null
          verification_date?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_primary_location_service_id_fkey"
            columns: ["primary_location_service_id"]
            isOneToOne: false
            referencedRelation: "location_service_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          age: number | null
          browser: string | null
          created_at: string | null
          device_type: string | null
          end_time: string | null
          gender: string | null
          id: string
          location: string | null
          os: string | null
          session_id: string
          start_time: string
          user_id: string
        }
        Insert: {
          age?: number | null
          browser?: string | null
          created_at?: string | null
          device_type?: string | null
          end_time?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          os?: string | null
          session_id: string
          start_time?: string
          user_id: string
        }
        Update: {
          age?: number | null
          browser?: string | null
          created_at?: string | null
          device_type?: string | null
          end_time?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          os?: string | null
          session_id?: string
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      username_history: {
        Row: {
          changed_at: string | null
          id: string
          new_username: string | null
          old_username: string | null
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_username?: string | null
          old_username?: string | null
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_username?: string | null
          old_username?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          apple_id: string | null
          auto_location_detection: boolean | null
          avatar_url: string | null
          ban_reason: string | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          currency_preference: string | null
          current_city: string | null
          current_district: string | null
          current_location_service_id: number | null
          date_of_birth: string | null
          display_name: string | null
          display_preferences: Json | null
          email: string
          email_verified: boolean | null
          facebook_id: string | null
          failed_login_attempts: number | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          google_id: string | null
          id: number
          is_active: boolean | null
          is_admin: boolean | null
          is_banned: boolean | null
          is_verified: boolean | null
          last_login: string | null
          last_login_at: string | null
          last_name: string | null
          last_seen: string | null
          location: string | null
          locked_until: string | null
          notification_sound: boolean | null
          password_hash: string | null
          password_reset_expires: string | null
          password_reset_token: string | null
          phone: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          profile_completion_percentage: number | null
          profile_visibility: string | null
          role: string | null
          show_email: boolean | null
          show_location: boolean | null
          show_phone: boolean | null
          status: string | null
          theme_preference: string | null
          updated_at: string | null
          username: string | null
          verification_badge: string | null
          verification_date: string | null
          website: string | null
        }
        Insert: {
          apple_id?: string | null
          auto_location_detection?: boolean | null
          avatar_url?: string | null
          ban_reason?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          currency_preference?: string | null
          current_city?: string | null
          current_district?: string | null
          current_location_service_id?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          display_preferences?: Json | null
          email: string
          email_verified?: boolean | null
          facebook_id?: string | null
          failed_login_attempts?: number | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          google_id?: string | null
          id?: number
          is_active?: boolean | null
          is_admin?: boolean | null
          is_banned?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          last_login_at?: string | null
          last_name?: string | null
          last_seen?: string | null
          location?: string | null
          locked_until?: string | null
          notification_sound?: boolean | null
          password_hash?: string | null
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          profile_completion_percentage?: number | null
          profile_visibility?: string | null
          role?: string | null
          show_email?: boolean | null
          show_location?: boolean | null
          show_phone?: boolean | null
          status?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          username?: string | null
          verification_badge?: string | null
          verification_date?: string | null
          website?: string | null
        }
        Update: {
          apple_id?: string | null
          auto_location_detection?: boolean | null
          avatar_url?: string | null
          ban_reason?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          currency_preference?: string | null
          current_city?: string | null
          current_district?: string | null
          current_location_service_id?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          display_preferences?: Json | null
          email?: string
          email_verified?: boolean | null
          facebook_id?: string | null
          failed_login_attempts?: number | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          google_id?: string | null
          id?: number
          is_active?: boolean | null
          is_admin?: boolean | null
          is_banned?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          last_login_at?: string | null
          last_name?: string | null
          last_seen?: string | null
          location?: string | null
          locked_until?: string | null
          notification_sound?: boolean | null
          password_hash?: string | null
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          profile_completion_percentage?: number | null
          profile_visibility?: string | null
          role?: string | null
          show_email?: boolean | null
          show_location?: boolean | null
          show_phone?: boolean | null
          status?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          username?: string | null
          verification_badge?: string | null
          verification_date?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_current_location_service_id_fkey"
            columns: ["current_location_service_id"]
            isOneToOne: false
            referencedRelation: "location_service_config"
            referencedColumns: ["id"]
          },
        ]
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
      wishlist_analytics: {
        Row: {
          additions_count: number | null
          avg_time_in_wishlist: number | null
          business_id: string
          conversions_count: number | null
          created_at: string | null
          date_tracked: string
          id: string
          location_code: string | null
          product_id: string | null
          removals_count: number | null
          service_id: string | null
          sharing_count: number | null
          user_age_group: string | null
          user_city: string | null
          user_country: string | null
          user_gender: string | null
          user_id: string | null
          user_state: string | null
        }
        Insert: {
          additions_count?: number | null
          avg_time_in_wishlist?: number | null
          business_id: string
          conversions_count?: number | null
          created_at?: string | null
          date_tracked?: string
          id?: string
          location_code?: string | null
          product_id?: string | null
          removals_count?: number | null
          service_id?: string | null
          sharing_count?: number | null
          user_age_group?: string | null
          user_city?: string | null
          user_country?: string | null
          user_gender?: string | null
          user_id?: string | null
          user_state?: string | null
        }
        Update: {
          additions_count?: number | null
          avg_time_in_wishlist?: number | null
          business_id?: string
          conversions_count?: number | null
          created_at?: string | null
          date_tracked?: string
          id?: string
          location_code?: string | null
          product_id?: string | null
          removals_count?: number | null
          service_id?: string | null
          sharing_count?: number | null
          user_age_group?: string | null
          user_city?: string | null
          user_country?: string | null
          user_gender?: string | null
          user_id?: string | null
          user_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_analytics_location_code_fkey"
            columns: ["location_code"]
            isOneToOne: false
            referencedRelation: "location_hierarchy"
            referencedColumns: ["location_code"]
          },
        ]
      }
      wishlist_events: {
        Row: {
          age: number | null
          created_at: string | null
          event_type: string
          gender: string | null
          id: string
          location: string | null
          session_id: string
          target_id: string
          target_type: string
          timestamp: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          event_type: string
          gender?: string | null
          id?: string
          location?: string | null
          session_id: string
          target_id: string
          target_type: string
          timestamp?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string | null
          event_type?: string
          gender?: string | null
          id?: string
          location?: string | null
          session_id?: string
          target_id?: string
          target_type?: string
          timestamp?: string
          user_id?: string
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
        Relationships: []
      }
    }
    Views: {
      business_overview: {
        Row: {
          active_products: number | null
          address_line1: string | null
          address_line2: string | null
          average_rating: number | null
          business_hours: Json | null
          business_name: string | null
          business_type: string | null
          category: string | null
          city: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          district: string | null
          email: string | null
          id: string | null
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          pincode: string | null
          state: string | null
          subcategory: string | null
          total_product_likes: number | null
          total_product_purchases: number | null
          total_product_views: number | null
          total_products: number | null
          total_reviews: number | null
          total_views: number | null
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
          website: string | null
        }
        Relationships: []
      }
      category_stats: {
        Row: {
          avg_price: number | null
          avg_rating: number | null
          category: string | null
          featured_count: number | null
          max_price: number | null
          min_price: number | null
          product_count: number | null
          total_stock: number | null
        }
        Relationships: []
      }
      city_business_analytics: {
        Row: {
          active_businesses: number | null
          avg_city_rating: number | null
          city: string | null
          state: string | null
          total_businesses: number | null
          total_city_reviews: number | null
          unique_categories: number | null
          verified_businesses: number | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      marketplace_products: {
        Row: {
          brand: string | null
          business_id: string | null
          category: string | null
          color: string | null
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          delivery_charge: number | null
          description: string | null
          dimensions: Json | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          likes_count: number | null
          main_image_url: string | null
          model: string | null
          original_price: number | null
          price: number | null
          product_name: string | null
          rating: number | null
          review_count: number | null
          seo_title: string | null
          size: string | null
          specifications: Json | null
          stock_quantity: number | null
          subcategory: string | null
          tags: string[] | null
          views_count: number | null
          weight: number | null
        }
        Insert: {
          brand?: string | null
          business_id?: string | null
          category?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_charge?: number | null
          description?: string | null
          dimensions?: Json | null
          id?: string | null
          is_active?: never
          is_featured?: never
          likes_count?: never
          main_image_url?: string | null
          model?: string | null
          original_price?: number | null
          price?: number | null
          product_name?: string | null
          rating?: never
          review_count?: never
          seo_title?: string | null
          size?: string | null
          specifications?: never
          stock_quantity?: never
          subcategory?: string | null
          tags?: string[] | null
          views_count?: never
          weight?: number | null
        }
        Update: {
          brand?: string | null
          business_id?: string | null
          category?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_charge?: number | null
          description?: string | null
          dimensions?: Json | null
          id?: string | null
          is_active?: never
          is_featured?: never
          likes_count?: never
          main_image_url?: string | null
          model?: string | null
          original_price?: number | null
          price?: number | null
          product_name?: string | null
          rating?: never
          review_count?: never
          seo_title?: string | null
          size?: string | null
          specifications?: never
          stock_quantity?: never
          subcategory?: string | null
          tags?: string[] | null
          views_count?: never
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_details: {
        Row: {
          admin_approved_at: string | null
          admin_rejected_at: string | null
          admin_status: string | null
          brand: string | null
          business_category: string | null
          business_city: string | null
          business_email: string | null
          business_id: string | null
          business_name: string | null
          business_phone: string | null
          business_rating: number | null
          category: string | null
          city: string | null
          color: string | null
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          delivery_charge: number | null
          description: string | null
          dimensions: Json | null
          discount_percentage: number | null
          district: string | null
          id: string | null
          image_urls: string[] | null
          is_active: boolean | null
          is_branded: boolean | null
          is_digital: boolean | null
          is_discounted: boolean | null
          is_featured: boolean | null
          is_used: boolean | null
          labels: string[] | null
          latitude: number | null
          likes_count: number | null
          longitude: number | null
          main_image_url: string | null
          marketplace_approved: boolean | null
          metadata: Json | null
          min_order_quantity: number | null
          model: string | null
          original_price: number | null
          price: number | null
          product_name: string | null
          purchases_count: number | null
          rating: number | null
          reach: number | null
          rejection_reason: string | null
          review_count: number | null
          seo_description: string | null
          seo_title: string | null
          show_in_marketplace: boolean | null
          size: string | null
          sku: string | null
          specifications: Json | null
          state: string | null
          stock_quantity: number | null
          subcategory: string | null
          tags: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
          video_urls: string[] | null
          views_count: number | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_with_votes: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          helpful_votes: number | null
          helpful_votes_total: number | null
          id: string | null
          is_helpful_count: number | null
          rating: number | null
          review_text: string | null
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          helpful_votes?: number | null
          helpful_votes_total?: never
          id?: string | null
          is_helpful_count?: number | null
          rating?: number | null
          review_text?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          helpful_votes?: number | null
          helpful_votes_total?: never
          id?: string | null
          is_helpful_count?: number | null
          rating?: number | null
          review_text?: string | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_details_complete: {
        Row: {
          additional_room_price: number | null
          advance_booking_required: boolean | null
          areas_covered: string | null
          availability: string | null
          availability_info: string | null
          base_price: number | null
          bookings_count: number | null
          bookmark_count: number | null
          business_rating: number | null
          business_verified: boolean | null
          cancellation_policy: string | null
          category: string | null
          city: string | null
          computed_rating: number | null
          computed_reviews_count: number | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          cover_images: string[] | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration: string | null
          enhanced_description: string | null
          features: string[] | null
          home_service: boolean | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          latest_review: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          portfolio_images: string[] | null
          price: number | null
          pricing_type: string | null
          primary_image_url: string | null
          provider_avatar: string | null
          provider_city: string | null
          provider_name: string | null
          provider_phone: string | null
          rating: number | null
          requirements: string | null
          reviews_count: number | null
          service_area: string | null
          service_badge: string | null
          service_duration: string | null
          service_frequency: string | null
          state: string | null
          subcategory: string | null
          title: string | null
          total_reviews_count: number | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          additional_room_price?: never
          advance_booking_required?: boolean | null
          areas_covered?: string | null
          availability?: never
          availability_info?: never
          base_price?: number | null
          bookings_count?: never
          bookmark_count?: never
          business_rating?: never
          business_verified?: never
          cancellation_policy?: never
          category?: string | null
          city?: never
          computed_rating?: never
          computed_reviews_count?: never
          contact_email?: never
          contact_phone?: string | null
          contact_whatsapp?: string | null
          cover_images?: never
          created_at?: string | null
          currency?: never
          description?: string | null
          duration?: never
          enhanced_description?: string | null
          features?: never
          home_service?: boolean | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latest_review?: never
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          portfolio_images?: never
          price?: number | null
          pricing_type?: never
          primary_image_url?: string | null
          provider_avatar?: never
          provider_city?: never
          provider_name?: never
          provider_phone?: string | null
          rating?: never
          requirements?: never
          reviews_count?: never
          service_area?: string | null
          service_badge?: never
          service_duration?: never
          service_frequency?: never
          state?: string | null
          subcategory?: string | null
          title?: string | null
          total_reviews_count?: never
          user_id?: string | null
          views?: never
        }
        Update: {
          additional_room_price?: never
          advance_booking_required?: boolean | null
          areas_covered?: string | null
          availability?: never
          availability_info?: never
          base_price?: number | null
          bookings_count?: never
          bookmark_count?: never
          business_rating?: never
          business_verified?: never
          cancellation_policy?: never
          category?: string | null
          city?: never
          computed_rating?: never
          computed_reviews_count?: never
          contact_email?: never
          contact_phone?: string | null
          contact_whatsapp?: string | null
          cover_images?: never
          created_at?: string | null
          currency?: never
          description?: string | null
          duration?: never
          enhanced_description?: string | null
          features?: never
          home_service?: boolean | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latest_review?: never
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          portfolio_images?: never
          price?: number | null
          pricing_type?: never
          primary_image_url?: string | null
          provider_avatar?: never
          provider_city?: never
          provider_name?: never
          provider_phone?: string | null
          rating?: never
          requirements?: never
          reviews_count?: never
          service_area?: string | null
          service_badge?: never
          service_duration?: never
          service_frequency?: never
          state?: string | null
          subcategory?: string | null
          title?: string | null
          total_reviews_count?: never
          user_id?: string | null
          views?: never
        }
        Relationships: []
      }
      services_complete: {
        Row: {
          additional_room_price: number | null
          advance_booking_required: boolean | null
          areas_covered: string | null
          availability: string | null
          availability_info: string | null
          base_price: number | null
          bookings_count: number | null
          business_rating: number | null
          business_verified: boolean | null
          cancellation_policy: string | null
          category: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          cover_images: string[] | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration: string | null
          enhanced_description: string | null
          features: string[] | null
          home_service: boolean | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          latest_review: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          portfolio_images: string[] | null
          price: number | null
          pricing_type: string | null
          primary_image_url: string | null
          provider_avatar: string | null
          provider_city: string | null
          provider_name: string | null
          provider_phone: string | null
          rating: number | null
          requirements: string | null
          reviews_count: number | null
          service_area: string | null
          service_badge: string | null
          service_duration: string | null
          service_frequency: string | null
          state: string | null
          subcategory: string | null
          title: string | null
          total_reviews_count: number | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          additional_room_price?: never
          advance_booking_required?: boolean | null
          areas_covered?: string | null
          availability?: never
          availability_info?: never
          base_price?: number | null
          bookings_count?: never
          business_rating?: never
          business_verified?: never
          cancellation_policy?: never
          category?: string | null
          city?: never
          contact_email?: never
          contact_phone?: string | null
          contact_whatsapp?: string | null
          cover_images?: never
          created_at?: string | null
          currency?: never
          description?: string | null
          duration?: never
          enhanced_description?: string | null
          features?: never
          home_service?: boolean | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latest_review?: never
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          portfolio_images?: never
          price?: number | null
          pricing_type?: never
          primary_image_url?: string | null
          provider_avatar?: never
          provider_city?: never
          provider_name?: never
          provider_phone?: string | null
          rating?: never
          requirements?: never
          reviews_count?: never
          service_area?: string | null
          service_badge?: never
          service_duration?: never
          service_frequency?: never
          state?: string | null
          subcategory?: string | null
          title?: string | null
          total_reviews_count?: never
          user_id?: string | null
          views?: never
        }
        Update: {
          additional_room_price?: never
          advance_booking_required?: boolean | null
          areas_covered?: string | null
          availability?: never
          availability_info?: never
          base_price?: number | null
          bookings_count?: never
          business_rating?: never
          business_verified?: never
          cancellation_policy?: never
          category?: string | null
          city?: never
          contact_email?: never
          contact_phone?: string | null
          contact_whatsapp?: string | null
          cover_images?: never
          created_at?: string | null
          currency?: never
          description?: string | null
          duration?: never
          enhanced_description?: string | null
          features?: never
          home_service?: boolean | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latest_review?: never
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          portfolio_images?: never
          price?: number | null
          pricing_type?: never
          primary_image_url?: string | null
          provider_avatar?: never
          provider_city?: never
          provider_name?: never
          provider_phone?: string | null
          rating?: never
          requirements?: never
          reviews_count?: never
          service_area?: string | null
          service_badge?: never
          service_duration?: never
          service_frequency?: never
          state?: string | null
          subcategory?: string | null
          title?: string | null
          total_reviews_count?: never
          user_id?: string | null
          views?: never
        }
        Relationships: []
      }
      trending_services: {
        Row: {
          bookings_count: number | null
          business_verified: boolean | null
          category: string | null
          contact_info: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          price: number | null
          provider_avatar: string | null
          provider_city: string | null
          provider_name: string | null
          reviews_count: number | null
          service_badge: string | null
          title: string | null
          trending_score: number | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          bookings_count?: never
          business_verified?: never
          category?: string | null
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          is_active?: never
          is_featured?: never
          location?: string | null
          price?: number | null
          provider_avatar?: never
          provider_city?: string | null
          provider_name?: never
          reviews_count?: never
          service_badge?: never
          title?: string | null
          trending_score?: number | null
          user_id?: string | null
          views?: never
        }
        Update: {
          bookings_count?: never
          business_verified?: never
          category?: string | null
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          is_active?: never
          is_featured?: never
          location?: string | null
          price?: number | null
          provider_avatar?: never
          provider_city?: string | null
          provider_name?: never
          reviews_count?: never
          service_badge?: never
          title?: string | null
          trending_score?: number | null
          user_id?: string | null
          views?: never
        }
        Relationships: []
      }
      v_regional_business_heatmap: {
        Row: {
          active_businesses: number | null
          area: string | null
          avg_business_revenue: number | null
          avg_content_engagement_rate: number | null
          avg_conversion_rate: number | null
          avg_distance_to_business: number | null
          avg_engagement_rate: number | null
          city: string | null
          content_clicks_per_business: number | null
          daily_growth_rate: number | null
          date_tracked: string | null
          demographic_distribution: Json | null
          new_user_count: number | null
          peak_activity_hour: number | null
          peak_day_of_week: number | null
          prev_day_views: number | null
          region: string | null
          returning_user_count: number | null
          revenue_per_business: number | null
          top_category: string | null
          total_bookings: number | null
          total_businesses: number | null
          total_calls: number | null
          total_menu_clicks: number | null
          total_overview_clicks: number | null
          total_photos_clicks: number | null
          total_portfolio_clicks: number | null
          total_revenue: number | null
          total_views: number | null
          verification_rate: number | null
          verified_businesses: number | null
          views_per_business: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      add_business_to_list: {
        Args: {
          user_uuid: string
          list_uuid: string
          business_uuid: string
          user_notes?: string
        }
        Returns: Json
      }
      add_product_like: {
        Args: { product_id: string }
        Returns: undefined
      }
      add_to_cart: {
        Args: { product_id: string; quantity?: number }
        Returns: undefined
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
        Returns: string
      }
      admin_has_permission: {
        Args: { admin_id: string; required_permission: string }
        Returns: boolean
      }
      ats_keyword_match_score: {
        Args: {
          job_description: string
          job_requirements: string
          resume_text: string
          candidate_skills: Json
        }
        Returns: number
      }
      bootstrap_admin_safe: {
        Args: { admin_email: string }
        Returns: undefined
      }
      bootstrap_admin_user_safe: {
        Args: { admin_email: string; admin_name?: string }
        Returns: string
      }
      bootstrap_first_admin: {
        Args: { admin_email: string }
        Returns: undefined
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      calculate_ai_match_score: {
        Args: {
          job_required_skills: Json
          job_preferred_skills: Json
          candidate_skills: Json
          job_experience_years: number
          candidate_experience_years: number
        }
        Returns: number
      }
      calculate_ats_score: {
        Args: {
          job_id: string
          applicant_resume_text: string
          applicant_skills: Json
          applicant_experience_years: number
          applicant_education_level: string
        }
        Returns: {
          total_score: number
          keyword_score: number
          experience_score: number
          education_score: number
          skills_match_score: number
          recommendation: string
        }[]
      }
      calculate_business_scores: {
        Args: { p_business_id: string }
        Returns: undefined
      }
      can_user_access_services: {
        Args: { p_user_id: number; p_city: string; p_district: string }
        Returns: {
          can_access: boolean
          service_type: string
          delivery_available: boolean
          showcase_available: boolean
          job_posting_available: boolean
        }[]
      }
      check_search_suggestion_exists: {
        Args: { term_param: string }
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
      count_business_likes: {
        Args: { limit_param?: number }
        Returns: {
          business_id: string
          count: number
        }[]
      }
      create_search_suggestion: {
        Args: { term_param: string; category_param: string }
        Returns: string
      }
      create_test_business_with_location: {
        Args: Record<PropertyKey, never>
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
      create_user_list: {
        Args: {
          user_uuid: string
          list_name: string
          list_description?: string
          list_icon?: string
          list_color?: string
        }
        Returns: Json
      }
      decrement_business_likes: {
        Args: { business_id: string }
        Returns: undefined
      }
      delete_business_cascade: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      delete_product_safely: {
        Args: { product_id_param: string; is_business_product?: boolean }
        Returns: boolean
      }
      delete_service_safely: {
        Args: { service_id_param: string }
        Returns: boolean
      }
      delete_user_list: {
        Args: { user_uuid: string; list_uuid: string }
        Returns: Json
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      extract_job_keywords: {
        Args: {
          job_description: string
          job_requirements: string
          limit_count?: number
        }
        Returns: {
          keyword: string
          frequency: number
          importance_score: number
        }[]
      }
      fix_portfolio_order: {
        Args: { business_id_param: string }
        Returns: undefined
      }
      generate_business_id: {
        Args: { business_name: string }
        Returns: string
      }
      generate_realistic_analytics: {
        Args: { p_business_id: string; p_days_back?: number }
        Returns: undefined
      }
      generate_sample_analytics_data: {
        Args: { p_business_id: string }
        Returns: undefined
      }
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_ads_by_location: {
        Args: {
          user_location: string
          location_type?: string
          ad_limit?: number
        }
        Returns: {
          ad_id: string
          title: string
          description: string
          image_url: string
          location_tags: string[]
          targeting_precision: number
        }[]
      }
      get_business_analytics_by_custom_id: {
        Args: { p_custom_id: string }
        Returns: {
          business_id: string
          business_custom_id: string
          business_name: string
          category: string
          is_verified: boolean
          total_views: number
          total_likes: number
          total_shares: number
          total_call_clicks: number
          total_contact_clicks: number
          today_views: number
          today_likes: number
          today_call_clicks: number
          today_contact_clicks: number
          week_views: number
          month_views: number
          engagement_rate: number
          last_updated: string
        }[]
      }
      get_business_area_analytics: {
        Args: { p_business_custom_id: string; p_days_back?: number }
        Returns: {
          area_name: string
          colony_name: string
          total_views: number
          total_interactions: number
          total_calls: number
          total_messages: number
          unique_users: number
          conversion_rate: number
          avg_session_duration: number
        }[]
      }
      get_business_by_id: {
        Args: { identifier: string }
        Returns: {
          id: string
          custom_id: string
          name: string
          category: string
          is_verified: boolean
          city: string
          location: string
        }[]
      }
      get_business_dashboard_analytics_v2: {
        Args: { p_business_id: string }
        Returns: {
          metric_name: string
          current_value: number
          previous_value: number
          percentage_change: number
          period_label: string
        }[]
      }
      get_business_dashboard_summary: {
        Args: {
          p_business_id: string
          p_date_from?: string
          p_date_to?: string
        }
        Returns: {
          total_views: number
          total_visitors: number
          total_interactions: number
          total_revenue: number
          conversion_rate: number
          engagement_score_avg: number
        }[]
      }
      get_business_insights: {
        Args: { p_business_id: string }
        Returns: Json
      }
      get_business_lists: {
        Args: { user_uuid: string; business_uuid: string }
        Returns: {
          list_id: string
          list_name: string
        }[]
      }
      get_business_status: {
        Args: { business_id: string }
        Returns: string
      }
      get_businesses_in_location: {
        Args: { p_city: string; p_district: string; p_category?: string }
        Returns: {
          business_id: number
          business_name: string
          business_type: string
          category: string
          address_line1: string
          contact_phone: string
          is_verified: boolean
          average_rating: number
        }[]
      }
      get_company_job_stats: {
        Args: { company_uuid: string }
        Returns: {
          total_jobs: number
          active_jobs: number
          total_applications: number
          total_views: number
        }[]
      }
      get_comprehensive_business_analytics: {
        Args: {
          p_business_id: string
          p_date_from?: string
          p_date_to?: string
        }
        Returns: {
          analytics_category: string
          metric_name: string
          metric_value: number
          growth_rate: number
          performance_score: number
        }[]
      }
      get_content_performance_analytics: {
        Args: {
          p_business_id: string
          p_content_type?: string
          p_date_from?: string
          p_date_to?: string
        }
        Returns: {
          content_type: string
          content_id: string
          total_views: number
          engagement_score: number
          conversion_rate: number
          sales_attribution: number
          performance_rank: number
        }[]
      }
      get_delivery_info: {
        Args: { user_lat: number; user_lng: number; business_id_param: string }
        Returns: {
          can_deliver: boolean
          delivery_fee: number
          estimated_time: number
          min_order_amount: number
        }[]
      }
      get_enabled_buckets: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_name: string
          is_public: boolean
        }[]
      }
      get_entity_views: {
        Args: { table_name: string; record_id: string }
        Returns: number
      }
      get_group_members: {
        Args: { group_id: string }
        Returns: {
          count: number
          members: string[]
        }[]
      }
      get_hiring_funnel_analytics: {
        Args: { job_id_param: string }
        Returns: {
          total_applications: number
          screening_passed: number
          interviews_scheduled: number
          offers_extended: number
          offers_accepted: number
          conversion_rates: Json
        }[]
      }
      get_image_search_url: {
        Args: { image_id_param: string }
        Returns: Json
      }
      get_job_analytics: {
        Args: {
          business_id_param: string
          date_from?: string
          date_to?: string
        }
        Returns: {
          total_jobs: number
          active_jobs: number
          total_applications: number
          total_views: number
          avg_applications_per_job: number
          conversion_rate: number
          top_performing_job_id: string
          top_performing_job_title: string
          avg_time_to_fill_days: number
          most_demanded_skills: Json
        }[]
      }
      get_jobs_in_location: {
        Args: { p_city: string; p_district: string }
        Returns: {
          job_id: number
          title: string
          job_type: string
          salary_min: number
          salary_max: number
          employer_name: string
        }[]
      }
      get_list_businesses: {
        Args: { user_uuid: string; list_uuid: string }
        Returns: {
          business_id: string
          business_name: string
          business_category: string
          business_rating: number
          business_address: string
          business_city: string
          business_phone: string
          business_logo_url: string
          user_notes: string
          added_at: string
          sort_order: number
        }[]
      }
      get_location_availability: {
        Args: { p_city: string; p_district: string }
        Returns: {
          status: string
          message: string
          service_badge: string
          available_services: string[]
        }[]
      }
      get_location_hierarchy: {
        Args: { location_name: string; location_type?: string }
        Returns: {
          level_name: string
          level_type: string
          targeting_priority: number
        }[]
      }
      get_location_service_details: {
        Args: { p_city: string; p_district: string }
        Returns: {
          service_type: string
          is_active: boolean
          delivery_enabled: boolean
          showcase_enabled: boolean
          job_posting_enabled: boolean
          delivery_fee: number
          min_order_amount: number
        }[]
      }
      get_nearby_businesses: {
        Args: { user_lat: number; user_lng: number; radius_km?: number }
        Returns: {
          id: string
          name: string
          type: string
          address: string
          city: string
          distance_km: number
        }[]
      }
      get_product_analytics: {
        Args: { product_id: string }
        Returns: {
          views_count: number
          likes_count: number
          cart_adds_count: number
          conversion_rate: number
        }[]
      }
      get_product_likes_count: {
        Args: { product_id: string }
        Returns: number
      }
      get_products_by_location: {
        Args: { user_city?: string }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          business_id: string
          business_name: string
          business_city: string
          admin_status: string
          show_in_marketplace: boolean
        }[]
      }
      get_products_by_location_fixed: {
        Args: { user_city: string; include_business_location?: boolean }
        Returns: {
          id: string
          name: string
          price: number
          city: string
          business_name: string
          business_city: string
          location_type: string
        }[]
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_sample_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_services_by_location: {
        Args: { user_city?: string }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          category: string
          business_id: string
          business_name: string
          business_city: string
          home_service: boolean
        }[]
      }
      get_services_by_location_fixed: {
        Args: { user_city: string; include_business_location?: boolean }
        Returns: {
          id: string
          title: string
          price: number
          city: string
          business_name: string
          business_city: string
          location_type: string
        }[]
      }
      get_top_entities_by_ranking: {
        Args: {
          p_entity_type: string
          p_ranking_type: string
          p_category?: string
          p_time_period?: string
          p_limit?: number
        }
        Returns: {
          entity_id: string
          entity_type: string
          name: string
          description: string
          category: string
          image_url: string
          rating: number
          price: number
          views_count: number
          likes_count: number
          purchases_count: number
          revenue_total: number
          trending_score: number
          rank_position: number
        }[]
      }
      get_top_entities_by_ranking_v2: {
        Args: {
          p_entity_type: string
          p_ranking_type: string
          p_category?: string
          p_time_period?: string
          p_limit?: number
        }
        Returns: {
          entity_id: string
          entity_type: string
          name: string
          description: string
          category: string
          image_url: string
          rating: number
          price: number
          views_count: number
          likes_count: number
          purchases_count: number
          revenue_total: number
          trending_score: number
          rank_position: number
        }[]
      }
      get_top_purchased_products: {
        Args: { limit_param?: number }
        Returns: {
          product_id: string
          title: string
          category: string
          image_url: string
          price: number
          rating: number
          quantity: number
        }[]
      }
      get_top_rated_services: {
        Args: { limit_param?: number }
        Returns: {
          service_id: string
          title: string
          category: string
          image_url: string
          price: number
          rating: number
        }[]
      }
      get_top_viewed_businesses: {
        Args: { limit_param?: number }
        Returns: {
          business_id: string
          name: string
          category: string
          image_url: string
          rating: number
          views: number
        }[]
      }
      get_top_viewed_entities: {
        Args: { entity_limit?: number }
        Returns: {
          entity_id: string
          entity_type: string
          entity_name: string
          view_count: number
        }[]
      }
      get_user_journey_analytics: {
        Args: {
          p_business_id: string
          p_date_from?: string
          p_date_to?: string
        }
        Returns: {
          journey_stage: string
          user_count: number
          conversion_rate: number
          avg_time_spent: number
          drop_off_rate: number
        }[]
      }
      get_user_lists_with_counts: {
        Args: { p_user_id: string }
        Returns: {
          list_id: string
          list_name: string
          list_description: string
          list_icon: string
          list_color: string
          business_count: number
          created_at: string
          updated_at: string
        }[]
      }
      get_user_presence: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_saved_businesses: {
        Args: { user_uuid: string }
        Returns: {
          business_id: string
          business_name: string
          business_category: string
          business_rating: number
          business_address: string
          business_city: string
          business_phone: string
          business_logo_url: string
          saved_in_lists: string[]
          total_lists: number
          first_saved_at: string
          last_saved_at: string
          is_liked: boolean
        }[]
      }
      get_users_in_location: {
        Args: { p_city: string; p_district: string; p_user_type?: string }
        Returns: {
          user_id: number
          display_name: string
          username: string
          user_type: string
          is_verified: boolean
          is_business: boolean
        }[]
      }
      get_voice_recording_url: {
        Args: { recording_id_param: string }
        Returns: Json
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_ad_clicks: {
        Args: { ad_id: string }
        Returns: undefined
      }
      increment_ad_impressions: {
        Args: { ad_id_param: string }
        Returns: undefined
      }
      increment_ad_reach: {
        Args: { ad_id_param: string }
        Returns: undefined
      }
      increment_ad_views: {
        Args: { ad_id: string }
        Returns: undefined
      }
      increment_business_likes: {
        Args: { business_id: string }
        Returns: undefined
      }
      increment_business_views: {
        Args: { business_id_param: string } | { business_id_param: string }
        Returns: undefined
      }
      increment_job_view: {
        Args: {
          job_id: string
          viewer_ip?: unknown
          viewer_user_agent?: string
        }
        Returns: undefined
      }
      increment_post_views: {
        Args: { post_id_param: string }
        Returns: undefined
      }
      increment_product_views: {
        Args: { product_id: string } | { product_id_param: string }
        Returns: undefined
      }
      increment_search_suggestion: {
        Args: { term_param: string }
        Returns: undefined
      }
      increment_service_views: {
        Args: { service_id: string } | { service_id_param: string }
        Returns: undefined
      }
      increment_service_views_safe: {
        Args: { service_uuid: string }
        Returns: undefined
      }
      increment_views: {
        Args: { table_name: string; record_id: string }
        Returns: undefined
      }
      insert_image_search: {
        Args: { user_id_param: string; image_url_param: string }
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
        Args: { user_id_param: string; audio_url_param: string }
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
      is_business_in_list: {
        Args: { user_uuid: string; list_uuid: string; business_uuid: string }
        Returns: boolean
      }
      is_business_liked: {
        Args: { user_uuid: string; business_uuid: string }
        Returns: boolean
      }
      is_product_liked: {
        Args: { product_id: string; user_id?: string }
        Returns: boolean
      }
      is_user_in_delivery_zone: {
        Args: { user_lat: number; user_lng: number; business_id_param: string }
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      log_business_interaction: {
        Args: {
          p_business_id: string
          p_user_id?: string
          p_session_id?: string
          p_action_type?: string
          p_user_region?: string
          p_user_city?: string
          p_user_area?: string
          p_user_lat?: number
          p_user_lon?: number
          p_device_type?: string
          p_platform?: string
          p_referrer_source?: string
          p_interaction_value?: number
          p_interaction_duration_ms?: number
          p_is_authenticated?: boolean
          p_campaign_id?: string
          p_source_page?: string
          p_metadata?: Json
        }
        Returns: boolean
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      populate_sample_analytics_data: {
        Args: { p_business_id: string }
        Returns: boolean
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
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
      remove_business_from_list: {
        Args: { user_uuid: string; list_uuid: string; business_uuid: string }
        Returns: Json
      }
      remove_product_like: {
        Args: { product_id: string }
        Returns: undefined
      }
      reset_analytics_data: {
        Args: { p_business_id: string }
        Returns: string
      }
      search_jobs: {
        Args: {
          search_query?: string
          category_filter?: string
          location_filter?: string
          employment_type_filter?: string
          salary_min_filter?: number
          remote_only?: boolean
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          company_name: string
          company_logo: string
          location: string
          employment_type: string
          salary_min: number
          salary_max: number
          remote_allowed: boolean
          is_featured: boolean
          is_urgent: boolean
          created_at: string
          view_count: number
          application_count: number
        }[]
      }
      search_products: {
        Args: { search_term: string }
        Returns: {
          id: string
          product_name: string
          business_name: string
          description: string
          price: number
          rating: number
          main_image_url: string
          category: string
          match_rank: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      set_user_admin_metadata: {
        Args: { user_id: string }
        Returns: undefined
      }
      setup_sample_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          business_id: string
          status: string
        }[]
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      simple_search: {
        Args: { p_query: string }
        Returns: {
          entity_type: string
          id: string
          name: string
          description: string
          city: string
          category: string
        }[]
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { geom: unknown; format?: string }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; radius: number; options?: string }
          | { geom: unknown; radius: number; quadsegs: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { letters: string; font?: Json }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      toggle_business_favorite: {
        Args: { user_uuid: string; business_uuid: string }
        Returns: boolean
      }
      toggle_business_like: {
        Args: { user_uuid: string; business_uuid: string }
        Returns: Json
      }
      track_business_event_v2: {
        Args: {
          p_business_id: string
          p_event_type: string
          p_event_source?: string
          p_user_id?: string
          p_user_location?: unknown
          p_city?: string
          p_state?: string
          p_country?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_referrer?: string
          p_session_id?: string
          p_metadata?: Json
        }
        Returns: string
      }
      track_business_interaction_custom: {
        Args: {
          p_business_custom_id: string
          p_user_id?: string
          p_session_id?: string
          p_action_type?: string
          p_user_region?: string
          p_user_city?: string
          p_user_area?: string
          p_device_type?: string
          p_platform?: string
          p_interaction_value?: number
        }
        Returns: string
      }
      track_business_interaction_with_location: {
        Args: {
          p_business_custom_id: string
          p_user_id?: string
          p_session_id?: string
          p_action_type?: string
          p_user_city?: string
          p_user_area?: string
          p_user_colony?: string
          p_user_pincode?: string
          p_user_lat?: number
          p_user_lon?: number
          p_device_type?: string
          p_platform?: string
          p_interaction_value?: number
        }
        Returns: string
      }
      track_customer_interaction: {
        Args: {
          p_business_id: string
          p_interaction_type: string
          p_entity_type: string
          p_entity_id: string
          p_customer_id?: string
          p_session_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_referrer_url?: string
          p_interaction_data?: Json
        }
        Returns: undefined
      }
      track_enhanced_business_event: {
        Args: {
          p_business_id: string
          p_event_type: string
          p_event_source?: string
          p_user_id?: string
          p_session_id?: string
          p_revenue_value?: number
          p_location_data?: Json
          p_device_data?: Json
          p_additional_data?: Json
        }
        Returns: undefined
      }
      track_entity_like_v2: {
        Args: { p_entity_id: string; p_entity_type: string; p_user_id: string }
        Returns: boolean
      }
      track_entity_purchase_v2: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_user_id: string
          p_amount: number
          p_quantity?: number
          p_order_id?: string
        }
        Returns: undefined
      }
      track_entity_view_v2: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_user_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_session_id?: string
        }
        Returns: undefined
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      update_business_real_time_stats: {
        Args: {
          p_business_id: string
          p_action_type: string
          p_interaction_duration_ms?: number
        }
        Returns: undefined
      }
      update_image_search_description: {
        Args: { image_id_param: string; description_param: string }
        Returns: undefined
      }
      update_product_analytics: {
        Args: {
          p_product_id: string
          p_business_id: string
          p_metric_type: string
          p_value?: number
          p_additional_data?: Json
        }
        Returns: undefined
      }
      update_regional_analytics: {
        Args: {
          p_region: string
          p_city: string
          p_area: string
          p_user_lat?: number
          p_user_lon?: number
        }
        Returns: undefined
      }
      update_service_rating: {
        Args: { service_uuid: string }
        Returns: undefined
      }
      update_system_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_list: {
        Args: {
          user_uuid: string
          list_uuid: string
          list_name?: string
          list_description?: string
          list_icon?: string
          list_color?: string
        }
        Returns: Json
      }
      update_user_location: {
        Args: { p_user_id: number; p_city: string; p_district: string }
        Returns: boolean
      }
      update_user_presence: {
        Args: { user_id: string; last_seen_time: string }
        Returns: boolean
      }
      update_voice_recording_transcription: {
        Args: { recording_id_param: string; transcription_param: string }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
      user_liked_product: {
        Args: { product_id: string }
        Returns: boolean
      }
      verify_schema_fix: {
        Args: Record<PropertyKey, never>
        Returns: {
          tbl_name: string
          has_required_columns: boolean
          has_proper_indexes: boolean
          rls_enabled: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

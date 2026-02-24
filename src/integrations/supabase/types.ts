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
      adventure_bestiary: {
        Row: {
          adventure_id: string
          challenge_rating: string
          created_at: string
          id: string
          monster_data: Json
          name: string
        }
        Insert: {
          adventure_id: string
          challenge_rating?: string
          created_at?: string
          id?: string
          monster_data: Json
          name: string
        }
        Update: {
          adventure_id?: string
          challenge_rating?: string
          created_at?: string
          id?: string
          monster_data?: Json
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "adventure_bestiary_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_characters: {
        Row: {
          adventure_id: string
          character_id: string
          id: string
          joined_at: string
        }
        Insert: {
          adventure_id: string
          character_id: string
          id?: string
          joined_at?: string
        }
        Update: {
          adventure_id?: string
          character_id?: string
          id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adventure_characters_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_characters_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_maps: {
        Row: {
          adventure_id: string
          created_at: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          adventure_id: string
          created_at?: string
          id?: string
          image_url: string
          name: string
        }
        Update: {
          adventure_id?: string
          created_at?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "adventure_maps_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      adventures: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          progress: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          progress?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          progress?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          ability_trackers: Json | null
          adventure_notes: string | null
          armor_ac: number | null
          armor_equip_states: Json | null
          attribute_method: string | null
          background_ability_bonuses: Json | null
          background_name: string | null
          background_story: string | null
          base_abilities: Json | null
          classes: Json | null
          coins: Json | null
          created_at: string
          current_hp: number | null
          custom_attacks: Json | null
          custom_equipment: Json | null
          death_saves: Json | null
          equipped_armor: string | null
          equipped_shield: string | null
          equipped_weapons: string[] | null
          feat_ability_bonuses: Json | null
          feat_selections: Json | null
          feats: string[] | null
          id: string
          image_url: string | null
          inventory: string | null
          is_public: boolean | null
          level: number
          name: string
          prepared_spells: string[] | null
          race_name: string | null
          race_options: Json | null
          selected_equipment: string[] | null
          share_mode: string | null
          shield_ac: number | null
          skill_proficiencies: string[] | null
          spell_slots: Json | null
          spells_known: string[] | null
          temp_hp: number | null
          updated_at: string
          user_id: string | null
          weapon_equip_states: Json | null
        }
        Insert: {
          ability_trackers?: Json | null
          adventure_notes?: string | null
          armor_ac?: number | null
          armor_equip_states?: Json | null
          attribute_method?: string | null
          background_ability_bonuses?: Json | null
          background_name?: string | null
          background_story?: string | null
          base_abilities?: Json | null
          classes?: Json | null
          coins?: Json | null
          created_at?: string
          current_hp?: number | null
          custom_attacks?: Json | null
          custom_equipment?: Json | null
          death_saves?: Json | null
          equipped_armor?: string | null
          equipped_shield?: string | null
          equipped_weapons?: string[] | null
          feat_ability_bonuses?: Json | null
          feat_selections?: Json | null
          feats?: string[] | null
          id?: string
          image_url?: string | null
          inventory?: string | null
          is_public?: boolean | null
          level?: number
          name: string
          prepared_spells?: string[] | null
          race_name?: string | null
          race_options?: Json | null
          selected_equipment?: string[] | null
          share_mode?: string | null
          shield_ac?: number | null
          skill_proficiencies?: string[] | null
          spell_slots?: Json | null
          spells_known?: string[] | null
          temp_hp?: number | null
          updated_at?: string
          user_id?: string | null
          weapon_equip_states?: Json | null
        }
        Update: {
          ability_trackers?: Json | null
          adventure_notes?: string | null
          armor_ac?: number | null
          armor_equip_states?: Json | null
          attribute_method?: string | null
          background_ability_bonuses?: Json | null
          background_name?: string | null
          background_story?: string | null
          base_abilities?: Json | null
          classes?: Json | null
          coins?: Json | null
          created_at?: string
          current_hp?: number | null
          custom_attacks?: Json | null
          custom_equipment?: Json | null
          death_saves?: Json | null
          equipped_armor?: string | null
          equipped_shield?: string | null
          equipped_weapons?: string[] | null
          feat_ability_bonuses?: Json | null
          feat_selections?: Json | null
          feats?: string[] | null
          id?: string
          image_url?: string | null
          inventory?: string | null
          is_public?: boolean | null
          level?: number
          name?: string
          prepared_spells?: string[] | null
          race_name?: string | null
          race_options?: Json | null
          selected_equipment?: string[] | null
          share_mode?: string | null
          shield_ac?: number | null
          skill_proficiencies?: string[] | null
          spell_slots?: Json | null
          spells_known?: string[] | null
          temp_hp?: number | null
          updated_at?: string
          user_id?: string | null
          weapon_equip_states?: Json | null
        }
        Relationships: []
      }
      dm_notes: {
        Row: {
          adventure_id: string
          content: string | null
          created_at: string
          id: string
          title: string
        }
        Insert: {
          adventure_id: string
          content?: string | null
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          adventure_id?: string
          content?: string | null
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_notes_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          theme: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          theme?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      rumors_sidequests: {
        Row: {
          adventure_id: string
          created_at: string
          description: string | null
          id: string
          quest_type: string
          title: string
        }
        Insert: {
          adventure_id: string
          created_at?: string
          description?: string | null
          id?: string
          quest_type?: string
          title: string
        }
        Update: {
          adventure_id?: string
          created_at?: string
          description?: string | null
          id?: string
          quest_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rumors_sidequests_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_locations: {
        Row: {
          adventure_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          adventure_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          adventure_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_locations_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
        ]
      }
      session_summaries: {
        Row: {
          adventure_id: string
          created_at: string
          description: string | null
          id: string
          session_date: string
          title: string
        }
        Insert: {
          adventure_id: string
          created_at?: string
          description?: string | null
          id?: string
          session_date?: string
          title: string
        }
        Update: {
          adventure_id?: string
          created_at?: string
          description?: string | null
          id?: string
          session_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_summaries_adventure_id_fkey"
            columns: ["adventure_id"]
            isOneToOne: false
            referencedRelation: "adventures"
            referencedColumns: ["id"]
          },
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

// Hand-written to match supabase/migrations/*.sql.
// Once the project is linked to a real Supabase instance, regenerate with:
//   supabase gen types typescript --project-id <id> > src/lib/database.types.ts

export type Verdict = "true" | "mixed" | "false" | "unverified";
export type Confidence = "low" | "medium" | "high";
export type SubjectType = "person" | "promise" | "event" | "topic";
export type ChangeType = "progress" | "delay" | "cancel" | "new_info";
export type EntityType = "politician" | "company" | "ngo" | "govt";
export type Stance = "support" | "contradict" | "context";

type TableOf<Row, InsertExtra extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, InsertExtra>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      sources: TableOf<
        {
          id: string;
          name: string;
          domain: string | null;
          credibility_score: number | null;
          bias_lean: string | null;
          region: string | null;
          verified: boolean;
          created_at: string;
        },
        "name"
      >;
      articles: TableOf<
        {
          id: string;
          title: string;
          body: string | null;
          url: string | null;
          source_id: string | null;
          category: string | null;
          published_at: string | null;
          image_url: string | null;
          created_at: string;
        },
        "title"
      >;
      claims: TableOf<
        {
          id: string;
          article_id: string | null;
          submitted_by: string | null;
          text: string;
          created_at: string;
        },
        "text"
      >;
      evidence: TableOf<
        {
          id: string;
          claim_id: string;
          source_id: string | null;
          snippet: string | null;
          stance: Stance | null;
          url: string | null;
          retrieved_at: string;
        },
        "claim_id"
      >;
      fact_checks: TableOf<
        {
          id: string;
          claim_id: string;
          truth_score: number | null;
          confidence: Confidence | null;
          verdict: Verdict | null;
          explanation: string | null;
          methodology_version: string;
          created_at: string;
        },
        "claim_id"
      >;
      watchlists: TableOf<
        {
          id: string;
          user_id: string;
          subject_type: SubjectType | null;
          subject_ref: string;
          status: string;
          created_at: string;
        },
        "user_id" | "subject_ref"
      >;
      timeline_events: TableOf<
        {
          id: string;
          watchlist_id: string;
          event_date: string;
          summary: string;
          source_url: string | null;
          change_type: ChangeType | null;
          created_at: string;
        },
        "watchlist_id" | "event_date" | "summary"
      >;
      promises: TableOf<
        {
          id: string;
          entity_name: string;
          entity_type: EntityType | null;
          statement: string;
          made_on: string | null;
          category: string | null;
          status: string;
          completion_pct: number | null;
          created_at: string;
        },
        "entity_name" | "statement"
      >;
      promise_updates: TableOf<
        {
          id: string;
          promise_id: string;
          update_text: string;
          evidence_url: string | null;
          new_status: string | null;
          updated_at: string;
        },
        "promise_id" | "update_text"
      >;
      notifications: TableOf<
        {
          id: string;
          user_id: string;
          type: string;
          payload: Record<string, unknown> | null;
          read: boolean;
          created_at: string;
        },
        "user_id" | "type"
      >;
      bookmarks: TableOf<
        {
          id: string;
          user_id: string;
          article_id: string | null;
          created_at: string;
        },
        "user_id"
      >;
      profiles: TableOf<
        {
          id: string;
          display_name: string | null;
          interests: string[];
          meme_mode: boolean;
          created_at: string;
        },
        "id"
      >;
    };
    Views: {
      feed_items: {
        Row: {
          id: string;
          category: string | null;
          title: string;
          summary: string | null;
          published_at: string | null;
          truth_score: number | null;
          confidence: Confidence | null;
          verdict: Verdict | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
}

// Convenience shape used by Feed components: an article joined with its
// latest fact-check, which is what the FeedCard component renders.
export interface FeedItem {
  id: string;
  category: string | null;
  title: string;
  summary: string | null;
  truthScore: number | null;
  confidence: Confidence | null;
  verdict: Verdict | null;
  isWatched: boolean;
  imageUrl?: string | null;
}

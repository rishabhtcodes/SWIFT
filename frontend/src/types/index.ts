export interface Model {
  id: string;
  provider: string;
  model_id: string;
  display_name: string | null;
  capabilities: string[];
  context_window: number;
  input_cost_per_1m: number;
  output_cost_per_1m: number;
  latency_ms: number | null;
  is_enabled: boolean;
  priority: number;
  fallback_model_id: string | null;
  health_status: string;
  last_checked_at: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

// Profile data types
export interface Profile {
  created_at: string;
  last_updated: string;
  basic_info: {
    height: number;
    height_unit: string;
    weight: number;
    weight_unit: string;
    birth_date: string;
  };
  calculated: {
    age: number;
    age_years: number;
    bmi: number;
    bmi_status: string;
    body_surface_area: number;
    bsa_unit: string;
  };
  history: WeightHistory[];
}

export interface WeightHistory {
  date: string;
  weight: number;
  bmi: number;
  notes: string;
}

// Lab test types
export interface LabTest {
  id: string;
  type: string;
  date: string;
  hospital?: string;
  department?: string;
  items: LabTestItem[];
  notes?: string;
  doctor_advice?: string;
}

export interface LabTestItem {
  name: string;
  value: number;
  unit: string;
  min_ref: number;
  max_ref: number;
  is_abnormal: boolean;
  abnormal_type?: "high" | "low";
  clinical_significance?: string;
}

// Allergy types
export interface AllergyData {
  allergies: Allergy[];
}

export interface Allergy {
  allergen: string;
  category: "drug" | "food" | "environmental";
  severity: "mild" | "moderate" | "severe";
  severity_level: number;
  symptoms: string[];
  onset_date: string;
  last_occurrence: string;
  confirmed_by: string;
  notes?: string;
}

// Reminder types
export interface ReminderData {
  reminders: Reminder[];
  user_settings: {
    notification_enabled: boolean;
    notification_methods: string[];
    default_reminder_time: string;
  };
}

export interface Reminder {
  id: string;
  type: "screening" | "vaccine" | "medication" | "checkup";
  title: string;
  description: string;
  due_date: string;
  status: "pending" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  recurring?: {
    frequency: string;
    interval: number;
  };
}

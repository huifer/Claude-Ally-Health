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

// Radiation records types
export interface RadiationRecord {
  id: string;
  date: string;
  exam_type: string;
  body_part: string;
  indication: string;
  findings: string[];
  effective_dose: number;
  dose_unit: string;
  hospital: string;
  radiologist: string;
  notes: string;
}

export interface RadiationStatistics {
  total_records: number;
  total_cumulative_dose_msv: number;
  average_annual_dose_msv: number;
  exams_this_year: number;
  current_year_dose_msv: number;
  highest_single_dose_msv: number;
  highest_dose_exam: string;
  radiation_free_exams: number;
  years_of_tracking: number;
  exams_by_type: Record<string, number>;
  annual_dose_history: Array<{
    year: number;
    dose_msv: number;
    exams: number;
  }>;
  radiation_safety_note?: string;
  last_updated: string;
}

export interface RadiationData {
  created_at: string;
  last_updated: string;
  records: RadiationRecord[];
  statistics: RadiationStatistics;
}

// Women's health - Cycle tracking types
export interface CycleDailyLog {
  date: string;
  cycle_day: number;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  symptoms?: string[];
  mood?: string;
  energy_level?: number;
  flow?: 'light' | 'medium' | 'heavy';
  basal_temp?: number;
}

export interface Cycle {
  id: string;
  period_start: string;
  period_end: string;
  cycle_start_date: string;
  cycle_end_date: string;
  cycle_length: number;
  period_length: number;
  flow_pattern: 'light' | 'medium' | 'heavy';
  ovulation_date: string;
  daily_logs?: CycleDailyLog[];
}

export interface CycleTrackerData {
  created_at: string;
  last_updated: string;
  user_settings: {
    average_cycle_length: number;
    average_period_length: number;
    pregnancy_planning: boolean;
  };
  cycles: Cycle[];
  current_cycle: string;
  predictions: {
    next_period: string;
    next_period_confidence: number;
    fertile_window_start: string;
    fertile_window_end: string;
    ovulation_date: string;
    prediction_confidence: number;
  };
  statistics: {
    total_cycles_tracked: number;
    average_cycle_length: number;
    cycle_length_range: [number, number];
    average_period_length: number;
    most_common_symptoms: {
      luteal: string[];
      follicular: string[];
      ovulation: string[];
      menstrual: string[];
    };
    regularity_score: number;
    last_updated: string;
  };
}

// Menopause tracking types
export interface MenopauseSymptomLog {
  date: string;
  hot_flashes?: {
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
    frequency: number;
  };
  night_sweats?: {
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
  };
  mood_changes?: {
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
  };
  sleep_disturbance?: {
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
  };
  notes?: string;
}

export interface MenopauseTrackerData {
  created_at: string;
  last_updated: string;
  menopause_tracking: boolean;
  stage: string;
  symptoms_log: MenopauseSymptomLog[];
  statistics: {
    tracking_duration_months: number;
    total_symptom_records: number;
    health_score: number;
  };
}

// Pregnancy tracking types
export interface PregnancyCheckup {
  week: number;
  date: string;
  weight: number;
  blood_pressure?: string;
  fetal_heart_rate?: number;
  findings: string[];
}

export interface PregnancyMedication {
  name: string;
  dosage: string;
  start_week: number;
  end_week: number;
  indication: string;
}

export interface Pregnancy {
  id: string;
  start_date: string;
  end_date: string;
  outcome: string;
  delivery_date: string;
  gestational_age_at_delivery: string;
  delivery_method: string;
  baby_weight: number;
  baby_gender?: string;
  apgar_score?: string;
  checkups: PregnancyCheckup[];
  medications: PregnancyMedication[];
  complications?: string[];
}

export interface PregnancyTrackerData {
  created_at: string;
  last_updated: string;
  pregnancies: Pregnancy[];
  current_pregnancy: string | null;
  planning: {
    planning_pregnancy: boolean;
  };
  statistics: {
    total_pregnancies: number;
    live_births: number;
  };
}

// Medication types
export interface Medication {
  id: string;
  name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  timing: string;
  start_date: string;
  active: boolean;
  adherence?: number;
  prescribing_doctor?: string;
  hospital?: string;
  indication?: string;
  notes?: string;
  end_date?: string;
}

export interface MedicationLog {
  date: string;
  taken: boolean;
  time: string | null;
  reason?: string;
}

export interface MedicationPlan {
  created_at: string;
  last_updated: string;
  current_medications: Medication[];
  medication_history: Medication[];
  reminders: Array<{
    id: string;
    medication_id: string;
    time: string;
    frequency: string;
    enabled: boolean;
  }>;
  statistics: {
    total_current_medications: number;
    average_adherence: number;
    total_medications_taken: number;
    most_common_timing: string;
  };
}

export interface MedicationLogs {
  created_at: string;
  last_updated: string;
  adherence_logs: Array<{
    medication_id: string;
    medication_name: string;
    logs: MedicationLog[];
  }>;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'contraindicated' | 'severe' | 'moderate' | 'mild';
  mechanism: string;
  clinical_effects: string;
  recommendations: string;
}

export interface DrugInteractionDatabase {
  version: string;
  last_updated: string;
  interactions: DrugInteraction[];
}

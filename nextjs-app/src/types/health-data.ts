// Profile Data
export interface Profile {
  created_at: string | null;
  last_updated: string | null;
  basic_info: {
    height: number | null;
    height_unit: string;
    weight: number | null;
    weight_unit: string;
    birth_date: string | null;
  };
  calculated: {
    age: number | null;
    age_years: number | null;
    bmi: number | null;
    bmi_status: string | null;
    body_surface_area: number | null;
    bsa_unit: string;
  };
  history: Array<{
    date: string;
    weight: number;
    bmi: number;
  }>;
}

// Allergy Records
export interface AllergyRecord {
  allergies: Array<{
    allergen: string;
    category: string;
    severity: number;
    reaction_type: string;
    symptoms: string[];
    onset_date?: string;
    last_occurrence?: string;
  }>;
  statistics: {
    total_allergies: number;
    active_allergies: number;
    drug_allergies: number;
    food_allergies: number;
    environmental_allergies: number;
    other_allergies: number;
    severe_count: number;
    anaphylaxis_count: number;
    last_updated: string | null;
  };
}

// Cycle Tracker
export interface CycleTracker {
  created_at: string | null;
  last_updated: string | null;
  user_settings: {
    average_cycle_length: number;
    average_period_length: number;
    pregnancy_planning: boolean;
  };
  cycles: Array<{
    id: string;
    period_start: string;
    period_end: string;
    cycle_length: number;
    period_length: number;
    flow_pattern?: Record<string, string>;
    daily_logs?: Array<{
      date: string;
      cycle_day: number;
      phase: string;
      flow?: {
        intensity: string;
        description: string;
      };
      symptoms?: string[];
      mood?: string;
      energy_level?: string;
    }>;
  }>;
  current_cycle: string | null;
  statistics: {
    total_cycles_tracked: number;
    average_cycle_length: number | null;
    cycle_length_range: number[];
    average_period_length: number | null;
    regularity_score: number | null;
  };
}

// Pregnancy Tracker
export interface PregnancyTracker {
  created_at: string | null;
  last_updated: string | null;
  current_pregnancy: {
    start_date: string;
    due_date: string;
    current_week: number;
    checkups: Array<{
      date: string;
      week: number;
      results: any;
    }>;
  } | null;
  pregnancy_history: Array<{
    start_date: string;
    end_date: string;
    outcome: string;
    notes?: string;
  }>;
  statistics: {
    total_pregnancies: number;
    current_pregnancy_week: number | null;
    total_weight_gain: number | null;
    checkups_completed: number;
  };
}

// Menopause Tracker
export interface MenopauseTracker {
  created_at: string | null;
  last_updated: string | null;
  menopause_tracking: {
    start_date: string;
    symptoms: Array<{
      date: string;
      symptom: string;
      severity: string;
    }>;
  } | null;
  statistics: {
    tracking_duration_months: number;
    total_symptom_records: number;
    symptom_trend: string;
    hrt_use: boolean;
    bone_density_tests: number;
  };
}

// Screening Tracker
export interface ScreeningTracker {
  created_at: string | null;
  last_updated: string | null;
  cancer_screening: {
    cervical: Array<{
      date: string;
      result: string;
      hpv_result?: string;
    }>;
    breast: Array<{
      date: string;
      result: string;
      methodology: string;
    }>;
    colon: Array<{
      date: string;
      result: string;
      methodology: string;
    }>;
  } | null;
  statistics: {
    total_cervical_screenings: number;
    years_of_screening: number;
    abnormal_results_count: number;
    screening_uptodate: boolean;
    next_screening_due: string | null;
  };
}

// Lab Results
export interface LabResult {
  id: string;
  type: string;
  date: string;
  hospital: string;
  department: string;
  items: Array<{
    name: string;
    value: string;
    unit: string;
    min_ref: string;
    max_ref: string;
    is_abnormal: boolean;
    abnormal_marker?: string;
  }>;
  summary?: {
    total_items: number;
    abnormal_count: number;
    abnormal_items: string[];
  };
}

// Vaccination Records
export interface VaccinationRecords {
  created_at: string | null;
  last_updated: string | null;
  vaccination_records: Array<{
    id: string;
    vaccine_name: string;
    dose_number: number | null;
    administration_date: string;
    next_due_date?: string;
    adverse_reactions?: string[];
    notes?: string;
  }>;
  statistics: {
    total_vaccination_records: number;
    total_doses_administered: number;
    series_completed: number;
    series_in_progress: number;
    overdue_count: number;
    upcoming_30_days: number;
  };
}

// Radiation Records
export interface RadiationRecords {
  created_at: string | null;
  last_updated: string | null;
  records: Array<{
    id: string;
    date: string;
    exam_type: string;
    body_part: string;
    effective_dose: number;
    dose_unit: string;
  }>;
  statistics: {
    total_records: number;
    total_dose: number;
    current_year_dose: number;
    effective_dose: number;
  };
}

// Drug Interactions Database
export interface InteractionDatabase {
  version: string;
  created_at: string;
  interactions: Array<{
    id: string;
    type: string;
    drugs: Array<{
      name: string;
      generic_name: string;
      category: string;
    }>;
    severity: {
      level: string;
      level_name: string;
      level_code: number;
      color: string;
    };
    recommendations: string[];
    management: {
      action: string;
      monitoring: string[];
    };
  }>;
}

// Comprehensive Health Data
export interface HealthData {
  profile: Profile;
  allergies: AllergyRecord;
  cycleTracker: CycleTracker;
  pregnancyTracker: PregnancyTracker;
  menopauseTracker: MenopauseTracker;
  screeningTracker: ScreeningTracker;
  labResults: LabResult[];
  vaccinations: VaccinationRecords;
  radiationRecords: RadiationRecords;
  interactions: InteractionDatabase;
  reminders: Reminders;
}

// Reminders
export interface Reminders {
  created_at: string | null;
  last_updated: string | null;
  reminders: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    frequency: string;
    time?: string;
    date?: string;
    hospital?: string;
    active: boolean;
    next_reminder: string;
    notes?: string;
  }>;
  statistics: {
    total_reminders: number;
    active_reminders: number;
    upcoming_7_days: number;
    overdue_count: number;
    completion_rate: number;
    last_updated: string | null;
  };
}

// Data Query Options
export interface DataQueryOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  focusAreas?: string[];
}

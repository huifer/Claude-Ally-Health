import fs from 'fs';
import path from 'path';
import {
  HealthData,
  Profile,
  AllergyRecord,
  CycleTracker,
  PregnancyTracker,
  MenopauseTracker,
  ScreeningTracker,
  LabResult,
  VaccinationRecords,
  RadiationRecords,
  InteractionDatabase,
  Reminders,
  DataQueryOptions
} from '@/types/health-data';

// Path to data-example directory (parent of nextjs-app)
const DATA_BASE_DIR = path.join(process.cwd(), '../data-example');

/**
 * Read all health data from data-example directory
 */
export async function readAllHealthData(
  options: DataQueryOptions = {}
): Promise<Partial<HealthData>> {
  const data: Partial<HealthData> = {};

  try {
    // Read profile
    data.profile = await readJSONFile<Profile>('profile.json');

    // Read allergies
    data.allergies = await readJSONFile<AllergyRecord>('allergies.json');

    // Read cycle tracker
    data.cycleTracker = await readJSONFile<CycleTracker>('cycle-tracker.json');

    // Read pregnancy tracker
    data.pregnancyTracker = await readJSONFile<PregnancyTracker>('pregnancy-tracker.json');

    // Read menopause tracker
    data.menopauseTracker = await readJSONFile<MenopauseTracker>('menopause-tracker.json');

    // Read screening tracker
    data.screeningTracker = await readJSONFile<ScreeningTracker>('screening-tracker.json');

    // Read lab results
    data.labResults = await readLabResults();

    // Read vaccinations
    data.vaccinations = await readJSONFile<VaccinationRecords>('vaccinations.json');

    // Read radiation records
    data.radiationRecords = await readJSONFile<RadiationRecords>('radiation-records.json');

    // Read interactions database
    data.interactions = await readJSONFile<InteractionDatabase>('interactions/interaction-db.json');

    // Read reminders
    data.reminders = await readJSONFile<Reminders>('reminders.json');

    return data;
  } catch (error) {
    console.error('Error reading health data:', error);
    throw error;
  }
}

/**
 * Read a single JSON file from data-example
 */
async function readJSONFile<T>(relativePath: string): Promise<T> {
  const fullPath = path.join(DATA_BASE_DIR, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${relativePath}, returning empty data`);
    return {} as T;
  }

  const content = await fs.promises.readFile(fullPath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * Read all lab results from subdirectories
 */
async function readLabResults(): Promise<LabResult[]> {
  const results: LabResult[] = [];

  // Check both possible paths (data-example and data directories)
  const labDirs = [
    path.join(DATA_BASE_DIR, '生化检查'),
    path.join(process.cwd(), '../data/生化检查')
  ];

  for (const labDir of labDirs) {
    if (!fs.existsSync(labDir)) {
      continue;
    }

    const years = await fs.promises.readdir(labDir, { withFileTypes: true });

    for (const year of years) {
      if (!year.isDirectory()) continue;

      const yearPath = path.join(labDir, year.name);
      const files = await fs.promises.readdir(yearPath, { withFileTypes: true });

      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.json')) {
          try {
            const filePath = path.join(yearPath, file.name);
            const content = await fs.promises.readFile(filePath, 'utf-8');
            results.push(JSON.parse(content));
          } catch (error) {
            console.error(`Error reading lab result file ${file.name}:`, error);
          }
        }
      }
    }
  }

  return results;
}

/**
 * Get list of all data files available
 */
export async function getDataFilesList(): Promise<string[]> {
  const files: string[] = [];

  async function walkDir(dir: string, baseDir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        await walkDir(fullPath, baseDir);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(relativePath);
      }
    }
  }

  await walkDir(DATA_BASE_DIR, DATA_BASE_DIR);
  return files;
}

/**
 * Filter data by date range
 */
export function filterByDateRange<T extends { date?: string }>(
  data: T[],
  dateRange: { start: string; end: string }
): T[] {
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);

  return data.filter(item => {
    if (!item.date) return false;
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

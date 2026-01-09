# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Personal Health Information System (HIS)** built as a CLI tool using Claude Code Slash Commands. The system provides medical health record management, multi-disciplinary consultation (MDT), and health data visualization through two components:

1. **CLI-based HIS System** (root directory) - Slash commands for health data management
2. **Admin Dashboard** (admin-dashboard/) - Next.js web interface for data visualization

## Core Commands

### Development Commands

**For the CLI system (root):**
```bash
# No build process - uses Claude Code slash commands directly
# Commands are in .claude/commands/ directory

# Generate health reports (Python script)
python scripts/generate_health_report.py comprehensive
python scripts/generate_emergency_card.py
```

**For the admin dashboard:**
```bash
cd admin-dashboard
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
# Run test scripts for thinking/analysis modules
node scripts/test-lab-interpretation.js
node scripts/test-risk-assessment.js
node scripts/test-symptom-analysis.js
```

## High-Level Architecture

### Data Storage Model

The system uses **JSON files + filesystem directory structure** with NO external database:

```
data/
├── profile.json              # User basic info (height, weight, BMI, etc.)
├── index.json                # Global index for fast queries
├── radiation-records.json    # Medical radiation exposure tracking
├── allergies.json            # Allergy history
├── chronic-diseases.json     # Chronic disease management
├── 生化检查/                  # Biochemical test results (by date)
├── 影像检查/                  # Imaging test results
├── medications/              # Medication plans
├── medication-logs/          # Medication adherence logs
├── vital-signs-logs/         # Blood pressure, glucose, etc.
├── screening-tracker.json    # Cancer screening records
├── pregnancy-tracker.json    # Pregnancy monitoring
├── cycle-tracker.json        # Menstrual cycle tracking
└── menopause-tracker.json    # Menopause symptom tracking
```

**Key Design Principle:** All data is stored locally, never uploaded to cloud. Complete privacy by design.

### Command System Architecture

**Claude Code Slash Commands** (`.claude/commands/`):

Each command is a Markdown file that defines:
- Input parameters and parsing
- Data processing logic
- Output format
- Integration with data files

**Key Commands:**
- `/profile` - Set/view user basic parameters (height, weight, birthdate)
- `/save-report` - OCR and parse medical test reports from images
- `/query` - Query health records by type/date
- `/consult` - Multi-disciplinary team consultation (MDT)
- `/specialist` - Single specialist consultation
- `/medication` - Medication management and interaction checking
- `/radiation` - Medical radiation dose tracking
- `/symptom` - Record and analyze symptoms
- `/allergy` - Manage allergy history
- `/vaccine` - Vaccination records
- `/report` - Generate comprehensive HTML health report

### Multi-Disciplinary Consultation (MDT) System

**Specialist Architecture** (`.claude/specialists/`):

13 medical specialists + 1 coordinator:
- `cardiology.md` - Cardiology (heart, blood pressure, lipids)
- `endocrinology.md` - Endocrinology (diabetes, thyroid)
- `gastroenterology.md` - Gastroenterology (liver, digestive)
- `nephrology.md` - Nephrology (kidney, electrolytes)
- `hematology.md` - Hematology (anemia, coagulation)
- `respiratory.md` - Respiratory (lungs, infections)
- `neurology.md` - Neurology (brain, headaches)
- `oncology.md` - Oncology (tumor markers)
- `orthopedics.md` - Orthopedics (bones, joints)
- `dermatology.md` - Dermatology (skin conditions)
- `pediatrics.md` - Pediatrics (children, **age-specific reference values**)
- `gynecology.md` - Gynecology (women's health)
- `psychiatry.md` - Psychiatry (mental health)
- `general.md` - General practice (coordinator)

**Workflow:**
```
/consult command
    ↓
Identify abnormal indicators
    ↓
Determine which specialists to involve
    ↓
Parallel specialist subagent analysis
    ↓
Consultation coordinator synthesizes opinions
    ↓
Generate comprehensive report with prioritized recommendations
```

### Admin Dashboard (Next.js)

**Tech Stack:**
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4.1.18
- Ant Design 6.1.4
- Recharts 3.6.0 (data visualization)

**Architecture:**
```
admin-dashboard/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with sidebar/header
│   ├── page.tsx             # Dashboard home
│   ├── profile/             # User profile pages
│   ├── lab-tests/           # Lab test viewing
│   └── womens-health/       # Women's health features
├── components/
│   ├── ui/                  # Ant Design + shadcn/ui components
│   ├── layout/              # Sidebar, Header, MobileNav
│   └── dashboard/           # Dashboard-specific components
└── lib/
    └── data/                # JSON data loading from parent ../data
```

**Data Loading:** Dashboard reads from `../data` (real data) or `../data-example` for development.

## Critical Safety Principles

**Medical Safety Red Lines (NEVER VIOLATE):**

1. **NEVER prescribe specific medication dosages**
   - ❌ "Take atorvastatin 20mg"
   - ✅ "Consult doctor about lipid-lowering medication"

2. **NEVER directly prescribe prescription drugs**
   - ❌ "Prescribe aspirin enteric-coated tablets"
   - ✅ "Consult doctor if antiplatelet therapy is needed"

3. **NEVER predict life prognosis**
   - ❌ "Poor prognosis, short survival time"
   - ✅ "Recommend active treatment, regular follow-up"

4. **NEVER replace doctor diagnosis**
   - ❌ "Diagnosed as coronary heart disease"
   - ✅ "Possible coronary heart disease risk, recommend cardiology evaluation"

**Allowed Capabilities:**
- Interpret clinical significance of test indicators
- Identify abnormal indicators and potential risks
- Provide lifestyle and dietary recommendations
- Recommend targeted screening items
- Assist in developing follow-up plans
- Synthesize multi-disciplinary opinions

**All reports must include:**
```
⚠️ 重要声明
- 本系统所有分析报告仅供参考
- 不作为医疗诊断依据
- 所有诊疗决策需咨询专业医生
- 如有紧急情况，请立即就医
```

## Key Data Structures

### Profile Data
```typescript
{
  created_at: string;           // ISO timestamp
  last_updated: string;
  basic_info: {
    height: number;             // cm
    weight: number;             // kg
    birth_date: string;         // YYYY-MM-DD
  };
  calculated: {
    age: number;
    bmi: number;
    bmi_status: string;         // "正常" | "超重" | "肥胖"
    body_surface_area: number;  // m² (for radiation dose calc)
  };
  history: Array<{             // Weight history
    date: string;
    weight: number;
    bmi: number;
    notes: string;
  }>;
}
```

### Lab Test Data
```typescript
{
  id: string;                  // "BLOOD_20251215"
  type: string;                // "血常规" | "生化全项"
  date: string;                // YYYY-MM-DD
  hospital?: string;
  items: Array<{
    name: string;              // "白细胞计数"
    value: number;
    unit: string;              // "×10^9/L"
    min_ref: number;
    max_ref: number;
    is_abnormal: boolean;
    abnormal_type?: "high" | "low";
    clinical_significance?: string;
  }>;
}
```

### Radiation Records
```typescript
{
  records: Array<{
    date: string;
    type: string;              // "CT" | "X光" | "PET-CT"
    site: string;              // "胸部" | "腹部"
    dose_msv: number;          // Adjusted for body surface area
    base_dose_msv: number;     // Standard dose
  }>;
  cumulative: {
    this_year: number;
    total: number;
  };
}
```

## Important Implementation Notes

### Radiation Dose Calculation
- Uses Mosteller formula for Body Surface Area (BSA)
- Dose adjusted by BSA: `adjusted_dose = base_dose × (user_BSA / 1.73)`
- Previous year radiation decays at 50%/year
- Safety thresholds based on ICRP guidelines

### Age-Specific Reference Values
**CRITICAL for pediatrics:** Lab test reference ranges vary by age and gender. Always use age-appropriate ranges when analyzing pediatric data.

### Medical Report OCR
- Uses AI vision models to extract text from medical report images
- Automatically distinguishes between biochemical and imaging tests
- Validates extracted data against expected formats
- Preserves original images as backup

### Drug Interaction Database
- Located in: `docs/drug-interaction-database.md`
- Checks for drug-drug interactions
- Categorized by severity (contraindicated, severe, moderate, mild)
- Includes mechanism and clinical recommendations

### Women's Health Features
- **Pregnancy tracking:** Due date calculation, prenatal care schedule
- **Menstrual cycle:** Calendar view, ovulation prediction
- **Menopause:** Symptom tracking (Greyscale scale)
- **Screening:** Cancer screening (HPV, TCT, mammography, tumor markers)

## Common Tasks

### Adding a New Specialist
1. Create `.claude/specialists/new-specialty.md`
2. Define role, focus areas, safety principles
3. Add to consultation coordinator mapping
4. Update specialist codes in `.claude/commands/specialist.md`

### Adding a New Health Tracking Command
1. Create `.claude/commands/new-command.md`
2. Define data structure in `data/`
3. Update `data/index.json` if needed
4. Add to user guide in `docs/user-guide.md`

### Extending Admin Dashboard
1. Add route in `admin-dashboard/app/`
2. Create components in `admin-dashboard/components/`
3. Add data loader in `admin-dashboard/lib/data/loader.ts`
4. Update sidebar navigation

## File Organization Patterns

### Command Files
- Name: `{feature}.md`
- Location: `.claude/commands/`
- Structure: Purpose → Parameters → Examples → Notes

### Specialist Files
- Name: `{specialty}.md`
- Location: `.claude/specialists/`
- Structure: Role → Focus → Safety → Output Format

### Data Files
- JSON format, UTF-8 encoded
- Organized by type and date
- Chinese directory names for user clarity
- Index file for fast queries

## Development Workflow

1. **Modify command/specialist definition** → Test with Claude Code
2. **Update data structures** → Verify backward compatibility
3. **Add dashboard features** → Test with `npm run dev`
4. **Update documentation** → Keep docs in sync

## Important Files

- `docs/technical-details.md` - System architecture
- `docs/user-guide.md` - User instructions
- `docs/safety-guidelines.md` - Medical safety principles
- `todo/implementation-roadmap.md` - Feature development roadmap
- `.claude/specialists/README.md` - Specialist system guide
- `scripts/README.md` - Python scripts documentation

## Language and Localization

- **Primary language:** Chinese (Simplified)
- UI labels in Chinese
- Data directory names in Chinese for user accessibility
- Code comments and documentation in Chinese
- Maintain consistent terminology across commands

## External Dependencies

- **No external API calls** for core functionality
- AI vision models for OCR (Claude's built-in capabilities)
- Python 3.6+ for report generation scripts
- Node.js 18+ for admin dashboard

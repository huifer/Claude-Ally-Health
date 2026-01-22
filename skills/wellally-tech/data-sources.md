# External Data Sources Documentation

This document describes the various external health data sources supported by the wellally-tech skill and their integration methods.

## Table of Contents

- [Apple Health](#apple-health)
- [Fitbit](#fitbit)
- [Oura Ring](#oura-ring)
- [Generic CSV Import](#generic-csv-import)
- [Generic JSON Import](#generic-json-import)
- [Data Mapping Table](#data-mapping-table)

## Apple Health

### Overview

Apple Health is a built-in health data management app on iOS that can collect data from iPhone, Apple Watch, and third-party health apps.

### Supported Data Types

| Data Type | HealthKit Identifier | Local Mapping File |
|-----------|---------------------|-------------------|
| Steps | HKQuantityTypeIdentifierStepCount | data/fitness/activities.json |
| Weight | HKQuantityTypeIdentifierBodyMass | data/profile.json |
| Height | HKQuantityTypeIdentifierHeight | data/profile.json |
| Heart Rate | HKQuantityTypeIdentifierHeartRate | data/fitness/heart-rate.json |
| Resting Heart Rate | HKQuantityTypeIdentifierRestingHeartRate | data/fitness/heart-rate.json |
| Walking+Running Distance | HKQuantityTypeIdentifierDistanceWalkingRunning | data/fitness/activities.json |
| Active Energy | HKQuantityTypeIdentifierActiveEnergyBurned | data/fitness/activities.json |
| Basal Energy | HKQuantityTypeIdentifierBasalEnergyBurned | data/fitness/activities.json |
| Sleep Analysis | HKCategoryTypeIdentifierSleepAnalysis | data/sleep/sleep-records.json |
| Blood Oxygen | HKQuantityTypeIdentifierOxygenSaturation | data/medical_records/**/*.json |
| Body Temperature | HKQuantityTypeIdentifierBodyTemperature | data/symptoms/**/*.json |

### Export Format

Apple Health exports data as a **ZIP compressed package** containing:
- `export.xml`: Main health data XML file
- `export_cda.xml`: Medical data (optional)
- Other attachment files

### XML Structure

```xml
<HealthData>
  <ExportDate>2025-01-22</ExportDate>
  <Me>
    <HKCharacteristicTypeIdentifierDateOfBirth>...</HKCharacteristicTypeIdentifierDateOfBirth>
    <HKCharacteristicTypeIdentifierBiologicalSex>...</HKCharacteristicTypeIdentifierBiologicalSex>
    <HKCharacteristicTypeIdentifierBloodType>...</HKCharacteristicTypeIdentifierBloodType>
  </Me>
  <Record type="HKQuantityTypeIdentifierStepCount" 
          sourceName="iPhone" 
          sourceVersion="8.0" 
          unit="count" 
          value="10000" 
          startDate="2025-01-22 08:00:00" 
          endDate="2025-01-22 09:00:00" />
  <!-- More records... -->
</HealthData>
```

### Data Import Workflow

1. **Export Data**: Export from iPhone Health app
2. **Extract**: Unzip the exported ZIP file
3. **Parse XML**: Read the `export.xml` file
4. **Extract Records**: Categorize and extract data by type
5. **Format Conversion**: Convert to local JSON format
6. **Data Validation**: Verify data completeness and validity
7. **Save Files**: Save to appropriate local data files

### Limitations and Considerations

- **File Size**: Exported files can be large (tens of MB to several GB)
- **Parsing Time**: Large files take longer to parse
- **Timezone Handling**: Must properly handle timezone information
- **Data Units**: Pay attention to units used by Apple Health (count, km, kg, etc.)
- **Historical Data**: May contain years of historical data, recommend filtering by date range

## Fitbit

### Overview

Fitbit is a popular fitness tracker brand that provides rich API interfaces for accessing health data.

### Supported Data Types

| Data Type | API Endpoint | Local Mapping File |
|-----------|-------------|-------------------|
| Steps | /activities/steps/date/{date}/1d.json | data/fitness/activities.json |
| Distance | /activities/distance/date/{date}/1d.json | data/fitness/activities.json |
| Active Minutes | /activities/activeMinutes/date/{date}/1d.json | data/fitness/activities.json |
| Calories | /activities/calories/date/{date}/1d.json | data/fitness/activities.json |
| Heart Rate | /activities/heart/date/{date}/1d.json | data/fitness/heart-rate.json |
| Sleep | /sleep/date/{date}.json | data/sleep/sleep-records.json |
| Weight | /body/log/weight/date/{date}/1d.json | data/profile.json |
| BMI | /body/log/bmi/date/{date}/1d.json | data/profile.json |

### API Authentication

Fitbit uses **OAuth 2.0** authentication flow:

1. **Register App**: Register on Fitbit Developer Platform
2. **Get Credentials**: Get CLIENT_ID and CLIENT_SECRET
3. **User Authorization**: Redirect user to authorization page
4. **Get Token**: Exchange authorization code for access token
5. **Refresh Token**: Periodically refresh using refresh token

### API Request Example

```bash
# Get today's steps
curl -X GET "https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json" \
     -H "Authorization: Bearer {access_token}"

# Get heart rate data
curl -X GET "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json" \
     -H "Authorization: Bearer {access_token}"

# Get sleep data
curl -X GET "https://api.fitbit.com/1.2/user/-/sleep/date/today.json" \
     -H "Authorization: Bearer {access_token}"
```

### Data Conversion Example

**Fitbit API Response**:
```json
{
  "activities-steps": [
    {
      "dateTime": "2025-01-22",
      "value": "8432"
    }
  ]
}
```

**Local JSON Format**:
```json
{
  "date": "2025-01-22",
  "steps": 8432,
  "source": "Fitbit",
  "device": "Fitbit Charge 5",
  "created_at": "2025-01-22T23:59:59Z"
}
```

### CSV Export Format

Fitbit users can also export data in CSV format from the website:

| Filename | Content |
|----------|---------|
| Steps.csv | Step records |
| Distance.csv | Distance records |
| Weight.csv | Weight records |
| Sleep.csv | Sleep records |
| Heart Rate.csv | Heart rate records |

### Limitations and Considerations

- **API Limits**: Fitbit API has rate limits (150 requests per hour)
- **Token Refresh**: Access token valid for 8 hours, requires periodic refresh
- **Historical Data**: API can only retrieve data for recent period (usually 30 days)
- **User Permissions**: Requires user to grant appropriate permissions
- **Data Granularity**: Some data types may only have daily level data

## Oura Ring

### Overview

Oura Ring is a smart ring device focused on sleep tracking and health monitoring, providing API v2 interface.

### Supported Data Types

| Data Type | API Endpoint | Local Mapping File |
|-----------|-------------|-------------------|
| Sleep | /v2/usercollection/daily_sleep | data/sleep/sleep-records.json |
| Readiness | /v2/usercollection/daily_readiness | data/fitness/recovery.json |
| Activity | /v2/usercollection/daily_activity | data/fitness/activities.json |
| Heart Rate | /v2/usercollection/heartrate | data/fitness/heart-rate.json |
| Personal Info | /v2/usercollection/personal_info | data/profile.json |

### API Authentication

Oura Ring API uses **Personal Access Token** or **OAuth 2.0**:

1. **Register App**: Register on Oura Developer Platform
2. **Get Token**: Generate Personal Access Token or set up OAuth
3. **API Request**: Include Bearer token in request header

### API Request Example

```bash
# Get sleep data
curl -X GET "https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=2025-01-22&end_date=2025-01-22" \
     -H "Authorization: Bearer {access_token}"

# Get readiness score
curl -X GET "https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=2025-01-22&end_date=2025-01-22" \
     -H "Authorization: Bearer {access_token}"
```

### Data Conversion Example

**Oura API Response (Sleep)**:
```json
{
  "data": [
    {
      "timestamp": "2025-01-22T07:00:00+00:00",
      "total_sleep_duration": 32400,
      "sleep_score": 85,
      "rem_sleep_duration": 5400,
      "deep_sleep_duration": 7200,
      "light_sleep_duration": 19800,
      "awake_time": 3600,
      "bedtime_start": "2025-01-21T23:00:00+00:00",
      "bedtime_end": "2025-01-22T07:00:00+00:00"
    }
  ]
}
```

**Local JSON Format**:
```json
{
  "date": "2025-01-22",
  "sleep_duration_hours": 9.0,
  "sleep_score": 85,
  "rem_duration_hours": 1.5,
  "deep_duration_hours": 2.0,
  "light_duration_hours": 5.5,
  "awake_duration_hours": 1.0,
  "bedtime_start": "2025-01-21T23:00:00Z",
  "bedtime_end": "2025-01-22T07:00:00Z",
  "source": "Oura Ring",
  "device": "Oura Ring Gen3"
}
```

### Limitations and Considerations

- **API Limits**: Rate limits apply (specific level depends on subscription)
- **Data Latency**: Data may have a delay of several hours
- **Historical Data**: Available historical data depends on user's subscription plan
- **Precision**: Data is at 1-minute granularity

## Generic CSV Import

### Overview

For health devices or apps without API support, data can be exported as CSV files and then imported.

### CSV Format Requirements

Basic CSV format requirements:

```csv
Date,Steps,Weight (kg),Heart Rate,Sleep (hours)
2025-01-22,8432,70.5,72,7.5
2025-01-21,10234,70.3,75,8.0
2025-01-20,9156,70.4,71,7.2
```

### Field Mapping Configuration

Use JSON configuration file to define field mappings:

```json
{
  "date": "Date",
  "steps": "Steps",
  "weight": "Weight (kg)",
  "heart_rate": "Heart Rate",
  "sleep_duration": "Sleep (hours)"
}
```

### Date Format Support

Supports multiple date formats:
- YYYY-MM-DD: 2025-01-22
- DD/MM/YYYY: 22/01/2025
- MM/DD/YYYY: 01/22/2025
- YYYY-MM-DD HH:MM:SS: 2025-01-22 14:30:00

### Data Validation

During import, the following will be validated:
- **Date Format**: Must be a valid date
- **Numeric Ranges**: Steps, weight, etc. must be within reasonable ranges
- **Missing Values**: Handle empty or invalid values
- **Duplicate Data**: Detect and deduplicate data for the same day

### Limitations and Considerations

- **Encoding Format**: UTF-8 encoding recommended
- **Separator**: Supports comma or semicolon separation
- **Header Row**: Must include header row
- **Date Column**: Must have a date column

## Generic JSON Import

### Overview

Supports importing health data in JSON format for data exported from other applications.

### JSON Format Requirements

Object array format:

```json
[
  {
    "date": "2025-01-22",
    "steps": 8432,
    "weight": 70.5,
    "heart_rate": 72,
    "sleep_hours": 7.5
  },
  {
    "date": "2025-01-21",
    "steps": 10234,
    "weight": 70.3,
    "heart_rate": 75,
    "sleep_hours": 8.0
  }
]
```

### Field Mapping Configuration

```json
{
  "date": "date",
  "steps": "steps",
  "weight": "weight",
  "heart_rate": "heart_rate",
  "sleep_duration": "sleep_hours"
}
```

### Nested JSON Support

Supports nested JSON structures:

```json
[
  {
    "timestamp": "2025-01-22T12:00:00Z",
    "metrics": {
      "steps": 8432,
      "distance_km": 6.5
    }
  }
]
```

Mapping configuration:
```json
{
  "date": "timestamp",
  "steps": "metrics.steps",
  "distance": "metrics.distance_km"
}
```

## Data Mapping Table

### Complete Field Mapping

| Local Field | Apple Health | Fitbit | Oura Ring | Generic |
|-------------|--------------|--------|-----------|---------|
| date | startDate | dateTime | timestamp | date |
| steps | HKQuantityTypeIdentifierStepCount | steps | N/A | steps |
| weight | HKQuantityTypeIdentifierBodyMass | weight | N/A | weight |
| height | HKQuantityTypeIdentifierHeight | height | height | height |
| heart_rate | HKQuantityTypeIdentifierHeartRate | heart | heart_rate | heart_rate |
| sleep_duration | HKCategoryTypeIdentifierSleepAnalysis | minutesAsleep | total_sleep_duration | sleep_hours |
| sleep_score | N/A | efficiency | sleep_score | sleep_quality |
| readiness_score | N/A | N/A | score | readiness |
| active_calories | HKQuantityTypeIdentifierActiveEnergyBurned | caloriesOut | active_calories | calories_burned |
| distance | HKQuantityTypeIdentifierDistanceWalkingRunning | distance | distance_km | distance_km |

### Data Type Conversions

| Data Type | Input Format | Local Format |
|-----------|--------------|--------------|
| Date | ISO 8601 string | YYYY-MM-DD string |
| Integer | Number or string | Integer |
| Float | Number or string | Float |
| Duration | Seconds, minutes, or hours | Hours (float) |
| Distance | km, m, or miles | km (float) |
| Weight | kg or lbs | kg (float) |
| Temperature | Celsius or Fahrenheit | Celsius (float) |

## Data Synchronization Strategy

### Incremental Sync

Recommended to use incremental synchronization strategy:

1. **First Import**: Import all historical data
2. **Incremental Update**: Only import new data since last sync
3. **Deduplication**: Skip existing dates
4. **Conflict Resolution**: Use latest imported data

### Sync Frequency Recommendations

| Data Type | Recommended Frequency |
|-----------|----------------------|
| Steps, Activities | Daily |
| Weight | Weekly |
| Sleep | Daily |
| Heart Rate | Daily |
| Long-term Trends | Monthly |

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| File not found | Incorrect file path | Check file path and extension |
| Invalid XML | XML format error | Ensure complete Apple Health data export |
| Authentication failed | Invalid API credentials | Re-authenticate with OAuth |
| Rate limit exceeded | Too many API requests | Wait and retry or use CSV import |
| Invalid date format | Incorrect date format | Use YYYY-MM-DD format |
| Missing required field | Missing required columns | Check CSV/JSON includes all required columns |

### Data Validation Rules

```python
# Steps validation
if steps < 0 or steps > 100000:
    raise ValueError("Steps out of reasonable range")

# Weight validation
if weight < 20 or weight > 300:
    raise ValueError("Weight out of reasonable range")

# Heart rate validation
if heart_rate < 30 or heart_rate > 220:
    raise ValueError("Heart rate out of reasonable range")

# Sleep duration validation
if sleep_hours < 0 or sleep_hours > 24:
    raise ValueError("Sleep duration out of reasonable range")
```

## Performance Optimization

### Large File Processing

For large files (like Apple Health exports):

1. **Stream Processing**: Use streaming XML parsers
2. **Batch Processing**: Process by date or type in batches
3. **Parallel Processing**: Process different data types in parallel using multiple threads
4. **Progress Display**: Show import progress

### Memory Optimization

```python
# Use generators to avoid loading all data at once
def parse_records_in_batches(xml_file, batch_size=1000):
    batch = []
    for record in iterparse(xml_file):
        batch.append(record)
        if len(batch) >= batch_size:
            yield batch
            batch = []
    if batch:
        yield batch
```

## Privacy and Security

### Data Security

- **Local Storage**: All data stored locally only
- **Encryption**: API credentials stored with encryption
- **Access Control**: Import operations require explicit user authorization
- **Audit Logging**: Log all import operations

### Data Anonymization

Certain sensitive information needs to be anonymized:

```python
# Partially hide sensitive information
def mask_sensitive_data(data):
    if "name" in data:
        data["name"] = data["name"][0] + "**"
    if "email" in data:
        data["email"] = "***@" + data["email"].split("@")[1]
    return data
```

## Related Documentation

- [integration-guides/apple-health.md](integrations/apple-health.md): Detailed Apple Health integration guide
- [integration-guides/fitbit.md](integrations/fitbit.md): Detailed Fitbit integration guide
- [integration-guides/oura-ring.md](integrations/oura-ring.md): Detailed Oura Ring integration guide
- [integration-guides/generic-import.md](integrations/generic-import.md): Generic file import guide

## FAQ

**Q: Which health devices are supported?**
A: Supports Apple Health, Fitbit, Oura Ring, and any health apps that can export CSV/JSON format.

**Q: Can I import data from multiple platforms?**
A: Yes. You can import data from Apple Health, Fitbit, Oura, and other platforms simultaneously. The system will merge all data.

**Q: Will imported data overwrite existing data?**
A: No. Imported data will be appended to existing data. If data for the same day exists, the latest data will be retained.

**Q: Are API credentials stored securely?**
A: Yes. All API credentials are encrypted and stored in local configuration files, not uploaded to any server.

**Q: How to revoke API access?**
A: You can revoke app access permissions in the corresponding platform's settings.

import pandas as pd
from pathlib import Path
from collections import defaultdict

# =========================
# Section 1: Load and preprocess data
# =========================

# Load the data from Excel
df = pd.read_excel("time_series.xlsx", sheet_name=0)
print("Data loaded successfully.")

# Convert 'timestamp' to datetime
try:
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    print("timestamp conversion successful.")
except Exception as e:
    raise ValueError(f"Error converting timestamp column: {e}")

# Convert 'value' to numeric (handle strings or bad data)
df['value'] = pd.to_numeric(df['value'], errors='coerce')

# Remove duplicate rows
df = df.drop_duplicates()
print("Duplicate rows removed.")

# Drop rows with missing values in required columns
df = df.dropna(subset=['timestamp', 'value'])
print("Missing values removed.")

# Add 'Hour' column rounded down to the hour
df['Hour'] = df['timestamp'].dt.floor('h')

# Calculate hourly average
hourly_avg = df.groupby('Hour')['value'].mean().reset_index()
hourly_avg.columns = ['Start Time', 'Average']

print("Hourly averages calculated:")
print(hourly_avg)

# =========================
# Section 2: Save daily chunks and process them
# =========================

# Create output directory for daily chunks
output_dir = Path("daily_chunks")
output_dir.mkdir(exist_ok=True)

# Add 'Date' column for grouping
df['Date'] = df['timestamp'].dt.date

# Split data into daily CSVs
for date, group in df.groupby('Date'):
    filename = output_dir / f"day_{date}.csv"
    group.to_csv(filename, index=False)
    print(f"Saved daily file for {date} as {filename}")

# Process each daily file and calculate hourly averages
all_hourly = []

for file in output_dir.glob("*.csv"):
    chunk = pd.read_csv(file, parse_dates=['timestamp'])
    chunk['value'] = pd.to_numeric(chunk['value'], errors='coerce')
    chunk = chunk.dropna(subset=['timestamp', 'value'])
    chunk['Hour'] = chunk['timestamp'].dt.floor('h')
    hourly = chunk.groupby('Hour')['value'].mean().reset_index()
    hourly.columns = ['Start Time', 'Average']
    all_hourly.append(hourly)
    print(f"Processed hourly averages for file: {file.name}")

# Merge all results into one final CSV
final_df = pd.concat(all_hourly).sort_values('Start Time')
final_df.to_csv("hourly_averages.csv", index=False)
print("Final hourly averages saved to: hourly_averages.csv")

# =========================
# Section 3: Stream-like aggregation
# =========================

# Dictionary to hold sum and count per hour
hour_data = defaultdict(lambda: {'sum': 0, 'count': 0})

def process_new_data(timestamp_str, value):
    timestamp = pd.to_datetime(timestamp_str)
    hour = timestamp.replace(minute=0, second=0, microsecond=0)
    hour_data[hour]['sum'] += value
    hour_data[hour]['count'] += 1
    avg = hour_data[hour]['sum'] / hour_data[hour]['count']
    print(f"Hour: {hour}, Current average: {avg:.2f}")

# =========================
# Section 4: Parquet processing
# =========================

# Read from Parquet file
df_parquet = pd.read_parquet("time_series.parquet")

# Convert and clean
df_parquet['value'] = pd.to_numeric(df_parquet['value'], errors='coerce')
df_parquet = df_parquet.dropna(subset=['timestamp', 'value'])
df_parquet['Hour'] = df_parquet['timestamp'].dt.floor('h')

# Calculate hourly average
hourly_avg_parquet = df_parquet.groupby('Hour')['value'].mean().reset_index()
hourly_avg_parquet.columns = ['Start Time', 'Average']

# Save to CSV
hourly_avg_parquet.to_csv("hourly_avg_from_parquet.csv", index=False)
print("Hourly averages from Parquet saved to: hourly_avg_from_parquet.csv")

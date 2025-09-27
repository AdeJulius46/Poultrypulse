

# 🐔 PoultryPulse

**PoultryPulse** is an IoT + AI + Blockchain solution that empowers poultry farmers with **real-time disease detection, outbreak prediction, and a transparent incentive/payment system**.

It integrates:

* **Raspberry Pi Edge Device**: camera-based disease detection (`coryza`, `crd`, `normal`) + environmental sensing (temperature, humidity).
* **Web App Dashboard**: cloud interface for farmers and vets to view health trends, historical logs, outbreak predictions, and alerts.
* **Smart Contract**: blockchain-based subscription/payment system with token rewards for verified disease reports and transparent record-keeping.

PoultryPulse bridges the gap between **on-farm AI predictions** and **trustworthy, decentralized record-keeping**.

---

## 🌟 Core Features

### **On the Raspberry Pi**

* Disease detection using YOLOv8 (trained on Roboflow dataset: `coryza`, `crd`, `normal`).
* Temperature & humidity sensing with DHT11/DHT22.
* Outbreak **prediction engine** combining detection + environmental history.
* Local logging (CSV + image storage) & cloud sync with Supabase.
* Offline-safe with fallback simulated sensors.

### **On the Web App**

* Farmer dashboard showing:

  * Detected diseases & frequency trends.
  * Environmental history (temperature/humidity plots).
  * Outbreak risk predictions over time.
  * Downloadable reports & farm history.
* Authentication & farm management.
* Supabase backend with Postgres + storage.

### **On the Smart Contract**

* Subscription-based access to PoultryPulse (farmers pay in tokens).
* Tokenized incentives for farmers/vets who contribute real disease reports (ground-truth data).
* Immutable logging of critical outbreak predictions for transparency.
* ERC20-compatible token (`PPT`) for payments & credits.

---

## 🏗️ System Architecture

```
 ┌────────────────────────────┐
 │ Raspberry Pi (On-Farm)     │
 │ - Pi Camera + YOLOv8       │
 │ - DHT11/22 sensor          │
 │ - Prediction engine        │
 │ - Local CSV backup         │
 │ - Supabase uploader        │
 └──────────────┬─────────────┘
                │
                ▼
 ┌────────────────────────────┐
 │ Supabase (Cloud Backend)   │
 │ - Postgres DB (events)     │
 │ - Storage (chicken images) │
 │ - Auth                     │
 └──────────────┬─────────────┘
                │
                ▼
 ┌────────────────────────────┐
 │ Web App (Farmer Dashboard) │
 │ - Farm status overview     │
 │ - Prediction graphs        │
 │ - Historical data          │
 │ - Outbreak alerts          │
 └──────────────┬─────────────┘
                │
                ▼
 ┌────────────────────────────┐
 │ Blockchain (Smart Contract)│
 │ - Subscription & payments  │
 │ - Incentives & rewards     │
 │ - Immutable disease logs   │
 └────────────────────────────┘
```

## 🧩 Core Functionalities

1. **Disease Detection (AI Model on Pi)**

   * Detects **Coryza**, **CRD**, or **Normal** chickens using a trained ML model (Roboflow-based YOLO).
   * Captures and saves detected chicken images.

2. **Environmental Monitoring**

   * Reads **temperature** and **humidity** data from sensors.
   * Combines sensor data with disease detection for **better predictions**.

3. **Predictive Analysis**

   * Predicts potential disease risks based on **past detection data** + **environmental conditions**.

4. **Data Logging (Supabase)**

   * Stores:

     * Timestamp
     * Detected disease
     * Temperature & humidity readings
     * Prediction outcomes
     * Chicken image snapshot

5. **Farmer Web App (Vercel)**

   * Dashboard to view:

     * Real-time disease detections
     * Environmental trends
     * Prediction insights
   * Data visualization for farm decisions.

6. **Smart Contract Integration**

   * Handles **subscription-based access** to Poultry Pulse.
   * Ensures **transparency and accountability** in payment handling.

---

## �� Components

### **1. Raspberry Pi (Edge Device)**

* **Languages/Frameworks**: Python, Ultralytics YOLOv8, Adafruit DHT, OpenCV, Supabase Python SDK.
* **Outputs**: CSV logs, Supabase event inserts, Supabase image uploads.

### **2. Web App**

* **Stack**: Next.js / React + Tailwind + Supabase client.
* **Features**: Authentication, farm dashboards, graphs, alerts.
* **Integration**: Pulls events & image URLs from Supabase.

### **3. Smart Contract**

* **Language**: Solidity (≥0.8.20).
* **Features**:

  * `subscribe()` → farmer pays monthly fee in PPT tokens.
  * `logOutbreak()` → vets submit confirmed disease reports, earn PPT incentives.
  * `viewRecords()` → transparent outbreak logs.
* **Deployment**: zkSync / Ethereum testnet.

---

## 🗄️ Supabase Schema (Events Table)

```sql
create table public.events (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now(),
  device_id text,
  timestamp timestamptz,
  detection text,          -- 'coryza'|'crd'|'normal'
  confidence numeric,
  temperature numeric,
  humidity numeric,
  outbreak_risk numeric,
  image_url text
);
```

---


## 🛠️ Tech Stack

### **Hardware**

* Raspberry Pi 4
* Pi Camera Module
* Temperature & Humidity Sensor (DHT11 / DHT22 alternative)
* LCD Display (optional for local status updates)

### **Software**

* Python (Raspberry Pi AI + IoT code)
* TensorFlow / YOLOv5 (Disease Detection Model)
* Supabase (Database + Image Storage)
* Next.js + React (Farmer Web App, deployed on Vercel)
* Solidity + Hardhat (Smart Contract for subscriptions)

---

## 🌐 Live Demo & Links

* **Web App (Vercel)**: [👉 View Here](https://your-vercel-link.com)
* **Demo Video**: [�� Watch Here](https://your-demo-video-link.com)
* **Pitch Deck**: [🔗 pitch deck](https://www.canva.com/design/DAG0KAFijBQ/Yv9dFHciWcHiu60c9bLFXg/view?utlId=hc57643978d#4)

---

## 📊 System Workflow

1. **Camera captures chicken images** → AI Model detects **Coryza / CRD / Normal**.
2. **Temperature & Humidity sensors** record farm environment.
3. **Data & images** are stored on **Supabase**.
4. **Predictive algorithm** analyzes trends for disease risk warnings.
5. **Farmer Web App** displays real-time detections & predictions.
6. **Smart Contract** validates subscription to access system.

---

## 🚀 Quick Start

### On the Raspberry Pi

```bash
git clone https://github.com/<your-org>/poultrypulse.git
cd poultrypulse
pip3 install -r requirements.txt
python3 scripts/main.py
```

### On the Web App

```bash
cd web-app
pnpm install
pnpm dev
```

### On the Smart Contract

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat deploy --network sepolia
```

---

## 🔮 Roadmap

* Add audio-based disease detection (chicken coughing/vocalization).
* IoT actuators (fan/feeder control) for preventive actions.
* Predictive analytics dashboard with ML model retraining.
* Expansion to multiple farms with role-based access.
* DAO governance for poultry health data sharing.

---

## ⚖️ License

MIT License — free to use, modify, and contribute.

---


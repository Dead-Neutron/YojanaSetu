# YojanaSetu

**AI-Powered Multilingual Citizen Assistant & Discovery Platform for Indian Government Welfare Schemes**

[![Sarvam AI](https://img.shields.io/badge/LLM-Sarvam%20AI%20(Indic%20GenAI)-FF6F00?style=flat-square)](https://www.sarvam.ai/)
[![TigerData](https://img.shields.io/badge/Database-TigerData%20(Postgres%20%26%20pgvector)-F59E0B?style=flat-square&logo=postgresql&logoColor=white)](https://www.tigerdata.com/)
[![Auth0](https://img.shields.io/badge/Authentication-Auth0%20by%20Okta-EB5424?style=flat-square&logo=auth0&logoColor=white)](https://auth0.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20ASGI-009688?style=flat-square)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015%20App%20Router-000000?style=flat-square)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=flat-square)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=flat-square)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Multimodal%20AI-Google%20Gemini%20Flash-4285F4?style=flat-square)](https://ai.google.dev/)
[![ElevenLabs](https://img.shields.io/badge/Voice%20Synthesis-ElevenLabs-FF6C37?style=flat-square)](https://elevenlabs.io/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA-2E7D32?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

<!-- HERO BANNER / SCREENSHOT PLACEHOLDER -->
```
<img src = "/screenshots/hero_preview.jpeg>

```
<!-- Replace with actual image tag once ready: -->
<!-- ![YojanaSetu Hero Preview](docs/screenshots/hero_preview.png) -->

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Hackathon Sponsor Tracks](#hackathon-sponsor-tracks)
- [Key Architectural Pillars](#key-architectural-pillars)
- [Interface Preview & Visual Documentation](#interface-preview--visual-documentation)
- [System Architecture & Data Pipeline](#system-architecture--data-pipeline)
- [Technology Stack](#technology-stack)
- [Dataset & ETL Ingestion](#dataset--etl-ingestion)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Configuration](#environment-configuration)
- [Accessibility Compliance](#accessibility-compliance)
- [Project Directory Structure](#project-directory-structure)
- [Development Team & Creators](#development-team--creators)
- [License & Acknowledgments](#license--acknowledgments)

---

## Executive Summary

Across central and state administrations in India, more than 3,400 welfare initiatives and subsidy programs exist to uplift citizens. However, a systemic delivery gap persists: vulnerable populations—including rural farmers, daily-wage laborers, weavers, artisans, and low-income women—often remain unaware of schemes they are legally entitled to due to digital illiteracy, bureaucratic jargon, and language fragmentation.

**YojanaSetu** ("Bridge to Welfare Schemes") resolves this barrier through an inclusive, voice-first civil assistance engine. Citizens speak naturally in their mother tongue (Hindi, Bengali, English, or regional dialects), and the platform processes the raw audio directly, extracts demographic parameters, queries a hybrid database of 3,400+ government programs, and speaks back with a concise, jargon-free spoken explanation alongside structured application cards.

---

## 🏆 Hackathon Sponsor Tracks

YojanaSetu actively integrates and implements solutions tailored for the following **HackNex** partner tracks:

| Track | Partner Technology | Core Implementation & Architectural Role | Primary Code Files |
|---|---|---|---|
| **🇮🇳 Sarvam AI Track** | **Sarvam AI (Saaras, Mayura & Bulbul)** | **Sovereign Indic Language Intelligence**: Powers direct vernacular speech recognition (`Saaras v3`), colloquial dialect translation into English (`Mayura`), and studio-grade regional speech synthesis (`Bulbul`) across 22 scheduled Indian languages. | [`sarvam.py`](backend/app/services/sarvam.py)<br>[`VoiceAssistant.jsx`](frontend/src/components/VoiceAssistant.jsx) |
| **🐯 TigerData Track** | **TigerData (PostgreSQL & pgvector)** | **High-Throughput Relational & Vector Infrastructure**: Employs TigerData PostgreSQL with `pgvector` HNSW indexing for hybrid demographic filtering and sub-50ms vector similarity matching across 3,400+ central and state schemes. | [`database.py`](backend/app/database.py)<br>[`ingest_schemes.py`](backend/scripts/ingest_schemes.py)<br>[`models.py`](backend/app/models.py) |
| **🔐 Auth0 Track** | **Auth0 by Okta** | **Citizen Identity & Multi-State Vault Security**: Enterprise RS256 JWT authorization, public JWKS key rotation, and persistent citizen profile management protecting the Personalized Citizen Recommendation Vault (`/recommendations`). | [`security.py`](backend/app/core/security.py)<br>[`recommendations/page.js`](frontend/src/app/recommendations/page.js) |

---

## Key Architectural Pillars

### 1. Multimodal Voice-First Assistant & Indic AI
- **Direct Speech-to-Meaning**: Powered by Google Gemini Flash multimodal capabilities, ingesting raw WebM/WAV audio blobs without relying on lossy, multi-hop third-party STT chains.
- **Sovereign Indic Language Intelligence (Sarvam AI)**: Leverages **Sarvam AI (Saaras v3 & Mayura)** for sovereign Indian language audio transcription and vernacular translation into English across Hindi, Bengali, and regional dialects.
- **Demographic Constraint Extraction**: Automatically infers citizen profile data—including state, gender, age, occupation, and caste eligibility—directly from colloquial speech.
- **Vernacular Response Synthesis**: Generates empathetic, simplified instructions in regional mother tongues without bureaucratic complexity.

### 2. Low-Latency Voice Streaming
- **Authentic Regional Speech Generation**: Integrated with **Sarvam AI Bulbul** (native studio-recorded Indic speakers) and **ElevenLabs** (`eleven_multilingual_v2`) for natural, human-grade Indian regional voice generation delivered via FastAPI streaming endpoints (`StreamingResponse`).
- **Resilient Fallback**: Automatically degrades to client-side Web Speech API if API quotas or network constraints occur, guaranteeing uninterrupted service availability.

### 3. Hybrid RAG Retrieval Engine (TigerData PostgreSQL)
- **3,400+ Ingested Schemes**: Structured database parsed from the Kaggle Government Schemes dataset with relational attributes (`state`, `level`, `category`, `gender`, `occupation`, `caste_category`).
- **TigerData PostgreSQL & pgvector**: Employs **TigerData PostgreSQL** connection pooling with `pgvector` HNSW vector embeddings and SQLAlchemy, coupled with instant in-memory fallback indexing to ensure sub-50ms hybrid semantic retrieval during local or remote development.

### 4. Modern Accessible Bento Grid Interface
- **Clarity-Driven Design**: Clean card-based Bento layout utilizing high-contrast design tokens (`#0B1120` Navy, `#F8FAFC` Off-White, `#1E3A8A` Civic Blue) with strictly zero distracting glassmorphism, no gradient noise, and no informal emojis.
- **Lucide Civic Iconography**: Replaced all informal symbols with precise SVG iconography across every component.

### 5. Built-in Accessibility Engine (WCAG 2.2 AAA)
- **Universal Accessibility Drawer**: A dedicated control hub available on all pages:
  - Font Size Scaling (100%, 125%, 150%, 200%).
  - Text Spacing Controls (Standard, Relaxed, Expanded).
  - OpenDyslexic Font Support for neurodivergent citizens.
  - High-Contrast Monochrome Mode with 7:1 minimum contrast and luminous yellow focus indicators.

### 6. Trilingual Client Localization (i18n)
- Native client-side context supporting instant, zero-reload switching between **English**, **Hindi (हिन्दी)**, and **Bengali (বাংলা)**.

### 7. Personalized Citizen Recommendation Vault (`/recommendations`)
- **Automated Availment Calculation**: Authenticated citizens with saved demographic profiles receive tailored scheme lists calculated across 3,400+ government programs.
- **Relational Multi-Factor Eligibility Engine**: Matches location (State-specific and Central level), normalized occupation (e.g. Farmer, Artisan, Worker, Business, Student), gender exclusions, social category, and age eligibility.
- **Smart Match Scoring & Reasoning**: Every scheme is tagged with an eligibility match percentage (65% to 99% Perfect Match) and bullet points detailing why the citizen qualifies.
- **Protected Multi-State Guards (Auth0 by Okta)**: Secured via **Auth0 by Okta** enterprise RS256 JWT authorization, public JWKS caching, and persistent citizen profile management. Unauthenticated citizens are presented with a Civic Security Lock screen with one-click ID sign-in; citizens with incomplete profiles are guided with a 3-step onboarding progress tracker.

---

## Interface Preview & Visual Documentation

### Voice-First Assistant & Bento Grid Hub
```
========================================================================================
[ PLACEHOLDER: SCREENSHOT 1 - VOICE ASSISTANT & BENTO DASHBOARD ]
Description: Home view highlighting the 7-bar voice equalizer, live microphone interface,
and responsive Bento Grid cards.
Recommended path: docs/screenshots/01_voice_assistant_bento.png
========================================================================================
```
<!-- ![Voice Assistant & Bento Dashboard](docs/screenshots/01_voice_assistant_bento.png) -->

### Scheme Search Portal with Multi-Factor Demographics
```
========================================================================================
[ PLACEHOLDER: SCREENSHOT 2 - SCHEME SEARCH & MULTI-FILTER PORTAL ]
Description: The /search portal showing state dropdowns, occupation chips, category filters,
and dynamic scheme cards with detail inspection modals.
Recommended path: docs/screenshots/02_search_portal_filters.png
========================================================================================
```
<!-- ![Scheme Search Portal](docs/screenshots/02_search_portal_filters.png) -->

### Accessibility Engine Overlay (WCAG 2.2 AAA)
```
========================================================================================
[ PLACEHOLDER: SCREENSHOT 3 - ACCESSIBILITY DRAWER & HIGH CONTRAST ]
Description: Accessibility settings drawer showcasing text enlargement, OpenDyslexic mode,
and high-contrast display options.
Recommended path: docs/screenshots/03_accessibility_drawer.png
========================================================================================
```
<!-- ![Accessibility Settings Drawer](docs/screenshots/03_accessibility_drawer.png) -->

### Scheme Deep-Dive Inspection Modal
```
========================================================================================
[ PLACEHOLDER: SCREENSHOT 4 - SCHEME DETAILS & ELIGIBILITY MODAL ]
Description: Full breakdown modal showing scheme benefits, eligibility requirements,
application steps, and required documents.
Recommended path: docs/screenshots/04_scheme_details_modal.png
========================================================================================
```
<!-- ![Scheme Details Modal](docs/screenshots/04_scheme_details_modal.png) -->

---

## System Architecture & Data Pipeline

```
  CITIZEN INTERFACE (Next.js 15)
  +--------------------------------------------------------------------------+
  | - Accessible Bento Grid UI                                               |
  | - Browser MediaRecorder Audio Capture (WebM/WAV)                         |
  | - Synchronized Read-Along Vernacular Cards                               |
  | - Universal Accessibility Engine (WCAG 2.2 AAA)                          |
  +-------------------------------------+------------------------------------+
                                        |
                         HTTP POST /api/v1/voice-query
                                        |
  FASTAPI BACKEND ENGINE                v
  +--------------------------------------------------------------------------+
  | 1. SlowAPI Rate Limiter & Auth0 JWT Security Middleware                  |
  | 2. Direct Gemini Flash Multimodal Processing:                            |
  |    - Transcribes audio blob in native script (Devanagari, Bengali, etc.) |
  |    - Detects language and translates to English                          |
  |    - Extracts structured demographic constraints:                        |
  |      { state, age, gender, occupation, income, caste }                   |
  +-------------------------------------+------------------------------------+
                                        |
                                        v
  HYBRID RAG RETRIEVAL (PostgreSQL & Kaggle Schemes DB)
  +--------------------------------------------------------------------------+
  | - Multi-parameter relational SQL filter execution                        |
  | - Matched against 3,400+ verified welfare programs                       |
  | - Extracts top candidate schemes, criteria, and official benefits        |
  +-------------------------------------+------------------------------------+
                                        |
                                        v
  SYNTHESIS & RESPONSE GENERATION
  +--------------------------------------------------------------------------+
  | - Gemini Flash generates clear, empathetic vernacular answer             |
  | - ElevenLabs streams multilingual synthesized voice                      |
  | - Returns JSON payload to frontend with application metadata & audio stream|
  +--------------------------------------------------------------------------+
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | Next.js (App Router) | 15.x | High-performance server and client rendering |
| **Frontend Runtime** | React | 19.x | Component lifecycle and reactive state |
| **Styling** | Tailwind CSS | 3.4.x | Utility-first styling with WCAG contrast tokens |
| **Animation** | Framer Motion | 12.x | Accessible micro-interactions and transitions |
| **Icons** | Lucide React | Latest | Clean, standardized SVG civic icons |
| **Backend Framework** | FastAPI | 0.141.x | Async ASGI web API with strict OpenAPI schemas |
| **ASGI Server** | Uvicorn | 0.53.x | High-throughput asynchronous server |
| **Database & Vector Search** | TigerData PostgreSQL & pgvector | 16+ / 0.7.x | Cloud PostgreSQL cluster with HNSW vector indexing & connection pooling |
| **Indic GenAI & Translation** | Sarvam AI (Saaras & Mayura) | v1 / v3 | Sovereign Indic STT, vernacular translation, and native dialect understanding |
| **Multimodal AI** | Google GenAI (Gemini Flash) | 2.25.x | Direct audio analysis and conversational response synthesis |
| **Voice Synthesis** | Sarvam Bulbul & ElevenLabs | v2 / v3 | Multilingual regional speech streaming with authentic Indian native speakers |
| **Authentication & Identity** | Auth0 by Okta / PyJWT | 2.15.x | RS256 JWT bearer token verification with public JWKS caching & vault protection |
| **Rate Limiting** | SlowAPI / Limits | 0.1.x | Endpoint protection and resource throttling |
| **Data Processing** | Pandas | 3.0.x | Kaggle CSV ingestion and normalization pipeline |

---

## Dataset & ETL Ingestion

The platform utilizes a structured Indian Government Welfare Schemes dataset containing **3,400+ verified central and state schemes**.

The automated ingestion pipeline (`backend/scripts/ingest_schemes.py`) handles:
- Deduplication and slug collision resolution.
- Normalization of categories (Agriculture, Education, Healthcare, Social Welfare, MSME, Banking).
- Heuristic demographic tag extraction for targeted demographic matching (`state`, `gender`, `occupation`, `caste_category`).
- Population into the database with batch commits.

```bash
# Execute ETL ingestion pipeline
python backend/scripts/ingest_schemes.py
```

---

## API Reference

The FastAPI service exposes interactive Swagger documentation at `http://localhost:8000/docs`.

### Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service identification, version, and metadata |
| `GET` | `/api/v1/health` | Comprehensive diagnostics (DB, Gemini, ElevenLabs, Auth0) |
| `GET` | `/api/v1/schemes/search` | Multi-parameter scheme search with pagination and demographic filters |
| `GET` | `/api/v1/schemes/recommendations` | **Personalized scheme recommendations** for authenticated citizens with saved demographic profiles |
| `GET` | `/api/v1/schemes/categories` | List of all distinct scheme categories |
| `GET` | `/api/v1/schemes/states` | List of all supported Indian states and union territories |
| `GET` | `/api/v1/schemes/{id}` | Detailed scheme profile, benefits, eligibility, and documents |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated citizen profile and persistent demographics |
| `POST` | `/api/v1/auth/profile` | Save or update citizen demographic criteria (State, Occupation, Gender, Caste, Age) |
| `POST` | `/api/v1/voice-query` | Multimodal audio analysis, RAG retrieval, and localized synthesis |
| `GET` | `/api/v1/voice-query/audio/{id}` | Streaming audio playback for synthesized responses |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or later
- **Python**: v3.11 to v3.14
- **Git**

### Backend Setup

1. **Navigate to workspace root and activate virtual environment**:
   ```bash
   # On Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1

   # On Linux/macOS:
   source .venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Seed Database from Kaggle Dataset**:
   ```bash
   python backend/scripts/ingest_schemes.py
   ```

5. **Start FastAPI Application**:
   ```bash
   python backend/run.py
   ```
   The backend API will run at `http://localhost:8000`.

6. **Execute Automated Backend Test Suite**:
   ```bash
   python backend/tests/test_api.py
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Run Next.js development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Environment Configuration

Configure the following variables in your root `.env` file:

```ini
# PostgreSQL / Tiger Data Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/yojanasetu"

# Google Cloud Vertex AI / Gemini API Key
GOOGLE_API_KEY="your-google-api-key"

# ElevenLabs Multilingual Voice Synthesis
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"

# Auth0 Authentication Settings
AUTH0_DOMAIN="your-tenant.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_AUDIENCE="https://yojanasetu-api.local"

# Backend Network Settings
PORT=8000
HOST="0.0.0.0"
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
RATE_LIMIT_PER_MINUTE=60

# Frontend Next.js Public Environment
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
```

---

## Accessibility Compliance

YojanaSetu adheres strictly to **WCAG 2.2 AAA** guidelines:

- **Contrast Ratios**: Verified 7:1+ contrast between core text elements and backgrounds.
- **Cognitive Inclusion**: OpenDyslexic typeface integration and scalable letter/line spacing.
- **Keyboard Navigation**: Standardized focus rings (`ring-2 ring-blue-600`) and skip-to-content anchors.
- **Screen Reader Readiness**: Semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`) with explicit `aria-label` and `aria-live` regions for streaming audio playback.

---

## Project Directory Structure

```
YojanaSetu-HackNex-Hackathon/
|
|-- backend/
|   |-- app/
|   |   |-- core/
|   |   |   |-- config.py            # Pydantic Settings & environment manager
|   |   |   |-- limiter.py           # SlowAPI rate limiter & exception handler
|   |   |   +-- security.py          # Auth0 JWT verification with JWKS caching
|   |   |-- routers/
|   |   |   |-- health.py            # Diagnostic health check router
|   |   |   |-- search.py            # Scheme query, categories, and detail endpoints
|   |   |   +-- voice.py             # Multimodal voice query and audio streaming
|   |   |-- services/
|   |   |   |-- gemini.py            # Gemini Flash audio extraction and response synthesis
|   |   |   |-- elevenlabs.py        # ElevenLabs multilingual streaming speech
|   |   |   +-- rag.py               # Hybrid retrieval engine over scheme records
|   |   |-- database.py              # SQLAlchemy connection pooling & local fallback
|   |   |-- models.py                # Scheme database schema definitions
|   |   |-- schemas.py               # Pydantic validation schemas
|   |   +-- main.py                  # ASGI app factory, CORS, and router registration
|   |-- scripts/
|   |   +-- ingest_schemes.py        # Kaggle dataset ETL script (3,400 schemes)
|   |-- tests/
|   |   +-- test_api.py              # Automated test suite
|   |-- requirements.txt             # Pinned backend dependencies
|   +-- run.py                       # Development server runner
|
|-- dataset/
|   +-- updated_data.csv             # Kaggle Government Schemes dataset source
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- layout.js            # Root layout with font and metadata configurations
|   |   |   |-- page.js              # Home page with Hero and Bento Dashboard
|   |   |   +-- search/page.js       # Traditional scheme search portal
|   |   |-- components/
|   |   |   |-- AccessibilityDrawer.jsx # WCAG 2.2 AAA settings overlay
|   |   |   |-- BentoDashboard.jsx   # Interactive bento grid overview
|   |   |   |-- Footer.jsx           # Clean civic footer
|   |   |   |-- Navbar.jsx           # Top navigation with language and accessibility toggles
|   |   |   |-- SchemeCard.jsx       # Modular scheme display card
|   |   |   |-- SchemeModal.jsx      # Scheme detail inspection modal
|   |   |   +-- VoiceAssistant.jsx   # Voice-first assistant with audio equalizer
|   |   |-- context/
|   |   |   +-- AccessibilityContext.jsx # Global accessibility state manager
|   |   |-- data/
|   |   |   +-- schemes.json         # Extracted scheme dataset for client fallback
|   |   +-- i18n/
|   |       |-- LanguageContext.jsx  # Client translation context
|   |       +-- locales/             # en.json, hi.json, bn.json dictionaries
|   |-- package.json
|   +-- tailwind.config.js
|
|-- .env.example                     # Environment template
|-- .gitignore                       # Repository exclusion rules
|-- PLAN.md                          # Architectural roadmap and execution tracking
+-- README.md                        # Project documentation
```

---

## Development Team & Creators

| Creator | Role & Focus | GitHub Profile | LinkedIn Profile | Key Contributions |
|---|---|---|---|---|
| **Rajdeep Saha** | Lead Architect, Backend, Python, Postgres DB | [@Dead-Neutron](https://github.com/Dead-Neutron) | [linkedin.com/in/Rajdeep Saha](https://www.linkedin.com/in/rajdeep-saha-0542433aa) | API integration, Prompt engineering, FastAPI bsckend |
| **Pritam Saha** |RAG implementation, Vector Embedding, Chunking | [@pritam-12345](https://github.com/pritam-12345) | [linkedin.com/in/Pritam Saha](https://www.linkedin.com/in/pritam-saha-1449b7328) |  RAG Pipeline, Vector Embedding,Dataset Chunking |
| **Mohima Ghosh** |  Backend & Data Architect | [@Mohimaghosh](https://github.com/Mohimaghosh/Mohimaghosh) | [linkedin.com/in/Mohima Ghosh](www.linkedin.com/in/mohima-ghosh-37a9a5340) |  Frontend, Ui-Ux Lead, Kaggle ETL pipeline |
| **Premendu Manna** |  Accessibility & Frontend Lead | [@premendupingla-maker](https://github.com/premendupingla-maker) | [linkedin.com/in/Premendu Manna](https://www.linkedin.com/in/premendu-manna-1935b3362) |  WCAG 2.2 AAA accessibility, Next.js 15 Bento Grid architecture, Framer Motion interactions, i18n localization |

---

## License & Acknowledgments
- **License**: Released under the [MIT License](LICENSE).
- **Data Source**: Built upon the Indian Government Schemes dataset sourced from Kaggle and official public welfare portals.
- **Hackathon**: Developed for **HackNex Hackathon**.
- **Hackathon Tracks & Integrations**:
  - 🇮🇳 **Sarvam AI Track**: Sovereign Indic AI speech processing (Saaras v3), translation (Mayura), and regional voice generation (Bulbul).
  - 🐯 **TigerData Track**: High-throughput PostgreSQL database cluster with `pgvector` HNSW index for sub-50ms hybrid welfare scheme retrieval.
  - 🔐 **Auth0 Track**: Enterprise citizen authentication, RS256 JWT validation, cached JWKS public keys, and personalized recommendation vault protection.
- **Mission**: Dedicated to digital inclusion, linguistic equity, and accessible public welfare delivery for every Indian citizen.

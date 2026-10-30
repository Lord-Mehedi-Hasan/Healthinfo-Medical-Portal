# Zen Hospital — Health Information & Medical Portal

A modern, responsive, and accessible healthcare portal and hospital information website designed to connect patients with expert, doctor-reviewed medical advice, disease encyclopedias, drug directories, diagnostic tests, and clinical appointment booking.

---

## 🌟 Key Features

- **Health Advisories & Alerts:** Real-time seasonal alerts with dismissible banner notifications.
- **Disease & Condition Encyclopedia:** Comprehensive A-Z reference guides with symptom analysis and clinical recommendations.
- **Medication & Drug Directory:** Fast search and detailed overviews of medications, usages, and side effects.
- **Diagnostic Tests & Procedures:** Patient-friendly descriptions of lab tests, preparation instructions, and what to expect.
- **Appointment Scheduling:** Structured appointment booking interface with department and doctor selection.
- **Hospital Branch & Clinic Locator:** Multi-location directory with maps, operating hours, and contact details.
- **Accessible & Responsive:** Built mobile-first with ARIA accessibility tags, responsive navigation, and smooth UX.

---

## 📁 Project Structure

```text
Healthinfo/
├── css/
│   ├── style.css           # Global typography, color system, and layout styles
│   └── responsive.css      # Tablet and mobile breakpoint adaptations
├── js/
│   ├── main.js             # Navigation toggle, banner dismiss, interactive widgets
│   └── ...                 # Additional utility and interactive scripts
├── index.html              # Main landing portal with search, highlights, and quick services
├── diseases.html           # A-Z Diseases & conditions directory
├── condition-detail.html   # Detailed medical condition overview template
├── drugs.html              # Prescription and OTC medicine library
├── tests.html              # Diagnostic and laboratory procedures guide
├── appointments.html       # Online appointment request and scheduling
├── locations.html          # Hospital branches, clinics, and contact directory
├── health-library.html     # Wellness articles, preventive care, and health guides
├── about.html              # Zen Hospital clinical mission, leadership, and credentials
└── contact.html            # Contact directory, emergency numbers, and feedback form
```

---

## 🚀 Getting Started

No build process or package managers required. Simply open any HTML file in your web browser:

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Lord-Mehedi-Hasan/Healthinfo-Medical-Portal.git
   cd Healthinfo-Medical-Portal
   ```

2. Open `index.html` in your browser:
   - Double click `index.html`, or
   - Use VS Code Live Server extension, or
   - Serve with Python:
     ```bash
     python -m http.server 3000
     ```

3. Navigate to `http://localhost:3000` to browse the portal.

---

## 🛠️ Built With

- **HTML5:** Semantic markup with ARIA accessibility compliance
- **CSS3:** Custom CSS variables, Flexbox, and CSS Grid layouts
- **JavaScript (ES6+):** Lightweight vanilla JavaScript for interactive UI elements
- **Font Awesome 6:** Icons for navigation, medical categories, and status indicators

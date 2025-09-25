# ⏱️ Timer App

[![Netlify Status](https://api.netlify.com/api/v1/badges/5b022f9b-9a8e-4f1e-9e8a-5b0b0b5b0b0b/deploy-status)](https://roaring-lokum-5140e7.netlify.app/)
![GitHub last commit](https://img.shields.io/github/last-commit/Akshy18/timer-app)

A feature-rich React timer application for creating and managing customizable timers with category organization, progress visualization, and history tracking.

🔗 **Live Demo**: [https://roaring-lokum-5140e7.netlify.app/](https://roaring-lokum-5140e7.netlify.app/)

## ✨ Features

- 🕒 **Create Timers**: Add timers with names, durations (up to 24 hours), and categories.
- 📁 **Category Management**: Group timers in collapsible categories, with defaults ("Workout", "Study", "Break") and custom options.
- ⚡ **Bulk Actions**: Start, pause, or reset all timers in a category via a dropdown menu.
- 📊 **Progress Visualization**: Display progress bars and a "Focus Mode" for distraction-free timer viewing.
- 🕰️ **Completion History**: Log completed timers with timestamps and deletion options.
- 🗑️ **Delete Options**: Remove individual timers or entire categories.
- 💾 **Data Persistence**: Store timers, categories, and history in localStorage.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or Yarn

### 🛠️ Technical Details
- **Persistence**: Uses localStorage to save timers, categories, and history (5MB limit).
- **State Management**: Employs useState for lightweight state handling.
- **Styling**: Leverages Tailwind CSS for responsive, modern UI design.
- **Timer Logic**: Implements countdowns with JavaScript’s setInterval.

## 📝 Development Assumptions

### Timer Configuration

**1. Duration Management**: 
- Implemented automatic conversion from seconds to minutes and hours for improved readability.
- Set a maximum timer duration constraint of 24 hours.

**2. Category System**: 
- Pre-populated the app with default categories mentioned in the requirements (Workout, Study, Break).
- Added functionality for users to create custom categories through the Add Timer form.

### Timer Functionality

**1. Timer List Management**: 
- Added a delete functionality for both individual timers and entire categories.
- Included a "Focus" mode that allows users to isolate and focus on a specific timer with enhanced visual feedback.

**2. Bulk Actions**: 
- Implemented a dropdown selector for bulk actions rather than separate buttons to improve UI aesthetics.
- The selector includes all required actions: Start All, Pause All, and Reset All.

**3. History and Logs**: 
- Added the ability to delete completed timer logs from history.
- History entries capture timer name and completion time as specified.

**4. Alert System**: 
- Implemented halfway alerts that automatically close when the timer completes.
- Alert notifications remain non-intrusive to avoid disrupting the user experience.

### Technical Implementation

**1. State Management**:
- Used useState for state management as specified in requirements.
- Could have implemented Redux for better state management, reduced prop drilling, and more maintainable code, but adhered to the requirement of minimal third-party dependencies.

**2. Styling**: 
- Utilized Tailwind CSS for efficient styling and consistent design language.
- Focused on responsive design to ensure usability across different device sizes.

**3. Navigation**: 
- Implemented the required Home and History screens.
- Added smooth transitions between screens to enhance user experience.

### Installation

```bash
git clone https://github.com/Akshy18/timer-app.git
cd timer-app
npm install
npm run dev


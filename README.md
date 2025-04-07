<<<<<<< HEAD
## Installation Guide and Page Overview for the Emergency Caller System

### Introduction

Welcome to the Emergency Caller System – a Vue3-based web application designed for effective call-taking and dispatching in emergency scenarios. This document provides a comprehensive installation guide along with an explanation of each application page and a detailed overview of the library versions and dependencies used in the project. Our goal is to ensure that system administrators, developers, and users have all the necessary information to install, run, and understand the functionality of the application.

### System Requirements

Before installation, please verify that your system meets the following prerequisites:

- **Operating System:** Linux, macOS, or Windows (with a Linux-like environment).
- **Node.js:** Version 16 or later is recommended.
- **Package Manager:** npm (v8+) or yarn.
- **Hardware:** At least 4 GB of RAM and sufficient disk space (minimum 500 MB free space) for dependency installation.
- **Network:** A stable internet connection to download dependencies and libraries.

### Prerequisites

Ensure that the following are installed on your development machine:

- **Node.js and npm:** Verify by running `node -v` and `npm -v` in your terminal.
- **Git:** For version control and to clone the repository.
- **Modern Browser:** Chrome, Firefox, or Edge (with support for ES modules).

### Project Structure

The project follows a component-based structure typical for Vue3 applications. Below is an overview of key files and folders:

- **src/**: Contains all Vue components and main application files.
  - **components/**: Vue components such as `MapArea.vue`, `CallLogs.vue`, `IncidentDetails.vue`, `PhoneCall.vue`, `CallerDetails.vue`, `DispatchPanel.vue`, `LogPanel.vue`, `IncidentDetailsRecord.vue`, `DispatchDashboard.vue`, and `ConversationHistory.vue`.
  - **App.vue / main.vue**: The root component and entry point for the application.
- **package.json**: Contains project metadata, dependencies, and scripts (see ).
- **vite.config.js**: Configuration file for Vite, the build tool.

### Installation Steps

1. **Clone the Repository:**

   Open your terminal and run:

   ```bash 
   perl复制git clone https://your.repo.url/emergency-caller-system.git
   cd emergency-caller-system
   ```

2. **Install Dependencies:**

   Run the following command to install all required libraries:

   ```bash 
   npm install
   ```

   This will install both the production and development dependencies listed in your `package.json`.

3. **Review the Package Configuration:**

   In your `package.json`, key dependencies include:

   - **Vue:** ^3.5.13
   - **Pinia:** ^2.2.6
   - **Vue Router:** ^4.4.5
   - **Element Plus:** ^2.9.1
   - **Axios:** ^1.7.9
   - **Leaflet and Vue-Leaflet:** ^1.9.4 and ^0.1.0 respectively
   - **ECharts:** ^5.6.0
   - **Dayjs:** ^1.11.13
   - **Vue Drag Resize / Vue Draggable Resizable:** ^1.5.4 and ^3.0.0

   The development dependencies include Vite, TypeScript, and plugins for Vue and JSX support. For complete details, refer to .

4. **Running the Application in Development Mode:**

   Use the following npm script:

   ```bash 
   npm run dev
   ```

   This will start the Vite development server and open the application in your default browser. Any code changes will automatically trigger a live reload.

5. **Building the Application:**

   To create a production build, run:

   ```bash 
   npm run build
   ```

   This command invokes Vite to bundle the application for production. You can preview the build locally with:

   ```bash 
   npm run preview
   ```

6. **Type Checking:**

   For TypeScript projects, ensure your type definitions are correct by running:

   ```bash 
   npm run type-check
   ```

### Explanation of Key Pages

Below is an overview of each Vue component and its functionality:

- **MapArea.vue:**
   This component renders a real-time map interface using libraries such as Leaflet and Vue-Leaflet. It displays event locations, supports zooming and panning, and integrates with Google Maps (via @fawmi/vue-google-maps) for geospatial data.
- **CallLogs.vue:**
   Provides a detailed list of call records. It shows call IDs, caller names, timestamps, and statuses, and is often used by operators to review historical call data.
- **IncidentDetails.vue:**
   Displays detailed information about an ongoing incident. It includes fields like incident type, priority score, and geolocation. It also integrates data from other components to provide a comprehensive view of the event.
- **PhoneCall.vue:**
   This component manages the phone call interface. It offers functionalities such as call initiation, termination, and display of real-time call metrics. It’s critical for ensuring the call-taker can manage live calls efficiently.
- **CallerDetails.vue:**
   Presents specific information about the caller including contact details and location. It is designed to help call-takers quickly verify and update caller information.
- **DispatchPanel.vue:**
   Serves as the control panel for dispatching emergency resources. Operators can assign units, view real-time updates on unit statuses, and manage dispatch logs from this panel.
- **LogPanel.vue:**
   Provides a live log feed of system activities and user actions. This panel is essential for monitoring system performance and for auditing purposes.
- **IncidentDetailsRecord.vue:**
   Acts as a historical archive for incident data. It allows users to review previous incidents and analyze trends in incident handling.
- **DispatchDashboard.vue:**
   A high-level dashboard that provides summaries and real-time insights into dispatch operations. It includes charts and key performance indicators (KPIs) to assist decision-makers.
- **ConversationHistory.vue:**
   Displays the history of conversations between operators, dispatchers, and even automated systems. It is useful for tracking communications during emergency events.
- **main.vue:**
   The main entry point of the application. It sets up the global layout, routing, and state management integration using Pinia and Vue Router.

### Library Versions and Their Roles

Understanding the versions of each library used in the project is key to ensuring compatibility and proper maintenance. Here is a breakdown:

- **Vue (^3.5.13):** The core framework for building the user interface with its reactive and component-based architecture.
- **Pinia (^2.2.6):** A state management library for Vue3, replacing Vuex in many modern applications.
- **Vue Router (^4.4.5):** Provides navigation and routing capabilities for single-page applications.
- **Element Plus (^2.9.1):** A UI component library that offers a range of pre-styled components suitable for enterprise applications.
- **Axios (^1.7.9):** A promise-based HTTP client for making API requests.
- **Leaflet (^1.9.4) and Vue-Leaflet (^0.1.0):** Together they deliver interactive maps and geospatial functionalities.
- **@fawmi/vue-google-maps (^0.9.79):** Integrates Google Maps for additional mapping features.
- **ECharts (^5.6.0):** Provides powerful data visualization capabilities.
- **Dayjs (^1.11.13):** A lightweight library for parsing, validating, and manipulating dates.
- **Vue Drag Resize (^1.5.4) & Vue Draggable Resizable (^3.0.0):** Enable drag-and-drop resizing functionalities on UI components.

On the development side, tools like **Vite (^6.0.1)**, **TypeScript (~5.6.3)**, and various Vue plugins (e.g., **@vitejs/plugin-vue, vue-tsc**) ensure that the development process is streamlined and that type safety is maintained.

### Additional Installation Tips

- **Environment Variables:**
   Use a `.env` file to store environment-specific settings such as API endpoints and keys. Make sure not to commit sensitive data.
- **IDE Integration:**
   For a better development experience, use editors like Visual Studio Code with extensions for Vue, ESLint, and Prettier. This ensures code consistency and error detection.
- **Continuous Integration:**
   Incorporate CI/CD pipelines (using tools like GitHub Actions or Jenkins) to automate builds and tests. This guarantees that every update is rigorously checked before deployment.
- **Testing:**
   Utilize Vue Test Utils and testing frameworks such as Jest or Cypress for unit and end-to-end testing. Regular testing helps maintain the robustness of the application.

### Running the Application in Different Environments

- **Development:**
   Run `npm run dev` to start the development server. This mode supports hot module replacement (HMR) for rapid development.
- **Production:**
   After building the project with `npm run build`, deploy the contents of the `dist/` folder on a static file server or integrate with a backend server.
- **Preview:**
   Use `npm run preview` to simulate the production environment locally before deploying.

### Conclusion

This installation guide provides a step-by-step process for setting up the Emergency Caller System. By understanding the structure of the project, the role of each page, and the detailed library versions, both developers and administrators can ensure that the application runs smoothly and is easy to maintain. Whether you are configuring a development environment or preparing for a production rollout, following these guidelines will help you manage the application effectively and support the critical task of emergency call-taking and dispatching.
=======
# emergency-caller-system
Emergency call system with scheduling function based on Vue3

>>>>>>> 383272d723d8e6b5e23d66bb590389447c2fa1b6

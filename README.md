# UST Calculator

A comprehensive web application for automating demand planning for services contracted by the Technical Service Unit (UST), focusing on projects, maintenance, and management.

## Features

### 🧮 Complete Calculation Workflow

- **5-Stage Wizard**: Guided step-by-step process for UST calculations
- **Real-time Calculations**: Automatic updates as you input data
- **Professional Design**: Modern, responsive interface with excellent UX

### 📊 Core Functionality

- **Personal Information Management**: Secure data collection with validation
- **Configuration Parameters**: Customizable UST values and contract settings
- **Professional Profiles**: Comprehensive database of roles with FCP values
- **Project Estimation**: Multi-complexity project planning tools
- **Squad Configuration**: Detailed resource allocation by complexity

### 🎯 Key Capabilities

- **Dynamic Tables**: Full CRUD operations for all data entities
- **Live Calculations**: Real-time UST and cost calculations using formulas:
  - UST/Week = FCP × Quantity × Hours/Week
  - R$/Week = UST/Week × UST Unit Value
  - Total UST = UST/Week × Duration (Weeks)
  - Total R$ = R$/Week × Duration (Weeks)
- **Complexity Management**: Support for Low, Medium, and High complexity projects
- **Data Validation**: Comprehensive form validation with helpful error messages
- **Progress Tracking**: Visual progress indicator across all stages

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for modern styling
- **Radix UI** for accessible components
- **Zod** for runtime validation
- **React Hook Form** for form management
- **React Router** for navigation

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run typecheck
```

## Application Structure

```
src/
├── components/ust-calculator/     # UST Calculator components
│   ├── USTCalculator.tsx         # Main calculator component
│   ├── ProgressIndicator.tsx     # Progress tracking
│   ├── WizardStep.tsx           # Step wrapper component
│   ├── Stage01PersonalInfo.tsx  # Personal information form
│   ├── Stage02Configuration.tsx # Configuration parameters
│   ├── Stage03Projects.tsx      # Project estimation
│   ├── Stage04Squads.tsx        # Squad configuration
│   ├── Stage05Placeholder.tsx   # Results placeholder
│   ├── ProfilesTable.tsx        # Professional profiles table
│   ├── ProjectsTable.tsx        # Projects management table
│   └── SquadTable.tsx          # Squad configuration table
├── hooks/
│   └── use-ust-calculator.ts    # State management hook
├── lib/
│   └── ust-calculator.ts        # Types, schemas, and calculations
└── pages/
    └── Index.tsx               # Main application entry
```

## Usage Guide

### Stage 1: Personal Information

- Enter your full name (max 255 characters)
- Provide a valid email address (max 50 characters)
- Select your organization from Goiás state organizations

### Stage 2: Configuration Parameters

- Set UST Unit Value (default: R$ 70.00)
- Configure contract duration in weeks (default: 52)
- Set working hours per week (default: 40)
- Manage professional profiles with their FCP values

### Stage 3: Estimated Projects

- Add projects with name, complexity, and duration
- View project statistics and complexity distribution
- Projects feed into squad calculations automatically

### Stage 4: Project Squads

- Configure squad composition for each complexity level
- Set quantities for each professional profile
- View real-time cost and UST calculations
- Separate tables for Low, Medium, and High complexity

### Stage 5: Results

- Placeholder for comprehensive reporting
- Future: Export capabilities, detailed analytics

## Professional Profiles Included

The application comes pre-configured with 22 professional profiles commonly used in IT projects, including:

- Business/Requirements Analysts (Junior, Mid-level, Senior)
- Quality/Testing Analysts (Mid-level, Senior)
- Software Architects (Junior, Mid-level, Senior)
- Software Developers (Junior, Mid-level, Senior)
- UX/UI Designers (Mid-level, Senior)
- Project Managers (Mid-level, Senior)
- Team Leaders (Mid-level, Senior)
- Technical Leaders/Product Leaders (Mid-level, Senior)
- Scrum Masters/Agilists (Mid-level, Senior)
- Technical Supervisors (Mid-level)

Each profile includes appropriate FCP (Productivity Conversion Factor) values for accurate calculations.

## Calculations and Formulas

The application uses the following formulas for UST calculations:

- **UST per Week**: `FCP × Quantity × Hours per Week`
- **R$ per Week**: `UST per Week × UST Unit Value`
- **Total UST**: `UST per Week × Project Duration (weeks)`
- **Total R$**: `R$ per Week × Project Duration (weeks)`

## Development

This application is built with modern web technologies and follows best practices for:

- **Type Safety**: Full TypeScript implementation
- **Accessibility**: Semantic HTML and ARIA attributes
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized rendering and calculations
- **User Experience**: Progressive disclosure and helpful validation

## Future Enhancements

- Comprehensive reporting and analytics
- Export to PDF, Excel, and other formats
- Email integration for sharing results
- Data persistence and user accounts
- Advanced project templates
- Integration with external APIs
- Collaborative features

---

Built with ❤️ using modern web technologies for efficient UST demand planning.

# LawConnect – Online Crime Reporting System  
*Motto: One Click Can Make a Difference*

[![Laravel](https://img.shields.io/badge/Laravel-10-orange)](https://laravel.com/) [![PHP](https://img.shields.io/badge/PHP-8.2-blue)](https://www.php.net/) [![MySQL](https://img.shields.io/badge/MySQL-8-green)](https://www.mysql.com/)

---

## Team Members
- **Prottoy Saha Dip**  
  Role: Team Lead  
  Email: prottoy.cse.20230104108@aust.edu  
  ID: 20230104108

- **Thouhidul Islam**  
  Role: Back-end Developer  
  Email: thouhidul.cse.20230104106@aust.edu  
  ID: 20230104106

- **S.M. Rashid Sakin**  
  Role: Front-end Developer  
  Email: rashid.cse.20230104102@aust.edu  
  ID: 20230104102

---

## Introduction
Crime reporting in many regions is still dependent on manual, time-consuming, and paper-based processes. This often discourages citizens from reporting crimes promptly and makes case tracking inefficient. LawConnect provides a secure, web-based platform where citizens can report crimes, upload evidence, and track progress, while police officers and administrators can manage investigations efficiently.

---

## Objective
- Provide an easy and secure way for citizens to report crimes online
- Reduce paperwork and manual handling of crime reports
- Improve transparency in crime investigation processes
- Enable real-time tracking of complaints
- Strengthen communication between citizens and law enforcement authorities

---

## Problem Statement
Traditional crime reporting systems require physical visits to police stations, leading to delays, inconvenience, and lack of transparency. LawConnect solves these issues by providing a centralized, digital, and role-based platform for reporting and tracking crimes.

---

## Proposed Solution
- Citizens submit detailed crime reports with evidence
- Each report receives a unique case ID
- Police officers update investigation status
- Administrators manage users, assign cases, and monitor system activity
- Ensures accountability, transparency, and secure data management

---

## Target Audience
- General citizens
- Police officers
- Law enforcement administrators
- Communities seeking safer digital reporting solutions

---

## Scope
### In Scope
- Online crime reporting
- Evidence upload (images/documents)
- Case status tracking
- Role-based dashboards (Citizen, Police, Admin)
- Admin analytics and reporting

### Out of Scope
- Emergency response handling
- Real-time police dispatch system

---

## Features
### Core Features
- User authentication and role management
- Crime report submission and management
- Evidence upload and secure storage
- Case tracking for citizens
- Police and admin dashboards
- Status updates and remarks

### CRUD Operations
- Users
- Crime Reports
- Evidence Files
- Police Assignments
- Case Status Updates

---

## API Endpoints
```
POST   /auth/register
POST   /auth/login
POST   /crime-report
GET    /crime-report/{id}
GET    /my-reports
PUT    /crime-report/{id}/status
POST   /assign-police
GET    /admin/analytics
```

---

## Technology Stack
- **Backend:** Laravel (PHP)
- **Frontend:** Blade Template Engine, Bootstrap / Tailwind CSS
- **Database:** MySQL
- **Rendering Method:** Server-Side Rendering (SSR)

---

## Project Milestones
### Milestone 1: System Foundation
- Requirement analysis
- Database and ER diagram design
- Authentication and role management
- Basic UI layout

### Milestone 2: Crime Reporting & Tracking
- Crime report module
- Evidence upload system
- Police dashboard
- Case tracking functionality

### Milestone 3: Finalization & Deployment
- Admin panel and analytics
- Security testing
- Bug fixing
- Final deployment and documentation

---

## Expected Outcome
A secure, reliable, and transparent online crime reporting system that improves accessibility to law enforcement services and encourages citizens to report crimes confidently.

---

## Setup Instructions
1. **Clone the repository:**  
```bash
git clone https://github.com/yourusername/LawConnect.git
```
2. **Install dependencies:**  
```bash
composer install
npm install
```
3. **Configure environment:**  
```bash
cp .env.example .env
php artisan key:generate
```
4. **Set up the database:**  
```bash
Create a MySQL database and update .env with DB credentials
php artisan migrate --seed
```
5. **Run the application:**  
```bash
php artisan serve
npm run dev
```
6. **Access the app:**  
Open `http://localhost:8000` in your browser

---

## Conclusion
LawConnect modernizes crime reporting by reducing manual processes and improving transparency. It provides citizens, police officers, and administrators with a secure and efficient platform where **one click can make a difference**.


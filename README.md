# 🏫 School Management System

A fully offline-first desktop application for secondary schools (S1–S6). Built with Electron, React, Vite, TailwindCSS, and PouchDB.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start in development mode (opens Electron + Vite dev server)
npm run dev

# 3. Build for production
npm run electron:build
```

On **first launch**, you'll see the **Setup Wizard** where you:
1. Enter your school profile (name, motto, address, academic year, current term)
2. Create the first Admin account (email + password)

After setup, public signup is permanently disabled. Only Admins can create new users.

---

## 🗂️ Project Structure

```
school-ms/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Secure context bridge (minimal)
├── src/
│   ├── db/
│   │   ├── index.js           # PouchDB instance + helpers
│   │   ├── configService.js   # School config, setup state
│   │   ├── userService.js     # Auth, user CRUD (bcrypt)
│   │   ├── studentService.js  # Student CRUD
│   │   ├── staffService.js    # Staff CRUD
│   │   ├── subjectService.js  # Subject CRUD
│   │   ├── feeService.js      # Fee structures + payments
│   │   ├── attendanceService.js  # Daily attendance
│   │   ├── examService.js     # Exams + results + grading
│   │   └── payrollService.js  # Payroll + expenses
│   ├── contexts/
│   │   └── AuthContext.jsx    # Session management (localStorage)
│   ├── guards/
│   │   └── RoleGuard.jsx      # Route-level role enforcement
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx  # Main shell
│   │   │   ├── Sidebar.jsx    # Role-based nav
│   │   │   └── Topbar.jsx     # Header bar
│   │   └── common/
│   │       ├── Button.jsx     # Reusable button (variants + sizes)
│   │       ├── Input.jsx      # Input, Select, Textarea, FormRow
│   │       ├── Modal.jsx      # Animated modal + ConfirmModal
│   │       └── Badge.jsx      # Badge, StatCard, Card, EmptyState, etc.
│   ├── pages/
│   │   ├── setup/SetupWizard.jsx
│   │   ├── auth/Login.jsx
│   │   ├── dashboard/Dashboard.jsx
│   │   ├── students/Students.jsx
│   │   ├── attendance/Attendance.jsx
│   │   ├── exams/Exams.jsx
│   │   ├── fees/Fees.jsx
│   │   ├── staff/Staff.jsx       # Also exports Payroll, Expenses, Settings
│   │   ├── settings/Subjects.jsx
│   │   └── users/UserManagement.jsx
│   ├── utils/
│   │   ├── constants.js   # Classes, streams, roles, nav config
│   │   └── grading.js     # Grade scale, formatCurrency, formatDate
│   ├── App.jsx            # Root router + setup/auth gate
│   ├── main.jsx           # React entry
│   └── index.css          # Tailwind + global styles
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔐 Roles & Access

| Feature            | Admin | Teacher | Bursar |
|--------------------|:-----:|:-------:|:------:|
| Dashboard          | ✅    | ✅      | ✅     |
| Students           | ✅    | ✅      | ❌     |
| Attendance         | ✅    | ✅      | ❌     |
| Exams & Results    | ✅    | ✅      | ❌     |
| Fees               | ✅    | ❌      | ✅     |
| Payroll            | ✅    | ❌      | ✅     |
| Expenses           | ✅    | ❌      | ✅     |
| Staff              | ✅    | ❌      | ❌     |
| Subjects           | ✅    | ❌      | ❌     |
| User Accounts      | ✅    | ❌      | ❌     |
| Settings           | ✅    | ❌      | ❌     |

---

## 🏫 Academic Structure

- Classes: **S1 – S6**
- Streams: **A, B, C, D, E** (per class)
- Combined: `S1A`, `S1B` ... `S6E` (30 class-streams total)

---

## 🗄️ PouchDB Schema

All documents stored in a single local PouchDB database (`school_management_v1`).

| Type                | `_id` prefix        | Description                          |
|---------------------|---------------------|--------------------------------------|
| `config`            | `config_app`        | School profile, setup flag           |
| `user`              | `user_`             | Staff login accounts (hashed pw)     |
| `student`           | `student_`          | Student records                      |
| `staff`             | `staff_`            | Staff records                        |
| `subject`           | `subject_`          | Subjects per class level             |
| `fee_structure`     | `feestructure_`     | Fee amounts per class/term/year      |
| `fee_payment`       | `feepayment_`       | Individual fee payments              |
| `attendance_session`| `attendance_`       | Daily attendance per class/date      |
| `exam`              | `exam_`             | Exam definitions                     |
| `exam_result`       | `examresult_`       | Per-student exam marks               |
| `payroll_entry`     | `payroll_`          | Salary payment records               |
| `expense`           | `expense_`          | School expense records               |

---

## 🎓 Grading Scale

| Grade | Range     | Points | Remarks   |
|-------|-----------|--------|-----------|
| A     | 80 – 100% | 1      | Excellent |
| B     | 70 – 79%  | 2      | Good      |
| C     | 60 – 69%  | 3      | Average   |
| D     | 50 – 59%  | 4      | Pass      |
| F     | 0 – 49%   | 9      | Fail      |

---

## 🔧 Building for Production

```bash
# Build Electron installer
npm run electron:build

# Output: ./release/
#   - Windows: .exe (NSIS installer)
#   - macOS:   .dmg
#   - Linux:   .AppImage
```

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds) — never stored in plain text
- No public signup endpoint — user creation is Admin-only
- Role checks enforced at **both** UI render level (RoleGuard) and service level
- Session stored in localStorage; cleared on logout
- All data stays on the local device — no network sync

---

## 📋 First Steps After Setup

1. **Settings** → Verify school name, academic year, and current term
2. **Subjects** → Add all subjects and assign them to class levels (e.g. Mathematics → S1, S2, S3, S4)
3. **Staff** → Register all teaching and non-teaching staff
4. **User Accounts** → Create Teacher and Bursar login accounts
5. **Students** → Import or add students to their respective class/stream
6. **Fees** → Configure fee structures per class level and term
7. **Attendance & Exams** → Teachers can now mark attendance and enter marks

---

## 🛠️ Tech Stack

| Tool            | Version  | Purpose                     |
|-----------------|----------|-----------------------------|
| Electron        | ^28      | Desktop wrapper             |
| React           | ^18      | UI framework                |
| Vite            | ^5       | Build tool + dev server     |
| TailwindCSS     | ^3.4     | Utility-first styling       |
| PouchDB         | ^8       | Offline-first local DB      |
| bcryptjs        | ^2.4     | Password hashing            |
| React Router    | ^6.22    | Client-side routing         |
| Lucide React    | ^0.358   | Icon library                |
| electron-builder| ^24      | Cross-platform builds       |

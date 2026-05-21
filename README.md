# Thanos-appointment-booking (TAB)

TAB Hospital Appointment Management System built with Next.js, TypeScript, TailwindCSS, and HeroUI.

TAB is designed to simulate a real-world hospital appointment workflow including doctor management, appointment scheduling, slot generation, and booking validation.

The project focuses on creating a clean, scalable, and maintainable healthcare management system UI while implementing realistic appointment scheduling logic.

---

# ✨ Overview

This project was created as a hospital appointment booking platform prototype that demonstrates:

- Dynamic doctor scheduling
- Real-time slot availability generation
- Appointment conflict prevention
- Multi-type appointment support
- Hospital administration management UI
- Scalable API structure using Next.js App Router

The system aims to mimic how modern hospital systems handle appointment management while keeping the architecture lightweight and frontend-focused.

---

# ✨ Core Features

## ✅ Doctor Management

Manage doctor information and schedules dynamically.

### Features

- Create doctor profile
- Edit doctor profile
- Soft delete doctor
- Active / inactive doctor status
- Department assignment
- Medical specialty support
- License number support
- Working day configuration
- Available booking day configuration
- Schedule generation
- Auto-generated slot times
- Break time configuration
- Booking availability toggle

### Schedule Logic

Doctors can define:

- Working days
- Working hours
- Break time
- Slot intervals

Example:

```txt
08:00 - 17:00
Break: 12:00 - 13:00
Slot interval: 30 minutes
```

Generated slots:

```txt
08:00
08:30
09:00
...
16:30
```

---

# 📅 Appointment Booking System

The booking system dynamically generates appointment slots based on:

- Doctor working hours
- Existing appointments
- Appointment duration
- Break time
- Schedule availability
- Appointment type rules

---

## ✅ Appointment Types

Different appointment types support different business rules.

### Example Rules

| Type | Duration | Same Day | Consent | Room |
|---|---|---|---|---|
| New Patient | 60m | ❌ | ❌ | ❌ |
| Follow-up | 20m | ✅ | ❌ | ❌ |
| Consultation | 30m | ✅ | ❌ | ❌ |
| Procedure | 90m | ❌ | ✅ | ✅ |

---

## ✅ Booking Validation

The system prevents invalid bookings such as:

- Booking outside working hours
- Booking during break time
- Double booking
- Booking in the past
- Overlapping appointments
- Invalid doctor availability

---

# 🎨 UI / UX Features

The UI follows a modern hospital dashboard style.

### Included


- Dashboard layout
- Appointment slot visualization
- Booking confirmation modal
- Development status indicators
- Toast notifications
- Loading states
- Empty states
- Clean form layouts
- Color-coded appointment states

---

# 🚧 Current Development Status

This project is still actively being developed.

---

# 🚧 Features In Progress

## Appointment

- Duplicate booking improvements
- Appointment cancellation
- Appointment rescheduling
- Appointment history
- Appointment status tracking

## Patient System

- Patient CRUD
- Medical history
- Patient search
- Visit history

## Department System

- Department management
- Department schedules
- Department filtering

## Reporting

- Appointment statistics
- Doctor workload analytics
- Daily booking reports
- Utilization reports

## Authentication

- Login system
- Role-based access
- Staff permissions
- Session handling

## Database

Currently the project uses mock/local state data.

Planned migration:

- PostgreSQL
- Prisma ORM
- Redis cache
- Real persistence layer

---

# 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js App Router | Frontend + API |
| React | UI |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| HeroUI | UI Components |
| Lucide React | Icons |
| Native Fetch API | API communication |

---

# 🏗 Architecture Goals

The project structure is designed to remain scalable as features grow.

### Goals

- Modular API routes
- Reusable UI components
- Strong TypeScript typing
- Clear separation of concerns
- Scalable scheduling logic
- Maintainable folder structure

---

# 🚀 Installation

## 1. Clone This Project

```bash
git clone https://github.com/Fuse441/thanos-appointment-booking
```

---

## 2. Navigate Into Project

```bash
cd thanos-appointment-booking
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Install HeroUI

Official website:

https://www.heroui.com

```bash
npm install @heroui/react framer-motion
```

---

## 5. Install Icons

```bash
npm install lucide-react
```

---

## 6. Run Development Server

```bash
npm run dev
```

---

## 7. Open Browser

```txt
http://localhost:3000
```

---

# 📁 Project Structure

```txt
app/
 ├── api/
 │    ├── appointments/
 │    ├── doctors/
 │    ├── departments/
 │    └── schedules/
 │
 ├── appointments/
 ├── doctors/
 ├── schedules/

components/
schemas/
helper/
state/
```

---

# 📌 Current Modules

| Module | Status |
|---|---|
| Doctor Management | ✅ |
| Appointment Booking | ✅ |
| Available Slots | ✅ |
| Scheduling | ✅ |
| Appointment Validation | ✅ |
| Cancel Appointment | 🚧 |
| Reports | 🚧 |
| Patients | 🚧 |
| Authentication | 🚧 |
| Database Persistence | 🚧 |

---

# 📷 UI Highlights

- Modern hospital dashboard
- Doctor schedule management
- Smart slot generation
- Real-time booking validation
- Clean responsive layouts
- Color-coded appointment logic
- Development-ready architecture

---

# 🧠 Scheduling Logic

The scheduling engine calculates available slots dynamically using:

```txt
Doctor Schedule
+ Appointment Duration
+ Existing Bookings
+ Break Time
+ Working Day Rules
= Available Slots
```

This allows the UI to reflect realistic hospital scheduling behavior.

---

# 🔮 Future Roadmap

## Short-term Goals

- Complete appointment cancellation
- Add rescheduling flow
- Add patient module
- Add department module
- Improve booking validation

## Mid-term Goals

- PostgreSQL integration
- Prisma ORM
- Authentication
- Dashboard analytics
- Pagination & filters

## Long-term Goals

- Queue management
- SMS/email notifications
- Online meeting support
- Multi-branch hospital support
- Doctor calendar sync
- Mobile responsive optimization
- Real production deployment

---

# ⚠️ Notes

This project currently focuses primarily on:

- Frontend architecture
- Scheduling logic
- UI/UX
- API structure simulation

Some backend functionality is intentionally simplified for demonstration purposes.

---

# 📄 License

MIT License

---

# 💡 Development Philosophy

You are encouraged to design the solution in the way you think is most appropriate.

Feel free to:

- Choose any programming languages you are best at
- Add fields that you think are necessary
- Add features that improve the appointment workflow
- Choose any suitable data storage approach
- Make reasonable assumptions where requirements are unclear
- Simplify areas that you think are out of scope

Please clearly document necessary information in your `README.md`

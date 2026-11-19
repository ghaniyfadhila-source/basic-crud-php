# PHP Native CRUD & RFID Login Learning Module

An offline-ready interactive learning module and minimal PHP Native reference application for building a relational two-table MySQL database, procedural CRUD operations, and USB RFID card authentication.

## Overview

This repository provides two complementary components aligned with the 10 competency items in `skemaOkupasi.md`:

1. **Interactive Web Learning Workspace (`index.html`):** A zero-dependency browser application containing a 10-chapter guided roadmap, syntax references, interactive CLI/database/RFID simulators, fill-in-the-blank and debugging exercises, a printable cheat sheet, and a timed self-assessment checklist.
2. **Reference PHP & SQL Implementation (`app-cashless-rfid/`):** A minimal, unstyled procedural PHP (`mysqli`) application demonstrating a two-table cashless user/role system with RFID tap login.

## Purpose & Design Goals

- **Low Barrier to Entry:** Uses plain HTML and procedural `mysqli` (`mysqli_connect`, `mysqli_query`, `mysqli_fetch_assoc`) without frameworks, OOP, or external CSS dependencies.
- **Offline Accessibility:** Runs directly via `file://` in any desktop or mobile browser without Node.js, build tools, or internet access, while storing progress in `localStorage` with an in-memory fallback.
- **Reproducible Practice:** Pairs interactive browser simulations (MySQL CLI, phpMyAdmin Designer, CRUD data flow, USB HID RFID input) with runnable server-side PHP source files.

## Features

- **10-Chapter Curriculum:** Step-by-step guides, code snippets with one-click copy, and raw HTML output previews.
- **Interactive Simulators:**
  - Environment setup readiness checklist (Chapter 1)
  - Virtual MySQL CLI enforcing statement terminators (`;`) and `ENGINE=InnoDB` table creation (Chapter 2)
  - phpMyAdmin Designer sequence simulator enforcing `INDEX` creation prior to Foreign Key linking (Chapter 3)
  - Live CRUD table and SQL inspector covering `koneksi`, `beranda`, `tampil`, `tambah`, `edit`, and `hapus` (Chapters 4–9)
  - Virtual USB HID RFID card tap simulator demonstrating `<input name="rfid" autofocus>` submission and `$_SESSION` handling (Chapter 10)
- **Automated Practice Checks:** Tolerant fill-in-the-blank grading (`normalizeAnswer` / `gradeFillBlank`) and debugging quizzes per chapter.
- **Printable A4 Cheat Sheet:** Condensed syntax reference formatted via `@media print`.
- **Timed Checklist Mode:** Configurable 60-minute or 90-minute countdown timer (`Date.now()`-synced across tab switches) paired with a 10-item completion checklist.

## Roadmap

```text
[Phase 1: Environment & Database]
  1. Editor & local server setup (htdocs/cashless)
  2. MySQL CLI: db_loginCashles -> tb_role + tb_user (ENGINE=InnoDB)
  3. phpMyAdmin Designer: INDEX on tb_user.id_role -> FK CASCADE
        |
        v
[Phase 2: Connection & Read]
  4. koneksi.php   (mysqli_connect 4 parameters)
  5. beranda.php   (session_start + $_SESSION['id_user'] guard)
  6. tampil.php    (SELECT ... JOIN tb_role + while loop + ?id= links)
        |
        v
[Phase 3: Create, Update, Delete]
  7. tambah.php / proses_tambah.php  (POST form + INSERT INTO tb_user)
  8. edit.php      ($_GET['id'] + pre-filled values + UPDATE WHERE)
  9. hapus.php     ($_GET['id'] + DELETE WHERE + redirect)
        |
        v
[Phase 4: RFID Authentication]
 10. login.php & logout.php  (<input name="rfid" autofocus> -> $_SESSION)
```

| Phase | Chapter | Target Artifact | Technical Scope |
| :--- | :--- | :--- | :--- |
| 1. Setup & Database | 1 | `C:\xampp\htdocs\cashless` | Editor Auto Save, Apache & MySQL services |
| 1. Setup & Database | 2 | `db_loginCashles.sql` | CLI `CREATE DATABASE`, `USE`, `tb_role`, `tb_user` (`InnoDB`) |
| 1. Setup & Database | 3 | phpMyAdmin Designer | Add `INDEX` on `tb_user.id_role`, link PK to FK (`CASCADE`) |
| 2. Connection & Read | 4 | `koneksi.php` | Procedural `mysqli_connect("localhost", "root", "", "db_loginCashles")` |
| 2. Connection & Read | 5 | `beranda.php` | `session_start()` guard and plain navigation links |
| 2. Connection & Read | 6 | `tampil.php` | `JOIN tb_role`, `while (mysqli_fetch_assoc(...))`, `?id=` links |
| 3. CUD Operations | 7 | `tambah.php`, `proses_tambah.php` | `INSERT INTO tb_user` (single-page and split-handler patterns) |
| 3. CUD Operations | 8 | `edit.php` | Pre-fill `<input>`/`<select>` via `?id=`, `UPDATE ... WHERE id_user` |
| 3. CUD Operations | 9 | `hapus.php` | `DELETE FROM tb_user WHERE id_user='$id'` + redirect |
| 4. RFID Auth | 10 | `login.php`, `logout.php` | `autofocus` RFID input, `JOIN` lookup, `session_destroy()` |

## Repository Structure

```text
.
├── index.html                  # Offline interactive learning module
├── README.md                   # Repository documentation
├── skemaOkupasi.md             # Competency specification (10 items)
├── app-cashless-rfid/          # Simplified procedural PHP + SQL reference app
│   ├── db_loginCashles.sql
│   ├── koneksi.php
│   ├── login.php
│   ├── logout.php
│   ├── beranda.php
│   ├── tampil.php
│   ├── tambah.php
│   ├── proses_tambah.php
│   ├── edit.php
│   └── hapus.php
├── assets/
│   ├── css/style.css           # Module layout, mobile drawer, A4 print styles
│   └── js/
│       ├── materi-data.js      # Curriculum data, exercises, cheat sheet
│       ├── state.js            # Safe localStorage persistence and timer math
│       ├── simulators.js       # Answer grader and 5 interactive simulators
│       └── app.js              # UI controller
├── loginCashles/               # Original login reference (preserved unmodified)
├── docs/superpowers/           # Design specification and implementation plan
└── tests/                      # Automated Node.js test suite
```

## Database Schema (`app-cashless-rfid`)

- Database: `db_loginCashles`
- `tb_role`: `id_role` (PK, `AUTO_INCREMENT`), `nama_role`
- `tb_user`: `id_user` (PK, `AUTO_INCREMENT`), `rfid` (`UNIQUE`), `nama`, `id_role` (FK -> `tb_role.id_role`, `ON DELETE CASCADE ON UPDATE CASCADE`)
- Default seeded test RFID UIDs:
  - `0012345678` (`Super Admin`, `super_admin`)
  - `0087654321` (`Teller 1`, `teller`)

## Usage

### 1. Run the Learning Module

1. Clone or download this repository.
2. Open `index.html` in any web browser (works directly over `file://` or any static HTTP server).
3. Browse Chapters 1–10 using the sidebar, switch between `Materi`, `Simulator`, and `Latihan` tabs, or open `Contekan` (`Ctrl+P` to print) and `Simulasi Ujian` from the top bar.

### 2. Deploy the Reference PHP App (`app-cashless-rfid/`)

1. Copy `app-cashless-rfid/` into your local PHP web root (e.g., `htdocs/` in XAMPP or `www/` in Laragon).
2. Start Apache and MySQL/MariaDB.
3. Import `app-cashless-rfid/db_loginCashles.sql` via phpMyAdmin or MySQL CLI (`mysql -u root < db_loginCashles.sql`).
4. Visit `http://localhost/app-cashless-rfid/login.php`.
5. Tap a registered RFID card on a USB HID reader, or type `0012345678` / `0087654321` and press `Enter`.

Note for PHP 8.1+: `MYSQLI_REPORT_STRICT` is enabled by default in PHP 8.1+. Submitting a duplicate `rfid` value in `tambah.php`, `proses_tambah.php`, or `edit.php` raises an uncaught `mysqli_sql_exception` unless `mysqli_report(MYSQLI_REPORT_OFF)` is added; error-handling boilerplate is omitted intentionally to keep the reference code concise.

### 3. Run Automated Tests

Requires Node.js (verified on v26.13.0):

```bash
node --test tests/*.test.js
```

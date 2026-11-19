(function (global) {
  'use strict';

  var PHASES = [
    {
      id: 1,
      title: 'Fase 1: Persiapan & Database',
      subtitle: 'Setup VS Code, XAMPP, dan 2 tabel berelasi.',
      chapterIds: [1, 2, 3],
    },
    {
      id: 2,
      title: 'Fase 2: Koneksi & Read',
      subtitle: 'Koneksi database, session beranda, dan tampil data JOIN.',
      chapterIds: [4, 5, 6],
    },
    {
      id: 3,
      title: 'Fase 3: Create, Update, Delete',
      subtitle: 'Tambah, ubah, dan hapus data pengguna.',
      chapterIds: [7, 8, 9],
    },
    {
      id: 4,
      title: 'Fase 4: Login RFID',
      subtitle: 'Form tap kartu RFID otomatis dan logout.',
      chapterIds: [10],
    },
  ];

  var CHAPTERS = [
    {
      id: 1,
      phaseId: 1,
      skemaRef: 'Poin 1: Melakukan instalasi software aplikasi (vscode)',
      title: 'Bab 1: Instalasi & Setup VS Code + XAMPP',
      shortTitle: 'Setup VS Code & XAMPP',
      targetFile: 'C:\\xampp\\htdocs\\cashless',
      summary:
        'File PHP harus dijalankan lewat server Apache (XAMPP) di dalam folder htdocs, bukan dibuka langsung lewat File Explorer.',
      analogy:
        'VS Code tempat menulis kode, Apache yang menjalankan PHP, MySQL penyimpan data, dan htdocs folder kerja yang dibaca Apache.',
      cheatRule: {
        title: 'Aturan Dasar Setup',
        formula: 'VS Code (Editor) + htdocs/cashless (Folder) + Apache & MySQL Hijau (XAMPP)',
        points: [
          'Simpan semua file .php di C:\\xampp\\htdocs\\cashless\\ (jangan di Desktop atau Documents).',
          'Jalankan Apache dan MySQL di XAMPP Control Panel sampai statusnya hijau.',
          'Buka lewat http://localhost/cashless/login.php (bukan klik dua kali file).',
        ],
      },
      steps: [
        {
          title: '1. Buka Visual Studio Code',
          detail: 'Pastikan VS Code terpasang. Tanpa ekstensi tambahan pun sudah cukup untuk ujian.',
        },
        {
          title: '2. Buat Folder di htdocs',
          detail: 'Buat folder baru bernama cashless di dalam C:\\xampp\\htdocs\\ (atau folder www pada Laragon).',
        },
        {
          title: '3. Buka Folder & Aktifkan Auto Save',
          detail: 'Di VS Code: File -> Open Folder -> pilih cashless, lalu centang File -> Auto Save.',
        },
        {
          title: '4. Nyalakan Apache & MySQL',
          detail: 'Di XAMPP Control Panel, klik Start pada Apache dan MySQL sampai keduanya hijau.',
        },
        {
          title: '5. Cek di Browser',
          detail: 'Buka http://localhost/phpmyadmin untuk database dan http://localhost/cashless/ untuk aplikasi.',
        },
      ],
      codeBlocks: [
        {
          filename: 'struktur-folder.txt',
          label: 'Susunan Folder Target di C:\\xampp\\htdocs\\cashless\\',
          code: [
            'C:\\xampp\\htdocs\\cashless\\',
            '├── db_loginCashles.sql   (Bab 2 & 3: Skema 2 tabel berelasi)',
            '├── koneksi.php           (Bab 4: Jembatan ke MySQL)',
            '├── beranda.php           (Bab 5: Halaman utama + penjaga session)',
            '├── tampil.php            (Bab 6: Daftar pengguna JOIN role)',
            '├── tambah.php            (Bab 7a: Form & proses tambah di halaman sama)',
            '├── proses_tambah.php     (Bab 7b: Alternatif proses di halaman berbeda)',
            '├── edit.php              (Bab 8: Ubah data berdasarkan ?id=)',
            '├── hapus.php             (Bab 9: Hapus data 5 baris berdasarkan ?id=)',
            '├── login.php             (Bab 10a: Login tap kartu RFID autofocus)',
            '└── logout.php            (Bab 10b: Hapus session & kembali ke login)',
          ].join('\n'),
        },
        {
          filename: 'cek_url_browser.txt',
          label: 'Cara Membuka Aplikasi PHP di Browser (Benar vs Salah)',
          code: [
            'SALAH (Klik 2x file di Explorer -> PHP tampil mentah):',
            'file:///C:/xampp/htdocs/cashless/login.php',
            '',
            'BENAR (Lewat server Apache -> PHP diproses menjadi HTML):',
            'http://localhost/cashless/login.php',
          ].join('\n'),
        },
      ],
      simulatorType: 'setup-checklist',
      simulatorConfig: {
        items: [
          {
            id: 'install-vscode',
            label: 'Buka Visual Studio Code dan siapkan editor kerja',
            command: 'code C:\\xampp\\htdocs\\cashless',
            tip: 'Pastikan VS Code terbuka di folder proyek, bukan membuka file satu per satu dari lokasi acak.',
          },
          {
            id: 'enable-autosave',
            label: 'Aktifkan File -> Auto Save di menu VS Code',
            command: 'File > Auto Save (Centang)',
            tip: 'Mencegah kasus klasik: kode sudah diubah di editor, tetapi browser masih menjalankan versi lama karena lupa Ctrl+S.',
          },
          {
            id: 'create-htdocs',
            label: 'Buat folder proyek C:\\xampp\\htdocs\\cashless',
            command: 'mkdir C:\\xampp\\htdocs\\cashless',
            tip: 'Nama folder jangan memakai spasi agar URL localhost mudah diketik dan bebas error.',
          },
          {
            id: 'start-xampp',
            label: 'Nyalakan Apache dan MySQL di XAMPP Control Panel sampai hijau',
            command: 'XAMPP: Start Apache + Start MySQL',
            tip: 'Apache menjalankan PHP, sedangkan MySQL menjalankan database db_loginCashles.',
          },
          {
            id: 'test-localhost',
            label: 'Uji buka URL lewat http://localhost/cashless/ di browser',
            command: 'http://localhost/cashless/login.php',
            tip: 'Selalu pakai awalan http://localhost/, bukan file:///.',
          },
        ],
      },
      fillBlanks: [
        {
          title: 'Lengkapi Alur Setup Lingkungan Kerja XAMPP & VS Code',
          mode: 'exact',
          template:
            '1. Simpan folder proyek "cashless" di dalam folder C:\\xampp\\{{folder_utama}}\\\n2. Di XAMPP Control Panel, klik Start pada modul {{modul_web}} (untuk PHP) dan {{modul_db}} (untuk database).\n3. Buka proyek di browser melalui alamat http://{{host_url}}/cashless/login.php',
          blanks: [
            {
              id: 'folder_utama',
              placeholder: 'nama folder server XAMPP',
              answers: ['htdocs', 'HTDOCS'],
              hint: 'Folder tempat meletakkan seluruh proyek web di XAMPP diawali huruf h...',
            },
            {
              id: 'modul_web',
              placeholder: 'nama web server',
              answers: ['Apache', 'apache'],
              hint: 'Baris paling atas di XAMPP Control Panel yang menjalankan kode PHP.',
            },
            {
              id: 'modul_db',
              placeholder: 'nama database server',
              answers: ['MySQL', 'mysql', 'MariaDB', 'mariadb'],
              hint: 'Baris kedua di XAMPP Control Panel tepat di bawah Apache.',
            },
            {
              id: 'host_url',
              placeholder: 'nama host lokal',
              answers: ['localhost', '127.0.0.1'],
              hint: 'Alamat standar komputer lokal di browser (dimulai huruf l...).',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Kode PHP Muncul Mentah di Layar Browser',
          buggyCode: 'Address bar browser:\nfile:///C:/xampp/htdocs/cashless/login.php\n\nTampilan layar:\n<?php session_start(); include "koneksi.php"; ... ?>',
          question: 'Mengapa kode <?php ... ?> justru tampil sebagai teks biasa di browser dan tidak berjalan?',
          options: [
            'Karena file dibuka langsung lewat file://, bukan melalui http://localhost/cashless/login.php',
            'Karena VS Code belum dipasang ekstensi Bootstrap',
            'Karena tag pembuka PHP seharusnya ditulis <?php_start>',
          ],
          answerIndex: 0,
          explanation:
            'Browser tidak bisa mengeksekusi PHP secara langsung dari sistem file. File harus dipanggil lewat server Apache menggunakan alamat http://localhost/cashless/login.php.',
        },
        {
          title: 'Halaman Error Tidak Bisa Terhubung ke Database',
          buggyCode: 'Fatal error: Uncaught mysqli_sql_exception:\nNo connection could be made because the target machine actively refused it.\nin C:\\xampp\\htdocs\\cashless\\koneksi.php on line 2',
          question: 'Kode koneksi.php sudah benar, lalu apa penyebab error "actively refused it" saat dijalankan?',
          options: [
            'Nama variabel $koneksi harus diganti menjadi $db',
            'Layanan MySQL di XAMPP Control Panel belum dinyalakan (belum Start/hijau)',
            'File koneksi.php harus diberi kode CSS terlebih dahulu',
          ],
          answerIndex: 1,
          explanation:
            'Pesan "target machine actively refused it" menandakan server MySQL sedang mati. Buka XAMPP Control Panel dan klik Start pada MySQL hingga berwarna hijau.',
        },
      ],
    },

    {
      id: 2,
      phaseId: 1,
      skemaRef: 'Poin 2: Membuat database dengan CLI (2 tabel)',
      title: 'Bab 2: Membuat Database 2 Tabel dengan MySQL CLI',
      shortTitle: 'Database CLI (2 Tabel)',
      targetFile: 'db_loginCashles.sql',
      summary:
        'Buat database db_loginCashles dan 2 tabel (tb_role dan tb_user) lewat MySQL CLI memakai ENGINE=InnoDB, lalu isi data awal kartu RFID.',
      analogy:
        'Urutannya tetap: buat database (CREATE DATABASE), masuk ke database (USE), buat tabel induk tb_role dulu, baru buat tabel anak tb_user.',
      cheatRule: {
        title: 'Urutan CLI (Wajib InnoDB & Titik Koma)',
        formula: 'mysql -u root -> CREATE DATABASE -> USE -> CREATE TABLE (ENGINE=InnoDB) -> INSERT',
        points: [
          'Setiap perintah SQL di CLI wajib ditutup tanda titik koma (;) sebelum Enter.',
          'Gunakan ENGINE=InnoDB pada kedua tabel agar bisa dibuatkan relasi Foreign Key.',
          'Isi 2 role (super_admin, teller) dan 2 kartu awal (0012345678, 0087654321).',
        ],
      },
      steps: [
        {
          title: '1. Buka Shell XAMPP & Masuk ke MySQL CLI',
          detail:
            'Klik tombol Shell di XAMPP Control Panel, lalu ketik mysql -u root dan tekan Enter hingga muncul prompt bertuliskan MariaDB [(none)]> atau mysql>.',
        },
        {
          title: '2. Buat dan Pilih Database db_loginCashles',
          detail:
            'Ketik CREATE DATABASE IF NOT EXISTS db_loginCashles; lalu aktifkan databasenya dengan perintah USE db_loginCashles;.',
        },
        {
          title: '3. Buat Tabel Pertama: tb_role (Tabel Master Jabatan)',
          detail:
            'Buat tb_role berisi id_role INT AUTO_INCREMENT PRIMARY KEY dan nama_role VARCHAR(50) NOT NULL, lalu akhiri kurung dengan ENGINE=InnoDB;.',
        },
        {
          title: '4. Buat Tabel Kedua: tb_user (Tabel Pengguna & Kartu RFID)',
          detail:
            'Buat tb_user berisi id_user (PRIMARY KEY), rfid VARCHAR(50) NOT NULL UNIQUE, nama VARCHAR(100) NOT NULL, dan id_role INT NOT NULL dengan ENGINE=InnoDB;.',
        },
        {
          title: '5. Isi Data Awal (Seed) & Verifikasi Tabel',
          detail:
            'Masukkan data role super_admin & teller serta kartu 0012345678 & 0087654321 dengan INSERT INTO, lalu cek dengan SHOW TABLES; dan SELECT * FROM tb_user;.',
        },
      ],
      codeBlocks: [
        {
          filename: 'perintah-cli-bab2.sql',
          label: 'Urutan Perintah yang Diketik di MySQL CLI (Bab 2)',
          code: [
            '-- 1. Masuk dari terminal/Shell XAMPP:',
            'mysql -u root',
            '',
            '-- 2. Buat & masuk ke database:',
            'CREATE DATABASE IF NOT EXISTS db_loginCashles;',
            'USE db_loginCashles;',
            '',
            '-- 3. Buat 2 tabel (wajib ENGINE=InnoDB untuk relasi grafis di Bab 3):',
            'CREATE TABLE tb_role (',
            '    id_role INT AUTO_INCREMENT PRIMARY KEY,',
            '    nama_role VARCHAR(50) NOT NULL',
            ') ENGINE=InnoDB;',
            '',
            'CREATE TABLE tb_user (',
            '    id_user INT AUTO_INCREMENT PRIMARY KEY,',
            '    rfid VARCHAR(50) NOT NULL UNIQUE,',
            '    nama VARCHAR(100) NOT NULL,',
            '    id_role INT NOT NULL',
            ') ENGINE=InnoDB;',
            '',
            '-- 4. Isi data awal untuk uji CRUD & Tap Kartu RFID:',
            'INSERT INTO tb_role (id_role, nama_role) VALUES',
            "(1, 'super_admin'),",
            "(2, 'teller');",
            '',
            'INSERT INTO tb_user (rfid, nama, id_role) VALUES',
            "('0012345678', 'Super Admin', 1),",
            "('0087654321', 'Teller 1', 2);",
          ].join('\n'),
        },
        {
          filename: 'db_loginCashles.sql',
          label: 'Isi Lengkap Acuan app-cashless-rfid/db_loginCashles.sql (Setelah Relasi Bab 3)',
          code: [
            'CREATE DATABASE IF NOT EXISTS db_loginCashles;',
            'USE db_loginCashles;',
            '',
            'CREATE TABLE tb_role (',
            '    id_role INT AUTO_INCREMENT PRIMARY KEY,',
            '    nama_role VARCHAR(50) NOT NULL',
            ') ENGINE=InnoDB;',
            '',
            'CREATE TABLE tb_user (',
            '    id_user INT AUTO_INCREMENT PRIMARY KEY,',
            '    rfid VARCHAR(50) NOT NULL UNIQUE,',
            '    nama VARCHAR(100) NOT NULL,',
            '    id_role INT NOT NULL,',
            '    FOREIGN KEY (id_role) REFERENCES tb_role(id_role)',
            '        ON DELETE CASCADE ON UPDATE CASCADE',
            ') ENGINE=InnoDB;',
            '',
            'INSERT INTO tb_role (id_role, nama_role) VALUES',
            "(1, 'super_admin'),",
            "(2, 'teller');",
            '',
            'INSERT INTO tb_user (rfid, nama, id_role) VALUES',
            "('0012345678', 'Super Admin', 1),",
            "('0087654321', 'Teller 1', 2);",
          ].join('\n'),
        },
      ],
      simulatorType: 'mysql-cli',
      simulatorConfig: {
        prompt: 'mysql>',
        suggestedCommands: [
          'CREATE DATABASE db_loginCashles;',
          'USE db_loginCashles;',
          'CREATE TABLE tb_role (id_role INT AUTO_INCREMENT PRIMARY KEY, nama_role VARCHAR(50) NOT NULL) ENGINE=InnoDB;',
          'CREATE TABLE tb_user (id_user INT AUTO_INCREMENT PRIMARY KEY, rfid VARCHAR(50) NOT NULL UNIQUE, nama VARCHAR(100) NOT NULL, id_role INT NOT NULL) ENGINE=InnoDB;',
          "INSERT INTO tb_role (id_role, nama_role) VALUES (1, 'super_admin'), (2, 'teller');",
          "INSERT INTO tb_user (rfid, nama, id_role) VALUES ('0012345678', 'Super Admin', 1), ('0087654321', 'Teller 1', 2);",
        ],
        goalText:
          'Ketik perintah berurutan di terminal virtual: buat database db_loginCashles, pilih dengan USE, buat tabel tb_role dan tb_user (ENGINE=InnoDB), lalu masukkan data awal.',
      },
      fillBlanks: [
        {
          title: 'Latihan 1: Membuat Database & Tabel Master tb_role di CLI',
          mode: 'sql',
          template:
            '{{create_db}} db_loginCashles;\n{{use_db}} db_loginCashles;\n\nCREATE TABLE {{tbl_role}} (\n    id_role INT AUTO_INCREMENT PRIMARY KEY,\n    nama_role VARCHAR(50) NOT NULL\n) ENGINE={{engine}};',
          blanks: [
            {
              id: 'create_db',
              placeholder: 'perintah buat database',
              answers: ['CREATE DATABASE', 'CREATE DATABASE IF NOT EXISTS'],
              hint: 'Gunakan dua kata SQL untuk membuat database baru: CREATE DATABASE',
            },
            {
              id: 'use_db',
              placeholder: 'pilih database aktif',
              answers: ['USE'],
              hint: 'Satu kata bahasa Inggris untuk memakai/masuk ke database: USE',
            },
            {
              id: 'tbl_role',
              placeholder: 'nama tabel jabatan',
              answers: ['tb_role'],
              hint: 'Nama tabel pertama untuk jabatan adalah tb_role.',
            },
            {
              id: 'engine',
              placeholder: 'tipe engine relasi',
              answers: ['InnoDB'],
              hint: 'Engine wajib agar tabel bisa direlasikan dengan Foreign Key (diawali huruf I...).',
            },
          ],
        },
        {
          title: 'Latihan 2: Membuat Tabel tb_user & Data Awal Kartu RFID',
          mode: 'sql',
          template:
            "CREATE TABLE tb_user (\n    id_user INT AUTO_INCREMENT {{pk}},\n    rfid VARCHAR(50) NOT NULL {{uniq}},\n    nama VARCHAR(100) NOT NULL,\n    id_role INT NOT NULL\n) ENGINE=InnoDB;\n\nINSERT INTO tb_user (rfid, nama, id_role) {{vals}}\n('0012345678', 'Super Admin', 1);",
          blanks: [
            {
              id: 'pk',
              placeholder: 'kunci utama',
              answers: ['PRIMARY KEY'],
              hint: 'Penanda kolom identitas unik utama di SQL: PRIMARY KEY',
            },
            {
              id: 'uniq',
              placeholder: 'larang kode RFID kembar',
              answers: ['UNIQUE', 'UNIQUE KEY'],
              hint: 'Kata kunci SQL agar satu nomor kartu RFID tidak boleh ganda: UNIQUE',
            },
            {
              id: 'vals',
              placeholder: 'kata kunci sebelum isi data',
              answers: ['VALUES'],
              hint: 'Setelah daftar kolom pada INSERT INTO (...), tulis kata kunci VALUES',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Terminal CLI Berubah Menjadi Panah "->" Terus',
          buggyCode: 'mysql> CREATE DATABASE db_loginCashles\n    -> ',
          question: 'Setelah menekan Enter, perintah tidak berjalan dan terminal malah menampilkan "->". Apa penyebabnya?',
          options: [
            'Lupa menulis tanda titik koma (;) di akhir perintah SQL',
            'Huruf CREATE harus ditulis huruf kecil semua',
            'Database db_loginCashles harus dibuat di phpMyAdmin dulu',
          ],
          answerIndex: 0,
          explanation:
            'MySQL CLI menganggap perintah belum selesai sampai menemui tanda titik koma (;). Ketik ; lalu Enter untuk menjalankan perintah.',
        },
        {
          title: 'Error 1046: No database selected',
          buggyCode: 'mysql> CREATE DATABASE db_loginCashles;\nQuery OK, 1 row affected\n\nmysql> CREATE TABLE tb_role (id_role INT PRIMARY KEY, nama_role VARCHAR(50));\nERROR 1046 (3D000): No database selected',
          question: 'Database sudah dibuat, mengapa perintah CREATE TABLE langsung ditolak dengan pesan "No database selected"?',
          options: [
            'Tabel tb_role tidak boleh memakai tipe INT',
            'Belum menjalankan perintah USE db_loginCashles; untuk masuk ke dalam database',
            'Kolom nama_role harus bernama role_name',
          ],
          answerIndex: 1,
          explanation:
            'Membuat database saja belum otomatis memilihnya. Kamu wajib mengetik USE db_loginCashles; sebelum membuat tabel.',
        },
        {
          title: 'Gagal Memasukkan Kartu RFID yang Sama Dua Kali',
          buggyCode: "INSERT INTO tb_user (rfid, nama, id_role) VALUES ('0012345678', 'Budi', 2);\nERROR 1062 (23000): Duplicate entry '0012345678' for key 'rfid'",
          question: 'Mengapa MySQL menolak INSERT untuk UID 0012345678 tersebut?',
          options: [
            'Karena panjang UID harus 12 digit',
            'Karena kolom rfid disetel UNIQUE dan UID 0012345678 sudah dipakai oleh Super Admin',
            'Karena id_role 2 tidak boleh memiliki nama Budi',
          ],
          answerIndex: 1,
          explanation:
            'Constraint UNIQUE pada kolom rfid memang berfungsi melindungi agar satu kartu fisik RFID tidak terdaftar pada dua akun pengguna yang berbeda.',
        },
      ],
    },

    {
      id: 3,
      phaseId: 1,
      skemaRef: 'Poin 3: Membuat relasi tabel (grafis- phpmyadmin)',
      title: 'Bab 3: Membuat Relasi Tabel Grafis di phpMyAdmin',
      shortTitle: 'Relasi phpMyAdmin',
      targetFile: 'phpMyAdmin Designer',
      summary:
        'Hubungkan tabel tb_role (induk) ke tb_user (anak) lewat tab Designer phpMyAdmin. Pasang INDEX pada tb_user.id_role sebelum menarik garis relasi.',
      analogy:
        'Foreign Key menjaga id_role di tb_user selalu merujuk ke data yang valid di tb_role. Kolom tb_user.id_role butuh INDEX terlebih dahulu agar relasi bisa dipasang.',
      cheatRule: {
        title: '4 Langkah Designer phpMyAdmin',
        formula: 'Pilih tb_user -> Pasang INDEX di id_role -> Tab Designer -> Tarik PK (tb_role) ke FK (tb_user)',
        points: [
          'Pasang INDEX pada tb_user.id_role di tab Structure sebelum membuka Designer.',
          'Urutan klik: Primary Key (tb_role.id_role) dulu, baru Foreign Key (tb_user.id_role).',
          'Pilih ON DELETE CASCADE dan ON UPDATE CASCADE (kedua tabel wajib ENGINE=InnoDB).',
        ],
      },
      steps: [
        {
          title: '1. Buka phpMyAdmin & Pilih Tabel tb_user',
          detail:
            'Buka http://localhost/phpmyadmin, klik database db_loginCashles di sebelah kiri, lalu klik tabel tb_user dan buka tab Structure.',
        },
        {
          title: '2. Tambahkan INDEX pada Kolom id_role',
          detail:
            'Cari baris kolom id_role di struktur tb_user, klik tombol More -> Index (atau tombol Index di sebelah kanan baris), lalu klik OK.',
        },
        {
          title: '3. Buka Tab Designer -> Create Relationship',
          detail:
            'Klik lagi nama database db_loginCashles (bukan tabelnya), pilih tab Designer di menu atas (atau di dropdown More), lalu klik ikon Create relationship di bilah alat kiri.',
        },
        {
          title: '4. Tarik Garis PK tb_role.id_role ke FK tb_user.id_role',
          detail:
            'Klik kolom id_role di kotak tb_role (Referenced/Primary Key), lalu klik kolom id_role di kotak tb_user (Foreign Key). Pilih CASCADE pada ON DELETE & ON UPDATE lalu klik OK hingga garis penghubung muncul.',
        },
      ],
      codeBlocks: [
        {
          filename: 'efek-relasi-designer.sql',
          label: 'Perintah SQL yang Otomatis Dijalankan phpMyAdmin Saat Kamu Klik Designer',
          code: [
            '-- Langkah 2: Saat kamu klik Index pada kolom tb_user.id_role',
            'ALTER TABLE tb_user ADD INDEX (id_role);',
            '',
            '-- Langkah 4: Saat kamu tarik PK tb_role.id_role -> FK tb_user.id_role (CASCADE)',
            'ALTER TABLE tb_user',
            '    ADD FOREIGN KEY (id_role) REFERENCES tb_role(id_role)',
            '    ON DELETE CASCADE ON UPDATE CASCADE;',
          ].join('\n'),
        },
      ],
      simulatorType: 'phpmyadmin-designer',
      simulatorConfig: {
        steps: [
          {
            actionId: 'select-table-user',
            label: '1. Pilih tb_user (Structure)',
            instruction: 'Buka tabel tb_user di db_loginCashles lalu masuk ke tab Structure.',
          },
          {
            actionId: 'add-index-id-role',
            label: '2. Pasang INDEX pada id_role',
            instruction: 'Pada baris kolom id_role di tb_user, klik Index agar kolom siap menjadi Foreign Key.',
          },
          {
            actionId: 'open-designer-create-rel',
            label: '3. Buka Designer -> Create Relationship',
            instruction: 'Masuk ke tab Designer di db_loginCashles lalu pilih tombol Create relationship.',
          },
          {
            actionId: 'link-pk-to-fk',
            label: '4. Hubungkan PK tb_role -> FK tb_user',
            instruction: 'Klik tb_role.id_role (PK) lalu klik tb_user.id_role (FK) dan pilih CASCADE.',
          },
        ],
      },
      fillBlanks: [
        {
          title: 'Pahami Struktur Relasi yang Dihasilkan phpMyAdmin Designer',
          mode: 'sql',
          template:
            'ALTER TABLE {{child_tbl}} ADD {{idx_kw}} (id_role);\nALTER TABLE tb_user ADD FOREIGN KEY (id_role) REFERENCES {{parent_tbl}}({{pk_col}}) ON DELETE {{cascade_opt}} ON UPDATE CASCADE;',
          blanks: [
            {
              id: 'child_tbl',
              placeholder: 'tabel anak penerima FK',
              answers: ['tb_user'],
              hint: 'Tabel yang menyimpan id_role pengguna adalah tb_user.',
            },
            {
              id: 'idx_kw',
              placeholder: 'syarat wajib sebelum relasi',
              answers: ['INDEX', 'KEY'],
              hint: 'Atribut yang wajib dipasang pada kolom id_role di tb_user sebelum ke tab Designer.',
            },
            {
              id: 'parent_tbl',
              placeholder: 'tabel induk sumber role',
              answers: ['tb_role'],
              hint: 'Tabel master yang berisi daftar super_admin dan teller.',
            },
            {
              id: 'pk_col',
              placeholder: 'kolom PK tujuan',
              answers: ['id_role'],
              hint: 'Nama kolom Primary Key di tb_role yang cocok tipe datanya dengan tb_user.id_role.',
            },
            {
              id: 'cascade_opt',
              placeholder: 'aksi otomatis saat diubah/hapus',
              answers: ['CASCADE'],
              hint: 'Opsi relasi yang menyelaraskan perubahan secara otomatis (dimulai huruf C...).',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Error "Missing index on column(s)" di Tab Designer',
          buggyCode: 'Aksi: Designer -> Create relationship\nKlik 1: tb_role.id_role\nKlik 2: tb_user.id_role\nPesan phpMyAdmin: "Error: Missing index on column(s)!"',
          question: 'Mengapa phpMyAdmin menolak menarik garis relasi ke tb_user.id_role?',
          options: [
            'Kolom tb_user.id_role belum diberi INDEX di tab Structure',
            'Database harus diberi nama db_cashless_v2',
            'Kolom nama di tb_user terlalu panjang',
          ],
          answerIndex: 0,
          explanation:
            'Syarat wajib Foreign Key di MySQL/phpMyAdmin adalah kolom Foreign Key (tb_user.id_role) harus memiliki INDEX terlebih dahulu.',
        },
        {
          title: 'Tombol Create Relationship Gagal Karena Engine Tabel',
          buggyCode: 'CREATE TABLE tb_role (...) ENGINE=MyISAM;\nCREATE TABLE tb_user (...) ENGINE=MyISAM;',
          question: 'Sudah dipasang INDEX pada id_role, tetapi relasi Foreign Key tetap tidak bisa dibuat di phpMyAdmin. Apa penyebabnya?',
          options: [
            'Kedua tabel masih menggunakan ENGINE=MyISAM, padahal relasi Foreign Key wajib ENGINE=InnoDB',
            'Baris data pada tb_user masih terlalu sedikit',
            'Browser harus diganti menjadi Internet Explorer',
          ],
          answerIndex: 0,
          explanation:
            'Engine MyISAM tidak mendukung fitur relasi Foreign Key. Ubah engine kedua tabel ke InnoDB (Operations -> Storage Engine -> InnoDB atau sejak awal di CLI tulis ENGINE=InnoDB).',
        },
        {
          title: 'Salah Urutan Klik Primary Key dan Foreign Key',
          buggyCode: 'Klik 1 (Referenced): tb_user.id_role\nKlik 2 (Foreign): tb_role.id_role',
          question: 'Mengapa urutan klik di Designer itu terbalik dan membahayakan integritas data?',
          options: [
            'Tidak masalah, arah klik boleh dibolak-balik',
            'Yang diklik pertama harus Primary Key tabel induk (tb_role.id_role), lalu Foreign Key tabel anak (tb_user.id_role)',
            'Yang diklik pertama harus kolom tb_user.nama',
          ],
          answerIndex: 1,
          explanation:
            'Di phpMyAdmin Designer, klik pertama adalah kolom sumber Primary Key (tb_role.id_role), dan klik kedua adalah kolom tujuan Foreign Key (tb_user.id_role).',
        },
      ],
    },

    {
      id: 4,
      phaseId: 2,
      skemaRef: 'Poin 4: Membuat file koneksi',
      title: 'Bab 4: Membuat File Koneksi Database (koneksi.php)',
      shortTitle: 'File Koneksi',
      targetFile: 'koneksi.php',
      summary:
        'File koneksi.php menghubungkan PHP ke database MySQL db_loginCashles dalam 6 baris kode, lalu dipanggil file lain memakai include "koneksi.php";.',
      analogy:
        'mysqli_connect membutuhkan 4 parameter berurutan: alamat host ("localhost"), user ("root"), password (""), dan nama database ("db_loginCashles").',
      cheatRule: {
        title: '4 Parameter mysqli_connect',
        formula: '$koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles");',
        points: [
          'Urutan parameter: ("host", "user", "password", "nama_database").',
          'Password XAMPP standar adalah "" tanpa spasi.',
          'Tambahkan if (!$koneksi) { die("Koneksi gagal: " . mysqli_connect_error()); } untuk mengecek error.',
        ],
      },
      steps: [
        {
          title: '1. Buat File koneksi.php di Folder cashless/',
          detail: 'Pastikan penulisan nama file huruf kecil semua: koneksi.php.',
        },
        {
          title: '2. Panggil Fungsi Prosedural mysqli_connect',
          detail:
            'Tulis $koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles"); sesuai nama database di Bab 2.',
        },
        {
          title: '3. Pasang Pengecek Koneksi Gagal',
          detail:
            'Tulis if (!$koneksi) { die("Koneksi gagal: " . mysqli_connect_error()); } untuk mempermudah pelacakan jika ada salah ketik nama database.',
        },
        {
          title: '4. Uji di Browser Lewat localhost',
          detail:
            'Buka http://localhost/cashless/koneksi.php. Jika halaman tampil putih polos tanpa tulisan error apa pun, tandanya koneksi SUKSES!',
        },
      ],
      codeBlocks: [
        {
          filename: 'koneksi.php',
          label: 'Kode Lengkap app-cashless-rfid/koneksi.php (6 Baris)',
          code: [
            '<?php',
            '$koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles");',
            '',
            'if (!$koneksi) {',
            '    die("Koneksi gagal: " . mysqli_connect_error());',
            '}',
          ].join('\n'),
          previewHtml:
            '<p><em>(Layar browser putih bersih tanpa pesan error = Koneksi ke database <b>db_loginCashles</b> BERHASIL!)</em></p>',
        },
      ],
      simulatorType: 'crud-flow',
      simulatorConfig: {
        focusMode: 'koneksi',
        title: 'Simulasi Jembatan Koneksi PHP -> MySQL',
        description:
          'Lihat bagaimana 4 parameter mysqli_connect membuka jalur ke db_loginCashles sehingga file lain cukup memanggil include "koneksi.php";.',
      },
      fillBlanks: [
        {
          title: 'Lengkapi Rumus 4 Parameter koneksi.php',
          mode: 'php',
          template:
            '<?php\n$koneksi = {{fn}}("{{host}}", "{{user}}", "", "{{db}}");\n\nif (!$koneksi) {\n    die("Koneksi gagal: " . {{err_fn}}());\n}',
          blanks: [
            {
              id: 'fn',
              placeholder: 'fungsi koneksi mysqli',
              answers: ['mysqli_connect'],
              hint: 'Fungsi PHP prosedural untuk menyambung ke MySQL: mysqli_connect',
            },
            {
              id: 'host',
              placeholder: 'alamat server',
              answers: ['localhost', '127.0.0.1'],
              hint: 'Nama host komputer sendiri di XAMPP adalah localhost',
            },
            {
              id: 'user',
              placeholder: 'username MySQL',
              answers: ['root'],
              hint: 'Username bawaan MySQL di XAMPP adalah root',
            },
            {
              id: 'db',
              placeholder: 'nama database',
              answers: ['db_loginCashles'],
              hint: 'Harus persis sama dengan nama database di Bab 2: db_loginCashles',
            },
            {
              id: 'err_fn',
              placeholder: 'fungsi pesan error koneksi',
              answers: ['mysqli_connect_error'],
              hint: 'Fungsi untuk menampilkan penyebab koneksi gagal: mysqli_connect_error',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Access Denied Karena Spasi di Password',
          buggyCode: '<?php\n$koneksi = mysqli_connect("localhost", "root", " ", "db_loginCashles");',
          question: 'Mengapa muncul error "Access denied for user \'root\'@\'localhost\' (using password: YES)"?',
          options: [
            'Karena ada spasi di dalam tanda kutip password (" "), padahal seharusnya kosong tanpa spasi ("")',
            'Karena user XAMPP bawaan bernama admin',
            'Karena kurang tanda ?> di akhir file',
          ],
          answerIndex: 0,
          explanation:
            'Tanda kutip berisi spasi (" ") tetap dianggap password sepanjang 1 karakter oleh MySQL. Di XAMPP tanpa password, tulis "" tanpa spasi.',
        },
        {
          title: 'Urutan Parameter Tertukar',
          buggyCode: '<?php\n$koneksi = mysqli_connect("localhost", "db_loginCashles", "root", "");',
          question: 'Error "Unknown MySQL server" atau "Access denied" muncul karena parameter mysqli_connect tertukar. Mana urutan yang benar?',
          options: [
            '("nama_db", "localhost", "root", "")',
            '("localhost", "root", "", "db_loginCashles")',
            '("root", "", "localhost", "db_loginCashles")',
          ],
          answerIndex: 1,
          explanation:
            'Rumus 4 parameter selalu berurutan: Host ("localhost"), User ("root"), Password (""), lalu Nama Database ("db_loginCashles").',
        },
        {
          title: 'Salah Menyangka Layar Putih Itu Error',
          buggyCode: '// Membuka http://localhost/cashless/koneksi.php\n// Hasil di browser: Halaman putih kosong tanpa teks',
          question: 'Ketika koneksi.php dibuka di browser, tidak muncul tulisan apa pun. Apa kesimpulannya?',
          options: [
            'File koneksi.php rusak dan gagal terhubung',
            'Koneksi ke database db_loginCashles BERHASIL karena blok if (!$koneksi) tidak terpanggil',
            'XAMPP belum di-restart',
          ],
          answerIndex: 1,
          explanation:
            'File koneksi.php memang hanya berisi logika penyambungan tanpa HTML. Jika tidak ada pesan error yang tercetak, berarti sambungan ke MySQL berhasil.',
        },
      ],
    },

    {
      id: 5,
      phaseId: 2,
      skemaRef: 'Poin 5: membuat beranda',
      title: 'Bab 5: Membuat Halaman Beranda & Proteksi Session (beranda.php)',
      shortTitle: 'Halaman Beranda',
      targetFile: 'beranda.php',
      summary:
        'Halaman beranda.php dibuka setelah login RFID. Baris teratas wajib mengecek session agar pengunjung yang belum login diarahkan balik ke login.php.',
      analogy:
        'Session menyimpan tanda login di server. Jika $_SESSION["id_user"] kosong, header("Location: login.php") langsung mengembalikan pengguna ke halaman login.',
      cheatRule: {
        title: 'Cek Session di Awal Halaman',
        formula: 'session_start(); -> if (!isset($_SESSION["id_user"])) { header("Location: login.php"); exit; }',
        points: [
          'Tulis session_start(); di baris pertama sebelum HTML.',
          'Gunakan key sesi yang sama dengan login.php: id_user, nama, nama_role.',
          'Sediakan tautan ke tampil.php, tambah.php, dan logout.php.',
        ],
      },
      steps: [
        {
          title: '1. Aktifkan Session & Pasang Satpam Penjaga',
          detail:
            'Di baris teratas beranda.php, tulis session_start(); diikuti pengecekan if (!isset($_SESSION[\'id_user\'])) untuk mengarahkan ke login.php.',
        },
        {
          title: '2. Tulis Kerangka HTML Polos Tanpa CSS',
          detail:
            'Buat tag HTML sederhana dengan judul <h2>Beranda Aplikasi Cashless RFID</h2> agar mudah dan cepat diketik saat ujian.',
        },
        {
          title: '3. Sapa Pengguna yang Sedang Login',
          detail:
            'Tampilkan $_SESSION[\'nama\'] dan $_SESSION[\'nama_role\'] memakai htmlspecialchars(...) agar pengguna tahu akun mana yang sedang aktif.',
        },
        {
          title: '4. Sediakan Menu Navigasi CRUD & Logout',
          detail:
            'Buat daftar link <ul> menuju tampil.php (Lihat Data Pengguna), tambah.php (Tambah Pengguna), dan logout.php (Logout).',
        },
      ],
      codeBlocks: [
        {
          filename: 'beranda.php',
          label: 'Kode Lengkap app-cashless-rfid/beranda.php (20 Baris)',
          code: [
            '<?php',
            'session_start();',
            "if (!isset($_SESSION['id_user'])) {",
            '    header("Location: login.php");',
            '    exit;',
            '}',
            '?>',
            '<!DOCTYPE html>',
            '<html>',
            '<head><title>Beranda</title></head>',
            '<body>',
            '    <h2>Beranda Aplikasi Cashless RFID</h2>',
            "    <p>Selamat datang, <b><?= htmlspecialchars($_SESSION['nama']) ?></b> (<?= htmlspecialchars($_SESSION['nama_role']) ?>)</p>",
            '    <ul>',
            '        <li><a href="tampil.php">Lihat Data Pengguna</a></li>',
            '        <li><a href="tambah.php">Tambah Pengguna</a></li>',
            '        <li><a href="logout.php">Logout</a></li>',
            '    </ul>',
            '</body>',
            '</html>',
          ].join('\n'),
          previewHtml: [
            '<h2>Beranda Aplikasi Cashless RFID</h2>',
            '<p>Selamat datang, <b>Super Admin</b> (super_admin)</p>',
            '<ul>',
            '    <li><a href="#tampil">Lihat Data Pengguna</a></li>',
            '    <li><a href="#tambah">Tambah Pengguna</a></li>',
            '    <li><a href="#logout">Logout</a></li>',
            '</ul>',
          ].join('\n'),
        },
      ],
      simulatorType: 'crud-flow',
      simulatorConfig: {
        focusMode: 'beranda',
        title: 'Simulasi Penjaga Session Beranda',
        description:
          'Amati perbedaan saat pengunjung membuka beranda.php tanpa sesi (langsung dilempar ke login.php) versus setelah membawa $_SESSION["id_user"].',
      },
      fillBlanks: [
        {
          title: 'Lengkapi Proteksi Session & Sapaan di beranda.php',
          mode: 'php',
          template:
            "<?php\n{{sess_start}};\nif (!isset($_SESSION['{{key_id}}'])) {\n    header(\"Location: {{redir_login}}\");\n    exit;\n}\n?>\n<p>Selamat datang, <b><?= htmlspecialchars($_SESSION['{{key_nama}}']) ?></b> (<?= htmlspecialchars($_SESSION['{{key_role}}']) ?>)</p>",
          blanks: [
            {
              id: 'sess_start',
              placeholder: 'aktifkan session PHP',
              answers: ['session_start()'],
              hint: 'Fungsi wajib di baris paling atas sebelum membaca $_SESSION: session_start()',
            },
            {
              id: 'key_id',
              placeholder: 'kunci sesi ID user',
              answers: ['id_user'],
              hint: 'Nama kolom ID di tb_user yang disimpan saat login: id_user',
            },
            {
              id: 'redir_login',
              placeholder: 'tujuan jika belum login',
              answers: ['login.php'],
              hint: 'Jika belum login, pengguna diarahkan kembali ke halaman login.php',
            },
            {
              id: 'key_nama',
              placeholder: 'kunci sesi nama',
              answers: ['nama'],
              hint: 'Kunci $_SESSION untuk nama pengguna adalah nama',
            },
            {
              id: 'key_role',
              placeholder: 'kunci sesi role',
              answers: ['nama_role'],
              hint: 'Kunci $_SESSION hasil JOIN dari tb_role adalah nama_role',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Lupa Memanggil session_start()',
          buggyCode: "<?php\nif (!isset($_SESSION['id_user'])) {\n    header(\"Location: login.php\");\n    exit;\n}\n?>",
          question: 'Sudah tap kartu RFID dan berhasil login, tetapi saat masuk beranda.php selalu terlempar balik ke login.php disertai warning Undefined variable $_SESSION. Kenapa?',
          options: [
            'Lupa menulis session_start(); sebelum mengakses $_SESSION',
            'Nama file harus beranda_admin.php',
            'Harus memanggil include "koneksi.php" di baris paling bawah',
          ],
          answerIndex: 0,
          explanation:
            'Tanpa session_start(); di baris atas, PHP tidak membaca data sesi yang sudah dibuat oleh login.php.',
        },
        {
          title: 'Salah Nama Key Session',
          buggyCode: "// Di login.php tertulis: $_SESSION['id_user'] = $data['id_user'];\n// Di beranda.php tertulis:\nif (!isset($_SESSION['user_id'])) {\n    header(\"Location: login.php\");\n    exit;\n}",
          question: 'Mengapa user tidak pernah bisa masuk ke beranda.php meskipun sudah login sukses?',
          options: [
            'Key sesi tidak cocok: login.php mengisi "id_user", sedangkan beranda.php mengecek "user_id"',
            'Fungsi isset tidak bisa dipakai pada array $_SESSION',
            'Tanda seru (!) di depan isset harus dihapus',
          ],
          answerIndex: 0,
          explanation:
            'Nama key pada $_SESSION harus konsisten di semua file: gunakan "id_user", "nama", dan "nama_role".',
        },
        {
          title: 'Lupa Menulis exit; Setelah Redirect Header',
          buggyCode: "if (!isset($_SESSION['id_user'])) {\n    header(\"Location: login.php\");\n}\n// HTML rahasia di bawah tetap diproses PHP!",
          question: 'Mengapa setelah header("Location: login.php"); sangat disarankan langsung menulis exit;?',
          options: [
            'Supaya koneksi MySQL ikut terhapus',
            'Supaya PHP langsung menghentikan eksekusi skrip di halaman tersebut tanpa memproses HTML/query di bawahnya',
            'Supaya browser otomatis menutup tab',
          ],
          answerIndex: 1,
          explanation:
            'header("Location: ...") hanya mengirim instruksi pindah ke browser; tanpa exit;, PHP tetap menjalankan sisa kode di bawahnya.',
        },
      ],
    },

    {
      id: 6,
      phaseId: 2,
      skemaRef: 'Poin 6: membuat halaman tampil data',
      title: 'Bab 6: Membuat Halaman Tampil Data Berelasi (tampil.php)',
      shortTitle: 'Tampil Data (Read)',
      targetFile: 'tampil.php',
      summary:
        'Halaman tampil.php mengambil data tb_user yang digabung dengan tb_role memakai JOIN agar nama_role tampil di tabel HTML beserta link Edit dan Hapus.',
      analogy:
        'Tabel tb_user hanya menyimpan angka id_role. Query JOIN mencocokkan id_role ke tb_role untuk mengambil teks nama_role, lalu while mencetak semua barisnya.',
      cheatRule: {
        title: 'JOIN + while + Link ?id=',
        formula: 'SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role',
        points: [
          'Pakai JOIN tb_role ON tb_user.id_role = tb_role.id_role agar $row["nama_role"] terbaca.',
          'Pakai perulangan while ($row = mysqli_fetch_assoc($query)), bukan if.',
          'Kirim ID baris lewat URL: edit.php?id=<?= $row["id_user"] ?> dan hapus.php?id=<?= $row["id_user"] ?>.',
        ],
      },
      steps: [
        {
          title: '1. Pasang Session Guard & Include Koneksi',
          detail:
            'Tulis session_start(), cek $_SESSION[\'id_user\'], lalu panggil include \'koneksi.php\'; agar variabel $koneksi siap dipakai.',
        },
        {
          title: '2. Jalankan Query SELECT JOIN',
          detail:
            'Eksekusi mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role ORDER BY tb_user.id_user ASC");.',
        },
        {
          title: '3. Buat Kerangka Tabel HTML Polos',
          detail:
            'Buat <table border="1" cellpadding="6" cellspacing="0"> berisi baris judul <th>: No, Kode RFID, Nama, Role, dan Aksi.',
        },
        {
          title: '4. Cetak Baris Data dengan while ($row = mysqli_fetch_assoc($query))',
          detail:
            'Siapkan nomor urut $no = 1; lalu di dalam loop cetak $no++, $row[\'rfid\'], $row[\'nama\'], dan $row[\'nama_role\'].',
        },
        {
          title: '5. Pasang Link Edit & Hapus dengan Parameter ?id=',
          detail:
            'Tambahkan tautan edit.php?id=<?= $row[\'id_user\'] ?> dan hapus.php?id=<?= $row[\'id_user\'] ?> dilengkapi onclick="return confirm(\'Yakin hapus?\')".',
        },
      ],
      codeBlocks: [
        {
          filename: 'tampil.php',
          label: 'Kode Lengkap app-cashless-rfid/tampil.php (39 Baris)',
          code: [
            '<?php',
            'session_start();',
            "if (!isset($_SESSION['id_user'])) {",
            '    header("Location: login.php");',
            '    exit;',
            '}',
            "include 'koneksi.php';",
            '',
            '$query = mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role ORDER BY tb_user.id_user ASC");',
            '?>',
            '<!DOCTYPE html>',
            '<html>',
            '<head><title>Data Pengguna</title></head>',
            '<body>',
            '    <h2>Data Pengguna RFID</h2>',
            '    <p><a href="tambah.php">+ Tambah Data</a> | <a href="beranda.php">Kembali ke Beranda</a></p>',
            '    <table border="1" cellpadding="6" cellspacing="0">',
            '        <tr>',
            '            <th>No</th>',
            '            <th>Kode RFID</th>',
            '            <th>Nama</th>',
            '            <th>Role</th>',
            '            <th>Aksi</th>',
            '        </tr>',
            '        <?php $no = 1; while ($row = mysqli_fetch_assoc($query)) { ?>',
            '        <tr>',
            '            <td><?= $no++ ?></td>',
            "            <td><?= htmlspecialchars($row['rfid']) ?></td>",
            "            <td><?= htmlspecialchars($row['nama']) ?></td>",
            "            <td><?= htmlspecialchars($row['nama_role']) ?></td>",
            '            <td>',
            '                <a href="edit.php?id=<?= $row[\'id_user\'] ?>">Edit</a> |',
            '                <a href="hapus.php?id=<?= $row[\'id_user\'] ?>" onclick="return confirm(\'Yakin hapus?\')">Hapus</a>',
            '            </td>',
            '        </tr>',
            '        <?php } ?>',
            '    </table>',
            '</body>',
            '</html>',
          ].join('\n'),
          previewHtml: [
            '<h2>Data Pengguna RFID</h2>',
            '<p><a href="#tambah">+ Tambah Data</a> | <a href="#beranda">Kembali ke Beranda</a></p>',
            '<table border="1" cellpadding="6" cellspacing="0">',
            '    <tr><th>No</th><th>Kode RFID</th><th>Nama</th><th>Role</th><th>Aksi</th></tr>',
            '    <tr><td>1</td><td>0012345678</td><td>Super Admin</td><td>super_admin</td><td><a href="#edit1">Edit</a> | <a href="#hapus1">Hapus</a></td></tr>',
            '    <tr><td>2</td><td>0087654321</td><td>Teller 1</td><td>teller</td><td><a href="#edit2">Edit</a> | <a href="#hapus2">Hapus</a></td></tr>',
            '</table>',
          ].join('\n'),
        },
      ],
      simulatorType: 'crud-flow',
      simulatorConfig: {
        focusMode: 'tampil',
        title: 'Simulasi Query JOIN & Perulangan Data Tabel',
        description:
          'Lihat bagaimana query JOIN menggabungkan tb_user dengan tb_role dan mencetak baris demi baris tabel lengkap dengan URL ?id= masing-masing.',
      },
      fillBlanks: [
        {
          title: 'Lengkapi Query JOIN & Perulangan Baris Tabel di tampil.php',
          mode: 'php',
          template:
            '$query = {{fn_query}}($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user {{join_kw}} tb_role ON tb_user.id_role = tb_role.id_role ORDER BY tb_user.id_user ASC");\nwhile ($row = {{fn_fetch}}($query)) {\n    echo $row[\'{{col_role}}\'];\n}',
          blanks: [
            {
              id: 'fn_query',
              placeholder: 'fungsi eksekusi SQL',
              answers: ['mysqli_query'],
              hint: 'Fungsi PHP untuk mengirim perintah SQL melalui $koneksi: mysqli_query',
            },
            {
              id: 'join_kw',
              placeholder: 'gabung 2 tabel',
              answers: ['JOIN', 'INNER JOIN'],
              hint: 'Kata kunci SQL untuk menggabungkan tb_user dan tb_role: JOIN',
            },
            {
              id: 'fn_fetch',
              placeholder: 'ambil 1 baris array asosiatif',
              answers: ['mysqli_fetch_assoc'],
              hint: 'Fungsi untuk mengambil baris hasil query sebagai array bernama kolom: mysqli_fetch_assoc',
            },
            {
              id: 'col_role',
              placeholder: 'nama kolom teks jabatan',
              answers: ['nama_role'],
              hint: 'Kolom teks jabatan di tb_role adalah nama_role',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Warning: Undefined array key "nama_role"',
          buggyCode: '$query = mysqli_query($koneksi, "SELECT * FROM tb_user");\nwhile ($row = mysqli_fetch_assoc($query)) {\n    echo $row[\'nama_role\'];\n}',
          question: 'Kenapa muncul warning Undefined array key "nama_role" saat tampil.php dijalankan?',
          options: [
            'Karena query baru mengambil dari tb_user saja, belum di-JOIN dengan tb_role',
            'Karena harus memakai mysqli_fetch_row bukan mysqli_fetch_assoc',
            'Karena kolom nama_role bertipe INT',
          ],
          answerIndex: 0,
          explanation:
            'Tabel tb_user hanya punya kolom id_role (angka), bukan nama_role. Wajib tambahkan JOIN tb_role ON tb_user.id_role = tb_role.id_role.',
        },
        {
          title: 'Data yang Muncul di Tabel Cuma 1 Baris',
          buggyCode: '<?php $no = 1; if ($row = mysqli_fetch_assoc($query)) { ?>\n<tr><td><?= $no++ ?></td><td><?= $row[\'nama\'] ?></td></tr>\n<?php } ?>',
          question: 'Di database ada banyak pengguna, namun di tabel tampil.php hanya tampil baris pertama saja. Apa penyebabnya?',
          options: [
            'Lupa memberi ORDER BY DESC',
            'Memakai percabangan if bukan perulangan while untuk mysqli_fetch_assoc',
            'Tag <table> lupa diberi border="1"',
          ],
          answerIndex: 1,
          explanation:
            'if hanya membaca satu baris sekali jalan. Untuk membaca seluruh baris sampai habis, harus memakai while ($row = mysqli_fetch_assoc($query)).',
        },
        {
          title: 'Nama Parameter URL Edit & Hapus Tidak Nyambung',
          buggyCode: '<a href="edit.php?id_user=<?= $row[\'id_user\'] ?>">Edit</a>\n// Sedangkan edit.php membaca: $_GET[\'id\']',
          question: 'Ketika tombol Edit diklik, halaman langsung terpental balik ke tampil.php tanpa menampilkan form edit. Mengapa?',
          options: [
            'Nama parameter di URL adalah ?id_user=, sedangkan edit.php mencari $_GET["id"]',
            'Tombol Edit harus menggunakan method POST',
            'Tag <a> tidak boleh diletakkan di dalam <td>',
          ],
          answerIndex: 0,
          explanation:
            'Parameter setelah tanda tanya (?) di link harus sama persis dengan key di $_GET: ubah link menjadi edit.php?id=<?= $row["id_user"] ?>.',
        },
      ],
    },

    {
      id: 7,
      phaseId: 3,
      skemaRef: 'Poin 7: Membuat form tambah data, dengan proses tambah di halaman berbeda/sama',
      title: 'Bab 7: Form Tambah Data (tambah.php & proses_tambah.php)',
      shortTitle: 'Tambah Data (Create)',
      targetFile: 'tambah.php & proses_tambah.php',
      summary:
        'Form tambah data menyimpan input rfid, nama, dan id_role ke tb_user. Bisa diproses di halaman yang sama (tambah.php) atau file terpisah (proses_tambah.php).',
      analogy:
        'Pada halaman sama, <form method="POST"> mengirim data ke dirinya sendiri lalu dicek isset($_POST["simpan"]). Pada halaman berbeda, <form action="proses_tambah.php"> mengirim input ke file proses.',
      cheatRule: {
        title: 'Tambah Data: $_POST + INSERT INTO + Redirect',
        formula: 'if (isset($_POST["simpan"])) { mysqli_query($koneksi, "INSERT INTO tb_user (rfid, nama, id_role) VALUES (\'$rfid\', \'$nama\', \'$id_role\')"); }',
        points: [
          'Halaman sama: <form method="POST"> tanpa action, logika INSERT ditaruh di atas tambah.php.',
          'Halaman berbeda: tambahkan action="proses_tambah.php" dan pindahkan INSERT ke proses_tambah.php.',
          'Isi opsi <select name="id_role"> dari query SELECT * FROM tb_role agar cocok dengan Foreign Key.',
        ],
      },
      steps: [
        {
          title: '1. Siapkan Session Guard & Include Koneksi di tambah.php',
          detail:
            'Awali tambah.php dengan session_start(), proteksi $_SESSION[\'id_user\'], dan include \'koneksi.php\';.',
        },
        {
          title: '2. Cara 1 (Halaman Sama): Cek if (isset($_POST[\'simpan\']))',
          detail:
            'Ambil $_POST[\'rfid\'], $_POST[\'nama\'], dan (int) $_POST[\'id_role\'], lalu jalankan INSERT INTO tb_user (rfid, nama, id_role) VALUES (...). Jika berhasil, header("Location: tampil.php"); exit;.',
        },
        {
          title: '3. Ambil Daftar Role untuk <select name="id_role">',
          detail:
            'Jalankan $roles = mysqli_query($koneksi, "SELECT * FROM tb_role"); lalu tampilkan di dalam loop while ($r = mysqli_fetch_assoc($roles)) menjadi <option value="<?= $r[\'id_role\'] ?>">. ',
        },
        {
          title: '4. Buat Form HTML Polos dengan method="POST"',
          detail:
            'Pastikan atribut name setiap input persis: name="rfid", name="nama", name="id_role", dan tombol submit name="simpan".',
        },
        {
          title: '5. Cara 2 (Halaman Berbeda): Buat proses_tambah.php',
          detail:
            'Jika diminta memisah halaman proses, tambahkan action="proses_tambah.php" pada <form method="POST"> di tambah.php, dan simpan query INSERT + redirect di dalam proses_tambah.php.',
        },
      ],
      codeBlocks: [
        {
          filename: 'tambah.php',
          label: 'Cara 1 (Halaman Sama — Utama): app-cashless-rfid/tambah.php (45 Baris)',
          code: [
            '<?php',
            'session_start();',
            "if (!isset($_SESSION['id_user'])) {",
            '    header("Location: login.php");',
            '    exit;',
            '}',
            "include 'koneksi.php';",
            '',
            "$pesan = '';",
            "if (isset($_POST['simpan'])) {",
            "    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));",
            "    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));",
            "    $id_role = (int) $_POST['id_role'];",
            '    $simpan = mysqli_query($koneksi, "INSERT INTO tb_user (rfid, nama, id_role) VALUES (\'$rfid\', \'$nama\', \'$id_role\')");',
            '    if ($simpan) {',
            '        header("Location: tampil.php");',
            '        exit;',
            '    } else {',
            '        $pesan = "Gagal menyimpan: " . mysqli_error($koneksi);',
            '    }',
            '}',
            '$roles = mysqli_query($koneksi, "SELECT * FROM tb_role");',
            '?>',
            '<!DOCTYPE html>',
            '<html>',
            '<head><title>Tambah Pengguna</title></head>',
            '<body>',
            '    <h2>Tambah Pengguna RFID</h2>',
            '    <?php if ($pesan != \'\') echo "<p>" . htmlspecialchars($pesan) . "</p>"; ?>',
            '    <form method="POST">',
            '        <label>Kode RFID:</label><br>',
            '        <input type="text" name="rfid" required><br><br>',
            '        <label>Nama:</label><br>',
            '        <input type="text" name="nama" required><br><br>',
            '        <label>Role:</label><br>',
            '        <select name="id_role" required>',
            '            <?php while ($r = mysqli_fetch_assoc($roles)) { ?>',
            "            <option value=\"<?= $r['id_role'] ?>\"><?= htmlspecialchars($r['nama_role']) ?></option>",
            '            <?php } ?>',
            '        </select><br><br>',
            '        <button type="submit" name="simpan">Simpan</button>',
            '        <a href="tampil.php">Batal</a>',
            '    </form>',
            '</body>',
            '</html>',
          ].join('\n'),
          previewHtml: [
            '<h2>Tambah Pengguna RFID</h2>',
            '<form>',
            '    <label>Kode RFID:</label><br>',
            '    <input type="text" placeholder="Contoh: 0099887766"><br><br>',
            '    <label>Nama:</label><br>',
            '    <input type="text" placeholder="Nama lengkap"><br><br>',
            '    <label>Role:</label><br>',
            '    <select><option>super_admin</option><option>teller</option></select><br><br>',
            '    <button type="button">Simpan</button> <a href="#tampil">Batal</a>',
            '</form>',
          ].join('\n'),
        },
        {
          filename: 'proses_tambah.php',
          label: 'Cara 2 (Halaman Berbeda — Alternatif): app-cashless-rfid/proses_tambah.php (17 Baris)',
          code: [
            '<?php',
            'session_start();',
            "if (!isset($_SESSION['id_user'])) {",
            '    header("Location: login.php");',
            '    exit;',
            '}',
            "include 'koneksi.php';",
            '',
            "if (isset($_POST['simpan'])) {",
            "    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));",
            "    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));",
            "    $id_role = (int) $_POST['id_role'];",
            '    mysqli_query($koneksi, "INSERT INTO tb_user (rfid, nama, id_role) VALUES (\'$rfid\', \'$nama\', \'$id_role\')");',
            '}',
            '',
            'header("Location: tampil.php");',
            'exit;',
          ].join('\n'),
        },
      ],
      simulatorType: 'crud-flow',
      simulatorConfig: {
        focusMode: 'tambah',
        title: 'Simulasi Create: Form POST -> INSERT INTO tb_user',
        description:
          'Isi simulasi kode RFID, nama, dan role lalu tekan Simpan untuk melihat query INSERT dijalankan dan baris baru muncul di tabel.',
      },
      fillBlanks: [
        {
          title: 'Latihan 1: Logika Penyimpanan INSERT di tambah.php',
          mode: 'php',
          template:
            "if (isset($_POST['{{btn_save}}'])) {\n    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));\n    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));\n    $id_role = (int) $_POST['{{field_role}}'];\n    $simpan = mysqli_query($koneksi, \"{{sql_ins}} tb_user (rfid, nama, id_role) VALUES ('$rfid', '$nama', '$id_role')\");\n    if ($simpan) {\n        header(\"Location: {{redir_ok}}\");\n        exit;\n    }\n}",
          blanks: [
            {
              id: 'btn_save',
              placeholder: 'nama tombol submit',
              answers: ['simpan'],
              hint: 'Harus cocok dengan name="..." pada <button type="submit">: simpan',
            },
            {
              id: 'field_role',
              placeholder: 'nama select role',
              answers: ['id_role'],
              hint: 'Nama atribut select untuk memilih jabatan: id_role',
            },
            {
              id: 'sql_ins',
              placeholder: 'perintah tambah SQL',
              answers: ['INSERT INTO'],
              hint: 'Dua kata SQL untuk menambah baris baru: INSERT INTO',
            },
            {
              id: 'redir_ok',
              placeholder: 'halaman tujuan sukses',
              answers: ['tampil.php'],
              hint: 'Setelah data berhasil ditambah, arahkan ke halaman daftar: tampil.php',
            },
          ],
        },
        {
          title: 'Latihan 2: Menghubungkan Form ke Halaman Berbeda (proses_tambah.php)',
          mode: 'exact',
          template:
            '<form method="{{meth}}" action="{{target_file}}">\n    <input type="text" name="{{f_rfid}}" required>\n    <button type="submit" name="{{f_btn}}">Simpan</button>\n</form>',
          blanks: [
            {
              id: 'meth',
              placeholder: 'metode kirim form',
              answers: ['POST', 'post', 'Post'],
              hint: 'Karena di PHP dibaca via $_POST, method form wajib POST',
            },
            {
              id: 'target_file',
              placeholder: 'file pemroses terpisah',
              answers: ['proses_tambah.php'],
              hint: 'Nama file proses terpisah di proyek acuan: proses_tambah.php',
            },
            {
              id: 'f_rfid',
              placeholder: 'name input RFID',
              answers: ['rfid'],
              hint: 'Key yang dibaca di PHP adalah $_POST["rfid"]',
            },
            {
              id: 'f_btn',
              placeholder: 'name tombol simpan',
              answers: ['simpan'],
              hint: 'Key yang dicek di PHP adalah isset($_POST["simpan"])',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Form Dikirim Tapi Data Tidak Pernah Tersimpan',
          buggyCode: '<form>\n    <input type="text" name="rfid" required>\n    <input type="text" name="nama" required>\n    <button type="submit" name="simpan">Simpan</button>\n</form>',
          question: 'Kode PHP memakai if (isset($_POST["simpan"])), namun setelah tombol Simpan diklik data tidak tersimpan dan URL berubah menjadi tambah.php?rfid=...&simpan=. Mengapa?',
          options: [
            'Tag <form> lupa diberi method="POST" sehingga browser mengirimnya via GET',
            'Tombol harus memakai tag <a> bukan <button>',
            'Input required melarang pengiriman ke database',
          ],
          answerIndex: 0,
          explanation:
            'Secara bawaan HTML, <form> tanpa atribut method otomatis memakai method="GET", sehingga $_POST tetap kosong.',
        },
        {
          title: 'Atribut name Form Tidak Sama dengan $_POST',
          buggyCode: '<!-- Di HTML tambah.php -->\n<input type="text" name="kode_rfid" required>\n\n// Di PHP:\n$rfid = $_POST[\'rfid\'];',
          question: 'Error "Undefined array key \'rfid\'" muncul saat form disimpan. Bagian mana yang harus disamakan?',
          options: [
            'Ubah atribut name di HTML menjadi name="rfid" agar sama persis dengan $_POST["rfid"]',
            'Tambahkan autofocus pada semua kolom input',
            'Ubah $rfid menjadi $GLOBALS["rfid"]',
          ],
          answerIndex: 0,
          explanation:
            'Indeks array $_POST["..."] diambil langsung dari atribut name="..." milik elemen HTML form.',
        },
        {
          title: 'Tombol Simpan Lupa Diberi Atribut name="simpan"',
          buggyCode: '<form method="POST">\n    ...\n    <button type="submit">Simpan</button>\n</form>\n// PHP mengecek: if (isset($_POST[\'simpan\'])) { ... }',
          question: 'Semua kolom sudah diisi, namun halaman hanya me-refresh dan tidak menyimpan apa-apa ke database. Apa yang kurang?',
          options: [
            'Atribut type="submit" harus dihapus',
            'Tombol <button> lupa diberi name="simpan" sehingga isset($_POST["simpan"]) selalu false',
            'Harus menambahkan border="1" pada form',
          ],
          answerIndex: 1,
          explanation:
            'Karena PHP menunggu kondisi isset($_POST["simpan"]), tombol submit wajib memiliki atribut name="simpan".',
        },
      ],
    },

    {
      id: 8,
      phaseId: 3,
      skemaRef: 'Poin 8: Membuat edit data',
      title: 'Bab 8: Membuat Halaman Edit Data (edit.php)',
      shortTitle: 'Edit Data (Update)',
      targetFile: 'edit.php',
      summary:
        'Halaman edit.php menangkap $_GET["id"] untuk mengisi form dengan data lama, lalu menjalankan UPDATE ... WHERE id_user="$id" saat Simpan ditekan.',
      analogy:
        'Ambil data lama berdasarkan ID dari URL terlebih dahulu agar kotak input terisi otomatis, baru simpan perubahannya hanya untuk baris dengan id_user tersebut.',
      cheatRule: {
        title: 'Edit Data: $_GET["id"] + Pre-fill + UPDATE WHERE',
        formula: '$id = (int) $_GET["id"]; -> value="<?= htmlspecialchars($data["nama"]) ?>" -> UPDATE tb_user SET ... WHERE id_user=\'$id\'',
        points: [
          'Tangkap ID baris dari URL dengan $id = (int) $_GET["id"];.',
          'Isi data lama ke <input value="..."> dan beri "selected" di <option> role yang sesuai.',
          'Selalu tulis WHERE id_user=\'$id\' pada UPDATE agar baris lain tidak ikut berubah.',
        ],
      },
      steps: [
        {
          title: '1. Cek Session, Koneksi, & Validasi $_GET["id"]',
          detail:
            'Jika parameter $_GET[\'id\'] kosong, langsung redirect ke tampil.php. Jika ada, ubah ke integer dengan $id = (int) $_GET[\'id\'];.',
        },
        {
          title: '2. Proses UPDATE Saat $_POST["simpan"] Dikirim',
          detail:
            'Jalankan mysqli_query($koneksi, "UPDATE tb_user SET rfid=\'$rfid\', nama=\'$nama\', id_role=\'$id_role\' WHERE id_user=\'$id\'"); lalu header("Location: tampil.php"); exit;.',
        },
        {
          title: '3. Ambil Data Lama & Daftar Role untuk Mengisi Form',
          detail:
            'Ambil satu baris lama dengan SELECT * FROM tb_user WHERE id_user=\'$id\' ke variabel $data, serta ambil $roles = mysqli_query($koneksi, "SELECT * FROM tb_role");.',
        },
        {
          title: '4. Tampilkan Nilai Lama di Input & Tandai Role Terpilih',
          detail:
            'Pasang value="<?= htmlspecialchars($data[\'rfid\']) ?>" dan value="<?= htmlspecialchars($data[\'nama\']) ?>", serta tambahkan ternary <?= $r[\'id_role\'] == $data[\'id_role\'] ? \'selected\' : \'\' ?> pada <option>.',
        },
      ],
      codeBlocks: [
        {
          filename: 'edit.php',
          label: 'Kode Lengkap app-cashless-rfid/edit.php (40 Baris)',
          code: [
            '<?php',
            'session_start();',
            "if (!isset($_SESSION['id_user'])) { header(\"Location: login.php\"); exit; }",
            "include 'koneksi.php';",
            '',
            "if (empty($_GET['id'])) { header(\"Location: tampil.php\"); exit; }",
            "$id = (int) $_GET['id'];",
            "if (isset($_POST['simpan'])) {",
            "    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));",
            "    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));",
            "    $id_role = (int) $_POST['id_role'];",
            '    mysqli_query($koneksi, "UPDATE tb_user SET rfid=\'$rfid\', nama=\'$nama\', id_role=\'$id_role\' WHERE id_user=\'$id\'");',
            '    header("Location: tampil.php");',
            '    exit;',
            '}',
            '$data = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT * FROM tb_user WHERE id_user=\'$id\'"));',
            'if (!$data) { header("Location: tampil.php"); exit; }',
            '$roles = mysqli_query($koneksi, "SELECT * FROM tb_role");',
            '?>',
            '<!DOCTYPE html>',
            '<html>',
            '<head><title>Edit Pengguna</title></head>',
            '<body>',
            '    <h2>Edit Pengguna RFID</h2>',
            '    <form method="POST">',
            '        <label>Kode RFID:</label><br>',
            "        <input type=\"text\" name=\"rfid\" value=\"<?= htmlspecialchars($data['rfid']) ?>\" required><br><br>",
            '        <label>Nama:</label><br>',
            "        <input type=\"text\" name=\"nama\" value=\"<?= htmlspecialchars($data['nama']) ?>\" required><br><br>",
            '        <label>Role:</label><br>',
            '        <select name="id_role" required>',
            '            <?php while ($r = mysqli_fetch_assoc($roles)) { ?>',
            "            <option value=\"<?= $r['id_role'] ?>\" <?= $r['id_role'] == $data['id_role'] ? 'selected' : '' ?>><?= htmlspecialchars($r['nama_role']) ?></option>",
            '            <?php } ?>',
            '        </select><br><br>',
            '        <button type="submit" name="simpan">Simpan</button>',
            '        <a href="tampil.php">Batal</a>',
            '    </form>',
            '</body>',
            '</html>',
          ].join('\n'),
          previewHtml: [
            '<h2>Edit Pengguna RFID</h2>',
            '<form>',
            '    <label>Kode RFID:</label><br>',
            '    <input type="text" value="0087654321"><br><br>',
            '    <label>Nama:</label><br>',
            '    <input type="text" value="Teller 1"><br><br>',
            '    <label>Role:</label><br>',
            '    <select><option>super_admin</option><option selected>teller</option></select><br><br>',
            '    <button type="button">Simpan</button> <a href="#tampil">Batal</a>',
            '</form>',
          ].join('\n'),
        },
      ],
      simulatorType: 'crud-flow',
      simulatorConfig: {
        focusMode: 'edit',
        title: 'Simulasi Update: Pre-fill Data Lama -> UPDATE WHERE id_user',
        description:
          'Pilih salah satu pengguna untuk melihat bagaimana edit.php mengisi nilai lama form lalu mengubah tepat satu baris dengan WHERE id_user.',
      },
      fillBlanks: [
        {
          title: 'Lengkapi Query UPDATE & Pre-fill Dropdown di edit.php',
          mode: 'php',
          template:
            "$id = (int) {{get_id}};\nif (isset($_POST['simpan'])) {\n    mysqli_query($koneksi, \"{{upd_kw}} tb_user SET rfid='$rfid', nama='$nama', id_role='$id_role' {{where_cond}}\");\n    header(\"Location: tampil.php\");\n    exit;\n}\n// Menandai pilihan role yang sedang aktif:\n// <?= $r['id_role'] == $data['id_role'] ? '{{sel_attr}}' : '' ?>",
          blanks: [
            {
              id: 'get_id',
              placeholder: 'ambil id dari URL',
              answers: ["$_GET['id']", '$_GET["id"]'],
              hint: 'Nilai id dari edit.php?id=2 ditangkap menggunakan $_GET["id"]',
            },
            {
              id: 'upd_kw',
              placeholder: 'perintah ubah SQL',
              answers: ['UPDATE'],
              hint: 'Perintah SQL untuk mengubah isi baris yang sudah ada: UPDATE',
            },
            {
              id: 'where_cond',
              placeholder: 'syarat baris target',
              answers: ["WHERE id_user='$id'", "WHERE id_user = '$id'", 'WHERE id_user=$id', 'WHERE id_user = $id'],
              hint: 'Klausa wajib agar hanya 1 baris yang berubah: WHERE id_user=\'$id\'',
            },
            {
              id: 'sel_attr',
              placeholder: 'atribut HTML option aktif',
              answers: ['selected'],
              hint: 'Atribut HTML untuk menandai <option> yang otomatis terpilih: selected',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Query UPDATE Lupa Klausa WHERE',
          buggyCode: 'mysqli_query($koneksi, "UPDATE tb_user SET nama=\'$nama\', id_role=\'$id_role\'");',
          question: 'Apa akibat fatal jika query UPDATE pada edit.php lupa menulis WHERE id_user=\'$id\'?',
          options: [
            'Seluruh baris pengguna di tb_user ikut berubah namanya dan rolenya menjadi sama semua',
            'Data hanya berubah untuk baris paling terakhir saja',
            'PHP otomatis menebak ID dari session login',
          ],
          answerIndex: 0,
          explanation:
            'Tanpa klausa WHERE, MySQL menerapkan perubahan SET ke seluruh baris yang ada di dalam tabel tb_user.',
        },
        {
          title: 'Kotak Input Muncul Kosong Saat Mengedit',
          buggyCode: '<input type="text" name="nama" required>',
          question: 'Saat membuka edit.php?id=2, data lama sudah diambil ke $data, tetapi kotak input Nama tampil kosong. Apa yang kurang?',
          options: [
            'Lupa menambahkan atribut value="<?= htmlspecialchars($data[\'nama\']) ?>" pada tag <input>',
            'Tag <input> harus diganti menjadi <textarea>',
            'Method form harus diganti menjadi GET',
          ],
          answerIndex: 0,
          explanation:
            'Untuk menampilkan nilai lama ke dalam kotak teks, <input> wajib diberi atribut value="..." yang dicetak dari variabel $data.',
        },
        {
          title: 'Dropdown Role Selalu Kembali ke super_admin Saat Edit',
          buggyCode: '<?php while ($r = mysqli_fetch_assoc($roles)) { ?>\n<option value="<?= $r[\'id_role\'] ?>"><?= $r[\'nama_role\'] ?></option>\n<?php } ?>',
          question: 'Ketika mengedit Teller 1 (id_role = 2), dropdown selalu memilih opsi paling atas (super_admin). Bagaimana memperbaikinya?',
          options: [
            'Tambahkan kondisi <?= $r[\'id_role\'] == $data[\'id_role\'] ? \'selected\' : \'\' ?> pada tag <option>',
            'Urutkan query tb_role secara DESC',
            'Hapus opsi super_admin dari database',
          ],
          answerIndex: 0,
          explanation:
            'Tanpa atribut selected pada <option> yang id_role-nya cocok dengan $data["id_role"], browser selalu memilih opsi pertama.',
        },
      ],
    },

    {
      id: 9,
      phaseId: 3,
      skemaRef: 'Poin 9: Hapus',
      title: 'Bab 9: Membuat Fitur Hapus Data (hapus.php)',
      shortTitle: 'Hapus Data (Delete)',
      targetFile: 'hapus.php',
      summary:
        'File hapus.php tidak butuh HTML: cek session, panggil koneksi, tangkap $_GET["id"], jalankan DELETE FROM tb_user WHERE id_user="$id", lalu redirect ke tampil.php.',
      analogy:
        'Cukup baca nomor ID dari URL (hapus.php?id=2), hapus satu baris itu saja memakai WHERE id_user, lalu kembalikan browser ke tampil.php.',
      cheatRule: {
        title: 'Hapus Data (15 Baris Tanpa HTML)',
        formula: 'session_start -> include koneksi -> $id = (int) $_GET["id"] -> DELETE FROM tb_user WHERE id_user=\'$id\' -> header("Location: tampil.php")',
        points: [
          'Tidak perlu menulis tag HTML apa pun di dalam hapus.php.',
          'Selalu sertakan WHERE id_user=\'$id\' agar tidak menghapus seluruh isi tabel.',
          'Pasang onclick="return confirm(\'Yakin hapus?\')" pada link Hapus di tampil.php.',
        ],
      },
      steps: [
        {
          title: '1. Kunci Halaman dengan Session Guard',
          detail:
            'Awali hapus.php dengan session_start(); dan if (!isset($_SESSION[\'id_user\'])) agar orang luar tidak bisa mengetik hapus.php?id=1 tanpa login.',
        },
        {
          title: '2. Panggil Koneksi & Tangkap $_GET["id"]',
          detail:
            'Tambahkan include \'koneksi.php\'; lalu cek if (!empty($_GET[\'id\'])) dan konversi $id = (int) $_GET[\'id\'];.',
        },
        {
          title: '3. Jalankan Query DELETE dengan Klausa WHERE',
          detail:
            'Eksekusi mysqli_query($koneksi, "DELETE FROM tb_user WHERE id_user=\'$id\'");.',
        },
        {
          title: '4. Redirect Kembali ke tampil.php',
          detail:
            'Akhiri file dengan header("Location: tampil.php"); dan exit; agar pengguna langsung melihat tabel terbaru.',
        },
      ],
      codeBlocks: [
        {
          filename: 'hapus.php',
          label: 'Kode Lengkap app-cashless-rfid/hapus.php (15 Baris)',
          code: [
            '<?php',
            'session_start();',
            "if (!isset($_SESSION['id_user'])) {",
            '    header("Location: login.php");',
            '    exit;',
            '}',
            "include 'koneksi.php';",
            '',
            "if (!empty($_GET['id'])) {",
            "    $id = (int) $_GET['id'];",
            '    mysqli_query($koneksi, "DELETE FROM tb_user WHERE id_user=\'$id\'");',
            '}',
            '',
            'header("Location: tampil.php");',
            'exit;',
          ].join('\n'),
        },
      ],
      simulatorType: 'crud-flow',
      simulatorConfig: {
        focusMode: 'hapus',
        title: 'Simulasi Delete: Link ?id= -> DELETE WHERE id_user -> Redirect',
        description:
          'Uji menekan tombol Hapus pada pengguna tertentu dan lihat query DELETE hanya menghapus baris dengan id_user yang sesuai.',
      },
      fillBlanks: [
        {
          title: 'Lengkapi File Ringkas hapus.php',
          mode: 'php',
          template:
            "{{inc}} 'koneksi.php';\nif (!empty({{get_id}})) {\n    $id = (int) {{get_id2}};\n    mysqli_query($koneksi, \"{{del_sql}} WHERE id_user='$id'\");\n}\nheader(\"Location: {{redir_list}}\");\nexit;",
          blanks: [
            {
              id: 'inc',
              placeholder: 'panggil file koneksi',
              answers: ['include', 'require'],
              hint: 'Kata kunci PHP untuk menyertakan file lain: include',
            },
            {
              id: 'get_id',
              placeholder: 'cek parameter id di URL',
              answers: ["$_GET['id']", '$_GET["id"]'],
              hint: 'Variabel global PHP penangkap parameter ?id= di URL: $_GET[\'id\']',
            },
            {
              id: 'get_id2',
              placeholder: 'ambil nilai id dari URL',
              answers: ["$_GET['id']", '$_GET["id"]'],
              hint: 'Gunakan $_GET[\'id\'] yang sama untuk diubah ke (int)',
            },
            {
              id: 'del_sql',
              placeholder: 'perintah hapus SQL',
              answers: ['DELETE FROM tb_user'],
              hint: 'Perintah SQL menghapus baris dari tb_user: DELETE FROM tb_user',
            },
            {
              id: 'redir_list',
              placeholder: 'kembali ke daftar data',
              answers: ['tampil.php'],
              hint: 'Setelah menghapus, pengguna diarahkan ke tampil.php',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Layar Putih Berhenti di hapus.php',
          buggyCode: "<?php\ninclude 'koneksi.php';\n$id = (int) $_GET['id'];\nmysqli_query($koneksi, \"DELETE FROM tb_user WHERE id_user='$id'\");",
          question: 'Data berhasil terhapus di database, tetapi browser berhenti di halaman putih hapus.php?id=2. Apa yang terlupa?',
          options: [
            'Lupa menambahkan header("Location: tampil.php"); exit; di akhir file',
            'Lupa menambahkan tag <table>',
            'Query DELETE harus dipanggil 2 kali',
          ],
          answerIndex: 0,
          explanation:
            'File hapus.php tidak mencetak HTML apa pun, jadi wajib ditutup dengan header("Location: tampil.php"); exit; agar kembali ke daftar.',
        },
        {
          title: 'Semua Pengguna Hilang Sekaligus Setelah Klik Hapus',
          buggyCode: '$id = (int) $_GET[\'id\'];\nmysqli_query($koneksi, "DELETE FROM tb_user");',
          question: 'Klik Hapus pada satu baris justru menghapus seluruh isi tabel tb_user sampai kosong! Apa kesalahannya?',
          options: [
            'Tipe data $id harus string',
            'Query DELETE FROM tb_user lupa diberi syarat WHERE id_user=\'$id\'',
            'Link di tampil.php tidak memakai confirm()',
          ],
          answerIndex: 1,
          explanation:
            'DELETE FROM tb_user tanpa WHERE berarti hapus SEMUA baris dalam tabel. Selalu tambahkan WHERE id_user=\'$id\'.',
        },
        {
          title: 'Klik Hapus Tapi Data Tidak Berkurang',
          buggyCode: '// Di tampil.php:\n<a href="hapus.php?id_user=<?= $row[\'id_user\'] ?>">Hapus</a>\n\n// Di hapus.php:\nif (!empty($_GET[\'id\'])) { ... }',
          question: 'Kenapa tombol Hapus langsung kembali ke tampil.php namun data tetap ada dan tidak terhapus?',
          options: [
            'Nama parameter di link (?id_user=) tidak cocok dengan key yang dibaca hapus.php ($_GET["id"])',
            'Fungsi empty() tidak mendukung angka',
            'Data Foreign Key tidak boleh dihapus meskipun CASCADE',
          ],
          answerIndex: 0,
          explanation:
            'Karena URL mengirim ?id_user=, maka $_GET["id"] dianggap kosong sehingga blok DELETE tidak pernah dijalankan.',
        },
      ],
    },

    {
      id: 10,
      phaseId: 4,
      skemaRef: 'Poin 10: Login menggunakan tap reader kartu RFID',
      title: 'Bab 10: Login Tap Kartu RFID & Logout (login.php & logout.php)',
      shortTitle: 'Login Tap Kartu RFID',
      targetFile: 'login.php & logout.php',
      summary:
        'Halaman login memakai USB RFID Reader yang bekerja seperti keyboard: saat kartu ditempel, reader mengetik UID kartu + Enter ke <input name="rfid" autofocus>.',
      analogy:
        'Karena reader otomatis mengetik UID dan menekan Enter, cukup pasang autofocus pada input rfid, cocokkan ke tb_user JOIN tb_role, lalu isi $_SESSION.',
      cheatRule: {
        title: 'Login RFID: autofocus + WHERE rfid + $_SESSION',
        formula: '<input type="text" name="rfid" autofocus required> -> WHERE rfid=\'$rfid\' -> $_SESSION[\'id_user\',\'nama\',\'nama_role\'] -> beranda.php',
        points: [
          'Pasang autofocus pada <input type="text" name="rfid" autofocus required> agar siap menerima tap tanpa klik.',
          'Cek isset($_POST["rfid"]) lalu query dengan JOIN tb_role untuk mengambil nama_role.',
          'Buat logout.php (session_start(); session_destroy(); header("Location: login.php"); exit;).',
        ],
      },
      steps: [
        {
          title: '1. Siapkan session_start() dan Koneksi di login.php',
          detail:
            'Di baris paling atas login.php, nyalakan session_start(); dan panggil include \'koneksi.php\';.',
        },
        {
          title: '2. Tangkap Tap Kartu Lewat if (isset($_POST[\'rfid\']))',
          detail:
            'Bersihkan UID dari $_POST[\'rfid\'] dengan mysqli_real_escape_string($koneksi, trim($_POST[\'rfid\'])).',
        },
        {
          title: '3. Cocokkan UID di tb_user JOIN tb_role',
          detail:
            'Jalankan query "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role WHERE rfid = \'$rfid\'".',
        },
        {
          title: '4. Simpan 3 Key Session & Masuk ke beranda.php',
          detail:
            'Jika mysqli_num_rows($query) > 0, isi $_SESSION[\'id_user\'], $_SESSION[\'nama\'], dan $_SESSION[\'nama_role\'], lalu header("Location: beranda.php"); exit;. Jika 0, isi $pesan = "Kartu RFID tidak terdaftar!";.',
        },
        {
          title: '5. Pasang <input autofocus> & Buat logout.php',
          detail:
            'Tulis <input type="text" name="rfid" autofocus required> pada form POST, serta buat logout.php berisi session_start(); session_destroy(); header("Location: login.php"); exit;.',
        },
      ],
      codeBlocks: [
        {
          filename: 'login.php',
          label: 'Kode Lengkap app-cashless-rfid/login.php (33 Baris)',
          code: [
            '<?php',
            'session_start();',
            "include 'koneksi.php';",
            '',
            "$pesan = '';",
            "if (isset($_POST['rfid'])) {",
            "    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));",
            '    $query = mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role WHERE rfid = \'$rfid\'");',
            '    if ($query && mysqli_num_rows($query) > 0) {',
            '        $data = mysqli_fetch_assoc($query);',
            "        $_SESSION['id_user'] = $data['id_user'];",
            "        $_SESSION['nama'] = $data['nama'];",
            "        $_SESSION['nama_role'] = $data['nama_role'];",
            '        header("Location: beranda.php");',
            '        exit;',
            '    } else {',
            '        $pesan = "Kartu RFID tidak terdaftar!";',
            '    }',
            '}',
            '?>',
            '<!DOCTYPE html>',
            '<html>',
            '<head><title>Login RFID</title></head>',
            '<body>',
            '    <h2>Login Tap Kartu RFID</h2>',
            '    <?php if ($pesan != \'\') echo "<p>$pesan</p>"; ?>',
            '    <form method="POST">',
            '        <label>Tap Kartu RFID:</label><br>',
            '        <input type="text" name="rfid" autofocus required><br><br>',
            '        <button type="submit" name="masuk">Masuk</button>',
            '    </form>',
            '</body>',
            '</html>',
          ].join('\n'),
          previewHtml: [
            '<h2>Login Tap Kartu RFID</h2>',
            '<form>',
            '    <label>Tap Kartu RFID:</label><br>',
            '    <input type="text" placeholder="Tempelkan kartu ke reader..." autofocus><br><br>',
            '    <button type="button">Masuk</button>',
            '</form>',
          ].join('\n'),
        },
        {
          filename: 'logout.php',
          label: 'Kode Lengkap app-cashless-rfid/logout.php (5 Baris)',
          code: [
            '<?php',
            'session_start();',
            'session_destroy();',
            'header("Location: login.php");',
            'exit;',
          ].join('\n'),
        },
      ],
      simulatorType: 'rfid-tap',
      simulatorConfig: {
        cards: [
          {
            label: 'Kartu Super Admin',
            uid: '0012345678',
            role: 'super_admin',
            expectedOk: true,
          },
          {
            label: 'Kartu Teller 1',
            uid: '0087654321',
            role: 'teller',
            expectedOk: true,
          },
          {
            label: 'Kartu Tidak Terdaftar',
            uid: '9999999999',
            role: 'tidak terdaftar',
            expectedOk: false,
          },
        ],
      },
      fillBlanks: [
        {
          title: 'Latihan 1: Query Pencocokan Kartu & Simpan Session di login.php',
          mode: 'php',
          template:
            "$query = mysqli_query($koneksi, \"SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role WHERE {{col_rfid}} = '$rfid'\");\nif ({{fn_rows}}($query) > 0) {\n    $data = mysqli_fetch_assoc($query);\n    $_SESSION['id_user'] = $data['id_user'];\n    $_SESSION['{{sess_nama}}'] = $data['nama'];\n    $_SESSION['nama_role'] = $data['nama_role'];\n    header(\"Location: {{redir_home}}\");\n    exit;\n}",
          blanks: [
            {
              id: 'col_rfid',
              placeholder: 'kolom kode kartu di tb_user',
              answers: ['rfid'],
              hint: 'Kolom tempat menyimpan UID kartu di tb_user adalah rfid',
            },
            {
              id: 'fn_rows',
              placeholder: 'hitung jumlah hasil baris',
              answers: ['mysqli_num_rows'],
              hint: 'Fungsi untuk mengecek berapa baris data yang cocok: mysqli_num_rows',
            },
            {
              id: 'sess_nama',
              placeholder: 'kunci sesi nama pengguna',
              answers: ['nama'],
              hint: 'Kunci $_SESSION untuk menyimpan $data["nama"] adalah nama',
            },
            {
              id: 'redir_home',
              placeholder: 'halaman setelah login sukses',
              answers: ['beranda.php'],
              hint: 'Setelah login berhasil, arahkan pengguna ke beranda.php',
            },
          ],
        },
        {
          title: 'Latihan 2: Input Autofocus Login & File logout.php',
          mode: 'php',
          template:
            '<input type="text" name="{{inp_name}}" {{focus_attr}} required>\n<!-- Isi logout.php -->\n<?php\nsession_start();\n{{destroy_fn}}();\nheader("Location: {{login_url}}");\nexit;',
          blanks: [
            {
              id: 'inp_name',
              placeholder: 'nama input UID kartu',
              answers: ['rfid'],
              hint: 'Atribut name input yang ditangkap oleh $_POST["rfid"] adalah rfid',
            },
            {
              id: 'focus_attr',
              placeholder: 'kursor otomatis aktif',
              answers: ['autofocus'],
              hint: 'Atribut HTML agar kursor langsung siap menerima ketikan RFID Reader: autofocus',
            },
            {
              id: 'destroy_fn',
              placeholder: 'nama fungsi hapus sesi (tanpa kurung)',
              answers: ['session_destroy'],
              hint: 'Nama fungsi PHP untuk menghancurkan sesi sebelum (); adalah session_destroy',
            },
            {
              id: 'login_url',
              placeholder: 'tujuan setelah logout',
              answers: ['login.php'],
              hint: 'Setelah sesi dihapus, arahkan pengguna kembali ke login.php',
            },
          ],
        },
      ],
      debugQuiz: [
        {
          title: 'Kartu Sudah Di-tap Tapi Kotak Input Kosong',
          buggyCode: '<form method="POST">\n    <label>Tap Kartu RFID:</label><br>\n    <input type="text" name="rfid" required><br><br>\n    <button type="submit" name="masuk">Masuk</button>\n</form>',
          question: 'Saat halaman login.php dibuka lalu kartu langsung ditempelkan ke RFID Reader, angka UID tidak masuk ke form kecuali kotak input diklik pakai mouse dulu. Apa yang lupa ditambahkan?',
          options: [
            'Atribut autofocus pada tag <input type="text" name="rfid" autofocus required>',
            'Atribut placeholder="Tap sekarang"',
            'JavaScript window.alert()',
          ],
          answerIndex: 0,
          explanation:
            'RFID Reader USB bertindak seperti keyboard. Tanpa atribut autofocus, kursor tidak otomatis aktif di kotak input saat halaman dibuka.',
        },
        {
          title: 'Mengecek Tombol Submit vs Mengecek Input RFID',
          buggyCode: "// Kurang handal saat tap reader otomatis menekan Enter:\nif (isset($_POST['masuk'])) { ... }",
          question: 'Mengapa di login.php lebih dianjurkan menulis if (isset($_POST["rfid"])) daripada if (isset($_POST["masuk"]))?',
          options: [
            'Karena $_POST["rfid"] selalu terkirim ketika reader mengetik UID + Enter dari kotak input, sedangkan tombol submit bisa tidak ikut terkirim di sebagian browser',
            'Karena kata "masuk" dilarang di PHP 8',
            'Karena tombol <button> tidak bisa dipakai bersama autofocus',
          ],
          answerIndex: 0,
          explanation:
            'Alat RFID mengirim UID + tombol Enter di dalam kolom input. Mengecek isset($_POST["rfid"]) memastikan proses login selalu terpanggil baik lewat tombol maupun Enter otomatis.',
        },
        {
          title: 'Setelah Logout Masih Bisa Membuka beranda.php',
          buggyCode: '// Isi logout.php yang salah:\n<?php\nheader("Location: login.php");\nexit;',
          question: 'Pengguna sudah mengklik Logout, tetapi saat mengetik beranda.php di browser ternyata masih bisa masuk tanpa tap kartu ulang! Mengapa?',
          options: [
            'File logout.php lupa memanggil session_start(); dan session_destroy(); sebelum redirect',
            'Link logout di beranda.php harus memakai method POST',
            'Database tb_user belum di-TRUNCATE',
          ],
          answerIndex: 0,
          explanation:
            'Hanya memindahkan halaman dengan header("Location: ...") tidak menghapus data $_SESSION di server. Wajib panggil session_start(); lalu session_destroy();.',
        },
      ],
    },
  ];

  var CHEAT_SHEET_SECTIONS = [
    {
      pointRange: 'Poin 1',
      title: 'Setup VS Code & XAMPP',
      snippet: 'Folder: C:\\xampp\\htdocs\\cashless\\\nXAMPP: Apache (HIJAU) + MySQL (HIJAU)\nBrowser: http://localhost/cashless/login.php',
      note: 'Jangan pernah membuka file .php lewat file:///. Aktifkan File -> Auto Save di VS Code.',
    },
    {
      pointRange: 'Poin 2',
      title: 'Database CLI (2 Tabel InnoDB)',
      snippet: [
        'CREATE DATABASE IF NOT EXISTS db_loginCashles;',
        'USE db_loginCashles;',
        'CREATE TABLE tb_role (id_role INT AUTO_INCREMENT PRIMARY KEY, nama_role VARCHAR(50) NOT NULL) ENGINE=InnoDB;',
        'CREATE TABLE tb_user (id_user INT AUTO_INCREMENT PRIMARY KEY, rfid VARCHAR(50) NOT NULL UNIQUE, nama VARCHAR(100) NOT NULL, id_role INT NOT NULL) ENGINE=InnoDB;',
      ].join('\n'),
      note: 'Setiap perintah CLI wajib ditutup titik koma (;). Wajib ENGINE=InnoDB agar bisa direlasikan di Poin 3.',
    },
    {
      pointRange: 'Poin 3',
      title: 'Relasi Grafis phpMyAdmin Designer',
      snippet: [
        '1. Pilih tb_user -> Structure -> Klik Index pada kolom id_role',
        '2. Pilih db_loginCashles -> Tab Designer -> Create relationship',
        '3. Klik PK: tb_role.id_role -> Klik FK: tb_user.id_role (CASCADE)',
      ].join('\n'),
      note: 'Tanpa langkah 1 (INDEX pada tb_user.id_role), Designer menolak menarik garis relasi.',
    },
    {
      pointRange: 'Poin 4',
      title: 'File Koneksi (koneksi.php)',
      snippet: [
        '$koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles");',
        'if (!$koneksi) { die("Koneksi gagal: " . mysqli_connect_error()); }',
      ].join('\n'),
      note: 'Hafalkan urutan 4 parameter: Host, User, Password ("" tanpa spasi), Nama Database.',
    },
    {
      pointRange: 'Poin 5 & 10b',
      title: 'Penjaga Session & Logout (beranda.php & logout.php)',
      snippet: [
        '// Di atas beranda, tampil, tambah, edit, hapus:',
        'session_start();',
        "if (!isset($_SESSION['id_user'])) { header(\"Location: login.php\"); exit; }",
        '',
        '// Di logout.php:',
        'session_start(); session_destroy(); header("Location: login.php"); exit;',
      ].join('\n'),
      note: 'Key sesi seragam di semua file: id_user, nama, nama_role.',
    },
    {
      pointRange: 'Poin 6',
      title: 'Tampil Data JOIN (tampil.php)',
      snippet: [
        '$query = mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role ORDER BY tb_user.id_user ASC");',
        'while ($row = mysqli_fetch_assoc($query)) { ... }',
        '// Link aksi: edit.php?id=<?= $row[\'id_user\'] ?> dan hapus.php?id=<?= $row[\'id_user\'] ?>',
      ].join('\n'),
      note: 'Pakai while (bukan if!) dan pastikan parameter URL tepat bernama ?id=.',
    },
    {
      pointRange: 'Poin 7',
      title: 'Tambah Data (tambah.php / proses_tambah.php)',
      snippet: [
        "if (isset($_POST['simpan'])) {",
        "    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));",
        "    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));",
        "    $id_role = (int) $_POST['id_role'];",
        '    mysqli_query($koneksi, "INSERT INTO tb_user (rfid, nama, id_role) VALUES (\'$rfid\', \'$nama\', \'$id_role\')");',
        '    header("Location: tampil.php"); exit;',
        '}',
      ].join('\n'),
      note: 'Halaman sama: <form method="POST">. Halaman berbeda: <form method="POST" action="proses_tambah.php">.',
    },
    {
      pointRange: 'Poin 8 & 9',
      title: 'Edit & Hapus Data (edit.php & hapus.php)',
      snippet: [
        "// Ambil ID dari URL: $id = (int) $_GET['id'];",
        '// Edit: mysqli_query($koneksi, "UPDATE tb_user SET rfid=\'$rfid\', nama=\'$nama\', id_role=\'$id_role\' WHERE id_user=\'$id\'");',
        '// Hapus: mysqli_query($koneksi, "DELETE FROM tb_user WHERE id_user=\'$id\'");',
        '// Lalu redirect: header("Location: tampil.php"); exit;',
      ].join('\n'),
      note: 'Dilarang lupa WHERE id_user=\'$id\' pada UPDATE dan DELETE! Pre-fill select edit pakai ternary ? "selected" : "".',
    },
    {
      pointRange: 'Poin 10a',
      title: 'Login Tap Kartu RFID Murni (login.php)',
      snippet: [
        "if (isset($_POST['rfid'])) {",
        '    $query = mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role WHERE rfid = \'$rfid\'");',
        '    if ($query && mysqli_num_rows($query) > 0) { /* set $_SESSION & header("Location: beranda.php"); */ }',
        '}',
        '// HTML: <input type="text" name="rfid" autofocus required>',
      ].join('\n'),
      note: 'RFID Reader USB mengetik UID kartu + Enter secara otomatis ke input yang memiliki atribut autofocus.',
    },
  ];

  var EXAM_CHECKLIST = [
    {
      id: 1,
      label: '1. Melakukan instalasi software aplikasi (vscode)',
      hint: 'Buka VS Code, centang File -> Auto Save, buat folder C:\\xampp\\htdocs\\cashless, dan nyalakan Apache + MySQL di XAMPP sampai hijau.',
    },
    {
      id: 2,
      label: '2. Membuat database dengan CLI (2 tabel)',
      hint: 'Masuk mysql -u root, jalankan CREATE DATABASE db_loginCashles; USE db_loginCashles; lalu buat tb_role & tb_user dengan ENGINE=InnoDB; plus INSERT 2 role & 2 kartu (0012345678, 0087654321).',
    },
    {
      id: 3,
      label: '3. Membuat relasi tabel (grafis- phpmyadmin)',
      hint: 'Di localhost/phpmyadmin: buka tb_user -> Structure -> klik Index pada id_role -> buka tab Designer -> Create relationship -> klik tb_role.id_role lalu tb_user.id_role (CASCADE).',
    },
    {
      id: 4,
      label: '4. Membuat file koneksi',
      hint: 'Buat koneksi.php berisi $koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles"); + cek die(). Uji di browser hingga tampil putih bersih tanpa error.',
    },
    {
      id: 5,
      label: '5. membuat beranda',
      hint: 'Buat beranda.php diawali session_start() dan cek !isset($_SESSION[\'id_user\']), tampilkan nama + nama_role, dan beri link ke tampil.php, tambah.php, logout.php.',
    },
    {
      id: 6,
      label: '6. membuat halaman tampil data',
      hint: 'Buat tampil.php dengan query JOIN tb_role, loop while ($row = mysqli_fetch_assoc($query)), <table border="1">, serta link edit.php?id= dan hapus.php?id=.',
    },
    {
      id: 7,
      label: '7. Membuat form tambah data, dengan proses tambah di halaman berbeda/sama',
      hint: 'Buat tambah.php berisi input rfid, nama, <select name="id_role"> dari tb_role, dan proses INSERT INTO tb_user (atau pisah proses ke proses_tambah.php).',
    },
    {
      id: 8,
      label: '8. Membuat edit data',
      hint: 'Buat edit.php: tangkap (int) $_GET[\'id\'], isi value="..." & selected dari data lama, dan jalankan UPDATE tb_user SET ... WHERE id_user=\'$id\' lalu redirect ke tampil.php.',
    },
    {
      id: 9,
      label: '9. Hapus',
      hint: 'Buat hapus.php: cek session, include koneksi.php, tangkap (int) $_GET[\'id\'], jalankan DELETE FROM tb_user WHERE id_user=\'$id\', lalu header("Location: tampil.php"); exit;.',
    },
    {
      id: 10,
      label: '10. Login menggunakan tap reader kartu RFID',
      hint: 'Buat login.php dengan <input type="text" name="rfid" autofocus required>, query JOIN WHERE rfid=\'$rfid\', simpan $_SESSION[\'id_user\'], nama, nama_role, plus buat logout.php.',
    },
  ];

  var MATERI_DATA = {
    PHASES: PHASES,
    CHAPTERS: CHAPTERS,
    CHEAT_SHEET_SECTIONS: CHEAT_SHEET_SECTIONS,
    EXAM_CHECKLIST: EXAM_CHECKLIST,
  };

  if (typeof global !== 'undefined') {
    global.ModulCRUD = global.ModulCRUD || {};
    global.ModulCRUD.MATERI_DATA = MATERI_DATA;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MATERI_DATA;
  }
})(typeof window !== 'undefined' ? window : globalThis);

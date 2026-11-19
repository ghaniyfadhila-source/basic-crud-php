(function (global) {
  'use strict';

  var DEFAULT_ROLES = [
    { id_role: 1, nama_role: 'super_admin' },
    { id_role: 2, nama_role: 'teller' },
  ];

  var DEFAULT_USERS = [
    { id_user: 1, rfid: '0012345678', nama: 'Super Admin', id_role: 1, nama_role: 'super_admin' },
    { id_user: 2, rfid: '0087654321', nama: 'Teller 1', id_role: 2, nama_role: 'teller' },
  ];

  var PHP_SQL_KEYWORDS = Object.create(null);
  [
    'isset', 'empty', 'include', 'include_once', 'require', 'require_once',
    'header', 'echo', 'print', 'if', 'else', 'elseif', 'while', 'for', 'foreach',
    'exit', 'die', 'return', 'true', 'false', 'null', 'location',
    'session_start', 'session_destroy', 'mysqli_connect', 'mysqli_connect_error',
    'mysqli_query', 'mysqli_fetch_assoc', 'mysqli_num_rows',
    'mysqli_real_escape_string', 'mysqli_error', 'htmlspecialchars', 'trim', 'int',
    'select', 'from', 'join', 'inner', 'left', 'right', 'on', 'where',
    'insert', 'into', 'values', 'update', 'set', 'delete', 'and', 'or', 'not',
    'order', 'by', 'asc', 'desc', 'limit', 'as', 'create', 'database', 'use',
    'table', 'alter', 'add', 'index', 'key', 'primary', 'foreign', 'references',
    'cascade', 'engine', 'innodb', 'unique', 'auto_increment', 'varchar', 'exists',
    'autofocus', 'selected', 'required',
  ].forEach(function (kw) {
    PHP_SQL_KEYWORDS[kw] = true;
  });

  var DESIGNER_SEQUENCE = [
    {
      actionId: 'select-table-user',
      successMessage: 'Langkah 1 selesai: Tabel tb_user dibuka pada tab Structure.',
      expectedHint: 'Pilih tabel tb_user (tab Structure) terlebih dahulu.',
    },
    {
      actionId: 'add-index-id-role',
      successMessage: 'Langkah 2 selesai: INDEX berhasil dipasang pada kolom tb_user.id_role! Kolom kini siap dijadikan Foreign Key.',
      expectedHint: 'Pasang INDEX pada kolom id_role di tb_user terlebih dahulu.',
    },
    {
      actionId: 'open-designer-create-rel',
      successMessage: 'Langkah 3 selesai: Tab Designer terbuka dan mode Create Relationship aktif.',
      expectedHint: 'Buka tab Designer lalu klik tombol Create Relationship.',
    },
    {
      actionId: 'link-pk-to-fk',
      successMessage: 'Langkah 4 selesai! Relasi FK tb_role.id_role -> tb_user.id_role (ON DELETE CASCADE ON UPDATE CASCADE) berhasil terhubung.',
      expectedHint: 'Hubungkan Primary Key tb_role.id_role ke Foreign Key tb_user.id_role.',
    },
  ];

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeSqlLiteral(value) {
    return String(value == null ? '' : value).replace(/'/g, "\\'");
  }

  function roleIdToName(idRole) {
    var num = Number(idRole);
    for (var i = 0; i < DEFAULT_ROLES.length; i++) {
      if (DEFAULT_ROLES[i].id_role === num) {
        return DEFAULT_ROLES[i].nama_role;
      }
    }
    return 'role_' + String(idRole);
  }

  function cloneUsers(users) {
    var list = Array.isArray(users) ? users : DEFAULT_USERS;
    return list.map(function (u) {
      var idRole = Number(u.id_role) || 2;
      return {
        id_user: Number(u.id_user),
        rfid: String(u.rfid || ''),
        nama: String(u.nama || ''),
        id_role: idRole,
        nama_role: u.nama_role ? String(u.nama_role) : roleIdToName(idRole),
      };
    });
  }

  function normalizeAnswer(input, mode) {
    var s = String(input == null ? '' : input)
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/"/g, "'")
      .replace(/\s*([=(),[\].])\s*/g, '$1');

    if (mode === 'sql') {
      return s.toLowerCase();
    }

    if (mode === 'php') {
      return s.replace(/(\$[A-Za-z_]\w*)|([A-Za-z_]\w*)/g, function (full, phpVar, word) {
        if (phpVar) {
          return phpVar;
        }
        var lower = word.toLowerCase();
        return PHP_SQL_KEYWORDS[lower] ? lower : word;
      });
    }

    return s;
  }

  function gradeFillBlank(exercise, userValues) {
    var mode = (exercise && exercise.mode) || 'exact';
    var blanks = exercise && Array.isArray(exercise.blanks) ? exercise.blanks : [];
    var values = userValues && typeof userValues === 'object' ? userValues : {};
    var details = [];
    var correctCount = 0;

    for (var i = 0; i < blanks.length; i++) {
      var blank = blanks[i];
      var raw = values[blank.id] != null ? String(values[blank.id]) : '';
      var normUser = normalizeAnswer(raw, mode);
      var accepted = Array.isArray(blank.answers) ? blank.answers : [];
      var ok = normUser.length > 0 && accepted.some(function (ans) {
        return normalizeAnswer(ans, mode) === normUser;
      });

      if (ok) {
        correctCount += 1;
      }

      details.push({
        id: blank.id,
        ok: ok,
        hint: blank.hint || '',
      });
    }

    var total = blanks.length;
    return {
      passed: total > 0 && correctCount === total,
      correctCount: correctCount,
      total: total,
      details: details,
    };
  }

  function createInitialCliState() {
    return {
      dbCreated: false,
      dbSelected: false,
      tables: [],
      roleInserted: false,
      userInserted: false,
    };
  }

  function cloneCliState(state) {
    if (!state || typeof state !== 'object') {
      return createInitialCliState();
    }
    return {
      dbCreated: Boolean(state.dbCreated),
      dbSelected: Boolean(state.dbSelected),
      tables: Array.isArray(state.tables) ? state.tables.slice() : [],
      roleInserted: Boolean(state.roleInserted),
      userInserted: Boolean(state.userInserted),
    };
  }

  function formatDescribeOutput(tableName) {
    if (tableName === 'tb_role') {
      return [
        '+-----------+-------------+------+-----+---------+----------------+',
        '| Field     | Type        | Null | Key | Default | Extra          |',
        '+-----------+-------------+------+-----+---------+----------------+',
        '| id_role   | int(11)     | NO   | PRI | NULL    | auto_increment |',
        '| nama_role | varchar(50) | NO   |     | NULL    |                |',
        '+-----------+-------------+------+-----+---------+----------------+',
        '2 rows in set (0.00 sec)',
      ].join('\n');
    }
    return [
      '+---------+--------------+------+-----+---------+----------------+',
      '| Field   | Type         | Null | Key | Default | Extra          |',
      '+---------+--------------+------+-----+---------+----------------+',
      '| id_user | int(11)      | NO   | PRI | NULL    | auto_increment |',
      '| rfid    | varchar(50)  | NO   | UNI | NULL    |                |',
      '| nama    | varchar(100) | NO   |     | NULL    |                |',
      '| id_role | int(11)      | NO   |     | NULL    |                |',
      '+---------+--------------+------+-----+---------+----------------+',
      '4 rows in set (0.00 sec)',
    ].join('\n');
  }

  function evaluateMysqlCliCommand(command, state) {
    var nextState = cloneCliState(state);
    var trimmed = String(command == null ? '' : command).trim();

    if (!trimmed) {
      return {
        ok: false,
        output: '',
        nextState: nextState,
        hint: 'Ketik perintah SQL terlebih dahulu, lalu akhiri dengan tanda titik koma (;).',
      };
    }

    if (!/;\s*$/.test(trimmed)) {
      return {
        ok: false,
        output: 'ERROR: Perintah belum dijalankan karena tidak ada tanda titik koma (;).',
        nextState: nextState,
        hint: 'Di MySQL CLI, setiap perintah wajib diakhiri titik koma (;). Coba: ' + trimmed + ';',
      };
    }

    var stmt = trimmed.replace(/;+$/, '').trim().replace(/\s+/g, ' ');

    if (/^SHOW\s+DATABASES$/i.test(stmt)) {
      var dbs = ['information_schema', 'mysql'];
      if (nextState.dbCreated) {
        dbs.push('db_loginCashles');
      }
      return {
        ok: true,
        output: 'Databases:\n' + dbs.map(function (d) { return '- ' + d; }).join('\n'),
        nextState: nextState,
        hint: nextState.dbCreated
          ? 'Database db_loginCashles sudah tersedia.'
          : 'Database db_loginCashles belum dibuat. Jalankan CREATE DATABASE db_loginCashles;',
      };
    }

    var createDbMatch = stmt.match(/^CREATE\s+DATABASE\s+(IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)$/i);
    if (createDbMatch) {
      var hasIfNotExists = Boolean(createDbMatch[1]);
      var dbName = createDbMatch[2];
      if (!/^db_logincashles$/i.test(dbName)) {
        return {
          ok: false,
          output: "ERROR: Nama database '" + dbName + "' tidak sesuai skema ujian.",
          nextState: nextState,
          hint: 'Gunakan nama database standar ujian: CREATE DATABASE db_loginCashles;',
        };
      }
      if (nextState.dbCreated && !hasIfNotExists) {
        return {
          ok: false,
          output: "ERROR 1007 (HY000): Can't create database 'db_loginCashles'; database exists",
          nextState: nextState,
          hint: 'Database db_loginCashles sudah ada. Lanjutkan dengan perintah: USE db_loginCashles;',
        };
      }
      nextState.dbCreated = true;
      return {
        ok: true,
        output: 'Query OK, 1 row affected (0.01 sec) — Database db_loginCashles berhasil dibuat.',
        nextState: nextState,
        hint: 'Langkah berikutnya: masuk ke database dengan mengetik USE db_loginCashles;',
      };
    }

    var useMatch = stmt.match(/^USE\s+([a-zA-Z0-9_]+)$/i);
    if (useMatch) {
      var useDb = useMatch[1];
      if (!nextState.dbCreated) {
        return {
          ok: false,
          output: "ERROR 1049 (42000): Unknown database '" + useDb + "'",
          nextState: nextState,
          hint: 'Buat databasenya terlebih dahulu dengan: CREATE DATABASE db_loginCashles;',
        };
      }
      if (!/^db_logincashles$/i.test(useDb)) {
        return {
          ok: false,
          output: "ERROR 1049 (42000): Unknown database '" + useDb + "'",
          nextState: nextState,
          hint: 'Nama database yang dibuat adalah db_loginCashles. Ketik: USE db_loginCashles;',
        };
      }
      nextState.dbSelected = true;
      return {
        ok: true,
        output: 'Database changed — db_loginCashles aktif.',
        nextState: nextState,
        hint: 'Database sudah dipilih! Sekarang buat tabel tb_role lalu tb_user dengan ENGINE=InnoDB;',
      };
    }

    if (/^SHOW\s+TABLES$/i.test(stmt)) {
      if (!nextState.dbSelected) {
        return {
          ok: false,
          output: 'ERROR 1046 (3D000): No database selected',
          nextState: nextState,
          hint: 'Pilih database terlebih dahulu dengan: USE db_loginCashles;',
        };
      }
      var listOutput = nextState.tables.length > 0
        ? 'Tables_in_db_loginCashles:\n' + nextState.tables.map(function (t) { return '- ' + t; }).join('\n')
        : 'Empty set (0.00 sec)';
      return {
        ok: true,
        output: listOutput,
        nextState: nextState,
        hint: nextState.tables.length < 2
          ? 'Pastikan kedua tabel (tb_role dan tb_user) sudah dibuat.'
          : 'Kedua tabel sudah terdaftar. Anda bisa cek struktur dengan DESCRIBE tb_user;',
      };
    }

    var descMatch = stmt.match(/^(?:DESCRIBE|DESC)\s+([a-zA-Z0-9_]+)$/i);
    if (descMatch) {
      if (!nextState.dbSelected) {
        return {
          ok: false,
          output: 'ERROR 1046 (3D000): No database selected',
          nextState: nextState,
          hint: 'Pilih database terlebih dahulu dengan: USE db_loginCashles;',
        };
      }
      var descTarget = descMatch[1].toLowerCase();
      if (nextState.tables.indexOf(descTarget) === -1) {
        return {
          ok: false,
          output: "ERROR 1146 (42S02): Table 'db_loginCashles." + descMatch[1] + "' doesn't exist",
          nextState: nextState,
          hint: 'Tabel belum ada. Buat dulu tb_role dan tb_user atau cek daftar tabel dengan SHOW TABLES;',
        };
      }
      return {
        ok: true,
        output: formatDescribeOutput(descTarget),
        nextState: nextState,
        hint: 'Struktur kolom ' + descTarget + ' sesuai dengan skema ujian.',
      };
    }

    var createTblMatch = stmt.match(
      /^CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\((.+)\)(?:\s*ENGINE\s*=\s*([a-zA-Z0-9_]+))?$/i
    );
    if (createTblMatch) {
      if (!nextState.dbSelected) {
        return {
          ok: false,
          output: 'ERROR 1046 (3D000): No database selected',
          nextState: nextState,
          hint: 'Anda harus memilih database dulu sebelum membuat tabel. Ketik: USE db_loginCashles;',
        };
      }

      var tblIfNot = Boolean(createTblMatch[1]);
      var tblName = createTblMatch[2];
      var tblBody = createTblMatch[3];
      var engine = createTblMatch[4];
      var canonicalTbl = tblName.toLowerCase();

      if (engine && !/^innodb$/i.test(engine)) {
        return {
          ok: false,
          output: 'ERROR: ENGINE=' + engine + ' tidak mendukung relasi Foreign Key di phpMyAdmin Designer.',
          nextState: nextState,
          hint: 'Wajib gunakan ENGINE=InnoDB; agar relasi antar tabel di Bab 3 bisa dibuat.',
        };
      }

      if (canonicalTbl !== 'tb_role' && canonicalTbl !== 'tb_user') {
        return {
          ok: false,
          output: "ERROR: Nama tabel '" + tblName + "' tidak sesuai skema 2 tabel ujian.",
          nextState: nextState,
          hint: 'Gunakan nama tabel persis: tb_role dan tb_user.',
        };
      }

      if (nextState.tables.indexOf(canonicalTbl) !== -1 && !tblIfNot) {
        return {
          ok: false,
          output: "ERROR 1050 (42S01): Table '" + canonicalTbl + "' already exists",
          nextState: nextState,
          hint: 'Tabel ' + canonicalTbl + ' sudah dibuat.',
        };
      }

      var requiredCols = canonicalTbl === 'tb_role'
        ? ['id_role', 'nama_role']
        : ['id_user', 'rfid', 'nama', 'id_role'];

      var missingCols = requiredCols.filter(function (col) {
        return !(new RegExp('\\b' + col + '\\b', 'i')).test(tblBody);
      });

      if (missingCols.length > 0) {
        return {
          ok: false,
          output: 'ERROR: Kolom wajib pada ' + canonicalTbl + ' belum lengkap (' + missingCols.join(', ') + ').',
          nextState: nextState,
          hint: 'Pastikan ' + canonicalTbl + ' memiliki kolom: ' + requiredCols.join(', ') + '.',
        };
      }

      if (nextState.tables.indexOf(canonicalTbl) === -1) {
        nextState.tables.push(canonicalTbl);
      }

      var engineTip = engine
        ? ''
        : ' (Tips: biasakan menulis ENGINE=InnoDB; di akhir agar pasti mendukung Foreign Key.)';
      var nextHint = canonicalTbl === 'tb_role' && nextState.tables.indexOf('tb_user') === -1
        ? 'Tabel tb_role selesai! Berikutnya buat tabel tb_user dengan ENGINE=InnoDB;'
        : 'Kedua tabel selesai! Sekarang isi data awal dengan INSERT INTO tb_role ...;';

      return {
        ok: true,
        output: 'Query OK, 0 rows affected (0.02 sec) — Tabel ' + canonicalTbl + ' berhasil dibuat.' + engineTip,
        nextState: nextState,
        hint: nextHint,
      };
    }

    var insertMatch = stmt.match(/^INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*(?:\([^)]+\)\s*)?VALUES\s*(.+)$/i);
    if (insertMatch) {
      if (!nextState.dbSelected) {
        return {
          ok: false,
          output: 'ERROR 1046 (3D000): No database selected',
          nextState: nextState,
          hint: 'Pilih database dulu dengan: USE db_loginCashles;',
        };
      }
      var insTbl = insertMatch[1].toLowerCase();
      if (insTbl !== 'tb_role' && insTbl !== 'tb_user') {
        return {
          ok: false,
          output: "ERROR 1146 (42S02): Table '" + insertMatch[1] + "' tidak dikenali.",
          nextState: nextState,
          hint: 'Masukkan data awal ke tabel tb_role atau tb_user.',
        };
      }
      if (nextState.tables.indexOf(insTbl) === -1) {
        return {
          ok: false,
          output: "ERROR 1146 (42S02): Table 'db_loginCashles." + insTbl + "' doesn't exist",
          nextState: nextState,
          hint: 'Buat tabel ' + insTbl + ' terlebih dahulu dengan CREATE TABLE ' + insTbl + ' (...);',
        };
      }
      if (insTbl === 'tb_role') {
        nextState.roleInserted = true;
        return {
          ok: true,
          output: 'Query OK, rows inserted into tb_role (0.01 sec)',
          nextState: nextState,
          hint: nextState.userInserted
            ? 'Semua data awal siap! Coba ketik SHOW TABLES; atau DESCRIBE tb_user;'
            : 'Data role tersimpan! Selanjutnya masukkan data awal kartu RFID ke tb_user.',
        };
      }
      nextState.userInserted = true;
      return {
        ok: true,
        output: 'Query OK, rows inserted into tb_user (0.01 sec)',
        nextState: nextState,
        hint: 'Mantap! Data pengguna & kartu RFID berhasil disimpan. Lanjutkan cek dengan SHOW TABLES; atau DESCRIBE tb_user;',
      };
    }

    var selectMatch = stmt.match(/^SELECT\s+.+\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+.*)?$/i);
    if (selectMatch) {
      if (!nextState.dbSelected) {
        return {
          ok: false,
          output: 'ERROR 1046 (3D000): No database selected',
          nextState: nextState,
          hint: 'Pilih database dulu dengan: USE db_loginCashles;',
        };
      }
      var selTbl = selectMatch[1].toLowerCase();
      if (nextState.tables.indexOf(selTbl) === -1) {
        return {
          ok: false,
          output: "ERROR 1146 (42S02): Table 'db_loginCashles." + selectMatch[1] + "' doesn't exist",
          nextState: nextState,
          hint: 'Tabel ' + selectMatch[1] + ' belum dibuat.',
        };
      }
      if (selTbl === 'tb_role') {
        return {
          ok: true,
          output: nextState.roleInserted
            ? "1 | super_admin\n2 | teller\n2 rows in set"
            : 'Empty set (0.00 sec)',
          nextState: nextState,
          hint: nextState.roleInserted ? 'Data tb_role tampil.' : 'Isi dulu tb_role dengan INSERT INTO tb_role ...;',
        };
      }
      return {
        ok: true,
        output: nextState.userInserted
          ? "1 | 0012345678 | Super Admin | 1\n2 | 0087654321 | Teller 1 | 2\n2 rows in set"
          : 'Empty set (0.00 sec)',
        nextState: nextState,
        hint: nextState.userInserted ? 'Data tb_user tampil.' : 'Isi dulu tb_user dengan INSERT INTO tb_user ...;',
      };
    }

    if (/^CREATE\s+DB\b/i.test(stmt)) {
      return {
        ok: false,
        output: "ERROR 1064 (42000): Perintah 'CREATE DB' tidak valid di MySQL.",
        nextState: nextState,
        hint: 'Tulis lengkap: CREATE DATABASE db_loginCashles;',
      };
    }

    return {
      ok: false,
      output: "ERROR 1064 (42000): You have an error in your SQL syntax near '" + stmt + "'",
      nextState: nextState,
      hint: 'Periksa ejaan perintah SQL Anda atau klik chip Perintah Cepat di atas sebagai contoh.',
    };
  }

  function advanceDesignerStep(currentStep, actionId) {
    var step = typeof currentStep === 'number' && !isNaN(currentStep) ? Math.floor(currentStep) : 0;

    if (step >= DESIGNER_SEQUENCE.length) {
      return {
        ok: false,
        nextStep: DESIGNER_SEQUENCE.length,
        completed: true,
        message: 'Semua langkah relasi sudah selesai. Klik tombol Reset Simulasi jika ingin mencoba ulang.',
      };
    }

    if (step < 0) {
      step = 0;
    }

    var expected = DESIGNER_SEQUENCE[step];
    if (actionId === expected.actionId) {
      var nextStep = step + 1;
      return {
        ok: true,
        nextStep: nextStep,
        completed: nextStep >= DESIGNER_SEQUENCE.length,
        message: expected.successMessage,
      };
    }

    if (actionId === 'link-pk-to-fk' && step < 2) {
      return {
        ok: false,
        nextStep: step,
        completed: false,
        message: 'Gagal di phpMyAdmin Designer: kolom tb_user.id_role wajib diberi INDEX terlebih dahulu sebelum dihubungkan! (' + expected.expectedHint + ')',
      };
    }

    return {
      ok: false,
      nextStep: step,
      completed: false,
      message: 'Urutan langkah belum sesuai. Langkah ' + (step + 1) + ': ' + expected.expectedHint,
    };
  }

  function simulateCrudAction(records, action) {
    var list = cloneUsers(records);
    var act = action && typeof action === 'object' ? action : {};
    var type = String(act.type || '').toLowerCase();

    if (type === 'select' || type === 'read') {
      return {
        ok: true,
        sql: 'SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role ORDER BY tb_user.id_user ASC',
        records: list,
        message: 'Berhasil mengambil ' + list.length + ' baris pengguna beserta nama_role dari tb_role.',
      };
    }

    if (type === 'insert') {
      var newRfid = String(act.rfid == null ? '' : act.rfid).trim();
      var newNama = String(act.nama == null ? '' : act.nama).trim();
      var newRoleId = parseInt(act.id_role, 10) || 2;

      if (!newRfid || !newNama) {
        return {
          ok: false,
          sql: '',
          records: list,
          message: 'Kode RFID dan Nama pengguna tidak boleh kosong!',
        };
      }

      var duplicateInsert = list.some(function (u) { return u.rfid === newRfid; });
      if (duplicateInsert) {
        return {
          ok: false,
          sql: "INSERT INTO tb_user (rfid, nama, id_role) VALUES ('" + escapeSqlLiteral(newRfid) + "', '" + escapeSqlLiteral(newNama) + "', '" + newRoleId + "')",
          records: list,
          message: "Gagal: Duplicate entry '" + newRfid + "' for key 'rfid' (kode RFID harus UNIQUE).",
        };
      }

      var maxId = list.reduce(function (acc, item) {
        return item.id_user > acc ? item.id_user : acc;
      }, 0);
      var nextId = maxId + 1;
      var newRecord = {
        id_user: nextId,
        rfid: newRfid,
        nama: newNama,
        id_role: newRoleId,
        nama_role: roleIdToName(newRoleId),
      };

      return {
        ok: true,
        sql: "INSERT INTO tb_user (rfid, nama, id_role) VALUES ('" + escapeSqlLiteral(newRfid) + "', '" + escapeSqlLiteral(newNama) + "', '" + newRoleId + "')",
        records: list.concat([newRecord]),
        message: "Berhasil menambahkan '" + newNama + "' (id_user=" + nextId + ').',
      };
    }

    if (type === 'update') {
      var targetId = parseInt(act.id_user, 10);
      var targetIdx = -1;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id_user === targetId) {
          targetIdx = i;
          break;
        }
      }
      if (targetIdx === -1) {
        return {
          ok: false,
          sql: '',
          records: list,
          message: 'Data dengan id_user=' + String(act.id_user) + ' tidak ditemukan.',
        };
      }

      var updRfid = String(act.rfid == null ? '' : act.rfid).trim();
      var updNama = String(act.nama == null ? '' : act.nama).trim();
      var updRoleId = parseInt(act.id_role, 10) || list[targetIdx].id_role;

      if (!updRfid || !updNama) {
        return {
          ok: false,
          sql: '',
          records: list,
          message: 'Kode RFID dan Nama tidak boleh kosong saat menyimpan perubahan!',
        };
      }

      var duplicateUpdate = list.some(function (u) {
        return u.id_user !== targetId && u.rfid === updRfid;
      });
      if (duplicateUpdate) {
        return {
          ok: false,
          sql: '',
          records: list,
          message: "Gagal: Kode RFID '" + updRfid + "' sudah digunakan oleh pengguna lain.",
        };
      }

      var updated = list.slice();
      updated[targetIdx] = {
        id_user: targetId,
        rfid: updRfid,
        nama: updNama,
        id_role: updRoleId,
        nama_role: roleIdToName(updRoleId),
      };

      return {
        ok: true,
        sql: "UPDATE tb_user SET rfid='" + escapeSqlLiteral(updRfid) + "', nama='" + escapeSqlLiteral(updNama) + "', id_role='" + updRoleId + "' WHERE id_user='" + targetId + "'",
        records: updated,
        message: 'Berhasil mengubah data id_user=' + targetId + ' (hanya 1 baris target yang diperbarui).',
      };
    }

    if (type === 'delete') {
      var delId = parseInt(act.id_user, 10);
      var exists = list.some(function (u) { return u.id_user === delId; });
      if (!exists) {
        return {
          ok: false,
          sql: '',
          records: list,
          message: 'Data dengan id_user=' + String(act.id_user) + ' tidak ditemukan.',
        };
      }

      var remaining = list.filter(function (u) { return u.id_user !== delId; });
      return {
        ok: true,
        sql: "DELETE FROM tb_user WHERE id_user='" + delId + "'",
        records: remaining,
        message: 'Baris id_user=' + delId + ' berhasil dihapus dari tb_user.',
      };
    }

    return {
      ok: false,
      sql: '',
      records: list,
      message: 'Tipe aksi CRUD tidak dikenali: ' + type,
    };
  }

  function simulateRfidTap(uid, users) {
    var cleanUid = String(uid == null ? '' : uid).trim();
    if (!cleanUid) {
      return {
        ok: false,
        sqlExecuted: '',
        session: null,
        redirect: null,
        message: 'UID kartu RFID kosong. Tap salah satu kartu atau ketik UID lalu tekan Enter.',
      };
    }

    var sqlExecuted =
      "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role WHERE rfid = '" +
      escapeSqlLiteral(cleanUid) +
      "'";

    var list = cloneUsers(users);
    var match = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].rfid === cleanUid) {
        match = list[i];
        break;
      }
    }

    if (!match) {
      return {
        ok: false,
        sqlExecuted: sqlExecuted,
        session: null,
        redirect: null,
        message: 'Kartu RFID tidak terdaftar! Akses ditolak (mysqli_num_rows = 0).',
      };
    }

    var session = {
      id_user: match.id_user,
      nama: match.nama,
      nama_role: match.nama_role || roleIdToName(match.id_role),
    };

    return {
      ok: true,
      sqlExecuted: sqlExecuted,
      session: session,
      redirect: 'beranda.php',
      message: 'Login berhasil! Selamat datang, ' + session.nama + ' (' + session.nama_role + '). Mengarahkan ke beranda.php...',
    };
  }

  function createEl(doc, tag, className, text) {
    var node = doc.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text != null) {
      node.textContent = String(text);
    }
    return node;
  }

  function disableAutoKeyboard(inputEl) {
    if (!inputEl || typeof inputEl.setAttribute !== 'function') {
      return;
    }
    inputEl.setAttribute('autocapitalize', 'none');
    inputEl.setAttribute('autocorrect', 'off');
    inputEl.setAttribute('spellcheck', 'false');
    inputEl.setAttribute('autocomplete', 'off');
  }

  function notifyInteract(onInteract, chapter, payload) {
    if (typeof onInteract === 'function') {
      onInteract({
        chapterId: chapter ? chapter.id : null,
        simulatorType: chapter ? chapter.simulatorType : null,
        detail: payload || {},
      });
    }
  }

  function renderSetupChecklist(doc, containerEl, chapter, onInteract) {
    var cfg = chapter.simulatorConfig || {};
    var items = Array.isArray(cfg.items) ? cfg.items : [];
    var checkedMap = Object.create(null);

    var wrap = createEl(doc, 'div', 'sim-box sim-checklist');
    var header = createEl(doc, 'div', 'sim-header');
    header.appendChild(createEl(doc, 'h4', 'sim-title', 'Checklist Persiapan (Bab 1)'));
    var badge = createEl(doc, 'span', 'sim-badge', '0 / ' + items.length);
    header.appendChild(badge);
    wrap.appendChild(header);

    var progressWrap = createEl(doc, 'div', 'sim-progress-track');
    var progressFill = createEl(doc, 'div', 'sim-progress-fill');
    progressWrap.appendChild(progressFill);
    wrap.appendChild(progressWrap);

    var listEl = createEl(doc, 'ul', 'sim-checklist-list');
    var doneNote = createEl(doc, 'div', 'sim-feedback sim-feedback-ok', '');
    doneNote.style.display = 'none';

    function updateProgress() {
      var count = 0;
      for (var i = 0; i < items.length; i++) {
        if (checkedMap[items[i].id]) {
          count += 1;
        }
      }
      var pct = items.length > 0 ? Math.round((count / items.length) * 100) : 0;
      badge.textContent = count + ' / ' + items.length + ' (' + pct + '%)';
      progressFill.style.width = pct + '%';
      if (items.length > 0 && count === items.length) {
        doneNote.style.display = 'block';
        doneNote.textContent = 'Semua persiapan selesai.';
      } else {
        doneNote.style.display = 'none';
      }
    }

    items.forEach(function (item) {
      var li = createEl(doc, 'li', 'sim-checklist-item');
      var row = createEl(doc, 'label', 'sim-check-label');
      var cb = createEl(doc, 'input', 'sim-checkbox');
      cb.type = 'checkbox';
      cb.setAttribute('data-item-id', item.id);
      row.appendChild(cb);
      row.appendChild(createEl(doc, 'span', 'sim-check-text', item.label));
      li.appendChild(row);

      if (item.command) {
        li.appendChild(createEl(doc, 'code', 'sim-cmd-chip', item.command));
      }
      if (item.tip) {
        li.appendChild(createEl(doc, 'p', 'sim-item-tip', item.tip));
      }

      cb.addEventListener('change', function () {
        checkedMap[item.id] = Boolean(cb.checked);
        li.className = cb.checked ? 'sim-checklist-item is-checked' : 'sim-checklist-item';
        updateProgress();
        notifyInteract(onInteract, chapter, { itemId: item.id, checked: Boolean(cb.checked) });
      });

      listEl.appendChild(li);
    });

    wrap.appendChild(listEl);
    wrap.appendChild(doneNote);
    containerEl.appendChild(wrap);
    updateProgress();
  }

  function renderMysqlCli(doc, containerEl, chapter, onInteract) {
    var cfg = chapter.simulatorConfig || {};
    var promptLabel = cfg.prompt || 'mysql>';
    var suggested = Array.isArray(cfg.suggestedCommands) ? cfg.suggestedCommands : [];
    var cliState = createInitialCliState();
    var history = [];
    var historyIdx = -1;

    var wrap = createEl(doc, 'div', 'sim-box sim-mysql-cli');
    var header = createEl(doc, 'div', 'sim-header');
    header.appendChild(createEl(doc, 'h4', 'sim-title', 'MySQL CLI Virtual'));
    var resetBtn = createEl(doc, 'button', 'sim-btn sim-btn-secondary', 'Reset');
    resetBtn.type = 'button';
    header.appendChild(resetBtn);
    wrap.appendChild(header);

    if (cfg.goalText) {
      wrap.appendChild(createEl(doc, 'p', 'sim-desc', cfg.goalText));
    }

    var pillsWrap = createEl(doc, 'div', 'sim-status-pills');
    var pillDb = createEl(doc, 'span', 'sim-pill', '1. DB db_loginCashles');
    var pillUse = createEl(doc, 'span', 'sim-pill', '2. USE aktif');
    var pillRole = createEl(doc, 'span', 'sim-pill', '3. tb_role');
    var pillUser = createEl(doc, 'span', 'sim-pill', '4. tb_user');
    var pillSeed = createEl(doc, 'span', 'sim-pill', '5. Data Awal');
    [pillDb, pillUse, pillRole, pillUser, pillSeed].forEach(function (p) {
      pillsWrap.appendChild(p);
    });
    wrap.appendChild(pillsWrap);

    function syncPills() {
      pillDb.className = cliState.dbCreated ? 'sim-pill is-ok' : 'sim-pill';
      pillUse.className = cliState.dbSelected ? 'sim-pill is-ok' : 'sim-pill';
      pillRole.className = cliState.tables.indexOf('tb_role') !== -1 ? 'sim-pill is-ok' : 'sim-pill';
      pillUser.className = cliState.tables.indexOf('tb_user') !== -1 ? 'sim-pill is-ok' : 'sim-pill';
      pillSeed.className = cliState.roleInserted && cliState.userInserted ? 'sim-pill is-ok' : 'sim-pill';
    }

    var termLog = createEl(doc, 'div', 'sim-terminal-log');
    termLog.setAttribute('role', 'log');
    termLog.setAttribute('aria-live', 'polite');

    function appendLog(kind, text) {
      if (!text) return;
      var line = createEl(doc, 'pre', 'sim-term-line sim-term-' + kind, text);
      termLog.appendChild(line);
      termLog.scrollTop = termLog.scrollHeight;
    }

    function initTerminalBanner() {
      termLog.innerHTML = '';
      appendLog('info', 'MySQL CLI siap. Tutup tiap perintah dengan titik koma (;).');
    }

    var form = createEl(doc, 'form', 'sim-cli-form');
    form.appendChild(createEl(doc, 'span', 'sim-cli-prompt', promptLabel));
    var cmdInput = createEl(doc, 'input', 'sim-cli-input');
    cmdInput.type = 'text';
    cmdInput.placeholder = 'Contoh: CREATE DATABASE db_loginCashles;';
    cmdInput.setAttribute('aria-label', 'Perintah MySQL CLI');
    disableAutoKeyboard(cmdInput);
    var runBtn = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Jalankan');
    runBtn.type = 'submit';
    form.appendChild(cmdInput);
    form.appendChild(runBtn);

    if (suggested.length > 0) {
      var chipsBox = createEl(doc, 'div', 'sim-chips-box');
      chipsBox.appendChild(createEl(doc, 'div', 'sim-chips-label', 'Isi cepat:'));
      var chipsRow = createEl(doc, 'div', 'sim-chips-row');
      suggested.forEach(function (cmd, idx) {
        var chipBtn = createEl(doc, 'button', 'sim-chip-btn', (idx + 1) + '. ' + cmd.split('(')[0].trim());
        chipBtn.type = 'button';
        chipBtn.title = cmd;
        chipBtn.addEventListener('click', function () {
          cmdInput.value = cmd;
          cmdInput.focus();
        });
        chipsRow.appendChild(chipBtn);
      });
      chipsBox.appendChild(chipsRow);
      wrap.appendChild(chipsBox);
    }

    var hintBox = createEl(doc, 'div', 'sim-feedback', 'Tips: mulai dengan CREATE DATABASE db_loginCashles;');

    form.addEventListener('submit', function (evt) {
      if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
      }
      var raw = cmdInput.value;
      if (raw.trim()) {
        history.push(raw);
        historyIdx = history.length;
      }
      appendLog('cmd', promptLabel + ' ' + raw);
      var res = evaluateMysqlCliCommand(raw, cliState);
      cliState = res.nextState;
      syncPills();
      if (res.output) {
        appendLog(res.ok ? 'out' : 'err', res.output);
      }
      hintBox.className = res.ok ? 'sim-feedback sim-feedback-ok' : 'sim-feedback sim-feedback-err';
      hintBox.textContent = res.hint;
      if (res.ok) {
        cmdInput.value = '';
      }
      notifyInteract(onInteract, chapter, { ok: res.ok, command: raw, state: cliState });
    });

    cmdInput.addEventListener('keydown', function (evt) {
      if (!evt) return;
      if (evt.key === 'ArrowUp' && history.length > 0) {
        historyIdx = Math.max(0, historyIdx - 1);
        cmdInput.value = history[historyIdx] || '';
        if (typeof evt.preventDefault === 'function') evt.preventDefault();
      } else if (evt.key === 'ArrowDown' && history.length > 0) {
        historyIdx = Math.min(history.length, historyIdx + 1);
        cmdInput.value = historyIdx < history.length ? history[historyIdx] : '';
        if (typeof evt.preventDefault === 'function') evt.preventDefault();
      }
    });

    resetBtn.addEventListener('click', function () {
      cliState = createInitialCliState();
      history = [];
      historyIdx = -1;
      cmdInput.value = '';
      syncPills();
      initTerminalBanner();
      hintBox.className = 'sim-feedback';
      hintBox.textContent = 'Terminal di-reset. Mulai dengan CREATE DATABASE db_loginCashles;';
    });

    initTerminalBanner();
    syncPills();
    wrap.appendChild(termLog);
    wrap.appendChild(form);
    wrap.appendChild(hintBox);
    containerEl.appendChild(wrap);
  }

  function renderDesignerSvgMarkup(completed) {
    var strokeColor = completed ? '#166534' : '#C5C2B8';
    var dashAttr = completed ? '' : ' stroke-dasharray="6 6"';
    var labelText = completed
      ? 'FK CASCADE AKTIF (tb_role.id_role -> tb_user.id_role)'
      : 'Belum terhubung (pasang INDEX lalu tarik relasi)';
    var labelFill = completed ? '#166534' : '#52525B';
    return [
      '<svg class="sim-designer-svg" viewBox="0 0 600 90" width="100%" height="90" aria-hidden="true">',
      '<defs><marker id="sim-fk-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">',
      '<polygon points="0 0, 10 3.5, 0 7" fill="' + strokeColor + '" />',
      '</marker></defs>',
      '<path d="M 150 28 C 260 28, 340 62, 450 62" fill="none" stroke="' + strokeColor + '" stroke-width="3"' + dashAttr + ' marker-end="url(#sim-fk-arrow)" />',
      '<text x="300" y="20" text-anchor="middle" font-size="12" font-weight="600" fill="' + labelFill + '">' + escapeHtml(labelText) + '</text>',
      '</svg>',
    ].join('');
  }

  function renderPhpmyadminDesigner(doc, containerEl, chapter, onInteract) {
    var cfg = chapter.simulatorConfig || {};
    var steps = Array.isArray(cfg.steps) && cfg.steps.length > 0
      ? cfg.steps
      : DESIGNER_SEQUENCE.map(function (s, idx) {
          return { actionId: s.actionId, label: (idx + 1) + '. ' + s.actionId, instruction: s.expectedHint };
        });

    var currentStep = 0;
    var wrap = createEl(doc, 'div', 'sim-box sim-designer');
    var header = createEl(doc, 'div', 'sim-header');
    header.appendChild(createEl(doc, 'h4', 'sim-title', 'Simulasi phpMyAdmin Designer'));
    var stepBadge = createEl(doc, 'span', 'sim-badge', 'Langkah 0 / ' + steps.length);
    var resetBtn = createEl(doc, 'button', 'sim-btn sim-btn-secondary', 'Reset');
    resetBtn.type = 'button';
    var rightHead = createEl(doc, 'div', 'sim-header-actions');
    rightHead.appendChild(stepBadge);
    rightHead.appendChild(resetBtn);
    header.appendChild(rightHead);
    wrap.appendChild(header);

    var canvas = createEl(doc, 'div', 'sim-designer-canvas');
    var tablesRow = createEl(doc, 'div', 'sim-designer-tables');

    var cardRole = createEl(doc, 'div', 'sim-db-card');
    cardRole.appendChild(createEl(doc, 'div', 'sim-db-card-title', 'tb_role (Master / PK)'));
    var roleCols = createEl(doc, 'ul', 'sim-db-cols');
    roleCols.appendChild(createEl(doc, 'li', 'sim-col-pk', 'PK  id_role  INT (AUTO_INCREMENT)'));
    roleCols.appendChild(createEl(doc, 'li', '', '    nama_role  VARCHAR(50)'));
    cardRole.appendChild(roleCols);

    var cardUser = createEl(doc, 'div', 'sim-db-card');
    var userCardTitle = createEl(doc, 'div', 'sim-db-card-title', 'tb_user (Child / FK)');
    cardUser.appendChild(userCardTitle);
    var userCols = createEl(doc, 'ul', 'sim-db-cols');
    userCols.appendChild(createEl(doc, 'li', 'sim-col-pk', 'PK  id_user  INT (AUTO_INCREMENT)'));
    userCols.appendChild(createEl(doc, 'li', '', 'UNI rfid     VARCHAR(50)'));
    userCols.appendChild(createEl(doc, 'li', '', '    nama     VARCHAR(100)'));
    var userIdRoleRow = createEl(doc, 'li', 'sim-col-fk', '    id_role  INT');
    userCols.appendChild(userIdRoleRow);
    cardUser.appendChild(userCols);

    tablesRow.appendChild(cardRole);
    tablesRow.appendChild(cardUser);
    canvas.appendChild(tablesRow);

    var svgHost = createEl(doc, 'div', 'sim-designer-svg-host');
    canvas.appendChild(svgHost);
    wrap.appendChild(canvas);

    var actionsGrid = createEl(doc, 'div', 'sim-designer-actions');
    var feedback = createEl(doc, 'div', 'sim-feedback', 'Klik sesuai urutan: pilih tb_user lalu pasang INDEX.');
    var actionButtons = [];

    function syncDesignerView() {
      stepBadge.textContent = 'Langkah ' + currentStep + ' / ' + steps.length;
      cardUser.className = currentStep >= 1 ? 'sim-db-card is-selected' : 'sim-db-card';
      userIdRoleRow.textContent = currentStep >= 4
        ? 'FK+IDX id_role  INT -> tb_role.id_role'
        : currentStep >= 2
          ? 'IDX id_role  INT (Siap Relasi)'
          : '    id_role  INT (Belum Index)';
      userIdRoleRow.className = currentStep >= 4
        ? 'sim-col-fk is-linked'
        : currentStep >= 2
          ? 'sim-col-fk is-indexed'
          : 'sim-col-fk';
      svgHost.innerHTML = renderDesignerSvgMarkup(currentStep >= 4);

      actionButtons.forEach(function (entry, idx) {
        entry.btn.className = idx < currentStep
          ? 'sim-btn sim-btn-done'
          : idx === currentStep
            ? 'sim-btn sim-btn-primary'
            : 'sim-btn sim-btn-secondary';
      });
    }

    steps.forEach(function (st) {
      var btn = createEl(doc, 'button', 'sim-btn sim-btn-secondary', st.label);
      btn.type = 'button';
      btn.title = st.instruction || '';
      btn.setAttribute('data-action-id', st.actionId);
      btn.addEventListener('click', function () {
        var res = advanceDesignerStep(currentStep, st.actionId);
        currentStep = res.nextStep;
        feedback.className = res.ok ? 'sim-feedback sim-feedback-ok' : 'sim-feedback sim-feedback-err';
        feedback.textContent = res.message;
        syncDesignerView();
        notifyInteract(onInteract, chapter, { actionId: st.actionId, step: currentStep, ok: res.ok });
      });
      actionButtons.push({ step: st, btn: btn });
      actionsGrid.appendChild(btn);
    });

    resetBtn.addEventListener('click', function () {
      currentStep = 0;
      feedback.className = 'sim-feedback';
      feedback.textContent = 'Simulasi di-reset. Mulai kembali dari Langkah 1.';
      syncDesignerView();
    });

    syncDesignerView();
    wrap.appendChild(actionsGrid);
    wrap.appendChild(feedback);
    containerEl.appendChild(wrap);
  }

  function renderCrudTable(doc, tableHost, records, options) {
    tableHost.innerHTML = '';
    var table = createEl(doc, 'table', 'sim-table');
    var thead = createEl(doc, 'thead');
    var headRow = createEl(doc, 'tr');
    ['No', 'id_user', 'rfid', 'nama', 'id_role', 'nama_role (JOIN)', 'Aksi'].forEach(function (h) {
      headRow.appendChild(createEl(doc, 'th', '', h));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = createEl(doc, 'tbody');
    if (records.length === 0) {
      var emptyRow = createEl(doc, 'tr');
      var emptyCell = createEl(doc, 'td', 'sim-empty-cell', 'Belum ada baris di tb_user.');
      emptyCell.setAttribute('colspan', '7');
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      records.forEach(function (rec, idx) {
        var tr = createEl(doc, 'tr');
        tr.appendChild(createEl(doc, 'td', '', String(idx + 1)));
        tr.appendChild(createEl(doc, 'td', '', String(rec.id_user)));
        tr.appendChild(createEl(doc, 'td', 'sim-mono', rec.rfid));
        tr.appendChild(createEl(doc, 'td', '', rec.nama));
        tr.appendChild(createEl(doc, 'td', '', String(rec.id_role)));
        tr.appendChild(createEl(doc, 'td', '', rec.nama_role));

        var actCell = createEl(doc, 'td', 'sim-table-actions');
        if (options && typeof options.onEdit === 'function') {
          var editBtn = createEl(doc, 'button', 'sim-btn sim-btn-small', 'Edit (?id=' + rec.id_user + ')');
          editBtn.type = 'button';
          editBtn.addEventListener('click', function () {
            options.onEdit(rec);
          });
          actCell.appendChild(editBtn);
        }
        if (options && typeof options.onDelete === 'function') {
          var delBtn = createEl(doc, 'button', 'sim-btn sim-btn-small sim-btn-danger', 'Hapus (?id=' + rec.id_user + ')');
          delBtn.type = 'button';
          delBtn.addEventListener('click', function () {
            options.onDelete(rec);
          });
          actCell.appendChild(delBtn);
        }
        if (!options || (!options.onEdit && !options.onDelete)) {
          actCell.appendChild(createEl(doc, 'span', 'sim-muted', 'edit.php?id=' + rec.id_user + ' | hapus.php?id=' + rec.id_user));
        }
        tr.appendChild(actCell);
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);
    tableHost.appendChild(table);
  }

  function renderCrudFlow(doc, containerEl, chapter, onInteract) {
    var cfg = chapter.simulatorConfig || {};
    var focusMode = cfg.focusMode || 'tampil';
    var records = cloneUsers(DEFAULT_USERS);
    var editingId = null;

    var wrap = createEl(doc, 'div', 'sim-box sim-crud-flow');
    var header = createEl(doc, 'div', 'sim-header');
    header.appendChild(createEl(doc, 'h4', 'sim-title', cfg.title || 'Simulator Alur CRUD PHP + MySQL'));
    var resetBtn = createEl(doc, 'button', 'sim-btn sim-btn-secondary', 'Reset Data');
    resetBtn.type = 'button';
    header.appendChild(resetBtn);
    wrap.appendChild(header);

    if (cfg.description) {
      wrap.appendChild(createEl(doc, 'p', 'sim-desc', cfg.description));
    }

    var controlHost = createEl(doc, 'div', 'sim-crud-controls');
    var sqlInspector = createEl(doc, 'pre', 'sim-sql-inspector');
    var feedback = createEl(doc, 'div', 'sim-feedback', '');
    var tableHost = createEl(doc, 'div', 'sim-table-host');

    function setInspector(sqlText, ok, msg) {
      sqlInspector.textContent = sqlText || '-- Belum ada query dijalankan';
      feedback.className = ok ? 'sim-feedback sim-feedback-ok' : 'sim-feedback sim-feedback-err';
      feedback.textContent = msg || '';
    }

    function refreshTable() {
      renderCrudTable(doc, tableHost, records, {
        onEdit: focusMode === 'edit' ? startEditRow : null,
        onDelete: focusMode === 'hapus' ? deleteRow : null,
      });
    }

    function startEditRow(rec) {
      editingId = rec.id_user;
      if (rfidInput) rfidInput.value = rec.rfid;
      if (namaInput) namaInput.value = rec.nama;
      if (roleSelect) roleSelect.value = String(rec.id_role);
      if (targetBadge) targetBadge.textContent = 'Target URL: edit.php?id=' + rec.id_user;
      setInspector(
        "SELECT * FROM tb_user WHERE id_user='" + rec.id_user + "'",
        true,
        'Data lama untuk id_user=' + rec.id_user + ' dimuat ke form (value="..." & selected).'
      );
    }

    function deleteRow(rec) {
      var res = simulateCrudAction(records, { type: 'delete', id_user: rec.id_user });
      records = res.records;
      setInspector(res.sql + "\n-- Lalu redirect: header('Location: tampil.php');", res.ok, res.message);
      refreshTable();
      notifyInteract(onInteract, chapter, { focusMode: focusMode, action: 'delete', id_user: rec.id_user });
    }

    var rfidInput = null;
    var namaInput = null;
    var roleSelect = null;
    var targetBadge = null;

    if (focusMode === 'koneksi') {
      var btnOk = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Uji Koneksi Benar (db_loginCashles)');
      var btnFail = createEl(doc, 'button', 'sim-btn sim-btn-secondary', 'Uji Salah Nama Database (db_salah)');
      btnOk.type = 'button';
      btnFail.type = 'button';
      btnOk.addEventListener('click', function () {
        setInspector(
          '$koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles");\n// Status: TRUE (Terhubung ke MySQL)',
          true,
          'Koneksi berhasil! File lain cukup memanggil include "koneksi.php"; untuk memakai $koneksi.'
        );
        notifyInteract(onInteract, chapter, { focusMode: 'koneksi', ok: true });
      });
      btnFail.addEventListener('click', function () {
        setInspector(
          '$koneksi = mysqli_connect("localhost", "root", "", "db_salah");\n// Warning: Unknown database \'db_salah\' -> die("Koneksi gagal...")',
          false,
          'Koneksi gagal karena nama database tidak cocok dengan Bab 2 (seharusnya db_loginCashles).'
        );
        notifyInteract(onInteract, chapter, { focusMode: 'koneksi', ok: false });
      });
      controlHost.appendChild(btnOk);
      controlHost.appendChild(btnFail);
      setInspector('$koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles");', true, 'Klik tombol di atas untuk menguji alur koneksi.php.');
    } else if (focusMode === 'beranda') {
      var btnNoSess = createEl(doc, 'button', 'sim-btn sim-btn-secondary', 'Buka beranda.php Tanpa Session');
      var btnWithSess = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Buka beranda.php Dengan $_SESSION');
      btnNoSess.type = 'button';
      btnWithSess.type = 'button';
      btnNoSess.addEventListener('click', function () {
        setInspector(
          "session_start();\nif (!isset($_SESSION['id_user'])) {\n    header(\"Location: login.php\");\n    exit;\n}",
          false,
          'Ditolak penjaga session! Karena $_SESSION["id_user"] kosong, pengunjung langsung dilempar ke login.php.'
        );
        notifyInteract(onInteract, chapter, { focusMode: 'beranda', hasSession: false });
      });
      btnWithSess.addEventListener('click', function () {
        setInspector(
          "// $_SESSION = ['id_user' => 1, 'nama' => 'Super Admin', 'nama_role' => 'super_admin']\nSelamat datang, Super Admin (super_admin)",
          true,
          'Session valid! beranda.php menampilkan sapaan nama & role serta menu ke tampil.php, tambah.php, dan logout.php.'
        );
        notifyInteract(onInteract, chapter, { focusMode: 'beranda', hasSession: true });
      });
      controlHost.appendChild(btnNoSess);
      controlHost.appendChild(btnWithSess);
      setInspector('session_start(); // Cek isset($_SESSION["id_user"])', true, 'Pilih kondisi session di atas untuk melihat proteksi beranda.php.');
    } else if (focusMode === 'tampil') {
      var btnJoin = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Jalankan Query JOIN tampil.php');
      btnJoin.type = 'button';
      btnJoin.addEventListener('click', function () {
        var res = simulateCrudAction(records, { type: 'select' });
        setInspector(res.sql, res.ok, res.message);
        refreshTable();
        notifyInteract(onInteract, chapter, { focusMode: 'tampil' });
      });
      controlHost.appendChild(btnJoin);
      var initRead = simulateCrudAction(records, { type: 'select' });
      setInspector(initRead.sql, true, 'Kolom nama_role muncul di tabel karena tb_user di-JOIN ke tb_role lewat id_role.');
    } else if (focusMode === 'tambah') {
      var modeHint = createEl(doc, 'div', 'sim-crud-mode-row');
      var modeSelect = createEl(doc, 'select', 'sim-input');
      var opt1 = createEl(doc, 'option', '', 'Cara 1: Proses di halaman sama (tambah.php)');
      opt1.value = 'tambah.php';
      var opt2 = createEl(doc, 'option', '', 'Cara 2: Proses di halaman berbeda (proses_tambah.php)');
      opt2.value = 'proses_tambah.php';
      modeSelect.appendChild(opt1);
      modeSelect.appendChild(opt2);
      modeHint.appendChild(modeSelect);
      controlHost.appendChild(modeHint);

      var formAdd = createEl(doc, 'form', 'sim-crud-form');
      rfidInput = createEl(doc, 'input', 'sim-input');
      rfidInput.type = 'text';
      rfidInput.placeholder = 'Kode RFID baru (misal 0055566677)';
      disableAutoKeyboard(rfidInput);
      namaInput = createEl(doc, 'input', 'sim-input');
      namaInput.type = 'text';
      namaInput.placeholder = 'Nama pengguna (misal Budi)';
      roleSelect = createEl(doc, 'select', 'sim-input');
      DEFAULT_ROLES.forEach(function (r) {
        var opt = createEl(doc, 'option', '', r.nama_role);
        opt.value = String(r.id_role);
        roleSelect.appendChild(opt);
      });
      roleSelect.value = '2';

      var submitAdd = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Simpan (POST)');
      submitAdd.type = 'submit';
      formAdd.appendChild(rfidInput);
      formAdd.appendChild(namaInput);
      formAdd.appendChild(roleSelect);
      formAdd.appendChild(submitAdd);

      formAdd.addEventListener('submit', function (evt) {
        if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
        var res = simulateCrudAction(records, {
          type: 'insert',
          rfid: rfidInput.value,
          nama: namaInput.value,
          id_role: roleSelect.value,
        });
        records = res.records;
        var targetPage = modeSelect.value;
        var trace = res.sql
          ? '// Action form: ' + targetPage + '\n' + res.sql + "\n// Lalu redirect: header('Location: tampil.php');"
          : '// Gagal validasi di ' + targetPage;
        setInspector(trace, res.ok, res.message);
        if (res.ok) {
          rfidInput.value = '';
          namaInput.value = '';
        }
        refreshTable();
        notifyInteract(onInteract, chapter, { focusMode: 'tambah', targetPage: targetPage, ok: res.ok });
      });

      controlHost.appendChild(formAdd);
      setInspector("INSERT INTO tb_user (rfid, nama, id_role) VALUES ('...', '...', '...')", true, 'Isi form di atas lalu klik Simpan untuk menambah baris ke tabel simulasi.');
    } else if (focusMode === 'edit') {
      targetBadge = createEl(doc, 'div', 'sim-badge', 'Target URL: edit.php?id=2');
      controlHost.appendChild(targetBadge);

      var formEdit = createEl(doc, 'form', 'sim-crud-form');
      rfidInput = createEl(doc, 'input', 'sim-input');
      rfidInput.type = 'text';
      disableAutoKeyboard(rfidInput);
      namaInput = createEl(doc, 'input', 'sim-input');
      namaInput.type = 'text';
      roleSelect = createEl(doc, 'select', 'sim-input');
      DEFAULT_ROLES.forEach(function (r) {
        var opt = createEl(doc, 'option', '', r.nama_role);
        opt.value = String(r.id_role);
        roleSelect.appendChild(opt);
      });
      var submitEdit = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Simpan Perubahan (UPDATE)');
      submitEdit.type = 'submit';
      formEdit.appendChild(rfidInput);
      formEdit.appendChild(namaInput);
      formEdit.appendChild(roleSelect);
      formEdit.appendChild(submitEdit);

      // Pre-fill row 2 by default
      editingId = records[1] ? records[1].id_user : records[0].id_user;
      var firstRec = records.filter(function (r) { return r.id_user === editingId; })[0];
      if (firstRec) {
        rfidInput.value = firstRec.rfid;
        namaInput.value = firstRec.nama;
        roleSelect.value = String(firstRec.id_role);
      }

      formEdit.addEventListener('submit', function (evt) {
        if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
        var res = simulateCrudAction(records, {
          type: 'update',
          id_user: editingId,
          rfid: rfidInput.value,
          nama: namaInput.value,
          id_role: roleSelect.value,
        });
        records = res.records;
        setInspector(res.sql || '-- Gagal update', res.ok, res.message);
        refreshTable();
        notifyInteract(onInteract, chapter, { focusMode: 'edit', id_user: editingId, ok: res.ok });
      });

      controlHost.appendChild(formEdit);
      setInspector("UPDATE tb_user SET rfid='...', nama='...', id_role='...' WHERE id_user='" + editingId + "'", true, 'Klik tombol Edit pada baris tabel atau ubah form di atas lalu klik Simpan Perubahan.');
    } else if (focusMode === 'hapus') {
      setInspector("DELETE FROM tb_user WHERE id_user='...'", true, 'Klik tombol Hapus pada salah satu baris di tabel di bawah untuk melihat query DELETE.');
    }

    resetBtn.addEventListener('click', function () {
      records = cloneUsers(DEFAULT_USERS);
      if (focusMode === 'edit' && records[1]) {
        startEditRow(records[1]);
      } else {
        setInspector('-- Data simulasi dikembalikan ke awal (2 baris).', true, 'Data tabel di-reset.');
      }
      refreshTable();
    });

    refreshTable();
    wrap.appendChild(controlHost);
    wrap.appendChild(sqlInspector);
    wrap.appendChild(feedback);
    wrap.appendChild(tableHost);
    containerEl.appendChild(wrap);
  }

  function renderRfidTap(doc, containerEl, chapter, onInteract) {
    var cfg = chapter.simulatorConfig || {};
    var cards = Array.isArray(cfg.cards) && cfg.cards.length > 0
      ? cfg.cards
      : [
          { label: 'Kartu Super Admin', uid: '0012345678', role: 'super_admin', expectedOk: true },
          { label: 'Kartu Teller 1', uid: '0087654321', role: 'teller', expectedOk: true },
          { label: 'Kartu Tidak Terdaftar', uid: '9999999999', role: 'tidak terdaftar', expectedOk: false },
        ];

    var activeTimer = null;
    var disposed = false;
    containerEl._simCleanup = function () {
      disposed = true;
      if (activeTimer) {
        clearTimeout(activeTimer);
        activeTimer = null;
      }
    };

    var wrap = createEl(doc, 'div', 'sim-box sim-rfid-tap');
    var header = createEl(doc, 'div', 'sim-header');
    header.appendChild(createEl(doc, 'h4', 'sim-title', 'Simulasi Tap Kartu RFID'));
    wrap.appendChild(header);
    wrap.appendChild(createEl(doc, 'p', 'sim-desc', 'Klik kartu untuk simulasi reader mengisi input autofocus + Enter, atau ketik UID manual.'));

    var cardsGrid = createEl(doc, 'div', 'sim-rfid-cards');
    var form = createEl(doc, 'form', 'sim-rfid-form');
    var inputLabel = createEl(doc, 'label', 'sim-label', 'Simulasi <input type="text" name="rfid" autofocus required>:');
    var rfidInput = createEl(doc, 'input', 'sim-input sim-rfid-input');
    rfidInput.type = 'text';
    rfidInput.name = 'rfid';
    rfidInput.placeholder = 'Tempelkan kartu ke reader...';
    rfidInput.setAttribute('autofocus', 'autofocus');
    disableAutoKeyboard(rfidInput);
    var submitBtn = createEl(doc, 'button', 'sim-btn sim-btn-primary', 'Masuk (Enter)');
    submitBtn.type = 'submit';
    form.appendChild(inputLabel);
    var inputRow = createEl(doc, 'div', 'sim-rfid-input-row');
    inputRow.appendChild(rfidInput);
    inputRow.appendChild(submitBtn);
    form.appendChild(inputRow);

    var statusBanner = createEl(doc, 'div', 'sim-feedback', 'Menunggu tap kartu RFID...');
    var resultGrid = createEl(doc, 'div', 'sim-rfid-results');
    var sqlBox = createEl(doc, 'pre', 'sim-sql-inspector', '-- Query pencocokan SQL akan tampil di sini');
    var sessionBox = createEl(doc, 'pre', 'sim-session-inspector', '$_SESSION = null');
    var redirectBox = createEl(doc, 'div', 'sim-redirect-box', 'Tujuan Redirect: (belum ada)');
    resultGrid.appendChild(sqlBox);
    resultGrid.appendChild(sessionBox);
    resultGrid.appendChild(redirectBox);

    function executeTap(uid) {
      if (disposed) {
        return;
      }
      var res = simulateRfidTap(uid);
      statusBanner.className = res.ok ? 'sim-feedback sim-feedback-ok' : 'sim-feedback sim-feedback-err';
      statusBanner.textContent = res.message;
      sqlBox.textContent = res.sqlExecuted || '-- Tidak ada query dijalankan';
      sessionBox.textContent = res.session
        ? '$_SESSION = ' + JSON.stringify(res.session, null, 2)
        : '$_SESSION = null (akses ditolak)';
      redirectBox.textContent = res.redirect
        ? 'header("Location: ' + res.redirect + '"); -> Masuk ke Beranda sebagai ' + res.session.nama + ' (' + res.session.nama_role + ')'
        : 'Tetap di login.php (tampilkan pesan: Kartu RFID tidak terdaftar!)';
      notifyInteract(onInteract, chapter, { uid: uid, ok: res.ok, redirect: res.redirect });
    }

    function simulateHidTyping(uid) {
      if (disposed) {
        return;
      }
      if (activeTimer) {
        clearTimeout(activeTimer);
        activeTimer = null;
      }
      rfidInput.value = '';
      if (typeof rfidInput.focus === 'function') {
        rfidInput.focus();
      }
      var chars = String(uid).split('');
      var idx = 0;
      function stepChar() {
        if (disposed) {
          activeTimer = null;
          return;
        }
        if (idx < chars.length) {
          rfidInput.value += chars[idx];
          idx += 1;
          activeTimer = setTimeout(stepChar, 18);
        } else {
          activeTimer = null;
          executeTap(rfidInput.value);
        }
      }
      stepChar();
    }

    cards.forEach(function (card) {
      var cardBtn = createEl(
        doc,
        'button',
        card.expectedOk ? 'sim-rfid-card is-valid' : 'sim-rfid-card is-invalid'
      );
      cardBtn.type = 'button';
      cardBtn.setAttribute('data-uid', card.uid);
      cardBtn.appendChild(createEl(doc, 'div', 'sim-card-title', card.label));
      cardBtn.appendChild(createEl(doc, 'div', 'sim-card-uid', 'UID: ' + card.uid));
      cardBtn.appendChild(createEl(doc, 'div', 'sim-card-role', 'Role: ' + card.role));
      cardBtn.appendChild(createEl(doc, 'span', 'sim-card-cta', 'Tap Kartu'));
      cardBtn.addEventListener('click', function () {
        simulateHidTyping(card.uid);
      });
      cardsGrid.appendChild(cardBtn);
    });

    form.addEventListener('submit', function (evt) {
      if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
      }
      if (disposed) {
        return;
      }
      if (activeTimer) {
        clearTimeout(activeTimer);
        activeTimer = null;
      }
      executeTap(rfidInput.value);
    });

    wrap.appendChild(cardsGrid);
    wrap.appendChild(form);
    wrap.appendChild(statusBanner);
    wrap.appendChild(resultGrid);
    containerEl.appendChild(wrap);
  }

  function renderSimulator(containerEl, chapter, onInteract) {
    if (containerEl && typeof containerEl._simCleanup === 'function') {
      containerEl._simCleanup();
      containerEl._simCleanup = null;
    }

    if (!containerEl || !chapter) {
      return;
    }

    var doc = containerEl.ownerDocument || (typeof document !== 'undefined' ? document : null);
    if (!doc) {
      return;
    }

    containerEl.innerHTML = '';
    var simType = chapter.simulatorType;

    if (simType === 'setup-checklist') {
      renderSetupChecklist(doc, containerEl, chapter, onInteract);
    } else if (simType === 'mysql-cli') {
      renderMysqlCli(doc, containerEl, chapter, onInteract);
    } else if (simType === 'phpmyadmin-designer') {
      renderPhpmyadminDesigner(doc, containerEl, chapter, onInteract);
    } else if (simType === 'crud-flow') {
      renderCrudFlow(doc, containerEl, chapter, onInteract);
    } else if (simType === 'rfid-tap') {
      renderRfidTap(doc, containerEl, chapter, onInteract);
    } else {
      containerEl.appendChild(createEl(doc, 'p', 'sim-desc', 'Simulator tidak tersedia untuk tipe: ' + String(simType)));
    }
  }

  var Simulators = {
    escapeHtml: escapeHtml,
    normalizeAnswer: normalizeAnswer,
    gradeFillBlank: gradeFillBlank,
    createInitialCliState: createInitialCliState,
    evaluateMysqlCliCommand: evaluateMysqlCliCommand,
    advanceDesignerStep: advanceDesignerStep,
    simulateCrudAction: simulateCrudAction,
    simulateRfidTap: simulateRfidTap,
    renderSimulator: renderSimulator,
  };

  if (typeof global !== 'undefined') {
    global.ModulCRUD = global.ModulCRUD || {};
    global.ModulCRUD.Simulators = Simulators;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Simulators;
  }
})(typeof window !== 'undefined' ? window : globalThis);

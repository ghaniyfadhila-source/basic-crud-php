<?php
session_start();
if (!isset($_SESSION['id_user'])) {
    header("Location: login.php");
    exit;
}
include 'koneksi.php';

$pesan = '';
if (isset($_POST['simpan'])) {
    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));
    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));
    $id_role = (int) $_POST['id_role'];
    $simpan = mysqli_query($koneksi, "INSERT INTO tb_user (rfid, nama, id_role) VALUES ('$rfid', '$nama', '$id_role')");
    if ($simpan) {
        header("Location: tampil.php");
        exit;
    } else {
        $pesan = "Gagal menyimpan: " . mysqli_error($koneksi);
    }
}
$roles = mysqli_query($koneksi, "SELECT * FROM tb_role");
?>
<!DOCTYPE html>
<html>
<head><title>Tambah Pengguna</title></head>
<body>
    <h2>Tambah Pengguna RFID</h2>
    <?php if ($pesan != '') echo "<p>" . htmlspecialchars($pesan) . "</p>"; ?>
    <form method="POST">
        <label>Kode RFID:</label><br>
        <input type="text" name="rfid" required><br><br>
        <label>Nama:</label><br>
        <input type="text" name="nama" required><br><br>
        <label>Role:</label><br>
        <select name="id_role" required>
            <?php while ($r = mysqli_fetch_assoc($roles)) { ?>
            <option value="<?= $r['id_role'] ?>"><?= htmlspecialchars($r['nama_role']) ?></option>
            <?php } ?>
        </select><br><br>
        <button type="submit" name="simpan">Simpan</button>
        <a href="tampil.php">Batal</a>
    </form>
</body>
</html>

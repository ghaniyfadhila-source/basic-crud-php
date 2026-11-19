<?php
session_start();
if (!isset($_SESSION['id_user'])) { header("Location: login.php"); exit; }
include 'koneksi.php';

if (empty($_GET['id'])) { header("Location: tampil.php"); exit; }
$id = (int) $_GET['id'];
if (isset($_POST['simpan'])) {
    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));
    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));
    $id_role = (int) $_POST['id_role'];
    mysqli_query($koneksi, "UPDATE tb_user SET rfid='$rfid', nama='$nama', id_role='$id_role' WHERE id_user='$id'");
    header("Location: tampil.php");
    exit;
}
$data = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT * FROM tb_user WHERE id_user='$id'"));
if (!$data) { header("Location: tampil.php"); exit; }
$roles = mysqli_query($koneksi, "SELECT * FROM tb_role");
?>
<!DOCTYPE html>
<html>
<head><title>Edit Pengguna</title></head>
<body>
    <h2>Edit Pengguna RFID</h2>
    <form method="POST">
        <label>Kode RFID:</label><br>
        <input type="text" name="rfid" value="<?= htmlspecialchars($data['rfid']) ?>" required><br><br>
        <label>Nama:</label><br>
        <input type="text" name="nama" value="<?= htmlspecialchars($data['nama']) ?>" required><br><br>
        <label>Role:</label><br>
        <select name="id_role" required>
            <?php while ($r = mysqli_fetch_assoc($roles)) { ?>
            <option value="<?= $r['id_role'] ?>" <?= $r['id_role'] == $data['id_role'] ? 'selected' : '' ?>><?= htmlspecialchars($r['nama_role']) ?></option>
            <?php } ?>
        </select><br><br>
        <button type="submit" name="simpan">Simpan</button>
        <a href="tampil.php">Batal</a>
    </form>
</body>
</html>

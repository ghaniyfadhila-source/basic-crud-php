<?php
session_start();
if (!isset($_SESSION['id_user'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head><title>Beranda</title></head>
<body>
    <h2>Beranda Aplikasi Cashless RFID</h2>
    <p>Selamat datang, <b><?= htmlspecialchars($_SESSION['nama']) ?></b> (<?= htmlspecialchars($_SESSION['nama_role']) ?>)</p>
    <ul>
        <li><a href="tampil.php">Lihat Data Pengguna</a></li>
        <li><a href="tambah.php">Tambah Pengguna</a></li>
        <li><a href="logout.php">Logout</a></li>
    </ul>
</body>
</html>

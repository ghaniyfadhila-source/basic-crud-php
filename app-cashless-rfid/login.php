<?php
session_start();
include 'koneksi.php';

$pesan = '';
if (isset($_POST['rfid'])) {
    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));
    $query = mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role WHERE rfid = '$rfid'");
    if ($query && mysqli_num_rows($query) > 0) {
        $data = mysqli_fetch_assoc($query);
        $_SESSION['id_user'] = $data['id_user'];
        $_SESSION['nama'] = $data['nama'];
        $_SESSION['nama_role'] = $data['nama_role'];
        header("Location: beranda.php");
        exit;
    } else {
        $pesan = "Kartu RFID tidak terdaftar!";
    }
}
?>
<!DOCTYPE html>
<html>
<head><title>Login RFID</title></head>
<body>
    <h2>Login Tap Kartu RFID</h2>
    <?php if ($pesan != '') echo "<p>$pesan</p>"; ?>
    <form method="POST">
        <label>Tap Kartu RFID:</label><br>
        <input type="text" name="rfid" autofocus required><br><br>
        <button type="submit" name="masuk">Masuk</button>
    </form>
</body>
</html>

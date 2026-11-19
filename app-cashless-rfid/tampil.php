<?php
session_start();
if (!isset($_SESSION['id_user'])) {
    header("Location: login.php");
    exit;
}
include 'koneksi.php';

$query = mysqli_query($koneksi, "SELECT tb_user.*, tb_role.nama_role FROM tb_user JOIN tb_role ON tb_user.id_role = tb_role.id_role ORDER BY tb_user.id_user ASC");
?>
<!DOCTYPE html>
<html>
<head><title>Data Pengguna</title></head>
<body>
    <h2>Data Pengguna RFID</h2>
    <p><a href="tambah.php">+ Tambah Data</a> | <a href="beranda.php">Kembali ke Beranda</a></p>
    <table border="1" cellpadding="6" cellspacing="0">
        <tr>
            <th>No</th>
            <th>Kode RFID</th>
            <th>Nama</th>
            <th>Role</th>
            <th>Aksi</th>
        </tr>
        <?php $no = 1; while ($row = mysqli_fetch_assoc($query)) { ?>
        <tr>
            <td><?= $no++ ?></td>
            <td><?= htmlspecialchars($row['rfid']) ?></td>
            <td><?= htmlspecialchars($row['nama']) ?></td>
            <td><?= htmlspecialchars($row['nama_role']) ?></td>
            <td>
                <a href="edit.php?id=<?= $row['id_user'] ?>">Edit</a> |
                <a href="hapus.php?id=<?= $row['id_user'] ?>" onclick="return confirm('Yakin hapus?')">Hapus</a>
            </td>
        </tr>
        <?php } ?>
    </table>
</body>
</html>

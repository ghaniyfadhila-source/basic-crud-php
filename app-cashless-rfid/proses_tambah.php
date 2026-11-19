<?php
session_start();
if (!isset($_SESSION['id_user'])) {
    header("Location: login.php");
    exit;
}
include 'koneksi.php';

if (isset($_POST['simpan'])) {
    $rfid = mysqli_real_escape_string($koneksi, trim($_POST['rfid']));
    $nama = mysqli_real_escape_string($koneksi, trim($_POST['nama']));
    $id_role = (int) $_POST['id_role'];
    mysqli_query($koneksi, "INSERT INTO tb_user (rfid, nama, id_role) VALUES ('$rfid', '$nama', '$id_role')");
}

header("Location: tampil.php");
exit;

<?php
session_start();
if (!isset($_SESSION['id_user'])) {
    header("Location: login.php");
    exit;
}
include 'koneksi.php';

if (!empty($_GET['id'])) {
    $id = (int) $_GET['id'];
    mysqli_query($koneksi, "DELETE FROM tb_user WHERE id_user='$id'");
}

header("Location: tampil.php");
exit;

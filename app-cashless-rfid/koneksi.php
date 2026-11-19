<?php
$koneksi = mysqli_connect("localhost", "root", "", "db_loginCashles");

if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

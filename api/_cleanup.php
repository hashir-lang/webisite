<?php
require __DIR__ . '/_db.php';
$db = ue_db();
$db->exec("DELETE FROM websiteleads WHERE source='setup-test'");
echo 'remaining: ' . $db->query('SELECT COUNT(*) FROM websiteleads')->fetchColumn();

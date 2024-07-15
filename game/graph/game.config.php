<?php
include_once(dirname(__FILE__) . '/../../common.php');

$game_table = "graph";

$result_table = "game_{$game_table}_result";
$betting_table = "game_{$game_table}_betting";
$wallet_table = "game_wallet";
$game_config = sql_fetch("select * from `game_config` where `game_table` = '{$game_table}'");
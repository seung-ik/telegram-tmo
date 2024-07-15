<?php
include_once('../../common.php');
include_once('./game.config.php');

$nextGame = sql_fetch("select * from `{$result_table}` order by `game_id` desc limit 0,1");
$prevGame = sql_fetch("select * from `{$result_table}` order by `game_id` desc limit 1,1");


$remainTime = strtotime($nextGame['game_datetime']) - G5_SERVER_TIME + ($game_config['game_interval'] * 60);
$nowTime = G5_SERVER_TIME;

echo json_encode(array("prevGame"=>$prevGame, "nextGame"=>$nextGame, "remainTime" => $remainTime, "nowTime" => $nowTime));
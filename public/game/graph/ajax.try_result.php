<?php
include_once('../../common.php');
include_once('./game.config.php');
/*
if($_GET['test'] === '1') {
    $game = sql_fetch("select * from `{$result_table}` where `game_status` = '완료' order by `game_id` desc limit 1");
    echo json_encode(array("result"=>$game));
    exit;
}
*/
$expectTime = G5_SERVER_TIME - ($game_config['game_interval'] * 60);
$expectTime1 = date("Y-m-d H:i:s", $expectTime - 15);
$expectTime2 = date("Y-m-d H:i:s", $expectTime + 15);

$game = sql_fetch("select * from `{$result_table}` where `game_datetime` between '{$expectTime1}' and '{$expectTime2}'");

if(!$game){
    $result = 'stopped';
}
else if($game['game_status'] == '대기'){
    $result = 'try-again';
}
else if($game['game_status'] == '완료'){
    $result = $game;
}
else{
    $result = 'reload';
}

echo json_encode(array("result"=>$result));
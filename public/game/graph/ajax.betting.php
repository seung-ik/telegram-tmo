<?php
include_once('../../common.php');
include_once('./game.config.php');

$betting_type  = $_POST['betting_type'];
$betting_side  = $_POST['betting_side'];
$betting_point = $_POST['betting_point'];

$json_arr = array("alert" => "");

$lastGame = sql_fetch("select * from `{$result_table}` where `game_status` = '대기'");
$bettedCheck = sql_fetch("select count(*) as `cnt` from `{$betting_table}` where `game_id` = '{$lastGame['game_id']}' and `mb_id` = '{$member['mb_id']}'");
if($is_guest) {
    $json_arr['alert'] = '로그인이 필요합니다.';
}
else if(!($betting_point >= $game_config['betting_point_min']) && $betting_index != 1) {
    $json_arr['alert'] = '참여포인트를 '. number_format($game_config['betting_point_min']) .'포인트 이상 입력해주세요.';
}
else if($betting_point > $member['mb_point']) {
    $json_arr['alert'] = '보유포인트보다 많이 참여할 수 없습니다.';
}
else if($bettedCheck['cnt'] > 0) {
    $json_arr['alert'] = '이번 회차에 이미 참여했습니다.';
}
else if(!$lastGame){
    $json_arr['alert'] = '지금 참여할 수 없습니다. 잠시 후 다시 시도해주세요.';
}
else if(strtotime($lastGame['game_datetime']) + ($game_config['game_interval'] * 60) - $game_config['limit_betting_time'] < G5_SERVER_TIME) {
    $json_arr['alert'] = "추첨 시작 {$game_config['limit_betting_time']}초전에는 참여할 수 없습니다.";
}
else if(!in_array($betting_type, array('떡상떡락'))) {
    $json_arr['alert'] = '잘못된 접근!';
}
else if(!in_array($betting_side, array('떡상','떡락'))) {
    $json_arr['alert'] = '잘못된 접근!';
}
else {
    sql_query("insert `{$betting_table}` set `mb_id` = '{$member['mb_id']}', `game_id` = '{$lastGame['game_id']}', `betting_type` = '{$betting_type}', `betting_side` = '{$betting_side}', `betting_point` = '{$betting_point}', `betting_result` = '대기중'");
    insert_point($member['mb_id'], $betting_point * (-1), "{$game_config['game_title']} 게임 {$lastGame['game_no']}회차 참여 ({$betting_side})", $betting_table, sql_insert_id(), "BETTING");
    $json_arr['point_now'] = $member['mb_point'] - $betting_point;
    $json_arr['alert'] = '참여 완료';
}

echo json_encode($json_arr);
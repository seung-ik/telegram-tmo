<?php
include_once('./game.lib.php');

$game_id = (string)$_REQUEST['game_id'];
$rel_action = (string)$_REQUEST['action_id'];
$reward = (int)$_REQUEST['score'];
$mb_id = (string)$member['mb_id'];
// $mb_id = 'admin';
if (empty($game_id)) {
    echo make_json_result(false, '잘못된 게임 정보입니다.');
    exit;
}
echo get_rewards($game_id, $mb_id, $rel_action, $reward);
<?php
include_once('./game.lib.php');

$game_id = (string)$_REQUEST['game_id'];
$mb_id = (string)$member['mb_id'];
if (empty($game_id)) {
    echo make_json_result(false, '잘못된 게임 정보입니다.');
    exit;
}
echo play_game($game_id, $mb_id);
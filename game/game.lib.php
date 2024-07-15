<?php
include_once('../common.php');

define('tap_cost', $config['tap_game_cash']);
define('plus_cost', $config['plus_game_cash']);
define('jump_cost', $config['jump_game_cash']);

define('tap_round', $config['tap_game_round']);
define('plus_round', $config['plus_game_round']);
define('jump_round', $config['jump_game_round']);

define('tap_cost_max', $config['tap_game_cash_max']);
define('plus_cost_max', $config['plus_game_cash_max']);
define('jump_cost_max', $config['jump_game_cash_max']);

define('tap_reward', $config['tap_game_reward']);
define('plus_reward', $config['plus_game_reward']);
define('jump_reward', $config['jump_game_reward']);

define('tap_type', $config['tap_game_get_type']);
define('plus_type', $config['plus_game_get_type']);
define('jump_type', $config['jump_game_get_type']);


define('_INDEX_', true);
if (!defined('_GNUBOARD_')) exit; // 개별 페이지 접근 불가

// header("Access-Control-Allow-Origin: *");

function get_games() {
    return [
        'retrospeed' => [
            'game_name' => 'retrospeed',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'saws' => [
            'game_name' => 'saws',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'saverocket' => [
            'game_name' => 'saverocket',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'circleflip' => [
            'game_name' => 'circleflip',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'colortower' => [
            'game_name' => 'colortower',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'switchdash' => [
            'game_name' => 'switchdash',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'plus' => [
            'game_name' => 'plus',
            'type' => plus_type,
            'cost' => plus_cost,
            'reward' => plus_reward,
            'max_reward' => plus_cost_max,
            'round' => plus_round,
        ],
        'jump_box_hero' => [
            'game_name' => 'jump',
            'type' => jump_type,
            'cost' => jump_cost,
            'reward' => jump_reward,
            'max_reward' => jump_cost_max,
            'round' => jump_round,
        ],
        'tapten' => [
            'game_name' => 'tapten',
            'type' => tap_type,
            'cost' => tap_cost,
            'reward' => tap_reward,
            'max_reward' => tap_cost_max,
            'round' => tap_round,
        ]
    ];
}
function make_json_result($success = true, $msg = '', $data = null) {
    $result = array('success' => $success, 'message' => $msg);
    if ($data != null) {
        $result['data'] = $data;
    }
    return json_encode($result);
}
function play_game($game_id, $mb_id) {
    $nowdate = date('Y-m-d H:i:s');
    if ($mb_id == '') {
        return make_json_result(false, 'Please login first');
    }
    $games = get_games();
    if (!in_array($game_id, array_keys($games))) {
        return make_json_result(false, '잘못된 게임 정보입니다.');
    }
    $cost = $games[$game_id]['cost'] * (-1);
    $mb_point = get_point_sum($mb_id);
    if ($mb_point < abs($cost)) {
        return make_json_result(false, '포인트가 부족합니다.', [$mb_id, $mb_point]);
    }
    $content = '게임 플레이 - '.$games[$game_id]['game_name'];
    $rel_table = '@games-'.$game_id;
    $rel_id = $mb_id;
    $rel_action = uniqid('play-');
    insert_cash($mb_id, $cost, $content, $rel_table, $rel_id, $rel_action);

    //로그기록
    $sql = " insert into minigame_log
            (mb_id, game, start_date, status)
            values('{$mb_id}', '{$game_id}', '{$nowdate}', 'start') ";
    sql_query($sql);

    return make_json_result(true, '', [
        'action_id' => $rel_action
    ]);
}
function get_rewards($game_id, $mb_id, $rel_action, $reward) {
    $nowdate = date('Y-m-d H:i:s');
    if ($mb_id == '') {
        return make_json_result(false, 'Please login first');
    }
    $games = get_games();

    global $g5;

    if (!in_array($game_id, array_keys($games))) {
        return make_json_result(false, '잘못된 게임 정보입니다1.');
    }
    /*if ($reward > $games[$game_id]['max_reward']) {
        $reward = $games[$game_id]['max_reward'];
    } else if ($reward <= 0) {
        return make_json_result(false, '잘못된 접근입니다2.');
    }*/

    //플레이타임 캐시 지급
    //라운드 체크 후 캐시 반환
    if($reward < $games[$game_id]['round']){

        if($games[$game_id]['cost'] == 0){

            //로그기록
            $sql_log = " select idx,start_date from minigame_log
            where mb_id = '$mb_id' order by idx DESC limit 1 ";
            $row_log = sql_fetch($sql_log);

            $log_id = $row_log['idx'];
            $start_date = $row_log['start_date'];
            $play_time = strtotime($nowdate) - strtotime($start_date);

            $sql_endlog = " update minigame_log
            set end_date = '{$nowdate}',
                play_time = '{$play_time}',
                use_cash = '0',
                round = '{$reward}',
                reward = '0',
                status = 'endgame'
            where idx = '$log_id' ";
            sql_query($sql_endlog);
        }else{
            $content = '지정라운드 진입 실패 - '.$games[$game_id]['game_name'];
            $rel_table = '@games-'.$game_id;
            $rel_id = $mb_id;
            $cost = $games[$game_id]['cost'];

            insert_cash($mb_id, $cost, $content, $rel_table, $rel_id, $rel_action);

            //로그기록
            $sql_log = " select idx,start_date from minigame_log
            where mb_id = '$mb_id' order by idx DESC limit 1 ";
            $row_log = sql_fetch($sql_log);

            $log_id = $row_log['idx'];
            $start_date = $row_log['start_date'];
            $play_time = strtotime($nowdate) - strtotime($start_date);

            $sql_endlog = " update minigame_log
            set end_date = '{$nowdate}',
                play_time = '{$play_time}',
                use_cash = '0',
                round = '{$reward}',
                reward = '0',
                status = 'endgame'
            where idx = '$log_id' ";
            sql_query($sql_endlog);
        }

    }else{

        //지급받은적이 있는지 체크
        $sql_re_chk = " select count(*) as cnt from minigame_log
                        where game='{$games[$game_id]['game_name']}' and mb_id = '$mb_id' and reward_chk = '1' ";
        $row_re_chk = sql_fetch($sql_re_chk);
        if($row_re_chk['cnt'] > 0){
            //로그기록
            $sql_log = " select idx,start_date from minigame_log
                where mb_id = '$mb_id' order by idx DESC limit 1 ";
            $row_log = sql_fetch($sql_log);

            $log_id = $row_log['idx'];
            $start_date = $row_log['start_date'];
            $play_time = strtotime($nowdate) - strtotime($start_date);

            $sql_endlog = " update minigame_log
                set end_date = '{$nowdate}',
                    play_time = '{$play_time}',
                    use_cash = '{$games[$game_id]['cost']}',
                    round = '{$reward}',
                    reward = '0',
                    status = 'endgame'
                where idx = '$log_id' ";
            sql_query($sql_endlog);

            return make_json_result(true);
        }else{

            $content = '게임 보상 - '.$games[$game_id]['game_name'];
            $rel_table = '@games-'.$game_id;
            $rel_id = $mb_id;

            if($games[$game_id]['cost'] == 0){

                $rel_action = str_replace('play-', 'reward-', $rel_action);
                if($games[$game_id]['type'] == 0){
                    insert_point($mb_id, $games[$game_id]['reward'], $content, $rel_table, $rel_id, $rel_action);
                }else{
                    insert_cash($mb_id, $games[$game_id]['reward'], $content, $rel_table, $rel_id, $rel_action);
                }

                //로그기록
                $sql_log = " select idx,start_date from minigame_log
                where mb_id = '$mb_id' order by idx DESC limit 1 ";
                $row_log = sql_fetch($sql_log);

                $log_id = $row_log['idx'];
                $start_date = $row_log['start_date'];
                $play_time = strtotime($nowdate) - strtotime($start_date);

                $sql_endlog = " update minigame_log
                set end_date = '{$nowdate}',
                    play_time = '{$play_time}',
                    use_cash = '{$games[$game_id]['cost']}',
                    round = '{$reward}',
                    reward = '{$games[$game_id]['reward']}',
                    status = 'endgame',
                    reward_chk = 1
                where idx = '$log_id' ";
                sql_query($sql_endlog);

                return make_json_result(true);

            }else{
                $sql = " select count(*) as cnt from community.{$g5['cash_table']}
                    where mb_id = '$mb_id'
                    and po_rel_table = '$rel_table'
                    and po_rel_id = '$rel_id'
                    and po_rel_action = '".addslashes($rel_action)."' ";
                $row = sql_fetch($sql);

                if ($row['cnt']) {
                    $rel_action = str_replace('play-', 'reward-', $rel_action);
                    if($games[$game_id]['type'] == 0){
                        insert_point($mb_id, $games[$game_id]['reward'], $content, $rel_table, $rel_id, $rel_action);
                    }else{
                        insert_cash($mb_id, $games[$game_id]['reward'], $content, $rel_table, $rel_id, $rel_action);
                    }

                    //로그기록
                    $sql_log = " select idx,start_date from minigame_log
                where mb_id = '$mb_id' order by idx DESC limit 1 ";
                    $row_log = sql_fetch($sql_log);

                    $log_id = $row_log['idx'];
                    $start_date = $row_log['start_date'];
                    $play_time = strtotime($nowdate) - strtotime($start_date);

                    $sql_endlog = " update minigame_log
                set end_date = '{$nowdate}',
                    play_time = '{$play_time}',
                    use_cash = '{$games[$game_id]['cost']}',
                    round = '{$reward}',
                    reward = '{$games[$game_id]['reward']}',
                    status = 'endgame'
                where idx = '$log_id' ";
                    sql_query($sql_endlog);

                    return make_json_result(true);
                } else {
                    return make_json_result(false, '잘못된 접근입니다3.');
                }
            }



        }


    }

}

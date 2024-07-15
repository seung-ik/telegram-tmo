<?php
include(dirname(__FILE__) . '/../../common.php');
$game_table = "graph";
include(dirname(__FILE__) . "/game.config.php");

$drawTime = 10;  // n초 이상 지나면 무효처리 한다. ex: 04:30:00에 결과를 처리해야되는데 04:30:10 이후 시행될경우 무효처리


$res = sql_query("select * from `{$wallet_table}`");

while($row = sql_fetch_array($res)) {

    if($row['wallet_name'] == "1번지갑"){
        $fromAddress = $row['address'];
        $privatekey = $row['privatekey'];
    }
    if($row['wallet_name'] == "2번지갑"){
        $toAddreess = $row['address'];
    }

}

//결과를 입력해줘야할게 있다면 결과입력해준다.
$resultInsertTime = date("Y-m-d H:i:s", time() - (60*$game_config['game_interval']));
$res = sql_query("select * from `{$result_table}` where `game_status` = '대기' and `game_datetime` <= '{$resultInsertTime}' order by `game_id` desc");

while($row = sql_fetch_array($res)) {


    if( strtotime($resultInsertTime) - strtotime($row['game_datetime']) > $drawTime ) {
        //무효처리
        sql_query("update `{$result_table}` set `game_status` = '무효' where `game_id` = '{$row['game_id']}'");

        //포인트 반환
        $betting_res = sql_query("select * from `{$betting_table}` where `game_id` = '{$row['game_id']}'");
        while($betting_row = sql_fetch_array($betting_res)) {

            // 코멘트 포인트 삭제
            if (!delete_point($betting_row['mb_id'], $betting_table, $betting_row['betting_id'], 'BETTING'))
                insert_point($betting_row['mb_id'], $betting_row['betting_point'], "{$game_config['game_title']} 게임 무효 : 참여 포인트 반환");
        }
    }
    else{

        /*
        -150px ~ +150px

        이전 회차랑 최소 차이가 40px
        -10px  10px은 없음
        */
        $game_height = array();
        if($config['cf_mobile_page_rows'] == 10) {
            array_push($game_height, rand(10, 150));
        }
        else if($config['cf_mobile_page_rows'] == 20) {
            array_push($game_height, rand(-150, -10));
        }
        while(count($game_height) < 10) {
            $new_height = rand(-150, 150);
            if($new_height >= 10 || $new_height <= -10) {
                if(count($game_height) == 0 || abs($game_height[count($game_height)-1] - $new_height) >= 40) {
                    array_push($game_height, $new_height);
                }
            }
        }
        array_push($game_height, 0);
        $game_height = array_reverse($game_height);
        $game_result = '대기';
        if($game_height[10] > 0) {
            $game_result = '떡상';
            $amount = '0.000000001';

        }
        else if($game_height[10] < 0) {
            $game_result = '떡락';
            $amount = '0.000000002';
        }
        $game_height = implode(',', $game_height);


/*
        $url = 'http://52.231.155.111:3000/signTx';

        $ch = curl_init($url);
        //테스트 종료 후 주소와 프라이빗키 세팅을 다시 해야함
        $jsonData = array(
            "fromAddress" => $fromAddress,
            "toAddress" => $toAddreess,
            "amount" => $amount,
            "minerFee" => "0.000000001",
            "privateKey" => $privatekey
        );   // JSON데이터 생성

        $jsonDataEncoded = json_encode($jsonData);

        curl_setopt($ch, CURLOPT_POST, 1);

        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonDataEncoded);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

        $json_result = curl_exec($ch);

        $result = json_decode($json_result, true);



        // post함수 호출4cc
        $txResult = $result['result']['txHash'];

*/
        $txResult = "";


        sql_query("update `g5_config` set `cf_mobile_page_rows` = 30 where 1");


        sql_query("update `{$result_table}` set `game_status` = '완료',

        `game_height` = '{$game_height}',
        `game_result` = '{$game_result}',
        `tx_result`   = '{$txResult}'

        where `game_id` = '{$row['game_id']}'");


        //승자 포인트 지급
        $betting_res = sql_query("select * from `{$betting_table}` where `game_id` = '{$row['game_id']}' and `betting_type` = '떡상떡락' and `betting_side` = '{$game_result}' and `betting_result` = '대기중'");
        while($betting_row = sql_fetch_array($betting_res)) {
            $betting_winpoint = round($game_config['betting_win_rate'] * $betting_row['betting_point']);

            sql_query("update  `{$betting_table}` set `betting_winpoint` = '{$betting_winpoint}' where `betting_id` = '{$betting_row['betting_id']}'");
            only_point($betting_row['mb_id'], $betting_winpoint, "{$game_config['game_title']} 게임 승리 : ". substr($row['game_datetime'],0,10) ." {$row['game_no']}회차", $betting_table, $betting_row['betting_id'], "WIN");
        }

        sql_query("update `{$betting_table}` set `betting_result` = '적중'   where `game_id` = '{$row['game_id']}' and `betting_result` = '대기중' and `betting_type` = '떡상떡락' and `betting_side`  = '{$game_result}'");
        sql_query("update `{$betting_table}` set `betting_result` = '미적중' where `game_id` = '{$row['game_id']}' and `betting_result` = '대기중' and `betting_type` = '떡상떡락' and `betting_side` != '{$game_result}'");
    }
}


//대기게임이 없다면 추가해준다.
$check = sql_fetch("select count(*) as `cnt` from `{$result_table}` where `game_status` = '대기'");
if($check['cnt'] == 0) {

    $game_datetime = getNextGameDatetime($game_config['game_interval']);
    $game_no = getNoFromDatetime($game_datetime, $game_config['game_interval']);
    $game_status ='대기';
    sql_query("insert `{$result_table}` set `game_datetime` = '{$game_datetime}', `game_no` = '{$game_no}', `game_status` = '{$game_status}'");
}


// POST 방식 함수

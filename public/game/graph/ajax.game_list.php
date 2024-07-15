<?php
include_once('../../common.php');
include_once('./game.config.php');

ob_start();
$res = sql_query("select * from `{$result_table}` where `game_status` = '완료' order by `game_id` desc limit 29");
while($row = sql_fetch_array($res)) {
    $row['img_filename'] = '';
    if($row['game_result'] == '떡상') {
        $row['img_filename'] = 'up.png';
    }
    else if($row['game_result'] == '떡락') {
        $row['img_filename'] = 'down.png';
    }
?>
        <li>
            <h1><?=$row['game_no']?>회차</h1>
            <h2><img src="./img/<?=$row['img_filename']?>" /></h2>
            <!--<h2><a href="https://explorer.hycon.io/tx/<?=$row['tx_result']?>" target="_blank"><img src="./img/<?=$row['img_filename']?>" /></a></h2>-->
        </li>
<?php
}

$html = ob_get_contents();
ob_end_clean();

echo json_encode(array("html"=>$html));
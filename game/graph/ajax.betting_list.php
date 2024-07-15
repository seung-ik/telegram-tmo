<?php
include_once('../../common.php');
include_once('./game.config.php');

$list_rows = 5;
$page = $_POST['page'];
$limit_total = $page * $list_rows;

$limit_total = 30;

ob_start();
if($is_member) {
    $res = sql_query("select * from `{$betting_table}` where `mb_id` = '{$member['mb_id']}' order by `betting_id` desc limit {$limit_total}");
    $betting_list_cnt = sql_fetch_solo("select count(*) from `{$betting_table}` where `mb_id` = '{$member['mb_id']}'");
    $no = 0;
    while($row = sql_fetch_array($res)) {
        ++$no;
        $game = sql_fetch("select * from `{$result_table}` where `game_id` = '{$row['game_id']}'");
        $row['betting_side_class'] = '';
        if($row['betting_side'] == '떡상') {
            $row['betting_side_class'] = 'up';
        }
        else if($row['betting_side'] == '떡락') {
            $row['betting_side_class'] = 'down';
        }
?>

		<ul>
			<li class="num"><?=$game['game_no']?>회차</li>
			<li class="time"><?=$row['betting_datetime']?></li>
			<li class="result <?=$row['betting_side_class']?>"><?=$row['betting_side']?></li>
			<li class="buy"><?=number_format($row['betting_point'])?>P</li>
			<li class="gain"><?=number_format($row['betting_winpoint'])?>P</li>
			<li class="<?=$row['betting_result'] == '적중' ? 'hit' : 'miss'?>"><?=$row['betting_result']?></li>
		</ul>
<?php
    }
    if($betting_list_cnt > $no){
    ?>
    <h1><img src="./img/img_more_btn.png" onclick="show_more_betting_list();" /></h1>
    <?php
    }

    if($no == 0) {
        ?>
<div style="text-align:center; color:#fff; font-size:1.1em; margin-top:55px;">참여내역이 없습니다.</div>
        <?php
    }
}
else {
?>
<div style="text-align:center; color:#fff; font-size:1.1em; margin-top:55px;">로그인이 필요합니다.</div>
<?php
}

$html = ob_get_contents();
ob_end_clean();

echo json_encode(array("html"=>$html));
<?php
include_once("../../common.php");
include_once("./game.config.php");
$game['last'] = sql_fetch("select * from  `{$result_table}` order by `game_id` desc limit 1, 1");
$game['now']  = sql_fetch("select * from  `{$result_table}` order by `game_id` desc limit 0, 1");

$time = time();

?>
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no"/>

    <title>Coin Graph</title>
    <link rel='stylesheet' type='text/css' href='./style.css?t=<?=$time?>'>
    <link rel='stylesheet' type='text/css' href='./header.css?t=<?=$time?>'>
    <script src="/js/jquery-1.8.3.min.js"></script>
    <script src="/js/common.js"></script>
    <script>
        $(function(){
            $('#header .b-menu').on('click', function(e){
                $('.menu-wrap').addClass('active');
                $('html, body').css('overflow-y','hidden');
                $('html, body').on('touchmove scroll mousewheel DOMMouseScroll',function(e){
                    e.preventDefault();
                }, false);
                e.preventDefault();
            });
            $('.menu-wrap .b-close').on('click', function(e){
                $('.menu-wrap').removeClass('active');
                $('html, body').css('overflow','');
                $('html, body').off('touchmove scroll mousewheel DOMMouseScroll');
                e.preventDefault();
            });
        });

    </script>

    <style>
        #bg_middle { animation-name: bg_middle; animation-duration: 10s; animation-timing-function: ease-out; animation-fill-mode: forwards;}
        @keyframes bg_middle {
            10%  {width:612px}
            20%  {width:544px}
            30%  {width:476px}
            40%  {width:408px}
            50%  {width:340px}
            60%  {width:272px}
            70%  {width:204px}
            80%  {width:136px}
            90%  {width:68px}
            100% {width:0px}
        }
    </style>
    <style id="keyframe_style2">
    </style>

    <style id="keyframe_style1">
    </style>


</head>
<body>

<style>
    #header{position:fixed;left:0;top:0;width:100%;z-index:10;background:#22222f;}
    #header .top-sec{padding:50px 0;position:relative;}
    #header .top-sec h1{width:220px;margin:0 auto;}
    #header .top-sec .b-menu{position:absolute;left:30px;top:65px;display:block;width:50px;}
    #header .top-sec .b-tip{position:absolute;right:35px;top:60px;display:block;width:100px;color:#ffffff;font-size:20pt;font-weight:bold;}

    #footer{width:840px;background: #191922;padding:22px 0;text-align:center;}
    #footer h2 a{font-size:12px;color:#fff;opacity:.5;}
    #footer address{margin-top:9px;font-size:10px;font-weight:300;color:#fff;opacity:.5;line-height:1.6;}
    #footer .copy{margin-top:15px;font-size:10px;font-weight:300;color:#fff;opacity:.5;}

    .menu-wrap{position:fixed;left:0;top:100%;width:100%;height:100%;overflow-y:auto;z-index:11;background:#22222f;transition:top .3s;-webkit-overflow-scrolling:touch;}
    .menu-wrap.active{top:0;}
    .menu-wrap .b-close{display:block;width:13px;position:absolute;left:18px;top:26px;}
    .menu-wrap .menu-sec.sec1{padding:60px 15px 10px;position:relative;}
    .menu-wrap .menu-sec .user-info{}
    .menu-wrap .menu-sec .user-info span{display:block;}
    .menu-wrap .menu-sec .user-info .level{font-size:13px;color:#fff;opacity:.5;}
    .menu-wrap .menu-sec .user-info .nick{margin-top:8px;font-size:16px;font-weight:bold;color:#fff;}
    .menu-wrap .menu-sec .email{margin-top:35px;display:block;font-size:13px;color:#fff;}
    .menu-wrap .menu-sec .b-setting{display:block;width:20px;position: absolute;right:25px;bottom:25px;}
    .menu-wrap .menu-sec.sec2{border-top:9px solid #393945;border-bottom:9px solid #393945;}
    .menu-wrap .menu-sec .inner{padding:0 30px;}
    .menu-wrap .menu-sec .poss{position:relative;padding:10px 0;}
    .menu-wrap .menu-sec .poss-point{border-top:1px solid #383f52;}
    .menu-wrap .menu-sec .poss .tit{font-size:12px;color:#fff;}
    .menu-wrap .menu-sec .poss .num{font-size:18px;font-weight:bold;margin-top:10px;display:block;}
    .menu-wrap .menu-sec .poss-cash .num{color:#ff274d;}
    .menu-wrap .menu-sec .poss-point .num{color:#47dfb9;}
    .menu-wrap .menu-sec .poss .btn{display:inline-block;font-size:12px;padding:4px 7px 3px;position:absolute;right:0;bottom:20px;}
    .menu-wrap .menu-sec .poss-cash .btn{color:#ff274d;border:1px solid #75243a;}
    .menu-wrap .menu-sec .poss-point .btn{color:#47dfb9;border:1px solid #47dfb9;}
    .menu-wrap .menu-sec.sec3{padding:10px 15px 12px;}
    .menu-wrap .menu-list>li{margin-top:40px;}
    .menu-wrap .menu-list>li:first-child{margin-top:0;}
    .menu-wrap .menu-list dt{font-size:13px;color:#fff;opacity:.5;}
    .menu-wrap .menu-list dd{margin-top:20px;}
    .menu-wrap .menu-list dd li{margin-top:20px;}
    .menu-wrap .menu-list dd li:first-child{margin-top:0;}
    .menu-wrap .menu-list dd li a{display:block;padding-left:36px;position:relative;font-size:15px;color:#e9ebee;}
    .menu-wrap .menu-list dd li a:before{content:'';display:block;width:25px;height:25px;background-repeat:no-repeat;background-position:0 0;background-size:auto 25px;position: absolute;left:0;top:-4px;}
    .menu-wrap .menu-list dd li.game a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico1.png)}
    .menu-wrap .menu-list dd li.part a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico2.png)}
    .menu-wrap .menu-list dd li.free a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico3.png)}
    .menu-wrap .menu-list dd li.attend a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico4.png)}
    .menu-wrap .menu-list dd li.store a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico5.png)}
    .menu-wrap .menu-list dd li.deal a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico6.png)}
    .menu-wrap .menu-list dd li.notice a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico7.png)}
    .menu-wrap .menu-list dd li.event a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico8.png)}
    .menu-wrap .menu-list dd li.faq a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico9.png)}
    .menu-wrap .menu-list dd li.inquiry a:before{background-image:url(<?=G5_MOBILE_URL?>/images/menu-ico10.png)}
    .menu-wrap .menu-list dd li.wallet a:before{background-image:url(<?=G5_MOBILE_URL?>/images/wallet.png)}
    .menu-wrap .menu-list dd li.recomm a:before{background-image:url(<?=G5_MOBILE_URL?>/images/recomm.png)}
    .menu-wrap .menu-list dd li.faq a:before{background-image:url(<?=G5_MOBILE_URL?>/images/faq.png)}
    .menu-wrap .menu-sec.sec4{padding:20px;border-top:9px solid #393945;}
    .menu-wrap .b-logout{font-size:15px;color:#fff;}
</style>

<div class="menu-wrap">
    <?php
    if($is_member){ ?>
        <div class="menu-sec sec1">
            <div class="user-info">
                <span class="level">LEVEL <?=$member['mb_level']?></span>
                <span class="nick"><?=$member['mb_nick']?></span>
            </div>
            <span class="email"><?=$member['mb_id']?></span>
            <a href="<?=G5_MOBILE_URL?>/mypage.php" class="b-setting"><img src="<?=G5_MOBILE_URL?>/images/ico-setting.png" alt=""></a>
        </div>
        <div class="menu-sec sec2">
            <div class="inner">
                <div class="poss poss-cash">
                    <p class="tit">보유 캐시</p>
                    <span class="num"><?=number_format($member['mb_cash'])?></span>
                    <!--<a href="#" class="btn">충전하기</a>-->
                </div>
                <div class="poss poss-point">
                    <p class="tit">보유 포블포인트</p>
                    <span class="num"><?=number_format($member['mb_point'])?></span>
                </div>
            </div>
        </div>
    <?php }else{
        $sec3_Style = "style='margin-top:100px'";
    } ?>

    <div class="menu-sec sec3" <?php echo $sec3_Style; ?>>
        <ul class="menu-list">
            <li>
                <dl>
                    <dt>게임센터</dt>
                    <dd>
                        <ul>
                            <li class="game"><a href="<?=G5_MOBILE_URL?>/game_center.php">게임</a></li>
                            <li class="part"><a href="<?=G5_MOBILE_URL?>/game_list.php">참여내역</a></li>
                        </ul>
                    </dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>커뮤니티</dt>
                    <dd>
                        <ul>
                            <li class="free"><a href="<?=G5_MOBILE_URL?>/list.php">공략게시판</a></li>
                            <li class="attend"><a href="<?=G5_MOBILE_URL?>/att.php">출석체크</a></li>
                        </ul>
                    </dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>상점</dt>
                    <dd>
                        <ul>
                            <li class="wallet"><a href="<?=G5_MOBILE_URL?>/mybank.php">내지갑</a></li>
                            <li class="recomm"><a href="<?=G5_MOBILE_URL?>/recommend.php">추천인</a></li>
                        </ul>
                    </dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>고객센터</dt>
                    <dd>
                        <ul>
                            <li class="notice"><a href="<?=G5_MOBILE_URL?>/notice_list.php">공지사항</a></li>
                            <li class="event"><a href="<?=G5_URL?>/event">이벤트</a></li>
                            <li class="inquiry"><a href="<?=G5_MOBILE_URL?>/cs_list.php">문의하기</a></li>
                            <li class="faq"><a href="<?=G5_MOBILE_URL?>/faq_list.php">FAQ</a></li>
                        </ul>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
    <?php
    if($is_member){ ?>
        <div class="menu-sec sec4">
            <a href="<?=G5_BBS_URL?>/logout.php" class="b-logout">로그아웃</a>
        </div>
    <?php } ?>

    <a href="#" class="b-close"><img src="<?=G5_MOBILE_URL?>/images/ico-close.png" alt=""></a>
</div><!-- //menu-wrap -->

<div id="header">
    <div class="top-sec">
        <h1><a href="<?=G5_MOBILE_URL?>"><img src="<?=G5_MOBILE_URL?>/images/logo.png" alt=""></a></h1>
        <a href="#" class="b-menu"><img src="<?=G5_MOBILE_URL?>/images/ico-menu.png" alt=""></a>
        <?php if($is_member){ ?>
            <a href="<?=G5_BBS_URL?>/logout.php" class="b-tip"><p class="point">로그아웃</p></a>
        <?php }else{ ?>
            <a href="<?=G5_MOBILE_URL?>/login.php" class="b-tip"><p class="point">로그인</p></a>
        <?php } ?>
    </div>
</div>


<div id="coin_graph" style="margin-top: 140px">
    <div class="title"><img src="./img/title.png" /></div>
    <div class="sound" onClick="sound_switch('toggle');"></div>

    <div class="game_area">
        <div class="graph" style="background-image:url('./img/bg_middle.png');">	<!-- 높이 369px 중앙 라인을 기준으로 위아래로 184px -->
            <div id="bg_middle" style="position:absolute;right:0px;top:0px;z-index:100;width:681px;height:369px;background-image:url('./img/bg_middle.png');background-position:right top; display:none;"></div>
            <svg viewBox="0 0 681 369" class='graph_svg'>

                <path id="path" stroke-width="1" d="" style="stroke: #FFFFFF; fill: none; "></path>
            </svg>
            <h1 id="gold_coin" style="display:none;"><div><var class="ef"></var></div></h1>
            <!--<div class="result" id="result_circle"></div>-->
        </div>
    </div>

    <div class="info">
        <h1><?=$game['now']['game_no']?>회차 추첨이 잠시 후 시작됩니다.</h1>
        <h2 id="remainTime"></h2>
    </div>

    <div class="last">
        <h1><?=$game['now']['game_no']?>회차 추첨 결과</h1>
        <h2><span class="result_popup"></span></h2>
    </div>

    <div class="history">
        <div>
            <ul id="real_history">
            </ul>
        </div>
    </div>
</div>

<div id="betting_cart">
    <h1>
        <span>보유포인트<strong id="my_point"><?=number_format($member['mb_point'])?> P</strong></span>
        <code>당첨시 <span id="win_expect_point">0 P</span> 획득<strong id="betting_point">0 P</strong></code>
    </h1>
    <ul id="betting_point_select_box">
        <li data-point="100" class="left">100</li>
        <li data-point="500">500</li>
        <li data-point="1000">1,000</li>
        <li data-point="5000">5,000</li>
        <li data-point="10000" class="left">10,000</li>
        <li data-point="50000">50,000</li>
        <li data-point="100000">100,000</li>
        <li class="cancel_btn">취소</li>
    </ul>
    <ol>
        <li onclick="if(confirm('떡상으로 베팅하시겠습니까?')) {doBetting('떡상떡락', '떡상');}"><span>떡상<img src="./img/arr_up.png" /></span></li>
        <li onclick="if(confirm('떡락으로 베팅하시겠습니까?')) {doBetting('떡상떡락', '떡락');}"><span>떡락<img src="./img/arr_down.png" /></span></li>
    </ol>
</div>

<div id="history">
    <ul class="title">
        <li class="num">회차</li>
        <li class="time">구매시간</li>
        <li class="result">떡상/떡락</li>
        <li class="buy">구매 포인트</li>
        <li class="gain">획득 포인트</li>
        <li>적중여부</li>
    </ul>
    <div id="my_betting_list">
    </div>
</div>

<div id="footer">
    <h2><a href="#">주식회사 포블게이트</a></h2>
    <address>
        <span>대표: 김태원, 나서정</span>
        <span>주소: 서울시 서초구 강남대로 581, 푸른빌딩 6층</span><br>
        <span>사업자등록번호: 136-87-01478</span>
        <span>고객센터: contact@foblgate.com</span>
    </address>
    <p class="copy">ⓒ FOBLTALK All rights reserved.</p>
</div>
<div id="sound_box"></div>



<script>
    var tring_get_result = false;
    var drawGamed = false;
    var game_table = "<?=$game_config['game_table']?>";
    var sound_start = get_cookie("sound_" + game_table) == 'off' ? 'off' : 'on';
    var betting_list_page = 1;
    var betting_point = 0;
    var betting_side = '';
    var stop_interval = false;

    $(document).ready(function() {
        sound_switch(sound_start);

        getGameResult();

        getMyBettingResult();

        setIntervalAndExecute(function(){
            getLiveData();
        }, 3000);;
    });


    function getMyBettingResult() {
        $.ajax({
            url: 'ajax.betting_list.php',
            type: 'post',
            data: {'page' : betting_list_page},
            dataType: 'json',
            success: function (result) {
                $("#my_betting_list").html(result['html']);
            }
        });

    }



    function doBetting(betting_type, betting_side) {
        var ajaxData  = {};

        ajaxData.betting_type  = betting_type;
        ajaxData.betting_side  = betting_side;
        ajaxData.betting_point = betting_point;

        $.ajax({
            url: 'ajax.betting.php',
            type: 'post',
            data: ajaxData,
            dataType: 'json',
            success: function (result) {
                if(result['alert'] != '') {
                    alert(result['alert']);
                }
                if(result['point_now'] !== undefined) {
                    reWritePoint(result['point_now']);
                    getMyBettingResult();
                }
            }
        });
    }

    function reWritePoint(point) {
        $('#my_point').html(number_format(point) + ' P');
    }








    $("#betting_point_select_box li").click(function(){
        betting_point = betting_point + ($(this).attr("data-point") -0);
        $("#betting_point").html(number_format(betting_point) + ' P');
        $("#win_expect_point").html(number_format(betting_point * 1.95) + ' P');
    });

    $(".cancel_btn").click(function(){
        $("#betting_point_select_box li").removeClass("selected_point");
        betting_point = 0;
        $("#betting_point").html('0 P');
        $("#win_expect_point").html('0 P');
        betting_side = '';
        $('.odd_even_selected').removeClass('odd_even_selected');
    });








    function sound_switch(type) { // on, off, toggle
        if(type == 'on') {
            set_cookie("sound_" + game_table, "on", 24);
            sound_start = 'on';
            $('.sound').removeClass('off');
        }
        else if(type == 'off') {
            set_cookie("sound_" + game_table, "off", 24);
            sound_start = 'off';
            $('.sound').addClass('off');
            $("#sound_box").html('');
        }
        else if(type == 'toggle') {
            if(sound_start == 'on') {
                sound_switch('off');
            }
            else{
                sound_switch('on');
            }
        }
    }


    function goMusic(filename){
        console.log(filename);
        if(sound_start == 'on') {
            fnCreateElement('div', '', {'name':filename}, null, '#sound_box');
            $("#sound_box > div:last-child").html('<audio src="./img/'+filename+'.mp3" autoplay style="display:none;"></audio>');
        }
    }

    function getLiveData() {
        if(!tring_get_result){
            $.ajax({
                dataType: 'json',
                url: 'ajax.get_live_data.php',
                cache: false,
                success: function (result) {

                    setRemainTime(result['remainTime']);
                    setNowTime(result['nowTime']);

                    setTimeout(function(){
                        setRemainTime(result['remainTime']-1);
                        setNowTime(result['nowTime']+1);
                    },1000);

                    setTimeout(function(){
                        setRemainTime(result['remainTime']-2);
                        setNowTime(result['nowTime']+2);
                    },2000);
                }
            });
        }
    }


    function setNowTime(nowTime) {
        var a = new Date(nowTime * 1000);
        var year = a.getFullYear();
        var month = a.getMonth() + 1;
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = year + '년 ' + month + '월 ' + date + '일 ' + hour + '시 ' + min + '분 ' + sec + '초';

        $("#nowTime").html(time);
    }

    function setRemainTime(remainTime){
        if(remainTime < 0) remainTime = 0;

        if(remainTime == 9) {
            goMusic('start');
        }

        var remainSec = remainTime % 60;
        var remainMin = (remainTime - remainSec)/60;
        var remainSec2 = ('0' + remainSec).substr(-2) ;
        var remainMin2 = ('0' + remainMin).substr(-2) ;

        $("#remainTime").html(remainMin2 + ':' + remainSec2);
        if(remainTime <= 0) {
            tring_get_result = true;
            tryGetGameResult(0);
        }
    }

    function tryGetGameResult(test_mode) {

        $.ajax({
            url: 'ajax.try_result.php',
            dataType: 'json',
            type: 'get',
            data: {'test':test_mode},
            cache: false,
            success: function (result) {
                if(result['result'] == 'try-again'){
                    setTimeout(function(){
                        tryGetGameResult(0);
                    }, 1000);
                }
                else if(result['result'] == 'reload'){
                    location.reload();
                }
                else if(result['result'] == 'stopped'){
//                console.log("잠시 게임 점검중입니다....");
                }
                else{
                    drawGame(result['result']);
                }
            }
        });
    }


    function getGameResult() {
        $.ajax({
            url: 'ajax.game_list.php',
            dataType: 'json',
            cache: false,
            success: function (result) {
                $("#real_history").html(result['html']);
            }
        });

    }



    function sortObject(obj) {
        var arr = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                arr.push({
                    'key': prop,
                    'value': obj[prop]
                });
            }
        }
        arr.sort(function(a, b) { return b.value - a.value; });
        //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
        return arr; // returns array
    }


    function drawGame(result) {
//    console.log(result);
        if(drawGamed === false) {
            drawGamed = true;
            $('.info').hide();
            $("#bg_middle").show();
            $("#gold_coin").show();

            result['game_height'] = result['game_height'].split(',');
            //console.log(result['game_height']);
            for (var i = 0;i < result['game_height'].length ; i++) {
                result['game_height'][i] = result['game_height'][i] * (-1);
            }







            /*
                    result['style_str1']    = '#path { d: path(); animation-name: path; animation-duration: 10s; animation-timing-function: ease-out; animation-fill-mode: forwards;}   @keyframes path { ';
                    for (var i = 0;i < result['game_height'].length ; i++) {
                        result['style_str1'] += " "+ (i*10) +"% { d: path('M0,185 ";
                        for(var j=0; j< result['game_height'].length ; j++) {
                            if(i <= j) {
                                result['style_str1'] += " L"+ (i*68) +","+ (result['game_height'][i]- 0 + 185) +" ";
                            }
                            else {
                                result['style_str1'] += " L"+ (j*68) +","+ (result['game_height'][j]- 0 + 185) +" ";
                            }
                        }
                        result['style_str1'] += "  '); } ";
                    }
                    result['style_str1'] += ' } ';
                    $("#keyframe_style1").html(result['style_str1']);
            */
            result['path'] = "M0,185 ";
            for (var i = 0;i < result['game_height'].length ; i++) {
                result['path'] += " L"+ (i*68) +","+ (result['game_height'][i]- 0 + 185) +" ";
            }
            $("#path").attr('d', result['path']);



            result['style_str2']    = '#gold_coin { animation-name: gold_coin; animation-duration: 10s; animation-timing-function: ease-out; animation-fill-mode: forwards;}   @keyframes gold_coin { ';
            for (var i = 0;i < result['game_height'].length ; i++) {
                result['style_str2'] += " "+ (i*10) +"% { left:"+(i*68)+"px; top:"+(result['game_height'][i]- 0 + 185)+"px; } ";
            }
            result['style_str2'] += ' } ';

            $("#keyframe_style2").html(result['style_str2']);

            for (var i = 1; i < result['game_height'].length ; i++) {
                fnCreateElement('h2', '', {'id':'colored_point' + i, 'class':(result['game_height'][i] > 0 ? 'down' : 'up'), 'style':'left:'+(i * 68)+'px; top:'+(result['game_height'][i]- 0 + 185)+'px; display:none'}, null, '.graph');
                result['style_str2'] += " "+ (i*10) +"% { left:"+(i*68)+"px; top:"+(result['game_height'][i]- 0 + 185)+"px; } ";
            }

            setInterval(function() {
                if(stop_interval === false) {
                    var coin_left = $("#gold_coin").position().left;
                    if(!$('#colored_point1').is(':visible') && coin_left > 68) {
                        goMusic('go');
                        $('#colored_point1').show();
                    }
                    if(!$('#colored_point2').is(':visible') && coin_left > 136) {
                        goMusic('go');
                        $('#colored_point2').show();
                    }
                    if(!$('#colored_point3').is(':visible') && coin_left > 204) {
                        goMusic('go');
                        $('#colored_point3').show();
                    }
                    if(!$('#colored_point4').is(':visible') && coin_left > 272) {
                        goMusic('go');
                        $('#colored_point4').show();
                    }
                    if(!$('#colored_point5').is(':visible') && coin_left > 340) {
                        goMusic('go');
                        $('#colored_point5').show();
                    }
                    if(!$('#colored_point6').is(':visible') && coin_left > 408) {
                        goMusic('go');
                        $('#colored_point6').show();
                    }
                    if(!$('#colored_point7').is(':visible') && coin_left > 476) {
                        goMusic('go');
                        $('#colored_point7').show();
                    }
                    if(!$('#colored_point8').is(':visible') && coin_left > 544) {
                        goMusic('go');
                        $('#colored_point8').show();
                    }
                    if(!$('#colored_point9').is(':visible') && coin_left > 612) {
                        goMusic('go');
                        $('#colored_point9').show();
                    }
                    if(!$('#colored_point9').is(':visible') && coin_left > 612) {
                        goMusic('go');
                        $('#colored_point9').show();
                    }
                    if(coin_left >= 680) {
                        goMusic('goal');
                        $(".ef").addClass('active');
                        goMusic('end');
                        stop_interval = true;
                        if(result['game_result'] == '떡상') {
                            $("#result_circle").addClass('up');
                            $(".result_popup").addClass('up');
                        }
                        else if(result['game_result'] == '떡락') {
                            $("#result_circle").addClass('down');
                            $(".result_popup").addClass('down');
                        }
                        $('.last').fadeIn();
                        drawGameEnd();
                    }
                }

            }, 100);

        }
    }

    function drawGameEnd(){
        setTimeout(function(){
            location.reload();
        }, 4000);
    }








    function fnCreateElement() {
        var element  = document.createElement(arguments[0]),
            text     = arguments[1],
            attr     = arguments[2],
            append   = arguments[3],
            appendTo = arguments[4],
            target;

        for(var key = 0; key < Object.keys(attr).length ; key++){
            var name = Object.keys(attr)[key],
                value = attr[name],
                tempAttr = document.createAttribute(name);
            tempAttr.value = value;
            element.setAttributeNode(tempAttr)
        }

        if(append){
            for(var _key = 0; _key < append.length; _key++) {
                element.appendChild(append[_key]);
            }
        }

        if(text) element.appendChild(document.createTextNode(text));

        if(appendTo){
            target = typeof(appendTo) === 'string' ? document.querySelector(appendTo) : appendTo;
            target.appendChild(element)
        }

        return element;
    }

    function setIntervalAndExecute(fn, t) {
        fn();
        return(setInterval(fn, t));
    }



    function number_format(num, decimals, dec_point, thousands_sep) {
        if(num == '?'){
            return num;
        }
        num = parseFloat(num);
        if(isNaN(num)) return '0';

        if(typeof(decimals) == 'undefined') decimals = 0;
        if(typeof(dec_point) == 'undefined') dec_point = '.';
        if(typeof(thousands_sep) == 'undefined') thousands_sep = ',';
        decimals = Math.pow(10, decimals);

        num = num * decimals;
        num = Math.round(num);
        num = num / decimals;

        num = String(num);
        var reg = /(^[+-]?\d+)(\d{3})/;
        var tmp = num.split('.');
        var n = tmp[0];
        var d = tmp[1] ? dec_point + tmp[1] : '';

        while(reg.test(n)) n = n.replace(reg, "$1"+thousands_sep+"$2");

        return n + d;
    }

</script>

</body>
</html>

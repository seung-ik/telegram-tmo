<?php

include_once("../../common.php");
include_once("./game.config.php");
$game['last'] = sql_fetch("select * from  `{$result_table}` order by `game_id` desc limit 1, 1");
$game['now']  = sql_fetch("select * from  `{$result_table}` order by `game_id` desc limit 0, 1");
?>
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <title>Coin Graph</title>
    <link rel='stylesheet' type='text/css' href='./style.css'>
    <script src="/js/jquery-1.8.3.min.js"></script>
    <script src="/js/common.js"></script>

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

<div id="coin_graph">
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
        //console.log(filename);
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

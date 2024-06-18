$(window).on('load',function() {

    var hashString = location.hash.substr(1); // remove '#'
    history.replaceState('', document.title, window.location.pathname);

    $("#splash").delay(1500).fadeOut('slow', function() {
        $("#mv").addClass("is-on");
    });
    $("#splash_logo").delay(1200).fadeOut('slow');

    const glossary = $('#glossary');
    const utakoswitch = $('#switch');

    var windowHeight = $(window).height();
    var pos1 = Math.ceil(glossary.offset().top);
    var pos2 = Math.ceil(utakoswitch.offset().top);

// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function (){
    fadeAnime();/* アニメーション用の関数を呼ぶ*/

    if (Math.ceil($(this).scrollTop()) >= pos1 - windowHeight - 1000) {
        $(".bgfix div").addClass("v1");
        $(".bgfix div").removeClass("v2");
    } else {
        $(".bgfix div").removeClass("v1");
    }

    if (Math.ceil($(this).scrollTop()) >= pos2 - windowHeight - 1000) {
        $(".bgfix div").addClass("v2");
        $(".bgfix div").removeClass("v1");
    } else {
        $(".bgfix div").removeClass("v2");
    }

    if (Math.ceil($(this).scrollTop()) >= pos2) {
        $(".bgfix div").removeClass("v1");
        $(".bgfix div").removeClass("v2");
    }

})

function fadeAnime(){

$('#history .event').each(function(){
    var elemPos = $(this).offset().top - 20;//要素より上
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight){
        $(this).addClass('is-on');
    }
});

$('#glossary .list dl').each(function(){
    var elemPos = $(this).offset().top - 20;//要素より上
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight){
        $(this).addClass('is-on');
    }
});

$('#message .box li').each(function(){
    var elemPos = $(this).offset().top - 20;//要素より上
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight){
        $(this).addClass('is-on');
    }
});


}//
});
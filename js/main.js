$(window).on('load',function() {
    $("#TOP").addClass("is-on");
    $("#splash").delay(1500).fadeOut('slow', function() {
        $("#mv").addClass("is-on");
    });
    $("#splash_logo").delay(1200).fadeOut('slow');

	$('a[href^="#"]').on("click", function() {

		var speed = 400;// ミリ秒
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;

        if(href != "#TOP" && position == 0){
            return false;
        }
		// スクロール調整
		if($('body,html').scrollTop() > 800 && position == 0){
			$('body,html').scrollTop(position-800);
		}
		// スムーススクロール easeOutExpo
		$('body,html').animate({scrollTop:position}, speed, 'swing');
		return false;
	});

    $('.menu').on("click", function() {
        $('#spWraper').slideDown();
        $('#spWraper .nav').addClass("is-on");
        $('#spWraper .close').addClass("is-on");
    });
    $('.close').on("click", function() {
        $('#spWraper').slideUp(function(){
            $('#spWraper .nav').removeClass("is-on");
            $('#spWraper .close').removeClass("is-on");
        });
    });
    if ($(window).width() <= 768) {
        $('#header a').on("click", function() {
            $('#spWraper').hide();
            $('#spWraper .nav').removeClass("is-on");
            $('#spWraper .close').removeClass("is-on");
        });
    }

    const glossary = $('#glossary');
    const utakoswitch = $('#switch');

    var windowHeight = $(window).height();
    //console.log(windowHeight)
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
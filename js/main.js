$(window).on('load',function() {
    //$("#splash").delay(1500).fadeOut('slow');
    //$("#splash_logo").delay(1200).fadeOut('slow');

	$('a[href^="#"]').on("click", function() {
		// スクロールの速度
		var speed = 400;// ミリ秒
		// アンカーの値取得
		var href= $(this).attr("href");
		// 移動先を取得
		var target = $(href == "#" || href == "" ? 'html' : href);
		// 移動先を数値で取得
		var position = target.offset().top;
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

    $('.openModal').on("click", function() {
        $('#modalArea').fadeIn(150);
        $('#js-art').attr("src",$(this).find("img").attr("src"));
    });
    $('#closeModal , #modalBg').on("click", function() {
        $('#modalArea').fadeOut(150);
    });



    $(".gallery").modaal({
        type: 'image',
        overlay_close:true,//モーダル背景クリック時に閉じるか
        before_open:function(){// モーダルが開く前に行う動作
            $('html').css('overflow-y','hidden');/*縦スクロールバーを出さない*/
        },
        after_close:function(){// モーダルが閉じた後に行う動作
            $('html').css('overflow-y','scroll');/*縦スクロールバーを出す*/
        }
    });



// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function (){
    fadeAnime();/* アニメーション用の関数を呼ぶ*/
});// ここまで画面をスクロールをしたら動かしたい場合の記述

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
$(function () {

	// スムーススクロール
	$('a[href^="#"]').on("click", function() {
		// スクロールの速度
		var speed = 800;// ミリ秒
		// アンカーの値取得
		var href= $(this).attr("href");
		// 移動先を取得
		var target = $(href == "#" || href == "" ? 'html' : href);
		// 移動先を数値で取得
        var position = target.offset().top;
		// スクロール調整
		if($('body,html').scrollTop() > 800 && position == 0){
            $('body,html').scrollTop(800);
		}

		if(href == "#theme" || href == "#event"){
			if($(window).innerWidth() > 768){
				position = position - 192;
			}else {
				position = position - 55;
			}
		}

		$('body,html').animate({scrollTop:position}, speed, 'easeOutExpo');
		return false;
	});

});


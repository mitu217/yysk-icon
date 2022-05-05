(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-71295798-1', 'auto');
  ga('send', 'pageview');

// 初期設定
window.onload = function() {
  /// メッセージフォームとメッセージラベルの同期
  var timer = null;
  document.getElementById("message").addEventListener("focus", function(){
    window.clearInterval(timer);
    timer = window.setInterval(function(){
      updateMessage();
    }, 100);
  }, false);  
  document.getElementById("message").addEventListener("blur", function(){
    window.clearInterval(timer);
  }, false);

  /// ウィンドウリサイズ時に文字のサイズを更新
  window.onresize = function() {
    updateMessage();
  }
}

/// 画像の更新
function updateImage() {
  loadImage("preview-img");
}

// メッセージの更新
function updateMessage() {
  var message = document.getElementById("message");
  drawText("preview-img", message);
}

/// ボタンの無効化
function disabled_btn(button) {

}

/// ボタンの有効化
function enabled_btn (button) {

}

//キャンバスに画像を描画する
function loadImage(id)
{
  var select_index = document.getElementById("character").selectedIndex;
  var character_nama = document.getElementById("character").options[select_index].value;

	//画像を読み込んでImageオブジェクトを作成する
	var image = new Image();
	image.src = 'images/' + character_nama + '_origin.png';
	image.onload = (function () {
		//画像ロードが完了してからキャンバスの準備をする
		var canvas = document.getElementById(id);
		var ctx = canvas.getContext('2d');
		//キャンバスのサイズを画像サイズに合わせる
		canvas.width = image.width;
		canvas.height = image.height;
		//キャンバスに画像を描画（開始位置0,0）
		ctx.drawImage(image, 0, 0);
	});
}

//キャンバスに文字を描く
function drawText(canvas_id, text)
{
  var select_index = document.getElementById("character").selectedIndex;
  var character_nama = document.getElementById("character").options[select_index].value;

	//画像を読み込んでImageオブジェクトを作成する
	var image = new Image();
	image.src = 'images/' + character_nama + '_origin.png';
	image.onload = (function () {
		//画像ロードが完了してからキャンバスの準備をする
		var canvas = document.getElementById(canvas_id);
		var ctx = canvas.getContext('2d');
		//キャンバスのサイズを画像サイズに合わせる
		canvas.width = image.width;
		canvas.height = image.height;
		//キャンバスに画像を描画（開始位置0,0）
		ctx.drawImage(image, 0, 0);

    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext('2d');
  
    //文字のスタイルを指定
    ctx.font = 'bold 54pt "やさしさゴシック", serif';
    ctx.fontWeight = 'bold' 
    ctx.fillStyle = '#404040';
    //文字の配置を指定（左上基準にしたければtop/leftだが、文字の中心座標を指定するのでcenter
    ctx.textBaseline = 'center';
    ctx.textAlign = 'center';
    //座標を指定して文字を描く（座標は画像の中心に）
    var x = (canvas.width / 2);
    var y = (canvas.height / 4.5);
    ctx.fillText(text.value, x, y);
  })
}

// 画像のダウンロード
function downloadImage(d) {
  if (message.value.length == 0) {
    notie.alert(3, 'メッセージを入力してください', 1);
  } else {
    var select_index = document.getElementById("character").selectedIndex;
    var character_nama = document.getElementById("character").options[select_index].value;

    var canvas = document.getElementById("preview-img");
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = character_nama + ".png";
    link.click();
  }
}

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
  img = document.getElementById("preview-img");
  select_index = document.getElementById("character").selectedIndex;
  file_nama = document.getElementById("character").options[select_index].value;
  img.src = 'images/' + file_nama + '_origin.png';
}

// メッセージの更新
function updateMessage() {
  var message = document.getElementById("message");
  var label = document.getElementById("preview-msg");
  var size = document.getElementById("preview-img").width * 0.111;

  label.innerText = message.value;
  label.style.fontSize = size + "pt";
  label.style.top = -(document.getElementById("preview-img").width + 4) + "px"; 

  if (message.value.length != 0) {
    enabled_btn(document.getElementById("download"));
    enabled_btn(document.getElementById("share_twitter"));
  } else {
    disabled_btn(document.getElementById("download"));
    disabled_btn(document.getElementById("share_twitter"));
  }
}

/// ボタンの無効化
function disabled_btn(button) {

}
/// ボタンの有効化
function enabled_btn (button) {

}

// 画像のダウンロード
function downloadImage(d) {
  if (message.value.length == 0) {
    notie.alert(3, 'メッセージを入力してください', 1);
  } else {
    var contact_form_contents = {
      character : document.getElementById("character").value,
      message : document.getElementById("message").value
    };

    $.ajax({
      type: 'POST',
      url: '/download',
      cache: false,
      data: contact_form_contents, 
      success: function(html) {
        var a = document.createElement('a');
        a.href = html;
        a.download = document.getElementById("character").value + ".png";
        a.click();        
      },
      error: function() {
        notie.alert(3, "画像を生成できませんでした", 1);
      }
    });
  }
}

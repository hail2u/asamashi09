// 設定
var config = {
  asin_code:    '4774134902',
  associate_id: 'hail2unet-22',
  template_url: 'http://labs.hail2u.net/amazon/asamashi/template.js'
};

// 初期化
function init() {
  var q = {
    asin_code:    config.asin_code,
    associate_id: config.associate_id,
    template_url: config.template_url
  };

  $('#searchForm').submit(function () {
    setHash(q);
    return false;
  });

  if (location.hash.match(/^#([a-zA-Z0-9]{10}):(.+?):?(http:\/\/.+)?$/)) {
    q.asin_code    = RegExp.$1;
    q.associate_id = RegExp.$2;
    q.template_url = RegExp.$3;
    fillForm(q);
    checkForm(q);
  } else {
    fillForm(q);
    $('#asinCode').focus().select();
    showStatus('初期化が完了しました。');
  }
}

// フォームを埋める
function fillForm(q) {
  showStatus('フォームを埋めています･･･');

  $('#asinCode').val(q.asin_code);
  $('#associateId').val(q.associate_id);
  $('#templateUrl').val(q.template_url);
}

// ハッシュをセット
function setHash(q) {
  showStatus('ハッシュをセットしています･･･');

  location.hash = '#' + [
    q.asin_code,
    q.associate_id,
    q.template_url
  ].join(':');

  checkForm(q);
}

// フォームのチェック
function checkForm(q) {
  showStatus('フォームの入力内容をチェックしています･･･');

  // それぞれ妥当なデータかどうかチェックする･･･ものを後で書く
  if (!q.asin_code) {
    showError('フォーム入力エラー: ASINコードが指定されていません。');
    $('#asinCode').focus().select();
  } else if (!q.associate_id) {
    showError('フォーム入力エラー: アソシエイトIDが指定されていません。');
    $('#associateId').focus().select();
  } else if (!q.template_url) {
    showError('フォーム入力エラー: テンプレートURLが指定されていません。');
    $('#templateUrl').focus().select();
  } else {
    loadTemplate(q);
  }
}

// テンプレートの読み込み
function loadTemplate(q) {
  showStatus('テンプレートを読み込んでいます･･･');

  // JSONで書かれたテンプレートを読み込む･･･ものを後で書く
  q.template = '<!-- this is a dumy template -->';

  doSearch(q);
}

// 検索の実行
function doSearch(q) {
  showStatus('指定したASINコードを検索しています･･･');

  $.getJSON('http://pipes.yahoo.com/pipes/pipe.run?_callback=?', {
    _id:         '23c68494a774b6c65665eacebfaf971b',
    _render:     'json',
    asin:        q.asin_code,
    tracking_id: q.associate_id
  }, function (data) {
    var res = data.value.items[0];

    if (res.Items.Request.Errors) {
      showError([
        res.Items.Request.Errors.Error.Code,
        res.Items.Request.Errors.Error.Message
        ].join(': '));
    } else {
      var item = res.Items.Item;

      // 結果表示領域のリセット
      $('#result').empty();

      // アサマシプレビュー
      $('#result').append($('<h2/>').append(document.createTextNode('プレビュー')));
      $('#result').append($('<p/>').append($('<a/>').attr({
        href: item.DetailPageURL
      }).append($('<img/>').attr({
        src:    item.MediumImage.URL,
        width:  item.MediumImage.Width.content,
        height: item.MediumImage.Height.content
      })).append(document.createTextNode(item.ItemAttributes.Title))));

      // アサマシコード
      $('#result').append($('<h2/>').append(document.createTextNode('コード')));
      $('#result').append($('<p/>').append($('<textarea/>').attr({
        cols: 80,
        rows: 10
      }).focus(function () {
        var self = this;
        setTimeout(function () { // for Safari
          $(self).select();
        }, 10);
      }).append(document.createTextNode($('#result').html()))));

      // ブックマークレット
      $('#result').append($('<h2/>').append(document.createTextNode('ブックマークレット')));
      $('#result').append($('<p/>').append($('<a/>').attr({
        href: createBookmarklet()
      }).append($(document.createTextNode('Asamashi09!')))));

      // コードにフォーカスを移す
      $('#result p textarea').focus();
    }
  });
}

// 入力されたアソシエイトIDとテンプレートURLを元にブックマークレット作成
function createBookmarklet() {
  var bookmarklet = 'javascript:(function(){location.href=\'http://labs.hail2u.net/amazon/asamashi/#\'+location.href.replace(/^.*\/dp\/(.*?)\/.*$/,\'$1\')+\':hail2unet-22:http://hail2u.net/scripts/asamashi/img.js\'})();'; // dummy

  return bookmarklet;
}

// 状態の表示
function showStatus(msg) {
  $('#result').empty().append($('<p/>').addClass('status').append(document.createTextNode(msg)));
}

// エラー表示
function showError(msg) {
  $('#result').empty().append($('<p/>').addClass('error').append(document.createTextNode(msg)));
}

$(init);

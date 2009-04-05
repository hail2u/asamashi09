var config = {
  asin:         '4774134902',
  associate_id: 'hail2unet-22',
  template_url: 'http://labs.hail2u.net/amazon/asamashi/template.js'
};

var url = 'http://pipes.yahoo.com/pipes/pipe.run?_callback=?';
var buf = [];

function init() {
  $('#searchForm').submit(function () {
    setHash();
    return false;
  });

  if (location.hash.match(/^#([a-zA-Z0-9]{10}):(.+?):?(http:\/\/.+)?$/)) {
    $('#asinCode').val((RegExp.$1 ? decodeURIComponent(RegExp.$1) : config.asin));
    $('#associateId').val((RegExp.$2 ? decodeURIComponent(RegExp.$2) : config.associate_id));
    $('#templateUrl').val((RegExp.$3 ? decodeURIComponent(RegExp.$3) : config.template_url));
    checkForm();
  }

  $('#asinCode').focus().select();

  showStatus('初期化が完了しました。');
}

function setHash() {
  showStatus('ハッシュをセットしています･･･');

  location.href += '#' + [
    $('#asinCode').val(),
    $('#associateId').val(),
    $('#templateUrl').val()
  ].join(':');

  showStatus('ハッシュをセットしました。');

  checkForm();
}

function checkForm() {
  showStatus('フォームの入力内容をチェックしています･･･');

  var asin         = $('#asinCode').val();
  var associate_id = $('#associateId').val();
  var tmpl_url     = $('#templateUrl').val();

  if (!asin) {
    showError('フォーム入力エラー: ASINコードが指定されていません。');
    $('#asinCode').focus().select();
  } else if (!associate_id) {
    showError('フォーム入力エラー: アソシエイトIDが指定されていません。');
    $('#associateId').focus().select();
  } else if (!tmpl_url) {
    showError('フォーム入力エラー: テンプレートURLが指定されていません。');
    $('#templateUrl').focus().select();
  } else {
    showStatus('フォームの入力内容をチェックしています･･･');
    loadTemplate();
  }
}

function loadTemplate() {
  showStatus('テンプレートを読み込んでいます･･･');

  var template = ''; // dummy

  doSearch(template);
}

function doSearch(template) {
  showStatus('指定したASINコードを検索しています･･･');

  $.getJSON(url, {
    _id:         '23c68494a774b6c65665eacebfaf971b',
    _render:     'json',
    asin:        $('#asinCode').val(),
    tracking_id: $('#associateId').val()
  }, function (data) {
    var res = data.value.items[0];

    if (res.Items.Request.Errors) {
      showError([
        res.Items.Request.Errors.Error.Code,
        res.Items.Request.Errors.Error.Message,
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
  alert(msg.toSource());
  $('#result').empty().append($('<p/>').addClass('error').append(document.createTextNode(msg)));
}

$(init);

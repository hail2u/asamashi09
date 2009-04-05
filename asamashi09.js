var url = 'http://pipes.yahoo.com/pipes/pipe.run?_callback=?';
var buf = [];

function init() {
  $('#searchForm').submit(function () {
    loadTmpl();
    return false;
  });

  if (location.hash.match(/^#([a-zA-Z0-9]{10}):(.+?):?(http:\/\/.+)?$/)) {
    $('#asinCode').val((RegExp.$1 ? RegExp.$1 : ''));
    $('#associateId').val((RegExp.$2 ? RegExp.$2 : 'hail2unet-22'));
    $('#templateUrl').val((RegExp.$3 ? decodeURIComponent(RegExp.$3) : 'http://labs.hail2u.net/amazon/asamashi/template.js'));
    loadTmpl();
  }

  $('#asinCode').focus().select();
}

function loadTmpl() {
  $('#result').empty().append($('<p/>').addClass('status').append('テンプレートを読み込んでいます･･･'));

  var asin         = $('#asinCode').val();
  var associate_id = $('#associateId').val();
  var tmplUrl      = $('#templateUrl').val();

  if (!asin) {
    $('#result').empty().append($('<p/>').addClass('error').append('フォーム入力エラー: ASINコードが指定されていません。'));
    $('#asinCode').focus().select();
  } else if (!associate_id) {
    $('#result').empty().append($('<p/>').addClass('error').append('フォーム入力エラー: アソシエイトIDが指定されていません。'));
    $('#associateId').focus().select();
  } else if (!tmplUrl) {
    $('#result').empty().append($('<p/>').addClass('error').append('フォーム入力エラー: テンプレートURLが指定されていません。'));
  } else {
    var template = '';
    doSearch(asin, associate_id, template);
  }
}

function doSearch(asin, associate_id, template) {
  $('#result').empty().append($('<p/>').addClass('status').append('指定したASINコードを検索しています･･･'));

  $.getJSON(url, {
    _id:         '23c68494a774b6c65665eacebfaf971b',
    _render:     'json',
    asin:        asin,
    tracking_id: associate_id
  }, function (data) {
    var res = data.value.items[0];
    $('#result').empty();

    if (res.Items.Request.Errors) {
      var err = res.Items.Request.Errors.Error;
      $('#result').append($('<p/>').addClass('error').append(document.createTextNode(err.Code + ': ' + err.Message)));
    } else {
      var item = res.Items.Item;
      // アサマシプレビュー
      $('#result').append($('<p/>').append($('<a/>').attr({
        href: item.DetailPageURL
      }).append($('<img/>').attr({
        src:    item.MediumImage.URL,
        width:  item.MediumImage.Width.content,
        height: item.MediumImage.Height.content
      })).append(document.createTextNode(item.ItemAttributes.Title))));

      // アサマシコード
      $('#result').append($('<p/>').append($('<textarea/>').attr({
        cols: 80,
        rows: 10
      }).focus(function () {
        var self = this;
        setTimeout(function () { // for Safari
          $(self).select();
        }, 10);
      }).append(document.createTextNode($('#result').html()))));

      // コードにフォーカスを移す
      $('#result p textarea').focus();
    }
  });
}

$(init);

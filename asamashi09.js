(function() {
  var Asamashi09 = function() {
  };

  // 設定
  ASIN_CODE    = '4774134902';
  ASSOCIATE_ID = 'hail2unet-22';
  TEMPLATE_URL = 'http://labs.hail2u.net/amazon/asamashi/template.js';

  Asamashi09.prototype = {
    // 設定のコピー
    config: {
      asin_code:    this.ASIN_CODE,
      associate_id: this.ASSOCIATE_ID,
      template_url: this.TEMPLATE_URL
    },

    // フォームを埋める
    fillForm: function (q) {
      this.showStatus('フォームを埋めています･･･');

      $('#asinCode').val(q.asin_code);
      $('#associateId').val(q.associate_id);
      $('#templateUrl').val(q.template_url);
    },

    // ハッシュをセット
    setHash: function(q) {
      this.showStatus('ハッシュをセットしています･･･');

      location.hash = '#' + [
        q.asin_code,
        q.associate_id,
        q.template_url
      ].join(':');

      this.checkForm(q);
    },

    // フォームのチェック
    checkForm: function (q) {
      this.showStatus('フォームの入力内容をチェックしています･･･');

      // それぞれ妥当なデータかどうかチェックする･･･ものを後で書く
      if (!q.asin_code || !this.checkASINCode(q.asin_code)) {
        this.showError('フォーム入力エラー: ASINコードが指定されていないか無効な値です。');
        $('#asinCode').focus().select();
      } else if (!q.associate_id || !this.checkAssociateID(q.associate_id)) {
        this.showError('フォーム入力エラー: アソシエイトIDが指定されていないか無効な値です。');
        $('#associateId').focus().select();
      } else if (!q.template_url || !this.checkTemplateURL(q.template_url)) {
        this.showError('フォーム入力エラー: テンプレートURLが指定されていないか無効なURLです。');
        $('#templateUrl').focus().select();
      } else {
        this.doSearch(q);
      }
    },

    // ASINコードのチェック
    checkASINCode: function (asin) {
      if (asin.match(/^[B0-9][A-Z0-9]{9}$/)) {
        return true;
      } else {
        return false;
      }
    },

    // アソシエイトIDのチェック
    checkAssociateID: function (asin) {
      if (asin.match(/^[a-zA-Z\d]+-22$/)) {
        return true;
      } else {
        return false;
      }
    },

    // アソシエイトIDのチェック
    checkTemplateURL: function (asin) {
      if (asin.match(/^http:\/\/.+/)) {
        return true;
      } else {
        return false;
      }
    },

    // 検索の実行
    doSearch: function (q) {
      var self = this;
      this.showStatus('指定したASINコードを検索しています･･･');

      $.getJSON('http://pipes.yahoo.com/pipes/pipe.run?_callback=?', {
        _id:         '23c68494a774b6c65665eacebfaf971b',
        _render:     'json',
        asin:        q.asin_code,
        tracking_id: q.associate_id
      }, function (data) {
        var res = data.value.items[0];

        if (res.Items.Request.Errors) {
          self.showError([
            res.Items.Request.Errors.Error.Code,
            res.Items.Request.Errors.Error.Message
          ].join(': '));
        } else {
          var item = res.Items.Item;

          // 結果表示領域のリセット
          $('#result').empty();

          // アサマシプレビュー
          $('<h2/>').text('Preview').appendTo('#result');
          $('<div/>').attr({
            id: 'preview'
          }).appendTo('#result');
          $('#preview').setTemplateURL('./template.tpl');
          $('#preview').processTemplate(item);

          // アサマシコード
          $('<h2/>').text('Code').appendTo('#result');
          $('<p/>').append($('<textarea/>').attr({
            cols: 80,
            rows: 10
          }).focus(function () {
            var self = this;
            setTimeout(function () { // for Safari
              $(self).select();
            }, 10);
          }).text($('#preview').html())).appendTo('#result');

          // ブックマークレット
          $('<h2/>').text('Bookmarklet').appendTo('#result');
          $('<p/>').append($('<a/>').attr({
            href: [
              'javascript:(function(){location.href=\'',
              location.href.replace(location.hash, ''),
              '#\'+location.href.replace(/^.*\\/dp\\/(.*?)\\/.*$/,\'$1\')+\':',
              q.associate_id,
              ':',
              q.template_url,
              '\'})();'
            ].join('')
          }).text('Asamashi09!')).appendTo('#result');

          // コードにフォーカスを移す
          $('#result p textarea').focus();

          // 検索完了の通知
          self.showStatus('検索が完了しました。');
        }
      });
    },

    // 状態の表示
    showStatus: function (msg) {
      $('#message').empty();
      $('<p/>').addClass('status').text(msg).appendTo('#message');
    },

    // エラー表示
    showError: function (msg) {
      $('#message').empty();
      $('<p/>').addClass('error').text(msg).appendTo('#message');
    }
  };

  window.a09 = new Asamashi09();
})();

// 初期化
$(function () {
  var q = {
    asin_code:    a09.config.asin_code,
    associate_id: a09.config.associate_id,
    template_url: a09.config.template_url
  };

  $('#searchForm').submit(function () {
    a09.setHash({
      asin_code:    $('#asinCode').val(),
      associate_id: $('#associateId').val(),
      template_url: $('#templateUrl').val()
    });
    return false;
  });

  if (location.hash.match(/^#([B\d][A-Z\d]{9}):([a-zA-Z\d]+-22):?(http:\/\/.+)?$/)) {
    q.asin_code    = RegExp.$1;
    q.associate_id = RegExp.$2;
    q.template_url = RegExp.$3;
    a09.fillForm(q);
    a09.checkForm(q);
  } else {
    a09.fillForm(q);
    $('#asinCode').focus().select();
    $('#result').empty();
    $('<p/>').append(document.createTextNode('ASINコード、アソシエイトID、及びテンプレートURLを入力してフォームを送信してください。')).appendTo('#result');
    a09.showStatus('初期化が完了しました。');
  }
});

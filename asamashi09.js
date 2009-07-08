(function() {
  var Asamashi09 = function() {
  };

  // 設定
  ASIN_CODE    = "4774134902";
  ASSOCIATE_ID = "hail2unet-22";
  TEMPLATE_URL = "http://hail2u.github.com/asamashi09/template.xml";

  Asamashi09.prototype = {
    // 設定をコピー
    config: {
      asin_code:    this.ASIN_CODE,
      associate_id: this.ASSOCIATE_ID,
      template_url: this.TEMPLATE_URL
    },

    // フォームを埋める
    fillForm: function (q) {
      this.showStatus("フォームを埋めています･･･");

      $("#asinCode").val(q.asin_code);
      $("#associateId").val(q.associate_id);
      $("#templateUrl").val(q.template_url);
    },

    // ハッシュをセット
    setHash: function(q) {
      this.showStatus("ハッシュをセットしています･･･");

      location.hash = "#" + [
        q.asin_code,
        q.associate_id,
        q.template_url
      ].join(":");

      this.checkForm(q);
    },

    // フォームをチェック
    checkForm: function (q) {
      this.showStatus("フォームの入力内容をチェックしています･･･");

      // それぞれ妥当なデータかどうかチェックする
      if (!q.asin_code || !this.checkASINCode(q.asin_code)) {
        this.showError("フォーム入力エラー: ASINコードが指定されていないか無効な値です。");
        $("#asinCode").focus().select();
      } else if (!q.associate_id || !this.checkAssociateID(q.associate_id)) {
        this.showError("フォーム入力エラー: アソシエイトIDが指定されていないか無効な値です。");
        $("#associateId").focus().select();
      } else if (!q.template_url || !this.checkTemplateURL(q.template_url)) {
        this.showError("フォーム入力エラー: テンプレートURLが指定されていないか無効なURLです。");
        $("#templateUrl").focus().select();
      } else {
        this.loadTemplate(q);
      }
    },

    // ASINコードをチェック
    checkASINCode: function (d) {
      if (d.match(/^[B\d][A-Z\d]{9}$/)) {
        return true;
      } else {
        return false;
      }
    },

    // アソシエイトIDをチェック
    checkAssociateID: function (d) {
      if (d.match(/^[a-zA-Z\d]+-22$/)) {
        return true;
      } else {
        return false;
      }
    },

    // テンプレートURLをチェック
    checkTemplateURL: function (d) {
      if (d.match(/^http:\/\/.+/)) {
        return true;
      } else {
        return false;
      }
    },

    // テンプレートをロード
    loadTemplate: function (q) {
      this.showStatus("テンプレートをロードしています･･･");

      var self = this;

      $.getJSON("http://query.yahooapis.com/v1/public/yql?callback=?", {
        format: "json",
        q:      "select data from xml where url='" + q.template_url + "'"
      }, function (data) {
        var res = data.query.results;

        if (!data || !res || !res.template) {
          self.showError("テンプレートがロードできませんでした。");
        } else {
          var template = "{#template MAIN}" + res.template.data + "{#/template MAIN}";
          self.doSearch(q, template);
        }
      });
    },

    // 検索を実行
    doSearch: function (q, template) {
      this.showStatus("指定したASINコードを検索しています･･･");

      var self = this;
      var url = "http://aap.hail2u.net/?" + $.param({
        Service:        "AWSECommerceService",
        Operation:      "ItemLookup",
        ResponseGroup:  "Small,Images",
        Version:        "2009-06-01",
        AWSAccessKeyId: "08PWFCAAQ5TZJT30SKG2",
        ItemId:         q.asin_code,
        AssociateTag:   q.associate_id
      });
      $.getJSON("http://query.yahooapis.com/v1/public/yql?callback=?", {
        format: "json",
        q:      "select * from xml where url='" + url + "'"
      }, function (data) {
        var items = data.query.results.ItemLookupResponse.Items;

        if (items.Request.Errors) {
          self.showError([
            items.Request.Errors.Error.Code,
            items.Request.Errors.Error.Message
          ].join(": "));
        } else {
          var item = items.Item;

          // 結果表示領域をリセット
          $("#result").empty();

          // アサマシプレビュー
          $("<h2/>").text("Preview").appendTo("#result");
          $("<div/>").attr({
            id: "preview"
          }).appendTo("#result");
          $("#preview").setTemplate(template);
          $("#preview").processTemplate(item);

          // アサマシコード
          $("<h2/>").text("Code").appendTo("#result");
          $("<p/>").append($("<textarea/>").attr({
            cols: 80,
            rows: 10,
            id:   "code"
          }).focus(function () {
            var self = this;
            setTimeout(function () { // for Safari
              $(self).select();
            }, 100);
          }).text($("#preview").html())).appendTo("#result");

          // ブックマークレット
          $("<h2/>").text("Bookmarklet").appendTo("#result");
          $("<p/>").append($("<a/>").attr({
            href: [
              "javascript:(function(){var asin=productTags?productTags.asin:location.href.replace(/^.*\\/([a-zA-Z0-9]{10})\\/.*$/,\"$1\");location.href=\"",
              location.href.replace(location.hash, ""),
              "#\"+asin+\":",
              q.associate_id,
              ":",
              q.template_url,
              "\"})();"
            ].join("")
          }).text("Asamashi09!")).appendTo("#result");

          // コードにフォーカスを移動
          $("#code").focus();

          // 検索完了を通知
          self.showStatus("検索が完了しました。");
        }
      });
    },

    // ステータスを表示
    showStatus: function (msg) {
      $("#message").show().html($("<p/>").addClass("status").append(msg));
      setTimeout(function () {
        $("#message").fadeOut(1000);
      }, 3000);
    },

    // エラーを表示
    showError: function (msg) {
      $("#message").html($("<p/>").addClass("error").append(msg));
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

  $("#searchForm").submit(function () {
    a09.setHash({
      asin_code:    $("#asinCode").val(),
      associate_id: $("#associateId").val(),
      template_url: $("#templateUrl").val()
    });
    return false;
  });

  if (location.hash.match(/^#([B\d][A-Z\d]{9}):([a-zA-Z\d]+-22):(http:\/\/.+)$/)) {
    q.asin_code    = RegExp.$1;
    q.associate_id = RegExp.$2;
    q.template_url = RegExp.$3;
    a09.fillForm(q);
    a09.checkForm(q);
  } else {
    a09.fillForm(q);
    $("#asinCode").focus().select();
    $("#result").empty();
    $("<p/>").text("ASINコード、アソシエイトID、及びテンプレートURLを入力してフォームを送信してください。").appendTo("#result");
    a09.showStatus("初期化が完了しました。");
  }
});

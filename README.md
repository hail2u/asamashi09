Asamashi09
==========

外部ドメインに置いたテンプレート・ファイルにより出力をカスタマイズすることができるPure JavaScriptなAmazonアソシエイト・ツールです。


Sample
------

[http://hail2u.github.com/asamashi09/](http://hail2u.github.com/asamashi09/)


Usage
-----

  1. ASINコードを入力
  2. アソシエイトIDを入力
  3. テンプレートURLを入力
  4. フォームを送信

進行状況は逐一表示され、何かしら不具合を見つけた場合はエラー・メッセージを出して停止します。


### Bookmarklet

フォームを送信後、正常にコードが生成された場合は、入力したアソシエイトIDとテンプレートURLにカスタマイズされたブックマークレットが生成されます。以降はAmazonの商品個別ページ等でそのブックマークレットを利用すれば、何も入力することなく自動的にコードが生成されるようになります。


Template
--------

[デフォルトのテンプレート](http://hail2u.github.com/asamashi09/template.xml)のようにXMLで作成します。テンプレートとして採用される部分は`data`要素の`CDATA`セクション内だけです。デフォルトのテンプレートはHTMLで書かれており、HTMLのコードを出力するといった用途が主になりますが、特に書式に制限はありません。


### テンプレート内での変数: `$T`

`$T`にはAmazon Web ServicesのItemLookupオペレーションで返ってきたXMLの`Item`要素以下がJSONにコンバートされた形で格納されています。Item要素以下の要素の構成については[サンプルXML](http://ecs.amazonaws.jp/onca/xml?Service=AWSECommerceService&amp;Version=2009-02-01&amp;Operation=ItemLookup&amp;ContentType=text%2Fxml&amp;SubscriptionId=1T2SAFDMWVQS3E47MD02&amp;AssociateTag=hail2unet-22&amp;ItemId=4774134902&amp;ResponseGroup=Images,Small)を参照してください。テンプレート内では、

    {$T.DetailPageURL}
    {$T.MediumImage.URL}
    {$T.ItemAttributes.Title}

といった文法で参照します。


LICENSE
-------

MIT: http://hail2u.mit-license.org/2009

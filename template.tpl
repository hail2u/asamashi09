{#template MAIN}
<div class="asamashi">
  <p class="image">
    <a href="{$T.DetailPageURL}">
      <img alt="{$T.ItemAttributes.Title}"
        src="{$T.MediumImage.URL}"
        width="{$T.MediumImage.Width.content}"
        height="{$T.MediumImage.Height.content}" />
    </a>
  </p>
  <h3 class="title">
    <a href="{$T.DetailPageURL}">
      {$T.ItemAttributes.Title}
    </a>
  </h3>
  <ul class="detail">
    <li>{$T.ItemAttributes.Author}</li>
    <li>{$T.ItemAttributes.Manufacturer}</li>
    <li>{$T.ItemAttributes.ProductGroup}</li>
    <li>{$T.ASIN}</li>
  </ul>
</div>
{#/template MAIN}

(function() {
  var thumbBook = function(id) {
    return $().html();
  }
  redirectLinks = $('a[href*="#ISBN"]');
  redirectLinks.each(function(index, value) {
    var productId = $(this)[0].href.substring($(this)[0].href.indexOf("#ISBN") + 5);
    $(this).parents().each(function() {
      if ($(this)[0].tagName === "P") {
        htmlString = "<div class=\"post-content\"><div class=\"post-image post-thumbnail\"><img src=\"https://images.amazon.com/images/P/" + productId + ".jpg\" /></div></div>";
        $(this).after($(htmlString));
        return false;
      };
    });
  });
})();

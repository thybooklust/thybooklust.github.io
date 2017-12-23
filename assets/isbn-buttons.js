(function() {
  var isbnLinks = $('a[href*="#ISBN"]');
  var amazonGeoData = {
    "IN": {
      "domain": "amazon.in",
      "tag": "thybooklust-21"
    },
    "GLOBAL": {
      "domain": "amazon.com",
      "tag": "thybooklust-20"
    }
  };

  var getCookie = function(name) {
    match = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (match) return match[1];
  }

  var setCountryCookie = function(country, days) {

    Date.prototype.addDays = function(days) {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    }
    cDate = new Date();
    document.cookie = "country=" + country + "; " + "expires=" + cDate.addDays(days) + "; path=/";
  }

  var getIpData = function(callback) {
    var httpRequest;

    var ipCallBack = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          response = JSON.parse(httpRequest.responseText);
          setCountryCookie(response.countryCode, 2);
          callback(response);
        }
      }
    }
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = ipCallBack;
    httpRequest.open('GET', 'https://ip-api.com/json', true);
    httpRequest.send();
  }

  var getCountry = function(callback) {
    var country;
    if (getCookie('country')) {
      country = getCookie('country');
    } else {
      getIpData(function(data) {
        country = data.countryCode;
        console.log(data);
      });
    }
    if (!amazonGeoData.hasOwnProperty(country)) {
      country = "GLOBAL";
      console.log('got globy');
    }
    callback(country);
  }

  var amazonGeoLinker = function(isbn, callback) {
    getCountry(function(country) {
      country = amazonGeoData[country];
      link = "//" + country.domain + "/dp/" + isbn + "?tag=" + country.tag;
      callback(link);
    });
  }

  function mainThing(isbn) {
    $(document).ready(function() {
      amazonGeoLinker(isbn, function(link) {
        $("a#amazon-link").attr("href", link);
      });
      $("a#goodreads-link").attr("href", "https://www.goodreads.com/search?q=" + isbn + "#other_reviews");
      $("#target-content").show();
    });
  }
  isbnLinks.click(function() {
    var isbn = $(this)[0].href.substring($(this)[0].href.indexOf("#ISBN") + 5);
    mainThing(isbn);
  });

  $("#cancel-button").click(function() {
    $("#target-content").hide();
  });
})();

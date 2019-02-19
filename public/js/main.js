"use strict";

(function ($) {
  $(document).ready(function () {
    // Pagetop
    var pageTop = $('.page-top');
    $(window).scroll(function () {
      if ($(this).scrollTop() > 120) {
        pageTop.fadeIn();
      } else {
        pageTop.fadeOut();
      }
    });
    pageTop.click(function () {
      $('body, html').animate({
        scrollTop: 0
      }, 480);
      return false;
    }); // Open links by tab

    $(function () {
      $("a[href^='http']:not([href*='".concat(location.hostname, "'])")).attr('target', '_blank');
    });
  });
})(jQuery);
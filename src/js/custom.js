($ => {

  $(document).ready(() => {

    // Pagetop
    const pageTop = $('.page-top');
    pageTop.hide();
    $(window).scroll(function () {
      if ($(this).scrollTop() > 256) {
        pageTop.fadeIn();
      } else {
        pageTop.fadeOut();
      }
    });
    pageTop.click(() => {
      $('body, html').animate({
        scrollTop: 0
      }, 480);
      return false;
    });

    // Open links by tab
    $(() => {
      $(`a[href^='http']:not([href*='${location.hostname}'])`).attr('target', '_blank');
    });

  });

})(jQuery);
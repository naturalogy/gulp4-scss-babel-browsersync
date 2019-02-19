($ => {

  $(document).ready(() => {

    // Pagetop
    const pageTop = $('.page-top');
    $(window).scroll(function () {
      if ($(this).scrollTop() > 120) {
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

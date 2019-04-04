$(document).ready(function(){
  $('.owl-carousel').owlCarousel({
    items: 1,
    loop: true,
    center: true,
    margin: 40,
    stagePadding: 15,
    dotClass: true,
    itemsDesktop : true,
    itemsDesktopSmall : true,
    itemsTablet: true,
    itemsMobile : true,
    responsiveClass:true,
  });
});

$(".intro__scroll-down").click(function() {
  $([document.documentElement, document.body]).animate({
      scrollTop: $(".services").offset().top
  }, 1500);
});
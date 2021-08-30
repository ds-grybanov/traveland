$(function(){

    $('.offer__slider').slick({
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 5,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: "<button type='button' class='slick-prev pull-left'><i class='fas fa-angle-double-left' aria-hidden='true'></i></button>",
        nextArrow: "<button type='button' class='slick-next pull-right'><i class='fas fa-angle-double-right' aria-hidden='true'></i></button>",
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 1084,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
              arrows: false
            }
          },
          {
            breakpoint: 692,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              arrows: false,
              dots: false
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false,
              dots: false
            }
          }
        ]
      });

    });

$(document).ready(function(){
      $('.header__burger').click(function(event){
        $('.header__burger, .header__menu, .railtrips__inner-text').toggleClass('active');
        $('body').toggleClass('lock');
      });
});

$('.btn__show-more').on('click', function() {
      $('.articles__inner-left').toggle();
      $(this).text() === 'Show more' ? $(this).text('Show less') : $(this).text('Show more');
});
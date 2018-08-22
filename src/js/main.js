$(function() {
  'use strict';

  $('.filter--menu .filter__title').on('click', function(event) {
    event.preventDefault();
    $(this).parent().toggleClass('open');
  });
});

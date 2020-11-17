
function main() {

(function () {
   'use strict';

  $('body').scrollspy({ 
      target: '.navbar-default',
      offset: 80
  });

  // Hide nav on click
  $(document).ready(function(e) { 
    $(".navbar-nav li a").click(function (event) {
      // check if window is small enough so dropdown is created
      var toggle = $(".navbar-toggle").is(":visible");
      if (toggle) {
        $(".navbar-collapse").collapse('hide');
      }
    });
  });
		
}());


}
main();
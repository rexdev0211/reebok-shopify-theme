// Home page video JS start
// var video = document.getElementById("mp4");
// var delayMillis = 1000;
// var spinnerIsHere = 1;
// //video.volume = 0;

// var playVid = setTimeout(function() {
//   if(spinnerIsHere == 1) {
//     // Delete element DOM
//     // spinner.parentNode.removeChild(spinner);
//     //spinner.style.visibility = "hidden";
//     //spinnerIsHere = 0;
//   }
//   video.play();
// }, delayMillis);

// video.addEventListener("click", function( event ) {
//   if(video.paused) {
//     if(spinnerIsHere == 1) {
//       // Delete element DOM
//       // spinner.parentNode.removeChild(spinner);
//       spinner.style.visibility = "hidden";
//       spinnerIsHere = 0;
//     }
//     clearTimeout(playVid);
//     video.play();
//   } else {
//     video.pause();
//     if(spinnerIsHere == 0) {
//       spinner.style.visibility = "visible";
//       spinnerIsHere = 1;
//     }
//   }
// }, false);
// Home video js end
// menu hover script start
$("ul.list-menu.list-menu--inline li").mouseenter(function() {
    $(this).find("details").attr("open","open");
    $(this).find(".header__submenu").show();
});
$("ul.list-menu.list-menu--inline li").mouseleave(function() {

    $(this).find(".header__submenu").hide();
});
// menu hover script end

function myFunction() {
  var x = document.getElementById("myCheck").required;
  document.getElementById("demo").innerHTML = x;
}


 $('input#phone').click(function(){
$('#contact_form').css("display", "block");
   $(this).hide();
});


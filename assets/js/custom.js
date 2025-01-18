// Change navbar background color on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const targetSection = document.querySelector("#hero");
  const homeBottom = targetSection.offsetTop + targetSection.offsetHeight; // Bottom position of #home section

  if (window.scrollY > homeBottom) {
    navbar.classList.add("navbar-solid");
  } else {
    navbar.classList.remove("navbar-solid");
  }
});

/* Javascript to show and hide cookie banner using localstorage */
/* Shows the Cookie banner */
function showCookieBanner(){
  let cookieBanner = document.getElementById("cb-cookie-banner");
  cookieBanner.style.display = "block";
 }
 
 /* Hides the Cookie banner and saves the value to localstorage */
 function hideCookieBanner(){
  localStorage.setItem("cb_isCookieAccepted", "yes");
  let cookieBanner = document.getElementById("cb-cookie-banner");
  cookieBanner.style.display = "none";
 }
 
 /* Checks the localstorage and shows Cookie banner based on it. */
 function initializeCookieBanner(){
  let isCookieAccepted = localStorage.getItem("cb_isCookieAccepted");
  if(isCookieAccepted === null)
  {
   localStorage.setItem("cb_isCookieAccepted", "no");
   showCookieBanner();
  }
  if(isCookieAccepted === "no"){
   showCookieBanner();
  }
 }
 
 // Assigning values to window object
 window.onload = initializeCookieBanner();
 window.cb_hideCookieBanner = hideCookieBanner;
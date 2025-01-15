window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const targetSection = document.querySelector('#hero');
    const homeBottom = targetSection.offsetTop + targetSection.offsetHeight; // Bottom position of #home section
  
    if (window.scrollY > homeBottom) {
      navbar.classList.add('navbar-solid');
    } else {
      navbar.classList.remove('navbar-solid');
    }
  });
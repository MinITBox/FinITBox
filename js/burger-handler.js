// Burger handler
(function () {
	const burgerItem = document.querySelector('.burger');
	const menu = document.querySelector('.header-menu');
	const menuCloseItem = document.querySelector('.header-menu__close');
	const menuLinks = document.querySelectorAll('.header-menu__link');

	burgerItem.addEventListener('click', () => {
		menu.classList.add('header-menu--active');
	});

	menuCloseItem.addEventListener('click', () => {
		menu.classList.remove('header-menu--active');
	});

	if (window.innerWidth <= 767) {
		for (let i = 0; i < menuLinks.length; i += 1) {
			menuLinks[i].addEventListener('click', () => {
				menu.classList.remove('header-menu--active');
			});
		}
	}
})();

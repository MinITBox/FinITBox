'use strict';

(function () {
	const header = document.querySelector('.header');
	window.onscroll = () => {
		if (window.scrollY > 30) {
			header.classList.add('header--scroll');
		} else {
			header.classList.remove('header--scroll');
		}
	};
})();

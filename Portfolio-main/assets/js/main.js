/***************************************************
==================== JS INDEX ======================
****************************************************
// Data js
// Sidebar Navigation
// Sticky Header
// Hamburger Menu
// Scroll To Section
// OnePage Active Class
// Portfolio Filter
// Portfolio Gallery Carousel
// Testimonial Carousel
// Nice Select
// ALL Popup
// Sidebar Hover BG Color
// Services Hover BG
// Portfolio Filter BG Color
// Funfact
// WoW Js
****************************************************/
(function ($) {
	"use strict";
	/*------------------------------------------------------
  /  Data js
  /------------------------------------------------------*/
	$("[data-bg-image]").each(function () {
		$(this).css(
			"background-image",
			"url(" + $(this).attr("data-bg-image") + ")"
		);
	});
	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});
	$(document).ready(function ($) {
		/*------------------------------------------------------
  	/  Sticky Header
  	/------------------------------------------------------*/
	var lastScrollTop = 0;
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();
		if (scroll > 300) {
			$(".tj-header-area.header-sticky").addClass("sticky");
			$(".tj-header-area.header-sticky").removeClass("sticky-out");
		} else if (scroll < lastScrollTop) {
			if (scroll < 500) {
				$(".tj-header-area.header-sticky").addClass("sticky-out");
				$(".tj-header-area.header-sticky").removeClass("sticky");
			}
		} else {
			$(".tj-header-area.header-sticky").removeClass("sticky");
		}
		lastScrollTop = scroll;
	});
		/*------------------------------------------------------
  	/  Hamburger Menu
  	/------------------------------------------------------*/
		$(".menu-bar").on("click", function () {
			$(".menu-bar").toggleClass("menu-bar-toggeled");
			$(".header-menu").toggleClass("opened");
			$("body").toggleClass("overflow-hidden");
		});
		$(".header-menu ul li a").on("click", function () {
			$(".menu-bar").removeClass("menu-bar-toggeled");
			$(".header-menu").removeClass("opened");
			$("body").removeClass("overflow-hidden");
		});
		/*------------------------------------------------------
  	/  OnePage Active Class
  	/------------------------------------------------------*/
		function onPageNav(switchName) {
			const navSwitch = $(switchName);
			const deductHeight = 60;
			let navArr = [];
			navSwitch.each(function (i) {
				let navSwitchHref = $(this).attr("href");
				let tgtOff = $(navSwitchHref).offset().top - deductHeight;
				navArr.push([]);
				navArr[i].switch = $(this);
				navArr[i].tgtOff = tgtOff;
			});
			//        console.log(navArr);
			$(window).scroll(function () {
				for (let i = 0; i < navArr.length; i++) {
					let scroll = $(window).scrollTop();
					let tgtKey = navArr[i];
					let tgtSwitch = tgtKey.switch;
					let tgtOff = tgtKey.tgtOff;
					if (scroll >= tgtOff) {
						navSwitch.parent().removeClass("is-current");
						tgtSwitch.parent().addClass("is-current");
					} else {
						tgtSwitch.parent().removeClass("is-current");
					}
				}
			});
		}
		$(window).on("load resize", function () {
			onPageNav(".side-navbar a");
		});
		$(".header-menu nav ul").onePageNav({
			currentClass: "current-menu-ancestor",
			changeHash: false,
			easing: "swing",
		});
		/*------------------------------------------------------
  	/  Portfolio Filter avec Multiselection
  	/------------------------------------------------------*/
		const $grid = $('.projects-grid').isotope({
			itemSelector: '.project-item',
			layoutMode: 'masonry',
			masonry: {
				columnWidth: '.project-item',
				gutter: 30
			}
		});
		// Gestion des filtres
		$('.filter-button-group').on('click', 'button', function() {
			const $this = $(this);
			const isAll = $this.data('filter') === '*';
			$this.toggleClass('tj-active-filter');
			if(isAll) {
				$('.filter-button-group button').not(this).removeClass('tj-active-filter');
			} else {
				$('.filter-button-group button[data-filter="*"]').removeClass('tj-active-filter');
			}
			const filters = [];
			$('.tj-active-filter').each(function() {
				filters.push($(this).data('filter').replace(' ', '.'));
			});
			if(filters.length === 0) {
				$('.filter-button-group button[data-filter="*"]').addClass('tj-active-filter');
				filters.push('*');
			}
			const filterValue = filters.length ? filters.join(', ') : '*';
			$grid.isotope({ filter: filterValue });
		});
		// Réinitialisation après chargement
		$(window).on('load', function() {
			$grid.isotope('layout');
		});
		/*------------------------------------------------------
  	/  ALL Popup
  	/------------------------------------------------------*/
		const unlockScroll = () => {
			const doc = document.documentElement;
			doc.style.removeProperty('overflow');
			document.body.style.removeProperty('overflow');
			document.body.style.removeProperty('margin-right');
			document.body.classList.remove('mfp-helper');
			document.body.classList.remove('modal-image-open');
			requestAnimationFrame(() => {
				doc.style.removeProperty('overflow');
				document.body.style.removeProperty('overflow');
				document.body.style.removeProperty('margin-right');
				document.body.classList.remove('modal-image-open');
			});
		};
		const modalImageViewer = (() => {
			let viewer;
			let viewerImage;
			let viewerCaption;
			const closeViewer = () => {
				if (!viewer || !viewer.classList.contains('is-active')) {
					return;
				}
				viewer.classList.remove('is-active');
				viewer.setAttribute('aria-hidden', 'true');
				document.body.classList.remove('modal-image-open');
			};
			const ensureViewer = () => {
				if (viewer) {
					return viewer;
				}
				viewer = document.createElement('div');
				viewer.className = 'modal-image-viewer';
				viewer.setAttribute('aria-hidden', 'true');
				viewer.innerHTML = `
					<div class="modal-image-viewer__backdrop"></div>
					<div class="modal-image-viewer__content" role="dialog" aria-modal="true">
						<button class="modal-image-viewer__close" type="button" aria-label="Fermer l'image"></button>
						<img class="modal-image-viewer__img" src="" alt="" />
						<p class="modal-image-viewer__caption"></p>
					</div>
				`;
				document.body.appendChild(viewer);
				viewerImage = viewer.querySelector('.modal-image-viewer__img');
				viewerCaption = viewer.querySelector('.modal-image-viewer__caption');
				const closeButton = viewer.querySelector('.modal-image-viewer__close');
				const handleClose = (event) => {
					event.preventDefault();
					closeViewer();
				};
				viewer.addEventListener('click', (event) => {
					if (event.target === viewer || event.target.classList.contains('modal-image-viewer__backdrop')) {
						event.preventDefault();
						closeViewer();
					}
				});
				closeButton.addEventListener('click', handleClose);
				document.addEventListener('keydown', (event) => {
					if (event.key === 'Escape' && viewer.classList.contains('is-active')) {
						closeViewer();
					}
				});
				viewer.addEventListener('transitionend', (event) => {
					if (event.propertyName === 'opacity' && !viewer.classList.contains('is-active')) {
						viewerImage.src = '';
						viewerCaption.textContent = '';
					}
				});
				return viewer;
			};
			const openViewer = (src, altText) => {
				const target = ensureViewer();
				viewerImage.src = src;
				viewerImage.alt = altText || '';
				viewerCaption.textContent = altText || '';
				target.classList.add('is-active');
				target.setAttribute('aria-hidden', 'false');
				document.body.classList.add('modal-image-open');
			};
			return {
				open: openViewer,
				close: closeViewer
			};
		})();
		document.querySelectorAll('.modal-gallery-item').forEach((item) => {
			const img = item.querySelector('img');
			if (!img) {
				return;
			}
			item.addEventListener('click', (event) => {
				event.preventDefault();
				modalImageViewer.open(img.src, img.alt);
			});
		});
		$(".project-card").magnificPopup({
			type: "inline",
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: "auto",
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			callbacks: {
				beforeOpen: function() {
					$.magnificPopup.close();
				},
				open: function() {
					// Animation au scroll
					$('.modal-gallery-item').each(function(i) {
						$(this).delay(i * 150).animate({
							opacity: 1,
							transform: 'translateY(0)'
						}, 400);
					});
				},
				beforeClose: function() {
					modalImageViewer.close();
					const mfp = $.magnificPopup.instance;
					if (mfp && mfp.wrap) {
						mfp.wrap.css('pointer-events', 'none');
					}
					unlockScroll();
				},
				close: function() {
					unlockScroll();
					modalImageViewer.close();
					const mfp = $.magnificPopup.instance;
					if (mfp && mfp.wrap) {
						mfp.wrap.css('pointer-events', '');
					}
				}
			}
		});
	});
	$(window).on("load", function () {
		/*------------------------------------------------------
  	/  WoW Js
  	/------------------------------------------------------*/
		var wow = new WOW({
			boxClass: "wow", // default
			animateClass: "animated", // default
			offset: 100, // default
			mobile: true, // default
			live: true, // default
		});
		wow.init();
	});
	document.addEventListener("DOMContentLoaded", function() {
		const progressBars = document.querySelectorAll('.progress-bar');
		progressBars.forEach(bar => {
			const width = bar.getAttribute('aria-valuenow') + '%';
			bar.style.setProperty('--progress-width', width);
		});
	});
	// Header Sticky
	const header = document.querySelector('.tj-header-area.header-2');
	let lastScroll = 0;
	window.addEventListener('scroll', () => {
		const currentScroll = window.scrollY;
		if (currentScroll > lastScroll && currentScroll > 50) {
			// Scrolling down
			header.classList.add('sticky');
		} else if (currentScroll < lastScroll && currentScroll <= 50) {
			// Scrolling up and at top
			header.classList.remove('sticky');
		}
		lastScroll = currentScroll;
	});
	document.addEventListener('DOMContentLoaded', function() {
		const competenceCards = document.querySelectorAll('.competence-card');
		// Animation à l'apparition des cartes
		function animateCards() {
			competenceCards.forEach((card, index) => {
				requestAnimationFrame(() => {
					setTimeout(() => {
						card.style.opacity = '1';
						card.style.transform = 'scale(0.95)';
					}, index * 100);
				});
			});
		}
		// Initialisation des cartes
		competenceCards.forEach(card => {
			card.style.opacity = '0';
			card.style.transform = 'scale(0.9)';
		});
		// Déclenche l'animation initiale
		setTimeout(animateCards, 300);
	});
})(jQuery);
const parseCompetenceList = (value = '') => value
	.split(',')
	.map(item => item.trim().toLowerCase())
	.filter(Boolean);

function handleCompetenceClick(e) {
	e.preventDefault();
	e.stopPropagation();
	const competencesAttr = e.currentTarget.dataset.competences;
	if (!competencesAttr) {
		console.error("Missing data-competences attribute.");
		return;
	}
	const competenceSet = new Set(parseCompetenceList(competencesAttr));
	if (!competenceSet.size) {
		return;
	}
	const section = document.getElementById('competences-section');
	if (!section) {
		console.error("Section 'competences-section' not found.");
		return;
	}
	section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	document.querySelectorAll('.competence-card').forEach(card => {
		const title = card.querySelector('.competence-title')?.innerText.trim().toLowerCase() || '';
		card.classList.toggle('active', competenceSet.has(title));
	});
	document.querySelectorAll('.project-card').forEach(projectCard => {
		const projectCompetencesAttr = projectCard.dataset.competences;
		const source = projectCompetencesAttr ? projectCompetencesAttr : Array.from(projectCard.querySelectorAll('.competence-tag')).map(tag => tag.innerText);
		const projectCompetences = Array.isArray(source) ? source.map(item => item.trim().toLowerCase()).filter(Boolean) : parseCompetenceList(source);
		const isActive = projectCompetences.some(label => competenceSet.has(label));
		projectCard.classList.toggle('active', isActive);
	});
	setTimeout(() => {
		document.querySelectorAll('.competence-card.active, .project-card.active').forEach(card => {
			card.style.transform = 'translateY(0)';
			card.style.opacity = '1';
		});
	}, 500);
}

function filterProjects(element) {
	// Récupère le filtre depuis l'attribut data-filter
	const filter = element.getAttribute('data-filter');
	// Active le filtre correspondant
	const filterButton = document.querySelector(`.filter-button-group button[data-filter="${filter}"]`);
	if (filterButton) {
		filterButton.click();
	}
	// Scroll vers la section projets
	document.querySelector('#projects-section').scrollIntoView({
		behavior: 'smooth'
	});
}

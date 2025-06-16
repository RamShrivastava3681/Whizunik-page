const modalToggles = document.querySelectorAll('[data-modal-toggle]');
const modalHides = document.querySelectorAll('[data-modal-hide]');
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'modal-active');
    modal.querySelector('.modal-content').classList.remove('scale-95');
    modal.querySelector('.modal-content').classList.add('scale-100');
    document.body.classList.add('overflow-hidden'); // Prevent background scroll
  }
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden', 'opacity-0');
    modal.classList.remove('opacity-100', 'modal-active');
    modal.querySelector('.modal-content').classList.add('scale-95');
    modal.querySelector('.modal-content').classList.remove('scale-100');
    setTimeout(() => { // Wait for transition before removing pointer-events
      modal.classList.add('pointer-events-none');
    }, 300);
    document.body.classList.remove('overflow-hidden');
    // Reset form if it exists
    const form = modal.querySelector('form');
    if (form) {
      form.reset();
      modal.querySelector('#formFields').classList.remove('hidden');
      modal.querySelector('#formSuccessMessage').classList.add('hidden');
    }
  }
}
modalToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const modalId = toggle.getAttribute('data-modal-toggle');
    openModal(modalId);
  });
});
modalHides.forEach(hide => {
  hide.addEventListener('click', () => {
    const modalId = hide.getAttribute('data-modal-hide');
    closeModal(modalId);
  });
});
// Close modal on escape key
document.addEventListener('keydown', (event) => {
if (event.key === 'Escape') {
const activeModal = document.querySelector('.modal.opacity-100');
if (activeModal) {
closeModal(activeModal.id);
}
}
});
// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
modal.addEventListener('click', (event) => {
if (event.target === modal) { // Check if the click is on the backdrop itself
closeModal(modal.id);
}
});
});
// --- Get Started Form Submission ---
const getStartedForm = document.getElementById('getStartedForm');
const formFieldsDiv = document.getElementById('formFields');
const formSuccessMessageDiv = document.getElementById('formSuccessMessage');
if (getStartedForm) {
getStartedForm.addEventListener('submit', async function(event) {
event.preventDefault(); // Prevent actual form submission
const formData = new FormData(this);
const clientData = {};
formData.forEach((value, key) => {
clientData[key] = value;
});
try {
  const response = await fetch('http://localhost:5000/api/index', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData)
  });
  if (response.ok) {
    if (formFieldsDiv && formSuccessMessageDiv) {
      formFieldsDiv.classList.add('hidden');
      formSuccessMessageDiv.classList.remove('hidden');
    }
  } else {
    alert('Failed to submit form.');
  }
} catch (error) {
  alert('Error submitting form.');
}
});
}
// --- Mobile menu toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const openIcon = mobileMenuButton.querySelectorAll('svg')[0];
const closeIcon = mobileMenuButton.querySelectorAll('svg')[1];
const navbar = document.getElementById('navbar');
const navbarContainer = document.getElementById('navbar-container');
const navLinks = navbar.querySelectorAll('.nav-link'); // For desktop
const mobileNavLinks = mobileMenu.querySelectorAll('a'); // For mobile
mobileMenuButton.addEventListener('click', () => {
const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
mobileMenuButton.setAttribute('aria-expanded', !expanded);
mobileMenu.classList.toggle('hidden');
openIcon.classList.toggle('hidden');
openIcon.classList.toggle('block');
closeIcon.classList.toggle('hidden');
closeIcon.classList.toggle('block');
});
mobileNavLinks.forEach(link => {
link.addEventListener('click', () => {
if (!mobileMenu.classList.contains('hidden')) {
mobileMenuButton.click();
}
});
});
// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const targetId = this.getAttribute('href');
const targetElement = document.querySelector(targetId);
if (targetElement) {
let offset = navbar.offsetHeight;
if (targetId === '#home') {
offset = 0;
}
const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
const offsetPosition = elementPosition - offset;
window.scrollTo({
top: offsetPosition,
behavior: 'smooth'
});
}
});
});
// --- Navbar style change on scroll ---
window.onscroll = function() {
if (window.pageYOffset > 50) {
navbar.classList.add('navbar-scrolled');
navbar.classList.remove('bg-white/0', 'md:bg-transparent', 'md:backdrop-blur-none', 'shadow-none', 'md:shadow-none');
navbarContainer.classList.replace('h-20', 'h-16');
navLinks.forEach(link => {
link.classList.remove('text-gray-200', 'md:text-white', 'hover:text-sky-300');
link.classList.add('text-gray-700', 'hover:text-blue-600');
});
mobileMenuButton.classList.remove('text-gray-300', 'hover:text-white');
mobileMenuButton.classList.add('text-gray-600', 'hover:text-blue-600');
} else {
navbar.classList.remove('navbar-scrolled');
navbar.classList.add('bg-white/0', 'md:bg-transparent', 'md:backdrop-blur-none', 'shadow-none', 'md:shadow-none');
navbarContainer.classList.replace('h-16', 'h-20');
navLinks.forEach(link => {
link.classList.remove('text-gray-700', 'hover:text-blue-600');
link.classList.add('text-gray-200', 'md:text-white', 'hover:text-sky-300');
});
mobileMenuButton.classList.add('text-gray-300', 'hover:text-white');
mobileMenuButton.classList.remove('text-gray-600', 'hover:text-blue-600');
}
handleScrollAnimation();
};
function setInitialNavColors() {
if (window.pageYOffset > 50) {
navLinks.forEach(link => {
link.classList.remove('text-gray-200', 'md:text-white', 'hover:text-sky-300');
link.classList.add('text-gray-700', 'hover:text-blue-600');
});
mobileMenuButton.classList.remove('text-gray-300', 'hover:text-white');
mobileMenuButton.classList.add('text-gray-600', 'hover:text-blue-600');
} else {
navLinks.forEach(link => {
link.classList.remove('text-gray-700', 'hover:text-blue-600');
link.classList.add('text-gray-200', 'md:text-white', 'hover:text-sky-300');
});
mobileMenuButton.classList.add('text-gray-300', 'hover:text-white');
mobileMenuButton.classList.remove('text-gray-600', 'hover:text-blue-600');
}
}
setInitialNavColors();
// --- Scroll animations ---
const scrollElements = document.querySelectorAll('.scroll-animation');
const elementInView = (el, dividend = 1) => {
const elementTop = el.getBoundingClientRect().top;
return (
elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
);
};
const displayScrollElement = (element) => {
element.classList.add('visible');
};
const handleScrollAnimation = () => {
scrollElements.forEach((el) => {
if (elementInView(el, 1.15)) {
displayScrollElement(el);
}
});
};
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation();

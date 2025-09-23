// Dark Mode Toggle
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement; // <html> element

darkToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  darkToggle.textContent = html.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Load saved theme on page load
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    darkToggle.textContent = '☀️';
  }
});
// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Category Menu Toggle
const categoryBtn = document.getElementById('categoryBtn');
const categoryMenu = document.getElementById('categoryMenu');
const arrow = document.getElementById('arrow');

categoryBtn.addEventListener('click', () => {
  categoryMenu.classList.toggle('hidden');
  arrow.textContent = categoryMenu.classList.contains('hidden') ? '▼' : '▲';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    mobileMenu.classList.add('hidden');
  }
  if (!categoryMenu.contains(event.target) && !categoryBtn.contains(event.target)) {
    categoryMenu.classList.add('hidden');
    arrow.textContent = '▼';
  }
});
const products = ['Nokia 5310', 'Nokia 3210', 'Nokia 3310', 'Nokia 2720 Flip', 'Samsung Guru Music 2'];
const searchInput = document.getElementById('searchInput');
const suggestionBox = document.getElementById('suggestionBox');
const noResult = document.getElementById('noResult');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  suggestionBox.innerHTML = '';
  noResult.classList.add('hidden');

  if (query) {
    const filtered = products.filter(product => product.toLowerCase().includes(query));
    if (filtered.length > 0) {
      filtered.forEach(product => {
        const li = document.createElement('li');
        li.textContent = product;
        li.addEventListener('click', () => {
          searchInput.value = product;
          suggestionBox.classList.add('hidden');
        });
        suggestionBox.appendChild(li);
      });
      suggestionBox.classList.remove('hidden');
    } else {
      noResult.classList.remove('hidden');
    }
  }
});

document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target)) {
    suggestionBox.classList.add('hidden');
    noResult.classList.add('hidden');
  }
});
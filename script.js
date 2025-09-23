const App = {
  // -------------------------------
  // Configuration
  config: {
    basePrice: 1899,       // 👉 Base price of a single unit
    maxQuantity: 10,       // 👉 Maximum allowed quantity
    formspreeUrl: "https://formspree.io/f/mvgbjeoe" // 👉 Formspree endpoint
  },

  // -------------------------------
  // Quantities per color
  quantities: { black: 1, blue: 1, white: 1, darkblue: 1 },

  selectedProduct: 'black',  // 👉 Default selected product
  isSubmitting: false,       // 👉 Prevent multiple submissions

  // -------------------------------
  // Initialize App
  init() {
    // 🟢 Stock availability per color
    this.stock = {
      black: true,      // ✅ Updated to true for demo, adjust as needed
      blue: true,
      white: true,
      darkblue: true
    };

    // ❌ Disable unavailable products
    Object.keys(this.stock).forEach(color => {
      const productEl = document.getElementById(`product-${color}`);
      const radioEl = document.getElementById(`radio-${color}`);
      const qtyBox = document.getElementById(`qty-${color}-box`);

      if (!this.stock[color]) {
        productEl.classList.add('disabled');
        if (radioEl) radioEl.disabled = true;
        if (qtyBox) qtyBox.classList.add('hidden'); // Use class instead of inline style
      }
    });

    // Bind event listeners
    this.bindEvents();

    // Select first available product
    const firstAvailable = Object.keys(this.stock).find(c => this.stock[c]) || 'black';
    this.selectProduct(firstAvailable);

    // Setup back-to-top button
    this.setupBackToTop();

    // Start countdown timer
    this.startCountdown();

    // Initial totals update
    this.updateTotals();
  },

  // -------------------------------
  // Bind Event Listeners
  bindEvents() {
    // -------------------------------
    // Form submission
    const form = document.getElementById('order-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!this.isSubmitting && this.validateForm()) {
          this.isSubmitting = true;
          document.querySelector('.spinner').style.display = 'inline';
          this.updateTotals();
          form.submit(); // Submit to Formspree
          setTimeout(() => {
            this.isSubmitting = false;
            document.querySelector('.spinner').style.display = 'none';
          }, 2000); // Simulate submission delay
        }
      });
    }

    // -------------------------------
    // Product selection click
    const container = document.querySelector('.form-container');
    if (container) {
      container.addEventListener('click', (e) => {
        const product = e.target.closest('.product');
        if (!product || product.classList.contains('disabled')) return;
        const color = product.id.split('-')[1];
        if (this.stock[color]) this.selectProduct(color);
      });

      // Keyboard support for product selection
      container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const product = e.target.closest('.product');
          if (product && !product.classList.contains('disabled')) {
            e.preventDefault();
            const color = product.id.split('-')[1];
            if (this.stock[color]) this.selectProduct(color);
          }
        }
      });
    }

    // -------------------------------
    // Quantity buttons (+/-)
    document.querySelectorAll('.quantity button').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.id.split('-')[2];
        const delta = btn.id.includes('minus') ? -1 : 1;
        if (color === this.selectedProduct && !this.isSubmitting) {
          this.changeQty(color, delta);
        }
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  },

  // -------------------------------
  // Select Product
  selectProduct(color) {
    if (!this.stock[color] || this.isSubmitting) return;
    this.selectedProduct = color;

    ['black', 'blue', 'white', 'darkblue'].forEach(c => {
      const productEl = document.getElementById(`product-${c}`);
      const radioEl = document.getElementById(`radio-${c}`);
      const qtyBox = document.getElementById(`qty-${c}-box`);

      if (radioEl && !radioEl.disabled) radioEl.checked = c === color;
      if (qtyBox) qtyBox.classList.toggle('active', c === color);
      if (productEl) {
        productEl.classList.toggle('selected', c === color);
        productEl.setAttribute('aria-checked', c === color);
      }
    });

    this.updateTotals();
  },

  // -------------------------------
  // Change Quantity
  changeQty(color, delta) {
    if (this.isSubmitting) return;
    const newQty = this.quantities[color] + delta;

    if (newQty < 1 || newQty > this.config.maxQuantity) {
      const message = newQty < 1 ? 'পরিমাণ ১ এর কম হতে পারে না' : `পরিমাণ ${this.config.maxQuantity} এর বেশি হতে পারে না`;
      alert(message);
      return;
    }

    this.quantities[color] = newQty;
    document.getElementById(`qty-${color}`).value = newQty;
    this.updateTotals();
  },

  // -------------------------------
  // Update totals
  updateTotals() {
    const subtotal = this.config.basePrice * this.quantities[this.selectedProduct];
    document.getElementById('subtotal').textContent = `৳${subtotal.toLocaleString('bn-BD')}`;
    document.getElementById('total').textContent = `৳${subtotal.toLocaleString('bn-BD')}`;
    document.getElementById('hiddenSubtotal').value = subtotal;
    document.getElementById('hiddenTotal').value = subtotal;
    document.getElementById('hiddenProduct').value = `${this.selectedProduct.charAt(0).toUpperCase() + this.selectedProduct.slice(1)} Variant`;
    document.getElementById('hiddenQuantity').value = this.quantities[this.selectedProduct];
  },

  // -------------------------------
  // Form Validation
  validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const nameRegex = /^[A-Za-z\s\u0980-\u09FF]+$/;
    const phoneRegex = /^01[3-9][0-9]{8}$/;
    let valid = true;

    document.querySelectorAll('.error').forEach(error => error.style.display = 'none');

    if (!nameRegex.test(name) || name.length === 0) {
      document.getElementById('name-error').style.display = 'block';
      valid = false;
    }
    if (!phoneRegex.test(phone)) {
      document.getElementById('phone-error').style.display = 'block';
      valid = false;
    }
    if (address === '') {
      document.getElementById('address-error').style.display = 'block';
      valid = false;
    }

    return valid;
  },

  // -------------------------------
  // Back to Top button
  setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 1500 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // -------------------------------
  // Countdown Timer (Until midnight today)
  startCountdown() {
    const offerEnd = new Date();
    offerEnd.setHours(23, 59, 59, 999); // End at midnight

    const toBengaliNumber = (num) => {
      const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).split('').map(d => bengaliDigits[d] || d).join('');
    };

    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = offerEnd - now;

      if (distance <= 0) {
        countdownEl.textContent = "⏰ অফার শেষ হয়েছে";
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownEl.textContent = `সময় বাকি: ${toBengaliNumber(hours)} ঘণ্টা ${toBengaliNumber(minutes)} মিনিট ${toBengaliNumber(seconds)} সেকেন্ড`;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();
  }
};

// -------------------------------
// Window Load
window.addEventListener('load', () => App.init());
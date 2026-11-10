const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('.nav-list');
const filters = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');
const form = document.getElementById('booking-form');
const dateInput = document.getElementById('date');
const modal = document.getElementById('success-modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementById('close-modal');

const BOOKINGS_KEY = 'chaithanya-bookings';

menuBtn?.addEventListener('click', () => {
  const open = navList.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

navList?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navList.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.filter;
    projectCards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

const today = new Date();
today.setDate(today.getDate() + 1);
dateInput.min = today.toISOString().split('T')[0];

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(value) {
  const [h, m] = value.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function saveBooking(data) {
  const existing = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  existing.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(existing));
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const booking = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || '',
    company: formData.get('company') || '',
    service: formData.get('service'),
    date: formData.get('date'),
    time: formData.get('time'),
    message: formData.get('message') || '',
  };

  saveBooking(booking);

  const serviceLabel = form.querySelector(`#service option[value="${booking.service}"]`)?.textContent || booking.service;

  modalMessage.textContent = `Hi ${booking.name}, your ${serviceLabel.toLowerCase()} request for ${formatDate(booking.date)} at ${formatTime(booking.time)} has been recorded. We'll email you at ${booking.email} to confirm.`;
  modal.showModal();
  form.reset();
  dateInput.min = today.toISOString().split('T')[0];
});

closeModal?.addEventListener('click', () => modal.close());

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

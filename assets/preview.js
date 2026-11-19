'use strict';

const services = Array.from(document.querySelectorAll('.service__category[data-service]'), (category) => {
  const name = category.dataset.service;
  const panel = document.querySelector('.service__details--' + name);
  const heading = panel.querySelector('h2');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'preview-service-toggle';
  toggle.textContent = heading.textContent.trim();
  heading.append(toggle);

  const details = document.createElement('div');
  details.id = 'service-' + name;
  while (heading.nextSibling) details.append(heading.nextSibling);
  heading.after(details);

  category.setAttribute('role', 'button');
  category.setAttribute('tabindex', '0');
  for (const button of [category, toggle]) button.setAttribute('aria-controls', details.id);
  return { category, panel, toggle, details };
});

function setActiveService(selected) {
  for (const service of services) {
    const active = service === selected;
    service.panel.classList.toggle('expanded', active);
    service.category.classList.toggle('expanded', active);
    service.details.hidden = !active;
    service.category.setAttribute('aria-expanded', String(active));
    service.toggle.setAttribute('aria-expanded', String(active));
  }
}

setActiveService(services.find(({ panel }) => panel.classList.contains('expanded')));
for (const service of services) {
  const change = () => setActiveService(service.panel.classList.contains('expanded') ? null : service);
  service.category.addEventListener('click', change);
  service.toggle.addEventListener('click', change);
  service.category.addEventListener('keydown', (event) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    change();
  });
}

for (const link of document.querySelectorAll('a[data-vc-accordion]')) {
  const toggle = (event) => {
    event.preventDefault();
    const panel = link.closest('.vc_tta-panel');
    const expanded = panel.classList.toggle('vc_active');
    link.setAttribute('aria-expanded', String(expanded));
  };
  link.addEventListener('click', toggle);
  link.addEventListener('keydown', (event) => {
    if (event.key === ' ') toggle(event);
  });
}

const menu = document.getElementById('sidr-main');
const toggleMenu = document.querySelector('.mobile-menu-toggle');
if (menu && toggleMenu) {
  const setMenu = (open) => {
    menu.hidden = !open;
    toggleMenu.setAttribute('aria-expanded', String(open));
  };
  toggleMenu.setAttribute('aria-controls', menu.id);
  toggleMenu.addEventListener('click', (event) => {
    event.preventDefault();
    setMenu(menu.hidden);
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || menu.hidden) return;
    setMenu(false);
    toggleMenu.focus();
  });
}

const presentation = document.getElementById('heads-presentation');
if (presentation) {
  for (const button of document.querySelectorAll('[data-presentation]')) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      presentation.showModal();
    });
  }
  presentation.querySelector('.heads-dialog-close')?.addEventListener('click', (event) => {
    event.preventDefault();
    presentation.close();
  });
  presentation.addEventListener('click', (event) => {
    if (event.target === presentation) presentation.close();
  });
}

for (const form of document.querySelectorAll('[data-preview-form]')) {
  const checkbox = form.querySelector('input[type="checkbox"][required]');
  const submit = form.querySelector('[type="submit"]');
  if (checkbox && submit) {
    const updateSubmit = () => { submit.disabled = !checkbox.checked; };
    checkbox.addEventListener('change', updateSubmit);
    updateSubmit();
  }
  const upload = form.querySelector('input[type="file"]');
  upload?.addEventListener('change', () => {
    upload.setCustomValidity(upload.files[0]?.size > 10 * 1024 * 1024 ? 'Максимум 10 МБ' : '');
    upload.reportValidity();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let result = form.querySelector('[data-preview-result]');
    if (!result) {
      result = document.createElement('p');
      result.dataset.previewResult = '';
      result.setAttribute('role', 'status');
      form.append(result);
    }
    result.textContent = 'Демонстрационная форма. Данные остались в браузере.';
    result.hidden = false;
  });
}

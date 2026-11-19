const mobileContents = document.querySelector('.toc-mobile');
const tocLinks = [...document.querySelectorAll('.toc-desktop a')].map((link) => [
  link,
  mobileContents.querySelector(`a[href="${link.hash}"]`),
]);
const sections = tocLinks.map(([link]) => document.getElementById(link.hash.slice(1)));
const header = document.querySelector('.site-header');
let framePending = false;
let activeIndex = -1;

function updateContents() {
  const readingLine = header.getBoundingClientRect().bottom + 110;
  const index = sections.findLastIndex((section) => section.getBoundingClientRect().top < readingLine);
  if (activeIndex !== index) {
    tocLinks[activeIndex]?.forEach((link) => link?.removeAttribute('aria-current'));
    tocLinks[index]?.forEach((link) => link?.setAttribute('aria-current', 'location'));
    activeIndex = index;
  }
  framePending = false;
}

function queueContentsUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateContents);
}

mobileContents.addEventListener('click', (event) => {
  if (event.target.closest('a')) mobileContents.open = false;
});

window.addEventListener('scroll', queueContentsUpdate, { passive: true });
window.addEventListener('resize', queueContentsUpdate);
window.addEventListener('load', queueContentsUpdate);
queueContentsUpdate();

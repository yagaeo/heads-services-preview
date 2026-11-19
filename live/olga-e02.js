const tocLinks = [...document.querySelectorAll('.toc-desktop a')];
const sections = tocLinks.map((link) => document.getElementById(link.hash.slice(1)));
const header = document.querySelector('.site-header');
let framePending = false;
let activeLink = null;

function updateContents() {
  const readingLine = header.getBoundingClientRect().bottom + 110;
  const index = sections.findLastIndex((section) => section.getBoundingClientRect().top < readingLine);
  const nextLink = tocLinks[index];
  if (activeLink !== nextLink) {
    activeLink?.removeAttribute('aria-current');
    nextLink?.setAttribute('aria-current', 'location');
    activeLink = nextLink;
  }
  framePending = false;
}

function queueContentsUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateContents);
}

const mobileContents = document.querySelector('.toc-mobile');
mobileContents.addEventListener('click', (event) => {
  if (event.target.closest('a')) mobileContents.open = false;
});

window.addEventListener('scroll', queueContentsUpdate, { passive: true });
window.addEventListener('resize', queueContentsUpdate);
window.addEventListener('load', queueContentsUpdate);
queueContentsUpdate();

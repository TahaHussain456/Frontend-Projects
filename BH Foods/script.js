// Header Scripts
const toggleBtn = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

// Toggle icon between ☰ and ✖
toggleBtn.addEventListener("click", () => {
    if (mobileMenu.classList.contains("active")) {
        toggleBtn.textContent = "✖";
    } else {
        toggleBtn.textContent = "☰";
    }
});

// Menu Filter Scripts
document.addEventListener('DOMContentLoaded', () => {
const categoryList = document.querySelector('.categories');
if (!categoryList) return;

const buttons = categoryList.querySelectorAll('li[data-filter]');
const cards = document.querySelectorAll('.filter-content .card');

// Auto-detect category from the card title if no explicit class exists
const knownCats = ['pizza', 'burger', 'pasta', 'fries'];
cards.forEach(card => {
    const hasKnownClass = knownCats.some(c => card.classList.contains(c));
    if (!hasKnownClass) {
    const title = (card.querySelector('.card-heading')?.textContent || '').toLowerCase();
    let inferred = '';
    if (title.includes('pizza')) inferred = 'pizza';
    else if (title.includes('burger')) inferred = 'burger';
    else if (title.includes('pasta')) inferred = 'pasta';
    else if (title.includes('fries') || title.includes('french')) inferred = 'fries';
    if (inferred) card.dataset.cat = inferred;
    }
    // Reset any stale states
    card.classList.remove('is-hidden', 'is-fading-out');
    card.style.display = 'flex'; // your cards are flex
    card.style.opacity = ''; card.style.transform = ''; card.style.filter = '';
});

function matchesFilter(card, target) {
    if (target === '*') return true;
    const t = target.startsWith('.') ? target.slice(1) : target;
    return card.classList.contains(t) || card.dataset.cat === t;
}

function showCard(card) {
    if (!card.classList.contains('is-hidden')) return; // already visible
    card.classList.remove('is-hidden');
    card.style.display = 'flex';
    // start faded
    card.style.opacity = '0';
    card.style.transform = 'scale(0.96)';
    // force reflow
    void card.offsetWidth;
    // animate in
    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
    const onEnd = (e) => {
    if (e.propertyName === 'opacity') {
        card.style.opacity = ''; card.style.transform = ''; card.style.filter = '';
        card.removeEventListener('transitionend', onEnd);
    }
    };
    card.addEventListener('transitionend', onEnd);
}

function hideCard(card) {
    if (card.classList.contains('is-hidden')) return;
    card.classList.add('is-fading-out');
    const onEnd = (e) => {
    if (e.propertyName === 'opacity') {
        card.classList.remove('is-fading-out');
        card.classList.add('is-hidden');
        card.style.display = 'none';
        card.style.opacity = ''; card.style.transform = ''; card.style.filter = '';
        card.removeEventListener('transitionend', onEnd);
    }
    };
    card.addEventListener('transitionend', onEnd);
    // trigger fade out
    card.style.opacity = '0';
    card.style.transform = 'scale(0.96)';
}

// Click handling
categoryList.addEventListener('click', (e) => {
    const btn = e.target.closest('li[data-filter]');
    if (!btn) return;

    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterVal = btn.getAttribute('data-filter') || '*';
    // optional: stagger a bit for nicer feel
    let delay = 0;
    cards.forEach((card, i) => {
    const match = matchesFilter(card, filterVal);
    const run = () => match ? showCard(card) : hideCard(card);
    // small stagger only when showing many
    if (match && filterVal !== '*') {
        setTimeout(run, delay);
        delay += 25; // 25ms stagger
    } else {
        run();
    }
    });
});
});

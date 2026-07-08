/* ══════════════════════════════════════════════════════════════

   Índice:
   0.  Tema (Dark / Light Mode) 
   1.  Dados dos Produtos
   2.  Constantes & SVG Placeholder
   3.  Helpers de Imagem
   4.  Estado Global & localStorage
   5.  Utilitários
   6.  Carousel
   7.  Swatch de Cor no Card
   8.  Modal de Produto + Foco Trap
   9.  Carrinho + Foco Trap + localStorage
   10. WhatsApp Checkout
   11. Exportar PDF do Carrinho
   12. Toast
   13. Newsletter
   14. Navegação
   15. Filtro de Categorias
   16. Scroll Reveal & Scrollspy
   17. Inicialização
══════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════
   0. TEMA — DARK / LIGHT MODE'
═══════════════════════════════════════════ */

const THEME_KEY = 'hypewear-theme';

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;

  /* Activa transição CSS apenas durante a troca — remove após 420ms */
  root.classList.add('theme-transitioning');
  clearTimeout(window._themeTransTimer);
  window._themeTransTimer = setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 420);

  root.setAttribute('data-theme', theme);

  /* Troca a logo usando os atributos data-src-light / data-src-dark do HTML */
  const logoImg = document.getElementById('navLogo');
  if (logoImg) {
    const src = theme === 'dark'
      ? (logoImg.dataset.srcDark  || logoImg.dataset.srcLight)
      : (logoImg.dataset.srcLight || logoImg.src);
    if (logoImg.src !== src && !logoImg.src.endsWith(src)) {
      logoImg.style.opacity = '0';
      setTimeout(() => {
        logoImg.src = src;
        logoImg.alt = `Hypewear logo — tema ${theme}`;
        logoImg.style.opacity = '1';
      }, 160);
    }
  }

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.warn('[HYPEWEAR] Não foi possível guardar preferência de tema:', e);
  }

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Activar modo claro' : 'Activar modo escuro'
    );
  }
}

function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/* IIFE — aplica o tema imediatamente, antes do DOM render */
(function initTheme() {
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (_) {}

  const theme = (savedTheme === 'dark' || savedTheme === 'light')
    ? savedTheme
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', theme);

  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo escuro');

  const logoImg = document.getElementById('navLogo');
  if (logoImg && theme === 'dark' && logoImg.dataset.srcDark) {
    logoImg.src = logoImg.dataset.srcDark;
  }

  if (!savedTheme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }
})();

/* Reage a mudanças de preferência do sistema enquanto a página está aberta.
   Só actua se o utilizador não tiver feito uma escolha manual. */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (_) {}
  if (!savedTheme) applyTheme(e.matches ? 'dark' : 'light');
});

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);


/* ═══════════════════════════════════════════
   1. DADOS DOS PRODUTOS
═══════════════════════════════════════════ */
const products = [

  /* ── T-Shirts ────────────────────────── */
  {
    id: 1,
    name: 'T-Shirt Who You Think',
    sub: 'Coleção Essentials',
    price: 1200,
    oldPrice: null,
    tag: 'Novo',
    category: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['preto', 'branco', 'azul'],
    desc: 'Oversized com icone da Hypewear no peito. Costas com Im not who you think I am em bold vermelho. Para quem carrega identidade própria, disponíveis em 3 cores.',
    featured: true,
    folder: 'carrossel'
  },
  {
    id: 2,
    name: 'T-Shirt Hold Me Up',
    sub: 'Drop Studio',
    price: 1200,
    oldPrice: null,
    tag: null,
    category: 'tshirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['azul', 'branco', 'preto'],
    desc: 'Oversized com icon da Hypewear no peito. Costas com When I fail, you hold me up em amarelo — para quem valoriza quem os sustenta, disponíveis em 3 cores.',
    featured: true,
    folder: 'carrossel'
  },
  {
    id: 3,
    name: 'T-Shirt Obsession',
    sub: 'Core Collection',
    price: 1200,
    oldPrice: null,
    tag: 'Novo',
    category: 'tshirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['creme', 'cinza'],
    desc: 'Oversized cinza carvão e creme com ícone . Costas com a citação de Adam Sandler: Obsession wins from talent every time. Para os que não param, disponíveis em 2 cores.',
    featured: false,
    folder: 'carrossel'
  },

  /* ── Hoodies ─────────────────────────── */
  {
    id: 4,
    name: 'Hoodie Sweet Dreams',
    sub: 'Drop Limitado',
    price: 1700,
    oldPrice: null,
    tag: null,
    category: 'hoodies',
    sizes: ['S', 'M', 'L'],
    colors: ['preto', 'branco'],
    desc: 'Oversized com capuz e bolso canguru, com icon da Hypewear  no peito. Costas com gráfico pop art Hypewear Sweet e a frase Dreams in her heart, attitude in her stride, style in every step.',
    featured: true,
    folder: 'carrossel'
  },
  /* ── Ecobags ─────────────────────────── */
  {
    id: 5,
    name: 'Ecobag Sweet',
    sub: 'Acessórios',
    price: 750,
    oldPrice: null,
    tag: 'Novo',
    category: 'ecobags',
    sizes: ['Único'],
    colors: ['azul', 'creme', 'branco'],
    desc: 'Lona resistente, Estampa Hypewear Sweet com arte pop de lábios lilás e rosa. Alças reforçadas. Sustentável e com atitude.',
    featured: true,
    folder: 'carrossel'
  },
    {
    id: 9,
    name: 'Ecobag Sweet Rosa',
    sub: 'Acessórios',
    price: 750,
    oldPrice: null,
    tag: 'Novo',
    category: 'ecobags',
    sizes: ['Único'],
    colors: ['rosa', 'castanho'],
    desc: 'Lona resistente, Estampa Hypewear Sweet com arte pop de lábios lilás e rosa. Alças reforçadas. Sustentável e com atitude.',
    featured: false,
    folder: 'ecobag'
  },
    /* ── Hoodies ─────────────────────────── */
  {
    id: 7,
    name: 'Hoodie Sweet Dreams Pastel',
    sub: 'Drop Studio',
    price: 1700,
    oldPrice: null,
    tag: 'Novo',
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['creme', 'cinza', 'castanho'],
    desc: 'Oversized com capuz e bolso canguru, com icone da Hypewear peito. Costas com gráfico pop art Hypewear Sweet e a frase Dreams in her heart, attitude in her stride, style in every step.',
    featured: false,
    folder: 'hoodie'
  },
  {
    id: 8,
    name: 'Hoodie Hypewear Classic',
    sub: 'Drop Studio',
    price: 1700,
    oldPrice: null,
    tag: 'Novo',
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['cinza', 'preto', 'castanho', 'creme', 'branco'],
    desc: 'Oversized com capuz e bolso canguru. Logótipo HYPEWEAR na frente. Costas com gráfico Hypewear Sweet — forro suave, peso premium.',
    featured: false,
    folder: 'hoodie'
  },
 /* ── Caps ────────────────────────────── */
  {
    id: 6,
    name: 'Cap Signature Oriad',
    sub: 'Headwear',
    price: 900,
    oldPrice: null,
    tag: null,
    category: 'caps',
    sizes: ['Único'],
    colors: ['branco', 'preto'],
    desc: 'Cap estruturadocom logo Hypewear Estampado. Pala com inscrição Not a trend. We are the Oriad. Ajuste traseiro universal, disponíveis 2 cores.',
    featured: true,
    folder: 'carrossel'
  },
    {
    id: 10,
    name: 'Trucker Cap Oriad',
    sub: 'Headwear',
    price: 850,
    oldPrice: null,
    tag: null,
    category: 'caps',
    sizes: ['ajustavel'],
    colors: ['cinza', 'preto', 'castanho'],
    desc: 'Trucker com rede traseira. Logo Hypewear Estampado. Pala com We are the Oriad. Leve, ventilada e com personalidade.',
    featured: false,
    folder: 'hat'
  },
    {
    id: 11,
    name: 'Trucker Cap Oriad Neon',
    sub: 'Headwear',
    price: 850,
    oldPrice: null,
    tag: 'Novo',
    category: 'caps',
    sizes: ['ajustavel'],
    colors: ['ciano', 'verde', 'preto'],
    desc: 'Trucker com rede traseira. Logo Hypewear Estampado. Pala com We are the Oriad. Leve, ventilada e com personalidade.',
    featured: false,
    folder: 'hat'
  },
    {
    id: 12,
    name: 'Trucker Cap Oriad',
    sub: 'Headwear',
    price: 850,
    oldPrice: null,
    tag: null,
    category: 'caps',
    sizes: ['ajustavel'],
    colors: ['rosa'],
    desc: 'Trucker cap branco e rosa com rede traseira. Logo Hypewear Estampado. Pala com We are the Oriad. Leve, ventilada e com personalidade.',
    featured: false,
    folder: 'hat'
  }
];


/* ═══════════════════════════════════════════
   2. CONSTANTES & SVG PLACEHOLDER
   clothIcon — fallback quando a imagem não existe.
   Mantido inline para evitar um pedido HTTP extra.
═══════════════════════════════════════════ */
const clothIcon = `
  <svg viewBox="0 0 100 100" fill="none" stroke="#888" stroke-width="1.2" aria-hidden="true">
    <rect x="30" y="10" width="40" height="10" rx="2"/>
    <path d="M30 20 L10 50 L25 50 L25 90 L75 90 L75 50 L90 50 L70 20"/>
  </svg>`;


/* ═══════════════════════════════════════════
   3. HELPERS DE IMAGEM.
═══════════════════════════════════════════ */

function getProductImage(productId, color) {
  const product = products.find(p => p.id === productId);
  const folder  = (product && product.folder) || 'carrossel';
  return `lib/img/${folder}/nevlek-produto-${productId}-${color}.webp`;
}

/* Pré-carrega todas as imagens em background ao iniciar.
   Evita o efeito "piscar" ao trocar de cor nos cards. */
function preloadImages() {
  /* Pré-carrega apenas cor principal dos produtos visíveis.
     Usa requestIdleCallback para não competir com o render inicial. */
  const visibleIds = new Set();
  products.filter(p => p.featured).forEach(p => visibleIds.add(p.id));
  products.slice(0, 6).forEach(p => visibleIds.add(p.id));

  const preload = () => {
    visibleIds.forEach(id => {
      const p = products.find(x => x.id === id);
      if (!p) return;
      const img = new Image();
      img.src = getProductImage(id, p.colors[0]);
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(preload, { timeout: 2000 });
  } else {
    setTimeout(preload, 400);
  }
}

/* Aplica uma imagem real num elemento <img>.
   Se falhar (onerror), mostra o SVG de fallback. */
function applyImage(imgEl, fallbackEl, productId, color) {
  if (!imgEl) return;

  imgEl.src = getProductImage(productId, color);
  imgEl.style.display = 'block';
  if (fallbackEl) fallbackEl.style.display = 'none';

  imgEl.onerror = function () {
    this.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'flex';
  };
}


/* ═══════════════════════════════════════════
   4. ESTADO GLOBAL & LOCALSTORAGE
═══════════════════════════════════════════ */

const CART_KEY = 'hypewear-cart';

/* Carrega o carrinho guardado ou começa vazio */
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('[HYPEWEAR] Erro ao carregar carrinho:', e);
    return [];
  }
}

/* Guarda o estado actual do carrinho no localStorage */
function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('[HYPEWEAR] Erro ao guardar carrinho:', e);
  }
}

let cart          = loadCart();      /* itens persistidos no localStorage */
let cardColors    = {};              /* cor activa por produto: { [id]: string } */
let modalState    = { productId: null, color: null, size: null };
let selectedSizes = {};             /* tamanho seleccionado na grelha: { [id]: string } */
let currentFilter = 'todos';        /* filtro activo na grelha */


/* ═══════════════════════════════════════════
   5. UTILITÁRIOS
═══════════════════════════════════════════ */

function formatPrice(p) {
  return p.toLocaleString('pt-MZ') + ' MZN';
}

/* Devolve todos os elementos focáveis dentro de um contentor.
   Usado pelo foco trap do modal e do carrinho. */
function getFocusable(container) {
  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter(el => !el.closest('[aria-hidden="true"]'));
}


/* ═══════════════════════════════════════════
   6. CAROUSEL
═══════════════════════════════════════════ */

let carouselIndex  = 0;
let slidesPerView  = 3;
const CAROUSEL_CLONES = 3;
const CAROUSEL_AUTOPLAY_MS = 3000;
let carouselRealLength = 0;
let carouselAutoplayTimer = null;

function getSlidesPerView() {
  const w = window.innerWidth;
  if (w <= 480)  return 1;
  if (w <= 760)  return 2;
  if (w <= 900)  return 2;
  return 3;
}

function renderCarouselSlide(p) {
  const color = cardColors[p.id] || p.colors[0];
  return `
      <div class="carousel-slide" role="group" aria-label="${p.name}">
        <div class="prod-card-v2" data-pid="${p.id}" onclick="openModal(${p.id})">

          <div class="prod-img-v2 bg-${color}">
            ${p.tag ? `<span class="prod-label">${p.tag}</span>` : ''}
            <div class="prod-img-inner">
              <img
                src="${getProductImage(p.id, color)}"
                alt="${p.name} — ${color}"
                loading="lazy"
                style="width:100%;height:100%;object-fit:cover;display:block;"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
              >
              <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">${clothIcon}</span>
            </div>
            <div class="prod-quick">
              <button
                class="prod-quick-btn"
                onclick="event.stopPropagation(); quickAddToCart(${p.id})"
                aria-label="Adicionar ${p.name} ao carrinho"
              >Adicionar ao carrinho</button>
            </div>
          </div>

          <div class="prod-colors" onclick="event.stopPropagation()" role="group" aria-label="Cores de ${p.name}">
            ${p.colors.map(c =>
              `<button
                class="color-swatch${color === c ? ' active' : ''}"
                data-color="${c}"
                title="${c}"
                aria-label="Cor ${c}${color === c ? ' (seleccionada)' : ''}"
                onclick="setCardColor(${p.id},'${c}',this)"
              ></button>`
            ).join('')}
          </div>

          <div class="prod-info-v2">
            <div class="prod-meta-v2">
              <span class="prod-name-v2">${p.name}</span>
              <span class="prod-price-v2">
                ${p.oldPrice ? `<span class="old">${formatPrice(p.oldPrice)}</span>` : ''}
                ${formatPrice(p.price)}
              </span>
            </div>
            <span class="prod-sub-v2">${p.sub}</span>
          </div>

        </div>
      </div>`;
}

function buildCarousel() {
  slidesPerView = getSlidesPerView();
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const featured = products.filter(p => p.featured);
  carouselRealLength = featured.length;

  const head = featured.slice(-CAROUSEL_CLONES);
  const tail = featured.slice(0, CAROUSEL_CLONES);
  const extended = [...head, ...featured, ...tail];

  track.innerHTML = extended.map(renderCarouselSlide).join('');

  buildDots();
  goToSlide(CAROUSEL_CLONES, false);
  startCarouselAutoplay();
}

function buildDots() {
  const dotsEl = document.getElementById('carouselDots');
  if (!dotsEl) return;

  const activeIdx = ((carouselIndex - CAROUSEL_CLONES) % carouselRealLength + carouselRealLength) % carouselRealLength;

  dotsEl.innerHTML = Array.from({ length: carouselRealLength }, (_, i) =>
    `<button
      class="carousel-dot${i === activeIdx ? ' active' : ''}"
      onclick="goToSlide(${CAROUSEL_CLONES + i}, true)"
      aria-label="Ir para slide ${i + 1}"
      role="tab"
      aria-selected="${i === activeIdx}"
    ></button>`
  ).join('');
}

function goToSlide(idx, animate) {
  carouselIndex = idx;

  const track = document.getElementById('carouselTrack');
  if (!track || !track.children[0]) return;

  const slideWidth = track.children[0].offsetWidth + 24; /* 24px = gap (1.5rem) */

  track.style.transition = animate ? 'transform .45s var(--ease-out)' : 'none';
  track.style.transform  = `translateX(-${carouselIndex * slideWidth}px)`;

  const activeIdx = ((carouselIndex - CAROUSEL_CLONES) % carouselRealLength + carouselRealLength) % carouselRealLength;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === activeIdx);
    d.setAttribute('aria-selected', i === activeIdx);
  });
}

function carouselLoopCheck() {
  if (carouselIndex >= CAROUSEL_CLONES + carouselRealLength) {
    goToSlide(carouselIndex - carouselRealLength, false);
  } else if (carouselIndex < CAROUSEL_CLONES) {
    goToSlide(carouselIndex + carouselRealLength, false);
  }
}

document.getElementById('carouselTrack')?.addEventListener('transitionend', carouselLoopCheck);

function startCarouselAutoplay() {
  clearInterval(carouselAutoplayTimer);
  carouselAutoplayTimer = setInterval(() => goToSlide(carouselIndex + 1, true), CAROUSEL_AUTOPLAY_MS);
}

function stopCarouselAutoplay() {
  clearInterval(carouselAutoplayTimer);
}

document.getElementById('carouselPrev')?.addEventListener('click', () => {
  goToSlide(carouselIndex - 1, true);
  startCarouselAutoplay();
});
document.getElementById('carouselNext')?.addEventListener('click', () => {
  goToSlide(carouselIndex + 1, true);
  startCarouselAutoplay();
});

const carouselWrapperEl = document.querySelector('.carousel-wrapper');
carouselWrapperEl?.addEventListener('mouseenter', stopCarouselAutoplay);
carouselWrapperEl?.addEventListener('mouseleave', startCarouselAutoplay);

/* Recalcula ao redimensionar — com debounce de 120ms */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    slidesPerView = getSlidesPerView();
    goToSlide(carouselIndex, false);
  }, 120);
});

/* Swipe táctil — threshold de 40px */
let touchStartX = 0;

document.getElementById('carouselTrack')?.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  stopCarouselAutoplay();
}, { passive: true });

document.getElementById('carouselTrack')?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goToSlide(carouselIndex + (diff > 0 ? 1 : -1), true);
  startCarouselAutoplay();
});


/* ═══════════════════════════════════════════
   7. SWATCH DE COR NO CARD.
═══════════════════════════════════════════ */

function setCardColor(productId, color, btn) {
  cardColors[productId] = color;

  document.querySelectorAll(`.prod-card-v2[data-pid="${productId}"]`).forEach(card => {
    const containerEl = card.querySelector('.prod-img-v2');
    if (containerEl) containerEl.className = 'prod-img-v2 bg-' + color;

    const imgEl = card.querySelector('.prod-img-inner img');
    const svgEl = card.querySelector('.prod-img-inner span');
    applyImage(imgEl, svgEl, productId, color);

    card.querySelectorAll('.color-swatch').forEach(s => {
      const isActive = s.dataset.color === color;
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-label', `Cor ${s.dataset.color}${isActive ? ' (seleccionada)' : ''}`);
    });
  });
}


/* ═══════════════════════════════════════════
   8. MODAL DE PRODUTO + FOCO TRAP
═══════════════════════════════════════════ */

/* Referência ao elemento que tinha foco antes de abrir o modal
   para restaurar ao fechar (boa prática de acessibilidade) */
let _modalPreviousFocus = null;

function openModal(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  _modalPreviousFocus = document.activeElement;

  modalState.productId = productId;

  const savedColor = cardColors[productId];
  modalState.color = (savedColor && p.colors.includes(savedColor))
    ? savedColor
    : p.colors[0];

  modalState.size = p.sizes[0];

  /* Preenche textos */
  document.getElementById('modalTag').textContent      = p.sub;
  document.getElementById('modalTitle').textContent    = p.name;
  document.getElementById('modalPrice').textContent    = formatPrice(p.price);
  document.getElementById('modalPriceOld').textContent = p.oldPrice ? formatPrice(p.oldPrice) : '';
  document.getElementById('modalDesc').textContent     = p.desc;

  /* Swatches de cor */
  document.getElementById('modalColors').innerHTML = p.colors.map(c =>
    `<button
      class="modal-swatch${modalState.color === c ? ' active' : ''}"
      data-color="${c}"
      title="${c}"
      aria-label="Cor ${c}${modalState.color === c ? ' (seleccionada)' : ''}"
      onclick="setModalColor('${c}', this)"
    ></button>`
  ).join('');

  document.getElementById('modalColorName').textContent = modalState.color;

  /* Botões de tamanho */
  document.getElementById('modalSizes').innerHTML = p.sizes.map(s =>
    `<button
      class="modal-size-btn${s === modalState.size ? ' active' : ''}"
      onclick="setModalSize('${s}', this)"
      aria-pressed="${s === modalState.size}"
    >${s}</button>`
  ).join('');

  /* Fundo e imagem */
  document.getElementById('modalImg').className = 'modal-img bg-' + modalState.color;
  applyImage(
    document.getElementById('modalImgPng'),
    document.getElementById('modalImgSvg'),
    productId,
    modalState.color
  );

  /* Abre o modal */
  const overlay = document.getElementById('modalOverlay');
  const modal   = document.getElementById('productModal');
  overlay.classList.add('open');
  modal.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('modalClose')?.focus(), 50);
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal   = document.getElementById('productModal');
  overlay.classList.remove('open');
  modal.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  /* Restaura o foco ao elemento que o tinha antes de abrir */
  _modalPreviousFocus?.focus();
  _modalPreviousFocus = null;
}

function setModalColor(color, btn) {
  modalState.color = color;

  document.getElementById('modalImg').className = 'modal-img bg-' + color;
  applyImage(
    document.getElementById('modalImgPng'),
    document.getElementById('modalImgSvg'),
    modalState.productId,
    color
  );
  document.getElementById('modalColorName').textContent = color;

  btn.closest('.modal-colors')
    ?.querySelectorAll('.modal-swatch')
    .forEach(s => {
      const isActive = s.dataset.color === color;
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-label', `Cor ${s.dataset.color}${isActive ? ' (seleccionada)' : ''}`);
    });

  /* Sincroniza o card no carousel */
  cardColors[modalState.productId] = color;
  document.querySelectorAll(`.prod-card-v2[data-pid="${modalState.productId}"]`).forEach(card => {
    const containerEl = card.querySelector('.prod-img-v2');
    if (containerEl) containerEl.className = 'prod-img-v2 bg-' + color;

    applyImage(
      card.querySelector('.prod-img-inner img'),
      card.querySelector('.prod-img-inner span'),
      modalState.productId,
      color
    );

    card.querySelectorAll('.color-swatch')
      .forEach(s => s.classList.toggle('active', s.dataset.color === color));
  });
}

function setModalSize(size, btn) {
  modalState.size = size;
  btn.closest('.modal-sizes')
    ?.querySelectorAll('.modal-size-btn')
    .forEach(b => {
      const isActive = b.textContent.trim() === size;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive);
    });
}

function addFromModal() {
  const p = products.find(x => x.id === modalState.productId);
  if (!p) return;
  addToCartFull(p, modalState.size || p.sizes[0], modalState.color || p.colors[0]);
  closeModal();
}

function quickAddToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  addToCartFull(p, p.sizes[0], cardColors[productId] || p.colors[0]);
}

document.getElementById('modalAddBtn')?.addEventListener('click', addFromModal);
document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalOverlay')?.addEventListener('click', closeModal);

/* ─── Foco Trap — Modal ───────────────────
   Captura Tab e Shift+Tab dentro do modal.
   Quando o foco chega ao último elemento e o
   utilizador prime Tab, volta ao primeiro,
   e vice-versa com Shift+Tab no primeiro.
─────────────────────────────────────────── */
document.getElementById('productModal')?.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;

  const modal     = document.getElementById('productModal');
  const focusable = getFocusable(modal);
  if (!focusable.length) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    /* Shift+Tab no primeiro elemento → vai para o último */
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    /* Tab no último elemento → volta ao primeiro */
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ESC fecha em cascata: modal → carrinho → menu */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;

  if (document.getElementById('productModal')?.classList.contains('open')) {
    closeModal(); return;
  }
  if (document.getElementById('cartDrawer')?.classList.contains('open')) {
    closeCart(); return;
  }
  if (hamburger.getAttribute('aria-expanded') === 'true') {
    closeMenu();
  }
});


/* ═══════════════════════════════════════════
   9. CARRINHO + FOCO TRAP + LOCALSTORAGE
   — Persiste em localStorage a cada alteração
   — saveCart() chamado após toda a modificação
   — Foco trap igual ao modal: Tab fica no drawer
═══════════════════════════════════════════ */

function addToCartFull(p, size, color) {
  const key      = `${p.id}-${size}-${color}`;
  const existing = cart.find(x => x._key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, size, color, qty: 1, _key: key });
  }

  saveCart();
  updateCart();
  showToast(`${p.name} adicionado ao carrinho`);
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  addToCartFull(p, selectedSizes[id] || p.sizes[0], cardColors[id] || p.colors[0]);
}

function removeFromCart(key) {
  cart = cart.filter(x => x._key !== key);
  saveCart();
  updateCart();
}

function changeQty(key, delta) {
  const item = cart.find(x => x._key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(key);
  } else {
    saveCart();
    /* Actualiza só o número e preço sem re-renderizar tudo */
    const qtyEl   = document.querySelector(`.qty-num[data-key="${key}"]`);
    const priceEl = document.querySelector(`.cart-item-price[data-key="${key}"]`);
    if (qtyEl) {
      qtyEl.textContent = item.qty;
      qtyEl.classList.remove('bump');
      void qtyEl.offsetWidth;
      qtyEl.classList.add('bump');
    }
    if (priceEl) priceEl.textContent = formatPrice(item.price * item.qty);
    /* Actualiza o badge e o total */
    const count = cart.reduce((a, b) => a + b.qty, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) { badge.textContent = count; badge.classList.toggle('visible', count > 0); }
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = formatPrice(cart.reduce((a, b) => a + b.price * b.qty, 0));
  }
}

/* Re-renderiza o HTML do carrinho e actualiza o badge */
function updateCart() {
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  const emptyEl  = document.getElementById('cartEmpty');
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!emptyEl || !itemsEl || !footerEl) return;

  if (cart.length === 0) {
    emptyEl.style.display  = 'flex';
    itemsEl.innerHTML      = '';
    footerEl.style.display = 'none';
    return;
  }

  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
  emptyEl.style.display  = 'none';
  footerEl.style.display = 'block';
  document.getElementById('cartTotal').textContent = formatPrice(total);

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img
          src="${getProductImage(item.id, item.color)}"
          alt="${item.name} — ${item.color}"
          loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        >
        <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">${clothIcon}</span>
      </div>
      <div class="cart-item-info">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">${item.size} &bull; ${item.color}</div>
        </div>
        <div class="cart-item-row">
          <div class="cart-qty" role="group" aria-label="Quantidade de ${item.name}">
            <button class="qty-btn" onclick="changeQty('${item._key}', -1)" aria-label="Diminuir quantidade">−</button>
            <span class="qty-num" data-key="${item._key}" aria-live="polite">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item._key}', 1)" aria-label="Aumentar quantidade">+</button>
          </div>
          <span class="cart-item-price" data-key="${item._key}">${formatPrice(item.price * item.qty)}</span>
        </div>
        <button class="cart-remove" onclick="removeFromCart('${item._key}')">Remover</button>
      </div>
    </div>
  `).join('');
}

/* Referência ao elemento focado antes de abrir o carrinho */
let _cartPreviousFocus = null;

function openCart() {
  _cartPreviousFocus = document.activeElement;

  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('cartClose')?.focus(), 50);
}

function closeCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  /* Restaura o foco ao elemento anterior */
  _cartPreviousFocus?.focus();
  _cartPreviousFocus = null;
}

document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
document.getElementById('cartContinue')?.addEventListener('click', () => {
  closeCart();
  setTimeout(() => {
    const colecao = document.getElementById('colecao');
    if (colecao) colecao.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 320);
});

/* ─── Foco Trap — Carrinho ────────────────
   Mesmo princípio do modal: Tab e Shift+Tab
   ficam dentro do cart drawer enquanto está aberto.
─────────────────────────────────────────── */
document.getElementById('cartDrawer')?.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;

  const drawer    = document.getElementById('cartDrawer');
  const focusable = getFocusable(drawer);
  if (!focusable.length) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});


/* ═══════════════════════════════════════════
   10. WHATSAPP CHECKOUT
═══════════════════════════════════════════ */

const WHATSAPP_NUMBER = '258848401586';

function checkoutWhatsApp() {
  if (cart.length === 0) {
    showToast('O carrinho está vazio');
    return;
  }

  const linhas = cart.map(item => {
    const subtotal = formatPrice(item.price * item.qty);
    return `• ${item.name} (${item.color}, ${item.size}) × ${item.qty} = ${subtotal}`;
  });

  const total    = cart.reduce((a, b) => a + b.price * b.qty, 0);
  const data     = new Date().toLocaleDateString('pt-MZ');
  const mensagem = [
    `🛍️ *Encomenda Hypewear* — ${data}`,
    '',
    ...linhas,
    '',
    `*Total: ${formatPrice(total)}*`,
    '',
    'Quero confirmar esta encomenda e combinar o pagamento via M-Pesa.'
  ].join('\n');

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

document.getElementById('checkoutBtn')?.addEventListener('click', checkoutWhatsApp);


/* ═══════════════════════════════════════════
   11. EXPORTAR PDF DO CARRINHO
   — Usa jsPDF (carregada via CDN no HTML) para
     gerar o ficheiro .pdf directamente no browser.
     sem dependência de impressoras
   — O PDF faz download automático com o nome
     "hypewear-encomenda-{data}.pdf"
═══════════════════════════════════════════ */

/* ─── Carrega jsPDF apenas quando necessário ────────
   Evita bloquear o carregamento inicial da página. */
function loadJsPDF(cb) {
  if (window.jspdf && window.jspdf.jsPDF) { cb && cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  s.onload = () => cb && cb();
  s.onerror = () => showToast('Erro ao carregar biblioteca PDF');
  document.head.appendChild(s);
}

function exportCartPDF() {
  if (cart.length === 0) {
    showToast('O carrinho está vazio');
    return;
  }

  loadJsPDF(() => {
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
    showToast('Erro ao carregar biblioteca PDF');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc   = new jsPDF({ unit: 'mm', format: 'a4' });
  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
  const hoje  = new Date();

  const dataFormatada = hoje.toLocaleDateString('pt-MZ', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const nomeArquivo = `hypewear-encomenda-${hoje.getFullYear()}${String(hoje.getMonth()+1).padStart(2,'0')}${String(hoje.getDate()).padStart(2,'0')}.pdf`;

  /* ── Margens e largura útil ── */
  const ml = 18;          /* margem esquerda em mm */
  const pw = 210 - ml - 18; /* largura útil */
  let y    = 22;          /* cursor vertical */

  /* ── Cabeçalho ── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(17, 17, 17);
  doc.text('HYPEWEAR', ml, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Resumo de Encomenda', 192, y - 4, { align: 'right' });
  doc.text(dataFormatada,          192, y + 2, { align: 'right' });

  y += 8;
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.5);
  doc.line(ml, y, 192, y);
  y += 10;

  /* ── Cabeçalho da tabela ── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('PRODUTO',   ml,      y);
  doc.text('COR',       ml + 65, y);
  doc.text('TAM.',      ml + 90, y, { align: 'center' });
  doc.text('QTD.',      ml + 108,y, { align: 'center' });
  doc.text('UNIT.',     ml + 130,y, { align: 'right' });
  doc.text('SUBTOTAL',  192,     y, { align: 'right' });

  y += 3;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(ml, y, 192, y);
  y += 6;

  /* ── Linhas dos itens ── */
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 17);

  cart.forEach((item, idx) => {
    /* Fundo alternado */
    if (idx % 2 === 0) {
      doc.setFillColor(248, 247, 244);
      doc.rect(ml, y - 4.5, pw, 8, 'F');
    }

    const cor = item.color.charAt(0).toUpperCase() + item.color.slice(1);
    doc.text(item.name,                   ml,       y);
    doc.text(cor,                         ml + 65,  y);
    doc.text(item.size,                   ml + 90,  y, { align: 'center' });
    doc.text(String(item.qty),            ml + 108, y, { align: 'center' });
    doc.text(formatPrice(item.price),     ml + 130, y, { align: 'right'  });
    doc.text(formatPrice(item.price * item.qty), 192, y, { align: 'right' });

    y += 9;

    /* Quebra de página se necessário */
    if (y > 260 && idx < cart.length - 1) {
      doc.addPage();
      y = 20;
    }
  });

  /* ── Total ── */
  y += 2;
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.5);
  doc.line(ml, y, 192, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('TOTAL A PAGAR', ml, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text(formatPrice(total), 192, y, { align: 'right' });

  /* ── Rodapé ── */
  y += 14;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(ml, y, 192, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  [
    'Pagamento via M-Pesa — número a combinar via WhatsApp após confirmação.',
    'Entrega em 48–72h após confirmação do pagamento. Envio para todo o país.',
    'Dúvidas? Instagram @Hypewear__mz',
    `Hypewear Studio — Maputo, Moçambique © ${hoje.getFullYear()}`
  ].forEach(linha => {
    doc.text(linha, ml, y);
    y += 5;
  });

  /* ── Download directo — sem janelas, sem impressoras ── */
  doc.save(nomeArquivo);
  showToast('PDF guardado com sucesso');
  }); /* fim loadJsPDF */
}

document.getElementById('exportPdfBtn')?.addEventListener('click', exportCartPDF);


/* ═══════════════════════════════════════════
   12. TOAST
   Notificação temporária que desaparece após 2.5s.
   Se já houver um toast visível, substitui imediatamente.
═══════════════════════════════════════════ */

let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  if (toastTimer) clearTimeout(toastTimer);

  toast.textContent = msg;
  toast.classList.add('show');

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 2500);
}


/* ═══════════════════════════════════════════
   13. NEWSLETTER
   Sem integração com backend — apenas feedback visual.
   Para ligar a um serviço real, substitui o corpo
   de subscribeNL() por um fetch() para a API.
═══════════════════════════════════════════ */

function subscribeNL() {
  const input = document.getElementById('nlEmail');
  if (!input) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (emailRegex.test(input.value.trim())) {
    showToast('Bem-vindo à comunidade Hypewear!');
    input.value = '';
  } else {
    showToast('Insira um e-mail válido');
    input.focus();
  }
}

document.getElementById('nlBtn')?.addEventListener('click', subscribeNL);

document.getElementById('nlEmail')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') subscribeNL();
});


/* ═══════════════════════════════════════════
   14. NAVEGAÇÃO
   14a. Scroll — sombra no nav após scroll
   14b. Hamburger — menu mobile dropdown
   14c. Tiles de categoria — filtram a grelha
═══════════════════════════════════════════ */

/* 14a. Sombra do nav ao fazer scroll */
window.addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* 14b. Menu Mobile */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Fechar menu');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function toggleMenu() {
  hamburger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
}

hamburger?.addEventListener('click', toggleMenu);
menuOverlay?.addEventListener('click', closeMenu);

document.querySelectorAll('[data-menu-link]').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* 14c. Tiles de categoria → filtra a grelha */
document.querySelectorAll('.cat-item[data-filter]').forEach(item => {
  item.addEventListener('click', () => {
    const cat = item.dataset.filter;
    if (cat) filterCat(cat);
  });
});


/* ═══════════════════════════════════════════
   15. FILTRO DE CATEGORIAS
   Anima a saída dos cards antes de re-renderizar.
═══════════════════════════════════════════ */

function filterCat(cat) {
  currentFilter = cat;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  renderFullGrid();
}

function renderFullGrid() {
  const filtered = currentFilter === 'todos'
    ? products
    : products.filter(p => p.category === currentFilter);

  const fg = document.getElementById('fullGrid');
  if (!fg) return;

  /* Render imediato — sem setTimeout, sem reflows forçados */
  fg.innerHTML = filtered.map((p, idx) => renderProductCard(p, idx)).join('');

  /* Animação via CSS usando --i custom property */
  fg.querySelectorAll('.prod-card').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });
}

function renderProductCard(p, idx) {
  const color = cardColors[p.id] || p.colors[0];
  return `
    <div class="prod-card reveal-item" style="--i:${idx};" onclick="openModal(${p.id})">
      <div class="prod-img bg-${color}">
        ${p.tag ? `<span class="prod-label">${p.tag}</span>` : ''}
        <div class="prod-img-inner">
          <img
            src="${getProductImage(p.id, color)}"
            alt="${p.name} — ${color}"
            loading="${idx < 4 ? 'eager' : 'lazy'}"
            style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          >
          <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">${clothIcon}</span>
        </div>
        <div class="prod-actions" onclick="event.stopPropagation()">
          <div class="size-row" role="group" aria-label="Tamanhos de ${p.name}">
            ${p.sizes.map(s =>
              `<button
                class="size-btn${selectedSizes[p.id] === s ? ' active' : ''}"
                onclick="selectSize(event, ${p.id}, '${s}')"
                aria-pressed="${selectedSizes[p.id] === s}"
              >${s}</button>`
            ).join('')}
          </div>
          <button
            class="btn"
            onclick="addToCart(${p.id})"
            aria-label="Adicionar ${p.name} ao carrinho"
          >Adicionar ao carrinho</button>
        </div>
      </div>
      <div class="prod-info">
        <div class="prod-name">${p.name}</div>
        <div class="prod-sub">${p.sub}</div>
        <div class="prod-price">
          ${p.oldPrice ? `<span class="prod-price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          ${formatPrice(p.price)}
        </div>
      </div>
    </div>`;
}

function selectSize(e, id, size) {
  e.stopPropagation();
  selectedSizes[id] = size;

  document.querySelectorAll(`.prod-card[onclick*="openModal(${id})"] .size-btn`)
    .forEach(btn => {
      const isActive = btn.textContent.trim() === size;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    if (cat) filterCat(cat);
  });
});


/* ═══════════════════════════════════════════
   16. SCROLL REVEAL & SCROLLSPY
   — Reveal: anima elementos quando entram no viewport
   — Scrollspy: marca o link activo conforme a secção
     visível. Respeita prefers-reduced-motion.
═══════════════════════════════════════════ */

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target); /* não repete a animação */
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initScrollspy() {
  const sectionIds = ['novidades', 'colecao', 'editorial', 'sobre'];
  const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  let activeSectionId = null;

  function setActiveLink(id) {
    if (id === activeSectionId) return;
    activeSectionId = id;

    document.querySelectorAll('.nav-links a').forEach(a => {
      const target   = (a.getAttribute('href') || '').replace('#', '');
      const isActive = target === id;
      a.classList.toggle('active', isActive);
      a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    document.querySelectorAll('[data-menu-link]').forEach(a => {
      const target = (a.getAttribute('href') || '').replace('#', '');
      a.classList.toggle('active', target === id);
    });
  }

  const ratios = {};

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { ratios[entry.target.id] = entry.intersectionRatio; });

    let bestId    = null;
    let bestRatio = 0.05;

    sectionIds.forEach(id => {
      const r = ratios[id] || 0;
      if (r > bestRatio) { bestRatio = r; bestId = id; }
    });

    setActiveLink(bestId);
  }, {
    rootMargin: '-10% 0px -60% 0px',
    threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0]
  });

  sections.forEach(s => io.observe(s));

  /* Fallback: clique no link activa imediatamente */
  document.querySelectorAll('.nav-links a, [data-menu-link]').forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) setActiveLink(href.replace('#', ''));
    });
  });
}


/* ═══════════════════════════════════════════
   17. INICIALIZAÇÃO
   Ordem importante — não alterar.
═══════════════════════════════════════════ */
preloadImages();      /* 1. Pré-carrega imagens em background */
buildCarousel();      /* 2. Constrói o carousel de novidades */
renderFullGrid();     /* 3. Renderiza a grelha completa */
updateCart();         /* 4. Sincroniza badge e renderiza carrinho guardado */
initScrollReveal();   /* 5. Configura animações de scroll */
initScrollspy();      /* 6. Marca link activo conforme secção visível */

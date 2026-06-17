(function () {
  if (document.getElementById('floating-panda-root')) return;

  const SPEECHES = [
    '🎋 笹、うまい！',
    'ゴロゴロしたい…',
    'みてみて！もふもふ！',
    'むにゅ〜っ',
    'ねむい…zzz',
    'たべたら　ねる！',
    'きょうも　げんき！',
    'あそんで〜！',
    'パンダって　かわいいね！',
    'うごくの　めんどくさいな…',
    'ここに　おいてくれて　ありがとう！',
  ];

  let speechTimeout = null;

  // --- DOM 構築 ---
  const root = document.createElement('div');
  root.id = 'floating-panda-root';

  const container = document.createElement('div');
  container.id = 'floating-panda-container';

  const speech = document.createElement('div');
  speech.id = 'floating-panda-speech';
  speech.textContent = '';

  const svgNS = 'http://www.w3.org/2000/svg';

  // パンダの SVG（シンプルかわいい系）
  const svgMarkup = `
<svg id="floating-panda-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- 耳（黒） -->
  <ellipse cx="22" cy="22" rx="14" ry="13" fill="#222"/>
  <ellipse cx="78" cy="22" rx="14" ry="13" fill="#222"/>
  <!-- 顔（白） -->
  <ellipse cx="50" cy="52" rx="36" ry="34" fill="#f5f5f5"/>
  <!-- 目の黒パッチ -->
  <ellipse cx="36" cy="44" rx="11" ry="10" fill="#222"/>
  <ellipse cx="64" cy="44" rx="11" ry="10" fill="#222"/>
  <!-- 白目 -->
  <ellipse cx="37" cy="43" rx="5" ry="5" fill="#fff"/>
  <ellipse cx="65" cy="43" rx="5" ry="5" fill="#fff"/>
  <!-- 瞳 -->
  <circle cx="38" cy="43" r="3" fill="#111"/>
  <circle cx="66" cy="43" r="3" fill="#111"/>
  <!-- ハイライト -->
  <circle cx="39.5" cy="41.5" r="1.2" fill="#fff"/>
  <circle cx="67.5" cy="41.5" r="1.2" fill="#fff"/>
  <!-- 鼻 -->
  <ellipse cx="50" cy="57" rx="6" ry="4" fill="#222"/>
  <!-- 口 -->
  <path d="M44 62 Q50 68 56 62" stroke="#222" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <!-- ほっぺ -->
  <ellipse cx="31" cy="62" rx="8" ry="6" fill="#ffb7b7" opacity="0.55"/>
  <ellipse cx="69" cy="62" rx="8" ry="6" fill="#ffb7b7" opacity="0.55"/>
  <!-- 体（白） -->
  <ellipse cx="50" cy="88" rx="26" ry="16" fill="#f0f0f0"/>
  <!-- 手 -->
  <ellipse cx="25" cy="80" rx="10" ry="8" fill="#222" transform="rotate(-20 25 80)"/>
  <ellipse cx="75" cy="80" rx="10" ry="8" fill="#222" transform="rotate(20 75 80)"/>
</svg>`;

  const svgWrapper = document.createElement('div');
  svgWrapper.innerHTML = svgMarkup;
  const svgEl = svgWrapper.firstElementChild;

  container.appendChild(speech);
  container.appendChild(svgEl);
  root.appendChild(container);
  document.body.appendChild(root);

  // --- セリフ表示 ---
  svgEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isDragging) return;

    const random = SPEECHES[Math.floor(Math.random() * SPEECHES.length)];
    speech.textContent = random;
    speech.classList.add('visible');

    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      speech.classList.remove('visible');
    }, 3000);
  });

  // --- ドラッグ移動 ---
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragMoved = false;

  // 初期位置を fixed で管理（right/bottom → left/top に切り替え）
  function initPosition() {
    const rect = root.getBoundingClientRect();
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.style.left = rect.left + 'px';
    root.style.top = rect.top + 'px';
  }

  root.addEventListener('mousedown', (e) => {
    e.preventDefault();
    initPosition();
    isDragging = true;
    dragMoved = false;
    const rect = root.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    root.classList.add('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragMoved = true;

    let newLeft = e.clientX - dragOffsetX;
    let newTop = e.clientY - dragOffsetY;

    // 画面外に出ないよう制限
    const maxX = window.innerWidth - root.offsetWidth;
    const maxY = window.innerHeight - root.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));

    root.style.left = newLeft + 'px';
    root.style.top = newTop + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('dragging');
  });
})();

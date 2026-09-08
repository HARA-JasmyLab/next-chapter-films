'use strict';
(() => {
  const options = document.getElementById('consultation-options');
  const plan = document.getElementById('inquiry-plan');
  const purpose = document.getElementById('inquiry-purpose');
  const budget = document.getElementById('inquiry-budget');
  const timing = document.getElementById('inquiry-timing');
  const memo = document.getElementById('inquiry-memo');
  const copyButton = document.getElementById('copy-memo');
  const status = document.getElementById('copy-status');
  if (!options || !plan || !purpose || !budget || !timing || !memo || !copyButton || !status) return;
  const planLabels = {
    undecided: '相談して決めたい',
    create: '30秒アニメ制作（20万円・税別）',
    reach: 'ブランドストーリー配信（60万円〜・税別、広告費別途）',
    series: '連続スポンサー企画（月100万円〜・税別、広告費別途）'
  };
  const updateMemo = () => {
    memo.value = ['NEXT CHAPTER FILMS 制作・配信の相談', '', `希望プラン：${planLabels[plan.value] || planLabels.undecided}`, `動画の目的：${purpose.value}`, `総予算の目安（税別）：${budget.value}`, `公開希望時期：${timing.value}`, '', '事業内容・伝えたいこと：'].join('\n');
    status.textContent = '';
  };
  for (const field of [plan, purpose, budget, timing]) field.addEventListener('change', updateMemo);
  for (const link of document.querySelectorAll('[data-plan]')) {
    link.addEventListener('click', () => {
      const value = link.dataset.plan;
      if (!Object.hasOwn(planLabels, value)) return;
      plan.value = value;
      updateMemo();
      status.textContent = `${planLabels[value]}を選択しました。`;
    });
  }
  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(memo.value);
      status.textContent = 'コピーしました。お問い合わせフォームの本文に貼り付けてください。';
    } catch {
      const details = memo.closest('details');
      if (details) details.open = true;
      memo.focus();
      memo.select();
      status.textContent = '自動コピーができませんでした。選択された相談メモを手動でコピーしてください。';
    }
  });
  // No personal information is sent, persisted, or added to URLs here.
  updateMemo();
  options.hidden = false;
  const dock = document.querySelector('.dock');
  const contact = document.getElementById('contact');
  if (dock && contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      dock.hidden = entries.some(entry => entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(contact);
  }
})();

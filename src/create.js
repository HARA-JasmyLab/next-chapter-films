'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const form = $('story-form');
  const theme = $('theme');
  const count = $('theme-count');
  const toast = $('toast');
  let packageData = null;

  const dictionaries = {
    mood: {
      quiet: {label:'静かな余韻', light:'soft overcast light, restrained contrast', sound:'minimal piano, room tone, long tail'},
      warm: {label:'あたたかい', light:'warm late-afternoon light, gentle highlights', sound:'warm acoustic texture, subtle piano'},
      tension: {label:'不安から光へ', light:'cool low-key light gradually becoming warm', sound:'low pulse that resolves into open piano'},
      wonder: {label:'不思議・発見', light:'luminous natural light, subtle magical realism', sound:'delicate bells, air, sparse piano'},
      drive: {label:'挑戦・前進', light:'crisp directional light, rising brightness', sound:'restrained pulse, strings, uplifting resolve'}
    },
    world: {
      japan:'contemporary Japan, lived-in details, realistic signage shapes, seasonal atmosphere',
      city:'dense modern city, human-scale streets, reflections, transit, natural crowd rhythm',
      nature:'Japanese landscape, wind, water, trees, tactile weather, wide negative space',
      school:'Japanese school life, uniforms, corridors, practice rooms, after-school light',
      future:'near-future Japan, plausible technology, quiet infrastructure, human warmth'
    },
    visual: {
      cinematic:'cinematic anime film, hand-crafted background art, natural lensing, subtle film grain',
      soft:'soft Japanese illustration, tactile brush texture, understated palette, poetic framing',
      graphic:'editorial animation, bold negative space, graphic composition, controlled motion',
      real:'anime realism, detailed environment, restrained character design, photographic lighting'
    }
  };

  const narrationByMode = {
    minimal: cuts => cuts.map(c => c.caption).filter(Boolean).join('\n'),
    poetic: cuts => cuts.map((c,i) => i === 0 ? c.caption : c.caption.replace(/。$/,'。')).join('\n'),
    direct: cuts => cuts.map(c => c.caption).join('\n'),
    none: () => ''
  };

  const slugDate = () => new Date().toISOString().slice(0,10).replaceAll('-','');
  const safeTitle = text => text.replace(/[。！？!?].*$/,'').trim().slice(0,28) || 'Untitled Short';

  function buildCuts(input) {
    const t = input.theme.replace(/\s+/g,' ').trim();
    const mood = dictionaries.mood[input.mood];
    const world = dictionaries.world[input.world];
    const visual = dictionaries.visual[input.visualStyle];
    const base = `${visual}, ${world}, ${mood.light}, vertical 9:16 composition, one clear subject, no text, no watermark`;
    return [
      {
        no:'01', time:'00:00–00:04', role:'HOOK',
        scene:`説明をせず「${t}」の最も強い情景だけを見せる。観客が理由を知りたくなる一瞬。`,
        caption:'いつも、同じ場所だった。',
        imagePrompt:`${base}. Opening image for this story: ${t}. Establish one unforgettable visual mystery, close or medium shot, strong silhouette, quiet tension.`,
        motionPrompt:'Very slow push-in. One natural secondary motion only: wind, rain, breath, fabric, or distant traffic. Hold the final 0.5 seconds.',
        audio:'環境音を先に置く。音楽はまだ答えを出さない。'
      },
      {
        no:'02', time:'00:04–00:09', role:'CONTEXT',
        scene:'主人公と場所の関係を示す。同じ行動を繰り返していることが、1カットでわかる。',
        caption:'今日も、昨日と同じように。',
        imagePrompt:`${base}. Same character and location continuity. Show a repeated daily ritual connected to: ${t}. Wider composition with specific lived-in details.`,
        motionPrompt:'Lateral camera drift or locked-off shot with repeated human action. Keep motion understated and readable.',
        audio:'小さな生活音を足す。リズムを作り始める。'
      },
      {
        no:'03', time:'00:09–00:14', role:'SHIFT',
        scene:'いつもと違う小さな変化を入れる。大事件ではなく、観客だけが先に気づく違和感。',
        caption:'でも、その日は少しだけ違った。',
        imagePrompt:`${base}. Same continuity. Introduce one subtle change that breaks the routine in the story: ${t}. Compose the anomaly clearly but do not explain it.`,
        motionPrompt:'Rack focus or gentle pan reveals the change. Character reacts late. Avoid fast action.',
        audio:'環境音を一瞬引き、違和感に小さな音を置く。'
      },
      {
        no:'04', time:'00:14–00:20', role:'REVEAL',
        scene:'待っていた理由・失っていたもの・挑戦の意味など、感情の中心を映像で明かす。',
        caption:'待っていたのは、出来事ではなかった。',
        imagePrompt:`${base}. Emotional reveal for: ${t}. Show the relationship or meaning behind the routine. Human expression and gesture over spectacle, cinematic restraint.`,
        motionPrompt:'Slow approach or character crossing frame into connection. Let the reveal happen through blocking, not effects.',
        audio:'ここで初めて旋律を開く。台詞より表情を優先。'
      },
      {
        no:'05', time:'00:20–00:26', role:'RELEASE',
        scene:'感情がほどける瞬間。走る、笑う、手を伸ばす、歩き出すなど、ひとつの行動で決着させる。',
        caption:'その時間には、ちゃんと意味があった。',
        imagePrompt:`${base}. Emotional release after the reveal in: ${t}. One decisive human action, warmer light, clear spatial relationship, no melodrama.`,
        motionPrompt:'Motion finally becomes larger: a run, turn, embrace, step forward, or hand movement. Camera follows once, smoothly.',
        audio:'環境音と音楽を重ね、ピークは短く。'
      },
      {
        no:'06', time:'00:26–00:30', role:'ECHO',
        scene:'最初と似た構図に戻る。ただし意味だけが変わっている。説明せず余韻で閉じる。',
        caption:'同じ景色が、少し違って見えた。',
        imagePrompt:`${base}. Closing echo of the opening for: ${t}. Return to a similar composition, but change one meaningful detail. Quiet ending, generous negative space.`,
        motionPrompt:'Nearly still. Tiny environmental movement. End on a clean 12-frame hold for edit flexibility.',
        audio:'最後の言葉の後に0.5〜1秒の無音を残す。'
      }
    ];
  }

  function buildPackage() {
    const input = {
      theme: theme.value.trim(),
      mood: $('mood').value,
      world: $('world').value,
      visualStyle: $('visual-style').value,
      narrationMode: $('narration-mode').value
    };
    const cuts = buildCuts(input);
    const title = safeTitle(input.theme);
    const script = narrationByMode[input.narrationMode](cuts);
    const terms = [title, dictionaries.mood[input.mood].label, 'Japanese animation short', input.world].join(', ');
    const mpt = {
      video_subject: input.theme,
      video_script: script,
      video_terms: terms,
      video_aspect: '9:16',
      video_fit_mode: 'cover',
      video_concat_mode: 'sequential',
      video_transition_mode: null,
      video_clip_duration: 5,
      video_count: 1,
      video_source: 'local',
      video_language: 'ja-JP',
      voice_name: '',
      voice_volume: 1.0,
      voice_rate: 1.0,
      bgm_type: 'random',
      bgm_volume: 0.15,
      subtitle_enabled: input.narrationMode !== 'none',
      subtitle_position: 'bottom',
      subtitle_display_mode: 'sentence',
      subtitle_animation: 'none',
      font_size: 60,
      stroke_width: 1.5
    };
    return {
      schema:'ncf-short-studio/v0.1',
      created_at:new Date().toISOString(),
      project:{title, duration_seconds:30, aspect:'9:16', resolution:'1080x1920'},
      creative:{...input, moodLabel:dictionaries.mood[input.mood].label},
      story:{
        logline:`${input.theme} その出来事を、説明ではなく「日常→違和感→意味→余韻」の30秒で描く。`,
        narration:script
      },
      cuts,
      money_printer_turbo:mpt,
      handoff:{
        strategy:'Render each NCF cut first, then provide the resulting local clips to MoneyPrinterTurbo in sequential order.',
        adapter_status:'not_connected'
      }
    };
  }

  function render(pkg) {
    $('story-title').textContent = pkg.project.title;
    $('story-logline').textContent = pkg.story.logline;
    $('story-script').textContent = pkg.story.narration || 'ナレーションなし。映像と環境音のみで構成。';
    $('cut-list').innerHTML = pkg.cuts.map(c => `
      <article class="cut-card">
        <div class="cut-time"><b>CUT ${c.no}</b><br>${c.time}<br>${c.role}</div>
        <div class="cut-summary"><h3>${escapeHtml(c.scene)}</h3><p>字幕：${escapeHtml(c.caption)}</p></div>
        <div class="cut-detail">
          <div><b>IMAGE PROMPT</b><p>${escapeHtml(c.imagePrompt)}</p></div>
          <div><b>MOTION</b><p>${escapeHtml(c.motionPrompt)}</p></div>
          <div><b>SOUND</b><p>${escapeHtml(c.audio)}</p></div>
        </div>
      </article>`).join('');
    $('manifest-preview').textContent = JSON.stringify(pkg.money_printer_turbo, null, 2);
    for (const id of ['story','cuts','export']) $(id).hidden = false;
    document.querySelectorAll('.progress-item').forEach((el,i) => el.classList.toggle('is-active', i === 3));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-on');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-on'), 1800);
  }

  async function copyText(value, success) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(success);
    } catch {
      showToast('コピーできませんでした');
    }
  }

  theme.addEventListener('input', () => count.textContent = theme.value.length);
  document.querySelectorAll('[data-example]').forEach(btn => btn.addEventListener('click', () => {
    theme.value = btn.dataset.example || '';
    count.textContent = theme.value.length;
    theme.focus();
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!theme.value.trim()) {
      theme.focus();
      showToast('まず、物語の種を一つ入力してください');
      return;
    }
    packageData = buildPackage();
    render(packageData);
    $('story').scrollIntoView({behavior:'smooth', block:'start'});
  });

  document.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', () => {
    const target = $(btn.dataset.jump);
    if (!target || target.hidden) return;
    target.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  $('copy-script').addEventListener('click', () => {
    if (packageData) copyText(packageData.story.narration, '脚本をコピーしました');
  });
  $('copy-mpt').addEventListener('click', () => {
    if (packageData) copyText(JSON.stringify(packageData.money_printer_turbo, null, 2), 'MPT manifestをコピーしました');
  });
  $('download-json').addEventListener('click', () => {
    if (!packageData) return;
    const blob = new Blob([JSON.stringify(packageData, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ncf-short-${slugDate()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Production JSONを書き出しました');
  });
  $('start-over').addEventListener('click', () => {
    theme.focus();
    $('idea').scrollIntoView({behavior:'smooth', block:'start'});
    document.querySelectorAll('.progress-item').forEach((el,i) => el.classList.toggle('is-active', i === 0));
  });
})();
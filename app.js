const categories = [
  { id: 'supermarket', label: 'Supermarket', items: [
    ['Fruit sandwich', 'フルーツサンド — soft bread, whipped cream, and fresh fruit.'],
    ['Japanese milk', '牛乳 — try a local brand, especially in Hokkaido or Kyushu.'],
    ['Prepared sushi', 'お寿司 — a simple way to compare everyday sushi with restaurant sushi.'],
    ['Fried chicken', '唐揚げ — look in the deli section, often sold by weight.'],
    ['Seasonal fruit', 'いちご・桃・ぶどう — Japan takes fruit seriously.'],
    ['Japanese pudding', 'プリン — a small, very Japanese dessert.'],
    ['Regional snack', 'ご当地お菓子 — choose something you have never seen before.'],
    ['Onigiri', 'おにぎり — salmon, tuna mayo, or a mystery filling.'],
    ['Bottled tea', 'お茶 — try green tea, barley tea, or jasmine tea without sugar.'],
    ['Ask for a recommendation', 'おすすめは何ですか？ — Osusume wa nan desu ka?']
  ]},
  { id: 'convenience', label: 'Convenience store', items: [
    ['Egg sandwich', 'たまごサンド — one of the easiest Japanese classics to start with.'],
    ['Hot snack', 'ホットスナック — karaage, croquettes, or steamed pork buns.'],
    ['Seasonal dessert', '新作スイーツ — convenience stores refresh these constantly.'],
    ['Iced coffee', 'アイスコーヒー — make it at the machine after paying.'],
    ['Instant miso soup', '味噌汁 — a comforting, easy breakfast addition.'],
    ['Cup noodles', 'カップ麺 — Japan has far more varieties than you expect.'],
    ['Japanese ice cream', 'アイス — try a flavor you would not find at home.'],
    ['Local limited item', '限定商品 — look for the word 限定 (gentei).'],
    ['Late-night stop', '夜のコンビニ — a small but very Japanese travel memory.'],
    ['Pay with a tray', 'お会計 — put cash on the tray if there is one.']
  ]},
  { id: 'food', label: 'Food', items: [
    ['Ramen at the counter', 'ラーメン — choose a small local place with a short menu.'],
    ['Set-meal breakfast', '定食 — rice, soup, a main dish, and small sides.'],
    ['Bakery bread', 'パン屋さん — pick one item just because it looks good.'],
    ['Soba or udon', 'そば・うどん — quick, warm, and usually very affordable.'],
    ['Sushi conveyor belt', '回転寿司 — an easy and fun first sushi experience.'],
    ['A regional dish', 'ご当地グルメ — ask what the city is known for.'],
    ['Street-food snack', '食べ歩き — enjoy it only where the area allows it.'],
    ['A tiny restaurant', '小さなお店 — sit at the counter if there is space.'],
    ['Say thank you after eating', 'ごちそうさまでした — Gochisousama deshita.'],
    ['Save a favorite', '写真を撮る — keep one memory for your next Japan trip.']
  ]}
];
const STORAGE_KEY = 'juniho-saved-v2';
let saved = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
let active = categories[0].id;
const tabs = document.querySelector('#tabs');
const items = document.querySelector('#items');
const categoryLabel = document.querySelector('#categoryLabel');
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved])); }
function currentCategory() { return categories.find(category => category.id === active); }
function renderTabs() {
  tabs.innerHTML = categories.map(category => `<button class="tab ${category.id === active ? 'active' : ''}" data-category="${category.id}" type="button">${category.label}</button>`).join('');
  tabs.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => { active = tab.dataset.category; renderTabs(); renderItems(); }));
}
function renderItems() {
  const category = currentCategory();
  categoryLabel.textContent = category.label;
  items.innerHTML = category.items.map(([title, description], index) => {
    const key = `${category.id}-${index}`;
    const isSaved = saved.has(key);
    return `<button class="item ${isSaved ? 'checked' : ''}" data-key="${key}" type="button" aria-pressed="${isSaved}"><span class="check" aria-hidden="true">${isSaved ? '✓' : ''}</span><span class="item-copy"><h2>${title}</h2><p>${description}</p></span></button>`;
  }).join('');
  items.querySelectorAll('.item').forEach(item => item.addEventListener('click', () => { const key = item.dataset.key; saved.has(key) ? saved.delete(key) : saved.add(key); persist(); renderItems(); }));
}
function toast(message) { const element = document.querySelector('#toast'); element.textContent = message; element.classList.add('show'); setTimeout(() => element.classList.remove('show'), 2200); }
document.querySelector('#resetButton').addEventListener('click', () => { saved.clear(); persist(); renderItems(); toast('Your checks have been cleared.'); });
document.querySelector('#shareButton').addEventListener('click', async () => {
  const share = { title: 'Juniho — Things to try in Japan', text: 'A small checklist for experiencing Japan.', url: location.href.split('?')[0] };
  try { if (navigator.share) await navigator.share(share); else { await navigator.clipboard.writeText(share.url); toast('Checklist link copied.'); } } catch (error) { if (error.name !== 'AbortError') toast('Could not share right now.'); }
});
renderTabs();
renderItems();

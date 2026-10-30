// Controls change only demo inputs; CSS owns the demonstrated effects.
for (const input of document.querySelectorAll('[data-control]')) {
  const update = () => {
    const target = document.getElementById(input.dataset.target);
    target.style.setProperty(input.dataset.control, input.value + input.dataset.unit);
    document.querySelector(`output[for="${input.id}"]`).value = input.value + input.dataset.unit;
  };
  input.addEventListener('input', update);
  update();
}

for (const card of document.querySelectorAll('article.experiment')) {
  const badge = card.querySelector('.support');
  let supported;
  if (card.dataset.support) supported = CSS.supports(card.dataset.support);
  if (card.dataset.interface) supported = card.dataset.interface in window;
  if (card.dataset.probe) {
    const probe = card.querySelector('[data-probe]');
    supported = getComputedStyle(probe).getPropertyValue(card.dataset.probe).trim() === '1';
  }
  if (card.id === 'starting') supported = supported && 'popover' in HTMLElement.prototype;
  badge.textContent = supported ? '● 语法 / 规则可用' : '△ 当前浏览器不支持此示例';
  badge.classList.toggle('unsupported', !supported);
}
const anchorStatus = document.getElementById('anchor-query-status');
anchorStatus.textContent = CSS.supports('container-type:anchored') ? '锚定查询语法可用；翻转后气泡变紫。' : '锚定查询不支持：基础定位可能可用，翻转后不会变紫。';
if (location.protocol === 'file:') document.getElementById('http-note').textContent = '当前通过文件打开。跨页动画需使用 README 中的本地 HTTP 启动方式。';

# CSS Lab

13 个原生 CSS 能力实验，无框架、无外部字体、无构建步骤。

直接打开 `index.html` 可查看多数实验。跨文档视图过渡需要同源 HTTP：

```sh
cd /Users/wangyaxin/Desktop/HXYworkdir/demo
python3 -m http.server 8765 --bind 127.0.0.1
```

访问 http://127.0.0.1:8765 。第 10 项进入真实的第二页 `specimen.html`。

- `index.html`：实验、操作说明、关键代码和 MDN 参考。
- `lab.css`：全部样式与实验实现，使用原生 `@layer` 整理。
- `lab.js`：仅控制两个滑块、浏览器能力提示和 file 协议提示。
- `specimen.html`：跨文档过渡目标，不含 JavaScript。

能力标记是语法或规则检测，不是完整兼容性承诺。锚定查询、滚动状态查询、类型化 attr 等特性在不同浏览器中可能不支持。缺失能力保留静态内容，不以 JavaScript 伪造效果。系统「减少动态效果」开启时关闭动画。

## 验证

`check.cjs` 使用 Playwright 和独立无头 Chrome，验证关键 CSS 计算结果、浮层、导航、375/768/1440px 无横向溢出、减少动态效果和 JS 错误。启动上述 HTTP 服务后执行：

```sh
PLAYWRIGHT_MODULE=/path/to/playwright node check.cjs
```

已有项目能直接解析 Playwright 时，可直接 `node check.cjs`。无需为演示安装运行依赖。截图输出到 `/tmp/css-lab-*.png`；此验证针对支持这些特性的 Chrome，不是跨浏览器兼容性测试。

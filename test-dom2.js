const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:30080/html/todo.html', { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => document.getElementById('agent-bottom-bars') ? document.getElementById('agent-bottom-bars').outerHTML : 'null');
  console.log('HTML:', html);
  await browser.close();
})();

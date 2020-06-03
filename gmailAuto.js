let puppeteer = require("puppeteer");
let fs = require("fs");
let cFile = process.argv[2];
let url, pwd, user;
(async function () {
  let data = await fs.promises.readFile(cFile, "utf-8");
  let credent = JSON.parse(data);
  url = credent.url;
  user = credent.user;
  pwd = credent.pwd;
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized","--incognito"],
  });
  let numberofPages = await browser.pages();
  let tab = numberofPages[0];
  await tab.goto(url, {
  waitUntil:"networkidle2"
  });
  await tab.waitForSelector("#identifierId");
  await tab.type("#identifierId",user,{delay:200});
  await tab.waitForSelector("#identifierNext");
  await navigationHelper(tab, "#identifierNext");
  await tab.waitForSelector("input[type='password']",{visible:true, timeout:3000});
  await tab.type("input[type='password']", pwd, {delay:500});
  await tab.waitForSelector("#passwordNext");
  await navigationHelper(tab, "#passwordNext");
  await delMail(tab, "a[href = '?&s=t']");
  await delMail(tab, "a[href = '?&s=m']");
  await navigationHelper(tab, "#gb_71");
}
  )
();
  async function navigationHelper(tab, selector) {
    await Promise.all([
      tab.waitForNavigation({
        waitUntil:"networkidle2",
      }),
      tab.click(selector),
    ]);
  }
  async function delMail(tab,selector)
  {
    await navigationHelper(tab, selector);
    let tr1 = await tab.$$(".th tbody tr");
    for (let i = 0; i < tr1.length; i++) {
      await tab.evaluate((res) => {
        let cb = res.querySelector("input[type='checkbox']");
        if (cb) {
          cb.click();
        }
      }, tr1[i]);
    }
    await navigationHelper(tab, "input[name='nvp_a_dl']");
  }
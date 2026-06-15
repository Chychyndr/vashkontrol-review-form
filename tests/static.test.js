const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const html = read("index.html");
const css = read("styles.css");
const js = read("script.js");

function expectMatch(name, value, pattern) {
  assert.match(value, pattern, name);
}

expectMatch("index links styles.css", html, /<link rel="stylesheet" href="styles\.css"/);
expectMatch("index loads script.js", html, /<script src="script\.js"/);
expectMatch("favicon stays local", html, /<link rel="icon"[^>]+href="favicon\.svg"/);

const searchModes = [...html.matchAll(/name="searchMode" value="([^"]+)"([^>]*)>/g)].map((match) => ({
  value: match[1],
  attrs: match[2]
}));
assert.deepEqual(searchModes.map((item) => item.value), ["mfc", "department", "any"], "search mode order");
assert.ok(searchModes[0].attrs.includes("checked"), "MFC mode is default");
assert.ok(!searchModes[2].attrs.includes("checked"), "fallback mode is not default");

expectMatch("desktop city field exists", html, /id="cityInput"/);
expectMatch("region hint is outside region label", html, /<\/label>\s*<label class="field field--city[\s\S]*?<\/label>\s*<div class="region-hint-cell">/);
expectMatch("mobile city field hidden", css, /@media \(max-width: 900px\)[\s\S]*?\.field--city \{ display: none; \}/);

expectMatch("mobile base result rows stay compact", css, /@media \(max-width: 520px\)[\s\S]*?\.result-row\s*\{[\s\S]*?min-height:\s*64px;/);
expectMatch("mobile org rows reserve tag space", css, /@media \(max-width: 520px\)[\s\S]*?\.result-row--org\s*\{[\s\S]*?min-height:\s*128px;[\s\S]*?padding:\s*14px 12px 24px;/);
expectMatch("mobile review tag hidden", css, /@media \(max-width: 520px\)[\s\S]*?\.tag--reviews \{ display: none; \}/);
expectMatch("mobile reviews become separate text row", css, /@media \(max-width: 520px\)[\s\S]*?\.result-reviews-inline\s*\{[\s\S]*?display:\s*block;/);

[1, 2, 3, 4, 5].forEach((rating) => {
  expectMatch(`star color for rating ${rating}`, css, new RegExp(`data-rating-value="${rating}"[\\s\\S]*?color:`));
});
expectMatch("rating value stored on row", js, /row\.dataset\.ratingValue = rating \? String\(rating\) : "";/);

[
  "Время предоставления государственной услуги",
  "Время ожидания в очереди при получении услуги",
  "Вежливость и компетентность сотрудника, взаимодействующего с заявителем при предоставлении государственной услуги",
  "Доступность информации о порядке предоставления государственной услуги",
  "Комфортность условий в помещении, в котором предоставлена государственная услуга"
].forEach((question) => {
  assert.ok(js.includes(question), `required rating question: ${question}`);
});

expectMatch("date max is today", js, /state\.dateMax = formatDate\(today\);/);
expectMatch("date min is three years", js, /state\.dateMin = formatDate\(addYears\(today, -3\)\);/);
expectMatch("future date validation exists", js, /Нельзя выбрать дату в будущем/);
expectMatch("old date validation exists", js, /Выберите дату не старше 3 лет/);

assert.ok(!html.includes("YouTube"), "video placeholder should not mention YouTube");
expectMatch("Russian video platforms shown", html, /RuTube, VK Видео, Дзен/);

const noticeIndex = html.indexOf('id="moderationNotice"');
const officialTextIndex = html.indexOf("Если выбрать этот вариант");
const actionsIndex = html.indexOf('class="form-actions"');
assert.ok(noticeIndex > -1, "moderation notice exists");
assert.ok(noticeIndex < officialTextIndex, "moderation notice is under checkbox text");
assert.ok(noticeIndex < actionsIndex, "moderation notice is above submit buttons");

console.log("Static tests passed");

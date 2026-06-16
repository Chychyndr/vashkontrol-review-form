const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const html = read("index.html");
const css = read("styles.css");
const js = read("script.js");
const themeCss = read("theme-gosuslugi.css");

function expectMatch(name, value, pattern) {
  assert.match(value, pattern, name);
}

expectMatch("index links styles.css", html, /<link rel="stylesheet" href="styles\.css"/);
expectMatch("index links official theme after base CSS", html, /styles\.css" \/>[\s\S]*theme-gosuslugi\.css" \/>/);
expectMatch("index loads script.js", html, /<script src="script\.js"/);
expectMatch("favicon stays local", html, /<link rel="icon"[^>]+href="favicon\.svg"/);
expectMatch("classic theme is default body class", html, /<body class="theme-classic">/);
expectMatch("theme switcher has classic option", html, /data-theme-option="classic"/);
expectMatch("theme switcher has official option", html, /data-theme-option="official"/);
expectMatch("theme switcher buttons are not form submit buttons", html, /<button[^>]+type="button"[^>]+data-theme-option="classic"[\s\S]*?<button[^>]+type="button"[^>]+data-theme-option="official"/);
expectMatch("stage uses original custom dropdown", html, /id="stageButton"[\s\S]*id="stage" type="hidden" value="result_received"[\s\S]*id="stageOptions"/);
[
  "Подача заявления (документов)",
  "Получение результата государственной услуги",
  "Отказ",
  "Приостановление"
].forEach((stageLabel) => {
  assert.ok(js.includes(stageLabel), `original stage option: ${stageLabel}`);
});
expectMatch("stage dropdown renders options", js, /function renderStageOptions\(\)/);
expectMatch("stage value setter updates hidden input", js, /function setStage\(value[\s\S]*?elements\.stage\.value = nextValue;/);
expectMatch("stage dropdown becomes static on mobile", css, /@media \(max-width: 900px\)[\s\S]*?\.stage-options\s*\{[\s\S]*?position:\s*static;/);
expectMatch("theme localStorage key exists", js, /vashkontrol-color-theme/);
expectMatch("official class toggled", js, /classList\.toggle\("theme-official", official\)/);
expectMatch("classic class toggled", js, /classList\.toggle\("theme-classic", !official\)/);
expectMatch("official theme scoped to body class", themeCss, /body\.theme-official\s*\{/);
expectMatch("official primary blue", themeCss, /--primary:\s*#0d4cd3;/);
expectMatch("official red accent", themeCss, /--accent-red:\s*#ee3f58;/);
expectMatch("official success green", themeCss, /--success-dark:\s*#1d6b41;/);
expectMatch("official success dialog icon stays green", themeCss, /body\.theme-official \.dialog__icon\s*\{[\s\S]*?background:\s*var\(--success-dark\);/);
expectMatch("official success toast stays green", themeCss, /body\.theme-official \.toast\s*\{[\s\S]*?background:\s*var\(--success-dark\);/);
assert.ok(!themeCss.includes(".gos-logo::after"), "official Gosuslugi logo should not draw red underline");

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
expectMatch("city filter helper exists", js, /function getSelectedCityFilter\(selectedRegion = state\.selectedRegion\)/);
expectMatch("city filter excludes organizations from other cities", js, /const selectedCity = getSelectedCityFilter\(selectedRegion\);[\s\S]*?if \(selectedCity && normalize\(org\.city\) !== normalize\(selectedCity\)\) return false;/);
expectMatch("city filter affects organization priority", js, /const selectedCity = getSelectedCityFilter\(selectedRegion\);[\s\S]*?if \(selectedCity && normalize\(org\.city\) === normalize\(selectedCity\)\) return 3;/);
expectMatch("empty organization result names selected city", js, /const locationLabel = getSelectedCityFilter\(state\.selectedRegion\) \? "городе" : "регионе";/);

expectMatch("mobile base result rows stay compact", css, /@media \(max-width: 520px\)[\s\S]*?\.result-row\s*\{[\s\S]*?min-height:\s*64px;/);
expectMatch("mobile org rows grow with wrapped tags", css, /@media \(max-width: 520px\)[\s\S]*?\.result-row--org\s*\{[\s\S]*?height:\s*max-content;[\s\S]*?min-height:\s*128px;[\s\S]*?padding:\s*14px 12px 12px;/);
expectMatch("mobile service rows grow with wrapped text", css, /@media \(max-width: 520px\)[\s\S]*?\.result-row--service\s*\{[\s\S]*?height:\s*max-content;[\s\S]*?min-height:\s*92px;[\s\S]*?padding:\s*14px 12px;/);
expectMatch("mobile review tag hidden", css, /@media \(max-width: 520px\)[\s\S]*?\.tag--reviews \{ display: none; \}/);
expectMatch("mobile reviews become separate text row", css, /@media \(max-width: 520px\)[\s\S]*?\.result-reviews-inline\s*\{[\s\S]*?display:\s*block;/);
expectMatch("mobile browse list has limited scroll area", css, /@media \(max-width: 520px\)[\s\S]*?\.browse-list\s*\{[\s\S]*?max-height:\s*min\(58vh, 430px\);/);
expectMatch("result list allows vertical touch scrolling", css, /\.browse-list\s*\{[\s\S]*?touch-action:\s*pan-y;[\s\S]*?\}[\s\S]*?\.result-row\s*\{[\s\S]*?touch-action:\s*pan-y;/);

expectMatch("touch move guard exists for result cards", js, /function handleResultPointerMove\(event\)/);
expectMatch("touch move guard blocks accidental result click", js, /if \(state\.resultPointerMoved\) \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?return;/);
assert.ok(!/showToast\("Организация выбрана[\s\S]{0,180}elements\.search\.focus/.test(js), "choosing organization should not focus search");
assert.ok(!/showToast\("Услуга выбрана[\s\S]{0,180}elements\.search\.focus/.test(js), "choosing service should not focus search");
assert.ok(!/\$\(("#|')changeSelection[\s\S]{0,500}elements\.search\.focus/.test(js), "change selection should not focus search");

expectMatch("custom service option id exists", js, /const CUSTOM_SERVICE_ID = "service-not-in-catalog";/);
expectMatch("custom organization option id exists", js, /const CUSTOM_ORG_ID = "organization-not-in-catalog";/);
assert.ok(!js.includes("renderMissingServiceRow"), "missing service should not be shown as list row");
assert.ok(!css.includes("result-row--missing"), "missing service row styles should not exist");
expectMatch("catalog problem text becomes selection", js, /function applyCatalogProblemSelection\(text\)/);
expectMatch("not found in services creates custom service", js, /function selectCustomService\(title\)[\s\S]*?state\.selectedServiceId = CUSTOM_SERVICE_ID;/);
expectMatch("not found in organizations creates custom org", js, /function selectCustomOrganization\(name\)[\s\S]*?state\.selectedOrgId = CUSTOM_ORG_ID;/);
expectMatch("custom service payload flag exists", js, /custom: Boolean\(service\.custom\)/);
expectMatch("custom organization payload flag exists", js, /custom: Boolean\(org\.custom\)/);

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
assert.ok(!js.includes("ipwho.is"), "prototype should not call external IP geolocation");
assert.ok(!js.includes("detectLocationByIp"), "region autofill should avoid external IP lookups");
expectMatch("browser timezone region hint remains", js, /function detectRegionByBrowserInfo\(\)/);

assert.ok(!html.includes("YouTube"), "video placeholder should not mention YouTube");
expectMatch("Russian video platforms shown", html, /RuTube, VK Видео, Дзен/);

const noticeIndex = html.indexOf('id="moderationNotice"');
const officialTextIndex = html.indexOf("Если выбрать этот вариант");
const actionsIndex = html.indexOf('class="form-actions"');
assert.ok(noticeIndex > -1, "moderation notice exists");
assert.ok(noticeIndex < officialTextIndex, "moderation notice is under checkbox text");
assert.ok(noticeIndex < actionsIndex, "moderation notice is above submit buttons");

console.log("Static tests passed");

const DEFAULT_REGION_TITLE = "";
const IP_GEOLOCATION_URL = "https://ipwho.is/?lang=ru";
const DRAFT_KEY = "vashkontrol-review-draft-practical";
const RESULTS_LIMIT = 5;

const catalog = {
  regions: [],
  services: [],
  organizations: []
};

// Обязательные параметры оценки: текст и шкалу нельзя менять без согласования продукта и юристов.
const questions = [
  { id: "serviceTime", text: "Время предоставления государственной услуги", icon: "clock" },
  { id: "queueTime", text: "Время ожидания в очереди при получении услуги", icon: "queue" },
  { id: "employee", text: "Вежливость и компетентность сотрудника, взаимодействующего с заявителем при предоставлении государственной услуги", icon: "employee" },
  { id: "info", text: "Доступность информации о порядке предоставления государственной услуги", icon: "info" },
  { id: "comfort", text: "Комфортность условий в помещении, в котором предоставлена государственная услуга", icon: "comfort" }
];

// SVG-иконки храним рядом с вопросами, чтобы не дублировать разметку в HTML.
const icons = {
  clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>`,
  queue: `<svg viewBox="0 0 24 24"><path d="M5 6h14M5 12h14M5 18h9"/><circle cx="18" cy="18" r="2"/></svg>`,
  employee: `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M4 19a5 5 0 0 1 10 0M16 7h4M16 12h4M16 17h3"/></svg>`,
  info: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4M9 11l1.5 1.5L14 9"/></svg>`,
  comfort: `<svg viewBox="0 0 24 24"><path d="M4 14h16v5H4zM6 14V9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v5"/><path d="M8 19v2M16 19v2"/></svg>`
};

const starIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.82 5.72 6.31.92-4.57 4.45 1.08 6.29L12 17.22l-5.64 2.96 1.08-6.29-4.57-4.45 6.31-.92L12 2.8Z"/></svg>`;
const questionHints = {
  serviceTime: "Оцените, насколько быстро услуга была оказана: в срок или с задержкой.",
  queueTime: "Если ожидание было коротким или очереди не было, можно поставить высокую оценку.",
  employee: "Оцените вежливость, понятность объяснений и готовность помочь.",
  info: "Оцените, легко ли было найти понятную информацию о порядке получения услуги.",
  comfort: "Оцените чистоту, удобство ожидания, навигацию и общие условия в помещении."
};

const quickTagsByTab = {
  organizations: ["МФЦ", "Росреестр", "МВД", "СФР", "ФНС", "ЗАГС"],
  services: ["паспорт", "загранпаспорт", "ЕГРН", "пособие", "права", "ИНН"]
};

const IP_LOCATION_ALIASES = {
  moscow: "Москва",
  moskva: "Москва",
  "moscow oblast": "Московская область",
  "moskovskaya oblast": "Московская область",
  "saint petersburg": "Санкт-Петербург",
  "st petersburg": "Санкт-Петербург",
  "sankt peterburg": "Санкт-Петербург",
  orenburg: "Оренбург",
  "orenburg oblast": "Оренбургская область",
  samara: "Самара",
  "samara oblast": "Самарская область",
  kazan: "Казань",
  tatarstan: "Республика Татарстан",
  "republic of tatarstan": "Республика Татарстан",
  novosibirsk: "Новосибирск",
  "novosibirsk oblast": "Новосибирская область",
  yekaterinburg: "Екатеринбург",
  "sverdlovsk oblast": "Свердловская область",
  "nizhny novgorod": "Нижний Новгород",
  krasnodar: "Краснодар",
  "krasnodar krai": "Краснодарский край"
};

const state = {
  searchTab: "organizations",
  selectedRegion: null,
  selectedServiceId: null,
  selectedOrgId: null,
  pendingOrgId: null,
  pendingServiceId: null,
  ratings: Object.fromEntries(questions.map((item) => [item.id, 0])),
  photos: [],
  openHelpId: null,
  regionHighlightIndex: -1,
  regionMatches: [],
  regionTouched: false,
  serviceDate: "",
  dateMin: "",
  dateMax: "",
  datePickerMonth: null,
  catalogsReady: false
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Кэшируем элементы страницы один раз, чтобы функции ниже не искали их повторно.
const elements = {
  form: $("#reviewForm"),
  search: $("#mainSearch"),
  clearSearch: $("#clearSearch"),
  searchTabs: $("#searchTabs"),
  quickTags: $("#quickTags"),
  region: $("#regionInput"),
  clearRegion: $("#clearRegion"),
  regionDropdown: $("#regionDropdown"),
  regionHint: $("#regionHint"),
  receiveType: $("#receiveType"),
  serviceDate: $("#serviceDate"),
  serviceDateButton: $("#serviceDateButton"),
  serviceDateText: $("#serviceDateText"),
  datePicker: $("#datePicker"),
  dateError: $("#dateError"),
  stage: $("#stage"),
  results: $("#searchResults"),
  selectedBox: $("#selectedBox"),
  selectionError: $("#selectionError"),
  selectedServiceName: $("#selectedServiceName"),
  selectedServiceMeta: $("#selectedServiceMeta"),
  selectedOrgName: $("#selectedOrgName"),
  selectedOrgMeta: $("#selectedOrgMeta"),
  ratings: $("#ratings"),
  ratingError: $("#ratingError"),
  comment: $("#comment"),
  commentCounter: $("#commentCounter"),
  photos: $("#photos"),
  photosPreview: $("#photosPreview"),
  photoZone: $("#photoZone"),
  photoError: $("#photoError"),
  video: $("#video"),
  videoError: $("#videoError"),
  officialAnswer: $("#officialAnswer"),
  moderationNotice: $("#moderationNotice"),
  resultDialog: $("#resultDialog"),
  payload: $("#payload"),
  catalogDialog: $("#catalogDialog"),
  toast: $("#toast")
};

init();

async function init() {
  configureDateInput();
  renderRatings();
  renderQuickTags();
  bindEvents();
  renderCatalogLoading();

  try {
    await loadCatalogs();
    state.catalogsReady = true;
  } catch (error) {
    console.error("Не удалось загрузить справочник", error);
    renderCatalogError();
    return;
  }

  restoreDraft();
  if (!state.selectedRegion) tryDetectRegion({ silent: true });
  runSearch();
  updateSelectedBox();
  updateSteps();
  updateCommentCounter();
  updateOfficialAnswerVisibility();
}

async function loadCatalogs() {
  const [regionsResponse, servicesResponse, organizationsResponse] = await Promise.all([
    fetch("./data/regions.json"),
    fetch("./data/services.json"),
    fetch("./data/organizations.json")
  ]);

  if (!regionsResponse.ok || !servicesResponse.ok || !organizationsResponse.ok) {
    throw new Error("Catalog request failed");
  }

  catalog.regions = await regionsResponse.json();
  catalog.services = await servicesResponse.json();
  catalog.organizations = await organizationsResponse.json();
}

function bindEvents() {
  elements.search.addEventListener("input", () => {
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    runSearch();
  });

  elements.clearSearch.addEventListener("click", () => {
    elements.search.value = "";
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    runSearch();
    elements.search.focus();
  });

  elements.searchTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-search-tab]");
    if (!button) return;
    setSearchTab(button.dataset.searchTab);
  });

  elements.quickTags.addEventListener("click", (event) => {
    const button = event.target.closest("[data-query]");
    if (!button) return;
    elements.search.value = button.dataset.query;
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    runSearch();
    elements.search.focus();
  });

  elements.region.addEventListener("input", () => {
    state.regionTouched = true;
    state.selectedRegion = null;
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    renderRegionDropdown(elements.region.value);
    updateRegionHint();
    runSearch();
  });

  elements.region.addEventListener("focus", () => renderRegionDropdown(elements.region.value));
  elements.region.addEventListener("keydown", handleRegionKeydown);
  elements.regionDropdown.addEventListener("click", (event) => {
    const button = event.target.closest("[data-region-id]");
    if (!button) return;
    const region = findRegionById(button.dataset.regionId);
    if (region) selectRegion(region);
  });

  elements.clearRegion.addEventListener("click", () => {
    state.regionTouched = true;
    state.selectedRegion = null;
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    elements.region.value = "";
    closeRegionDropdown();
    updateRegionHint();
    runSearch();
    elements.region.focus();
  });

  elements.receiveType.addEventListener("change", () => {
    dropUnavailableSelection();
    runSearch();
    updateSteps();
  });

  elements.serviceDateButton.addEventListener("click", () => toggleDatePicker());
  elements.datePicker.addEventListener("click", handleDatePickerClick);

  elements.serviceDateButton.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDatePicker();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeRegionDropdown();
      closeDatePicker();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".region-combobox")) closeRegionDropdown();
    if (!event.target.closest(".field--date")) closeDatePicker();
  });

  $$('input[name="searchMode"]').forEach((input) => input.addEventListener("change", () => {
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    dropUnavailableSelection();
    runSearch();
  }));

  elements.results.addEventListener("click", handleResultsClick);

  $("#changeSelection").addEventListener("click", () => {
    state.selectedServiceId = null;
    state.selectedOrgId = null;
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    state.searchTab = "organizations";
    elements.search.value = "";
    elements.selectionError.hidden = true;
    updateSearchTabUi();
    updateSelectedBox();
    runSearch();
    updateSteps();
    elements.search.focus();
  });

  elements.ratings.addEventListener("click", (event) => {
    const helpButton = event.target.closest(".help-dot");
    if (helpButton) {
      toggleHelp(helpButton.closest(".rating-row").dataset.questionId);
      return;
    }
    const button = event.target.closest(".star-btn");
    if (!button) return;
    setRating(button.closest(".rating-row").dataset.questionId, Number(button.dataset.rating));
  });

  elements.ratings.addEventListener("mouseover", (event) => {
    const button = event.target.closest(".star-btn");
    if (!button) return;
    previewStars(button.closest(".rating-row"), Number(button.dataset.rating));
  });

  elements.ratings.addEventListener("mouseout", (event) => {
    if (event.target.closest(".star-btn")) renderRatingState();
  });

  elements.ratings.addEventListener("keydown", (event) => {
    const button = event.target.closest(".star-btn");
    if (!button) return;
    const row = button.closest(".rating-row");
    const current = state.ratings[row.dataset.questionId] || Number(button.dataset.rating) || 1;
    if (["ArrowRight", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      setRating(row.dataset.questionId, Math.min(5, current + 1));
      row.querySelector(`[data-rating="${state.ratings[row.dataset.questionId]}"]`)?.focus();
    }
    if (["ArrowLeft", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      setRating(row.dataset.questionId, Math.max(1, current - 1));
      row.querySelector(`[data-rating="${state.ratings[row.dataset.questionId]}"]`)?.focus();
    }
  });

  elements.comment.addEventListener("input", () => { updateCommentCounter(); updateSteps(); });
  elements.photos.addEventListener("change", () => handleFiles([...elements.photos.files]));
  ["dragenter", "dragover"].forEach((name) => elements.photoZone.addEventListener(name, (event) => {
    event.preventDefault();
    elements.photoZone.classList.add("is-dragover");
  }));
  ["dragleave", "drop"].forEach((name) => elements.photoZone.addEventListener(name, (event) => {
    event.preventDefault();
    elements.photoZone.classList.remove("is-dragover");
  }));
  elements.photoZone.addEventListener("drop", (event) => handleFiles([...event.dataTransfer.files]));

  elements.video.addEventListener("input", () => { elements.videoError.hidden = true; updateSteps(); });
  elements.officialAnswer.addEventListener("change", () => { updateSteps(); updateOfficialAnswerVisibility(); });

  $("#saveDraft").addEventListener("click", saveDraft);
  elements.form.addEventListener("submit", submitForm);
  $("#closeDialog").addEventListener("click", () => elements.resultDialog.close());
  $("#editAgain").addEventListener("click", () => elements.resultDialog.close());
  $("#resetForm").addEventListener("click", resetForm);

  $("#reportCatalogProblem").addEventListener("click", () => elements.catalogDialog.showModal());
  $("#closeCatalogDialog").addEventListener("click", () => elements.catalogDialog.close());
  $("#sendCatalogProblem").addEventListener("click", sendCatalogProblem);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[«»“”.,!?()№:;\/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalize(value).split(" ").filter((token) => token.length > 1);
}

function scoreText(queryTokens, haystackParts) {
  if (!queryTokens.length) return 0;
  const haystack = normalize(haystackParts.flat().filter(Boolean).join(" "));
  const words = haystack.split(" ");
  let score = 0;
  queryTokens.forEach((token) => {
    if (haystack.includes(token)) score += token.length > 3 ? 8 : 4;
    if (words.some((word) => word.startsWith(token))) score += 5;
  });
  return score;
}

function getSearchMode() {
  return $('input[name="searchMode"]:checked')?.value || "any";
}

function byPopularity(a, b) {
  return (b.popularity || 0) - (a.popularity || 0) || (b.reviews || 0) - (a.reviews || 0) || getItemTitle(a).localeCompare(getItemTitle(b), "ru");
}

function getItemTitle(item) {
  return item.name || item.title || "";
}

function setSearchTab(tab) {
  if (!["organizations", "services"].includes(tab) || state.searchTab === tab) return;
  state.searchTab = tab;
  state.pendingOrgId = null;
  state.pendingServiceId = null;
  elements.search.value = "";
  updateSearchTabUi();
  runSearch();
  elements.search.focus();
}

function updateSearchTabUi() {
  elements.searchTabs.querySelectorAll("[data-search-tab]").forEach((button) => {
    const active = button.dataset.searchTab === state.searchTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.search.placeholder = state.searchTab === "organizations"
    ? "Введите организацию: МФЦ, Росреестр, МВД, адрес"
    : "Введите услугу: паспорт, права, ЕГРН, пособие";
  renderQuickTags();
}

function renderQuickTags() {
  elements.quickTags.innerHTML = quickTagsByTab[state.searchTab]
    .map((tag) => `<button type="button" data-query="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
    .join("");
}

function getRegionMatches(query) {
  const normalizedQuery = normalize(query);
  return catalog.regions
    .map((region) => ({ region, score: scoreRegion(region, normalizedQuery) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || byPopularity(a.region, b.region))
    .slice(0, 10)
    .map((item) => item.region);
}

function scoreRegion(region, query) {
  if (!query) return region.popularity || 0;
  const title = normalize(region.title);
  const words = title.split(" ");
  const aliases = (region.aliases || []).map(normalize);

  if (title === query) return 100000 + (region.popularity || 0);
  if (title.startsWith(query)) return 90000 + (region.popularity || 0);
  if (words.some((word) => word.startsWith(query))) return 80000 + (region.popularity || 0);
  if (aliases.some((alias) => alias.startsWith(query))) return 70000 + (region.popularity || 0);
  if (title.includes(query)) return 60000 + (region.popularity || 0);
  if (aliases.some((alias) => alias.includes(query))) return 50000 + (region.popularity || 0);
  return -1;
}

function renderRegionDropdown(query) {
  if (!state.catalogsReady) return;
  state.regionMatches = getRegionMatches(query);
  state.regionHighlightIndex = state.regionMatches.length ? 0 : -1;

  if (!state.regionMatches.length) {
    elements.regionDropdown.innerHTML = `<div class="combo-empty">Ничего не найдено</div>`;
  } else {
    elements.regionDropdown.innerHTML = state.regionMatches.map((region, index) => `
      <button class="combo-option ${index === state.regionHighlightIndex ? "is-active" : ""}" type="button" data-region-id="${region.id}">
        <strong>${escapeHtml(region.title)}</strong>
        <small>${escapeHtml(getRegionMeta(region))}</small>
      </button>
    `).join("");
  }

  elements.regionDropdown.hidden = false;
  elements.region.setAttribute("aria-expanded", "true");
}

function getRegionMeta(region) {
  if (region.type === "city") return `Город, ${region.region}`;
  if (["Москва", "Санкт-Петербург", "Севастополь"].includes(region.title)) return "Город федерального значения";
  return "Регион России";
}

function handleRegionKeydown(event) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (elements.regionDropdown.hidden) renderRegionDropdown(elements.region.value);
    moveRegionHighlight(1);
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (elements.regionDropdown.hidden) renderRegionDropdown(elements.region.value);
    moveRegionHighlight(-1);
  }
  if (event.key === "Enter" && !elements.regionDropdown.hidden) {
    event.preventDefault();
    const region = state.regionMatches[state.regionHighlightIndex];
    if (region) selectRegion(region);
  }
  if (event.key === "Escape") closeRegionDropdown();
}

function moveRegionHighlight(delta) {
  if (!state.regionMatches.length) return;
  state.regionHighlightIndex = (state.regionHighlightIndex + delta + state.regionMatches.length) % state.regionMatches.length;
  renderRegionHighlight();
}

function renderRegionHighlight() {
  elements.regionDropdown.querySelectorAll(".combo-option").forEach((button, index) => {
    button.classList.toggle("is-active", index === state.regionHighlightIndex);
  });
}

function selectRegion(region) {
  state.selectedRegion = region;
  state.regionTouched = true;
  state.pendingOrgId = null;
  state.pendingServiceId = null;
  elements.region.value = region.title;
  closeRegionDropdown();
  updateRegionHint();
  dropUnavailableSelection();
  runSearch();
}

function closeRegionDropdown() {
  elements.regionDropdown.hidden = true;
  elements.region.setAttribute("aria-expanded", "false");
}

function updateRegionHint() {
  const needsChoice = elements.region.value.trim() && !state.selectedRegion;
  elements.regionHint.textContent = needsChoice ? "Нажмите вариант в списке." : "";
  elements.regionHint.hidden = !needsChoice;
}

function findRegionById(id) {
  return catalog.regions.find((region) => region.id === id) || null;
}

function findRegionByValue(value) {
  const normalized = normalize(value);
  if (!normalized) return null;
  return catalog.regions.find((region) => normalize(region.title) === normalized)
    || catalog.regions.find((region) => normalize(region.city) === normalized)
    || catalog.regions.find((region) => normalize(region.region) === normalized)
    || null;
}

function findRegionByParts(city, region) {
  const normalizedCity = normalize(localizeIpLocationPart(city));
  const normalizedRegion = normalize(localizeIpLocationPart(region));

  if (normalizedCity && normalizedRegion) {
    const exactCity = catalog.regions.find((item) =>
      item.city && normalize(item.city) === normalizedCity && normalize(item.region) === normalizedRegion
    );
    if (exactCity) return exactCity;
  }

  if (normalizedRegion) {
    const exactRegion = catalog.regions.find((item) => item.type === "region" && normalize(item.region) === normalizedRegion);
    if (exactRegion) return exactRegion;
  }

  if (normalizedCity) {
    return catalog.regions.find((item) => item.city && normalize(item.city) === normalizedCity)
      || catalog.regions.find((item) => item.type === "region" && normalize(item.region) === normalizedCity)
      || null;
  }

  return null;
}

function localizeIpLocationPart(value) {
  const key = normalize(value);
  return IP_LOCATION_ALIASES[key] || value || "";
}

function isFederalOrganization(org) {
  return org.regionScope === "federal" || org.region === "Федеральный уровень";
}

function canShowFederalOrganization() {
  return elements.receiveType.value === "online";
}

function isOrgAvailableForRegion(org, selectedRegion) {
  if (isFederalOrganization(org)) return canShowFederalOrganization();
  if (!selectedRegion?.region) return true;
  return normalize(org.region) === normalize(selectedRegion.region);
}

function getOrgRegionPriority(org, selectedRegion) {
  if (!selectedRegion?.region) return 0;
  if (selectedRegion.city && normalize(org.city) === normalize(selectedRegion.city)) return 3;
  if (normalize(org.region) === normalize(selectedRegion.region)) return 2;
  if (isFederalOrganization(org) && canShowFederalOrganization()) return 1;
  return 0;
}

function getVisibleOrganizations(serviceId = null) {
  const mode = getSearchMode();
  const selectedRegion = state.selectedRegion;

  return catalog.organizations
    .filter((org) => {
      if (mode === "mfc" && org.type !== "mfc") return false;
      if (mode === "department" && org.type !== "department") return false;
      if (serviceId && !org.services.includes(serviceId)) return false;
      if (!isOrgAvailableForRegion(org, selectedRegion)) return false;
      return true;
    })
    .sort((a, b) => getOrgRegionPriority(b, selectedRegion) - getOrgRegionPriority(a, selectedRegion) || byPopularity(a, b));
}

function getVisibleServices(orgId = null) {
  const org = orgId ? getOrganization(orgId) : null;
  return catalog.services
    .filter((service) => {
      if (org) return org.services.includes(service.id);
      return getVisibleOrganizations(service.id).length > 0;
    })
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0) || a.title.localeCompare(b.title, "ru"));
}

function searchOrganizations(query, serviceId = null) {
  const tokens = tokenize(query);
  return getVisibleOrganizations(serviceId)
    .map((org) => ({ org, score: tokens.length ? scoreOrganization(org, tokens) : 0 }))
    .filter((item) => !tokens.length || item.score > 0)
    .sort((a, b) => b.score - a.score || getOrgRegionPriority(b.org, state.selectedRegion) - getOrgRegionPriority(a.org, state.selectedRegion) || byPopularity(a.org, b.org))
    .map((item) => item.org);
}

function scoreOrganization(org, tokens) {
  const serviceParts = org.services
    .map(getService)
    .filter(Boolean)
    .flatMap((service) => [service.title, service.category, service.code, service.synonyms]);
  return scoreText(tokens, [org.name, org.agency, org.address, org.region, org.city, org.aliases, serviceParts]);
}

function searchServices(query, orgId = null) {
  const tokens = tokenize(query);
  return getVisibleServices(orgId)
    .map((service) => ({ service, score: tokens.length ? scoreText(tokens, [service.title, service.category, service.code, service.synonyms]) : 0 }))
    .filter((item) => !tokens.length || item.score > 0)
    .sort((a, b) => b.score - a.score || (b.service.popularity || 0) - (a.service.popularity || 0) || a.service.title.localeCompare(b.service.title, "ru"))
    .map((item) => item.service);
}

function renderCatalogLoading() {
  elements.results.innerHTML = `<div class="empty-result">Загружаем справочник услуг и организаций...</div>`;
}

function renderCatalogError() {
  elements.results.innerHTML = `<div class="empty-result empty-result--error">Не удалось загрузить справочник. Запустите проект через локальный сервер: uv run python -m http.server 8000</div>`;
}

function runSearch() {
  if (!state.catalogsReady) return;

  if (state.selectedServiceId && state.selectedOrgId) {
    elements.results.innerHTML = "";
    return;
  }

  if (state.pendingOrgId) {
    renderOrgServices();
    return;
  }

  if (state.pendingServiceId) {
    renderServiceOrganizations();
    return;
  }

  if (state.searchTab === "organizations") {
    renderOrganizationSearch();
  } else {
    renderServiceSearch();
  }
}

function renderOrganizationSearch() {
  const query = elements.search.value.trim();
  const selectedService = getSelectedService();

  if (!state.selectedRegion && !query && !selectedService) {
    elements.results.innerHTML = `<div class="empty-result">Выберите регион, чтобы увидеть организации рядом с вами.</div>`;
    return;
  }

  const orgs = searchOrganizations(query, selectedService?.id).slice(0, RESULTS_LIMIT);
  if (!orgs.length) {
    elements.results.innerHTML = `<div class="empty-result">В выбранном регионе ничего не найдено. Попробуйте другое название или нажмите «Не нашёл в списке».</div>`;
    return;
  }

  elements.results.innerHTML = `
    <div class="results-head">
      <h3>${selectedService ? "Организации для выбранной услуги" : "Организации"}</h3>
      <p>${selectedService ? `Услуга выбрана: ${escapeHtml(selectedService.title)}. Выберите организацию.` : "Выберите организацию, где получали услугу."}</p>
    </div>
    <div class="browse-list">
      ${orgs.map((org) => renderOrgRow(org, { action: selectedService ? "select-org" : "pick-org", serviceId: selectedService?.id || "" })).join("")}
    </div>
  `;
}

function renderServiceSearch() {
  const query = elements.search.value.trim();
  const selectedOrg = getSelectedOrg();
  const services = searchServices(query, selectedOrg?.id).slice(0, RESULTS_LIMIT);
  const note = !state.selectedRegion && !selectedOrg
    ? `<div class="empty-result empty-result--soft">Можно искать услугу сразу, но регион поможет показать подходящие организации.</div>`
    : "";

  if (!services.length) {
    elements.results.innerHTML = `${note}<div class="empty-result">Ничего не найдено. Попробуйте обычное название услуги: «паспорт», «права», «ЕГРН», «пособие».</div>`;
    return;
  }

  elements.results.innerHTML = `
    ${note}
    <div class="results-head">
      <h3>${selectedOrg ? "Услуги в выбранной организации" : "Услуги"}</h3>
      <p>${selectedOrg ? `Организация выбрана: ${escapeHtml(selectedOrg.name)}. Выберите услугу.` : "Выберите услугу, затем организацию."}</p>
    </div>
    <div class="browse-list">
      ${services.map((service) => renderServiceRow(service, { action: selectedOrg ? "select-service" : "pick-service", orgId: selectedOrg?.id || "" })).join("")}
    </div>
  `;
}

function renderOrgServices() {
  const org = getOrganization(state.pendingOrgId);
  if (!org) {
    state.pendingOrgId = null;
    runSearch();
    return;
  }

  const services = getVisibleServices(org.id);
  elements.results.innerHTML = `
    <div class="results-head results-head--stack">
      <button class="text-btn" type="button" data-back="organizations">← Назад к организациям</button>
      <div>
        <h3>${escapeHtml(org.name)}</h3>
        <p>Выберите услугу в этой организации.</p>
      </div>
    </div>
    <div class="browse-list">
      ${services.map((service) => renderServiceRow(service, { action: "select-service", orgId: org.id })).join("")}
    </div>
  `;
}

function renderServiceOrganizations() {
  const service = getService(state.pendingServiceId);
  if (!service) {
    state.pendingServiceId = null;
    runSearch();
    return;
  }

  const orgs = getVisibleOrganizations(service.id).slice(0, RESULTS_LIMIT);
  const content = orgs.length
    ? `<div class="browse-list">${orgs.map((org) => renderOrgRow(org, { action: "select-org", serviceId: service.id })).join("")}</div>`
    : `<div class="empty-result">Эта услуга пока не связана с организациями выбранного региона.</div>`;

  elements.results.innerHTML = `
    <div class="results-head results-head--stack">
      <button class="text-btn" type="button" data-back="services">← Назад к услугам</button>
      <div>
        <h3>${escapeHtml(service.title)}</h3>
        <p>Выберите организацию, где получали услугу.</p>
      </div>
    </div>
    ${content}
  `;
}

function renderOrgRow(org, { action, serviceId = "" } = {}) {
  const location = [org.city, org.address].filter(Boolean).join(", ") || org.region;
  const onlineTag = isFederalOrganization(org) ? `<span class="tag tag--green">Онлайн</span>` : "";
  return `
    <button class="result-row result-row--org" type="button" data-action="${action}" data-org-id="${org.id}" data-service-id="${serviceId}">
      <span>
        <strong>${escapeHtml(org.name)}</strong>
        <small>${escapeHtml(location)}</small>
        <span class="result-tags">
          <span class="tag tag--green">${org.type === "mfc" ? "МФЦ" : "Ведомство"}</span>
          ${onlineTag}
          <span class="tag">${escapeHtml(org.region)}</span>
          <span class="tag">${org.reviews} отзывов</span>
        </span>
      </span>
    </button>
  `;
}

function renderServiceRow(service, { action, orgId = "" } = {}) {
  return `
    <button class="result-row result-row--service" type="button" data-action="${action}" data-service-id="${service.id}" data-org-id="${orgId}">
      <span>
        <strong>${escapeHtml(service.title)}</strong>
        <small>${escapeHtml(service.category)}${service.code ? ` · код услуги: ${escapeHtml(service.code)}` : ""}</small>
      </span>
    </button>
  `;
}

function handleResultsClick(event) {
  const backButton = event.target.closest("[data-back]");
  if (backButton) {
    if (backButton.dataset.back === "organizations") {
      state.pendingOrgId = null;
      state.searchTab = "organizations";
    } else {
      state.pendingServiceId = null;
      state.searchTab = "services";
    }
    updateSearchTabUi();
    runSearch();
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "pick-org") {
    state.selectedOrgId = button.dataset.orgId;
    state.selectedServiceId = null;
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    state.searchTab = "services";
    elements.search.value = "";
    elements.selectionError.hidden = true;
    updateSearchTabUi();
    updateSelectedBox();
    runSearch();
    updateSteps();
    showToast("Организация выбрана. Теперь выберите услугу");
    elements.search.focus();
  }

  if (button.dataset.action === "pick-service") {
    state.selectedServiceId = button.dataset.serviceId;
    state.selectedOrgId = null;
    state.pendingServiceId = null;
    state.pendingOrgId = null;
    state.searchTab = "organizations";
    elements.search.value = "";
    elements.selectionError.hidden = true;
    updateSearchTabUi();
    updateSelectedBox();
    runSearch();
    updateSteps();
    showToast("Услуга выбрана. Теперь выберите организацию");
    elements.search.focus();
  }

  if (button.dataset.action === "select-service") {
    selectPair(button.dataset.serviceId, button.dataset.orgId || state.selectedOrgId);
  }

  if (button.dataset.action === "select-org") {
    selectPair(button.dataset.serviceId || state.selectedServiceId, button.dataset.orgId);
  }
}

function selectPair(serviceId, orgId) {
  if (!serviceId || !orgId) return;
  state.selectedServiceId = serviceId;
  state.selectedOrgId = orgId;
  state.pendingOrgId = null;
  state.pendingServiceId = null;
  elements.selectionError.hidden = true;
  updateSelectedBox();
  runSearch();
  updateSteps();
  showToast("Услуга и организация выбраны");
}

function dropUnavailableSelection() {
  if (!state.selectedOrgId) return;
  const org = getOrganization(state.selectedOrgId);
  if (!org || !isOrgAvailableForRegion(org, state.selectedRegion)) {
    state.selectedServiceId = null;
    state.selectedOrgId = null;
    updateSelectedBox();
  }
}

function updateSelectedBox() {
  const service = getSelectedService();
  const org = getSelectedOrg();
  const hasSelection = Boolean(service || org);

  if (!hasSelection) {
    elements.selectedServiceName.textContent = "";
    elements.selectedServiceMeta.textContent = "";
    elements.selectedOrgName.textContent = "";
    elements.selectedOrgMeta.textContent = "";
    elements.selectedBox.hidden = true;
    return;
  }

  elements.selectedServiceName.textContent = service ? service.title : "Выберите услугу во вкладке «Услуги»";
  elements.selectedServiceMeta.textContent = service
    ? `${service.category} · код услуги: ${service.code}`
    : "Организация уже выбрана";
  elements.selectedOrgName.textContent = org ? org.name : "Выберите организацию во вкладке «Организации»";
  elements.selectedOrgMeta.textContent = org
    ? `${org.type === "mfc" ? "МФЦ" : org.agency} · ${[org.city, org.address].filter(Boolean).join(", ") || org.region}`
    : "Услуга уже выбрана";
  elements.selectedBox.querySelector(".selected-box__item--service")?.classList.toggle("is-missing", !service);
  elements.selectedBox.querySelector(".selected-box__item--org")?.classList.toggle("is-missing", !org);
  elements.selectedBox.hidden = false;
}

function configureDateInput() {
  const today = new Date();
  state.dateMin = formatDate(addYears(today, -3));
  state.dateMax = formatDate(today);
  state.serviceDate = state.serviceDate || state.dateMax;
  elements.serviceDate.min = state.dateMin;
  elements.serviceDate.max = state.dateMax;
  setServiceDate(state.serviceDate, { silent: true });
}

function setServiceDate(value, { silent = false } = {}) {
  state.serviceDate = value;
  elements.serviceDate.value = value;
  elements.serviceDateText.textContent = formatDisplayDate(value);
  if (!silent) {
    elements.dateError.hidden = true;
    updateSteps();
  }
}

function toggleDatePicker() {
  if (elements.datePicker.hidden) openDatePicker();
  else closeDatePicker();
}

function openDatePicker() {
  state.datePickerMonth = startOfMonth(parseIsoDate(state.serviceDate));
  renderDatePicker();
  elements.datePicker.hidden = false;
  elements.serviceDateButton.setAttribute("aria-expanded", "true");
}

function closeDatePicker() {
  elements.datePicker.hidden = true;
  elements.serviceDateButton.setAttribute("aria-expanded", "false");
}

function renderDatePicker() {
  const month = state.datePickerMonth || startOfMonth(parseIsoDate(state.serviceDate));
  const monthLabel = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(month);
  const minMonth = startOfMonth(parseIsoDate(state.dateMin));
  const maxMonth = startOfMonth(parseIsoDate(state.dateMax));
  const canPrev = month > minMonth;
  const canNext = month < maxMonth;

  elements.datePicker.innerHTML = `
    <div class="date-picker__head">
      <button type="button" data-month="-1" ${canPrev ? "" : "disabled"} aria-label="Предыдущий месяц">‹</button>
      <strong>${escapeHtml(monthLabel)}</strong>
      <button type="button" data-month="1" ${canNext ? "" : "disabled"} aria-label="Следующий месяц">›</button>
    </div>
    <div class="date-picker__week" aria-hidden="true">
      ${["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="date-picker__grid">
      ${renderDateDays(month)}
    </div>
  `;
}

function renderDateDays(month) {
  const firstDay = startOfMonth(month);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startOffset; i++) cells.push(`<span class="date-picker__blank"></span>`);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const iso = formatDate(date);
    const disabled = isDateDisabled(iso);
    const selected = iso === state.serviceDate;
    cells.push(`
      <button type="button" data-date="${iso}" class="${selected ? "is-selected" : ""}" ${disabled ? "disabled" : ""}>
        ${day}
      </button>
    `);
  }

  return cells.join("");
}

function handleDatePickerClick(event) {
  const monthButton = event.target.closest("[data-month]");
  if (monthButton) {
    state.datePickerMonth = addMonths(state.datePickerMonth, Number(monthButton.dataset.month));
    renderDatePicker();
    return;
  }

  const dayButton = event.target.closest("[data-date]");
  if (!dayButton || dayButton.disabled) return;
  setServiceDate(dayButton.dataset.date);
  closeDatePicker();
}

function isDateDisabled(value) {
  return value > state.dateMax || value < state.dateMin;
}

function addYears(date, years) {
  const copy = new Date(date);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseIsoDate(value) {
  return new Date(`${value}T00:00:00`);
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(parseIsoDate(value));
}

function validateServiceDate() {
  const value = elements.serviceDate.value;
  if (!value) return true;

  if (value > state.dateMax) {
    elements.dateError.textContent = "Нельзя выбрать дату в будущем.";
    elements.dateError.hidden = false;
    return false;
  }
  if (value < state.dateMin) {
    elements.dateError.textContent = "Выберите дату не старше 3 лет.";
    elements.dateError.hidden = false;
    return false;
  }
  elements.dateError.hidden = true;
  return true;
}

function renderRatings() {
  elements.ratings.innerHTML = questions.map((question) => `
    <div class="rating-row" data-question-id="${question.id}">
      <div class="rating-question">
        <span class="question-icon" aria-hidden="true">${icons[question.icon]}</span>
        <p>${escapeHtml(question.text)}</p>
        <button class="help-dot" type="button" aria-expanded="false" aria-controls="hint-${question.id}" aria-label="Подсказка по параметру">?</button>
      </div>
      <div class="stars" role="radiogroup" aria-label="${escapeHtml(question.text)}">
        ${[1, 2, 3, 4, 5].map((rating) => `
          <button class="star-btn" type="button" role="radio" aria-checked="false" data-rating="${rating}" aria-label="${rating} из 5">${starIcon}</button>
        `).join("")}
      </div>
      <div class="rating-help" id="hint-${question.id}" hidden>${escapeHtml(questionHints[question.id] || "")}</div>
    </div>
  `).join("");
  renderRatingState();
}

function setRating(id, value) {
  state.ratings[id] = value;
  elements.ratingError.hidden = true;
  document.querySelector(`[data-question-id="${id}"]`)?.classList.remove("has-error");
  renderRatingState();
  updateSteps();
}

function previewStars(row, value) {
  row.querySelectorAll(".star-btn").forEach((button) => {
    button.classList.toggle("is-preview", Number(button.dataset.rating) <= value);
  });
}

function renderRatingState() {
  $$(".rating-row").forEach((row) => {
    const rating = state.ratings[row.dataset.questionId] || 0;
    row.querySelectorAll(".star-btn").forEach((button) => {
      const current = Number(button.dataset.rating);
      button.classList.toggle("is-selected", current <= rating);
      button.classList.remove("is-preview");
      button.setAttribute("aria-checked", current === rating ? "true" : "false");
      button.tabIndex = current === (rating || 1) ? 0 : -1;
    });
  });
}

function toggleHelp(id) {
  state.openHelpId = state.openHelpId === id ? null : id;
  $$(".rating-row").forEach((row) => {
    const isOpen = row.dataset.questionId === state.openHelpId;
    row.querySelector(".rating-help").hidden = !isOpen;
    row.querySelector(".help-dot")?.setAttribute("aria-expanded", String(isOpen));
  });
}

function handleFiles(files) {
  elements.photoError.hidden = true;
  const images = files.filter((file) => file.type.startsWith("image/"));
  const tooBig = images.some((file) => file.size > 5 * 1024 * 1024);
  if (tooBig || state.photos.length + images.length > 5) {
    elements.photoError.hidden = false;
    elements.photos.value = "";
    return;
  }

  images.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      state.photos.push({ name: file.name, size: file.size, dataUrl: reader.result });
      renderPhotos();
      updateSteps();
    };
    reader.readAsDataURL(file);
  });
  elements.photos.value = "";
}

function renderPhotos() {
  elements.photosPreview.innerHTML = state.photos.map((photo, index) => `
    <div class="photo-thumb">
      <img src="${photo.dataUrl}" alt="${escapeHtml(photo.name)}" />
      <button type="button" data-remove-photo="${index}" aria-label="Удалить фото">×</button>
    </div>
  `).join("");
  elements.photosPreview.querySelectorAll("[data-remove-photo]").forEach((button) => {
    button.addEventListener("click", () => {
      state.photos.splice(Number(button.dataset.removePhoto), 1);
      renderPhotos();
      updateSteps();
    });
  });
}

function validateForm() {
  let valid = true;
  if (!state.selectedServiceId || !state.selectedOrgId) {
    elements.selectionError.hidden = false;
    document.querySelector(".search-card").scrollIntoView({ block: "start", behavior: "smooth" });
    valid = false;
  }

  if (!validateServiceDate()) {
    if (valid) elements.serviceDateButton.focus();
    valid = false;
  }

  const missing = Object.entries(state.ratings).filter(([, value]) => value === 0).map(([id]) => id);
  if (missing.length) {
    elements.ratingError.hidden = false;
    missing.forEach((id) => document.querySelector(`[data-question-id="${id}"]`)?.classList.add("has-error"));
    if (valid) document.querySelector(".rating-card").scrollIntoView({ block: "start", behavior: "smooth" });
    valid = false;
  }

  if (elements.video.value.trim() && !isValidUrl(elements.video.value.trim())) {
    elements.videoError.hidden = false;
    if (valid) elements.video.focus();
    valid = false;
  }
  return valid;
}

function submitForm(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const payload = buildPayload("submitted");
  console.log("Отзыв отправлен", payload);
  elements.payload.textContent = JSON.stringify(payload, null, 2);
  elements.resultDialog.showModal();
  localStorage.removeItem(DRAFT_KEY);
}

function saveDraft() {
  const payload = buildPayload("draft");
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ payload, statePhotos: state.photos }));
  showToast("Черновик сохранён в браузере");
}

function restoreDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (!saved?.payload) return;
    state.selectedServiceId = null;
    state.selectedOrgId = null;
    state.pendingOrgId = null;
    state.pendingServiceId = null;
    state.ratings = { ...state.ratings, ...(saved.payload.ratings || {}) };
    state.photos = Array.isArray(saved.statePhotos) ? saved.statePhotos : [];
    state.selectedRegion = findRegionById(saved.payload.region?.id) || findRegionByValue(saved.payload.regionText || saved.payload.region?.title || saved.payload.region || "");
    if (state.selectedRegion) elements.region.value = state.selectedRegion.title;
    elements.comment.value = saved.payload.comment || "";
    elements.video.value = saved.payload.video || "";
    setServiceDate(saved.payload.serviceDate || state.serviceDate, { silent: true });
    elements.stage.value = saved.payload.stage || "service_received";
    elements.receiveType.value = saved.payload.receiveType || "offline";
    elements.officialAnswer.checked = Boolean(saved.payload.officialAnswer);
    renderPhotos();
    renderRatingState();
  } catch (error) {
    console.warn("Не удалось восстановить черновик", error);
  }
}

function resetForm() {
  state.selectedServiceId = null;
  state.selectedOrgId = null;
  state.pendingOrgId = null;
  state.pendingServiceId = null;
  state.searchTab = "organizations";
  state.selectedRegion = null;
  state.regionTouched = false;
  state.ratings = Object.fromEntries(questions.map((item) => [item.id, 0]));
  state.photos = [];
  elements.form.reset();
  elements.region.value = DEFAULT_REGION_TITLE;
  elements.receiveType.value = "offline";
  configureDateInput();
  elements.stage.value = "service_received";
  localStorage.removeItem(DRAFT_KEY);
  renderQuickTags();
  updateSearchTabUi();
  updateRegionHint();
  renderPhotos();
  renderRatingState();
  updateSelectedBox();
  runSearch();
  updateSteps();
  updateCommentCounter();
  updateOfficialAnswerVisibility();
  elements.resultDialog.close();
  showToast("Форма очищена");
}

function sendCatalogProblem() {
  const text = $("#catalogProblemText").value.trim();
  console.log("Сообщение о проблеме со справочником", {
    text,
    search: elements.search.value,
    region: state.selectedRegion,
    regionText: elements.region.value,
    createdAt: new Date().toISOString()
  });
  elements.catalogDialog.close();
  $("#catalogProblemText").value = "";
  showToast("Сообщение отправлено");
}

function buildPayload(status) {
  const service = getSelectedService();
  const org = getSelectedOrg();
  return {
    status,
    source: "site-form",
    authorizedVia: "ЕСИА / Госуслуги",
    createdAt: new Date().toISOString(),
    stage: elements.stage.value,
    receiveType: elements.receiveType.value,
    region: state.selectedRegion ? {
      id: state.selectedRegion.id,
      type: state.selectedRegion.type,
      title: state.selectedRegion.title,
      region: state.selectedRegion.region,
      city: state.selectedRegion.city
    } : null,
    regionText: elements.region.value.trim(),
    serviceDate: elements.serviceDate.value,
    service: service ? { id: service.id, title: service.title, code: service.code, category: service.category } : null,
    organization: org ? { id: org.id, type: org.type, name: org.name, agency: org.agency, region: org.region, city: org.city, address: org.address } : null,
    ratings: { ...state.ratings },
    comment: elements.comment.value.trim(),
    photos: state.photos.map((photo) => ({ name: photo.name, size: photo.size })),
    video: elements.video.value.trim(),
    officialAnswer: elements.officialAnswer.checked
  };
}

function updateSteps() {
  const selected = Boolean(state.selectedServiceId && state.selectedOrgId);
  const hasPartialSelection = Boolean(state.selectedServiceId || state.selectedOrgId);
  const ratingsDone = Object.values(state.ratings).every(Boolean);

  setStep(1, selected ? "done" : hasPartialSelection ? "active" : "");
  setStep(2, selected ? (ratingsDone ? "done" : "active") : "");
  setStep(3, selected && ratingsDone ? "done" : "");
  setStep(4, selected && ratingsDone ? "active" : "");
}

function setStep(index, status) {
  const step = document.querySelector(`.step:nth-child(${index})`);
  step.classList.toggle("is-done", status === "done");
  step.classList.toggle("is-active", status === "active");
}

function getService(id) {
  return catalog.services.find((service) => service.id === id) || null;
}

function getOrganization(id) {
  return catalog.organizations.find((org) => org.id === id) || null;
}

function getSelectedService() {
  return getService(state.selectedServiceId);
}

function getSelectedOrg() {
  return getOrganization(state.selectedOrgId);
}

function updateOfficialAnswerVisibility() {
  elements.moderationNotice.hidden = !elements.officialAnswer.checked;
}

function updateCommentCounter() {
  elements.commentCounter.textContent = elements.comment.value.length;
}

async function tryDetectRegion({ silent } = {}) {
  if (!canAutofillRegion()) return;

  const detectedByIp = await detectLocationByIp();
  if (detectedByIp && canAutofillRegion()) {
    setDetectedRegion(detectedByIp, "ip", silent);
    return;
  }

  const detectedByBrowser = detectRegionByBrowserInfo();
  const browserRegion = detectedByBrowser ? findRegionByValue(detectedByBrowser) : null;
  if (browserRegion && canAutofillRegion()) setDetectedRegion(browserRegion, "browser", silent);
}

function canAutofillRegion() {
  return !state.regionTouched && !state.selectedRegion && !elements.region.value.trim();
}

function setDetectedRegion(region, source, silent) {
  state.selectedRegion = region;
  elements.region.value = region.title;
  elements.regionHint.textContent = source === "ip"
    ? "Регион подставлен по IP. Можно изменить."
    : "Регион подставлен автоматически. Можно изменить.";
  elements.regionHint.hidden = false;
  if (!silent) showToast("Регион подставлен автоматически");
  runSearch();
}

async function detectLocationByIp() {
  if (!window.fetch || !window.AbortController) return null;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 1800);

  try {
    const response = await fetch(IP_GEOLOCATION_URL, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.success === false || data.country_code !== "RU") return null;

    const region = data.region || data.regionName || data.region_name || "";
    const city = data.city || "";
    const match = findRegionByParts(city, region);
    if (match) return match;

    const detectedRegion = detectRegionByCoordinates(Number(data.latitude), Number(data.longitude));
    return detectedRegion ? findRegionByValue(detectedRegion) : null;
  } catch (error) {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function detectRegionByBrowserInfo() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const map = {
    "Asia/Yekaterinburg": "Оренбургская область",
    "Europe/Moscow": "Москва",
    "Europe/Samara": "Самарская область",
    "Asia/Novosibirsk": "Новосибирская область",
    "Asia/Krasnoyarsk": "Красноярский край",
    "Asia/Irkutsk": "Иркутская область",
    "Asia/Vladivostok": "Приморский край"
  };
  return map[timezone] || "";
}

function detectRegionByCoordinates(lat, lon) {
  const boxes = [
    { region: "Оренбургская область", minLat: 50.4, maxLat: 54.0, minLon: 50.7, maxLon: 61.7 },
    { region: "Москва", minLat: 55.1, maxLat: 56.1, minLon: 36.8, maxLon: 38.3 },
    { region: "Московская область", minLat: 54.2, maxLat: 56.9, minLon: 35.1, maxLon: 40.3 },
    { region: "Самарская область", minLat: 51.7, maxLat: 54.7, minLon: 47.9, maxLon: 52.7 },
    { region: "Республика Татарстан", minLat: 53.9, maxLat: 56.9, minLon: 47.2, maxLon: 54.3 },
    { region: "Санкт-Петербург", minLat: 59.6, maxLat: 60.3, minLon: 29.4, maxLon: 30.8 }
  ];
  return boxes.find((box) => lat >= box.minLat && lat <= box.maxLat && lon >= box.minLon && lon <= box.maxLon)?.region || "";
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

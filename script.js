const DEFAULT_REGION = "Оренбургская область";
const IP_GEOLOCATION_URL = "https://ipwho.is/?lang=ru";

// Тестовый справочник услуг: в прототипе он заменяет данные, которые обычно приходят с сервера.
const services = [
  {
    id: "passport-rf",
    title: "Выдача или замена паспорта гражданина РФ",
    code: "МВД-001",
    category: "МВД",
    popularity: 990,
    synonyms: ["паспорт", "замена паспорта", "получить паспорт", "паспортный стол", "мвд", "овм"]
  },
  {
    id: "foreign-passport",
    title: "Оформление заграничного паспорта",
    code: "МВД-002",
    category: "МВД",
    popularity: 940,
    synonyms: ["загранпаспорт", "заграничный паспорт", "паспорт за границу", "мвд", "овм"]
  },
  {
    id: "egrn",
    title: "Государственный кадастровый учёт и регистрация прав",
    code: "РР-001",
    category: "Росреестр",
    popularity: 920,
    synonyms: ["росреестр", "егрн", "недвижимость", "кадастр", "земля", "квартира", "регистрация права", "выписка егрн"]
  },
  {
    id: "sfr-payment",
    title: "Назначение ежемесячной социальной выплаты",
    code: "СФР-001",
    category: "СФР",
    popularity: 900,
    synonyms: ["пособие", "выплата", "пенсия", "сфр", "социальный фонд", "маткапитал", "материнский капитал"]
  },
  {
    id: "driver-license",
    title: "Получение или замена водительского удостоверения",
    code: "ГИБДД-001",
    category: "ГИБДД",
    popularity: 880,
    synonyms: ["права", "водительские права", "водительское удостоверение", "гибдд", "замена прав"]
  },
  {
    id: "registration-home",
    title: "Регистрационный учёт по месту жительства или пребывания",
    code: "МВД-003",
    category: "МВД",
    popularity: 850,
    synonyms: ["регистрация", "прописка", "временная регистрация", "место жительства", "место пребывания"]
  },
  {
    id: "snils",
    title: "Регистрация в системе индивидуального учёта и выдача СНИЛС",
    code: "СФР-002",
    category: "СФР",
    popularity: 815,
    synonyms: ["снилс", "страховой номер", "социальный фонд", "сфр", "пенсионный"]
  },
  {
    id: "inn",
    title: "Постановка физического лица на учёт в налоговом органе",
    code: "ФНС-001",
    category: "ФНС",
    popularity: 790,
    synonyms: ["инн", "налоговая", "фнс", "учет в налоговой", "свидетельство инн"]
  },
  {
    id: "vehicle-registration",
    title: "Регистрация транспортного средства",
    code: "ГИБДД-002",
    category: "ГИБДД",
    popularity: 770,
    synonyms: ["регистрация автомобиля", "поставить на учет", "машина", "авто", "гибдд", "мрэо"]
  },
  {
    id: "criminal-record",
    title: "Получение справки об отсутствии судимости",
    code: "МВД-004",
    category: "МВД",
    popularity: 730,
    synonyms: ["справка о судимости", "отсутствие судимости", "судимость", "мвд"]
  },
  {
    id: "birth-record",
    title: "Государственная регистрация рождения",
    code: "ЗАГС-001",
    category: "ЗАГС",
    popularity: 700,
    synonyms: ["загс", "рождение", "свидетельство о рождении", "ребенок", "регистрация рождения"]
  },
  {
    id: "marriage-record",
    title: "Государственная регистрация заключения брака",
    code: "ЗАГС-002",
    category: "ЗАГС",
    popularity: 680,
    synonyms: ["загс", "брак", "свадьба", "регистрация брака", "женитьба"]
  },
  {
    id: "child-benefit",
    title: "Назначение пособия на ребёнка",
    code: "СОЦ-001",
    category: "Социальная защита",
    popularity: 650,
    synonyms: ["детское пособие", "ребенок", "выплата", "соцзащита", "семья", "пособие"]
  },
  {
    id: "housing-subsidy",
    title: "Предоставление субсидии на оплату жилого помещения и коммунальных услуг",
    code: "СОЦ-002",
    category: "Социальная защита",
    popularity: 610,
    synonyms: ["субсидия", "жкх", "коммунальные", "кварплата", "соцзащита"]
  },
  {
    id: "ip-registration",
    title: "Государственная регистрация индивидуального предпринимателя",
    code: "ФНС-002",
    category: "ФНС",
    popularity: 560,
    synonyms: ["ип", "предприниматель", "регистрация ип", "бизнес", "фнс", "налоговая"]
  },
  {
    id: "village-book",
    title: "Выдача выписки из похозяйственной книги",
    code: "001",
    category: "Муниципальная услуга",
    popularity: 520,
    synonyms: ["выписка", "похозяйственная книга", "справка из администрации", "муниципальная справка"]
  },
  {
    id: "building-permit",
    title: "Выдача разрешения на строительство",
    code: "МУН-002",
    category: "Муниципальная услуга",
    popularity: 430,
    synonyms: ["строительство", "разрешение", "дом", "администрация", "муниципальная услуга"]
  },
  {
    id: "land-plot",
    title: "Предоставление земельного участка",
    code: "МУН-003",
    category: "Муниципальная услуга",
    popularity: 390,
    synonyms: ["земля", "земельный участок", "администрация", "муниципальная услуга", "участок"]
  }
];

// Статический справочник локаций для поля региона. Полный реестр МФЦ и ведомств обычно приходит с сервера.
const russianLocations = [
  { region: "Федеральный уровень", cities: [] },
  { region: "Республика Адыгея", cities: ["Майкоп"] },
  { region: "Республика Алтай", cities: ["Горно-Алтайск"] },
  { region: "Республика Башкортостан", cities: ["Уфа", "Стерлитамак", "Салават", "Нефтекамск", "Октябрьский"] },
  { region: "Республика Бурятия", cities: ["Улан-Удэ"] },
  { region: "Республика Дагестан", cities: ["Махачкала", "Дербент", "Хасавюрт"] },
  { region: "Донецкая Народная Республика", cities: ["Донецк", "Мариуполь", "Макеевка"] },
  { region: "Республика Ингушетия", cities: ["Магас", "Назрань"] },
  { region: "Кабардино-Балкарская Республика", cities: ["Нальчик"] },
  { region: "Республика Калмыкия", cities: ["Элиста"] },
  { region: "Карачаево-Черкесская Республика", cities: ["Черкесск"] },
  { region: "Республика Карелия", cities: ["Петрозаводск"] },
  { region: "Республика Коми", cities: ["Сыктывкар", "Ухта", "Воркута"] },
  { region: "Республика Крым", cities: ["Симферополь", "Керчь", "Ялта", "Евпатория"] },
  { region: "Луганская Народная Республика", cities: ["Луганск", "Алчевск"] },
  { region: "Республика Марий Эл", cities: ["Йошкар-Ола"] },
  { region: "Республика Мордовия", cities: ["Саранск"] },
  { region: "Республика Саха (Якутия)", cities: ["Якутск", "Нерюнгри"] },
  { region: "Республика Северная Осетия - Алания", cities: ["Владикавказ"] },
  { region: "Республика Татарстан", cities: ["Казань", "Набережные Челны", "Нижнекамск", "Альметьевск"] },
  { region: "Республика Тыва", cities: ["Кызыл"] },
  { region: "Удмуртская Республика", cities: ["Ижевск", "Сарапул", "Глазов"] },
  { region: "Республика Хакасия", cities: ["Абакан"] },
  { region: "Чеченская Республика", cities: ["Грозный"] },
  { region: "Чувашская Республика", cities: ["Чебоксары", "Новочебоксарск"] },
  { region: "Алтайский край", cities: ["Барнаул", "Бийск", "Рубцовск"] },
  { region: "Забайкальский край", cities: ["Чита"] },
  { region: "Камчатский край", cities: ["Петропавловск-Камчатский"] },
  { region: "Краснодарский край", cities: ["Краснодар", "Сочи", "Новороссийск", "Армавир"] },
  { region: "Красноярский край", cities: ["Красноярск", "Норильск", "Ачинск"] },
  { region: "Пермский край", cities: ["Пермь", "Березники", "Соликамск"] },
  { region: "Приморский край", cities: ["Владивосток", "Уссурийск", "Находка", "Артём"] },
  { region: "Ставропольский край", cities: ["Ставрополь", "Пятигорск", "Кисловодск", "Невинномысск", "Ессентуки"] },
  { region: "Хабаровский край", cities: ["Хабаровск", "Комсомольск-на-Амуре"] },
  { region: "Амурская область", cities: ["Благовещенск"] },
  { region: "Архангельская область", cities: ["Архангельск", "Северодвинск"] },
  { region: "Астраханская область", cities: ["Астрахань"] },
  { region: "Белгородская область", cities: ["Белгород", "Старый Оскол"] },
  { region: "Брянская область", cities: ["Брянск"] },
  { region: "Владимирская область", cities: ["Владимир", "Ковров", "Муром"] },
  { region: "Волгоградская область", cities: ["Волгоград", "Волжский"] },
  { region: "Вологодская область", cities: ["Вологда", "Череповец"] },
  { region: "Воронежская область", cities: ["Воронеж"] },
  { region: "Запорожская область", cities: ["Мелитополь", "Бердянск"] },
  { region: "Ивановская область", cities: ["Иваново"] },
  { region: "Иркутская область", cities: ["Иркутск", "Братск", "Ангарск"] },
  { region: "Калининградская область", cities: ["Калининград"] },
  { region: "Калужская область", cities: ["Калуга", "Обнинск"] },
  { region: "Кемеровская область - Кузбасс", cities: ["Кемерово", "Новокузнецк", "Прокопьевск"] },
  { region: "Кировская область", cities: ["Киров"] },
  { region: "Костромская область", cities: ["Кострома"] },
  { region: "Курганская область", cities: ["Курган"] },
  { region: "Курская область", cities: ["Курск"] },
  { region: "Ленинградская область", cities: ["Гатчина", "Выборг", "Всеволожск", "Кириши"] },
  { region: "Липецкая область", cities: ["Липецк", "Елец"] },
  { region: "Магаданская область", cities: ["Магадан"] },
  { region: "Московская область", cities: ["Красногорск", "Балашиха", "Химки", "Подольск", "Мытищи", "Люберцы", "Королёв", "Одинцово", "Домодедово", "Электросталь", "Коломна", "Сергиев Посад", "Раменское", "Щёлково"] },
  { region: "Мурманская область", cities: ["Мурманск", "Апатиты"] },
  { region: "Нижегородская область", cities: ["Нижний Новгород", "Дзержинск", "Арзамас"] },
  { region: "Новгородская область", cities: ["Великий Новгород"] },
  { region: "Новосибирская область", cities: ["Новосибирск", "Бердск"] },
  { region: "Омская область", cities: ["Омск"] },
  { region: "Оренбургская область", cities: ["Оренбург", "Орск", "Бузулук", "Новотроицк", "Соль-Илецк", "Тоцкое", "Тоцкое Второе"] },
  { region: "Орловская область", cities: ["Орёл"] },
  { region: "Пензенская область", cities: ["Пенза"] },
  { region: "Псковская область", cities: ["Псков", "Великие Луки"] },
  { region: "Ростовская область", cities: ["Ростов-на-Дону", "Таганрог", "Шахты", "Новочеркасск", "Волгодонск", "Батайск"] },
  { region: "Рязанская область", cities: ["Рязань"] },
  { region: "Самарская область", cities: ["Самара", "Тольятти", "Сызрань", "Новокуйбышевск"] },
  { region: "Саратовская область", cities: ["Саратов", "Энгельс", "Балаково"] },
  { region: "Сахалинская область", cities: ["Южно-Сахалинск"] },
  { region: "Свердловская область", cities: ["Екатеринбург", "Нижний Тагил", "Каменск-Уральский", "Первоуральск"] },
  { region: "Смоленская область", cities: ["Смоленск"] },
  { region: "Тамбовская область", cities: ["Тамбов", "Мичуринск"] },
  { region: "Тверская область", cities: ["Тверь", "Ржев"] },
  { region: "Томская область", cities: ["Томск", "Северск"] },
  { region: "Тульская область", cities: ["Тула", "Новомосковск"] },
  { region: "Тюменская область", cities: ["Тюмень", "Тобольск", "Ишим"] },
  { region: "Ульяновская область", cities: ["Ульяновск", "Димитровград"] },
  { region: "Херсонская область", cities: ["Херсон", "Геническ"] },
  { region: "Челябинская область", cities: ["Челябинск", "Магнитогорск", "Миасс", "Златоуст", "Копейск"] },
  { region: "Ярославская область", cities: ["Ярославль", "Рыбинск"] },
  { region: "Москва", cities: [] },
  { region: "Санкт-Петербург", cities: [] },
  { region: "Севастополь", cities: [] },
  { region: "Еврейская автономная область", cities: ["Биробиджан"] },
  { region: "Ненецкий автономный округ", cities: ["Нарьян-Мар"] },
  { region: "Ханты-Мансийский автономный округ - Югра", cities: ["Ханты-Мансийск", "Сургут", "Нижневартовск", "Нефтеюганск", "Нягань"] },
  { region: "Чукотский автономный округ", cities: ["Анадырь"] },
  { region: "Ямало-Ненецкий автономный округ", cities: ["Салехард", "Новый Уренгой", "Ноябрьск"] }
];

// Тестовый справочник организаций. Поле services связывает организацию с доступными услугами.
const organizations = [
  {
    id: "mfc-orenburg",
    type: "mfc",
    name: "ГАУ «МФЦ» Оренбургской области",
    agency: "Мои Документы",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "Шарлыкское шоссе, 1/2",
    aliases: ["мфц оренбург", "мои документы оренбург", "главный мфц", "оренбургская область"],
    services: ["passport-rf", "foreign-passport", "registration-home", "driver-license", "vehicle-registration", "criminal-record", "egrn", "inn", "ip-registration", "sfr-payment", "snils", "child-benefit", "housing-subsidy", "birth-record", "marriage-record"],
    rating: 4.5,
    reviews: 2942,
    popularity: 1000
  },
  {
    id: "mfc-orsk",
    type: "mfc",
    name: "МФЦ города Орска",
    agency: "Мои Документы",
    region: "Оренбургская область",
    city: "Орск",
    address: "пр-т Ленина, 52",
    aliases: ["мфц орск", "мои документы орск", "орск"],
    services: ["passport-rf", "foreign-passport", "registration-home", "driver-license", "vehicle-registration", "egrn", "inn", "sfr-payment", "snils", "child-benefit", "housing-subsidy", "birth-record", "marriage-record"],
    rating: 4.4,
    reviews: 1640,
    popularity: 930
  },
  {
    id: "mfc-buzuluk",
    type: "mfc",
    name: "МФЦ города Бузулука",
    agency: "Мои Документы",
    region: "Оренбургская область",
    city: "Бузулук",
    address: "ул. Ленина, 28",
    aliases: ["мфц бузулук", "мои документы бузулук", "бузулук"],
    services: ["passport-rf", "foreign-passport", "registration-home", "driver-license", "egrn", "inn", "sfr-payment", "snils", "child-benefit", "housing-subsidy", "birth-record", "marriage-record"],
    rating: 4.6,
    reviews: 1210,
    popularity: 890
  },
  {
    id: "mfc-novotroitsk",
    type: "mfc",
    name: "МФЦ города Новотроицка",
    agency: "Мои Документы",
    region: "Оренбургская область",
    city: "Новотроицк",
    address: "ул. Советская, 80",
    aliases: ["мфц новотроицк", "мои документы новотроицк", "новотроицк"],
    services: ["passport-rf", "foreign-passport", "registration-home", "driver-license", "egrn", "inn", "sfr-payment", "snils", "child-benefit", "housing-subsidy"],
    rating: 4.3,
    reviews: 820,
    popularity: 830
  },
  {
    id: "mfc-soliletsk",
    type: "mfc",
    name: "МФЦ Соль-Илецкого городского округа",
    agency: "Мои Документы",
    region: "Оренбургская область",
    city: "Соль-Илецк",
    address: "ул. Цвиллинга, 66",
    aliases: ["мфц соль-илецк", "соль илецк", "мои документы"],
    services: ["passport-rf", "foreign-passport", "registration-home", "driver-license", "egrn", "inn", "sfr-payment", "snils", "birth-record", "marriage-record"],
    rating: 4.4,
    reviews: 540,
    popularity: 760
  },
  {
    id: "mfc-tockoe",
    type: "mfc",
    name: "ТОСП «МФЦ» Тоцкого района",
    agency: "Мои Документы",
    region: "Оренбургская область",
    city: "с. Тоцкое Второе",
    address: "ул. Центральная, 10",
    aliases: ["мфц тоцкое", "мои документы тоцкое", "тосп", "тоцкое второе", "тоцкий район"],
    services: ["village-book", "passport-rf", "foreign-passport", "registration-home", "driver-license", "egrn", "inn", "sfr-payment", "snils", "birth-record", "marriage-record", "child-benefit"],
    rating: 4.7,
    reviews: 328,
    popularity: 700
  },
  {
    id: "rosreestr-orb",
    type: "department",
    name: "Управление Росреестра по Оренбургской области",
    agency: "Росреестр",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Пушкинская, 10",
    aliases: ["росреестр", "егрн", "недвижимость", "кадастр", "земля", "регистрация прав"],
    services: ["egrn", "land-plot"],
    rating: 4.2,
    reviews: 1184,
    popularity: 860
  },
  {
    id: "sfr-orb",
    type: "department",
    name: "Отделение СФР по Оренбургской области",
    agency: "СФР",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Мира, 18а",
    aliases: ["сфр", "социальный фонд", "пенсионный фонд", "фсс", "пособие", "выплата", "пенсия", "снилс"],
    services: ["sfr-payment", "snils"],
    rating: 4.3,
    reviews: 1306,
    popularity: 840
  },
  {
    id: "fns56",
    type: "department",
    name: "УФНС России по Оренбургской области",
    agency: "ФНС",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Чкалова, 1а",
    aliases: ["фнс", "налоговая", "инн", "налоги", "ип"],
    services: ["inn", "ip-registration"],
    rating: 4.1,
    reviews: 965,
    popularity: 800
  },
  {
    id: "gibdd-orenburg",
    type: "department",
    name: "МРЭО ГИБДД УМВД России по Оренбургской области",
    agency: "ГИБДД",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Транспортная, 12",
    aliases: ["гибдд", "мрэо", "права", "водительское удостоверение", "замена прав", "регистрация авто"],
    services: ["driver-license", "vehicle-registration"],
    rating: 3.9,
    reviews: 811,
    popularity: 780
  },
  {
    id: "ovm-orenburg",
    type: "department",
    name: "Управление по вопросам миграции УМВД России по Оренбургской области",
    agency: "МВД",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Володарского, 11",
    aliases: ["мвд", "овм", "паспортный стол", "паспорт", "загранпаспорт", "регистрация"],
    services: ["passport-rf", "foreign-passport", "registration-home", "criminal-record"],
    rating: 4.0,
    reviews: 730,
    popularity: 760
  },
  {
    id: "zags-orb",
    type: "department",
    name: "Комитет ЗАГС Оренбургской области",
    agency: "ЗАГС",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Советская, 44",
    aliases: ["загс", "рождение", "свидетельство", "регистрация рождения", "брак"],
    services: ["birth-record", "marriage-record"],
    rating: 4.6,
    reviews: 574,
    popularity: 700
  },
  {
    id: "social-ministry-orb",
    type: "department",
    name: "Министерство социального развития Оренбургской области",
    agency: "Социальная защита",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Терешковой, 33",
    aliases: ["соцзащита", "социальная защита", "пособие", "субсидия", "выплаты"],
    services: ["child-benefit", "housing-subsidy", "sfr-payment"],
    rating: 4.2,
    reviews: 490,
    popularity: 680
  },
  {
    id: "adm-orenburg",
    type: "department",
    name: "Администрация города Оренбурга",
    agency: "Муниципальное ведомство",
    region: "Оренбургская область",
    city: "Оренбург",
    address: "ул. Советская, 60",
    aliases: ["администрация оренбург", "муниципалитет", "строительство", "земля"],
    services: ["building-permit", "land-plot", "village-book"],
    rating: 4.0,
    reviews: 420,
    popularity: 620
  },
  {
    id: "adm-tockoe",
    type: "department",
    name: "Администрация Тоцкого района",
    agency: "Муниципальное ведомство",
    region: "Оренбургская область",
    city: "с. Тоцкое",
    address: "ул. Красная площадь, 1",
    aliases: ["администрация", "муниципалитет", "тоцкий район", "сельсовет", "похозяйственная книга", "земля"],
    services: ["village-book", "building-permit", "land-plot"],
    rating: 4.1,
    reviews: 237,
    popularity: 540
  },
  {
    id: "ovm-tockoe",
    type: "department",
    name: "ОВМ ОМВД России по Тоцкому району",
    agency: "МВД",
    region: "Оренбургская область",
    city: "с. Тоцкое",
    address: "ул. Ленина, 6",
    aliases: ["мвд", "овм", "паспортный стол", "полиция", "тоцкое", "регистрация"],
    services: ["passport-rf", "foreign-passport", "registration-home", "criminal-record"],
    rating: 4.0,
    reviews: 153,
    popularity: 440
  },
  {
    id: "gosuslugi-online",
    type: "department",
    name: "Единый портал государственных услуг",
    agency: "Федеральный уровень",
    region: "Федеральный уровень",
    city: "",
    address: "",
    aliases: ["госуслуги", "онлайн", "портал", "интернет", "электронная услуга"],
    services: ["passport-rf", "foreign-passport", "registration-home", "driver-license", "vehicle-registration", "criminal-record", "egrn", "inn", "ip-registration", "sfr-payment", "snils", "child-benefit", "housing-subsidy", "birth-record", "marriage-record"],
    rating: 4.1,
    reviews: 2240,
    popularity: 970
  }
];

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

// Единое состояние формы: выбранная пара услуга+организация, режим просмотра, оценки и вложения.
const state = {
  selectedServiceId: null,
  selectedOrgId: null,
  browseMode: "organizations",
  browseOrgId: null,
  browseServiceId: null,
  regionTouched: false,
  ratings: Object.fromEntries(questions.map((item) => [item.id, 0])),
  photos: [],
  openHelpId: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const GENERIC_LOCATION_WORDS = new Set([
  "город", "область", "области", "край", "республика", "автономная", "автономный",
  "округ", "уровень", "федеральный", "г", "с", "поселок", "посёлок"
]);

const IP_LOCATION_ALIASES = {
  "moscow": "Москва",
  "moskva": "Москва",
  "moscow oblast": "Московская область",
  "moskovskaya oblast": "Московская область",
  "saint petersburg": "Санкт-Петербург",
  "st petersburg": "Санкт-Петербург",
  "sankt peterburg": "Санкт-Петербург",
  "orenburg": "Оренбург",
  "orenburg oblast": "Оренбургская область",
  "samara": "Самара",
  "samara oblast": "Самарская область",
  "kazan": "Казань",
  "tatarstan": "Республика Татарстан",
  "republic of tatarstan": "Республика Татарстан",
  "novosibirsk": "Новосибирск",
  "novosibirsk oblast": "Новосибирская область",
  "yekaterinburg": "Екатеринбург",
  "sverdlovsk oblast": "Свердловская область",
  "nizhny novgorod": "Нижний Новгород",
  "krasnodar": "Краснодар",
  "krasnodar krai": "Краснодарский край"
};

let regionOptionsCache = null;
let locationPhrasesCache = null;
let locationTokenCache = null;

// Кэшируем элементы страницы один раз, чтобы функции ниже не искали их повторно.
const elements = {
  form: $("#reviewForm"),
  search: $("#mainSearch"),
  clearSearch: $("#clearSearch"),
  region: $("#regionInput"),
  regionSuggestions: $("#regionSuggestions"),
  regionHint: $("#regionHint"),
  receiveType: $("#receiveType"),
  serviceDate: $("#serviceDate"),
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

function init() {
  // Порядок важен: сначала готовим поля и восстановление, потом подписки и первичная отрисовка.
  populateRegionSuggestions();
  configureDateInput();
  renderRatings();
  restoreDraft();
  bindEvents();
  tryDetectRegion({ silent: true });
  runSearch();
  updateSelectedBox();
  updateSteps();
  updateCommentCounter();
  updateOfficialAnswerVisibility();
}

function bindEvents() {
  // Все обработчики собраны в одном месте, чтобы сценарий формы было проще проследить.
  elements.search.addEventListener("input", runSearch);
  elements.region.addEventListener("input", () => {
    state.regionTouched = true;
    state.browseOrgId = null;
    state.browseServiceId = null;
    if (elements.regionHint) elements.regionHint.hidden = true;
    runSearch();
  });
  elements.receiveType.addEventListener("change", () => { runSearch(); updateSteps(); });
  elements.serviceDate.addEventListener("change", () => { elements.dateError.hidden = true; updateSteps(); });
  elements.stage.addEventListener("change", updateSteps);
  elements.clearSearch.addEventListener("click", () => {
    elements.search.value = "";
    elements.search.focus();
    state.browseOrgId = null;
    state.browseServiceId = null;
    runSearch();
  });

  $$('input[name="searchMode"]').forEach((input) => input.addEventListener("change", () => {
    state.browseMode = "organizations";
    state.browseOrgId = null;
    state.browseServiceId = null;
    runSearch();
  }));

  $$("[data-query]").forEach((button) => button.addEventListener("click", () => {
    elements.search.value = button.dataset.query;
    state.browseOrgId = null;
    state.browseServiceId = null;
    runSearch();
    elements.search.focus();
  }));

  $("#changeSelection").addEventListener("click", () => {
    state.selectedServiceId = null;
    state.selectedOrgId = null;
    state.browseMode = "organizations";
    state.browseOrgId = null;
    state.browseServiceId = null;
    updateSelectedBox();
    runSearch();
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

function getRegionOptions() {
  if (regionOptionsCache) return regionOptionsCache;

  const seen = new Set();
  const options = [];
  const addOption = (value, region, city = "") => {
    const key = normalize(value);
    if (!key || seen.has(key)) return;
    seen.add(key);
    options.push({ value, region, city });
  };

  russianLocations.forEach(({ region, cities }) => {
    addOption(region, region);
    cities.forEach((city) => addOption(`${city}, ${region}`, region, city));
  });

  regionOptionsCache = options.sort((a, b) => a.value.localeCompare(b.value, "ru"));
  return regionOptionsCache;
}

function populateRegionSuggestions() {
  if (!elements.regionSuggestions) return;
  elements.regionSuggestions.innerHTML = getRegionOptions()
    .map(({ value }) => `<option value="${escapeHtml(value)}"></option>`)
    .join("");
}

function getKnownLocationPhrases() {
  if (locationPhrasesCache) return locationPhrasesCache;

  const phrases = new Set();
  russianLocations.forEach(({ region, cities }) => {
    phrases.add(normalize(region));
    cities.forEach((city) => phrases.add(normalize(city)));
  });

  locationPhrasesCache = [...phrases]
    .filter((phrase) => phrase && !GENERIC_LOCATION_WORDS.has(phrase))
    .sort((a, b) => b.length - a.length);
  return locationPhrasesCache;
}

function getKnownLocationTokens() {
  if (locationTokenCache) return locationTokenCache;
  locationTokenCache = new Set(
    getKnownLocationPhrases()
      .flatMap((phrase) => phrase.split(" "))
      .filter((token) => token && !GENERIC_LOCATION_WORDS.has(token))
  );
  return locationTokenCache;
}

function stripLocationFromQuery(value) {
  let result = normalize(value);
  getKnownLocationPhrases().forEach((phrase) => {
    result = result.replace(new RegExp(`(^|\\s)${escapeRegExp(phrase)}(?=\\s|$)`, "g"), " ");
  });
  const locationTokens = getKnownLocationTokens();
  return result
    .split(" ")
    .filter((token) => token && !GENERIC_LOCATION_WORDS.has(token) && !locationTokens.has(token))
    .join(" ");
}

function getMainSearchTokens() {
  return tokenize(stripLocationFromQuery(elements.search.value));
}

function getLocationContext(value = elements.region.value) {
  const input = value.trim();
  const match = findLocationByValue(input);
  const tokens = tokenize(match ? [match.city, match.region].filter(Boolean).join(" ") : input)
    .filter((token) => !GENERIC_LOCATION_WORDS.has(token));
  return {
    value: match?.value || input,
    region: match?.region || "",
    city: match?.city || "",
    tokens
  };
}

function findLocationByValue(value) {
  const normalized = normalize(value);
  if (!normalized) return null;

  const options = getRegionOptions();
  return options.find((option) => normalize(option.value) === normalized)
    || options.find((option) => option.city && normalize(option.city) === normalized)
    || options.find((option) => normalize(option.region) === normalized)
    || null;
}

function findLocationByParts(city, region) {
  const normalizedCity = normalize(localizeIpLocationPart(city));
  const normalizedRegion = normalize(localizeIpLocationPart(region));
  const options = getRegionOptions();

  if (normalizedCity && normalizedRegion) {
    const exactCity = options.find((option) =>
      option.city && normalize(option.city) === normalizedCity && normalize(option.region) === normalizedRegion
    );
    if (exactCity) return exactCity;
  }

  if (normalizedRegion) {
    const exactRegion = options.find((option) => !option.city && normalize(option.region) === normalizedRegion);
    if (exactRegion) return exactRegion;
  }

  if (normalizedCity) {
    return options.find((option) => option.city && normalize(option.city) === normalizedCity)
      || options.find((option) => !option.city && normalize(option.region) === normalizedCity)
      || null;
  }

  return null;
}

function localizeIpLocationPart(value) {
  const key = normalize(value);
  return IP_LOCATION_ALIASES[key] || value || "";
}

function locationScoreForOrg(org, location = getLocationContext()) {
  if (!location.tokens.length) return 0;
  let score = scoreText(location.tokens, [org.region, org.city, org.address]);
  if (location.region && normalize(org.region) === normalize(location.region)) score += 35;
  if (location.city && normalize(org.city) === normalize(location.city)) score += 30;
  if (org.region === "Федеральный уровень") score += 2;
  return score;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value) {
  // Нормализация делает поиск терпимым к регистру, "ё/е" и лишней пунктуации.
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
  // Чем больше совпадений с названием, адресом, категорией и синонимами, тем выше строка в выдаче.
  if (!queryTokens.length) return 0;
  const haystack = normalize(haystackParts.flat().filter(Boolean).join(" "));
  let score = 0;
  queryTokens.forEach((token) => {
    if (haystack.includes(token)) score += token.length > 3 ? 8 : 4;
    if (haystack.split(" ").some((word) => word.startsWith(token))) score += 5;
  });
  return score;
}

function getSearchMode() {
  return $('input[name="searchMode"]:checked')?.value || "any";
}

function getModeLabel() {
  const mode = getSearchMode();
  if (mode === "mfc") return "МФЦ";
  if (mode === "department") return "ведомств";
  return "";
}

function getServicesTitle() {
  const mode = getSearchMode();
  if (mode === "mfc") return "Популярные услуги МФЦ";
  if (mode === "department") return "Популярные услуги ведомств";
  return "Популярные услуги";
}

function getOrganizationsTitle() {
  const mode = getSearchMode();
  if (mode === "mfc") return "МФЦ";
  if (mode === "department") return "Ведомства";
  return "Организации";
}

function byPopularity(a, b) {
  return (b.popularity || 0) - (a.popularity || 0) || (b.reviews || 0) - (a.reviews || 0) || a.name?.localeCompare(b.name || "", "ru") || 0;
}

function getVisibleOrganizations(serviceId = null) {
  // Фильтр соблюдает выбранный режим: МФЦ, ведомства или смешанная помощь без жёсткого ограничения.
  const mode = getSearchMode();
  const location = getLocationContext();
  return organizations
    .filter((org) => {
      if (mode === "mfc" && org.type !== "mfc") return false;
      if (mode === "department" && org.type !== "department") return false;
      if (serviceId && !org.services.includes(serviceId)) return false;
      return true;
    })
    .sort((a, b) => locationScoreForOrg(b, location) - locationScoreForOrg(a, location) || byPopularity(a, b));
}

function getVisibleServices(orgId = null) {
  // Если организация уже выбрана, показываем только услуги, которые можно получить именно там.
  const org = orgId ? organizations.find((item) => item.id === orgId) : null;
  return services
    .filter((service) => {
      if (org) return org.services.includes(service.id);
      return getVisibleOrganizations(service.id).length > 0;
    })
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0) || a.title.localeCompare(b.title, "ru"));
}

function buildPairs() {
  // Строим пары "услуга + организация" для поисковой выдачи, чтобы отзыв сразу был привязан корректно.
  const queryTokens = getMainSearchTokens();
  const location = getLocationContext();
  const mode = getSearchMode();
  const receiveType = elements.receiveType.value;
  const pairs = [];

  services.forEach((service) => {
    organizations.forEach((org) => {
      if (!org.services.includes(service.id)) return;
      if (mode === "mfc" && org.type !== "mfc") return;
      if (mode === "department" && org.type !== "department") return;

      const serviceScore = scoreText(queryTokens, [service.title, service.category, service.code, service.synonyms]);
      const orgScore = scoreText(queryTokens, [org.name, org.agency, org.aliases]);
      const regionScore = locationScoreForOrg(org, location);
      let score = serviceScore + orgScore + regionScore;

      // Небольшие веса помогают популярным и релевантным вариантам подняться выше без жёсткой сортировки.
      if (mode === "mfc" && org.type === "mfc") score += 18;
      if (mode === "department" && org.type === "department") score += 18;
      if (mode === "mfc" && org.type === "department") score -= 8;
      if (mode === "department" && org.type === "mfc") score -= 6;
      if (receiveType === "online" && org.id === "gosuslugi-online") score += 16;
      if (receiveType === "online" && org.type === "department") score += 6;
      if (receiveType === "online" && org.type === "mfc") score -= 4;
      if (service.category === org.agency) score += 4;

      score += Math.round((service.popularity || 0) / 100) + Math.round((org.popularity || 0) / 100);

      if (!queryTokens.length || score > 7) {
        pairs.push({ service, org, score });
      }
    });
  });

  return pairs
    .sort((a, b) => b.score - a.score || (b.org.popularity || 0) - (a.org.popularity || 0) || (b.service.popularity || 0) - (a.service.popularity || 0))
    .slice(0, 10);
}

function renderBrowseTabs() {
  return `
    <div class="browse-tabs" role="tablist" aria-label="Способ выбора">
      <button class="browse-tab ${state.browseMode === "organizations" ? "is-active" : ""}" type="button" data-browse-tab="organizations">Организации</button>
      <button class="browse-tab ${state.browseMode === "services" ? "is-active" : ""}" type="button" data-browse-tab="services">Услуги</button>
    </div>
  `;
}

function bindBrowseTabs() {
  // Вкладки переключают только режим просмотра; выбранную пару они не сбрасывают.
  elements.results.querySelectorAll("[data-browse-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.browseMode = button.dataset.browseTab;
      state.browseOrgId = null;
      state.browseServiceId = null;
      runSearch();
    });
  });
}

function renderOrganizationList() {
  // Стартовый сценарий: пользователь сначала выбирает организацию, затем услугу.
  const orgs = getVisibleOrganizations();
  elements.results.innerHTML = `
    ${renderBrowseTabs()}
    <div class="results-head"><h3>${getOrganizationsTitle()}</h3><p>Сначала показаны самые популярные.</p></div>
    <div class="browse-list">
      ${orgs.map((org) => renderOrgRow(org, { pickMode: "browse" })).join("")}
    </div>
  `;
  bindBrowseTabs();
  elements.results.querySelectorAll("[data-pick-org]").forEach((button) => {
    button.addEventListener("click", () => {
      state.browseOrgId = button.dataset.pickOrg;
      state.browseServiceId = null;
      runSearch();
    });
  });
}

function renderServiceList() {
  // Альтернативный сценарий: пользователь начинает с услуги, а организацию выбирает следующим шагом.
  const items = getVisibleServices();
  elements.results.innerHTML = `
    ${renderBrowseTabs()}
    <div class="results-head"><h3>${getServicesTitle()}</h3><p>Выберите услугу, затем организацию.</p></div>
    <div class="browse-list">
      ${items.map((service) => `
        <div class="result-row result-row--org">
          <span>
            <strong>${escapeHtml(service.title)}</strong>
            <small>${escapeHtml(service.category)} · код услуги: ${escapeHtml(service.code)}</small>
            <span class="result-tags">
              <span class="tag tag--green">${getOrganizationsForService(service.id).length} организаций</span>
            </span>
          </span>
          <button class="btn btn--secondary result-pick" type="button" data-pick-service="${service.id}">Выбрать</button>
        </div>
      `).join("")}
    </div>
  `;
  bindBrowseTabs();
  elements.results.querySelectorAll("[data-pick-service]").forEach((button) => {
    button.addEventListener("click", () => {
      state.browseServiceId = button.dataset.pickService;
      state.browseOrgId = null;
      runSearch();
    });
  });
}

function renderOrgServices() {
  const org = organizations.find((item) => item.id === state.browseOrgId);
  if (!org) {
    state.browseOrgId = null;
    renderOrganizationList();
    return;
  }

  const orgServices = getVisibleServices(org.id);
  elements.results.innerHTML = `
    <div class="results-head results-head--stack">
      <button class="text-btn" type="button" id="backToOrganizations">← Вернуться к организациям</button>
      <div>
        <h3>${escapeHtml(org.name)}</h3>
        <p>Выберите услугу для отзыва.</p>
      </div>
    </div>
    <div class="browse-list">
      ${orgServices.map((service) => `
        <button class="result-row" type="button" data-service-id="${service.id}" data-org-id="${org.id}">
          <span>
            <strong>${escapeHtml(service.title)}</strong>
            <small>${escapeHtml(service.category)} · код услуги: ${escapeHtml(service.code)}</small>
          </span>
        </button>
      `).join("")}
    </div>
  `;

  $("#backToOrganizations")?.addEventListener("click", () => {
    state.browseOrgId = null;
    state.browseMode = "organizations";
    runSearch();
  });

  bindSelectPairRows();
}

function renderServiceOrganizations() {
  const service = services.find((item) => item.id === state.browseServiceId);
  if (!service) {
    state.browseServiceId = null;
    renderServiceList();
    return;
  }

  const orgs = getVisibleOrganizations(service.id);
  elements.results.innerHTML = `
    <div class="results-head results-head--stack">
      <button class="text-btn" type="button" id="backToServices">← Вернуться к услугам</button>
      <div>
        <h3>${escapeHtml(service.title)}</h3>
        <p>Выберите организацию, где получали услугу.</p>
      </div>
    </div>
    <div class="browse-list">
      ${orgs.map((org) => renderOrgRow(org, { serviceId: service.id, pickMode: "select" })).join("")}
    </div>
  `;

  $("#backToServices")?.addEventListener("click", () => {
    state.browseServiceId = null;
    state.browseMode = "services";
    runSearch();
  });

  bindSelectPairRows();
}

function renderOrgRow(org, { serviceId = null, pickMode = "browse" } = {}) {
  const buttonAttr = pickMode === "select"
    ? `data-service-id="${serviceId}" data-org-id="${org.id}"`
    : `data-pick-org="${org.id}"`;
  const location = [org.city, org.address].filter(Boolean).join(", ") || org.region;
  return `
    <div class="result-row result-row--org">
      <span>
        <strong>${escapeHtml(org.name)}</strong>
        <small>${escapeHtml(location)}</small>
        <span class="result-tags">
          <span class="tag tag--green">${org.type === "mfc" ? "МФЦ" : "Ведомство"}</span>
          <span class="tag">${escapeHtml(org.region)}</span>
          <span class="tag">${org.reviews} отзывов</span>
        </span>
      </span>
      <button class="btn btn--secondary result-pick" type="button" ${buttonAttr}>Выбрать</button>
    </div>
  `;
}

function getOrganizationsForService(serviceId) {
  return getVisibleOrganizations(serviceId);
}

function runSearch() {
  // Центральная точка выбора: либо показываем списки для просмотра, либо поисковые пары по введённому тексту.
  if (state.selectedServiceId && state.selectedOrgId) {
    elements.results.innerHTML = "";
    return;
  }

  const queryTokens = getMainSearchTokens();
  if (!queryTokens.length) {
    if (state.browseOrgId) {
      renderOrgServices();
    } else if (state.browseServiceId) {
      renderServiceOrganizations();
    } else if (state.browseMode === "services") {
      renderServiceList();
    } else {
      renderOrganizationList();
    }
    return;
  }

  state.browseOrgId = null;
  state.browseServiceId = null;
  const pairs = buildPairs();
  if (!pairs.length) {
    elements.results.innerHTML = `
      <div class="empty-result">
        Ничего не найдено. Попробуйте обычное название услуги: «паспорт», «права», «выписка ЕГРН», «пособие». Если нужного варианта нет, нажмите «Не нашёл в списке».
      </div>`;
    return;
  }

  elements.results.innerHTML = `
    <div class="results-head"><h3>Результаты поиска</h3><p>Наиболее подходящие варианты показаны выше.</p></div>
    <div class="browse-list">
      ${pairs.map(({ service, org }) => `
        <button class="result-row" type="button" data-service-id="${service.id}" data-org-id="${org.id}">
          <span>
            <strong>${escapeHtml(service.title)}</strong>
            <small>${escapeHtml(org.name)} · ${escapeHtml([org.city, org.address].filter(Boolean).join(", ") || org.region)}</small>
            <span class="result-tags">
              <span class="tag tag--green">${org.type === "mfc" ? "МФЦ" : "Ведомство"}</span>
              <span class="tag">${escapeHtml(service.category)}</span>
              <span class="tag">${escapeHtml(org.region)}</span>
            </span>
          </span>
        </button>
      `).join("")}
    </div>
  `;

  bindSelectPairRows();
}

function bindSelectPairRows() {
  // Любой клик по строке выбора фиксирует сразу обе обязательные сущности: услугу и организацию.
  elements.results.querySelectorAll("[data-service-id][data-org-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedServiceId = button.dataset.serviceId;
      state.selectedOrgId = button.dataset.orgId;
      state.browseOrgId = null;
      state.browseServiceId = null;
      elements.selectionError.hidden = true;
      updateSelectedBox();
      runSearch();
      updateSteps();
      showToast("Услуга и организация выбраны");
    });
  });
}

function updateSelectedBox() {
  // Блок выбранной пары появляется только когда отзыв можно однозначно привязать к справочникам.
  const service = getSelectedService();
  const org = getSelectedOrg();
  const selected = Boolean(service && org);

  if (!selected) {
    elements.selectedServiceName.textContent = "";
    elements.selectedServiceMeta.textContent = "";
    elements.selectedOrgName.textContent = "";
    elements.selectedOrgMeta.textContent = "";
    elements.selectedBox.hidden = true;
    return;
  }

  elements.selectedServiceName.textContent = service.title;
  elements.selectedServiceMeta.textContent = `${service.category} · код услуги: ${service.code}`;
  elements.selectedOrgName.textContent = org.name;
  elements.selectedOrgMeta.textContent = `${org.type === "mfc" ? "МФЦ" : org.agency} · ${[org.city, org.address].filter(Boolean).join(", ") || org.region}`;
  elements.selectedBox.hidden = false;
}

function toggleHelp(id) {
  state.openHelpId = state.openHelpId === id ? null : id;
  $$(".rating-row").forEach((row) => {
    const isOpen = row.dataset.questionId === state.openHelpId;
    row.querySelector(".rating-help").hidden = !isOpen;
    row.querySelector(".help-dot")?.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderRatings() {
  // Рисуем все пять обязательных рейтингов из массива questions, чтобы не держать их вручную в HTML.
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
  // Обновляем выбранные звёзды и атрибуты доступности для клавиатуры и программ чтения с экрана.
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

function handleFiles(files) {
  // В прототипе фото хранятся в памяти как строка с содержимым файла и не отправляются на сервер.
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

function configureDateInput() {
  // Ограничиваем дату тем же правилом, что и валидация: не будущее и не старше 3 лет.
  const today = new Date();
  const min = addYears(today, -3);
  elements.serviceDate.max = formatDate(today);
  elements.serviceDate.min = formatDate(min);
  if (!elements.serviceDate.value) elements.serviceDate.value = formatDate(today);
}

function addYears(date, years) {
  const copy = new Date(date);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function validateServiceDate() {
  // Проверка дублирует min/max, потому что браузеры по-разному показывают ошибки поля даты.
  const value = elements.serviceDate.value;
  if (!value) return true;
  const date = new Date(`${value}T00:00:00`);
  const today = new Date(`${formatDate(new Date())}T00:00:00`);
  const min = new Date(`${elements.serviceDate.min}T00:00:00`);

  if (date > today) {
    elements.dateError.textContent = "Нельзя выбрать дату в будущем.";
    elements.dateError.hidden = false;
    return false;
  }
  if (date < min) {
    elements.dateError.textContent = "Выберите дату не старше 3 лет.";
    elements.dateError.hidden = false;
    return false;
  }
  elements.dateError.hidden = true;
  return true;
}

function validateForm() {
  // Перед отправкой проверяем только обязательное: выбранную пару, дату, все оценки и корректность ссылки.
  let valid = true;
  if (!state.selectedServiceId || !state.selectedOrgId) {
    elements.selectionError.hidden = false;
    document.querySelector(".search-card").scrollIntoView({ block: "start", behavior: "smooth" });
    valid = false;
  }

  if (!validateServiceDate()) {
    if (valid) elements.serviceDate.focus();
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
  // Реальной отправки нет: для статического прототипа показываем собранные данные в диалоге и пишем их в консоль.
  event.preventDefault();
  if (!validateForm()) return;

  const payload = buildPayload("submitted");
  console.log("Отзыв отправлен", payload);
  elements.payload.textContent = JSON.stringify(payload, null, 2);
  elements.resultDialog.showModal();
  localStorage.removeItem("vashkontrol-review-draft-practical");
}

function saveDraft() {
  // Черновик сохраняется локально в браузере, без передачи персональных данных наружу.
  const payload = buildPayload("draft");
  localStorage.setItem("vashkontrol-review-draft-practical", JSON.stringify({ payload, statePhotos: state.photos }));
  showToast("Черновик сохранён в браузере");
}

function restoreDraft() {
  // При восстановлении не возвращаем выбранную пару: пользователь должен заново подтвердить услугу и организацию.
  try {
    const saved = JSON.parse(localStorage.getItem("vashkontrol-review-draft-practical") || "null");
    if (!saved?.payload) return;
    state.selectedServiceId = null;
    state.selectedOrgId = null;
    state.ratings = { ...state.ratings, ...(saved.payload.ratings || {}) };
    state.photos = Array.isArray(saved.statePhotos) ? saved.statePhotos : [];
    elements.comment.value = saved.payload.comment || "";
    elements.video.value = saved.payload.video || "";
    if (saved.payload.region) {
      elements.region.value = saved.payload.region;
      state.regionTouched = true;
    }
    elements.serviceDate.value = saved.payload.serviceDate || elements.serviceDate.value;
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
  // Полный сброс возвращает форму к начальному сценарию и очищает локальный черновик.
  state.selectedServiceId = null;
  state.selectedOrgId = null;
  state.browseMode = "organizations";
  state.browseOrgId = null;
  state.browseServiceId = null;
  state.ratings = Object.fromEntries(questions.map((item) => [item.id, 0]));
  state.photos = [];
  elements.form.reset();
  elements.region.value = DEFAULT_REGION;
  state.regionTouched = false;
  elements.receiveType.value = "offline";
  configureDateInput();
  elements.stage.value = "service_received";
  localStorage.removeItem("vashkontrol-review-draft-practical");
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
  // Сообщение о справочнике пока имитируется через console.log, как и основная отправка формы.
  const text = $("#catalogProblemText").value.trim();
  console.log("Сообщение о проблеме со справочником", {
    text,
    search: elements.search.value,
    region: elements.region.value,
    createdAt: new Date().toISOString()
  });
  elements.catalogDialog.close();
  $("#catalogProblemText").value = "";
  showToast("Сообщение отправлено");
}

function buildPayload(status) {
  // Собираем структуру, которую позже можно будет отправлять на сервер без смены логики интерфейса.
  const service = getSelectedService();
  const org = getSelectedOrg();
  return {
    status,
    source: "site-form",
    authorizedVia: "ЕСИА / Госуслуги",
    createdAt: new Date().toISOString(),
    stage: elements.stage.value,
    receiveType: elements.receiveType.value,
    region: elements.region.value,
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
  // Индикатор шагов отражает прогресс, но не добавляет отдельные обязательные экраны.
  const selected = Boolean(state.selectedServiceId && state.selectedOrgId);
  const ratingsDone = Object.values(state.ratings).every(Boolean);
  const detailsTouched = Boolean(elements.comment.value.trim() || state.photos.length || elements.video.value.trim() || elements.officialAnswer.checked);

  setStep(1, selected ? "done" : "active");
  setStep(2, selected && !ratingsDone ? "active" : ratingsDone ? "done" : "");
  setStep(3, ratingsDone && !detailsTouched ? "active" : ratingsDone && detailsTouched ? "done" : "");
  setStep(4, selected && ratingsDone ? "active" : "");
}

function setStep(index, status) {
  const step = document.querySelector(`.step:nth-child(${index})`);
  step.classList.toggle("is-done", status === "done");
  step.classList.toggle("is-active", status === "active");
}

function getSelectedService() {
  return services.find((service) => service.id === state.selectedServiceId) || null;
}

function getSelectedOrg() {
  return organizations.find((org) => org.id === state.selectedOrgId) || null;
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
    setDetectedLocation(detectedByIp, "ip", silent);
    return;
  }

  const detectedByBrowser = detectRegionByBrowserInfo();
  const browserLocation = detectedByBrowser ? findLocationByValue(detectedByBrowser) : null;
  if (browserLocation && canAutofillRegion()) setDetectedLocation(browserLocation, "browser", silent);
}

function canAutofillRegion() {
  const value = elements.region.value.trim();
  return !state.regionTouched && (!value || normalize(value) === normalize(DEFAULT_REGION));
}

function setDetectedLocation(location, source, silent) {
  elements.region.value = location.value;
  if (elements.regionHint) {
    elements.regionHint.textContent = source === "ip"
      ? "Подставили по IP. Можно изменить вручную."
      : "Подставили по данным браузера. Можно изменить вручную.";
    elements.regionHint.hidden = false;
  }
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
    const match = findLocationByParts(city, region);
    if (match) return match;

    const detectedRegion = detectRegionByCoordinates(Number(data.latitude), Number(data.longitude));
    return detectedRegion ? findLocationByValue(detectedRegion) : null;
  } catch (error) {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function detectRegionByBrowserInfo() {
  // По часовому поясу можно сделать только грубую подсказку, если IP-сервис недоступен.
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
  // Запасной вариант для координат: простые рамки регионов без внешних сервисов и без точного геокодинга.
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
  // Принимаем только обычные http/https-ссылки на видео, сама платформа здесь не ограничивается.
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function showToast(message) {
  // Неблокирующее уведомление: оно не прерывает заполнение формы и само исчезает.
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

function escapeHtml(value) {
  // Экранируем пользовательские и справочные строки перед вставкой в шаблонную HTML-разметку.
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

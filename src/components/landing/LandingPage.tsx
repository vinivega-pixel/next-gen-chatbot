import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const SEND_URL = 'https://functions.poehali.dev/f89ef799-3a54-43fb-acc7-b79212ae22fa'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Калькулятор', href: '#calculator' },
  { label: 'О компании', href: '#about' },
  { label: 'Нормативы', href: '#normative' },
  { label: 'Контакты', href: '#contacts' },
]

const SERVICES = [
  {
    icon: 'Zap',
    title: 'Электроснабжение',
    desc: 'Разработка проекта для систем электрики: внутреннее и наружное электроснабжение 0,4–10 кВ. Однолинейные схемы, расчёты токов КЗ, выбор оборудования, ВРУ, ГРЩ, ТП.',
    details: ['ЭС — Силовое электрооборудование', 'ЭН — Наружное электроснабжение', 'Принципиальные схемы ВРУ / ГРЩ', 'Расчёт токов КЗ и выбор защит', 'Кабельные журналы и спецификации'],
  },
  {
    icon: 'Cable',
    title: 'Наружные сети 0,4–10 кВ',
    desc: 'Создание алгоритмов и трассировка кабельных линий, проектирование трансформаторных подстанций (ТП, КТП, РП), подключение к сетям.',
    details: ['ЭС — Наружные кабельные и воздушные линии', 'Трансформаторные подстанции ТП / КТП', 'Расстановка опор ВЛ, кабельный журнал', 'Согласование с сетевой организацией', 'Технические условия на присоединение'],
  },
  {
    icon: 'Sun',
    title: 'Освещение',
    desc: 'Внутреннее и наружное освещение: расчёты по ГОСТ, светотехнические расчёты, рабочие чертежи, спецификации оборудования.',
    details: ['ЭО — Внутреннее электроосвещение', 'ЭН — Наружное освещение территории', 'Светотехнические расчёты (DIALux)', 'Щитки освещения, аварийное освещение', 'Планы расположения светильников'],
  },
  {
    icon: 'Sparkles',
    title: 'Архитектурная подсветка',
    desc: 'Концептуальное и рабочее проектирование декоративного и архитектурного освещения фасадов, территорий, малых форм.',
    details: ['АХП — Архитектурно-художественная подсветка', 'Концепция и рабочая документация', 'Подбор прожекторов, лент, контроллеров', 'Управление сценариями освещения', 'Согласование с архитектором'],
  },
  {
    icon: 'CloudLightning',
    title: 'Молниезащита и заземление',
    desc: 'Расчёт и проектирование систем молниезащиты, заземляющих устройств в соответствии с РД 34, ГОСТ Р МЭК 62305.',
    details: ['Расчёт молниезащиты по ГОСТ Р МЭК 62305', 'Заземляющие устройства (ЗУ)', 'Системы УЗИП — защита от перенапряжений', 'Уравнивание потенциалов', 'Протоколы измерений сопротивления'],
  },
  {
    icon: 'Settings',
    title: 'Автоматизация производства',
    desc: 'Создание алгоритмов и автоматизации производственных объектов: АСУ ТП, системы управления, диспетчеризация технологических процессов.',
    details: ['ЭМ — Электроснабжение механизмов', 'АЭМ / АЭО — Автоматизация механизмов и оборудования', 'АСУ ТП: ПЛК, SCADA, HMI', 'Схемы управления электродвигателями', 'Алгоритмы работы технологических линий'],
  },
  {
    icon: 'Shield',
    title: 'Подбор индивидуального оборудования',
    desc: 'Подбор индивидуального оборудования (УКРМ, ИБП, стабилизаторы): компенсация реактивной мощности, резервное питание, защита от скачков напряжения.',
    details: ['ЭГ — Генераторные установки и ИБП', 'УКРМ — компенсация реактивной мощности', 'ИБП для критических нагрузок', 'Стабилизаторы напряжения', 'Дизель-генераторные установки (ДГУ)'],
  },
  {
    icon: 'ClipboardCheck',
    title: 'Бесплатная экспертиза проекта',
    desc: 'Бесплатный аудит вашей проектной документации: выявим несоответствия нормативным требованиям, ошибки в схемах и расчётах. Без обязательств.',
    details: ['Проверка соответствия ПУЭ и ГОСТ', 'Анализ расчётов токов КЗ', 'Контроль состава комплектов РД', 'Выявление ошибок в схемах', 'Письменное заключение по итогам'],
  },
  {
    icon: 'FolderOpen',
    title: 'Исполнительная документация',
    desc: 'Комплекты исполнительной документации по выполненным работам: акты скрытых работ, исполнительные схемы, протоколы испытаний.',
    details: ['Акты освидетельствования скрытых работ', 'Исполнительные схемы прокладки кабелей', 'Протоколы испытаний электрооборудования', 'Ведомости смонтированного оборудования', 'Паспорта заземляющих устройств'],
  },
  {
    icon: 'FileText',
    title: 'Полный комплект документации',
    desc: 'Проектная (ПД) и рабочая (РД) документация по ГОСТ Р 21.101-2026. Спецификации, ведомости, сметы по запросу.',
    details: ['ПД — Проектная документация (ИОС 5.1)', 'РД — Рабочая документация (ЭС, ЭО, ЭН, ЭМ, ЭГ)', 'Спецификации и ведомости оборудования', 'Пояснительные записки и расчёты', 'Сметная документация по запросу'],
  },
  {
    icon: 'Pipette',
    title: 'Электрохимическая защита трубопроводов',
    desc: 'Проектирование систем электрохимической защиты (ЭХЗ) подземных металлических трубопроводов и сооружений от коррозии: катодная, протекторная защита, дренажная защита.',
    details: ['ЭХЗ — Катодная защита трубопроводов', 'Протекторная защита металлоконструкций', 'Дренажная защита от блуждающих токов', 'Расчёт защитных потенциалов по ГОСТ Р 51164', 'Станции катодной защиты (СКЗ), анодные заземлители'],
  },
  {
    icon: 'PackageSearch',
    title: 'Индивидуальный подбор оборудования',
    desc: 'Технический подбор электрооборудования под конкретный объект: от силовых трансформаторов и ячеек КРУ до кабелей и щитовых конструкций. Сравнение производителей, ТКП.',
    details: ['Силовые трансформаторы, КРУ / КСО', 'Вводно-распределительные устройства (ВРУ, ГРЩ)', 'Кабельная продукция: выбор сечений и марок', 'Сравнение аналогов IEK, EKF, Chint, ABB, Schneider', 'Технико-коммерческое предложение (ТКП)'],
  },
]

const PROJECTS = [
  { num: 214, title: 'КТП 10/0,4 кВ промышленного предприятия', voltage: '10 кВ', year: '2024', area: '—', desc: 'КТП наружной установки, РУ-10 кВ, РУ-0,4 кВ, учёт электроэнергии, ввод в работу' },
  { num: 215, title: 'Архитектурная подсветка фасадов 3-х 25-этажных домов в ЖК', voltage: '0,4 кВ', year: '2024', area: '—', desc: 'Концепция и РД декоративной подсветки фасадов, управление сценариями, согласование с архитектором' },
  { num: 216, title: 'Автосервис / автомойка', voltage: '0,4 кВ', year: '2025', area: '3 200 м²', desc: 'Силовое электроснабжение, освещение рабочих зон, наружное освещение территории' },
  { num: 217, title: 'Складской комплекс (логистика)', voltage: '10 кВ', year: '2025', area: '41 000 м²', desc: 'Наружные сети 10 кВ, ТП, внутреннее освещение, молниезащита и заземление' },
  { num: 218, title: 'Торговый центр', voltage: '10 кВ', year: '2025', area: '22 000 м²', desc: 'Электроснабжение, внутреннее и наружное освещение, архитектурная подсветка фасада, молниезащита' },
  { num: 219, title: 'Завод тяжёлой промышленности', voltage: '10 кВ', year: '2025', area: '58 000 м²', desc: 'Электроснабжение цехов, ТП, ВЛ-10 кВ, АСУ ТП, силовое оборудование тяжёлых станков, молниезащита, заземление' },
  { num: 220, title: 'Промышленное предприятие (металлообработка)', voltage: '10 кВ', year: '2026', area: '32 000 м²', desc: 'Электроснабжение, АСУ ТП, РУ-10 кВ, РУ-0,4 кВ, молниезащита, заземление' },
  { num: 221, title: 'Производственный корпус (завод)', voltage: '10 кВ', year: '2026', area: '18 500 м²', desc: 'ТП 10/0,4 кВ, силовое электроснабжение цехов, наружные кабельные сети, освещение' },
]

const SAMPLES = [
  {
    title: 'Однолинейная схема ВРУ',
    mark: 'ЭС',
    type: 'Силовое электроснабжение',
    desc: 'Принципиальная однолинейная схема вводно-распределительного устройства 0,4 кВ с АВР',
    tags: ['ПД', 'РД', '0,4 кВ'],
    sheets: 4,
  },
  {
    title: 'Наружное освещение территории',
    mark: 'ЭН',
    type: 'Наружные сети / Освещение',
    desc: 'План расположения опор освещения, трассировка КЛ-0,4 кВ, ведомость опор',
    tags: ['РД', '0,4 кВ'],
    sheets: 6,
  },
  {
    title: 'Схема КТП 10/0,4 кВ',
    mark: 'ЭС',
    type: 'Электроснабжение',
    desc: 'Принципиальная схема КТП: РУ-10 кВ, силовые трансформаторы, РУ-0,4 кВ, учёт',
    tags: ['ПД', 'РД', '10 кВ'],
    sheets: 8,
  },
  {
    title: 'Освещение производственного цеха',
    mark: 'ЭО',
    type: 'Внутреннее освещение',
    desc: 'План расположения светильников, схема щитка освещения, светотехнический расчёт',
    tags: ['РД', '0,4 кВ'],
    sheets: 5,
  },
  {
    title: 'Молниезащита и заземление',
    mark: 'ЭМЗ',
    type: 'Молниезащита',
    desc: 'План молниезащиты кровли, схема заземляющего устройства, расчёт сопротивления',
    tags: ['ПД', 'РД'],
    sheets: 3,
  },
  {
    title: 'АСУ ТП насосной станции',
    mark: 'ЭМ',
    type: 'Автоматизация',
    desc: 'Функциональная схема автоматизации, схемы управления насосными агрегатами',
    tags: ['РД', '0,4 кВ'],
    sheets: 10,
  },
]

const STATS = [
  { value: '200+', label: 'реализованных объектов' },
  { value: '15+', label: 'лет на рынке (с 2010 г.)' },
  { value: '9', label: 'специалистов в команде' },
  { value: '0,4–10 кВ', label: 'рабочий класс напряжения' },
]

const OBJECT_TYPES = [
  { id: 'industrial', label: 'Производственный корпус', base: 480000 },
  { id: 'enterprise', label: 'Промышленное предприятие', base: 650000 },
  { id: 'substation', label: 'Подстанция / КТП / РУ', base: 580000 },
  { id: 'food', label: 'Пищевое производство', base: 520000 },
  { id: 'warehouse', label: 'Склад / логистический центр', base: 220000 },
  { id: 'auto', label: 'Автосервис / автомойка', base: 200000 },
  { id: 'hotel', label: 'Гостиница / АБК', base: 300000 },
  { id: 'tc', label: 'Торговый центр / магазин', base: 350000 },
  { id: 'fitness', label: 'Фитнес-центр / спортзал', base: 280000 },
  { id: 'restaurant', label: 'Ресторан / кафе', base: 220000 },
]

const VOLTAGE_OPTIONS = [
  { v: '04', l: '0,4 кВ', mult: 1 },
  { v: '10', l: '10 кВ', mult: 1.35 },
]

const PROJECT_MARKS = [
  { id: 'EP', code: 'ЭП', label: 'Электроснабжение (ПД / ИОС 5.1)', desc: 'Раздел проектной документации — система электроснабжения' },
  { id: 'ES', code: 'ЭС', label: 'Силовое электрооборудование', desc: 'Распределительные устройства, щитовые, питание двигателей и установок' },
  { id: 'EO', code: 'ЭО', label: 'Внутреннее электроосвещение', desc: 'Осветительные сети, щитки освещения, аварийное освещение' },
  { id: 'EN', code: 'ЭН', label: 'Наружное электроснабжение', desc: 'Наружные сети, освещение территории, вводы в здание' },
  { id: 'EM', code: 'ЭМ', label: 'Электрооборудование механизмов', desc: 'Краны, подъёмники, конвейеры, насосы, управление двигателями' },
  { id: 'EG', code: 'ЭГ', label: 'Молниезащита и заземление', desc: 'Системы молниезащиты зданий, заземляющие устройства, уравнивание потенциалов' },
]

const NORMATIVE_DOCS = [
  { code: 'ГОСТ Р 21.101-2026', title: 'Основные требования к проектной и рабочей документации', scope: 'Все разделы' },
  { code: 'ПУЭ (7-е изд.)', title: 'Правила устройства электроустановок', scope: 'Все разделы' },
  { code: 'СП 256.1325800.2022', title: 'Электроустановки жилых и общественных зданий', scope: 'Электроснабжение' },
  { code: 'СП 31-110-2003', title: 'Проектирование и монтаж электроустановок жилых и общественных зданий', scope: 'Электроснабжение' },
  { code: 'ГОСТ Р 50571 (серия)', title: 'Электроустановки низкого напряжения', scope: 'Электроснабжение 0,4 кВ' },
  { code: 'РД 34.20.185-94 (СО 153)', title: 'Инструкция по проектированию городских электрических сетей', scope: 'Наружные сети' },
  { code: 'СП 76.13330.2016', title: 'Электротехнические устройства (актуализ. СНиП 3.05.06-85)', scope: 'Наружные сети, монтаж' },
  { code: 'ГОСТ 31565-2012', title: 'Кабельные изделия. Требования пожарной безопасности', scope: 'Кабельные линии' },
  { code: 'СО 153-34.48.519-2002', title: 'Прокладка кабелей напряжением до 500 кВ в земляных траншеях', scope: 'Кабель в земле' },
  { code: 'ГОСТ Р МЭК 60364-5-52', title: 'Выбор и монтаж электрооборудования. Кабельные системы', scope: 'Кабель по воздуху / лоткам' },
  { code: 'СП 52.13330.2016', title: 'Естественное и искусственное освещение (актуализ. СНиП 23-05-95)', scope: 'Освещение' },
  { code: 'ГОСТ Р 55710-2013', title: 'Освещение рабочих мест внутри зданий. Нормы и методы измерений', scope: 'Освещение рабочих мест' },
  { code: 'МЭК 60598 / ГОСТ Р МЭК 60598', title: 'Светильники. Общие требования и методы испытаний', scope: 'Осветительные приборы' },
  { code: 'СО 153-34.21.122-2003 (РД 34)', title: 'Инструкция по устройству молниезащиты зданий и сооружений', scope: 'Молниезащита' },
  { code: 'ГОСТ Р МЭК 62305 (серия)', title: 'Защита от грозовых перенапряжений', scope: 'Молниезащита / УЗИП' },
  { code: 'ГОСТ 12.1.030-81 ССБТ', title: 'Защитное заземление и зануление', scope: 'Заземление' },
  { code: 'ГОСТ Р МЭК 61936-1', title: 'Электроустановки переменного тока выше 1 кВ', scope: 'Высоковольтные установки' },
  { code: 'НТП ЭПП-94', title: 'Нормы технологического проектирования понизительных подстанций', scope: 'Подстанции 35–110 кВ' },
  { code: 'СО 34.35.301', title: 'Типовые объёмы работ РЗА', scope: 'РЗА / Подстанции' },
  { code: 'ГОСТ Р 55614-2013', title: 'Источники бесперебойного питания (ИБП)', scope: 'ИБП / резервное питание' },
  { code: 'ГОСТ Р МЭК 61439 (серия)', title: 'Низковольтные комплектные устройства распределения и управления', scope: 'ВРУ, ГРЩ, ШР' },
  { code: 'ГОСТ Р 54149-2010 / EN 50160', title: 'Показатели качества электроэнергии', scope: 'УКРМ / качество питания' },
  { code: 'СП 4.13130.2013', title: 'Системы противопожарной защиты. Ограничение распространения пожара', scope: 'Противопожарные разрывы' },
  { code: 'Приказ Минстроя № 985/пр', title: 'Правила разработки и оформления ПД и РД', scope: 'Состав документации' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg leading-none">ЭТМПРО</span>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Электротехническое моделирование и проектирование</p>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+79782203380" className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
            +7 978 220-3-380
          </a>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => scrollTo('contacts')}>
            Оставить заявку
          </Button>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={22} className="text-slate-700" />
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="block text-sm text-slate-700 hover:text-emerald-600 py-1" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2" onClick={() => { setOpen(false); scrollTo('contacts') }}>
            Оставить заявку
          </Button>
        </div>
      )}
    </header>
  )
}

function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3">
      <a
        href="tel:+79782203380"
        className="flex items-center gap-2 flex-1 min-w-0 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-2.5 rounded-sm"
      >
        <Icon name="Phone" size={15} className="text-emerald-600 shrink-0" />
        <span className="text-sm font-semibold text-slate-800 truncate">+7 978 220-3-380</span>
      </a>
      <Button
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 text-sm shrink-0"
        onClick={() => scrollTo('contacts')}
      >
        Заявка
      </Button>
    </div>
  )
}

function CircuitPattern({ id = 'circuit', color = '#10b981', opacity = 0.07 }: { id?: string, color?: string, opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
          {/* Главные шины */}
          <line x1="0" y1="20" x2="160" y2="20" stroke={color} strokeWidth="1.5"/>
          <line x1="0" y1="140" x2="160" y2="140" stroke={color} strokeWidth="1.5"/>
          <line x1="20" y1="0" x2="20" y2="160" stroke={color} strokeWidth="1.5"/>
          <line x1="140" y1="0" x2="140" y2="160" stroke={color} strokeWidth="1.5"/>
          {/* Перемычки */}
          <line x1="20" y1="20" x2="80" y2="20" stroke={color} strokeWidth="1"/>
          <line x1="80" y1="20" x2="80" y2="60" stroke={color} strokeWidth="1"/>
          <line x1="80" y1="60" x2="140" y2="60" stroke={color} strokeWidth="1"/>
          <line x1="140" y1="60" x2="140" y2="80" stroke={color} strokeWidth="1"/>
          <line x1="20" y1="80" x2="60" y2="80" stroke={color} strokeWidth="1"/>
          <line x1="60" y1="80" x2="60" y2="140" stroke={color} strokeWidth="1"/>
          <line x1="100" y1="100" x2="140" y2="100" stroke={color} strokeWidth="1"/>
          <line x1="100" y1="100" x2="100" y2="140" stroke={color} strokeWidth="1"/>
          {/* Резистор (зигзаг) */}
          <polyline points="22,80 26,73 30,87 34,73 38,87 42,73 46,80 50,80" fill="none" stroke={color} strokeWidth="1"/>
          {/* Конденсатор */}
          <line x1="80" y1="95" x2="80" y2="105" stroke={color} strokeWidth="1"/>
          <line x1="74" y1="95" x2="86" y2="95" stroke={color} strokeWidth="1.5"/>
          <line x1="74" y1="105" x2="86" y2="105" stroke={color} strokeWidth="1.5"/>
          <line x1="80" y1="105" x2="80" y2="115" stroke={color} strokeWidth="1"/>
          {/* Трансформатор (два кольца) */}
          <circle cx="110" cy="50" r="6" fill="none" stroke={color} strokeWidth="1"/>
          <circle cx="122" cy="50" r="6" fill="none" stroke={color} strokeWidth="1"/>
          <line x1="104" y1="50" x2="100" y2="50" stroke={color} strokeWidth="1"/>
          <line x1="128" y1="50" x2="132" y2="50" stroke={color} strokeWidth="1"/>
          {/* Выключатель (разомкнут) */}
          <circle cx="30" cy="50" r="2" fill={color}/>
          <line x1="32" y1="50" x2="44" y2="42" stroke={color} strokeWidth="1"/>
          <circle cx="46" cy="50" r="2" fill={color}/>
          {/* Узловые точки */}
          <circle cx="20" cy="20" r="3" fill={color}/>
          <circle cx="140" cy="20" r="3" fill={color}/>
          <circle cx="20" cy="140" r="3" fill={color}/>
          <circle cx="140" cy="140" r="3" fill={color}/>
          <circle cx="80" cy="20" r="2.5" fill="none" stroke={color} strokeWidth="1"/>
          <circle cx="80" cy="60" r="2" fill={color}/>
          <circle cx="140" cy="60" r="2" fill={color}/>
          <circle cx="60" cy="80" r="2.5" fill="none" stroke={color} strokeWidth="1"/>
          <circle cx="100" cy="100" r="2" fill={color}/>
          {/* Измерительный прибор (кружок с буквой-обозначением) */}
          <circle cx="30" cy="120" r="8" fill="none" stroke={color} strokeWidth="1"/>
          <line x1="26" y1="120" x2="28" y2="116" stroke={color} strokeWidth="1"/>
          <line x1="28" y1="116" x2="32" y2="124" stroke={color} strokeWidth="1"/>
          <line x1="32" y1="124" x2="34" y2="120" stroke={color} strokeWidth="1"/>
          <line x1="22" y1="120" x2="20" y2="120" stroke={color} strokeWidth="1"/>
          <line x1="38" y1="120" x2="40" y2="120" stroke={color} strokeWidth="1"/>
          {/* Заземление */}
          <line x1="120" y1="120" x2="120" y2="132" stroke={color} strokeWidth="1"/>
          <line x1="113" y1="132" x2="127" y2="132" stroke={color} strokeWidth="1.5"/>
          <line x1="116" y1="136" x2="124" y2="136" stroke={color} strokeWidth="1"/>
          <line x1="118" y1="140" x2="122" y2="140" stroke={color} strokeWidth="0.7"/>
          {/* Катушка индуктивности */}
          <path d="M100,80 Q103,74 106,80 Q109,74 112,80 Q115,74 118,80 Q121,74 124,80 Q127,74 130,80" fill="none" stroke={color} strokeWidth="1"/>
          <line x1="100" y1="80" x2="98" y2="80" stroke={color} strokeWidth="1"/>
          <line x1="130" y1="80" x2="132" y2="80" stroke={color} strokeWidth="1"/>
          {/* Диод */}
          <polygon points="50,120 58,115 58,125" fill="none" stroke={color} strokeWidth="1"/>
          <line x1="58" y1="115" x2="58" y2="125" stroke={color} strokeWidth="1.5"/>
          <line x1="44" y1="120" x2="50" y2="120" stroke={color} strokeWidth="1"/>
          <line x1="58" y1="120" x2="64" y2="120" stroke={color} strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`}/>
    </svg>
  )
}

function Hero() {
  return (
    <section className="bg-slate-900 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <CircuitPattern />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { code: 'ЭП', label: 'Электроснабжение (ПД / ИОС 5.1)' },
              { code: 'ЭС', label: 'Силовое электрооборудование' },
              { code: 'ЭО', label: 'Внутреннее освещение' },
              { code: 'ЭН', label: 'Наружные сети' },
              { code: 'ЭМ', label: 'Электрооборудование механизмов' },
              { code: 'ЭГ', label: 'Заземление и молниезащита' },
              { code: 'ЭЭ', label: 'АСКУЭ / учёт электроэнергии' },
              { code: 'ДГУ', label: 'Дизель-генераторы и ИБП' },
              { code: 'ПД', label: 'Проектная документация' },
              { code: 'ИОС 5.1', label: 'Инженерные системы' },
            ].map(({ code, label }) => (
              <span key={code} className="inline-flex items-center gap-1.5 bg-emerald-600/15 border border-emerald-500/25 text-emerald-400 text-xs font-mono px-2.5 py-1">
                <span className="font-bold text-emerald-300">{code}</span>
                <span className="text-emerald-500/80 hidden sm:inline">—</span>
                <span className="text-emerald-400/70 hidden sm:inline">{label}</span>
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] max-w-3xl mb-4">
            Проектирование систем электроснабжения и автоматизации
          </h1>
          <p className="text-emerald-400 font-mono text-base md:text-lg mb-3">
            Создание алгоритмов и автоматизации производственных объектов
          </p>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Полный комплект проектной и рабочей документации по ГОСТ Р 21.101-2026. Сопровождение в государственной (ГГЭ) и негосударственной экспертизе.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8"
              onClick={() => scrollTo('calculator')}
            >
              Рассчитать стоимость
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 bg-transparent"
              onClick={() => scrollTo('projects')}
            >
              Смотреть проекты
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700 mt-16 border border-slate-700">
          {STATS.map((s) => (
            <div key={s.label} className="bg-slate-800 px-6 py-5">
              <p className="text-2xl md:text-3xl font-bold text-emerald-400">{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ s, i }: { s: typeof SERVICES[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="bg-white p-8 group hover:bg-slate-50 transition-colors relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors">
        <Icon name={s.icon} size={18} className="text-emerald-600 group-hover:text-white transition-colors" fallback="Zap" />
      </div>
      <h3 className="font-semibold text-slate-900 text-lg mb-3">{s.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 bottom-0 translate-y-full z-20 bg-slate-900 border border-emerald-700 shadow-xl p-4"
          >
            <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-2">Состав:</p>
            <ul className="space-y-1">
              {s.details.map(d => (
                <li key={d} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-500 mt-0.5 shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Services() {
  return (
    <section id="services" className="bg-white py-20 border-b border-slate-200 relative overflow-hidden">
      <CircuitPattern id="circuit-services" color="#064e3b" opacity={0.04} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">Направления</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Что мы проектируем</h2>
            <p className="text-slate-400 text-sm mt-2">Наведите на карточку — увидите состав документации</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">Портфолио</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">Реализованные объекты</h2>
        <div className="border border-slate-200 divide-y divide-slate-200 bg-white">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors group"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <span className="text-slate-300 font-mono text-sm w-8 shrink-0 hidden sm:block">{p.num}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{p.title}</p>
                <p className="text-slate-500 text-sm mt-0.5">{p.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1">{p.voltage}</span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">{p.area}</span>
                <span className="text-xs text-slate-400">{p.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 text-slate-500 text-sm">
          <Icon name="FileSearch" size={16} className="text-emerald-600 shrink-0" fallback="FileText" />
          <span>Образцы проектов — по запросу, под NDA. <button onClick={() => scrollTo('contacts')} className="text-emerald-700 hover:underline font-medium">Запросить</button></span>
        </div>
      </div>
    </section>
  )
}

function Calculator() {
  const [objType, setObjType] = useState(OBJECT_TYPES[0].id)
  const [area, setArea] = useState(1000)
  const [areaInput, setAreaInput] = useState('1000')
  const [voltages, setVoltages] = useState<string[]>(['04'])
  const [lineLength, setLineLength] = useState(0)
  const [lineLengthInput, setLineLengthInput] = useState('0')
  const [lineType, setLineType] = useState<'none' | 'KL' | 'VL'>('none')
  const [selectedMarks, setSelectedMarks] = useState<string[]>(['EP'])
  const [hasEE, setHasEE] = useState(false)
  const [hasDGU, setHasDGU] = useState(false)
  const [hasArchlight, setHasArchlight] = useState(false)

  const handleAreaInput = (val: string) => {
    setAreaInput(val)
    const num = parseInt(val.replace(/\D/g, ''), 10)
    if (!isNaN(num) && num > 0) setArea(Math.min(num, 50000))
  }

  const handleSlider = (val: number) => {
    setArea(val)
    setAreaInput(String(val))
  }

  const handleLineLengthInput = (val: string) => {
    setLineLengthInput(val)
    const num = parseFloat(val.replace(',', '.'))
    if (!isNaN(num) && num >= 0) setLineLength(Math.min(num, 100))
  }

  const toggleVoltage = (v: string) => {
    setVoltages(prev =>
      prev.includes(v) ? (prev.length > 1 ? prev.filter(x => x !== v) : prev) : [...prev, v]
    )
  }

  const toggleMark = (id: string) => {
    setSelectedMarks(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(x => x !== id) : prev) : [...prev, id]
    )
  }

  const base = OBJECT_TYPES.find(o => o.id === objType)?.base ?? 480000
  const areaCoeff = 0.7 + (area / 10000) * 0.9
  const voltCoeff = voltages.reduce((acc, v) => {
    const opt = VOLTAGE_OPTIONS.find(o => o.v === v)
    return Math.max(acc, opt?.mult ?? 1)
  }, 1) + (voltages.length > 1 ? 0.15 : 0)
  const lineCoeff = lineType !== 'none' ? lineLength * (lineType === 'KL' ? 35000 : 20000) : 0
  const marksCoeff = 1 + (selectedMarks.length - 1) * 0.18
  const extras = (hasEE ? 70000 : 0) + (hasDGU ? 90000 : 0) + (hasArchlight ? 120000 : 0)
  const rawTotal = Math.round((base * areaCoeff * voltCoeff * marksCoeff + extras + lineCoeff) * 0.8 / 10000) * 10000
  const unround = (v: number) => v % 1000 === 0 ? v - 2000 : v
  const total = unround(rawTotal)
  const days = Math.round(20 + (area / 5000) * 10 + (hasArchlight ? 10 : 0) + (voltages.length > 1 ? 10 : 0) + (selectedMarks.length - 1) * 5 + lineLength * 0.5)

  const formatPrice = (val: number) => {
    const lo = unround(Math.round(val * 0.85 / 1000)) 
    const hi = unround(Math.round(val / 1000))
    if (val < 1000000) {
      return `${lo} тыс. ₽ — ${hi} тыс. ₽`
    }
    const loM = (val * 0.85 / 1000000)
    const hiM = (val / 1000000)
    const flo = loM % 0.1 === 0 ? (loM - 0.02).toFixed(2) : loM.toFixed(1)
    const fhi = hiM % 0.1 === 0 ? (hiM - 0.02).toFixed(2) : hiM.toFixed(1)
    return `${flo} млн ₽ — ${fhi} млн ₽`
  }

  return (
    <section id="calculator" className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">Стоимость</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">Калькулятор проекта</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Тип объекта</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OBJECT_TYPES.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setObjType(o.id)}
                    className={`px-4 py-3 text-sm text-left border transition-colors ${
                      objType === o.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Разделы проекта (марки РД / ИОС 5.1)</p>
              <p className="text-xs text-slate-400 mb-3">Выберите нужные марки документации — можно несколько</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROJECT_MARKS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMark(m.id)}
                    className={`px-4 py-3 text-sm text-left border transition-colors ${
                      selectedMarks.includes(m.id)
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`font-mono font-bold text-xs px-1.5 py-0.5 ${selectedMarks.includes(m.id) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{m.code}</span>
                      <span className={`text-sm ${selectedMarks.includes(m.id) ? 'font-semibold text-emerald-800' : ''}`}>{m.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Площадь объекта: <span className="text-slate-900 font-bold">{area.toLocaleString('ru')} м²</span>
              </p>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={areaInput}
                  onChange={e => handleAreaInput(e.target.value)}
                  className="w-32 border border-slate-300 focus:border-emerald-500 focus:outline-none px-3 py-2 text-sm text-slate-900 font-mono"
                  placeholder="м²"
                />
                <span className="text-slate-400 text-sm">м² — или выберите ползунком</span>
              </div>
              <input
                type="range" min={100} max={50000} step={100}
                value={area}
                onChange={e => handleSlider(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>100 м²</span><span>50 000 м²</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Класс напряжения</p>
              <p className="text-xs text-slate-400 mb-3">Можно выбрать оба (РУ-10 кВ + РУ-0,4 кВ одновременно)</p>
              <div className="grid grid-cols-2 gap-2">
                {VOLTAGE_OPTIONS.map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => toggleVoltage(v)}
                    className={`py-3 text-sm font-mono border transition-colors ${
                      voltages.includes(v)
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {voltages.includes(v) && <span className="mr-1 text-emerald-600">✓</span>}
                    {l}
                  </button>
                ))}
              </div>
              <div className="mt-2 border border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center gap-3">
                <Icon name="Info" size={14} className="text-slate-400 shrink-0" />
                <p className="text-xs text-slate-500">Объекты 35 кВ и 110 кВ рассчитываются индивидуально —{' '}
                  <button onClick={() => scrollTo('contacts')} className="text-emerald-600 hover:underline">оставьте заявку</button>
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Воздушные / кабельные линии (ВЛ / КЛ)</p>
              <p className="text-xs text-slate-400 mb-3">Укажите тип и длину, если в проект входит прокладка линий</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { v: 'none', l: 'Не требуется' },
                  { v: 'KL', l: 'Кабельная (КЛ)' },
                  { v: 'VL', l: 'Воздушная (ВЛ)' },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setLineType(v as 'none' | 'KL' | 'VL')}
                    className={`py-3 text-sm border transition-colors ${
                      lineType === v
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {lineType !== 'none' && (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={lineLengthInput}
                    onChange={e => handleLineLengthInput(e.target.value)}
                    className="w-28 border border-slate-300 focus:border-emerald-500 focus:outline-none px-3 py-2 text-sm text-slate-900 font-mono"
                    placeholder="0"
                  />
                  <span className="text-slate-400 text-sm shrink-0">км</span>
                  <input
                    type="range" min={0} max={50} step={0.5}
                    value={lineLength}
                    onChange={e => { setLineLength(Number(e.target.value)); setLineLengthInput(String(e.target.value)) }}
                    className="flex-1 accent-emerald-600 h-1.5"
                  />
                  <span className="text-xs text-slate-400 shrink-0">50 км</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Дополнительные разделы</p>
              <div className="space-y-2">
                {[
                  { label: 'ЭЭ — Электроэнергетика / АСКУЭ', val: hasEE, set: setHasEE, price: '+70 000 ₽' },
                  { label: 'ДГУ — Дизель-генераторы и ИБП', val: hasDGU, set: setHasDGU, price: '+90 000 ₽' },
                  { label: 'Архитектурная подсветка', val: hasArchlight, set: setHasArchlight, price: '+120 000 ₽' },
                ].map(({ label, val, set, price }) => (
                  <label key={label} className="flex items-center justify-between p-3 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => set(!val)}
                        className={`w-4 h-4 border-2 flex items-center justify-center transition-colors cursor-pointer ${val ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}
                      >
                        {val && <Icon name="Check" size={10} className="text-white" />}
                      </div>
                      <span className="text-sm text-slate-700">{label}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{price}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
          <div className="lg:col-span-1">
            <div className="bg-slate-900 p-6 sticky top-20 relative overflow-hidden">
              <CircuitPattern id="circuit-calc" color="#10b981" opacity={0.08} />
              <div className="relative z-10">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">Ориентировочная стоимость</p>
              <p className="text-3xl font-bold text-white leading-tight">
                {formatPrice(total)}
              </p>
              <div className="mt-6 border-t border-slate-700 pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Срок разработки</span>
                  <span className="text-white font-mono">{days} раб. дней</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Марки РД</span>
                  <span className="text-white text-xs font-mono">{selectedMarks.map(id => PROJECT_MARKS.find(m => m.id === id)?.code).join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Напряжение</span>
                  <span className="text-white text-xs font-mono">{voltages.map(v => VOLTAGE_OPTIONS.find(o => o.v === v)?.l).join(' + ')}</span>
                </div>
                {lineType !== 'none' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{lineType === 'KL' ? 'КЛ' : 'ВЛ'}</span>
                    <span className="text-white font-mono text-xs">{lineLength} км</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Нормативная база</span>
                  <span className="text-white text-xs">ГОСТ Р 21.101-2026</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-5 leading-relaxed">Расчёт ориентировочный. Точная стоимость — после изучения ТЗ.</p>
              <Button className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" onClick={() => scrollTo('contacts')}>
                Получить точный расчёт
              </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Normative() {
  return (
    <section id="normative" className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">Нормативная база</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Используемая нормативная документация</h2>
        <p className="text-slate-500 mb-10 max-w-2xl">Вся документация разрабатывается строго в соответствии с действующими нормативными документами.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-3 text-sm font-semibold w-64">Обозначение</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">Наименование</th>
                <th className="text-left px-4 py-3 text-sm font-semibold w-48 hidden sm:table-cell">Область применения</th>
              </tr>
            </thead>
            <tbody>
              {NORMATIVE_DOCS.map((doc, i) => (
                <motion.tr
                  key={doc.code}
                  className={`border-b border-slate-200 hover:bg-emerald-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <td className="px-4 py-3 text-sm text-emerald-700 font-semibold align-top">{doc.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 align-top">{doc.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 align-top hidden sm:table-cell">{doc.scope}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">О компании</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Проектируем с 2010 года</h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              Специализируемся на проектировании систем электроснабжения, освещения, молниезащиты и архитектурной подсветки для производственных, промышленных, складских и коммерческих объектов.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Нас 9 человек — небольшая, но слаженная команда с глубокой экспертизой. Документация выпускается строго по ГОСТ Р 21.101-2026. Работаем по всей России.
            </p>
            <div className="space-y-3">
              {[
                'Допуск СРО к проектированию',
                'ГОСТ Р 21.101-2026 — актуальный стандарт на проектную документацию',
                'Официальный партнёр IEK, EKF, Systeme Electric, Chint, КЭАЗ',
                'Опыт более 15 лет, 200+ реализованных объектов',
                'Помогаем пройти государственную (ГГЭ) и негосударственную (НГЭ) экспертизу проекта',
                'Бесплатная экспертиза вашей проектной документации',
              ].map(f => (
                <div key={f} className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Работаете ли вы в регионах?', a: 'Да, работаем по всей России. Выезд на объект обсуждается индивидуально.' },
              { q: 'Сколько занимает проектирование?', a: 'От 20 рабочих дней для небольших объектов. Срок зависит от площади и состава разделов — рассчитаем точно после изучения ТЗ.' },
              { q: 'Делаете ли проекты для квартир и жилых домов?', a: 'Нет, мы специализируемся на коммерческих и производственных объектах: производственные корпуса, промышленные предприятия, склады, подстанции, пищевое производство и т.д.' },
              { q: 'По какому стандарту оформляете документацию?', a: 'Вся документация выпускается по актуальному ГОСТ Р 21.101-2026 на проектную и рабочую документацию.' },
              { q: 'Что такое бесплатная экспертиза проекта?', a: 'Мы бесплатно проверим вашу проектную документацию на соответствие нормативным требованиям, выявим ошибки в схемах и расчётах. По итогу дадим заключение — без обязательств заказывать у нас.' },
              { q: 'Сопровождаете ли проект в ГГЭ и НГЭ?', a: 'Да. Полное сопровождение проекта в государственной (Главгосэкспертиза) и негосударственной экспертизе. Подготовка ответов на замечания, корректировка ПД до получения положительного заключения. У нас более 50 успешных заключений.' },
            ].map(({ q, a }) => (
              <details key={q} className="bg-slate-50 border border-slate-200 group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none">
                  <span className="font-medium text-slate-900 text-sm">{q}</span>
                  <Icon name="ChevronDown" size={16} className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-3" />
                </summary>
                <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  const [files, setFiles] = useState<File[]>([])
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [objectName, setObjectName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_FILES = 5
  const MAX_TOTAL_MB = 4.5
  const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024
  const ALLOWED_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.rar'

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    setFiles(prev => [...prev, ...Array.from(incoming)].slice(0, MAX_FILES))
  }

  const removeFile = (idx: number) => setFiles(f => f.filter((_, i) => i !== idx))

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleSubmit = async () => {
    if (!name || !contact) return
    setStatus('loading')
    try {
      const filesData = await Promise.all(
        files.map(async f => ({ name: f.name, content: await toBase64(f), size: f.size }))
      )
      const res = await fetch(SEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, object_name: objectName, description, files: filesData }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setName(''); setContact(''); setObjectName(''); setDescription(''); setFiles([])
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contacts" className="bg-slate-900 py-20 relative overflow-hidden">
      <CircuitPattern id="circuit-contacts" color="#10b981" opacity={0.05} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-emerald-400 text-sm font-mono tracking-widest uppercase mb-2">Контакты</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Обсудим ваш объект</h2>
            <p className="text-slate-400 leading-relaxed mb-10">Отправьте заявку — инженер свяжется с вами в течение одного рабочего дня.</p>
            <div className="space-y-5">
              {[
                { icon: 'Phone', label: 'Телефон', val: '+7 978 220-3-380' },
                { icon: 'Mail', label: 'Email', val: 'info@eoes.ru' },
                { icon: 'Globe', label: 'Сайт', val: 'eoes.ru' },
                { icon: 'MapPin', label: 'География', val: 'Работаем по всей России' },
                { icon: 'Clock', label: 'График', val: 'Пн–Пт, 9:00–18:00 (МСК)' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={icon} size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                    {label === 'Email' ? (
                      <a href="mailto:info@eoes.ru" className="text-white text-sm hover:text-emerald-400 transition-colors">{val}</a>
                    ) : label === 'Телефон' ? (
                      <a href="tel:+79782203380" className="text-white text-sm hover:text-emerald-400 transition-colors">{val}</a>
                    ) : (
                      <p className="text-white text-sm">{val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
                <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
                  <Icon name="CheckCircle" size={28} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-lg text-center">Заявка отправлена!</p>
                <p className="text-slate-400 text-sm text-center">Свяжемся с вами в течение одного рабочего дня.</p>
                <button onClick={() => setStatus('idle')} className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors mt-2">
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <>
                <p className="text-white font-semibold text-lg mb-6">Оставить заявку</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Ваше имя *</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Иван Петров"
                      className="w-full bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none text-white placeholder-slate-500 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Телефон или Email *</label>
                    <input
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder="+7 900 000-00-00 или email"
                      className="w-full bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none text-white placeholder-slate-500 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Название объекта</label>
                    <input
                      value={objectName}
                      onChange={e => setObjectName(e.target.value)}
                      placeholder="Производственный корпус, склад..."
                      className="w-full bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none text-white placeholder-slate-500 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Описание задачи</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Опишите задачу или прикрепите ТЗ..."
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none text-white placeholder-slate-500 px-4 py-3 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Файлы (до {MAX_FILES})</label>
                    <div
                      className="border border-dashed border-slate-600 hover:border-slate-500 transition-colors p-4 text-center cursor-pointer"
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input ref={fileInputRef} type="file" multiple accept={ALLOWED_TYPES} className="hidden" onChange={e => handleFiles(e.target.files)} />
                      <Icon name="Upload" size={20} className="text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-500 text-xs">Перетащите файлы или нажмите для выбора</p>
                      <p className="text-slate-600 text-xs mt-1">PDF, DOC, DOCX, XLS, XLSX, DWG, DXF, JPG, PNG, ZIP, RAR</p>
                    </div>
                    <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-2 flex items-start gap-2">
                      <Icon name="AlertTriangle" size={13} className="text-yellow-400 mt-0.5 shrink-0" />
                      <p className="text-yellow-400/90 text-xs leading-relaxed">
                        Общий объём документов через заявку — не более {MAX_TOTAL_MB} МБ. Остальные документы досылайте напрямую с вашего почтового ящика на&nbsp;
                        <a href="mailto:info@eoes.ru" className="underline hover:text-yellow-300">info@eoes.ru</a>
                      </p>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/50 px-3 py-1.5">
                            <Icon name="File" size={12} />
                            <span className="flex-1 truncate">{f.name}</span>
                            <span className="text-slate-500 shrink-0">{(f.size / 1024 / 1024).toFixed(1)} МБ</span>
                            <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 transition-colors ml-1 shrink-0">
                              <Icon name="X" size={13} />
                            </button>
                          </div>
                        ))}
                        <div className={`text-xs px-1 mt-1 ${totalSize > MAX_TOTAL_BYTES ? 'text-red-400' : 'text-slate-500'}`}>
                          Итого: {(totalSize / 1024 / 1024).toFixed(2)} МБ из {MAX_TOTAL_MB} МБ
                        </div>
                      </div>
                    )}
                  </div>
                  {status === 'error' && (
                    <p className="text-red-400 text-xs text-center">Ошибка отправки. Попробуйте ещё раз или напишите на info@eoes.ru</p>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={status === 'loading' || !name || !contact || totalSize > MAX_TOTAL_BYTES}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-5"
                  >
                    {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
                  </Button>
                  <p className="text-slate-500 text-xs text-center">Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 flex items-center justify-center">
              <Icon name="Zap" size={12} className="text-white" />
            </div>
            <span className="text-slate-400 text-sm">ЭТМПРО · eoes.ru © 2026</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{l.label}</a>
            ))}
          </div>
          <p className="text-slate-600 text-xs">info@eoes.ru</p>
        </div>
        <div className="border-t border-slate-800 pt-4">
          <p className="text-slate-600 text-xs leading-relaxed text-center">
            Вся информация, представленная на сайте, носит исключительно информационный характер и не является публичной офертой в соответствии со ст. 437 ГК РФ.
            Стоимость услуг рассчитывается индивидуально по итогам изучения технического задания.
            Все права защищены. Использование материалов сайта без письменного разрешения правообладателя запрещено.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white pb-[68px] md:pb-0">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Calculator />
      <About />
      <Normative />
      <Contacts />
      <Footer />
      <MobileBottomBar />
    </div>
  )
}
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const SEND_URL = 'https://functions.poehali.dev/f89ef799-3a54-43fb-acc7-b79212ae22fa'

const NAV_LINKS = [
  { label: 'Услуги', href: '#services' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Калькулятор', href: '#calculator' },
  { label: 'О компании', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
]

const SERVICES = [
  { icon: 'Zap', title: 'Электроснабжение', desc: 'Внешнее и внутреннее электроснабжение предприятий. Схемы питания 0,4–110 кВ, расчёты токов КЗ, выбор оборудования.' },
  { icon: 'Shield', title: 'РЗА', desc: 'Релейная защита и автоматика: проектирование, уставки, согласование с энергосистемой, программирование МП-терминалов.' },
  { icon: 'Cpu', title: 'АСУ ТП', desc: 'Автоматизированные системы управления технологическими процессами. SCADA, ПЛК, диспетчеризация.' },
  { icon: 'Cable', title: 'Кабельные сети', desc: 'Трассировка кабельных линий, расчёт сечений и потерь напряжения, кабельные журналы и спецификации.' },
  { icon: 'LayoutGrid', title: 'Распредустройства', desc: 'Проектирование ГРЩ, ТП, КРУ, КСО — от однолинейных схем до полного комплекта рабочей документации.' },
  { icon: 'FileText', title: 'Экспертиза и согласование', desc: 'Сопровождение проекта в государственной экспертизе, согласование ТУ и проекта с сетевыми организациями.' },
]

const PROJECTS = [
  { title: 'Нефтеперерабатывающий завод', voltage: '110 кВ', year: '2024', area: '48 000 м²', desc: 'Полный комплекс проектирования электроснабжения НПЗ: ГПП 110/10 кВ, РЗА, кабельные сети, АСУ ТП' },
  { title: 'Металлургический комбинат', voltage: '35 кВ', year: '2023', area: '62 000 м²', desc: 'Реконструкция системы электроснабжения прокатного цеха, замена КРУ 6 кВ' },
  { title: 'Химический комплекс', voltage: '10 кВ', year: '2023', area: '19 000 м²', desc: 'Взрывозащищённое электрооборудование, зоны Ex, I категория надёжности' },
  { title: 'Пищевой завод', voltage: '0,4 кВ', year: '2024', area: '11 000 м²', desc: 'Электроснабжение чистых помещений, АСУ ТП линий розлива и упаковки' },
  { title: 'Логистический центр', voltage: '10 кВ', year: '2024', area: '35 000 м²', desc: 'Проектирование ТП 10/0,4 кВ, системы освещения склада, противопожарная автоматика' },
  { title: 'Водоканал', voltage: '6 кВ', year: '2023', area: '8 000 м²', desc: 'Реконструкция ЦРП 6 кВ, замена МП-защит, модернизация АСУ ТП насосных станций' },
]

const STATS = [
  { value: '200+', label: 'реализованных объектов' },
  { value: '15', label: 'лет на рынке' },
  { value: '35', label: 'инженеров в штате' },
  { value: '110 кВ', label: 'макс. класс напряжения' },
]

const OBJECT_TYPES = [
  { id: 'industrial', label: 'Промышленный завод', base: 800000 },
  { id: 'energy', label: 'Энергообъект / ПС', base: 600000 },
  { id: 'chemical', label: 'Химическое производство', base: 1000000 },
  { id: 'food', label: 'Пищевое производство', base: 500000 },
  { id: 'warehouse', label: 'Склад / Логистика', base: 250000 },
]
const VOLTAGE_MULT: Record<string, number> = { '04': 1, '10': 1.4, '35': 1.8, '110': 2.5 }

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
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+79782203380" className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
            +7 978 220-33-80
          </a>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Оставить заявку
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={22} className="text-slate-700" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="block text-sm text-slate-700 hover:text-emerald-600 py-1" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
            Оставить заявку
          </Button>
        </div>
      )}
    </header>
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
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-widest uppercase px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Электротехническое моделирование и проектирование
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] max-w-3xl mb-6">
            Проектирование систем электроснабжения и автоматизации
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Разрабатываем проектную и рабочую документацию для промышленных объектов и коммерческих предприятий. РЗА, АСУ ТП, кабельные сети — под ключ.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8">
              Рассчитать стоимость
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 bg-transparent">
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

function Services() {
  return (
    <section id="services" className="bg-white py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">Направления</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Что мы проектируем</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              className="bg-white p-8 group hover:bg-slate-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors">
                <Icon name={s.icon} size={18} className="text-emerald-600 group-hover:text-white transition-colors" fallback="Zap" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-3">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
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
              <span className="text-slate-300 font-mono text-sm w-6 shrink-0 hidden sm:block">{String(i + 1).padStart(2, '0')}</span>
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
      </div>
    </section>
  )
}

function Calculator() {
  const [objType, setObjType] = useState(OBJECT_TYPES[0].id)
  const [area, setArea] = useState(5000)
  const [voltage, setVoltage] = useState('10')
  const [hasRza, setHasRza] = useState(false)
  const [hasAsup, setHasAsup] = useState(false)
  const [hasExpert, setHasExpert] = useState(false)

  const base = OBJECT_TYPES.find(o => o.id === objType)?.base ?? 800000
  const areaCoeff = 0.8 + (area / 50000) * 1.2
  const voltCoeff = VOLTAGE_MULT[voltage] ?? 1
  const extras = (hasRza ? 180000 : 0) + (hasAsup ? 250000 : 0) + (hasExpert ? 120000 : 0)
  const total = Math.round((base * areaCoeff * voltCoeff + extras) / 10000) * 10000
  const days = Math.round(30 + (area / 10000) * 15 + (hasRza ? 20 : 0) + (hasAsup ? 25 : 0))

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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Площадь объекта: <span className="text-slate-900 font-bold">{area.toLocaleString('ru')} м²</span>
              </p>
              <input
                type="range" min={500} max={50000} step={500}
                value={area}
                onChange={e => setArea(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>500 м²</span><span>50 000 м²</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Класс напряжения</p>
              <div className="grid grid-cols-4 gap-2">
                {[{ v: '04', l: '0,4 кВ' }, { v: '10', l: '10 кВ' }, { v: '35', l: '35 кВ' }, { v: '110', l: '110 кВ' }].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setVoltage(v)}
                    className={`py-3 text-sm font-mono border transition-colors ${
                      voltage === v
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Дополнительно</p>
              <div className="space-y-2">
                {[
                  { label: 'РЗА и автоматика', val: hasRza, set: setHasRza, price: '+180 000 ₽' },
                  { label: 'АСУ ТП', val: hasAsup, set: setHasAsup, price: '+250 000 ₽' },
                  { label: 'Экспертиза и согласование', val: hasExpert, set: setHasExpert, price: '+120 000 ₽' },
                ].map(({ label, val, set, price }) => (
                  <label key={label} className="flex items-center justify-between p-3 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => set(!val)}
                        className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors ${
                          val ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                        }`}
                      >
                        {val && <Icon name="Check" size={11} className="text-white" />}
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
            <div className="bg-slate-900 p-6 sticky top-20">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">Итоговая стоимость</p>
              <p className="text-3xl font-bold text-white leading-tight">
                {(total * 0.85 / 1000000).toFixed(1)} – {(total / 1000000).toFixed(1)} млн ₽
              </p>
              <div className="mt-6 border-t border-slate-700 pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Срок разработки</span>
                  <span className="text-white font-mono">{days} раб. дней</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Состав</span>
                  <span className="text-white text-xs">ПД + РД</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Нормативы</span>
                  <span className="text-white text-xs">ПУЭ, ГОСТ, СП</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-5 leading-relaxed">Расчёт ориентировочный. Точная стоимость — после изучения ТЗ.</p>
              <Button className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Получить точный расчёт
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-emerald-600 text-sm font-mono tracking-widest uppercase mb-2">О компании</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Проектируем с 2009 года</h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              Специализируемся на проектировании систем электроснабжения, релейной защиты и автоматики для промышленных предприятий нефтегазовой, металлургической, химической и пищевой отраслей.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              В штате 35 инженеров с опытом работы от 7 лет. Все специалисты имеют допуски СРО и профессиональные аттестации. Работаем по всей России.
            </p>
            <div className="space-y-3">
              {[
                'Допуск СРО к проектированию объектов I и II уровня',
                'Лицензия Минэнерго на проектирование объектов электроэнергетики',
                'ISO 9001:2015 — система менеджмента качества',
                'Партнёр ABB, Siemens, Schneider Electric, ЭКРА',
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
              { q: 'Работаете ли вы в регионах?', a: 'Да, работаем по всей России. Выезд специалистов на объект входит в стоимость.' },
              { q: 'Сколько занимает проектирование?', a: 'От 30 рабочих дней для небольших объектов до 6 месяцев для крупных промышленных комплексов.' },
              { q: 'Помогаете ли с экспертизой?', a: 'Да, сопровождаем проект на всех этапах: от ТУ до положительного заключения экспертизы.' },
              { q: 'Какой минимальный заказ?', a: 'Принимаем проекты любого масштаба — от ТП 0,4 кВ до ГПП 110 кВ.' },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white border border-slate-200 group">
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
  const MAX_FILES = 10

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
    <section id="contacts" className="bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-emerald-400 text-sm font-mono tracking-widest uppercase mb-2">Контакты</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Обсудим ваш объект</h2>
            <p className="text-slate-400 leading-relaxed mb-10">Отправьте заявку — инженер свяжется с вами в течение одного рабочего дня.</p>
            <div className="space-y-5">
              {[
                { icon: 'Phone', label: 'Телефон', val: '+7 978 220-33-80' },
                { icon: 'Mail', label: 'Email', val: 'elco72@mail.ru' },
                { icon: 'MapPin', label: 'Адрес', val: 'Москва, ул. Промышленная, 12, офис 301' },
                { icon: 'Clock', label: 'График', val: 'Пн–Пт, 9:00–18:00 (МСК)' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={icon} size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-white text-sm">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
                <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500 flex items-center justify-center">
                  <Icon name="CheckCheck" size={24} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-lg">Заявка отправлена!</p>
                <p className="text-slate-400 text-sm text-center">Инженер свяжется с вами в течение одного рабочего дня.</p>
                <button onClick={() => setStatus('idle')} className="text-emerald-400 text-sm hover:underline mt-2">Отправить ещё одну заявку</button>
              </div>
            ) : (
              <>
                <p className="text-white font-semibold mb-6">Оставить заявку</p>
                <div className="space-y-3">
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ваше имя *"
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <input
                    value={contact} onChange={e => setContact(e.target.value)}
                    placeholder="Телефон или Email *"
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <input
                    value={objectName} onChange={e => setObjectName(e.target.value)}
                    placeholder="Название объекта"
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <textarea
                    value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Краткое описание задачи"
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                  <div>
                    <label
                      htmlFor="file-upload"
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-5 cursor-pointer transition-colors ${
                        files.length >= MAX_FILES ? 'border-slate-700 opacity-50 cursor-not-allowed' : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      <Icon name="Paperclip" size={18} className="text-slate-400" />
                      <span className="text-slate-400 text-xs text-center">
                        {files.length >= MAX_FILES
                          ? 'Максимум 10 файлов добавлено'
                          : <>{`Прикрепить файлы (${files.length}/${MAX_FILES})`}<br />ТЗ, схемы, чертежи — любые форматы</>
                        }
                      </span>
                      <input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        disabled={files.length >= MAX_FILES}
                        onChange={e => handleFiles(e.target.files)}
                      />
                    </label>
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-700 px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon name="File" size={13} className="text-emerald-400 shrink-0" />
                              <span className="text-slate-300 text-xs truncate">{f.name}</span>
                              <span className="text-slate-500 text-xs shrink-0">{(f.size / 1024).toFixed(0)} КБ</span>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-400 transition-colors ml-2 shrink-0">
                              <Icon name="X" size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {status === 'error' && (
                    <p className="text-red-400 text-xs text-center">Ошибка отправки. Попробуйте ещё раз или напишите на elco72@mail.ru</p>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={status === 'loading' || !name || !contact}
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
    <footer className="bg-slate-950 border-t border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-600 flex items-center justify-center">
            <Icon name="Zap" size={12} className="text-white" />
          </div>
          <span className="text-slate-400 text-sm">ЭТМПРО © 2024</span>
        </div>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{l.label}</a>
          ))}
        </div>
        <p className="text-slate-600 text-xs">ИНН 7712345678 · ОГРН 1097746000000</p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Calculator />
      <About />
      <Contacts />
      <Footer />
    </div>
  )
}
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"
import type { SectionProps } from "@/types"


function ServicesGrid({ services }: { services: NonNullable<SectionProps['services']> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-5xl">
      {services.map((s) => (
        <div key={s.title} className="border border-[#00AAFF]/20 bg-[#00AAFF]/5 p-5 hover:border-[#00AAFF]/60 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <Icon name={s.icon} size={20} className="text-[#00AAFF]" fallback="Zap" />
            <span className="text-white font-mono text-sm font-semibold">{s.title}</span>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  )
}

function ProjectsGrid({ projects }: { projects: NonNullable<SectionProps['projects']> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-4xl">
      {projects.map((p) => (
        <div key={p.title} className="border border-neutral-700 bg-neutral-900/60 p-6 hover:border-[#00AAFF]/50 transition-colors group">
          <div className="flex items-start justify-between mb-3">
            <span className="text-white font-semibold">{p.title}</span>
            <span className="text-[#00AAFF] font-mono text-xs border border-[#00AAFF]/40 px-2 py-0.5 ml-3 whitespace-nowrap">{p.meta}</span>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  )
}

const OBJECT_TYPES = [
  { id: 'industrial', label: 'Промышленный завод', base: 800000 },
  { id: 'energy', label: 'Энергообъект / ПС', base: 600000 },
  { id: 'chemical', label: 'Химическое производство', base: 1000000 },
  { id: 'food', label: 'Пищевое производство', base: 500000 },
  { id: 'warehouse', label: 'Склад / Логистика', base: 250000 },
]
const VOLTAGE_MULT: Record<string, number> = { '04': 1, '10': 1.4, '35': 1.8, '110': 2.5 }

function Calculator() {
  const [objType, setObjType] = useState(OBJECT_TYPES[0].id)
  const [area, setArea] = useState([5000])
  const [voltage, setVoltage] = useState('10')
  const [hasRza, setHasRza] = useState(false)
  const [hasAsup, setHasAsup] = useState(false)
  const [hasExpert, setHasExpert] = useState(false)

  const base = OBJECT_TYPES.find(o => o.id === objType)?.base ?? 800000
  const areaCoeff = 0.8 + (area[0] / 50000) * 1.2
  const voltCoeff = VOLTAGE_MULT[voltage] ?? 1
  const extras = (hasRza ? 180000 : 0) + (hasAsup ? 250000 : 0) + (hasExpert ? 120000 : 0)
  const total = Math.round((base * areaCoeff * voltCoeff + extras) / 10000) * 10000
  const days = Math.round(30 + (area[0] / 10000) * 15 + (hasRza ? 20 : 0) + (hasAsup ? 25 : 0))

  return (
    <div className="mt-6 max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-5">
        <div>
          <p className="text-neutral-400 font-mono text-xs mb-2 tracking-widest uppercase">Тип объекта</p>
          <div className="space-y-1.5">
            {OBJECT_TYPES.map(o => (
              <button
                key={o.id}
                onClick={() => setObjType(o.id)}
                className={`w-full text-left px-4 py-2.5 text-sm border transition-colors font-mono ${
                  objType === o.id
                    ? 'border-[#00AAFF] bg-[#00AAFF]/10 text-[#00AAFF]'
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-neutral-400 font-mono text-xs mb-2 tracking-widest uppercase">Площадь объекта</p>
          <div className="flex items-center gap-4">
            <Slider
              min={500} max={50000} step={500}
              value={area}
              onValueChange={setArea}
              className="flex-1"
            />
            <span className="text-white font-mono text-sm w-24 text-right">{area[0].toLocaleString('ru')} м²</span>
          </div>
        </div>

        <div>
          <p className="text-neutral-400 font-mono text-xs mb-2 tracking-widest uppercase">Класс напряжения</p>
          <div className="grid grid-cols-4 gap-1.5">
            {[{ v: '04', l: '0,4 кВ' }, { v: '10', l: '10 кВ' }, { v: '35', l: '35 кВ' }, { v: '110', l: '110 кВ' }].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setVoltage(v)}
                className={`py-2 text-xs font-mono border transition-colors ${
                  voltage === v
                    ? 'border-[#00AAFF] bg-[#00AAFF]/10 text-[#00AAFF]'
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-neutral-400 font-mono text-xs mb-2 tracking-widest uppercase">Дополнительно</p>
          <div className="space-y-2">
            {[
              { key: 'rza', label: 'РЗА и автоматика', val: hasRza, set: setHasRza },
              { key: 'asup', label: 'АСУ ТП', val: hasAsup, set: setHasAsup },
              { key: 'expert', label: 'Экспертиза и согласование', val: hasExpert, set: setHasExpert },
            ].map(({ key, label, val, set }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => set(!val)}
                  className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                    val ? 'border-[#00AAFF] bg-[#00AAFF]/20' : 'border-neutral-600'
                  }`}
                >
                  {val && <Icon name="Check" size={12} className="text-[#00AAFF]" />}
                </div>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-[#00AAFF]/30 bg-[#00AAFF]/5 p-6 flex flex-col justify-between">
        <div>
          <p className="text-neutral-400 font-mono text-xs tracking-widest uppercase mb-1">Предварительная стоимость</p>
          <p className="text-3xl font-bold text-white mt-2">
            от {(total * 0.85).toLocaleString('ru')} ₽
          </p>
          <p className="text-neutral-500 text-sm mt-1">до {total.toLocaleString('ru')} ₽</p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={16} className="text-[#00AAFF]" />
              <span className="text-neutral-300 text-sm">Срок разработки: <span className="text-white font-mono">{days} рабочих дней</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="FileCheck" size={16} className="text-[#00AAFF]" />
              <span className="text-neutral-300 text-sm">Рабочая документация + ПД</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="ShieldCheck" size={16} className="text-[#00AAFF]" />
              <span className="text-neutral-300 text-sm">Соответствие ПУЭ, ГОСТ, СП</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-neutral-500 text-xs mb-4 leading-relaxed">Расчёт ориентировочный. Точная стоимость определяется после изучения технического задания.</p>
          <Button
            size="lg"
            className="w-full bg-[#00AAFF] text-black hover:bg-[#0099ee] font-semibold font-mono"
          >
            Получить точный расчёт
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Section({ id, title, subtitle, content, isActive, showButton, buttonText, tag, services, projects, calculator }: SectionProps) {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: isActive ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay },
  })

  return (
    <section id={id} className="relative h-screen w-full snap-start flex flex-col justify-center px-8 md:px-16 lg:px-24 overflow-hidden">
      {tag && (
        <motion.p {...fadeUp(0)} className="font-mono text-xs text-[#00AAFF] tracking-[0.25em] uppercase mb-4">
          — {tag}
        </motion.p>
      )}
      {subtitle && (
        <motion.div {...fadeUp(0)} className="mb-6">
          {subtitle}
        </motion.div>
      )}
      <motion.h2
        {...fadeUp(0.05)}
        className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white"
      >
        {title}
      </motion.h2>
      {content && (
        <motion.p {...fadeUp(0.15)} className="text-lg md:text-xl max-w-2xl mt-5 text-neutral-400 leading-relaxed">
          {content}
        </motion.p>
      )}
      {services && (
        <motion.div {...fadeUp(0.2)}>
          <ServicesGrid services={services} />
        </motion.div>
      )}
      {projects && (
        <motion.div {...fadeUp(0.2)}>
          <ProjectsGrid projects={projects} />
        </motion.div>
      )}
      {calculator && (
        <motion.div {...fadeUp(0.2)}>
          <Calculator />
        </motion.div>
      )}
      {showButton && (
        <motion.div {...fadeUp(0.3)} className="mt-10">
          <Button
            variant="outline"
            size="lg"
            className="text-[#00AAFF] bg-transparent border-[#00AAFF] hover:bg-[#00AAFF] hover:text-black transition-colors font-mono tracking-wide"
          >
            {buttonText}
          </Button>
        </motion.div>
      )}
    </section>
  )
}
import { useMemo, useState } from 'react'
import './App.css'

type Lane = { id: string; from: string; to: string; time: string; mode: string; status: string; color: string }
const lanes: Lane[] = [
  { id: 'FT-2048', from: 'Москва', to: 'Казань', time: 'Сегодня · 14:20', mode: 'Авто · тент', status: 'В пути', color: 'lime' },
  { id: 'FT-2039', from: 'Минск', to: 'Санкт-Петербург', time: 'Сегодня · 09:45', mode: 'Авто · рефрижератор', status: 'На границе', color: 'blue' },
  { id: 'FT-1981', from: 'Алматы', to: 'Новосибирск', time: 'Вчера · 18:10', mode: 'Авто · сборный груз', status: 'Доставлен', color: 'muted' },
]
const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Минск', 'Алматы', 'Новосибирск']

function App() {
  const [tracking, setTracking] = useState('')
  const [found, setFound] = useState<Lane | null>(null)
  const [from, setFrom] = useState('Москва')
  const [to, setTo] = useState('Казань')
  const [weight, setWeight] = useState('3')
  const [quote, setQuote] = useState(false)
  const [menu, setMenu] = useState(false)
  const routeLabel = `${from} — ${to}`
  const estimate = useMemo(() => {
    const distances: Record<string, number> = { 'Москва — Казань': 820, 'Москва — Санкт-Петербург': 720, 'Минск — Санкт-Петербург': 790, 'Алматы — Новосибирск': 1350 }
    const km = distances[routeLabel] ?? 980
    const tonnes = Math.max(Number(weight) || 1, 0.5)
    const base = km * tonnes * 13
    const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
    const lower = Math.round(base * .92 / 1000) * 1000
    const upper = Math.round(base * 1.16 / 1000) * 1000
    return `${formatter.format(lower)}–${formatter.format(upper)} ₽`
  }, [routeLabel, weight])

  function lookup(event: React.FormEvent) {
    event.preventDefault()
    const result = lanes.find((lane) => lane.id.toLowerCase() === tracking.trim().toLowerCase())
    setFound(result ?? null)
  }

  function requestQuote(event: React.FormEvent) {
    event.preventDefault()
    setQuote(true)
  }

  return <>
    <div className="demo-strip"><span className="pulse" />ДЕМОНСТРАЦИОННЫЙ САЙТ <span>·</span> интерфейс и маршруты — пример</div>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Контур — на главную"><span className="brand-mark">К</span><span>КОНТУР<small>ТРАНЗИТ</small></span></a>
      <nav className={menu ? 'nav open' : 'nav'} aria-label="Основная навигация"><a href="#services">Решения</a><a href="#routes">Направления</a><a href="#tracking">Отслеживание</a><a href="#company">Компания</a></nav>
      <a className="top-cta" href="#request">Обсудить перевозку <span>↗</span></a>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label="Открыть меню">{menu ? '×' : '☰'}</button>
    </header>
    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="line"/>ЛОГИСТИКА БЕЗ ЛИШНИХ ПЕРЕХОДОВ</div>
          <h1>Груз в пути.<br/><em>Вы — в курсе.</em></h1>
          <p className="hero-lede">Берём на себя маршрут, документы и связь с перевозчиком — чтобы поставки двигались по плану.</p>
          <div className="hero-actions"><a className="button primary" href="#request">Рассчитать перевозку <span>↗</span></a><a className="text-link" href="#tracking">Отследить груз <span>↓</span></a></div>
          <div className="hero-foot"><span>01 / 04</span><div className="progress"><i/></div><span>РОССИЯ · СНГ</span></div>
        </div>
        <div className="hero-visual" aria-label="Схема маршрута между городами">
          <div className="visual-top"><span>СИСТЕМА МАРШРУТОВ</span><span className="live"><i/> В СЕТИ</span></div>
          <svg className="route-map" viewBox="0 0 620 450" role="img" aria-label="Маршрут Москва — Казань">
            <defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1"/></pattern><linearGradient id="route" x1="0" x2="1"><stop stopColor="#c8f078"/><stop offset="1" stopColor="#5da7d8"/></linearGradient></defs>
            <rect width="620" height="450" fill="url(#grid)"/>
            <path className="land" d="M70 55 165 80 190 45 280 72 340 55 390 95 480 75 540 115 515 185 560 215 500 280 455 260 412 335 330 315 292 370 215 350 168 290 112 300 90 230 45 205Z"/>
            <path className="route-halo" d="M178 192 C252 122 295 230 407 217"/><path className="route-line" d="M178 192 C252 122 295 230 407 217"/>
            <circle cx="178" cy="192" r="10" className="pin start"/><circle cx="407" cy="217" r="10" className="pin end"/>
            <circle cx="282" cy="170" r="4" className="waypoint"/><circle cx="338" cy="211" r="4" className="waypoint"/>
            <text x="143" y="166">МОСКВА</text><text x="420" y="220">КАЗАНЬ</text>
            <g className="truck" transform="translate(280 169)"><rect x="-14" y="-7" width="24" height="14" rx="3"/><path d="M10 -3h9l6 7v3H10z"/><circle cx="-6" cy="9" r="3"/><circle cx="18" cy="9" r="3"/></g>
            <text x="230" y="91" className="map-note">04:26 В ПУТИ</text><text x="340" y="290" className="map-note">М7 · 820 КМ</text>
            <circle cx="90" cy="352" r="24" className="radar"/><circle cx="90" cy="352" r="3" className="radar-dot"/>
          </svg>
          <div className="route-card"><div className="route-card-icon">↗</div><div><small>АКТИВНЫЙ МАРШРУТ</small><strong>Москва <span>→</span> Казань</strong></div><div className="route-card-meta"><b>М7</b><small>820 км</small></div></div>
          <div className="visual-caption">Схема иллюстративная · без геоданных</div>
        </div>
      </section>
      <section className="ticker" aria-label="Сервисы"><div>АВТОПЕРЕВОЗКИ <span>✳</span> СБОРНЫЕ ГРУЗЫ <span>✳</span> МУЛЬТИМОДАЛЬНОСТЬ <span>✳</span> ТАМОЖЕННОЕ СОПРОВОЖДЕНИЕ <span>✳</span> АВТОПЕРЕВОЗКИ <span>✳</span> СБОРНЫЕ ГРУЗЫ <span>✳</span></div></section>
      <section id="services" className="services section-wrap"><div className="section-heading"><div><div className="eyebrow"><span className="line"/>ЧТО МЫ ДЕЛАЕМ</div><h2>Движение груза<br/>на каждом этапе.</h2></div><p>Подбираем подходящий маршрут под тип товара, сроки и географию поставки.</p></div>
        <div className="service-grid"><article className="service-card"><span className="service-index">01 / 04</span><div className="service-icon">⇢</div><h3>Автоперевозки</h3><p>Выделенный транспорт для партий любого объёма по России и странам СНГ.</p><a href="#request" aria-label="Узнать об автоперевозках">↗</a></article><article className="service-card"><span className="service-index">02 / 04</span><div className="service-icon">◫</div><h3>Сборные грузы</h3><p>Консолидация небольших отправлений в одном направлении.</p><a href="#request" aria-label="Узнать о сборных грузах">↗</a></article><article className="service-card"><span className="service-index">03 / 04</span><div className="service-icon">⌁</div><h3>Мультимодальные</h3><p>Комбинируем авто, железную дорогу и авиа для сложных маршрутов.</p><a href="#request" aria-label="Узнать о мультимодальных перевозках">↗</a></article><article className="service-card"><span className="service-index">04 / 04</span><div className="service-icon">▤</div><h3>Сопровождение</h3><p>Помогаем подготовить комплект документов и пройти контроль.</p><a href="#request" aria-label="Узнать о сопровождении">↗</a></article></div>
      </section>
      <section id="routes" className="routes-band"><div className="section-wrap routes-inner"><div><div className="eyebrow"><span className="line"/>ГЕОГРАФИЯ РАБОТЫ</div><h2>Один маршрут.<br/><em>Много вариантов.</em></h2><p>Планируем доставку с учётом границ, сезонности и особенностей груза.</p></div><div className="route-list"><div><span>01</span><b>Россия</b><small>Все федеральные округа</small><i>↗</i></div><div><span>02</span><b>Беларусь</b><small>Регулярные направления</small><i>↗</i></div><div><span>03</span><b>Казахстан</b><small>Авто и сборные грузы</small><i>↗</i></div><div><span>04</span><b>Другие страны СНГ</b><small>Маршрут под задачу</small><i>↗</i></div></div></div></section>
      <section className="tools-section section-wrap"><div id="tracking" className="tracking-panel"><div className="eyebrow"><span className="line"/>КОНТРОЛЬ ПОСТАВКИ</div><h2>Где мой груз?</h2><p>Введите номер заявки, чтобы посмотреть пример статуса в демо-режиме.</p><form onSubmit={lookup} className="tracking-form"><label className="sr-only" htmlFor="tracking-id">Номер заявки</label><input id="tracking-id" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="Например, FT-2048" required/><button className="button dark">Проверить <span>→</span></button></form>{found && <div className="tracking-result"><span className={`status-dot ${found.color}`}/><div><strong>{found.id} · {found.status}</strong><small>{found.from} → {found.to} · {found.mode}</small></div><time>{found.time}</time></div>}{tracking && !found && tracking.length > 3 && <p className="hint">Демо-заявки: FT-2048, FT-2039, FT-1981</p>}<div className="demo-note">Статусы приведены для демонстрации и не связаны с реальными перевозками.</div></div>
        <div id="request" className="quote-panel"><div className="quote-kicker">КАЛЬКУЛЯТОР · DEMO</div><h2>Оценим маршрут.</h2><p>Ориентировочный диапазон стоимости. Точная ставка зависит от параметров заявки.</p><form onSubmit={requestQuote}><label>Откуда<select value={from} onChange={e=>{setFrom(e.target.value);setQuote(false)}}>{cities.map(city=><option key={city}>{city}</option>)}</select></label><label>Куда<select value={to} onChange={e=>{setTo(e.target.value);setQuote(false)}}>{cities.filter(city=>city!==from).map(city=><option key={city}>{city}</option>)}</select></label><label className="weight-field">Вес груза, т<input type="number" min="0.5" max="20" step="0.5" value={weight} onChange={e=>{setWeight(e.target.value);setQuote(false)}}/></label><button className="button primary">Узнать диапазон <span>↗</span></button></form>{quote && <div className="quote-result"><span>ОЦЕНОЧНЫЙ ДИАПАЗОН</span><strong>{estimate}</strong><small>Расчёт учебный. Для реальной ставки нужна заявка.</small></div>}</div></section>
      <section id="company" className="company section-wrap"><div className="company-label">КОНТУР / О ПОДХОДЕ</div><p>Хорошая логистика — это <em>понятная связь</em> между точками и людьми.</p><div className="company-bottom"><span>Решаем задачи перевозки от первого расчёта до передачи документов.</span><a className="text-link" href="#request">Обсудить задачу <span>↗</span></a></div></section>
    </main>
    <footer className="footer"><div className="footer-main section-wrap"><a className="brand" href="#top"><span className="brand-mark">К</span><span>КОНТУР<small>ТРАНЗИТ</small></span></a><span className="footer-note">Демонстрационный сайт логистической компании<br/>Все данные и сценарии являются примерами.</span><a href="#top" className="to-top">НАВЕРХ ↑</a></div><div className="footer-bottom section-wrap"><span>© КОНТУР ТРАНЗИТ · ДЕМО-ПРОЕКТ</span><span>РОССИЯ · СНГ</span></div></footer>
  </>
}
export default App

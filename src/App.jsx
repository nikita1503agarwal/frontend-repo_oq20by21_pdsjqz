import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

function useI18n() {
  const [lang, setLang] = useState('en')
  const t = useMemo(() => {
    const dict = {
      en: {
        title: 'Maatram KK360',
        subtitle: 'Bilingual AI-powered education platform under Karpom Karipipom',
        cta: 'Explore Platform',
        switchTa: 'தமிழ்',
        switchEn: 'English',
        features: 'Key Features',
        automatedAttendance: 'Automated Attendance (QR/Face ID)',
        subjectBased: 'Subject-based classes for Grades 11 & 12',
        directConnect: 'Direct Tutor–Student connection via Student ID',
        vacancies: 'Tutor Vacancies & Recruitment',
        gamified: 'Gamified Learning with points, badges, leaderboards',
        insights: 'Tutor insights & analytics',
        aiScheduler: 'AI-powered class scheduler',
        liveDoubts: 'Live doubt sessions (YouTube Live / WebRTC)',
        bilingual: 'Bilingual Interface (Tamil + English)',
        roles: 'Role-based access: Admin, Tutor, Student',
        quickDemos: 'Quick Demos',
        backendTest: 'Backend & Database Test',
        openTest: 'Open test page',
        aiDemoTitle: 'AI Scheduler Demo',
        runScheduler: 'Generate schedule',
        vacancyTitle: 'Vacancy Board',
        loadVacancies: 'Load vacancies',
        postVacancy: 'Post vacancy',
        connectTutor: 'Connect Tutor & Student',
        connect: 'Connect',
        markAttendance: 'Mark Attendance',
        mark: 'Mark',
        createLive: 'Create Live Session',
        create: 'Create',
      },
      ta: {
        title: 'மாற்றம் KK360',
        subtitle: 'கற்போம் கருகிப்போம் முயற்சியின் கீழ் இருமொழி AI கல்வி தளம்',
        cta: 'தளத்தை பார்க்க',
        switchTa: 'தமிழ்',
        switchEn: 'English',
        features: 'முக்கிய அம்சங்கள்',
        automatedAttendance: 'தானியங்கு வருகைப் பதிவு (QR/முகம்)',
        subjectBased: '11/12 ஆம் வகுப்பு பாடவாரியான வகுப்புகள்',
        directConnect: 'மாணவர் அடையாளம் மூலம் நேரடி ஆசிரியர் இணைப்பு',
        vacancies: 'ஆசிரியர் காலியிடங்கள் & ஆட்கள் சேர்த்தல்',
        gamified: 'விளையாட்டூக்கமூட்டும் கற்றல் (புள்ளிகள், பதக்கங்கள்)',
        insights: 'ஆசிரியர் தகவல் & பகுப்பாய்வு',
        aiScheduler: 'AI வகுப்பு அட்டவணை',
        liveDoubts: 'நேரலை சந்தேக தீர்வு (YouTube Live / WebRTC)',
        bilingual: 'இருமொழி இடைமுகம் (தமிழ் + ஆங்கிலம்)',
        roles: 'கடமைகளின் அடிப்படையிலான அணுகல்: நிர்வாகி, ஆசிரியர், மாணவர்',
        quickDemos: 'விரைவு டெமோ',
        backendTest: 'பின்புற & தரவுத்தளம் சோதனை',
        openTest: 'சோதனை பக்கத்தை திற',
        aiDemoTitle: 'AI அட்டவணை டெமோ',
        runScheduler: 'அட்டவணை உருவாக்கு',
        vacancyTitle: 'காலியிட பலகம்',
        loadVacancies: 'காலியிடங்களை ஏற்று',
        postVacancy: 'காலியிடம் பதிவேற்று',
        connectTutor: 'ஆசிரியர்–மாணவர் இணை',
        connect: 'இணை',
        markAttendance: 'வருகை பதிவு',
        mark: 'பதிவு',
        createLive: 'நேரலை அமர்வு உருவாக்கு',
        create: 'உருவாக்கு',
      },
    }
    return (key) => dict[lang][key] || key
  }, [lang])
  return { t, lang, setLang }
}

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/70 text-gray-800 text-sm shadow border border-white/50">
      {children}
    </span>
  )
}

function Section({ title, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="bg-white/60 backdrop-blur rounded-xl shadow p-4">{children}</div>
    </section>
  )
}

function App() {
  const { t, lang, setLang } = useI18n()
  const [schedule, setSchedule] = useState([])
  const [vacancies, setVacancies] = useState([])
  const [loadingVacancies, setLoadingVacancies] = useState(false)
  const [posting, setPosting] = useState(false)
  const [connectRes, setConnectRes] = useState(null)
  const [attendanceRes, setAttendanceRes] = useState(null)
  const [liveRes, setLiveRes] = useState(null)

  const runScheduler = async () => {
    const payload = {
      tutor_availability: ['Mon-10:00', 'Tue-15:00', 'Wed-11:00'],
      student_preferences: ['Mon-10:00', 'Wed-11:00'],
      subjects: ['Maths', 'Physics', 'Chemistry'],
    }
    const res = await fetch(`${baseUrl}/api/ai-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setSchedule(data.schedule || [])
  }

  const loadVacancies = async () => {
    setLoadingVacancies(true)
    try {
      const res = await fetch(`${baseUrl}/api/vacancies`)
      const data = await res.json()
      setVacancies(data.items || [])
    } finally {
      setLoadingVacancies(false)
    }
  }

  const postVacancy = async () => {
    setPosting(true)
    try {
      const res = await fetch(`${baseUrl}/api/vacancies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution_id: 'kk-institute-01', subject: 'Mathematics', grade: 12, description: 'Evening batch' }),
      })
      await res.json()
      await loadVacancies()
    } finally {
      setPosting(false)
    }
  }

  const connectTutor = async () => {
    const res = await fetch(`${baseUrl}/api/connect-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: 'stu-001', tutor_id: 'tut-001' }),
    })
    const data = await res.json()
    setConnectRes(data)
  }

  const markAttendance = async () => {
    const res = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: 'class-001', student_id: 'stu-001', method: 'qr', status: 'present', token: 'QR123' }),
    })
    const data = await res.json()
    setAttendanceRes(data)
  }

  const createLive = async () => {
    const res = await fetch(`${baseUrl}/api/live-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: 'class-001', tutor_id: 'tut-001', topic: 'Doubt Clearing', platform: 'yt' }),
    })
    const data = await res.json()
    setLiveRes(data)
  }

  useEffect(() => {
    loadVacancies()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 text-gray-800">
      {/* Navbar */}
      <header className="flex items-center justify-between max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-indigo-600"></div>
          <span className="font-bold text-lg">{t('title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang('ta')} className={`px-3 py-1 rounded ${lang==='ta'?'bg-indigo-600 text-white':'bg-white text-gray-800 border'}`}>{t('switchTa')}</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded ${lang==='en'?'bg-indigo-600 text-white':'bg-white text-gray-800 border'}`}>{t('switchEn')}</button>
          <a href="/test" className="ml-2 px-3 py-1 rounded bg-white border hover:bg-gray-50">{t('backendTest')}</a>
        </div>
      </header>

      {/* Hero with Spline */}
      <section className="relative w-full" style={{ height: '60vh' }}>
        <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-white/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6">
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 shadow-lg w-fit">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">{t('title')}</h1>
              <p className="text-base md:text-lg text-gray-700 mb-4 max-w-2xl">{t('subtitle')}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{t('aiScheduler')}</Badge>
                <Badge>{t('automatedAttendance')}</Badge>
                <Badge>{t('gamified')}</Badge>
                <Badge>{t('liveDoubts')}</Badge>
              </div>
              <a href="#demos" className="pointer-events-auto inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md transition">{t('cta')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section title={t('features')}>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[t('automatedAttendance'), t('subjectBased'), t('directConnect'), t('vacancies'), t('gamified'), t('insights'), t('aiScheduler'), t('liveDoubts'), t('bilingual'), t('roles')].map((f, idx) => (
            <li key={idx} className="p-4 rounded-lg border bg-white/70">
              <div className="font-semibold">{f}</div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Quick Demos */}
      <div id="demos" />
      <Section title={t('quickDemos')}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Scheduler */}
          <div className="space-y-2">
            <div className="font-semibold">{t('aiDemoTitle')}</div>
            <button onClick={runScheduler} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{t('runScheduler')}</button>
            <ul className="text-sm list-disc pl-5">
              {schedule.map((s, i) => (
                <li key={i}>{s.slot} — {s.subject}</li>
              ))}
              {schedule.length === 0 && <li className="list-none text-gray-500">No schedule yet</li>}
            </ul>
          </div>

          {/* Vacancy Board */}
          <div className="space-y-2">
            <div className="font-semibold">{t('vacancyTitle')}</div>
            <div className="flex gap-2">
              <button onClick={loadVacancies} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">{t('loadVacancies')}</button>
              <button onClick={postVacancy} disabled={posting} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50">{t('postVacancy')}</button>
            </div>
            <ul className="text-sm divide-y">
              {loadingVacancies && <li className="py-2 text-gray-500">Loading...</li>}
              {vacancies.map((v) => (
                <li key={v._id} className="py-2">
                  <div className="font-medium">{v.subject} (Grade {v.grade})</div>
                  <div className="text-gray-600">{v.description}</div>
                </li>
              ))}
              {!loadingVacancies && vacancies.length === 0 && <li className="py-2 text-gray-500">No vacancies</li>}
            </ul>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Connect Tutor */}
          <div className="space-y-2">
            <div className="font-semibold">{t('connectTutor')}</div>
            <button onClick={connectTutor} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">{t('connect')}</button>
            {connectRes && <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(connectRes, null, 2)}</pre>}
          </div>

          {/* Attendance */}
          <div className="space-y-2">
            <div className="font-semibold">{t('markAttendance')}</div>
            <button onClick={markAttendance} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">{t('mark')}</button>
            {attendanceRes && <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(attendanceRes, null, 2)}</pre>}
          </div>

          {/* Live Session */}
          <div className="space-y-2">
            <div className="font-semibold">{t('createLive')}</div>
            <button onClick={createLive} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">{t('create')}</button>
            {liveRes && (
              <div className="text-sm">
                <div className="truncate">URL: <a className="text-indigo-600 underline" href={liveRes.live_url} target="_blank" rel="noreferrer">{liveRes.live_url}</a></div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <footer className="text-center text-sm text-gray-600 py-8">© {new Date().getFullYear()} Karpom Karipipom • Maatram KK360</footer>
    </div>
  )
}

export default App

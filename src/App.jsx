import { useEffect, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [q, setQ] = useState('')
  const [search, setSearch] = useState([])
  const [schoolName, setSchoolName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [status, setStatus] = useState('')

  const doPhoton = async () => {
    if (!q) return
    setStatus('Searching...')
    const r = await fetch(`${backend}/photon/search?q=${encodeURIComponent(q)}`)
    const data = await r.json()
    setSearch(data.results || [])
    setStatus('')
  }

  const createAdmin = async (e) => {
    e.preventDefault()
    setStatus('Verifying school via Photon and creating admin...')
    try {
      const r = await fetch(`${backend}/admin/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_name: schoolName, admin_email: adminEmail })
      })
      const data = await r.json()
      if (data.ok) {
        setStatus('✅ School verified and admin created! ID: ' + data.school_id)
      } else {
        setStatus('❌ ' + data.message)
      }
    } catch (e) {
      setStatus('❌ ' + e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">ERIKA – AI Classroom Platform</h1>
          <p className="text-gray-600 mt-2">Secure role-based onboarding with Photon verification</p>
        </header>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Verify a School (Photon)</h2>
          <div className="flex gap-2">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search school by name/address" className="flex-1 border rounded px-3 py-2" />
            <button onClick={doPhoton} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
          </div>
          {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
          <ul className="mt-4 grid md:grid-cols-2 gap-3">
            {search.map((s, idx)=> (
              <li key={idx} className="border rounded p-3">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600">{s.address} • {s.city} • {s.country}</div>
                <div className="text-xs text-gray-500">lat {s.lat}, lon {s.lon}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">New Admin Registration</h2>
          <form onSubmit={createAdmin} className="grid md:grid-cols-3 gap-3">
            <input value={schoolName} onChange={(e)=>setSchoolName(e.target.value)} placeholder="Verified school name" className="border rounded px-3 py-2" required />
            <input value={adminEmail} onChange={(e)=>setAdminEmail(e.target.value)} placeholder="Admin email" type="email" className="border rounded px-3 py-2" required />
            <button className="px-4 py-2 bg-green-600 text-white rounded">Create Admin</button>
          </form>
          {status && <p className="mt-3 text-sm">{status}</p>}
        </section>
      </div>
    </div>
  )
}

export default App

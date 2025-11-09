import { useEffect, useState } from 'react'
import api from '../../lib/api.js'

export default function Showtimes() {
  const [showtimes, setShowtimes] = useState([])
  const [movies, setMovies] = useState([])
  const [theatres, setTheatres] = useState([])
  const [form, setForm] = useState({ movie_id: '', theatre_id: '', start_time: '', price_inr: 200 })

  async function load() {
    try {
      const [st, mv, th] = await Promise.all([
        api.get('/showtimes'), api.get('/movies'), api.get('/theatres')
      ])
      setShowtimes(st.data); setMovies(mv.data); setTheatres(th.data)
    } catch (e) {
      console.error('Failed to load showtimes data:', e)
    }
  }
  useEffect(()=>{ load() }, [])

  async function save(e){ 
    e.preventDefault(); 
    try {
      await api.post('/showtimes', form); 
      setForm({ movie_id:'', theatre_id:'', start_time:'', price_inr:200 }); 
      load() 
    } catch (e) {
      console.error('Failed to save showtime:', e)
      alert('Failed to save showtime. Please try again.')
    }
  }
  async function del(id){ 
    try {
      await api.delete(`/showtimes/${id}`); 
      load() 
    } catch (e) {
      console.error('Failed to delete showtime:', e)
      alert('Failed to delete showtime. Please try again.')
    }
  }

  return (
    <div>
      <h5>Showtimes</h5>
      <form className="row g-2 mb-3" onSubmit={save}>
        <div className="col">
          <select className="form-select" value={form.movie_id} onChange={e=>setForm({...form,movie_id:Number(e.target.value)})} required>
            <option value="">Movie</option>
            {movies.map(m=> <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <div className="col">
          <select className="form-select" value={form.theatre_id} onChange={e=>setForm({...form,theatre_id:Number(e.target.value)})} required>
            <option value="">Theatre</option>
            {theatres.map(t=> <option key={t.id} value={t.id}>{t.name} — {t.city}</option>)}
          </select>
        </div>
        <div className="col"><input className="form-control" type="datetime-local" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} required /></div>
        <div className="col"><input className="form-control" type="number" value={form.price_inr} onChange={e=>setForm({...form,price_inr:Number(e.target.value)})} /></div>
        <div className="col-auto"><button className="btn btn-primary">Add</button></div>
      </form>
      <ul className="list-group">
        {showtimes.map(s => (
          <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{s.movie_title} — {s.theatre_name} ({s.theatre_city}) — {new Date(s.start_time).toLocaleString()} — ₹{s.price_inr}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={()=>del(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}



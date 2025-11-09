import { useEffect, useState } from 'react'
import api from '../../lib/api.js'

export default function Theatres() {
  const [theatres, setTheatres] = useState([])
  const [form, setForm] = useState({ name: '', city: '' })
  async function load() { 
    try {
      const { data } = await api.get('/theatres'); 
      setTheatres(data) 
    } catch (e) {
      console.error('Failed to load theatres:', e)
    }
  }
  useEffect(()=>{ load() }, [])

  async function save(e){ 
    e.preventDefault(); 
    try {
      await api.post('/theatres', form); 
      setForm({name:'',city:''}); 
      load() 
    } catch (e) {
      console.error('Failed to save theatre:', e)
      alert('Failed to save theatre. Please try again.')
    }
  }
  async function del(id){ 
    try {
      await api.delete(`/theatres/${id}`); 
      load() 
    } catch (e) {
      console.error('Failed to delete theatre:', e)
      alert('Failed to delete theatre. Please try again.')
    }
  }

  return (
    <div>
      <h5>Theatres</h5>
      <form className="row g-2 mb-3" onSubmit={save}>
        <div className="col"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
        <div className="col"><input className="form-control" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} required /></div>
        <div className="col-auto"><button className="btn btn-primary">Add</button></div>
      </form>
      <ul className="list-group">
        {theatres.map(t => (
          <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{t.name} — {t.city}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={()=>del(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}



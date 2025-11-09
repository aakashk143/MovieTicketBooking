import { useEffect, useState } from 'react'
import api from '../../lib/api.js'

export default function Seats() {
  const [theatres, setTheatres] = useState([])
  const [form, setForm] = useState({ theatre_id: '', row_label: 'A', seat_number: 1 })
  useEffect(()=>{ 
    (async()=>{ 
      try {
        const {data}=await api.get('/theatres'); 
        setTheatres(data) 
      } catch (e) {
        console.error('Failed to load theatres:', e)
      }
    })() 
  }, [])

  async function save(e){ 
    e.preventDefault(); 
    try {
      await api.post('/seats/admin', { ...form, theatre_id: Number(form.theatre_id) }); 
      alert('Seat added')
      setForm({ theatre_id: '', row_label: 'A', seat_number: 1 })
    } catch (e) {
      console.error('Failed to save seat:', e)
      alert('Failed to add seat. Please try again.')
    }
  }

  return (
    <div>
      <h5>Seats (by Theatre)</h5>
      <form className="row g-2 mb-3" onSubmit={save}>
        <div className="col">
          <select className="form-select" value={form.theatre_id} onChange={e=>setForm({...form,theatre_id:e.target.value})} required>
            <option value="">Select Theatre</option>
            {theatres.map(t=> <option key={t.id} value={t.id}>{t.name} — {t.city}</option>)}
          </select>
        </div>
        <div className="col"><input className="form-control" placeholder="Row (A-Z)" value={form.row_label} onChange={e=>setForm({...form,row_label:e.target.value.toUpperCase().slice(0,1)})} required /></div>
        <div className="col"><input className="form-control" type="number" placeholder="Seat #" value={form.seat_number} onChange={e=>setForm({...form,seat_number:Number(e.target.value)})} required /></div>
        <div className="col-auto"><button className="btn btn-primary">Add Seat</button></div>
      </form>
      <p className="text-muted">Note: Seat list display can be added per theatre as needed.</p>
    </div>
  )
}



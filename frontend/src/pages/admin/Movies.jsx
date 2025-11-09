import { useEffect, useState } from 'react'
import api from '../../lib/api.js'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [form, setForm] = useState({ title: '', genre: '', duration_mins: 120, language: '', rating: '' })
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', genre: '', duration_mins: 120, language: '', rating: '' })
  async function load() { 
    try {
      const { data } = await api.get('/movies'); 
      setMovies(data) 
    } catch (e) {
      console.error('Failed to load movies:', e)
    }
  }
  useEffect(()=>{ load() }, [])

  async function save(e){
    e.preventDefault()
    try {
      await api.post('/movies', form)
      setForm({ title: '', genre: '', duration_mins: 120, language: '', rating: '' })
      load()
    } catch (e) {
      console.error('Failed to save movie:', e)
      alert('Failed to save movie. Please try again.')
    }
  }
  async function del(id){ 
    try {
      await api.delete(`/movies/${id}`); 
      load() 
    } catch (e) {
      console.error('Failed to delete movie:', e)
      alert('Failed to delete movie. Please try again.')
    }
  }
  async function startEdit(m){ setEditId(m.id); setEditForm({ title: m.title || '', genre: m.genre || '', duration_mins: m.duration_mins || 120, language: m.language || '', rating: m.rating || '' }) }
  async function cancelEdit(){ setEditId(null) }
  async function updateMovie(id){ 
    try {
      await api.put(`/movies/${id}`, editForm); 
      setEditId(null); 
      load() 
    } catch (e) {
      console.error('Failed to update movie:', e)
      alert('Failed to update movie. Please try again.')
    }
  }

  return (
    <div>
      <h5>Movies</h5>
      <form className="row g-2 mb-3" onSubmit={save}>
        <div className="col"><input className="form-control" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
        <div className="col"><input className="form-control" placeholder="Genre" value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} /></div>
        <div className="col"><input className="form-control" type="number" placeholder="Duration" value={form.duration_mins} onChange={e=>setForm({...form,duration_mins:Number(e.target.value)})} /></div>
        <div className="col"><input className="form-control" placeholder="Language" value={form.language} onChange={e=>setForm({...form,language:e.target.value})} /></div>
        <div className="col"><input className="form-control" placeholder="Rating" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} /></div>
        <div className="col-auto"><button className="btn btn-primary">Add</button></div>
      </form>
      <ul className="list-group">
        {movies.map(m => (
          <li key={m.id} className="list-group-item">
            {editId === m.id ? (
              <div className="row g-2 align-items-center">
                <div className="col-3"><input className="form-control" value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})} /></div>
                <div className="col-2"><input className="form-control" value={editForm.genre} onChange={e=>setEditForm({...editForm,genre:e.target.value})} /></div>
                <div className="col-2"><input className="form-control" type="number" value={editForm.duration_mins} onChange={e=>setEditForm({...editForm,duration_mins:Number(e.target.value)})} /></div>
                <div className="col-2"><input className="form-control" value={editForm.language} onChange={e=>setEditForm({...editForm,language:e.target.value})} /></div>
                <div className="col-1"><input className="form-control" value={editForm.rating} onChange={e=>setEditForm({...editForm,rating:e.target.value})} /></div>
                <div className="col-2 d-flex gap-2 justify-content-end">
                  <button className="btn btn-sm btn-success" onClick={()=>updateMovie(m.id)}>Save</button>
                  <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <span>{m.title} — {m.genre}</span>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={()=>startEdit(m)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>del(m.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}



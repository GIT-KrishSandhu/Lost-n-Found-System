import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:3000";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemName: "", description: "", type: "Lost", location: "", date: "", contactInfo: "" });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE}/api/items`, { headers });
      setItems(res.data);
    } catch { setError("Failed to fetch items"); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE}/api/items`, form, { headers });
      setForm({ itemName: "", description: "", type: "Lost", location: "", date: "", contactInfo: "" });
      fetchItems();
      setActiveTab("all");
    } catch { setError("Failed to add item"); }
  };

  const handleSearch = async () => {
    try {
      if (!search.trim()) return fetchItems();
      const res = await axios.get(`${BASE}/api/items/search?name=${search}`, { headers });
      setItems(res.data);
    } catch { setError("Search failed"); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE}/api/items/${id}`, { headers });
      fetchItems();
    } catch { setError("Delete failed"); }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`${BASE}/api/items/${id}`, editForm, { headers });
      setEditId(null);
      fetchItems();
    } catch { setError("Update failed"); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const lostCount = items.filter(i => i.type === "Lost").length;
  const foundCount = items.filter(i => i.type === "Found").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f1f5f9; }

        .dash-root {
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
        }

        /* NAVBAR */
        .navbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 2.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 12px rgba(0,0,0,0.06);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #0f172a;
        }

        .nav-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #475569;
        }

        .avatar {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 600; font-size: 0.85rem;
        }

        .logout-btn {
          padding: 7px 16px;
          background: transparent;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
        }

        .logout-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }

        /* CONTENT */
        .dash-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 2rem;
        }

        /* STATS */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .stat-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .stat-icon.total { background: #eff6ff; }
        .stat-icon.lost { background: #fff1f2; }
        .stat-icon.found { background: #f0fdf4; }

        .stat-info { flex: 1; }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* TABS */
        .tabs {
          display: flex;
          gap: 4px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.5rem;
          width: fit-content;
        }

        .tab {
          padding: 8px 20px;
          border: none;
          border-radius: 9px;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          color: #64748b;
          background: transparent;
          transition: all 0.2s;
          font-weight: 500;
        }

        .tab.active {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          color: #fff;
          box-shadow: 0 2px 8px rgba(6,182,212,0.3);
        }

        /* CARDS */
        .card {
          background: #fff;
          border-radius: 16px;
          padding: 1.75rem;
          border: 1px solid #e2e8f0;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* FORM */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-grid .full { grid-column: 1 / -1; }

        .field { display: flex; flex-direction: column; gap: 6px; }

        .field label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .field input, .field select, .field textarea {
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .field input:focus, .field select:focus {
          border-color: #06b6d4;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
        }

        .add-btn {
          padding: 12px 28px;
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 16px rgba(6,182,212,0.3);
          margin-top: 0.5rem;
        }

        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(6,182,212,0.4); }

        /* SEARCH */
        .search-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .search-row input {
          flex: 1;
          padding: 11px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-row input:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
          background: #fff;
        }

        .search-btn {
          padding: 11px 20px;
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          color: #fff; border: none; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          cursor: pointer; transition: transform 0.15s;
          white-space: nowrap;
        }

        .search-btn:hover { transform: translateY(-1px); }

        .clear-btn {
          padding: 11px 16px;
          background: #f1f5f9; color: #64748b;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          cursor: pointer; transition: all 0.15s;
        }

        .clear-btn:hover { background: #e2e8f0; }

        /* TABLE */
        .table-wrap { overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        thead th {
          text-align: left;
          padding: 10px 14px;
          color: #94a3b8;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          border-bottom: 1px solid #f1f5f9;
        }

        tbody tr {
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }

        tbody tr:hover { background: #f8fafc; }

        tbody td {
          padding: 13px 14px;
          color: #334155;
          vertical-align: middle;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .badge-lost { background: #fff1f2; color: #e11d48; }
        .badge-found { background: #f0fdf4; color: #16a34a; }

        .action-btn {
          padding: 5px 12px;
          border: none; border-radius: 6px;
          font-size: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-right: 5px;
          transition: opacity 0.15s, transform 0.15s;
          font-weight: 500;
        }

        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn-edit { background: #eff6ff; color: #2563eb; }
        .btn-delete { background: #fff1f2; color: #e11d48; }
        .btn-save { background: #f0fdf4; color: #16a34a; }
        .btn-cancel { background: #f1f5f9; color: #64748b; }

        .inline-input {
          padding: 6px 10px;
          border: 1.5px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          outline: none;
        }

        .inline-input:focus { border-color: #06b6d4; }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
        }

        .empty-state .emoji { font-size: 2.5rem; margin-bottom: 0.75rem; }

        .error-bar {
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; padding: 10px 16px;
          border-radius: 8px; font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }
      `}</style>

      <div className="dash-root">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-icon">🔍</div>
            Lost & Found Portal
          </div>
          <div className="nav-right">
            <div className="nav-user">
              <div className="avatar">{name?.charAt(0).toUpperCase()}</div>
              <span>{name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign out</button>
          </div>
        </nav>

        <div className="dash-content">
          {error && <div className="error-bar">{error}</div>}

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon total">📦</div>
              <div className="stat-info">
                <div className="stat-num">{items.length}</div>
                <div className="stat-label">Total Items</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon lost">🔴</div>
              <div className="stat-info">
                <div className="stat-num">{lostCount}</div>
                <div className="stat-label">Lost Items</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon found">🟢</div>
              <div className="stat-info">
                <div className="stat-num">{foundCount}</div>
                <div className="stat-label">Found Items</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab ${activeTab === "all" ? "active" : ""}`} onClick={() => { setActiveTab("all"); fetchItems(); }}>All Items</button>
            <button className={`tab ${activeTab === "report" ? "active" : ""}`} onClick={() => setActiveTab("report")}>Report Item</button>
            <button className={`tab ${activeTab === "search" ? "active" : ""}`} onClick={() => setActiveTab("search")}>Search</button>
          </div>

          {/* Report Item Form */}
          {activeTab === "report" && (
            <div className="card">
              <div className="card-title">📋 Report an Item</div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label>Item Name</label>
                    <input name="itemName" placeholder="e.g. Blue Backpack" value={form.itemName} onChange={handleChange} required />
                  </div>
                  <div className="field">
                    <label>Type</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                      <option>Lost</option>
                      <option>Found</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input name="location" placeholder="e.g. Library, Block B" value={form.location} onChange={handleChange} required />
                  </div>
                  <div className="field">
                    <label>Date</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Contact Info</label>
                    <input name="contactInfo" placeholder="Phone or email" value={form.contactInfo} onChange={handleChange} required />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <input name="description" placeholder="Brief description" value={form.description} onChange={handleChange} />
                  </div>
                </div>
                <button className="add-btn" type="submit">Submit Report →</button>
              </form>
            </div>
          )}

          {/* Search */}
          {activeTab === "search" && (
            <div className="card">
              <div className="card-title">🔎 Search Items</div>
              <div className="search-row">
                <input placeholder="Search by item name..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <button className="search-btn" onClick={handleSearch}>Search</button>
                <button className="clear-btn" onClick={() => { setSearch(""); fetchItems(); }}>Clear</button>
              </div>
            </div>
          )}

          {/* Items Table */}
          {(activeTab === "all" || activeTab === "search") && (
            <div className="card">
              <div className="card-title">📋 Reported Items <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.9rem" }}>({items.length})</span></div>
              {items.length === 0 ? (
                <div className="empty-state">
                  <div className="emoji">📭</div>
                  <p>No items reported yet.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {["Item Name", "Type", "Location", "Contact", "Date", "Actions"].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item._id}>
                          {editId === item._id ? (
                            <>
                              <td><input className="inline-input" defaultValue={item.itemName} onChange={e => setEditForm({ ...editForm, itemName: e.target.value })} /></td>
                              <td>
                                <select className="inline-input" defaultValue={item.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                                  <option>Lost</option>
                                  <option>Found</option>
                                </select>
                              </td>
                              <td><input className="inline-input" defaultValue={item.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} /></td>
                              <td><input className="inline-input" defaultValue={item.contactInfo} onChange={e => setEditForm({ ...editForm, contactInfo: e.target.value })} /></td>
                              <td>{new Date(item.date).toLocaleDateString()}</td>
                              <td>
                                <button className="action-btn btn-save" onClick={() => handleEditSave(item._id)}>Save</button>
                                <button className="action-btn btn-cancel" onClick={() => setEditId(null)}>Cancel</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ fontWeight: 500 }}>{item.itemName}</td>
                              <td><span className={`badge ${item.type === "Lost" ? "badge-lost" : "badge-found"}`}>{item.type}</span></td>
                              <td>{item.location}</td>
                              <td>{item.contactInfo}</td>
                              <td>{new Date(item.date).toLocaleDateString()}</td>
                              <td>
                                <button className="action-btn btn-edit" onClick={() => { setEditId(item._id); setEditForm(item); }}>Edit</button>
                                <button className="action-btn btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
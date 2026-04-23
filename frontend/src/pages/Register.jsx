import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f7f8fc;
          overflow: hidden;
        }

        .auth-left {
          flex: 1;
          background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #0e7490 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem;
          position: relative;
          overflow: hidden;
        }

        .auth-left::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,116,144,0.3) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }

        .auth-left::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%);
          bottom: 50px;
          left: 50px;
        }

        .brand-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 3rem;
          box-shadow: 0 8px 32px rgba(6,182,212,0.4);
          position: relative;
          z-index: 1;
        }

        .auth-left h1 {
          font-family: 'Syne', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .auth-left h1 span {
          color: #06b6d4;
        }

        .auth-left p {
          color: rgba(255,255,255,0.6);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 340px;
          position: relative;
          z-index: 1;
        }

        .floating-dots {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          z-index: 1;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        .auth-right {
          width: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 3.5rem;
          background: #ffffff;
        }

        .auth-form-wrap {
          width: 100%;
        }

        .auth-form-wrap h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.4rem;
        }

        .auth-form-wrap .subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 2.5rem;
        }

        .field {
          margin-bottom: 1.25rem;
        }

        .field label {
          display: block;
          font-size: 0.82rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .field input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }

        .field input:focus {
          border-color: #06b6d4;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(6,182,212,0.1);
        }

        .error-msg {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(6,182,212,0.35);
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(6,182,212,0.45);
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .auth-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.9rem;
          color: #64748b;
        }

        .auth-footer a {
          color: #0891b2;
          font-weight: 500;
          text-decoration: none;
        }

        .auth-footer a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-left">
          <div className="brand-icon">🔍</div>
          <h1>Lost &<br /><span>Found</span><br />Portal</h1>
          <p>A smarter way to report and recover lost belongings on campus.</p>
          <div className="floating-dots">
            {Array(25).fill(0).map((_, i) => <div key={i} className="dot" />)}
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2>Create account</h2>
            <p className="subtitle">Join the campus lost & found network</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Full Name</label>
                <input name="name" placeholder="Krish Sandhu" onChange={handleChange} required />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="you@university.edu" onChange={handleChange} required />
              </div>
              <div className="field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Create a strong password" onChange={handleChange} required />
              </div>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Truck, User, Lock, AlertCircle, MapPin, Package, BarChart3 } from 'lucide-react';
import s from './login.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Username dan password wajib diisi.'); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) setError('Username atau password salah.');
      setLoading(false);
    }, 600);
  };

  const fillDemo = (u: string, p: string) => { setUsername(u); setPassword(p); setError(''); };

  return (
    <div className={s.loginPage}>
      <div className={s.brandPanel}>
        <div className={s.brandLogo}>
          <div className={s.logoIcon}><Truck size={24} /></div>
          <span className={s.logoText}>LogiTrack</span>
        </div>
        <h1 className={s.brandTitle}>
          Sistem Manajemen <span>Logistik</span>
        </h1>
        <p className={s.brandDesc}>
          Platform real-time untuk tracking sopir, pengelolaan muatan, dan optimasi rute pengiriman. Semua dalam satu dashboard.
        </p>
        <div className={s.features}>
          <div className={s.featureItem}>
            <div className={s.featureIcon}><MapPin size={18} /></div>
            <span>Tracking GPS real-time semua armada</span>
          </div>
          <div className={s.featureItem}>
            <div className={s.featureIcon}><Package size={18} /></div>
            <span>Manajemen muatan & sinkronisasi data</span>
          </div>
          <div className={s.featureItem}>
            <div className={s.featureIcon}><BarChart3 size={18} /></div>
            <span>Dashboard analitik & laporan perjalanan</span>
          </div>
        </div>
      </div>

      <div className={s.formPanel}>
        <form className={s.formCard} onSubmit={handleSubmit}>
          <h2 className={s.formTitle}>Masuk ke Akun</h2>
          <p className={s.formSubtitle}>Silakan login untuk melanjutkan</p>

          {error && <div className={s.error}><AlertCircle size={16} />{error}</div>}

          <div className={s.inputGroup}>
            <label className={s.inputLabel} htmlFor="username">Username</label>
            <div className={s.inputWrapper}>
              <User size={18} className={s.inputIcon} />
              <input id="username" className={s.input} type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
            </div>
          </div>

          <div className={s.inputGroup}>
            <label className={s.inputLabel} htmlFor="password">Password</label>
            <div className={s.inputWrapper}>
              <Lock size={18} className={s.inputIcon} />
              <input id="password" className={s.input} type="password" placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
          </div>

          <button className={s.loginBtn} type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <div className={s.divider}>Demo Account</div>
          <div className={s.demoAccounts}>
            <button type="button" className={s.demoBtn} onClick={() => fillDemo('admin', 'admin123')}>
              <BarChart3 size={16} /> Login sebagai Admin
            </button>
            <button type="button" className={s.demoBtn} onClick={() => fillDemo('agus', 'driver123')}>
              <Truck size={16} /> Login sebagai Sopir (Agus)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

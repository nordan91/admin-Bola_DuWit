import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: '2rem',
      boxSizing: 'border-box' as const,
    },
    content: {
      textAlign: 'center' as const,
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto',
      padding: '2rem',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '6rem',
      fontWeight: 700,
      color: '#1f2937',
      margin: '0 0 1rem',
      lineHeight: 1,
    },
    subtitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#111827',
      margin: '0 0 0.5rem',
    },
    text: {
      color: '#4b5563',
      margin: '0 0 2rem',
      lineHeight: 1.5,
    },
    button: {
      display: 'inline-block',
      backgroundColor: '#4CD964',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
      fontSize: '1rem',
      transition: 'background-color 0.2s ease',
    },
    buttonHover: {
      backgroundColor: '#3CB54A',
    } as const,
  };

  return (
    <div style={styles.container}>
      <div style={styles.content} className="not-found-content">
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Halaman Tidak Ditemukan</h2>
        <p style={styles.text}>
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || '')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor || '')}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

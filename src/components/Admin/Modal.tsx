import { XIcon } from '../icons/XIcon';
import '../../styles/Modal.css';

// Interface untuk props yang diterima oleh komponen Modal
interface ModalProps {
  isOpen: boolean;              // Status modal (terbuka/tutup)
  onClose: () => void;          // Fungsi yang dipanggil saat modal ditutup
  title: string;                // Judul yang ditampilkan di header modal
  children: React.ReactNode;    // Konten utama modal
  footer?: React.ReactNode;     // Konten opsional untuk footer modal
}

/**
 * Komponen Modal yang dapat digunakan kembali di seluruh aplikasi
 * Menampilkan konten dalam overlay yang muncul di atas konten lain
 */
export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  // Jika modal tidak terbuka, tidak render apa-apa
  if (!isOpen) return null;

  return (
    // Overlay yang menutupi layar dan menutup modal saat diklik
    <div className="modal-overlay" onClick={onClose}>
      {/* Konten modal yang mencegah event click agar tidak memicu penutupan modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header modal dengan judul dan tombol tutup */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Tutup modal"
          >
            <XIcon width={20} height={20} color="var(--color-gray-600)" />
          </button>
        </div>
        {/* Badan modal yang menampilkan konten utama */}
        <div className="modal-body">
          {children}
        </div>
        
        {/* Footer opsional untuk tombol aksi atau informasi tambahan */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
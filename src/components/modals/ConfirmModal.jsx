import { X, AlertTriangle } from 'lucide-react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-md shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

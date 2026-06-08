import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

export function Modal({ children, onClose, isOpen }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    if (!isOpen) return;

    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);

  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const portalTarget = document.getElementById('portal');
  if (!portalTarget) return null;

  return ReactDOM.createPortal(
    <div ref={modalRef} tabIndex={-1}>
      <button onClick={onClose}>✖️</button>
      {children}
    </div>,
    portalTarget
  );
}

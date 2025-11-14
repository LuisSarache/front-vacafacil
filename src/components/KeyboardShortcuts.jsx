import { useEffect } from 'react';
import { ToastManager } from './ToastManager';

export const KeyboardShortcuts = () => {

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K para busca global
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger global search
        document.dispatchEvent(new CustomEvent('openGlobalSearch'));
      }

      // Ctrl/Cmd + D para dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        window.location.href = '/dashboard';
        ToastManager.info('Navegando para Dashboard');
      }

      // Ctrl/Cmd + R para rebanho
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        window.location.href = '/rebanho';
        ToastManager.info('Navegando para Rebanho');
      }

      // Ctrl/Cmd + P para produção
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.location.href = '/producao';
        ToastManager.info('Navegando para Produção');
      }

      // Ctrl/Cmd + F para financeiro
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        window.location.href = '/financeiro';
        ToastManager.info('Navegando para Financeiro');
      }

      // Ctrl/Cmd + N para nova vaca
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/rebanho/novo';
        ToastManager.info('Cadastrar Nova Vaca');
      }

      // Esc para fechar modais
      if (e.key === 'Escape') {
        document.dispatchEvent(new CustomEvent('closeModals'));
      }

      // ? para mostrar atalhos
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('showShortcuts'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
};
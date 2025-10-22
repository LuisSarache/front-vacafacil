import { useState, useMemo } from 'react';

export const useTableSort = (data, initialKey = null) => {
  const [sortConfig, setSortConfig] = useState({
    key: initialKey,
    direction: 'asc'
  });

  const sortedData = useMemo(() => {
    try {
      if (!sortConfig.key || !data) return data;

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    } catch (error) {
      console.error('Erro ao ordenar dados:', error);
      return data;
    }
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return { sortedData, requestSort, getSortIcon, sortConfig };
};

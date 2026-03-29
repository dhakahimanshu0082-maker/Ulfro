'use client';

import { useState } from 'react';
import { CATEGORY_GROUPS } from '../lib/categories';

export default function CategoryPicker({ selected = [], onChange, maxSelect = null, singleSelect = false }) {
  const [activeGroup, setActiveGroup] = useState(CATEGORY_GROUPS[0]?.group || '');

  const handleSelect = (categoryId) => {
    if (singleSelect) {
      onChange(categoryId);
      return;
    }

    if (selected.includes(categoryId)) {
      onChange(selected.filter((id) => id !== categoryId));
    } else {
      if (maxSelect && selected.length >= maxSelect) return;
      onChange([...selected, categoryId]);
    }
  };

  const isSelected = (id) =>
    singleSelect ? selected === id : selected.includes(id);

  return (
    <div className="category-picker">
      {/* Group tabs */}
      <div className="category-picker-tabs">
        {CATEGORY_GROUPS.map((group) => (
          <button
            key={group.group}
            type="button"
            className={`category-tab ${activeGroup === group.group ? 'category-tab-active' : ''}`}
            onClick={() => setActiveGroup(group.group)}
          >
            {group.group}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div className="category-picker-grid">
        {CATEGORY_GROUPS.filter((g) => g.group === activeGroup)
          .flatMap((g) => g.categories)
          .map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-picker-item ${isSelected(cat.id) ? 'category-picker-selected' : ''}`}
              onClick={() => handleSelect(cat.id)}
            >
              <span className="category-picker-icon">{cat.icon}</span>
              <span className="category-picker-name">{cat.name}</span>
            </button>
          ))}
      </div>

      {!singleSelect && selected.length > 0 && (
        <div className="category-picker-selected-count">
          {selected.length} selected{maxSelect ? ` (max ${maxSelect})` : ''}
        </div>
      )}
    </div>
  );
}

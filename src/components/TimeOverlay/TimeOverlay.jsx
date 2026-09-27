import React, { useMemo, useState } from 'react';
import styles from './TimeOverlay.module.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getArticleSlug(item) {
  return (item.url || item.id || '').split('/').pop().replace('.html', '');
}

export function TimeOverlay({ feedData, onFilterChange }) {
  const [activeFilterId, setActiveFilterId] = useState(null);

  const timelineData = useMemo(() => {
    if (!feedData || !feedData.items || !feedData.items.length) {
      return { months: [], totalItems: 0, minYear: null, maxYear: null };
    }

    const itemsWithDates = [];
    let minDate = null;
    let maxDate = null;

    feedData.items.forEach(item => {
      const dateStr = item.date_published || item.date;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;

      const slug = getArticleSlug(item);
      itemsWithDates.push({ item, date: d, slug });

      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
    });

    if (!minDate || !maxDate) {
      return { months: [], totalItems: 0, minYear: null, maxYear: null };
    }

    // Build unbroken continuous sequence of months from min to max
    const startYear = minDate.getFullYear();
    const startMonth = minDate.getMonth();
    const endYear = maxDate.getFullYear();
    const endMonth = maxDate.getMonth();

    const months = [];
    let cur = new Date(startYear, startMonth, 1);
    const stop = new Date(endYear, endMonth, 1);

    while (cur <= stop) {
      const y = cur.getFullYear();
      const m = cur.getMonth();
      const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;

      // Initialize 5 weekly buckets for this month
      const weeks = [
        { label: 'Wk 1', id: `${monthKey}-w1`, range: [1, 7], articleSlugs: [] },
        { label: 'Wk 2', id: `${monthKey}-w2`, range: [8, 14], articleSlugs: [] },
        { label: 'Wk 3', id: `${monthKey}-w3`, range: [15, 21], articleSlugs: [] },
        { label: 'Wk 4', id: `${monthKey}-w4`, range: [22, 28], articleSlugs: [] },
        { label: 'Wk 5', id: `${monthKey}-w5`, range: [29, 31], articleSlugs: [] }
      ];

      const monthArticleSlugs = [];

      // Bucket articles that match this year & month
      itemsWithDates.forEach(({ date, slug }) => {
        if (date.getFullYear() === y && date.getMonth() === m) {
          monthArticleSlugs.push(slug);
          const day = date.getDate();
          const targetWeek = weeks.find(w => day >= w.range[0] && day <= w.range[1]);
          if (targetWeek) {
            targetWeek.articleSlugs.push(slug);
          }
        }
      });

      months.push({
        key: monthKey,
        year: y,
        monthIndex: m,
        monthName: MONTH_NAMES[m],
        articleSlugs: monthArticleSlugs,
        weeks
      });

      // Advance by 1 month
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    }

    // Display newest months on top (descending order for timeline view)
    months.reverse();

    return {
      months,
      totalItems: itemsWithDates.length,
      minYear: startYear,
      maxYear: endYear
    };
  }, [feedData]);

  if (!timelineData.months.length) return null;

  const handleSelectMonth = (m) => {
    if (m.articleSlugs.length === 0) return;
    if (activeFilterId === m.key) {
      setActiveFilterId(null);
      if (onFilterChange) onFilterChange(null, null);
    } else {
      setActiveFilterId(m.key);
      if (onFilterChange) onFilterChange(new Set(m.articleSlugs), `${m.monthName} ${m.year}`);
    }
  };

  const handleSelectWeek = (e, w, m) => {
    e.stopPropagation();
    if (w.articleSlugs.length === 0) return;
    if (activeFilterId === w.id) {
      setActiveFilterId(null);
      if (onFilterChange) onFilterChange(null, null);
    } else {
      setActiveFilterId(w.id);
      if (onFilterChange) onFilterChange(new Set(w.articleSlugs), `${m.monthName} ${w.label}`);
    }
  };

  const handleClear = () => {
    setActiveFilterId(null);
    if (onFilterChange) onFilterChange(null, null);
  };

  return (
    <div className={styles.timeOverlay}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.title}>Chronology</span>
          <span className={styles.rangeBadge}>
            {timelineData.minYear === timelineData.maxYear
              ? timelineData.minYear
              : `${timelineData.minYear}–${timelineData.maxYear}`}
          </span>
        </div>
        {activeFilterId && (
          <button className={styles.clearBtn} onClick={handleClear} title="Show all posts">
            Reset
          </button>
        )}
      </div>

      <div className={styles.stackScroll}>
        {timelineData.months.map((m, idx) => {
          const isMonthActive = activeFilterId === m.key;
          const isEmpty = m.articleSlugs.length === 0;
          const prevMonth = timelineData.months[idx - 1];
          const isYearTransition = !prevMonth || prevMonth.year !== m.year;

          return (
            <div
              key={m.key}
              className={`${styles.monthBox} ${isEmpty ? styles.emptyMonth : ''} ${isMonthActive ? styles.activeMonth : ''}`}
            >
              {/* Left Column: Month Name and item count */}
              <div
                className={styles.monthHeader}
                onClick={() => handleSelectMonth(m)}
                title={isEmpty ? 'No articles published this month' : `Filter to ${m.monthName} ${m.year} (${m.articleSlugs.length})`}
              >
                <div className={styles.monthName}>
                  {m.monthName}
                  {isYearTransition && <span className={styles.yearTag}>{m.year}</span>}
                </div>
                <div className={`${styles.monthMeta} ${m.articleSlugs.length > 0 ? styles.hasItems : ''}`}>
                  {m.articleSlugs.length > 0 ? `${m.articleSlugs.length} post${m.articleSlugs.length > 1 ? 's' : ''}` : '0 posts'}
                </div>
              </div>

              {/* Branching tree connector */}
              <div className={styles.branchArea}>
                <div className={styles.branchLine} />
                <div className={styles.weeksRow}>
                  {m.weeks.map(w => {
                    const count = w.articleSlugs.length;
                    const isWeekActive = activeFilterId === w.id;
                    return (
                      <div
                        key={w.id}
                        className={`${styles.weekPill} ${count > 0 ? styles.hasContent : ''} ${isWeekActive ? styles.activeWeek : ''}`}
                        onClick={(e) => handleSelectWeek(e, w, m)}
                        title={count > 0 ? `${w.label}: ${count} post${count > 1 ? 's' : ''}` : `${w.label}: empty`}
                      >
                        <span>{w.label}</span>
                        {count > 0 && <span className={styles.weekBadge}>{count}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

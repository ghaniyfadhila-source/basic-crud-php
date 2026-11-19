(function (root) {
  'use strict';

  var STORAGE_KEY = 'modul_crud_php_passport_v1';
  var DEFAULT_TOTAL_CHAPTERS = 10;
  var MIN_ID = 1;
  var MAX_ID = 10;

  function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function isValidId(value) {
    return typeof value === 'number' && Number.isInteger(value) && value >= MIN_ID && value <= MAX_ID;
  }

  /**
   * Deduplicate and keep only valid integer IDs within 1..10.
   * @param {unknown} list
   * @returns {number[]}
   */
  function sanitizeIdList(list) {
    if (!Array.isArray(list)) {
      return [];
    }
    var seen = Object.create(null);
    var out = [];
    for (var i = 0; i < list.length; i += 1) {
      var id = list[i];
      if (isValidId(id) && !seen[id]) {
        seen[id] = true;
        out.push(id);
      }
    }
    return out;
  }

  /**
   * Normalize a chapterId -> boolean completion map.
   * @param {unknown} rawMap
   * @returns {Record<number, boolean>}
   */
  function sanitizeBooleanMap(rawMap) {
    if (!isPlainObject(rawMap)) {
      return {};
    }
    var out = {};
    var keys = Object.keys(rawMap);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var num = Number(key);
      if (String(num) === key && isValidId(num) && rawMap[key] === true) {
        out[num] = true;
      }
    }
    return out;
  }

  /**
   * Create a fresh default application state.
   * @returns {{ currentChapterId: number, completedChapters: number[], passedExercises: Record<number, boolean>, passedQuizzes: Record<number, boolean>, examChecked: number[] }}
   */
  function createDefaultState() {
    return {
      currentChapterId: 1,
      completedChapters: [],
      passedExercises: {},
      passedQuizzes: {},
      examChecked: [],
    };
  }

  /**
   * Return a sanitized deep-copied state object.
   * @param {unknown} raw
   */
  function sanitizeState(raw) {
    if (!isPlainObject(raw)) {
      return createDefaultState();
    }
    return {
      currentChapterId: isValidId(raw.currentChapterId) ? raw.currentChapterId : 1,
      completedChapters: sanitizeIdList(raw.completedChapters),
      passedExercises: sanitizeBooleanMap(raw.passedExercises),
      passedQuizzes: sanitizeBooleanMap(raw.passedQuizzes),
      examChecked: sanitizeIdList(raw.examChecked),
    };
  }

  /**
   * Load and validate persisted state from storage, falling back safely on errors.
   * @param {{ getItem?: (key: string) => string | null } | null | undefined} storage
   */
  function loadState(storage) {
    try {
      if (!storage || typeof storage.getItem !== 'function') {
        return createDefaultState();
      }
      var rawText = storage.getItem(STORAGE_KEY);
      if (typeof rawText !== 'string' || !rawText.trim()) {
        return createDefaultState();
      }
      var parsed = JSON.parse(rawText);
      if (!isPlainObject(parsed)) {
        return createDefaultState();
      }
      return sanitizeState(parsed);
    } catch (_err) {
      return createDefaultState();
    }
  }

  /**
   * Persist state safely to storage; returns false if storage is unavailable or throws.
   * @param {{ setItem?: (key: string, value: string) => void } | null | undefined} storage
   * @param {unknown} state
   * @returns {boolean}
   */
  function saveState(storage, state) {
    try {
      if (!storage || typeof storage.setItem !== 'function') {
        return false;
      }
      var safeState = sanitizeState(state);
      storage.setItem(STORAGE_KEY, JSON.stringify(safeState));
      return true;
    } catch (_err) {
      return false;
    }
  }

  /**
   * Calculate chapter completion progress clamped to 0..100%.
   * @param {unknown} state
   * @param {number} [totalChapters=10]
   * @returns {{ completedCount: number, totalChapters: number, percent: number }}
   */
  function calculateProgress(state, totalChapters) {
    var total = totalChapters === undefined ? DEFAULT_TOTAL_CHAPTERS : totalChapters;
    if (typeof total !== 'number' || !Number.isFinite(total)) {
      return { completedCount: 0, totalChapters: 0, percent: 0 };
    }
    total = Math.floor(total);
    if (total <= 0) {
      return { completedCount: 0, totalChapters: 0, percent: 0 };
    }
    var safe = sanitizeState(state);
    var completedCount = Math.min(total, safe.completedChapters.length);
    var rawPercent = Math.round((completedCount / total) * 100);
    var percent = Math.max(0, Math.min(100, rawPercent));
    return {
      completedCount: completedCount,
      totalChapters: total,
      percent: percent,
    };
  }

  function markMapFlag(state, mapKey, chapterId) {
    var safe = sanitizeState(state);
    if (!isValidId(chapterId)) {
      return safe;
    }
    safe[mapKey][chapterId] = true;
    return safe;
  }

  function toggleIdInArray(list, id) {
    var clean = sanitizeIdList(list);
    if (!isValidId(id)) {
      return clean;
    }
    var idx = clean.indexOf(id);
    if (idx >= 0) {
      clean.splice(idx, 1);
    } else {
      clean.push(id);
    }
    return clean;
  }

  /**
   * Immutably mark a chapter's fill-in-the-blank exercise as passed.
   * @param {unknown} state
   * @param {number} chapterId
   */
  function markExercisePassed(state, chapterId) {
    return markMapFlag(state, 'passedExercises', chapterId);
  }

  /**
   * Immutably mark a chapter's debug quiz as passed.
   * @param {unknown} state
   * @param {number} chapterId
   */
  function markQuizPassed(state, chapterId) {
    return markMapFlag(state, 'passedQuizzes', chapterId);
  }

  /**
   * Immutably update the currently active chapter ID.
   * @param {unknown} state
   * @param {number} chapterId
   */
  function setCurrentChapter(state, chapterId) {
    var safe = sanitizeState(state);
    if (isValidId(chapterId)) {
      safe.currentChapterId = chapterId;
    }
    return safe;
  }

  /**
   * Immutably toggle completion status for a chapter ID.
   * @param {unknown} state
   * @param {number} chapterId
   */
  function toggleChapterComplete(state, chapterId) {
    var safe = sanitizeState(state);
    safe.completedChapters = toggleIdInArray(safe.completedChapters, chapterId);
    return safe;
  }

  /**
   * Immutably toggle checked status for an exam checklist item ID.
   * @param {unknown} state
   * @param {number} itemId
   */
  function toggleExamItem(state, itemId) {
    var safe = sanitizeState(state);
    safe.examChecked = toggleIdInArray(safe.examChecked, itemId);
    return safe;
  }

  /**
   * Format remaining seconds as "MM:SS", clamping negative or non-finite values to "00:00".
   * @param {number} remainingSeconds
   * @returns {string}
   */
  function formatCountdown(remainingSeconds) {
    if (typeof remainingSeconds !== 'number' || !Number.isFinite(remainingSeconds) || remainingSeconds <= 0) {
      return '00:00';
    }
    var totalSeconds = Math.floor(remainingSeconds);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  var api = {
    STORAGE_KEY: STORAGE_KEY,
    createDefaultState: createDefaultState,
    loadState: loadState,
    saveState: saveState,
    calculateProgress: calculateProgress,
    markExercisePassed: markExercisePassed,
    markQuizPassed: markQuizPassed,
    setCurrentChapter: setCurrentChapter,
    toggleChapterComplete: toggleChapterComplete,
    toggleExamItem: toggleExamItem,
    formatCountdown: formatCountdown,
  };

  root.ModulCRUD = root.ModulCRUD || {};
  root.ModulCRUD.State = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);

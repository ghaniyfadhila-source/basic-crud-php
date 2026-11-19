(function (global) {
  'use strict';

  var appState = null;
  var activeTab = 'materi';
  var initialized = false;

  // Per-session tracking of multi-part exercise / quiz completion inside a chapter
  var sessionExercisePasses = Object.create(null);
  var sessionQuizPasses = Object.create(null);

  // Exam timer state
  var examIntervalId = null;
  var examRemainingSeconds = 3600;
  var examRunning = false;
  var examDeadlineMs = 0;

  // Modal focus restoration target
  var lastFocusedEl = null;

  // Cached DOM references resolved during init()
  var dom = {};

  function getModules() {
    var root = global.ModulCRUD || {};
    return {
      DATA: root.MATERI_DATA || null,
      State: root.State || null,
      Simulators: root.Simulators || null,
    };
  }

  function getSafeStorage() {
    try {
      return global.localStorage || null;
    } catch (_err) {
      return null;
    }
  }

  function persistState() {
    var mods = getModules();
    if (!mods.State) {
      return false;
    }
    return mods.State.saveState(getSafeStorage(), appState);
  }

  function el(doc, tag, className, text) {
    var node = doc.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text != null) {
      node.textContent = String(text);
    }
    return node;
  }

  function findChapterById(DATA, chapterId) {
    var chapters = (DATA && DATA.CHAPTERS) || [];
    for (var i = 0; i < chapters.length; i += 1) {
      if (chapters[i].id === chapterId) {
        return chapters[i];
      }
    }
    return chapters[0] || null;
  }

  function findPhaseById(DATA, phaseId) {
    var phases = (DATA && DATA.PHASES) || [];
    for (var i = 0; i < phases.length; i += 1) {
      if (phases[i].id === phaseId) {
        return phases[i];
      }
    }
    return null;
  }

  function fallbackCopyText(doc, text) {
    try {
      var ta = doc.createElement('textarea');
      ta.value = String(text);
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.left = '-9999px';
      doc.body.appendChild(ta);
      ta.focus();
      ta.select();
      if (typeof ta.setSelectionRange === 'function') {
        ta.setSelectionRange(0, ta.value.length);
      }
      var ok = typeof doc.execCommand === 'function' ? doc.execCommand('copy') : false;
      doc.body.removeChild(ta);
      return Boolean(ok);
    } catch (_err) {
      return false;
    }
  }

  function copyCodeText(doc, text, btnEl) {
    function showCopyFeedback(label, extraClass) {
      if (!btnEl) {
        return;
      }
      if (btnEl._copyTimer) {
        clearTimeout(btnEl._copyTimer);
        btnEl._copyTimer = null;
      }
      btnEl.textContent = label;
      btnEl.className = extraClass ? 'btn-copy-code ' + extraClass : 'btn-copy-code';
      btnEl._copyTimer = setTimeout(function () {
        btnEl.textContent = 'Salin';
        btnEl.className = 'btn-copy-code';
        btnEl._copyTimer = null;
      }, 1800);
    }

    function showCopiedFeedback() {
      showCopyFeedback('Tersalin', 'is-copied');
    }

    function showCopyFailedFeedback() {
      showCopyFeedback('Gagal', 'is-error');
    }

    var nav = global.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
      try {
        var promise = nav.clipboard.writeText(String(text));
        if (promise && typeof promise.then === 'function') {
          promise.then(showCopiedFeedback, function () {
            if (fallbackCopyText(doc, text)) {
              showCopiedFeedback();
            } else {
              showCopyFailedFeedback();
            }
          });
          return;
        }
      } catch (_err) {
        // Fall through to execCommand fallback
      }
    }

    if (fallbackCopyText(doc, text)) {
      showCopiedFeedback();
    } else {
      showCopyFailedFeedback();
    }
  }

  function toggleMobileSidebar(forceOpen) {
    if (!dom.sidebar) {
      return;
    }
    var shouldOpen = forceOpen !== undefined ? Boolean(forceOpen) : !dom.sidebar.classList.contains('is-open');
    dom.sidebar.classList.toggle('is-open', shouldOpen);
    if (dom.sidebarBackdrop) {
      dom.sidebarBackdrop.hidden = !shouldOpen;
    }
    if (dom.btnToggleSidebar) {
      dom.btnToggleSidebar.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
  }

  function renderGlobalProgress() {
    var mods = getModules();
    if (!mods.DATA || !mods.State) {
      return;
    }
    var total = mods.DATA.CHAPTERS.length;
    var prog = mods.State.calculateProgress(appState, total);

    if (dom.globalProgressText) {
      dom.globalProgressText.textContent = prog.completedCount + ' / ' + prog.totalChapters + ' (' + prog.percent + '%)';
    }
    if (dom.globalProgressBar) {
      dom.globalProgressBar.style.width = prog.percent + '%';
      if (dom.globalProgressBar.parentNode && typeof dom.globalProgressBar.parentNode.setAttribute === 'function') {
        dom.globalProgressBar.parentNode.setAttribute('aria-valuenow', String(prog.percent));
      }
    }
  }

  function renderRoadmap() {
    var mods = getModules();
    var DATA = mods.DATA;
    if (!DATA || !dom.roadmapNav) {
      return;
    }
    var doc = dom.doc;
    dom.roadmapNav.innerHTML = '';

    DATA.PHASES.forEach(function (phase) {
      var phaseBox = el(doc, 'div', 'roadmap-phase');
      phaseBox.appendChild(el(doc, 'h3', 'roadmap-phase-title', phase.title));

      var list = el(doc, 'div', 'roadmap-phase-list');
      phase.chapterIds.forEach(function (chId) {
        var ch = findChapterById(DATA, chId);
        if (!ch) {
          return;
        }
        var isCurrent = appState.currentChapterId === ch.id;
        var isCompleted = appState.completedChapters.indexOf(ch.id) !== -1;

        var classes = ['roadmap-item'];
        if (isCurrent) classes.push('is-active');
        if (isCompleted) classes.push('is-completed');

        var btn = el(doc, 'button', classes.join(' '));
        btn.type = 'button';
        btn.setAttribute('data-chapter-id', String(ch.id));
        if (isCurrent) {
          btn.setAttribute('aria-current', 'page');
        }

        var mainWrap = el(doc, 'span', 'roadmap-item-main');
        mainWrap.appendChild(el(doc, 'span', 'roadmap-num', isCompleted ? '✓' : String(ch.id)));

        var textCol = el(doc, 'span', 'roadmap-text-col');
        textCol.appendChild(el(doc, 'span', 'roadmap-name', ch.shortTitle));
        textCol.appendChild(el(doc, 'span', 'roadmap-file', ch.targetFile));
        mainWrap.appendChild(textCol);
        btn.appendChild(mainWrap);

        if (isCompleted) {
          var badges = el(doc, 'span', 'roadmap-badges');
          badges.appendChild(el(doc, 'span', 'roadmap-stamp', 'Selesai'));
          btn.appendChild(badges);
        }

        btn.addEventListener('click', function () {
          selectChapter(ch.id);
          toggleMobileSidebar(false);
        });

        list.appendChild(btn);
      });

      phaseBox.appendChild(list);
      dom.roadmapNav.appendChild(phaseBox);
    });
  }

  function renderChapterHeaderAndFooter(chapter) {
    var mods = getModules();
    var DATA = mods.DATA;
    var doc = dom.doc;
    var phase = findPhaseById(DATA, chapter.phaseId);
    var isCompleted = appState.completedChapters.indexOf(chapter.id) !== -1;

    if (dom.chapterPhaseBadge) {
      dom.chapterPhaseBadge.className = 'phase-badge phase-badge-' + chapter.phaseId;
      dom.chapterPhaseBadge.textContent = phase ? phase.title : 'Fase ' + chapter.phaseId;
    }
    if (dom.chapterTargetFile) {
      dom.chapterTargetFile.textContent = chapter.targetFile;
    }
    if (dom.chapterSkemaRef) {
      dom.chapterSkemaRef.textContent = chapter.skemaRef;
    }
    if (dom.chapterTitle) {
      dom.chapterTitle.textContent = chapter.title;
    }

    if (dom.btnToggleComplete) {
      dom.btnToggleComplete.textContent = isCompleted ? 'Selesai ✓' : 'Tandai Selesai';
      dom.btnToggleComplete.className = isCompleted ? 'btn btn-stamp is-completed' : 'btn btn-stamp';
      dom.btnToggleComplete.setAttribute('aria-pressed', isCompleted ? 'true' : 'false');
    }

    if (dom.btnPrevChapter) {
      dom.btnPrevChapter.disabled = chapter.id <= 1;
    }
    if (dom.btnNextChapter) {
      var total = DATA ? DATA.CHAPTERS.length : 10;
      dom.btnNextChapter.disabled = chapter.id >= total;
    }
  }

  function renderMateriTab(chapter) {
    var doc = dom.doc;
    var container = dom.tabMateri;
    if (!container) {
      return;
    }
    container.innerHTML = '';

    // 1. Summary
    var secSummary = el(doc, 'section', 'materi-section');
    secSummary.appendChild(el(doc, 'h2', 'section-heading', 'Ringkasan'));
    secSummary.appendChild(el(doc, 'p', 'prose-block', chapter.summary));
    container.appendChild(secSummary);

    // 2. Analogy
    var secAnalogy = el(doc, 'section', 'materi-section');
    var analogyBox = el(doc, 'div', 'analogy-callout');
    analogyBox.appendChild(el(doc, 'span', 'analogy-label', 'Gambaran'));
    analogyBox.appendChild(el(doc, 'p', 'prose-block', chapter.analogy));
    secAnalogy.appendChild(analogyBox);
    container.appendChild(secAnalogy);

    // 3. Golden Rule / Cheat Rule
    if (chapter.cheatRule) {
      var secCheat = el(doc, 'section', 'materi-section');
      var ruleCard = el(doc, 'div', 'cheat-rule-card');
      ruleCard.appendChild(el(doc, 'h3', 'cheat-rule-title', chapter.cheatRule.title));
      ruleCard.appendChild(el(doc, 'code', 'cheat-formula', chapter.cheatRule.formula));
      var ptsList = el(doc, 'ul', 'cheat-points');
      (chapter.cheatRule.points || []).forEach(function (pt) {
        ptsList.appendChild(el(doc, 'li', '', pt));
      });
      ruleCard.appendChild(ptsList);
      secCheat.appendChild(ruleCard);
      container.appendChild(secCheat);
    }

    // 4. Ordered Steps
    if (Array.isArray(chapter.steps) && chapter.steps.length > 0) {
      var secSteps = el(doc, 'section', 'materi-section');
      secSteps.appendChild(el(doc, 'h2', 'section-heading', 'Langkah'));
      var ol = el(doc, 'ol', 'steps-list');
      chapter.steps.forEach(function (st) {
        var li = el(doc, 'li', 'step-card');
        li.appendChild(el(doc, 'h3', 'step-title', st.title));
        li.appendChild(el(doc, 'p', 'step-detail', st.detail));
        ol.appendChild(li);
      });
      secSteps.appendChild(ol);
      container.appendChild(secSteps);
    }

    // 5. Reference Code Blocks + Copy + Optional HTML Preview
    if (Array.isArray(chapter.codeBlocks) && chapter.codeBlocks.length > 0) {
      var secCode = el(doc, 'section', 'materi-section');
      secCode.appendChild(el(doc, 'h2', 'section-heading', 'Kode Acuan'));
      var stack = el(doc, 'div', 'code-cards-stack');

      chapter.codeBlocks.forEach(function (block) {
        var card = el(doc, 'div', 'code-card');
        var head = el(doc, 'div', 'code-card-header');

        var meta = el(doc, 'div', 'code-card-meta');
        meta.appendChild(el(doc, 'span', 'code-filename', block.filename));
        meta.appendChild(el(doc, 'span', 'code-label', block.label));
        head.appendChild(meta);

        var actions = el(doc, 'div', 'code-card-actions');
        var copyBtn = el(doc, 'button', 'btn-copy-code', 'Salin');
        copyBtn.type = 'button';
        copyBtn.addEventListener('click', function () {
          copyCodeText(doc, block.code, copyBtn);
        });
        actions.appendChild(copyBtn);

        var previewPanel = null;
        if (block.previewHtml) {
          var previewBtn = el(doc, 'button', 'btn-toggle-preview', 'Pratinjau');
          previewBtn.type = 'button';
          previewBtn.setAttribute('aria-expanded', 'false');
          previewPanel = el(doc, 'div', 'code-preview-panel');
          previewPanel.hidden = true;
          previewPanel.appendChild(
            el(doc, 'p', 'code-preview-caption', 'Tampilan HTML polos di browser')
          );
          var surface = el(doc, 'div', 'code-preview-surface');
          surface.innerHTML = block.previewHtml;
          surface.addEventListener('submit', function (evt) {
            if (evt && typeof evt.preventDefault === 'function') {
              evt.preventDefault();
            }
          });
          surface.addEventListener('click', function (evt) {
            var node = evt && evt.target ? evt.target : null;
            while (node && node !== surface) {
              if (node.tagName && String(node.tagName).toUpperCase() === 'A') {
                if (typeof evt.preventDefault === 'function') {
                  evt.preventDefault();
                }
                break;
              }
              node = node.parentNode;
            }
          });
          previewPanel.appendChild(surface);

          previewBtn.addEventListener('click', function () {
            var nextHidden = !previewPanel.hidden;
            previewPanel.hidden = nextHidden;
            previewBtn.textContent = nextHidden ? 'Pratinjau' : 'Tutup';
            previewBtn.setAttribute('aria-expanded', nextHidden ? 'false' : 'true');
          });
          actions.appendChild(previewBtn);
        }

        head.appendChild(actions);
        card.appendChild(head);

        var pre = el(doc, 'pre', 'code-pre');
        pre.appendChild(el(doc, 'code', '', block.code));
        card.appendChild(pre);

        if (previewPanel) {
          card.appendChild(previewPanel);
        }

        stack.appendChild(card);
      });

      secCode.appendChild(stack);
      container.appendChild(secCode);
    }
  }

  function renderSimulatorTab(chapter) {
    var mods = getModules();
    var doc = dom.doc;
    var container = dom.tabSimulator;
    if (!container) {
      return;
    }
    var prev = typeof container.querySelector === 'function' ? container.querySelector('.sim-stage') : null;
    if (prev && typeof prev._simCleanup === 'function') {
      prev._simCleanup();
      prev._simCleanup = null;
    }
    container.innerHTML = '';

    var stage = el(doc, 'div', 'sim-stage');
    container.appendChild(stage);

    if (mods.Simulators && typeof mods.Simulators.renderSimulator === 'function') {
      mods.Simulators.renderSimulator(stage, chapter);
    }
  }

  function buildBlankTemplateNodes(doc, template, blanks) {
    var blankMap = Object.create(null);
    (blanks || []).forEach(function (b) {
      blankMap[b.id] = b;
    });

    var pre = el(doc, 'pre', 'fb-code-template');
    var inputByBlankId = Object.create(null);
    var parts = String(template || '').split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

    parts.forEach(function (part) {
      if (!part) {
        return;
      }
      var match = part.match(/^\{\{([a-zA-Z0-9_]+)\}\}$/);
      if (match) {
        var blankId = match[1];
        var meta = blankMap[blankId] || { id: blankId, placeholder: blankId };
        var labelText = meta.placeholder || blankId;
        var inp = el(doc, 'input', 'fb-input');
        inp.type = 'text';
        inp.placeholder = labelText;
        inp.size = Math.max(16, Math.min(34, labelText.length + 2));
        inp.setAttribute('size', String(inp.size));
        inp.setAttribute('autocapitalize', 'none');
        inp.setAttribute('autocorrect', 'off');
        inp.setAttribute('spellcheck', 'false');
        inp.setAttribute('autocomplete', 'off');
        inp.setAttribute('data-blank-id', blankId);
        inp.setAttribute('aria-label', labelText);
        inputByBlankId[blankId] = inp;
        pre.appendChild(inp);
      } else {
        // Use <span> instead of TextNode so lightweight DOM walkers never encounter nodeType 3 without tagName
        pre.appendChild(el(doc, 'span', 'fb-code-text', part));
      }
    });

    return {
      templateEl: pre,
      inputByBlankId: inputByBlankId,
    };
  }

  function renderLatihanTab(chapter) {
    var mods = getModules();
    var doc = dom.doc;
    var container = dom.tabLatihan;
    if (!container) {
      return;
    }
    container.innerHTML = '';

    var exercises = Array.isArray(chapter.fillBlanks) ? chapter.fillBlanks : [];
    var quizzes = Array.isArray(chapter.debugQuiz) ? chapter.debugQuiz : [];

    sessionExercisePasses[chapter.id] = {};
    sessionQuizPasses[chapter.id] = {};

    var exBanner = el(doc, 'div', 'latihan-banner');
    var exBadge = el(
      doc,
      'span',
      appState.passedExercises[chapter.id] ? 'status-pill is-done' : 'status-pill',
      appState.passedExercises[chapter.id] ? 'Isian: Lulus' : 'Isian: Belum'
    );
    var quizBadge = el(
      doc,
      'span',
      appState.passedQuizzes[chapter.id] ? 'status-pill is-done' : 'status-pill',
      appState.passedQuizzes[chapter.id] ? 'Kuis: Lulus' : 'Kuis: Belum'
    );
    exBanner.appendChild(exBadge);
    exBanner.appendChild(quizBadge);
    container.appendChild(exBanner);

    function syncExerciseBadge() {
      var passed = Boolean(appState.passedExercises[chapter.id]);
      exBadge.className = passed ? 'status-pill is-done' : 'status-pill';
      exBadge.textContent = passed ? 'Isian: Lulus' : 'Isian: Belum';
    }

    function syncQuizBadge() {
      var passed = Boolean(appState.passedQuizzes[chapter.id]);
      quizBadge.className = passed ? 'status-pill is-done' : 'status-pill';
      quizBadge.textContent = passed ? 'Kuis: Lulus' : 'Kuis: Belum';
    }

    // Section A: Fill-in-the-blank exercises
    var fbGroup = el(doc, 'section', 'latihan-group');
    fbGroup.appendChild(el(doc, 'h2', 'section-heading', '1. Lengkapi Kode'));

    exercises.forEach(function (exercise, exIdx) {
      var card = el(doc, 'div', 'exercise-card');
      card.appendChild(el(doc, 'h3', 'exercise-title', exercise.title));

      var built = buildBlankTemplateNodes(doc, exercise.template, exercise.blanks);
      card.appendChild(built.templateEl);

      var actionsRow = el(doc, 'div', 'fb-actions');
      var checkBtn = el(doc, 'button', 'btn btn-primary fb-check-btn', 'Cek Jawaban');
      checkBtn.type = 'button';
      var resetExBtn = el(doc, 'button', 'btn btn-secondary', 'Bersihkan');
      resetExBtn.type = 'button';
      actionsRow.appendChild(checkBtn);
      actionsRow.appendChild(resetExBtn);
      card.appendChild(actionsRow);

      var feedbackBox = el(doc, 'div', 'fb-feedback');
      feedbackBox.hidden = true;
      card.appendChild(feedbackBox);

      checkBtn.addEventListener('click', function () {
        if (!mods.Simulators || typeof mods.Simulators.gradeFillBlank !== 'function') {
          return;
        }
        var userValues = {};
        (exercise.blanks || []).forEach(function (b) {
          var field = built.inputByBlankId[b.id];
          userValues[b.id] = field ? field.value : '';
        });

        var result = mods.Simulators.gradeFillBlank(exercise, userValues);
        feedbackBox.innerHTML = '';
        feedbackBox.hidden = false;

        var hints = [];
        result.details.forEach(function (detail) {
          var field = built.inputByBlankId[detail.id];
          if (field) {
            field.className = detail.ok ? 'fb-input is-correct' : 'fb-input is-wrong';
          }
          if (!detail.ok && detail.hint) {
            hints.push(detail.hint);
          }
        });

        if (result.passed) {
          feedbackBox.className = 'fb-feedback is-ok';
          feedbackBox.appendChild(
            el(doc, 'p', '', 'Benar semua (' + result.correctCount + '/' + result.total + ').')
          );
          sessionExercisePasses[chapter.id][exIdx] = true;

          var allPassed = exercises.every(function (_ex, idx) {
            return Boolean(sessionExercisePasses[chapter.id][idx]);
          });
          if (allPassed && mods.State) {
            appState = mods.State.markExercisePassed(appState, chapter.id);
            persistState();
            syncExerciseBadge();
            renderChapterHeaderAndFooter(chapter);
            renderRoadmap();
          }
        } else {
          sessionExercisePasses[chapter.id][exIdx] = false;
          feedbackBox.className = 'fb-feedback is-err';
          feedbackBox.appendChild(
            el(doc, 'p', '', result.correctCount + '/' + result.total + ' benar. Cek bagian merah:')
          );
          if (hints.length > 0) {
            var ul = el(doc, 'ul', 'fb-hint-list');
            hints.forEach(function (h) {
              ul.appendChild(el(doc, 'li', '', h));
            });
            feedbackBox.appendChild(ul);
          }
        }
      });

      resetExBtn.addEventListener('click', function () {
        sessionExercisePasses[chapter.id][exIdx] = false;
        (exercise.blanks || []).forEach(function (b) {
          var field = built.inputByBlankId[b.id];
          if (field) {
            field.value = '';
            field.className = 'fb-input';
          }
        });
        feedbackBox.innerHTML = '';
        feedbackBox.hidden = true;
      });

      fbGroup.appendChild(card);
    });

    container.appendChild(fbGroup);

    // Section B: Debugging Quiz
    var quizGroup = el(doc, 'section', 'latihan-group');
    quizGroup.appendChild(el(doc, 'h2', 'section-heading', '2. Tebak Error'));

    quizzes.forEach(function (quiz, qIdx) {
      var qCard = el(doc, 'div', 'quiz-card');
      qCard.appendChild(el(doc, 'h3', 'quiz-title', (qIdx + 1) + '. ' + quiz.title));

      if (quiz.buggyCode) {
        var buggyPre = el(doc, 'pre', 'quiz-buggy-code');
        buggyPre.appendChild(el(doc, 'code', '', quiz.buggyCode));
        qCard.appendChild(buggyPre);
      }

      qCard.appendChild(el(doc, 'p', 'quiz-question', quiz.question));

      var optionsWrap = el(doc, 'div', 'quiz-options');
      var optionBtns = [];
      var qFeedback = el(doc, 'div', 'quiz-feedback');
      qFeedback.hidden = true;

      (quiz.options || []).forEach(function (optText, optIdx) {
        var optBtn = el(doc, 'button', 'quiz-option-btn', optText);
        optBtn.type = 'button';
        optionBtns.push(optBtn);

        optBtn.addEventListener('click', function () {
          var isRight = optIdx === quiz.answerIndex;
          optionBtns.forEach(function (btn, idx) {
            if (idx === optIdx) {
              btn.className = isRight ? 'quiz-option-btn is-correct' : 'quiz-option-btn is-wrong';
            } else {
              btn.className = 'quiz-option-btn';
            }
          });

          qFeedback.innerHTML = '';
          qFeedback.hidden = false;
          if (isRight) {
            qFeedback.className = 'quiz-feedback is-ok';
            qFeedback.appendChild(el(doc, 'p', '', 'Benar! ' + quiz.explanation));
            sessionQuizPasses[chapter.id][qIdx] = true;

            var allQuizRight = quizzes.every(function (_q, idx) {
              return Boolean(sessionQuizPasses[chapter.id][idx]);
            });
            if (allQuizRight && mods.State) {
              appState = mods.State.markQuizPassed(appState, chapter.id);
              persistState();
              syncQuizBadge();
              renderChapterHeaderAndFooter(chapter);
              renderRoadmap();
            }
          } else {
            sessionQuizPasses[chapter.id][qIdx] = false;
            qFeedback.className = 'quiz-feedback is-err';
            qFeedback.appendChild(el(doc, 'p', '', 'Belum tepat. Cek lagi kodenya.'));
          }
        });

        optionsWrap.appendChild(optBtn);
      });

      qCard.appendChild(optionsWrap);
      qCard.appendChild(qFeedback);
      quizGroup.appendChild(qCard);
    });

    container.appendChild(quizGroup);
  }

  function switchTab(tabName) {
    var allowed = tabName === 'simulator' || tabName === 'latihan' ? tabName : 'materi';
    activeTab = allowed;

    var pairs = [
      { key: 'materi', btn: dom.btnTabMateri, panel: dom.tabMateri },
      { key: 'simulator', btn: dom.btnTabSimulator, panel: dom.tabSimulator },
      { key: 'latihan', btn: dom.btnTabLatihan, panel: dom.tabLatihan },
    ];

    pairs.forEach(function (item) {
      var isActive = item.key === allowed;
      if (item.btn) {
        item.btn.className = isActive ? 'tab-btn is-active' : 'tab-btn';
        item.btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
      if (item.panel) {
        item.panel.hidden = !isActive;
        item.panel.className = isActive ? 'tab-panel is-active' : 'tab-panel';
      }
    });
  }

  function renderCurrentChapter() {
    var mods = getModules();
    if (!mods.DATA) {
      return;
    }
    var chapter = findChapterById(mods.DATA, appState.currentChapterId);
    if (!chapter) {
      return;
    }

    renderChapterHeaderAndFooter(chapter);
    renderMateriTab(chapter);
    renderSimulatorTab(chapter);
    renderLatihanTab(chapter);
    switchTab(activeTab);
    renderRoadmap();
    renderGlobalProgress();
  }

  function selectChapter(chapterId) {
    var mods = getModules();
    if (!mods.DATA || !mods.State) {
      return;
    }
    var target = findChapterById(mods.DATA, Number(chapterId));
    if (!target) {
      return;
    }
    appState = mods.State.setCurrentChapter(appState, target.id);
    activeTab = 'materi';
    persistState();
    renderCurrentChapter();
    if (typeof global.scrollTo === 'function') {
      global.scrollTo(0, 0);
    }
  }

  function renderCheatSheet() {
    var mods = getModules();
    var DATA = mods.DATA;
    var doc = dom.doc;
    if (!DATA || !dom.cheatsheetBody) {
      return;
    }
    dom.cheatsheetBody.innerHTML = '';

    (DATA.CHEAT_SHEET_SECTIONS || []).forEach(function (sec) {
      var card = el(doc, 'article', 'cs-card');
      var head = el(doc, 'div', 'cs-card-head');
      head.appendChild(el(doc, 'h3', 'cs-title', sec.title));
      head.appendChild(el(doc, 'span', 'cs-range', sec.pointRange));
      card.appendChild(head);

      var pre = el(doc, 'pre', 'cs-snippet');
      pre.appendChild(el(doc, 'code', '', sec.snippet));
      card.appendChild(pre);

      if (sec.note) {
        card.appendChild(el(doc, 'p', 'cs-note', sec.note));
      }
      dom.cheatsheetBody.appendChild(card);
    });
  }

  function updateExamProgressText() {
    var mods = getModules();
    var total = mods.DATA && Array.isArray(mods.DATA.EXAM_CHECKLIST) ? mods.DATA.EXAM_CHECKLIST.length : 10;
    var count = appState && Array.isArray(appState.examChecked) ? appState.examChecked.length : 0;
    if (dom.examProgressText) {
      dom.examProgressText.textContent = count + ' / ' + total + ' Poin';
    }
  }

  function updateExamTimerDisplay() {
    var mods = getModules();
    if (!dom.examTimerDisplay || !mods.State) {
      return;
    }
    dom.examTimerDisplay.textContent = mods.State.formatCountdown(examRemainingSeconds);
    if (examRemainingSeconds > 0 && examRemainingSeconds <= 300) {
      dom.examTimerDisplay.className = 'exam-timer-display is-warning';
    } else {
      dom.examTimerDisplay.className = 'exam-timer-display';
    }
  }

  function stopExamInterval() {
    if (examIntervalId !== null) {
      clearInterval(examIntervalId);
      examIntervalId = null;
    }
    examRunning = false;
    examDeadlineMs = 0;
  }

  function syncExamTimerButtons() {
    if (dom.btnExamStart) {
      dom.btnExamStart.textContent = examRunning ? 'Berjalan...' : 'Mulai';
      dom.btnExamStart.disabled = examRunning;
    }
    if (dom.btnExamPause) {
      dom.btnExamPause.disabled = !examRunning;
    }
  }

  function syncExamRemainingFromClock() {
    if (!examRunning || !examDeadlineMs) {
      return;
    }
    examRemainingSeconds = Math.max(0, Math.ceil((examDeadlineMs - Date.now()) / 1000));
    updateExamTimerDisplay();
    if (examRemainingSeconds <= 0) {
      stopExamInterval();
      syncExamTimerButtons();
      if (dom.examStatusBanner) {
        dom.examStatusBanner.hidden = false;
        dom.examStatusBanner.textContent =
          'Waktu habis. Cek kembali proyek terhadap 10 poin checklist.';
      }
    }
  }

  function startExamTimer() {
    if (examRunning) {
      return;
    }
    if (examRemainingSeconds <= 0) {
      var selected = dom.examDurationSelect ? Number(dom.examDurationSelect.value) : 3600;
      examRemainingSeconds = selected > 0 ? selected : 3600;
    }
    if (dom.examStatusBanner) {
      dom.examStatusBanner.hidden = true;
      dom.examStatusBanner.textContent = '';
    }
    examDeadlineMs = Date.now() + examRemainingSeconds * 1000;
    examRunning = true;
    syncExamTimerButtons();
    updateExamTimerDisplay();

    examIntervalId = setInterval(syncExamRemainingFromClock, 1000);
  }

  function pauseExamTimer() {
    if (examRunning) {
      syncExamRemainingFromClock();
    }
    stopExamInterval();
    syncExamTimerButtons();
  }

  function resetExamTimer() {
    stopExamInterval();
    var selected = dom.examDurationSelect ? Number(dom.examDurationSelect.value) : 3600;
    examRemainingSeconds = selected > 0 ? selected : 3600;
    if (dom.examStatusBanner) {
      dom.examStatusBanner.hidden = true;
      dom.examStatusBanner.textContent = '';
    }
    updateExamTimerDisplay();
    syncExamTimerButtons();
  }

  function renderExamChecklist() {
    var mods = getModules();
    var DATA = mods.DATA;
    var doc = dom.doc;
    if (!DATA || !dom.examChecklistBody) {
      return;
    }
    dom.examChecklistBody.innerHTML = '';

    (DATA.EXAM_CHECKLIST || []).forEach(function (item) {
      var isChecked = appState.examChecked.indexOf(item.id) !== -1;
      var card = el(doc, 'div', isChecked ? 'exam-item is-checked' : 'exam-item');
      var row = el(doc, 'div', 'exam-item-row');

      var label = el(doc, 'label', 'exam-item-label');
      var cb = el(doc, 'input', 'exam-checkbox');
      cb.type = 'checkbox';
      cb.checked = isChecked;
      cb.setAttribute('data-exam-id', String(item.id));
      label.appendChild(cb);
      label.appendChild(el(doc, 'span', '', item.label));

      var hintBtn = el(doc, 'button', 'btn-exam-hint', 'Hint');
      hintBtn.type = 'button';
      var hintBox = el(doc, 'div', 'exam-item-hint', item.hint);
      hintBox.hidden = true;

      hintBtn.addEventListener('click', function () {
        var nextHidden = !hintBox.hidden;
        hintBox.hidden = nextHidden;
        hintBtn.textContent = nextHidden ? 'Hint' : 'Tutup';
      });

      cb.addEventListener('change', function () {
        if (!mods.State) {
          return;
        }
        var alreadyInState = appState.examChecked.indexOf(item.id) !== -1;
        if (Boolean(cb.checked) !== alreadyInState) {
          appState = mods.State.toggleExamItem(appState, item.id);
          persistState();
        }
        card.className = cb.checked ? 'exam-item is-checked' : 'exam-item';
        updateExamProgressText();
      });

      row.appendChild(label);
      row.appendChild(hintBtn);
      card.appendChild(row);
      card.appendChild(hintBox);
      dom.examChecklistBody.appendChild(card);
    });

    updateExamProgressText();
  }

  function focusElementSafely(target) {
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  }

  function rememberFocusOrigin(fallbackEl) {
    var doc = dom.doc;
    var active = doc && doc.activeElement ? doc.activeElement : null;
    if ((!active || active === doc.body) && fallbackEl) {
      active = fallbackEl;
    }
    if (active && active !== dom.modalCheatsheet && active !== dom.modalExam) {
      lastFocusedEl = active;
    }
  }

  function restoreFocusOrigin() {
    var target = lastFocusedEl;
    lastFocusedEl = null;
    focusElementSafely(target);
  }

  function closeModal(modalEl) {
    if (!modalEl || modalEl.hidden) {
      return;
    }
    modalEl.hidden = true;
    restoreFocusOrigin();
  }

  function openCheatSheetModal(evt) {
    var switchingFromExam = dom.modalExam && !dom.modalExam.hidden;
    if (switchingFromExam) {
      dom.modalExam.hidden = true;
    } else {
      rememberFocusOrigin((evt && evt.currentTarget) || dom.btnOpenCheatsheet);
    }
    renderCheatSheet();
    if (dom.modalCheatsheet) {
      dom.modalCheatsheet.hidden = false;
      focusElementSafely(dom.btnCloseCheatsheet || dom.modalCheatsheet);
    }
  }

  function closeCheatSheetModal() {
    closeModal(dom.modalCheatsheet);
  }

  function openExamModal(evt) {
    var switchingFromCheat = dom.modalCheatsheet && !dom.modalCheatsheet.hidden;
    if (switchingFromCheat) {
      dom.modalCheatsheet.hidden = true;
    } else {
      rememberFocusOrigin((evt && evt.currentTarget) || dom.btnOpenExam);
    }
    renderExamChecklist();
    updateExamTimerDisplay();
    syncExamTimerButtons();
    if (dom.modalExam) {
      dom.modalExam.hidden = false;
      focusElementSafely(dom.btnCloseExam || dom.modalExam);
    }
  }

  function closeExamModal() {
    closeModal(dom.modalExam);
  }

  function bindGlobalEvents() {
    var doc = dom.doc;
    var mods = getModules();

    if (dom.btnToggleSidebar) {
      dom.btnToggleSidebar.addEventListener('click', function () {
        toggleMobileSidebar();
      });
    }

    if (dom.sidebarBackdrop) {
      dom.sidebarBackdrop.addEventListener('click', function () {
        toggleMobileSidebar(false);
      });
    }

    if (dom.btnTabMateri) {
      dom.btnTabMateri.addEventListener('click', function () {
        switchTab('materi');
      });
    }
    if (dom.btnTabSimulator) {
      dom.btnTabSimulator.addEventListener('click', function () {
        switchTab('simulator');
      });
    }
    if (dom.btnTabLatihan) {
      dom.btnTabLatihan.addEventListener('click', function () {
        switchTab('latihan');
      });
    }

    if (dom.btnPrevChapter) {
      dom.btnPrevChapter.addEventListener('click', function () {
        if (appState.currentChapterId > 1) {
          selectChapter(appState.currentChapterId - 1);
        }
      });
    }

    if (dom.btnNextChapter) {
      dom.btnNextChapter.addEventListener('click', function () {
        var total = mods.DATA ? mods.DATA.CHAPTERS.length : 10;
        if (appState.currentChapterId < total) {
          selectChapter(appState.currentChapterId + 1);
        }
      });
    }

    if (dom.btnToggleComplete) {
      dom.btnToggleComplete.addEventListener('click', function () {
        if (!mods.State || !mods.DATA) {
          return;
        }
        appState = mods.State.toggleChapterComplete(appState, appState.currentChapterId);
        persistState();
        var chapter = findChapterById(mods.DATA, appState.currentChapterId);
        if (chapter) {
          renderChapterHeaderAndFooter(chapter);
        }
        renderRoadmap();
        renderGlobalProgress();
      });
    }

    if (dom.btnOpenCheatsheet) {
      dom.btnOpenCheatsheet.addEventListener('click', openCheatSheetModal);
    }
    if (dom.btnCloseCheatsheet) {
      dom.btnCloseCheatsheet.addEventListener('click', closeCheatSheetModal);
    }
    if (dom.btnPrintCheatsheet) {
      dom.btnPrintCheatsheet.addEventListener('click', function () {
        if (typeof global.print === 'function') {
          global.print();
        }
      });
    }
    if (dom.modalCheatsheet) {
      dom.modalCheatsheet.addEventListener('click', function (evt) {
        if (evt && evt.target === dom.modalCheatsheet) {
          closeCheatSheetModal();
        }
      });
    }

    if (dom.btnOpenExam) {
      dom.btnOpenExam.addEventListener('click', openExamModal);
    }
    if (dom.btnCloseExam) {
      dom.btnCloseExam.addEventListener('click', closeExamModal);
    }
    if (dom.modalExam) {
      dom.modalExam.addEventListener('click', function (evt) {
        if (evt && evt.target === dom.modalExam) {
          closeExamModal();
        }
      });
    }

    if (dom.examDurationSelect) {
      dom.examDurationSelect.addEventListener('change', resetExamTimer);
    }
    if (dom.btnExamStart) {
      dom.btnExamStart.addEventListener('click', startExamTimer);
    }
    if (dom.btnExamPause) {
      dom.btnExamPause.addEventListener('click', pauseExamTimer);
    }
    if (dom.btnExamReset) {
      dom.btnExamReset.addEventListener('click', resetExamTimer);
    }

    if (dom.btnResetProgress) {
      dom.btnResetProgress.addEventListener('click', function () {
        if (dom.resetConfirmBanner) {
          dom.resetConfirmBanner.hidden = false;
        }
      });
    }
    if (dom.btnCancelReset) {
      dom.btnCancelReset.addEventListener('click', function () {
        if (dom.resetConfirmBanner) {
          dom.resetConfirmBanner.hidden = true;
        }
      });
    }
    if (dom.btnConfirmReset) {
      dom.btnConfirmReset.addEventListener('click', function () {
        if (!mods.State) {
          return;
        }
        appState = mods.State.createDefaultState();
        sessionExercisePasses = Object.create(null);
        sessionQuizPasses = Object.create(null);
        activeTab = 'materi';
        persistState();
        if (dom.resetConfirmBanner) {
          dom.resetConfirmBanner.hidden = true;
        }
        renderCurrentChapter();
        renderExamChecklist();
      });
    }

    doc.addEventListener('visibilitychange', function () {
      if (examRunning) {
        syncExamRemainingFromClock();
      }
    });

    doc.addEventListener('keydown', function (evt) {
      if (!evt || evt.key !== 'Escape') {
        return;
      }
      if (dom.modalCheatsheet && !dom.modalCheatsheet.hidden) {
        closeCheatSheetModal();
      }
      if (dom.modalExam && !dom.modalExam.hidden) {
        closeExamModal();
      }
      if (dom.resetConfirmBanner && !dom.resetConfirmBanner.hidden) {
        dom.resetConfirmBanner.hidden = true;
      }
      toggleMobileSidebar(false);
    });
  }

  function cacheDom(doc) {
    dom = {
      doc: doc,
      sidebar: doc.getElementById('app-sidebar'),
      sidebarBackdrop: doc.getElementById('sidebar-backdrop'),
      btnToggleSidebar: doc.getElementById('btn-toggle-sidebar'),
      roadmapNav: doc.getElementById('roadmap-nav'),
      globalProgressBar: doc.getElementById('global-progress-bar'),
      globalProgressText: doc.getElementById('global-progress-text'),
      btnOpenCheatsheet: doc.getElementById('btn-open-cheatsheet'),
      btnOpenExam: doc.getElementById('btn-open-exam'),
      btnResetProgress: doc.getElementById('btn-reset-progress'),
      resetConfirmBanner: doc.getElementById('reset-confirm-banner'),
      btnConfirmReset: doc.getElementById('btn-confirm-reset'),
      btnCancelReset: doc.getElementById('btn-cancel-reset'),
      chapterContainer: doc.getElementById('chapter-container'),
      chapterPhaseBadge: doc.getElementById('chapter-phase-badge'),
      chapterTargetFile: doc.getElementById('chapter-target-file'),
      chapterSkemaRef: doc.getElementById('chapter-skema-ref'),
      chapterTitle: doc.getElementById('chapter-title'),
      chapterStatusPills: doc.getElementById('chapter-status-pills'),
      btnTabMateri: doc.getElementById('btn-tab-materi'),
      btnTabSimulator: doc.getElementById('btn-tab-simulator'),
      btnTabLatihan: doc.getElementById('btn-tab-latihan'),
      tabMateri: doc.getElementById('tab-materi'),
      tabSimulator: doc.getElementById('tab-simulator'),
      tabLatihan: doc.getElementById('tab-latihan'),
      btnPrevChapter: doc.getElementById('btn-prev-chapter'),
      btnToggleComplete: doc.getElementById('btn-toggle-complete'),
      btnNextChapter: doc.getElementById('btn-next-chapter'),
      modalCheatsheet: doc.getElementById('modal-cheatsheet'),
      cheatsheetBody: doc.getElementById('cheatsheet-body'),
      btnPrintCheatsheet: doc.getElementById('btn-print-cheatsheet'),
      btnCloseCheatsheet: doc.getElementById('btn-close-cheatsheet'),
      modalExam: doc.getElementById('modal-exam'),
      btnCloseExam: doc.getElementById('btn-close-exam'),
      examDurationSelect: doc.getElementById('exam-duration-select'),
      examTimerDisplay: doc.getElementById('exam-timer-display'),
      btnExamStart: doc.getElementById('btn-exam-start'),
      btnExamPause: doc.getElementById('btn-exam-pause'),
      btnExamReset: doc.getElementById('btn-exam-reset'),
      examProgressText: doc.getElementById('exam-progress-text'),
      examStatusBanner: doc.getElementById('exam-status-banner'),
      examChecklistBody: doc.getElementById('exam-checklist-body'),
    };
  }

  function init() {
    if (initialized) {
      return;
    }
    var doc = global.document;
    var mods = getModules();
    if (!doc || !mods.DATA || !mods.State) {
      return;
    }

    initialized = true;
    cacheDom(doc);
    appState = mods.State.loadState(getSafeStorage());

    var selectedDuration = dom.examDurationSelect ? Number(dom.examDurationSelect.value) : 3600;
    examRemainingSeconds = selectedDuration > 0 ? selectedDuration : 3600;

    bindGlobalEvents();
    renderCurrentChapter();
    renderCheatSheet();
    renderExamChecklist();
    updateExamTimerDisplay();
    syncExamTimerButtons();
  }

  global.ModulCRUD = global.ModulCRUD || {};
  global.ModulCRUD.App = {
    init: init,
    selectChapter: selectChapter,
    switchTab: switchTab,
    getState: function () {
      return appState;
    },
  };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', init);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);

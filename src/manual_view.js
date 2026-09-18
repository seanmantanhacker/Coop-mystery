/* ==========================================================================
   OPERATION: ZERO HOUR - MANUAL SPECIALIST: SHELL & VIEW CONTROLLER
   Delegates map-specific tabs, pages, and pinboard content to active map renderer.
   ========================================================================== */

class ManualViewEngine {
  constructor() {
    this.scenario = 'silo44';
    this.currentView = 'DESK_OVERVIEW';
    this.currentPage = 0;
    this.totalPages = 5;

    // Keyboard shortcut: Escape returns to Desk Overview
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (this.currentView !== 'DESK_OVERVIEW') {
          this.setView('DESK_OVERVIEW');
        }
      }
    });
  }

  getRenderer() {
    if (window.ESCAPE_MAPS && window.ESCAPE_MAPS[this.scenario]) {
      return window.ESCAPE_MAPS[this.scenario].getManualRenderer();
    }
    return (this.scenario === 'silo44') ? window.Silo44ManualView : window.AlchemistManualView;
  }

  init(scenario = 'silo44') {
    this.scenario = scenario;
    const renderer = this.getRenderer();
    this.totalPages = renderer ? renderer.totalPages : 5;
    this.currentPage = 0;
    this.renderTabs();
    this.renderPage(0);
    this.setView('DESK_OVERVIEW');
  }

  setScenario(scenario) {
    this.scenario = scenario;
    const renderer = this.getRenderer();
    this.totalPages = renderer ? renderer.totalPages : 5;
    this.currentPage = 0;
    this.renderTabs();
    this.renderPage(0);
  }

  setView(viewMode) {
    this.currentView = viewMode;
    if (window.audio) window.audio.playZoom();

    const deskRoom = document.getElementById('manual-desk-room');
    const binderInspect = document.getElementById('manual-binder-inspect');
    const boardInspect = document.getElementById('manual-board-inspect');
    const backBtn = document.getElementById('manual-back-btn');

    if (viewMode === 'DESK_OVERVIEW') {
      if (deskRoom) deskRoom.classList.remove('hidden');
      if (binderInspect) binderInspect.classList.add('hidden');
      if (boardInspect) boardInspect.classList.add('hidden');
      if (backBtn) backBtn.classList.add('hidden');
    } else if (viewMode === 'INSPECT_BINDER') {
      if (deskRoom) deskRoom.classList.add('hidden');
      if (binderInspect) binderInspect.classList.remove('hidden');
      if (boardInspect) boardInspect.classList.add('hidden');
      if (backBtn) backBtn.classList.remove('hidden');
    } else if (viewMode === 'INSPECT_BOARD') {
      if (deskRoom) deskRoom.classList.add('hidden');
      if (binderInspect) binderInspect.classList.add('hidden');
      if (boardInspect) boardInspect.classList.remove('hidden');
      if (backBtn) backBtn.classList.remove('hidden');
      this.renderBoard();
    }
  }

  flipPage(direction) {
    const next = this.currentPage + direction;
    if (next >= 0 && next < this.totalPages) {
      this.currentPage = next;
      if (window.audio) window.audio.playPageTurn();
      this.renderPage(this.currentPage);
    }
  }

  goToSection(pageIdx) {
    if (pageIdx >= 0 && pageIdx < this.totalPages) {
      this.currentPage = pageIdx;
      if (window.audio) window.audio.playPageTurn();
      this.renderPage(this.currentPage);
    }
  }

  renderTabs() {
    const tabContainer = document.querySelector('.binder-tabs');
    if (!tabContainer) return;
    const renderer = this.getRenderer();
    if (renderer && renderer.renderTabs) {
      renderer.renderTabs(tabContainer);
    }
  }

  renderPage(pageIdx) {
    const pageContent = document.getElementById('binder-page-body');
    const pageNumber = document.getElementById('binder-page-num');
    if (!pageContent) return;

    if (pageNumber) {
      pageNumber.innerText = `PAGE ${pageIdx + 1} OF ${this.totalPages}`;
    }

    document.querySelectorAll('.binder-tab-btn:not(.binder-close-btn)').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === pageIdx);
    });

    const renderer = this.getRenderer();
    if (renderer && renderer.renderPage) {
      renderer.renderPage(pageIdx, pageContent);
    }
  }

  renderBoard() {
    const boardContent = document.getElementById('manual-board-content');
    if (!boardContent) return;
    const renderer = this.getRenderer();
    if (renderer && renderer.renderBoard) {
      renderer.renderBoard(boardContent);
    }
  }
}

const manualView = new ManualViewEngine();
window.manualView = manualView;

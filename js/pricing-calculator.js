(function () {
  'use strict';

  var COST_PER_BRANCH = 100;
  var STAFF_PER_BRANCH = 5;
  var STAFF_EXTRA_COST = 10;
  var MAX_PER_BRANCH_LOCATIONS = 50;

  var form;
  var els = {};
  var perBranchListEl;
  var staffGroupAvg;
  var staffGroupPer;
  var helpPerMode;
  var modeAvgRadio;
  var modePerRadio;

  function formatGHS(n) {
    var rounded = Math.round(n);
    return 'GHS ' + rounded.toLocaleString('en-GH');
  }

  function parsePositiveInt(value, min, max) {
    var s = String(value).trim();
    if (s === '') return NaN;
    var n = parseInt(s.replace(/\s/g, ''), 10);
    if (isNaN(n)) return NaN;
    if (n < 0) return NaN;
    if (n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
  }

  function getStaffEntryMode() {
    var r = form.querySelector('input[name="staffEntryMode"]:checked');
    return r ? r.value : 'avg';
  }

  function compute(branches, actualBranchStaff) {
    var baseBranchCost = branches * COST_PER_BRANCH;
    var coveredStaff = branches * STAFF_PER_BRANCH;
    var extraBranchStaff = Math.max(0, actualBranchStaff - coveredStaff);
    var extraBranchStaffCost = extraBranchStaff * STAFF_EXTRA_COST;
    var totalBranchCost = baseBranchCost + extraBranchStaffCost;

    var finalMonthly = totalBranchCost;

    return {
      baseBranchCost: baseBranchCost,
      extraBranchStaff: extraBranchStaff,
      extraBranchStaffCost: extraBranchStaffCost,
      totalBranchCost: totalBranchCost,
      finalMonthly: finalMonthly,
      totalStaff: actualBranchStaff,
      coveredStaff: coveredStaff,
      actualBranchStaff: actualBranchStaff
    };
  }

  function showFieldError(input, message) {
    if (!input) return;
    input.setCustomValidity(message || '');
    input.classList.toggle('is-invalid', !!message);
    var fg = input.closest('.form-group');
    var feedback = fg ? fg.querySelector('.invalid-feedback') : null;
    if (feedback) feedback.textContent = message || '';
  }

  function clearPerBranchErrors() {
    if (!perBranchListEl) return;
    var inputs = perBranchListEl.querySelectorAll('input[data-per-branch]');
    for (var i = 0; i < inputs.length; i++) {
      showFieldError(inputs[i], '');
    }
  }

  function getPerBranchValuesSnapshot() {
    var inputs = perBranchListEl.querySelectorAll('input[data-per-branch]');
    var out = [];
    for (var i = 0; i < inputs.length; i++) {
      out.push(inputs[i].value);
    }
    return out;
  }

  function buildPerBranchInputs(branchCount, previousValues) {
    if (!perBranchListEl) return;
    var prev = previousValues || [];
    perBranchListEl.innerHTML = '';
    for (var i = 0; i < branchCount; i++) {
      var row = document.createElement('div');
      row.className = 'pc-per-branch-row';
      var lab = document.createElement('label');
      lab.setAttribute('for', 'per-branch-' + i);
      lab.textContent = 'Location ' + (i + 1);
      var inp = document.createElement('input');
      inp.type = 'number';
      inp.id = 'per-branch-' + i;
      inp.className = 'form-control pc-form-control';
      inp.min = '0';
      inp.max = '100000';
      inp.step = '1';
      inp.setAttribute('data-per-branch', '1');
      inp.setAttribute('inputmode', 'numeric');
      if (prev[i] !== undefined && prev[i] !== '') {
        inp.value = prev[i];
      } else {
        inp.value = '0';
      }
      row.appendChild(lab);
      row.appendChild(inp);
      perBranchListEl.appendChild(row);
    }
  }

  function updatePerBranchFieldCount(branchCount) {
    var mode = getStaffEntryMode();
    if (mode !== 'per') return;
    if (branchCount > MAX_PER_BRANCH_LOCATIONS) return;
    var prev = getPerBranchValuesSnapshot();
    while (prev.length < branchCount) {
      prev.push('0');
    }
    if (prev.length > branchCount) {
      prev = prev.slice(0, branchCount);
    }
    buildPerBranchInputs(branchCount, prev);
  }

  function updateStaffModeAvailability() {
    var branches = parsePositiveInt(String(els.branches.value).trim(), 0, 100000);
    if (isNaN(branches)) branches = 0;

    if (modePerRadio) {
      modePerRadio.disabled = branches > MAX_PER_BRANCH_LOCATIONS;
    }
    if (helpPerMode) {
      helpPerMode.classList.toggle('d-none', branches <= MAX_PER_BRANCH_LOCATIONS);
    }

    if (branches > MAX_PER_BRANCH_LOCATIONS && getStaffEntryMode() === 'per') {
      if (modeAvgRadio) modeAvgRadio.checked = true;
      staffGroupAvg.classList.remove('d-none');
      staffGroupPer.classList.add('d-none');
    }
  }

  function syncModeVisibility() {
    var mode = getStaffEntryMode();
    if (mode === 'avg') {
      staffGroupAvg.classList.remove('d-none');
      staffGroupPer.classList.add('d-none');
    } else {
      staffGroupAvg.classList.add('d-none');
      staffGroupPer.classList.remove('d-none');
      updatePerBranchFieldCount(parsePositiveInt(String(els.branches.value).trim(), 0, 100000) || 0);
    }
  }

  function sumPerBranchStaff(skipEmptyCheck) {
    var inputs = perBranchListEl.querySelectorAll('input[data-per-branch]');
    var total = 0;
    for (var i = 0; i < inputs.length; i++) {
      var raw = String(inputs[i].value).trim();
      if (raw === '') {
        if (skipEmptyCheck) return NaN;
        continue;
      }
      var n = parsePositiveInt(raw, 0, 100000);
      if (isNaN(n)) return NaN;
      total += n;
    }
    return total;
  }

  function validateAndRead(skipCoerce) {
    var bRaw = String(els.branches.value).trim();
    var branches = parsePositiveInt(bRaw, 0, 100000);

    showFieldError(els.branches, '');
    showFieldError(els.avgStaff, '');
    clearPerBranchErrors();

    if (isNaN(branches)) {
      if (!skipCoerce) showFieldError(els.branches, 'Enter a valid number.');
      return null;
    }

    var mode = getStaffEntryMode();
    var actualBranchStaff = 0;

    if (mode === 'avg') {
      var aRaw = String(els.avgStaff.value).trim();
      if (skipCoerce && aRaw === '') {
        return null;
      }
      var avgStaff = parsePositiveInt(aRaw, 0, 100000);
      if (isNaN(avgStaff)) {
        if (!skipCoerce) showFieldError(els.avgStaff, 'Enter a valid number.');
        return null;
      }
      actualBranchStaff = branches * avgStaff;
      if (!skipCoerce) {
        els.branches.value = branches;
        els.avgStaff.value = avgStaff;
      }
    } else {
      if (branches > MAX_PER_BRANCH_LOCATIONS) {
        if (!skipCoerce) {
          showFieldError(els.branches, 'For more than ' + MAX_PER_BRANCH_LOCATIONS + ' locations, use average staff mode.');
        }
        return null;
      }

      if (perBranchListEl.querySelectorAll('input[data-per-branch]').length !== branches) {
        updatePerBranchFieldCount(branches);
      }

      var inputs = perBranchListEl.querySelectorAll('input[data-per-branch]');
      if (inputs.length !== branches) {
        return null;
      }

      for (var j = 0; j < inputs.length; j++) {
        var r = String(inputs[j].value).trim();
        if (r === '') {
          if (skipCoerce) return null;
          showFieldError(inputs[j], 'Enter a number for each location.');
          return null;
        }
      }

      var sum = sumPerBranchStaff(false);
      if (isNaN(sum)) {
        if (!skipCoerce) {
          for (var k = 0; k < inputs.length; k++) {
            var pr = String(inputs[k].value).trim();
            if (pr !== '' && isNaN(parsePositiveInt(pr, 0, 100000))) {
              showFieldError(inputs[k], 'Enter a valid number.');
              break;
            }
          }
        }
        return null;
      }
      actualBranchStaff = sum;
      if (!skipCoerce) {
        els.branches.value = branches;
      }
    }

    return { branches: branches, actualBranchStaff: actualBranchStaff, mode: mode };
  }

  function render(r) {
    els.summaryBranches.textContent = String(r.branches);
    els.summaryStaff.textContent = String(r.totalStaff);
    els.summaryPrice.textContent = formatGHS(r.finalMonthly);

    els.lineBaseBranch.textContent = formatGHS(r.baseBranchCost);
    els.lineExtraBranch.textContent = formatGHS(r.extraBranchStaffCost);
    els.lineExtraBranchDetail.textContent =
      r.extraBranchStaff > 0
        ? '(' + r.extraBranchStaff + ' additional staff × ' + formatGHS(STAFF_EXTRA_COST) + ')'
        : 'No additional staff beyond included allowance per office or branch';

    els.lineTotal.textContent = formatGHS(r.finalMonthly);

    els.pdfBranches.textContent = String(r.branches);
    els.pdfStaff.textContent = String(r.totalStaff);
    els.pdfTotal.textContent = formatGHS(r.finalMonthly);
    els.pdfBaseBranch.textContent = formatGHS(r.baseBranchCost);
    els.pdfExtraBranch.textContent = formatGHS(r.extraBranchStaffCost);
    els.pdfDate.textContent = new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function run(fromInput) {
    var v = validateAndRead(!!fromInput);
    if (!v) {
      return;
    }
    var inputs = compute(v.branches, v.actualBranchStaff);
    var out = Object.assign({ branches: v.branches }, inputs);
    render(out);
  }

  function onStaffModeChange() {
    var mode = getStaffEntryMode();
    var branches = parsePositiveInt(String(els.branches.value).trim(), 0, 100000);
    if (isNaN(branches)) branches = 0;

    if (mode === 'per') {
      if (branches > MAX_PER_BRANCH_LOCATIONS) {
        modeAvgRadio.checked = true;
        syncModeVisibility();
        return;
      }
      var avg = parsePositiveInt(String(els.avgStaff.value).trim(), 0, 100000);
      if (isNaN(avg)) avg = 0;
      var seeds = [];
      for (var i = 0; i < branches; i++) {
        seeds.push(String(avg));
      }
      buildPerBranchInputs(branches, seeds);
      staffGroupAvg.classList.add('d-none');
      staffGroupPer.classList.remove('d-none');
    } else {
      if (branches > 0 && perBranchListEl.querySelectorAll('input[data-per-branch]').length === branches) {
        var total = sumPerBranchStaff(true);
        if (!isNaN(total)) {
          els.avgStaff.value = Math.round(total / branches);
        }
      }
      staffGroupAvg.classList.remove('d-none');
      staffGroupPer.classList.add('d-none');
    }
    run(false);
  }

  function onBranchesChange() {
    updateStaffModeAvailability();
    if (getStaffEntryMode() === 'per') {
      var branches = parsePositiveInt(String(els.branches.value).trim(), 0, 100000);
      if (!isNaN(branches) && branches <= MAX_PER_BRANCH_LOCATIONS) {
        updatePerBranchFieldCount(branches);
      }
    }
    run(true);
  }

  function downloadPdf() {
    var v = validateAndRead(false);
    if (!v) {
      var inv = form.querySelector('.is-invalid');
      if (inv) inv.focus();
      return;
    }
    run(false);

    if (typeof html2pdf === 'undefined') {
      window.print();
      return;
    }

    var source = document.getElementById('quote-print-area');
    var clone = source.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('aria-hidden');
    clone.classList.remove('pc-pdf-source', 'pc-print-area');
    clone.classList.add('pc-pdf-capture-root');

    clone.style.cssText = [
      'position:fixed',
      'left:0',
      'top:0',
      'z-index:2147483647',
      'width:794px',
      'max-width:calc(100vw - 32px)',
      'max-height:calc(100vh - 32px)',
      'overflow:auto',
      'box-sizing:border-box',
      'padding:40px 48px',
      'margin:16px',
      'background:#ffffff',
      'color:#222222',
      '-webkit-font-smoothing:antialiased',
      'box-shadow:0 0 0 1px rgba(0,0,0,0.06)'
    ].join(';');

    document.body.appendChild(clone);

    var opt = {
      margin: [10, 10, 10, 10],
      filename: 'VeriTrack-Systems-Pricing-Quote.pdf',
      image: { type: 'jpeg', quality: 0.92 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    function cleanup() {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }

    function runCapture() {
      if (clone.offsetHeight < 8 || clone.offsetWidth < 8) {
        cleanup();
        window.print();
        return;
      }

      var p = html2pdf()
        .set(opt)
        .from(clone)
        .save();

      if (p && typeof p.then === 'function') {
        p.then(cleanup).catch(function () {
          cleanup();
          window.print();
        });
      } else {
        setTimeout(cleanup, 3000);
      }
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(runCapture, 80);
      });
    });
  }

  function init() {
    form = document.getElementById('pricing-calculator-form');
    if (!form) return;

    els.branches = document.getElementById('input-branches');
    els.avgStaff = document.getElementById('input-avg-staff');

    perBranchListEl = document.getElementById('per-branch-staff-list');
    staffGroupAvg = document.getElementById('staff-group-avg');
    staffGroupPer = document.getElementById('staff-group-per');
    helpPerMode = document.getElementById('help-per-mode');
    modeAvgRadio = document.getElementById('mode-avg');
    modePerRadio = document.getElementById('mode-per');

    els.summaryBranches = document.getElementById('summary-branches');
    els.summaryStaff = document.getElementById('summary-staff');
    els.summaryPrice = document.getElementById('summary-price');

    els.lineBaseBranch = document.getElementById('line-base-branch');
    els.lineExtraBranch = document.getElementById('line-extra-branch');
    els.lineExtraBranchDetail = document.getElementById('line-extra-branch-detail');
    els.lineTotal = document.getElementById('line-total');

    els.pdfBranches = document.getElementById('pdf-branches');
    els.pdfStaff = document.getElementById('pdf-staff');
    els.pdfTotal = document.getElementById('pdf-total');
    els.pdfBaseBranch = document.getElementById('pdf-base-branch');
    els.pdfExtraBranch = document.getElementById('pdf-extra-branch');
    els.pdfDate = document.getElementById('pdf-date');

    form.querySelectorAll('input[name="staffEntryMode"]').forEach(function (radio) {
      radio.addEventListener('change', onStaffModeChange);
    });

    els.branches.addEventListener('input', onBranchesChange);
    els.branches.addEventListener('change', onBranchesChange);

    document.getElementById('btn-calculate').addEventListener('click', function (e) {
      e.preventDefault();
      run(false);
    });

    document.getElementById('btn-download-pdf').addEventListener('click', function (e) {
      e.preventDefault();
      downloadPdf();
    });

    form.addEventListener('input', function (e) {
      if (!e.target) return;
      if (e.target === els.branches) return;
      run(true);
    });

    updateStaffModeAvailability();
    syncModeVisibility();
    run(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

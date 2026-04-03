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

  function getBillingPeriod() {
    var r = form.querySelector('input[name="billingPeriod"]:checked');
    return r ? r.value : 'monthly';
  }

  /**
   * Long-term prepay pricing vs paying the monthly rate each month:
   * - Quarterly: pay 2.5 months (save ½ month vs 3× monthly)
   * - Semi-annual: pay 5 months (save 1 month vs 6× monthly)
   * - Annual: pay 10 months (save 2 months vs 12× monthly)
   */
  function computeBillingPeriod(monthlyFee, period) {
    var M = monthlyFee;
    var key = period || 'monthly';
    var months = 1;
    var fullRollup = M;
    var prepaid = M;

    if (key === 'quarterly') {
      months = 3;
      fullRollup = M * 3;
      prepaid = M * 2.5;
    } else if (key === 'semi') {
      months = 6;
      fullRollup = M * 6;
      prepaid = M * 5;
    } else if (key === 'annual') {
      months = 12;
      fullRollup = M * 12;
      prepaid = M * 10;
    }

    var savings = Math.round(fullRollup - prepaid);
    var prepaidRounded = Math.round(prepaid);
    var effectiveMonthly = months > 0 ? prepaidRounded / months : 0;

    var meta = {
      monthly: {
        name: 'Monthly',
        detail: 'Pay each month — standard monthly rate',
        summaryLabel: 'Amount due (monthly)'
      },
      quarterly: {
        name: 'Quarterly',
        detail: 'Prepay 3 months at 2.5× monthly (save ½ month vs 3 separate months)',
        summaryLabel: 'Amount due (quarterly)'
      },
      semi: {
        name: 'Semi-annual',
        detail: 'Prepay 6 months at 5× monthly (save 1 month vs 6 separate months)',
        summaryLabel: 'Amount due (semi-annual)'
      },
      annual: {
        name: 'Annual',
        detail: 'Prepay 12 months at 10× monthly (save 2 months vs 12 separate months)',
        summaryLabel: 'Amount due (annual)'
      }
    };

    var m = meta[key] || meta.monthly;

    return {
      periodKey: key,
      periodName: m.name,
      periodDetail: m.detail,
      summaryLabel: m.summaryLabel,
      monthsCovered: months,
      fullRollup: Math.round(fullRollup),
      prepaidTotal: prepaidRounded,
      savings: savings,
      effectiveMonthly: Math.round(effectiveMonthly)
    };
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
    var bill = r.billing;

    els.summaryBranches.textContent = String(r.branches);
    els.summaryStaff.textContent = String(r.totalStaff);
    els.summaryPeriodLabel.textContent = bill.summaryLabel;
    els.summaryPrice.textContent = formatGHS(bill.prepaidTotal);
    if (bill.savings > 0) {
      els.summarySavings.textContent = 'Save ' + formatGHS(bill.savings) + ' vs paying month-by-month for this period';
      els.summarySavings.classList.remove('d-none');
    } else {
      els.summarySavings.textContent = '';
      els.summarySavings.classList.add('d-none');
    }

    els.lineBaseBranch.textContent = formatGHS(r.baseBranchCost);
    els.lineExtraBranch.textContent = formatGHS(r.extraBranchStaffCost);
    els.lineExtraBranchDetail.textContent =
      r.extraBranchStaff > 0
        ? '(' + r.extraBranchStaff + ' additional staff × ' + formatGHS(STAFF_EXTRA_COST) + ')'
        : 'No additional staff beyond included allowance per office or branch';

    els.lineMonthlyBase.textContent = formatGHS(r.finalMonthly);
    els.lineBillingName.textContent = bill.periodName;
    els.lineBillingDetail.textContent = bill.periodDetail;
    els.lineSavingsAmount.textContent = formatGHS(bill.savings);
    els.lineSavingsDetail.textContent =
      bill.savings > 0
        ? 'Compared to ' + bill.monthsCovered + ' × ' + formatGHS(r.finalMonthly) + ' if billed monthly'
        : 'No prepayment discount on monthly billing';
    els.lineEffectiveMonthly.textContent = formatGHS(bill.effectiveMonthly);
    els.lineEffectiveDetail.textContent =
      bill.periodKey === 'monthly'
        ? 'Same as base when billed monthly'
        : 'Prepayment ÷ ' + bill.monthsCovered + ' months';

    if (els.rowSavings) {
      els.rowSavings.classList.toggle('pc-breakdown-row--savings', bill.savings > 0);
    }

    els.lineTotal.textContent = formatGHS(bill.prepaidTotal);

    els.pdfBranches.textContent = String(r.branches);
    els.pdfStaff.textContent = String(r.totalStaff);
    els.pdfTotal.textContent = formatGHS(bill.prepaidTotal);
    els.pdfBaseBranch.textContent = formatGHS(r.baseBranchCost);
    els.pdfExtraBranch.textContent = formatGHS(r.extraBranchStaffCost);
    els.pdfMonthlyBase.textContent = formatGHS(r.finalMonthly);
    els.pdfBillingPeriod.textContent = bill.periodName;
    els.pdfSavings.textContent = formatGHS(bill.savings);
    els.pdfEffective.textContent = formatGHS(bill.effectiveMonthly);
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
    var billing = computeBillingPeriod(inputs.finalMonthly, getBillingPeriod());
    var out = Object.assign({ branches: v.branches, billing: billing }, inputs);
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

    var JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF && typeof window.jsPDF === 'function') {
      JsPDF = window.jsPDF;
    }
    if (!JsPDF) {
      window.print();
      return;
    }

    function pdfVal(id) {
      var el = document.getElementById(id);
      return el ? String(el.textContent || '').trim() : '';
    }

    var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var pageW = doc.internal.pageSize.getWidth();
    var margin = 18;
    var rightX = pageW - margin;
    var y = 20;
    var lineH = 6.8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 60, 114);
    doc.text('VeriTrack Systems', margin, y);
    y += 9;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);
    doc.text('Subscription pricing quote', margin, y);
    y += 10;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated ' + pdfVal('pdf-date'), margin, y);
    y += 11;

    doc.setDrawColor(210, 220, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, rightX, y);
    y += 9;

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);

    var tableRows = [
      ['Offices / branches', pdfVal('pdf-branches')],
      ['Total staff', pdfVal('pdf-staff')],
      ['Base office / branch cost', pdfVal('pdf-base-branch')],
      ['Additional staff (offices / branches)', pdfVal('pdf-extra-branch')],
      ['Monthly subscription (base)', pdfVal('pdf-monthly-base')],
      ['Billing period', pdfVal('pdf-billing-period')],
      ['Savings vs monthly billing', pdfVal('pdf-savings')],
      ['Effective monthly', pdfVal('pdf-effective')]
    ];

    for (var i = 0; i < tableRows.length; i++) {
      doc.setFont('helvetica', 'normal');
      doc.text(tableRows[i][0], margin, y);
      doc.text(tableRows[i][1], rightX, y, { align: 'right' });
      y += lineH;
    }

    y += 5;
    doc.line(margin, y, rightX, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 60, 114);
    doc.text('Amount due (selected period)', margin, y);
    doc.text(pdfVal('pdf-total'), rightX, y, { align: 'right' });
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    var foot =
      'Estimate only. Final pricing is subject to agreement with VeriTrack Systems.';
    var footLines = doc.splitTextToSize(foot, pageW - 2 * margin);
    var wrapLine = 3.6;
    for (var fi = 0; fi < footLines.length; fi++) {
      doc.text(footLines[fi], margin, y + fi * wrapLine);
    }
    y += footLines.length * wrapLine + 6;

    doc.setTextColor(75, 85, 95);
    var baselineRef =
      'Baseline reference: GHS 400 covers 4 branches and 20 staff; GHS 100 per office or branch; 5 staff included per location; GHS 10 per additional staff.';
    var baseLines = doc.splitTextToSize(baselineRef, pageW - 2 * margin);
    for (var bi = 0; bi < baseLines.length; bi++) {
      doc.text(baseLines[bi], margin, y + bi * wrapLine);
    }

    doc.save('VeriTrack-Systems-Pricing-Quote.pdf');
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
    els.summaryPeriodLabel = document.getElementById('summary-period-label');
    els.summaryPrice = document.getElementById('summary-price');
    els.summarySavings = document.getElementById('summary-savings');

    els.lineBaseBranch = document.getElementById('line-base-branch');
    els.lineExtraBranch = document.getElementById('line-extra-branch');
    els.lineExtraBranchDetail = document.getElementById('line-extra-branch-detail');
    els.lineMonthlyBase = document.getElementById('line-monthly-base');
    els.lineBillingName = document.getElementById('line-billing-name');
    els.lineBillingDetail = document.getElementById('line-billing-detail');
    els.lineSavingsAmount = document.getElementById('line-savings-amount');
    els.lineSavingsDetail = document.getElementById('line-savings-detail');
    els.lineEffectiveMonthly = document.getElementById('line-effective-monthly');
    els.lineEffectiveDetail = document.getElementById('line-effective-detail');
    els.lineTotal = document.getElementById('line-total');
    els.rowSavings = document.getElementById('row-savings');

    els.pdfBranches = document.getElementById('pdf-branches');
    els.pdfStaff = document.getElementById('pdf-staff');
    els.pdfTotal = document.getElementById('pdf-total');
    els.pdfBaseBranch = document.getElementById('pdf-base-branch');
    els.pdfExtraBranch = document.getElementById('pdf-extra-branch');
    els.pdfMonthlyBase = document.getElementById('pdf-monthly-base');
    els.pdfBillingPeriod = document.getElementById('pdf-billing-period');
    els.pdfSavings = document.getElementById('pdf-savings');
    els.pdfEffective = document.getElementById('pdf-effective');
    els.pdfDate = document.getElementById('pdf-date');

    form.querySelectorAll('input[name="staffEntryMode"]').forEach(function (radio) {
      radio.addEventListener('change', onStaffModeChange);
    });

    form.querySelectorAll('input[name="billingPeriod"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        run(false);
      });
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

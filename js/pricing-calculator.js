(function () {
  'use strict';

  var COST_PER_BRANCH = 100;
  var STAFF_PER_BRANCH = 5;
  var STAFF_EXTRA_COST = 10;
  var MAX_PER_BRANCH_LOCATIONS = 50;
  /** Reference bundle used across marketing and this quote: 4 branches, 20 staff → GHS 400/mo */
  var BASELINE_BRANCHES = 4;
  var BASELINE_STAFF_TOTAL = 20;

  var form;
  var els = {};
  var perBranchListEl;
  var staffGroupAvg;
  var staffGroupPer;
  var staffGroupTotal;
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

  /** Split a company-wide total into per-branch integers (larger locations get +1 when remainder). */
  function distributeTotalAcrossBranches(total, branches) {
    if (branches <= 0) return [];
    var each = Math.floor(total / branches);
    var rem = total - each * branches;
    var seeds = [];
    for (var di = 0; di < branches; di++) {
      seeds.push(String(each + (di < rem ? 1 : 0)));
    }
    return seeds;
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
      if (staffGroupTotal) staffGroupTotal.classList.add('d-none');
    }
  }

  function syncModeVisibility() {
    var mode = getStaffEntryMode();
    if (mode === 'avg') {
      staffGroupAvg.classList.remove('d-none');
      staffGroupPer.classList.add('d-none');
      if (staffGroupTotal) staffGroupTotal.classList.add('d-none');
    } else if (mode === 'total') {
      staffGroupAvg.classList.add('d-none');
      staffGroupPer.classList.add('d-none');
      if (staffGroupTotal) staffGroupTotal.classList.remove('d-none');
    } else {
      staffGroupAvg.classList.add('d-none');
      if (staffGroupTotal) staffGroupTotal.classList.add('d-none');
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
    if (els.totalStaff) showFieldError(els.totalStaff, '');
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
    } else if (mode === 'total') {
      if (!els.totalStaff) {
        return null;
      }
      var totRaw = String(els.totalStaff.value).trim();
      if (skipCoerce && totRaw === '') {
        return null;
      }
      var totalStaffNum = parsePositiveInt(totRaw, 0, 100000);
      if (isNaN(totalStaffNum)) {
        if (!skipCoerce) showFieldError(els.totalStaff, 'Enter a valid number.');
        return null;
      }
      actualBranchStaff = branches === 0 ? 0 : totalStaffNum;
      if (!skipCoerce) {
        els.branches.value = branches;
        els.totalStaff.value = totalStaffNum;
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

  function getBaselineExplainerPlainText() {
    var b = compute(BASELINE_BRANCHES, BASELINE_STAFF_TOTAL);
    var included = BASELINE_BRANCHES * STAFF_PER_BRANCH;
    var lines = [
      'Each VeriTrack subscription is calculated as follows:',
      '• GHS ' + COST_PER_BRANCH + ' per office or branch, per month',
      '• ' + STAFF_PER_BRANCH + ' staff included per location at no extra charge (combined across locations)',
      '• GHS ' + STAFF_EXTRA_COST + ' per month for each staff member beyond that total allowance',
      '',
      'Reference example (baseline bundle):',
      '  • Offices/branches: ' +
        BASELINE_BRANCHES +
        ' × GHS ' +
        COST_PER_BRANCH +
        ' = ' +
        formatGHS(BASELINE_BRANCHES * COST_PER_BRANCH),
      '  • Included staff allowance: ' +
        BASELINE_BRANCHES +
        ' locations × ' +
        STAFF_PER_BRANCH +
        ' = ' +
        included +
        ' staff included in the base fee',
      '  • Total staff in this example: ' +
        BASELINE_STAFF_TOTAL +
        ' (matches the allowance, so no extra staff charge)',
      '  • Additional staff charge: 0 × GHS ' + STAFF_EXTRA_COST + ' = GHS 0',
      '  → Monthly subscription for this reference: ' + formatGHS(b.finalMonthly)
    ];
    return lines.join('\n');
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

    if (els.pdfCompany) {
      var cn = els.companyName ? String(els.companyName.value).trim() : '';
      els.pdfCompany.textContent = cn || '—';
    }
    if (els.pdfBaselineExplainer) {
      els.pdfBaselineExplainer.textContent = getBaselineExplainerPlainText();
    }
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
        if (modeAvgRadio) modeAvgRadio.checked = true;
        syncModeVisibility();
        run(false);
        return;
      }
      var totalDirect = parsePositiveInt(String(els.totalStaff.value).trim(), 0, 100000);
      var avg = parsePositiveInt(String(els.avgStaff.value).trim(), 0, 100000);
      if (isNaN(avg)) avg = 0;

      if (!isNaN(totalDirect) && totalDirect > 0 && branches > 0) {
        buildPerBranchInputs(branches, distributeTotalAcrossBranches(totalDirect, branches));
      } else {
        var seeds = [];
        for (var si = 0; si < branches; si++) {
          seeds.push(String(avg));
        }
        buildPerBranchInputs(branches, seeds);
      }
      staffGroupAvg.classList.add('d-none');
      if (staffGroupTotal) staffGroupTotal.classList.add('d-none');
      staffGroupPer.classList.remove('d-none');
    } else if (mode === 'total') {
      var tt = String(els.totalStaff.value).trim();
      var tNum = parsePositiveInt(tt, 0, 100000);
      var shouldSeed = tt === '' || (!isNaN(tNum) && tNum === 0);
      if (shouldSeed && branches > 0) {
        var av = parsePositiveInt(String(els.avgStaff.value).trim(), 0, 100000);
        if (!isNaN(av)) {
          els.totalStaff.value = String(branches * av);
        }
        var afterAvg = parsePositiveInt(String(els.totalStaff.value).trim(), 0, 100000);
        if ((isNaN(afterAvg) || afterAvg === 0) && branches <= MAX_PER_BRANCH_LOCATIONS) {
          if (perBranchListEl.querySelectorAll('input[data-per-branch]').length === branches) {
            var sp = sumPerBranchStaff(true);
            if (!isNaN(sp) && sp > 0) {
              els.totalStaff.value = String(sp);
            }
          }
        }
      }
      staffGroupAvg.classList.add('d-none');
      staffGroupPer.classList.add('d-none');
      if (staffGroupTotal) staffGroupTotal.classList.remove('d-none');
    } else {
      if (branches > 0) {
        var tRaw = String(els.totalStaff.value).trim();
        var tVal = parsePositiveInt(tRaw, 0, 100000);
        if (tRaw !== '' && !isNaN(tVal)) {
          els.avgStaff.value = String(Math.round(tVal / branches));
        } else if (perBranchListEl.querySelectorAll('input[data-per-branch]').length === branches) {
          var tot = sumPerBranchStaff(true);
          if (!isNaN(tot)) {
            els.avgStaff.value = String(Math.round(tot / branches));
          }
        }
      }
      staffGroupAvg.classList.remove('d-none');
      staffGroupPer.classList.add('d-none');
      if (staffGroupTotal) staffGroupTotal.classList.add('d-none');
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

    var inputs = compute(v.branches, v.actualBranchStaff);
    var bill = computeBillingPeriod(inputs.finalMonthly, getBillingPeriod());
    var baseline = compute(BASELINE_BRANCHES, BASELINE_STAFF_TOTAL);
    var companyName = els.companyName ? String(els.companyName.value).trim() : '';

    var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var margin = 18;
    var rightX = pageW - margin;
    var contentW = pageW - 2 * margin;
    var y = 18;
    var lineH = 5.9;
    var lineHLoose = 7.2;
    var wrapSmall = 4.1;
    var bottomSafe = 22;

    function needPage(h) {
      if (y + h > pageH - bottomSafe) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    }

    function paragraph(lines, fontSize, colorRgb, loose) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize || 10);
      if (colorRgb) doc.setTextColor(colorRgb[0], colorRgb[1], colorRgb[2]);
      else doc.setTextColor(40, 40, 40);
      var lh = loose ? lineHLoose : lineH;
      for (var i = 0; i < lines.length; i++) {
        var block = lines[i];
        var parts = doc.splitTextToSize(block, contentW);
        for (var j = 0; j < parts.length; j++) {
          needPage(lh + 2);
          doc.text(parts[j], margin, y);
          y += lh;
        }
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(30, 60, 114);
    doc.text('VeriTrack Systems', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 55, 55);
    doc.text('Subscription pricing quote', margin, y);
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text('Company: ' + (companyName || '—'), margin, y);
    y += 5;
    doc.setTextColor(100, 100, 100);
    doc.text('Generated ' + pdfVal('pdf-date'), margin, y);
    y += 8;

    doc.setDrawColor(210, 220, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, rightX, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 60, 114);
    doc.text('1. How your monthly rate is calculated', margin, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(45, 45, 45);
    paragraph(
      [
        'Before your own figures, this is the pricing model (read top to bottom):',
        '• GHS ' +
          COST_PER_BRANCH +
          ' per office or branch, per month.',
        '• ' +
          STAFF_PER_BRANCH +
          ' staff are included per location at no extra charge. Across all locations, the allowance is: (number of offices or branches) × ' +
          STAFF_PER_BRANCH +
          ' staff.',
        '• Each staff member beyond that total allowance is billed at GHS ' + STAFF_EXTRA_COST + ' per month.'
      ],
      10,
      [45, 45, 45],
      true
    );
    y += 2;
    needPage(24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 80, 120);
    doc.text('Reference example (baseline bundle)', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(45, 45, 45);
    var baseIncluded = BASELINE_BRANCHES * STAFF_PER_BRANCH;
    paragraph(
      [
        'This is a worked example using the same rules as your quote below — not your bill.',
        '• Offices/branches: ' +
          BASELINE_BRANCHES +
          ' × GHS ' +
          COST_PER_BRANCH +
          ' = ' +
          formatGHS(BASELINE_BRANCHES * COST_PER_BRANCH) +
          '.',
        '• Included staff allowance: ' +
          BASELINE_BRANCHES +
          ' × ' +
          STAFF_PER_BRANCH +
          ' = ' +
          baseIncluded +
          ' staff included in the base fee.',
        '• Total staff in this example: ' +
          BASELINE_STAFF_TOTAL +
          ' (so no staff are charged as "additional").',
        '• Additional staff charge: ' +
          baseline.extraBranchStaff +
          ' staff × GHS ' +
          STAFF_EXTRA_COST +
          ' = ' +
          formatGHS(baseline.extraBranchStaffCost) +
          '.',
        '→ Monthly subscription for this reference: ' + formatGHS(baseline.finalMonthly) + '.'
      ],
      10,
      [45, 45, 45],
      true
    );
    y += 4;

    needPage(30);
    doc.setDrawColor(210, 220, 235);
    doc.line(margin, y, rightX, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 60, 114);
    doc.text('2. Your organisation — inputs and calculation', margin, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    var modeLabel =
      v.mode === 'avg'
        ? 'Average staff per branch (same count at each location)'
        : v.mode === 'total'
          ? 'Total staff entered directly (company-wide headcount)'
          : 'Staff entered separately per office or branch';
    paragraph(
      [
        'Company name: ' + (companyName || '—'),
        'Staff entry: ' + modeLabel + '.',
        '• Offices / branches: ' + v.branches + '.',
        '• Total staff (all locations): ' + inputs.totalStaff + '.'
      ],
      10,
      [45, 45, 45],
      true
    );
    y += 2;

    needPage(36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 80, 120);
    doc.text('Monthly calculation (your scenario)', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    paragraph(
      [
        '• Base office / branch cost: ' +
          v.branches +
          ' × GHS ' +
          COST_PER_BRANCH +
          ' = ' +
          formatGHS(inputs.baseBranchCost) +
          '.',
        '• Included staff allowance: ' +
          v.branches +
          ' × ' +
          STAFF_PER_BRANCH +
          ' = ' +
          inputs.coveredStaff +
          ' staff included in the base fee.',
        '• Staff beyond the allowance: ' +
          inputs.extraBranchStaff +
          ' × GHS ' +
          STAFF_EXTRA_COST +
          ' = ' +
          formatGHS(inputs.extraBranchStaffCost) +
          '.',
        '→ Monthly subscription (base, before billing-period discount): ' + formatGHS(inputs.finalMonthly) + '.'
      ],
      10,
      [45, 45, 45],
      true
    );
    y += 4;

    needPage(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 80, 120);
    doc.text('Billing period and amount due', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    paragraph(
      [
        '• Selected period: ' + bill.periodName + '. ' + bill.periodDetail,
        '• Savings vs paying month-by-month for this period: ' + formatGHS(bill.savings) + '.',
        '• Effective monthly (prepayment spread over ' + bill.monthsCovered + ' month(s)): ' + formatGHS(bill.effectiveMonthly) + '.'
      ],
      10,
      [45, 45, 45],
      true
    );
    y += 6;

    needPage(16);
    doc.setDrawColor(210, 220, 235);
    doc.line(margin, y, rightX, y);
    y += 9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 60, 114);
    doc.text('Amount due (selected period)', margin, y);
    doc.text(formatGHS(bill.prepaidTotal), rightX, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    var foot =
      'Estimate only. This quote explains how the figure was derived using the published rules. Final pricing, taxes, and contract terms are subject to agreement with VeriTrack Systems.';
    var footLines = doc.splitTextToSize(foot, contentW);
    for (var fi = 0; fi < footLines.length; fi++) {
      needPage(wrapSmall + 2);
      doc.text(footLines[fi], margin, y);
      y += wrapSmall;
    }

    var safeFile = 'VeriTrack-Systems-Pricing-Quote';
    if (companyName) {
      var slug = companyName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 48);
      if (slug) safeFile = safeFile + '-' + slug;
    }
    doc.save(safeFile + '.pdf');
  }

  function init() {
    form = document.getElementById('pricing-calculator-form');
    if (!form) return;

    els.companyName = document.getElementById('input-company-name');
    els.branches = document.getElementById('input-branches');
    els.avgStaff = document.getElementById('input-avg-staff');
    els.totalStaff = document.getElementById('input-total-staff');

    perBranchListEl = document.getElementById('per-branch-staff-list');
    staffGroupAvg = document.getElementById('staff-group-avg');
    staffGroupPer = document.getElementById('staff-group-per');
    staffGroupTotal = document.getElementById('staff-group-total');
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
    els.pdfCompany = document.getElementById('pdf-company');
    els.pdfBaselineExplainer = document.getElementById('pdf-baseline-explainer');

    if (els.companyName) {
      els.companyName.addEventListener('input', function () {
        if (els.pdfCompany) {
          var t = String(els.companyName.value).trim();
          els.pdfCompany.textContent = t || '—';
        }
      });
    }

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

(function () {
  'use strict';

  var STAFF_PER_BRANCH = 12;
  var MAX_PER_BRANCH_LOCATIONS = 50;
  /** Reference bundle for explainer/PDF: 4 branches, 20 staff (no excess) */
  var BASELINE_BRANCHES = 4;
  var BASELINE_STAFF_TOTAL = 20;

  /** Optional modules (GHS / month unless noted) */
  var ADDON_LEADERBOARD = 20;
  var ADDON_SHIFT_ROTATION = 30;
  var ADDON_AI_TIPS = 30;
  var ADDON_PAYROLL_SYNC = 50;
  var ADDON_ADMIN_ALERT_PER_STAFF = 2;

  /**
   * Branch pricing by total office/branch count (tier applies to all branches).
   * Tier 1: ≤3 → GHS 450; Tier 2: 4–9 → GHS 350; Tier 3: ≥10 → GHS 300. Twelve staff included per branch.
   */
  function getBranchTierInfo(branches) {
    var b = Math.max(0, Math.floor(branches));
    if (b <= 3) {
      return {
        tier: 1,
        label: 'Tier 1 (Small operations)',
        name: 'Small Operations',
        rate: 450,
        condition: '≤ 3 branches'
      };
    }
    if (b <= 9) {
      return {
        tier: 2,
        label: 'Tier 2 (Growing operations)',
        name: 'Growing Operations',
        rate: 350,
        condition: '4–9 branches'
      };
    }
    return {
      tier: 3,
      label: 'Tier 3 (Enterprise operations)',
      name: 'Enterprise Operations',
      rate: 300,
      condition: '≥ 10 branches'
    };
  }

  /**
   * Excess staff = total staff − (branches × 10). Whole excess count falls in one band; all excess billed at that rate.
   * Tier A: 1–20 → GHS 10; Tier B: 21–50 → GHS 8; Tier C: 51+ → GHS 6 per staff / month.
   */
  function getExtraStaffTierInfo(extraCount) {
    var e = Math.max(0, Math.floor(extraCount));
    if (e <= 0) {
      return {
        tier: '-',
        label: 'No excess staff',
        name: '—',
        rate: 0,
        cost: 0,
        rangeLabel: '0 extra staff'
      };
    }
    if (e <= 20) {
      return {
        tier: 'A',
        label: 'Tier A (low excess)',
        name: 'Low excess staffing',
        rate: 10,
        cost: e * 10,
        rangeLabel: '1–20 extra staff'
      };
    }
    if (e <= 50) {
      return {
        tier: 'B',
        label: 'Tier B (moderate excess)',
        name: 'Moderate excess staffing',
        rate: 8,
        cost: e * 8,
        rangeLabel: '21–50 extra staff'
      };
    }
    return {
      tier: 'C',
      label: 'Tier C (high volume)',
      name: 'High volume staffing',
      rate: 6,
      cost: e * 6,
      rangeLabel: '51+ extra staff'
    };
  }

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

  /**
   * jsPDF standard Helvetica lacks many Unicode glyphs (<=, >=, arrows, dashes, multiply);
   * they can render as wrong characters and break width calculations. Use ASCII for PDF only.
   */
  function pdfAscii(s) {
    return String(s == null ? '' : s)
      .replace(/\u2264/g, '<=')
      .replace(/\u2265/g, '>=')
      .replace(/\u2013/g, '-')
      .replace(/\u2014/g, ' - ')
      .replace(/\u2192/g, '=>')
      .replace(/\u00d7/g, ' x ')
      .replace(/\u2212/g, '-')
      .replace(/\u00bd/g, '1/2')
      .replace(/\u00bc/g, '1/4')
      .replace(/\u00be/g, '3/4')
      .replace(/\u2018|\u2019|\u201c|\u201d/g, "'");
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

  function readAddonSelection() {
    function chk(id) {
      var el = document.getElementById(id);
      return !!(el && el.checked);
    }
    return {
      leaderboard: chk('addon-leaderboard'),
      shift: chk('addon-shift'),
      ai: chk('addon-ai'),
      payroll: chk('addon-payroll'),
      alert: chk('addon-alert')
    };
  }

  /**
   * @returns {{ total: number, detailLines: string[], linesForPdf: string[] }}
   */
  function computeAddonMonthly(totalStaff, sel) {
    var staff = Math.max(0, Math.floor(totalStaff));
    var fixed = 0;
    var lines = [];
    var pdfLines = [];
    if (sel.leaderboard) {
      fixed += ADDON_LEADERBOARD;
      lines.push('Leaderboard & Recognition (' + formatGHS(ADDON_LEADERBOARD) + '/mo)');
      pdfLines.push('• Leaderboard & Recognition: ' + formatGHS(ADDON_LEADERBOARD) + '/mo.');
    }
    if (sel.shift) {
      fixed += ADDON_SHIFT_ROTATION;
      lines.push('Shift Rotation (' + formatGHS(ADDON_SHIFT_ROTATION) + '/mo)');
      pdfLines.push('• Shift Rotation Management: ' + formatGHS(ADDON_SHIFT_ROTATION) + '/mo.');
    }
    if (sel.ai) {
      fixed += ADDON_AI_TIPS;
      lines.push('AI Productivity Tips (' + formatGHS(ADDON_AI_TIPS) + '/mo)');
      pdfLines.push('• AI Productivity Tips: ' + formatGHS(ADDON_AI_TIPS) + '/mo.');
    }
    if (sel.payroll) {
      fixed += ADDON_PAYROLL_SYNC;
      lines.push('Payroll Sync (' + formatGHS(ADDON_PAYROLL_SYNC) + '/mo)');
      pdfLines.push('• Payroll Sync: ' + formatGHS(ADDON_PAYROLL_SYNC) + '/mo.');
    }
    var alertCost = 0;
    if (sel.alert) {
      alertCost = staff * ADDON_ADMIN_ALERT_PER_STAFF;
      lines.push(
        'Admin real-time alert (' +
          staff +
          ' staff × ' +
          formatGHS(ADDON_ADMIN_ALERT_PER_STAFF) +
          ')'
      );
      pdfLines.push(
        '• Admin real-time alert on each check-in: ' +
          staff +
          ' staff x GHS ' +
          ADDON_ADMIN_ALERT_PER_STAFF +
          ' = ' +
          formatGHS(alertCost) +
          '/mo.'
      );
    }
    var total = fixed + alertCost;
    return { total: total, detailLines: lines, linesForPdf: pdfLines, fixed: fixed, alertCost: alertCost };
  }

  function buildQuote(v) {
    var core = compute(v.branches, v.actualBranchStaff);
    var addonInfo = computeAddonMonthly(v.actualBranchStaff, readAddonSelection());
    var combined = core.finalMonthly + addonInfo.total;
    var billing = computeBillingPeriod(combined, getBillingPeriod());
    return Object.assign({}, core, {
      branches: v.branches,
      coreMonthly: core.finalMonthly,
      addonInfo: addonInfo,
      finalMonthly: combined,
      billing: billing
    });
  }

  /**
   * Billing periods: Monthly (standard) or Annual (pay 11 months, save 1 month).
   */
  function computeBillingPeriod(monthlyFee, period) {
    var M = monthlyFee;
    var key = period === 'annual' ? 'annual' : 'monthly';
    var months = 1;
    var fullRollup = M;
    var prepaid = M;

    if (key === 'annual') {
      months = 12;
      fullRollup = M * 12;
      prepaid = M * 11;
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
      annual: {
        name: 'Annual',
        detail: 'Prepay 12 months at 11× monthly (save 1 month vs 12 separate months)',
        summaryLabel: 'Amount due (annual)'
      }
    };

    var m = meta[key];

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
    var b = Math.max(0, branches);
    var branchTier = getBranchTierInfo(b);
    var baseBranchCost = b * branchTier.rate;
    var coveredStaff = b * STAFF_PER_BRANCH;
    var extraBranchStaff = Math.max(0, actualBranchStaff - coveredStaff);
    var extraStaffTier = getExtraStaffTierInfo(extraBranchStaff);
    var extraBranchStaffCost = extraStaffTier.cost;
    var finalMonthly = baseBranchCost + extraBranchStaffCost;

    return {
      branchTier: branchTier,
      baseBranchCost: baseBranchCost,
      extraBranchStaff: extraBranchStaff,
      extraStaffTier: extraStaffTier,
      extraBranchStaffCost: extraBranchStaffCost,
      totalBranchCost: finalMonthly,
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
        inp.value = '1';
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
      prev.push('1');
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

  function getPricingRulesSummaryLines() {
    return [
      'Branch pricing (one tier applies to all branches):',
      '• Tier 1 Small: <= 3 branches - GHS 450 / branch / month.',
      '• Tier 2 Growing: 4-9 branches - GHS 350 / branch / month.',
      '• Tier 3 Enterprise: >= 10 branches - GHS 300 / branch / month.',
      '• ' + STAFF_PER_BRANCH + ' staff per branch included; allowance = branches x ' + STAFF_PER_BRANCH + '.',
      '',
      'Extra staff (total staff above allowance; one tier for all excess):',
      '• Tier A: 1-20 extra - GHS 10 each / month.',
      '• Tier B: 21-50 extra - GHS 8 each / month.',
      '• Tier C: 51+ extra - GHS 6 each / month.',
      '',
      'Optional modules (if selected, added to monthly subscription):',
      '• Leaderboard & Recognition: GHS ' + ADDON_LEADERBOARD + ' / month.',
      '• Shift Rotation Management: GHS ' + ADDON_SHIFT_ROTATION + ' / month.',
      '• AI Productivity Tips: GHS ' + ADDON_AI_TIPS + ' / month.',
      '• Payroll Sync: GHS ' + ADDON_PAYROLL_SYNC + ' / month.',
      '• Admin real-time alert on each check-in: GHS ' + ADDON_ADMIN_ALERT_PER_STAFF + ' / staff / month.'
    ];
  }

  function getBaselineExplainerPlainText() {
    var b = compute(BASELINE_BRANCHES, BASELINE_STAFF_TOTAL);
    var included = BASELINE_BRANCHES * STAFF_PER_BRANCH;
    var lines = getPricingRulesSummaryLines();
    lines.push('');
    lines.push('Reference example (baseline — not your bill):');
    lines.push(
      '  • Branch tier: ' + b.branchTier.label + ' (' + b.branchTier.condition + ') — GHS ' + b.branchTier.rate + ' per branch.'
    );
    lines.push(
      '  • Branch cost: ' +
        BASELINE_BRANCHES +
        ' × GHS ' +
        b.branchTier.rate +
        ' = ' +
        formatGHS(b.baseBranchCost) +
        '.'
    );
    lines.push(
      '  • Included staff: ' +
        BASELINE_BRANCHES +
        ' × ' +
        STAFF_PER_BRANCH +
        ' = ' +
        included +
        ' staff in base fee.'
    );
    lines.push('  • Total staff in example: ' + BASELINE_STAFF_TOTAL + ' (no excess).');
    lines.push('  • Additional staff cost: ' + formatGHS(b.extraBranchStaffCost) + '.');
    lines.push('  → Monthly subscription for this reference: ' + formatGHS(b.finalMonthly) + '.');
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
    if (els.lineBaseBranchDetail) {
      els.lineBaseBranchDetail.textContent =
        r.branches > 0
          ? r.branchTier.label +
            ' — ' +
            r.branches +
            ' × ' +
            formatGHS(r.branchTier.rate) +
            '/branch'
          : '≤3 branches: GHS 450 each; 4–9: GHS 350; ≥10: GHS 300 (12 staff/branch included)';
    }
    els.lineExtraBranch.textContent = formatGHS(r.extraBranchStaffCost);
    els.lineExtraBranchDetail.textContent =
      r.extraBranchStaff > 0
        ? r.extraStaffTier.label +
          ' (' +
          r.extraStaffTier.rangeLabel +
          '): ' +
          r.extraBranchStaff +
          ' × ' +
          formatGHS(r.extraStaffTier.rate) +
          '/staff'
        : 'No staff beyond included allowance (10 per branch)';

    var ai = r.addonInfo || { total: 0, detailLines: [] };
    if (els.lineAddons) {
      els.lineAddons.textContent = formatGHS(ai.total);
    }
    if (els.lineAddonsDetail) {
      els.lineAddonsDetail.textContent =
        ai.detailLines.length > 0 ? ai.detailLines.join(' · ') : 'None selected';
    }

    els.lineMonthlyBase.textContent = formatGHS(r.finalMonthly);
    if (els.lineMonthlyBaseDetail) {
      els.lineMonthlyBaseDetail.textContent =
        ai.total > 0
          ? 'Branches & staff plus optional modules; before prepay discount'
          : 'Branches & staff; before prepay discount';
    }
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
    if (els.pdfAddons) {
      els.pdfAddons.textContent = formatGHS(ai.total);
    }
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
    render(buildQuote(v));
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

    function planLabel(tier) {
      if (tier === 1) return 'Starter';
      if (tier === 2) return 'Growth';
      return 'Enterprise';
    }

    function loadImageDataUrl(src) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
          try {
            var canvas = document.createElement('canvas');
            var maxW = 360;
            var scale = Math.min(1, maxW / img.width);
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
          } catch (err) {
            resolve(null);
          }
        };
        img.onerror = function () {
          resolve(null);
        };
        img.src = src;
      });
    }

    var inputs = buildQuote(v);
    var bill = inputs.billing;
    var baseline = compute(BASELINE_BRANCHES, BASELINE_STAFF_TOTAL);
    var companyName = els.companyName ? String(els.companyName.value).trim() : '';
    var generatedLabel = pdfVal('pdf-date') || new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    var quoteId =
      'VT-Q-' +
      new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      '-' +
      String(v.branches).padStart(2, '0');

    loadImageDataUrl('images/veritrack final logo.png').then(function (logoDataUrl) {
      var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      var pageW = doc.internal.pageSize.getWidth();
      var pageH = doc.internal.pageSize.getHeight();
      var m = 18;
      var right = pageW - m;
      var contentW = pageW - 2 * m;
      var y = m;
      var bottomSafe = 20;

      var C = {
        deep: [30, 60, 114],
        mid: [42, 82, 152],
        accent: [52, 152, 219],
        soft: [248, 251, 255],
        row: [241, 246, 252],
        text: [28, 37, 52],
        muted: [100, 116, 139],
        line: [214, 224, 236],
        white: [255, 255, 255],
        saveBg: [232, 248, 240],
        save: [22, 122, 74]
      };

      function need(h) {
        if (y + h > pageH - bottomSafe) {
          doc.addPage();
          y = m;
          return true;
        }
        return false;
      }

      function gap(mm) {
        y += mm;
      }

      function setRgb(arr) {
        doc.setTextColor(arr[0], arr[1], arr[2]);
      }

      function fillRgb(arr) {
        doc.setFillColor(arr[0], arr[1], arr[2]);
      }

      function strokeRgb(arr) {
        doc.setDrawColor(arr[0], arr[1], arr[2]);
      }

      function text(str, x, yy, opts) {
        doc.text(pdfAscii(str), x, yy, opts || {});
      }

      function drawFooter() {
        var pages = doc.internal.getNumberOfPages();
        for (var i = 1; i <= pages; i++) {
          doc.setPage(i);
          strokeRgb(C.line);
          doc.setLineWidth(0.3);
          doc.line(m, pageH - 14, right, pageH - 14);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          setRgb(C.muted);
          text('veritrack.cloud  ·  info@veritrack.cloud', m, pageH - 8);
          text('Page ' + i + ' of ' + pages, right, pageH - 8, { align: 'right' });
        }
      }

      function sectionLabel(title) {
        need(12);
        gap(4);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        setRgb(C.accent);
        text(String(title).toUpperCase(), m, y);
        gap(2);
        strokeRgb(C.line);
        doc.setLineWidth(0.4);
        doc.line(m, y, right, y);
        gap(5);
      }

      function wrapped(str, maxW, size, color, leading) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(size || 9);
        setRgb(color || C.muted);
        var lines = doc.splitTextToSize(pdfAscii(str), maxW);
        var lh = leading || 4.4;
        for (var i = 0; i < lines.length; i++) {
          need(lh + 1);
          text(lines[i], m, y);
          y += lh;
        }
      }

      function chip(label, value, x, width) {
        var h = 14;
        fillRgb(C.soft);
        strokeRgb(C.line);
        doc.setLineWidth(0.35);
        doc.roundedRect(x, y, width, h, 2, 2, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        setRgb(C.muted);
        text(label.toUpperCase(), x + 3, y + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        setRgb(C.deep);
        text(value, x + 3, y + 10.5);
      }

      function money(n) {
        return formatGHS(n);
      }

      function drawLineTable(rows) {
        var colDesc = m;
        var colDetail = m + contentW * 0.48;
        var colAmt = right;
        var rowH = 8;
        var headerH = 8;

        need(headerH + rows.length * rowH + 4);

        fillRgb(C.deep);
        doc.rect(m, y, contentW, headerH, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        setRgb(C.white);
        text('DESCRIPTION', colDesc + 3, y + 5.2);
        text('DETAIL', colDetail, y + 5.2);
        text('AMOUNT', colAmt - 3, y + 5.2, { align: 'right' });
        y += headerH;

        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          need(rowH + 2);
          if (row.emphasis) {
            fillRgb(C.soft);
            doc.rect(m, y, contentW, rowH, 'F');
          } else if (i % 2 === 0) {
            fillRgb(C.row);
            doc.rect(m, y, contentW, rowH, 'F');
          }
          doc.setFont('helvetica', row.emphasis ? 'bold' : 'normal');
          doc.setFontSize(row.emphasis ? 9 : 8.5);
          setRgb(C.text);
          text(row.desc, colDesc + 3, y + 5.2);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          setRgb(C.muted);
          text(row.detail || '', colDetail, y + 5.2);
          doc.setFont('helvetica', row.emphasis ? 'bold' : 'normal');
          doc.setFontSize(row.emphasis ? 9 : 8.5);
          setRgb(row.emphasis ? C.deep : C.text);
          text(row.amount, colAmt - 3, y + 5.2, { align: 'right' });
          y += rowH;
        }

        strokeRgb(C.line);
        doc.setLineWidth(0.35);
        doc.line(m, y, right, y);
        gap(3);
      }

      function tinyTable(headers, bodyRows, colWidths) {
        var x0 = m;
        var rowH = 7.2;
        var totalW = 0;
        for (var w = 0; w < colWidths.length; w++) totalW += colWidths[w];

        need(rowH * (bodyRows.length + 1) + 4);
        fillRgb(C.mid);
        doc.rect(x0, y, totalW, rowH, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        setRgb(C.white);
        var cx = x0;
        for (var h = 0; h < headers.length; h++) {
          text(headers[h], cx + 2.2, y + 4.8);
          cx += colWidths[h];
        }
        y += rowH;

        for (var r = 0; r < bodyRows.length; r++) {
          need(rowH + 1);
          if (r % 2 === 0) {
            fillRgb(C.soft);
            doc.rect(x0, y, totalW, rowH, 'F');
          }
          cx = x0;
          for (var c = 0; c < bodyRows[r].length; c++) {
            doc.setFont('helvetica', c === bodyRows[r].length - 1 ? 'bold' : 'normal');
            doc.setFontSize(8);
            setRgb(C.text);
            var alignRight = c === bodyRows[r].length - 1;
            if (alignRight) {
              text(bodyRows[r][c], cx + colWidths[c] - 2.2, y + 4.8, { align: 'right' });
            } else {
              text(bodyRows[r][c], cx + 2.2, y + 4.8);
            }
            cx += colWidths[c];
          }
          y += rowH;
        }
        strokeRgb(C.line);
        doc.setLineWidth(0.3);
        doc.line(x0, y, x0 + totalW, y);
        gap(3);
      }

      /* ========== PAGE 1: QUOTE ========== */

      if (logoDataUrl) {
        try {
          doc.addImage(logoDataUrl, 'PNG', m, y - 1, 28, 12);
        } catch (eLogo) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          setRgb(C.deep);
          text('VeriTrack Systems', m, y + 6);
        }
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        setRgb(C.deep);
        text('VeriTrack Systems', m, y + 6);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      setRgb(C.deep);
      text('QUOTATION', right, y + 4, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setRgb(C.muted);
      text(quoteId, right, y + 9.5, { align: 'right' });
      text(generatedLabel, right, y + 13.5, { align: 'right' });
      y += 18;

      fillRgb(C.accent);
      doc.rect(m, y, contentW, 1.1, 'F');
      gap(8);

      fillRgb(C.soft);
      doc.roundedRect(m, y, contentW, 22, 2.5, 2.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setRgb(C.muted);
      text('PREPARED FOR', m + 4, y + 6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      setRgb(C.deep);
      text(companyName || 'Prospect organisation', m + 4, y + 13.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setRgb(C.muted);
      text('Valid estimate based on published VeriTrack pricing', m + 4, y + 18.5);
      y += 28;

      var plan = planLabel(inputs.branchTier.tier);
      var chipW = (contentW - 6) / 3;
      chip('Plan', plan, m, chipW);
      chip('Locations', String(v.branches) + ' branches', m + chipW + 3, chipW);
      chip('Billing', bill.periodName, m + 2 * (chipW + 3), chipW);
      y += 18;

      sectionLabel('Your calculation');

      var lineRows = [
        {
          desc: plan + ' plan - branch subscription',
          detail: v.branches + ' x GHS ' + inputs.branchTier.rate + '/mo',
          amount: money(inputs.baseBranchCost)
        },
        {
          desc: 'Extra staff beyond allowance',
          detail:
            inputs.extraBranchStaff > 0
              ? inputs.extraBranchStaff + ' staff x GHS ' + inputs.extraStaffTier.rate
              : STAFF_PER_BRANCH + ' staff/branch included',
          amount: money(inputs.extraBranchStaffCost)
        }
      ];

      if (inputs.addonInfo && inputs.addonInfo.total > 0) {
        var addonNames = inputs.addonInfo.detailLines.join('; ');
        lineRows.push({
          desc: 'Optional modules',
          detail: addonNames.length > 42 ? addonNames.slice(0, 40) + '...' : addonNames,
          amount: money(inputs.addonInfo.total)
        });
      } else {
        lineRows.push({
          desc: 'Optional modules',
          detail: 'None selected',
          amount: money(0)
        });
      }

      lineRows.push({
        desc: 'Monthly subscription',
        detail: 'Before billing-period discount',
        amount: money(inputs.finalMonthly),
        emphasis: true
      });

      drawLineTable(lineRows);

      need(36);
      var dueH = bill.savings > 0 ? 34 : 28;
      fillRgb(C.deep);
      doc.roundedRect(m, y, contentW, dueH, 3, 3, 'F');
      fillRgb(C.accent);
      doc.rect(m, y, 2.2, dueH, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setRgb([186, 210, 240]);
      text(
        bill.periodKey === 'annual' ? 'AMOUNT DUE  ·  ANNUAL PREPAY (11 MONTHS)' : 'AMOUNT DUE  ·  MONTHLY',
        m + 6,
        y + 8
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      setRgb(C.white);
      text(money(bill.prepaidTotal), m + 6, y + 19);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      setRgb([186, 210, 240]);
      if (bill.periodKey === 'annual') {
        text('Effective ' + money(bill.effectiveMonthly) + ' / month', right - 4, y + 12, { align: 'right' });
        text('List annual ' + money(bill.fullRollup), right - 4, y + 17.5, { align: 'right' });
        fillRgb(C.saveBg);
        doc.roundedRect(right - 52, y + 21, 48, 8, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        setRgb(C.save);
        text('Save ' + money(bill.savings), right - 28, y + 26.5, { align: 'center' });
        y += 40;
      } else {
        text('Billed each month', right - 4, y + 19, { align: 'right' });
        y += 34;
      }

      sectionLabel('Quote snapshot');
      var modeLabel =
        v.mode === 'avg' ? 'Average per branch' : v.mode === 'total' ? 'Company-wide total' : 'Per-branch entry';
      tinyTable(
        ['ITEM', 'VALUE'],
        [
          ['Staff counted', String(inputs.totalStaff)],
          ['Included allowance', String(inputs.coveredStaff) + ' staff'],
          ['Extra staff', String(inputs.extraBranchStaff)],
          ['Staff entry mode', modeLabel],
          ['Branch rate applied', 'GHS ' + inputs.branchTier.rate + ' (' + inputs.branchTier.condition + ')']
        ],
        [contentW * 0.45, contentW * 0.55]
      );

      gap(2);
      wrapped(
        'This quotation is an estimate generated from your inputs and VeriTrack published rates. Final commercial terms are confirmed in writing. Questions: info@veritrack.cloud',
        contentW,
        8,
        C.muted,
        3.8
      );

      /* ========== PAGE 2: REFERENCE ========== */
      doc.addPage();
      y = m;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      setRgb(C.deep);
      text('Pricing reference', m, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      setRgb(C.muted);
      text('How the quote above was derived', right, y, { align: 'right' });
      gap(4);
      fillRgb(C.accent);
      doc.rect(m, y, contentW, 0.9, 'F');
      gap(8);

      sectionLabel('Branch plans');
      tinyTable(
        ['PLAN', 'BRANCHES', 'RATE / BRANCH / MO', 'STAFF INCLUDED'],
        [
          ['Starter', '1-3', 'GHS 450', STAFF_PER_BRANCH + ' / branch'],
          ['Growth', '4-9', 'GHS 350', STAFF_PER_BRANCH + ' / branch'],
          ['Enterprise', '10+', 'GHS 300', STAFF_PER_BRANCH + ' / branch']
        ],
        [contentW * 0.22, contentW * 0.18, contentW * 0.32, contentW * 0.28]
      );

      sectionLabel('Extra staff (above included allowance)');
      tinyTable(
        ['BAND', 'EXTRA STAFF', 'RATE / STAFF / MO'],
        [
          ['A', '1-20', 'GHS 10'],
          ['B', '21-50', 'GHS 8'],
          ['C', '51+', 'GHS 6']
        ],
        [contentW * 0.2, contentW * 0.4, contentW * 0.4]
      );

      sectionLabel('Optional modules');
      tinyTable(
        ['MODULE', 'PRICE'],
        [
          ['Leaderboard & Recognition', 'GHS ' + ADDON_LEADERBOARD + ' / mo'],
          ['Shift Rotation Management', 'GHS ' + ADDON_SHIFT_ROTATION + ' / mo'],
          ['AI Productivity Tips', 'GHS ' + ADDON_AI_TIPS + ' / mo'],
          ['Payroll Sync', 'GHS ' + ADDON_PAYROLL_SYNC + ' / mo'],
          ['Admin real-time check-in alert', 'GHS ' + ADDON_ADMIN_ALERT_PER_STAFF + ' / staff / mo']
        ],
        [contentW * 0.62, contentW * 0.38]
      );

      sectionLabel('Billing periods');
      tinyTable(
        ['PERIOD', 'YOU PAY', 'YOU SAVE'],
        [
          ['Monthly', '1 x monthly rate', 'Standard'],
          ['Annual', '11 x monthly rate', '1 month free']
        ],
        [contentW * 0.28, contentW * 0.4, contentW * 0.32]
      );

      sectionLabel('Worked examples (not your invoice)');
      var baseMonthly = baseline.finalMonthly;
      tinyTable(
        ['EXAMPLE', 'SETUP', 'MONTHLY', 'ANNUAL (11x)'],
        [
          [
            'Reference',
            BASELINE_BRANCHES + ' branches / ' + BASELINE_STAFF_TOTAL + ' staff',
            money(baseMonthly),
            money(baseMonthly * 11)
          ],
          ['Larger', '12 branches / 150 staff', 'GHS 3,660', 'GHS 40,260']
        ],
        [contentW * 0.18, contentW * 0.34, contentW * 0.24, contentW * 0.24]
      );

      gap(2);
      wrapped(
        'Larger example detail: Enterprise rate GHS 300 x 12 branches = GHS 3,600; 6 extra staff x GHS 10 = GHS 60; monthly GHS 3,660.',
        contentW,
        8,
        C.muted,
        3.8
      );

      drawFooter();

      var safeFile = 'VeriTrack-Systems-Pricing-Quote';
      if (companyName) {
        var slug = companyName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 48);
        if (slug) safeFile = safeFile + '-' + slug;
      }
      doc.save(safeFile + '.pdf');
    });
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
    els.lineBaseBranchDetail = document.getElementById('line-base-branch-detail');
    els.lineExtraBranch = document.getElementById('line-extra-branch');
    els.lineExtraBranchDetail = document.getElementById('line-extra-branch-detail');
    els.lineAddons = document.getElementById('line-addons');
    els.lineAddonsDetail = document.getElementById('line-addons-detail');
    els.lineMonthlyBase = document.getElementById('line-monthly-base');
    els.lineMonthlyBaseDetail = document.getElementById('line-monthly-base-detail');
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
    els.pdfAddons = document.getElementById('pdf-addons');
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

    form.addEventListener('change', function (e) {
      if (!e.target || !e.target.getAttribute) return;
      if (e.target.getAttribute('data-addon') === '1') {
        run(false);
      }
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

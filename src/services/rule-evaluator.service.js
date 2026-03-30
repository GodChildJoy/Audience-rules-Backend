/**
 * @param {string} s
 * @returns {Date | null}
 */
function parseIsoDate(s) {
  if (typeof s !== 'string') {
    return null;
  }
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    return null;
  }
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

/**
 * @param {object} audience
 * @param {string} field
 * @returns {string | number | undefined}
 */
function getFieldValue(audience, field) {
  switch (field) {
    case 'country':
      return audience.country;
    case 'plan':
      return audience.plan;
    case 'purchaseCount':
      return audience.purchaseCount;
    case 'signupDate':
      return audience.signupDate;
    default:
      return undefined;
  }
}

/**
 * @param {object} audience
 * @param {object} condition
 * @returns {boolean}
 */
export function evaluateCondition(audience, condition) {
  const { field, operator, value } = condition;
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();

  switch (field) {
    case 'country':
    case 'plan': {
      const fv = String(getFieldValue(audience, field) ?? '');
      if (operator === 'is') {
        return fv === trimmed;
      }
      if (operator === 'is not') {
        return fv !== trimmed;
      }
      return false;
    }
    case 'purchaseCount': {
      const n = Number(getFieldValue(audience, 'purchaseCount'));
      const v = Number(trimmed);
      if (Number.isNaN(n) || Number.isNaN(v)) {
        return false;
      }
      if (operator === 'equals') {
        return n === v;
      }
      if (operator === 'greater than') {
        return n > v;
      }
      if (operator === 'less than') {
        return n < v;
      }
      return false;
    }
    case 'signupDate': {
      const aud = parseIsoDate(String(getFieldValue(audience, 'signupDate') ?? ''));
      const cmp = parseIsoDate(trimmed);
      if (!aud || !cmp) {
        return false;
      }
      const aT = aud.getTime();
      const cT = cmp.getTime();
      if (operator === 'on') {
        return aT === cT;
      }
      if (operator === 'before') {
        return aT < cT;
      }
      if (operator === 'after') {
        return aT > cT;
      }
      return false;
    }
    default:
      return false;
  }
}

/**
 * @param {object} audience
 * @param {object} group
 * @returns {boolean}
 */
export function evaluateGroup(audience, group) {
  const logic = group.logic;
  const conditions = Array.isArray(group.conditions) ? group.conditions : [];
  const groups = Array.isArray(group.groups) ? group.groups : [];

  const condResults = conditions.map((c) => evaluateCondition(audience, c));
  const groupResults = groups.map((g) => evaluateGroup(audience, g));
  const parts = [...condResults, ...groupResults];

  if (parts.length === 0) {
    return logic === 'AND';
  }
  if (logic === 'AND') {
    return parts.every(Boolean);
  }
  if (logic === 'OR') {
    return parts.some(Boolean);
  }
  return false;
}

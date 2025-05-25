module.exports = function getDateRange(range, year, month, quarter, half) {
  if (range === 'all' || isNaN(year)) return {};

  let from;
  let to;

  switch (range) {
    case 'monthly':
      if (isNaN(month)) return {};
      from = new Date(year, month, 1);
      to = new Date(year, month + 1, 1);
      break;

    case 'quarterly':
      if (isNaN(quarter)) return {};
      from = new Date(year, quarter * 3, 1);
      to = new Date(year, quarter * 3 + 3, 1);
      break;

    case 'half':
      if (isNaN(half)) return {};
      from = new Date(year, half === 0 ? 0 : 6, 1);
      to = new Date(year, half === 0 ? 6 : 12, 1);
      break;

    case 'yearly':
      from = new Date(year, 0, 1);
      to = new Date(year + 1, 0, 1);
      break;

    default:
      return {};
  }

  return { $gte: from, $lt: to };
}
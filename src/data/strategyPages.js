import strategies, { getStrategyBySlug } from './strategies';
import symbols, { getSymbolBySlug } from './symbols';

// Build the full list of programmatic /strategies/<symbol>-<strategy> combos
// from the strategy library × symbol catalog, filtered by `appliesTo` so we
// only ship pages that have a real strategic match.
export function getAllStrategyPages() {
  const pages = [];
  for (const strategy of strategies) {
    for (const symbol of symbols) {
      if (!strategy.appliesTo.includes(symbol.category)) continue;
      pages.push({
        slug: `${symbol.slug}-${strategy.slug}`,
        symbol,
        strategy,
        path: `/strategies/${symbol.slug}-${strategy.slug}`,
      });
    }
  }
  return pages;
}

// Resolve any /strategies/:slug to the right kind of page:
//   - 'combo'    — symbol + strategy (e.g. xauusd-ema-crossover)
//   - 'strategy' — just a strategy hub (e.g. ema-crossover)
//   - null       — unknown
export function resolveStrategySlug(slug) {
  if (!slug) return null;

  const firstSegment = slug.split('-')[0];
  const symbol = getSymbolBySlug(firstSegment);
  if (symbol) {
    const strategySlug = slug.slice(firstSegment.length + 1);
    const strategy = getStrategyBySlug(strategySlug);
    if (strategy && strategy.appliesTo.includes(symbol.category)) {
      return { kind: 'combo', symbol, strategy };
    }
  }

  const strategy = getStrategyBySlug(slug);
  if (strategy) return { kind: 'strategy', strategy };

  return null;
}

export function getRelatedPages(symbol, strategy, limit = 6) {
  const all = getAllStrategyPages();
  const related = [];
  // Prefer same-symbol other-strategy first.
  for (const p of all) {
    if (p.symbol.slug === symbol.slug && p.strategy.slug !== strategy.slug) {
      related.push(p);
    }
  }
  // Then same-strategy other-symbol.
  for (const p of all) {
    if (p.strategy.slug === strategy.slug && p.symbol.slug !== symbol.slug) {
      related.push(p);
    }
  }
  return related.slice(0, limit);
}

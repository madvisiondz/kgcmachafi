const normalizeQuery = (value) => value.trim().toLowerCase();

const getMatchScore = (wilaya, normalizedQuery) => {
  if (!normalizedQuery) {
    return Number.POSITIVE_INFINITY;
  }

  const candidates = [wilaya.ar_name, wilaya.name, wilaya.id]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  let bestScore = Number.POSITIVE_INFINITY;

  candidates.forEach((candidate) => {
    if (candidate === normalizedQuery) {
      bestScore = Math.min(bestScore, 0);
      return;
    }

    if (candidate.startsWith(normalizedQuery)) {
      bestScore = Math.min(bestScore, 1 + candidate.length / 1000);
      return;
    }

    const matchingWordIndex = candidate
      .split(/\s+/)
      .findIndex((word) => word.startsWith(normalizedQuery));

    if (matchingWordIndex >= 0) {
      bestScore = Math.min(bestScore, 2 + matchingWordIndex / 100 + candidate.length / 1000);
      return;
    }

    const includeIndex = candidate.indexOf(normalizedQuery);
    if (includeIndex >= 0) {
      bestScore = Math.min(bestScore, 3 + includeIndex / 100 + candidate.length / 1000);
    }
  });

  return bestScore;
};

export const getFilteredWilayas = (wilayas, query) => {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return wilayas;
  }

  return [...wilayas]
    .map((wilaya) => ({ wilaya, score: getMatchScore(wilaya, normalizedQuery) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((first, second) => {
      if (first.score !== second.score) {
        return first.score - second.score;
      }

      return Number(first.wilaya.id) - Number(second.wilaya.id);
    })
    .map(({ wilaya }) => wilaya);
};

export const getBestMatchingWilaya = (wilayas, query) => getFilteredWilayas(wilayas, query)[0] || null;
import { getCommunes, wilayas } from '@/lib/algeria-data';
import { getBestMatchingWilaya } from '@/lib/wilayaSearch';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const responseCache = new Map();

const normalizeQuery = (value) => String(value || '').trim().toLowerCase();

const getMatchScore = (item, normalizedQuery) => {
  if (!normalizedQuery) {
    return Number.POSITIVE_INFINITY;
  }

  const candidates = [item.ar_name, item.name, item.id]
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

const fetchCachedJson = async (url) => {
  if (responseCache.has(url)) {
    return responseCache.get(url);
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'ar,en',
    },
  });

  if (!response.ok) {
    throw new Error(`Location lookup failed with status ${response.status}`);
  }

  const payload = await response.json();
  responseCache.set(url, payload);
  return payload;
};

export const getFilteredCommunes = (wilayaId, query) => {
  const communes = getCommunes(String(wilayaId));
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return communes;
  }

  return [...communes]
    .map((commune) => ({ commune, score: getMatchScore(commune, normalizedQuery) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((first, second) => {
      if (first.score !== second.score) {
        return first.score - second.score;
      }

      return Number(first.commune.id) - Number(second.commune.id);
    })
    .map(({ commune }) => commune);
};

export const getBestMatchingCommune = (wilayaId, query) => getFilteredCommunes(wilayaId, query)[0] || null;

export const getWilayaLabel = (wilayaId) => {
  const wilaya = wilayas.find((item) => item.id === String(wilayaId));
  return wilaya ? `${wilaya.id} - ${wilaya.ar_name}` : '';
};

export const geocodeAdministrativeSelection = async ({ wilayaId, communeName }) => {
  const wilaya = wilayas.find((item) => item.id === String(wilayaId));
  if (!wilaya) {
    return null;
  }

  const queryParts = [communeName, wilaya.ar_name, 'الجزائر'].filter(Boolean);
  const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&limit=1&countrycodes=dz&q=${encodeURIComponent(queryParts.join(', '))}`;
  const results = await fetchCachedJson(url);
  const match = Array.isArray(results) ? results[0] : null;

  if (!match?.lat || !match?.lon) {
    return null;
  }

  return {
    latitude: Number(match.lat),
    longitude: Number(match.lon),
  };
};

export const reverseGeocodeAdministrativeSelection = async (latitude, longitude) => {
  const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
  const result = await fetchCachedJson(url);
  const address = result?.address || {};

  if (normalizeQuery(address.country_code) !== 'dz') {
    return null;
  }

  const wilayaQuery = [address.state, address.region, address.county, address.state_district]
    .filter(Boolean)
    .join(' ');
  const wilaya = getBestMatchingWilaya(wilayas, wilayaQuery);

  if (!wilaya) {
    return null;
  }

  const communeCandidates = [
    address.city,
    address.town,
    address.village,
    address.municipality,
    address.city_district,
    address.suburb,
    address.county,
  ].filter(Boolean);

  const commune = communeCandidates
    .map((candidate) => getBestMatchingCommune(wilaya.id, candidate))
    .find(Boolean) || null;

  return {
    wilaya,
    commune,
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
};
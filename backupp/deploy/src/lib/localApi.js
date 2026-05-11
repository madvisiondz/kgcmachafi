const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const DEV_ADMIN_SESSION_KEY = 'kgc_admin_dev_session';

function isDev() {
  return typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
}

function getDevAdminSession() {
  if (!isDev()) return null;
  try {
    const raw = localStorage.getItem(DEV_ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function setDevAdminSession(admin) {
  if (!isDev()) return;
  localStorage.setItem(DEV_ADMIN_SESSION_KEY, JSON.stringify({ admin }));
}

function clearDevAdminSession() {
  if (!isDev()) return;
  localStorage.removeItem(DEV_ADMIN_SESSION_KEY);
}

async function request(url, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  let response;

  try {
    response = await fetch(url, {
      credentials: 'same-origin',
      headers: isFormData
        ? {
            Accept: 'application/json',
            ...(options.headers || {}),
          }
        : {
            ...JSON_HEADERS,
            ...(options.headers || {}),
          },
      ...options,
    });
  } catch (error) {
    throw new Error('تعذر الاتصال بالخادم المحلي.');
  }

  let payload = {};

  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.message || 'حدث خطأ أثناء الاتصال بالخادم المحلي.');
  }

  return payload;
}

export const adminApi = {
  getSession: async () => {
    try {
      return await request('/api/admin/auth/session.php');
    } catch (error) {
      const devSession = getDevAdminSession();
      return { authenticated: Boolean(devSession?.admin), admin: devSession?.admin ?? null };
    }
  },
  login: async (credentials) => {
    try {
      return await request('/api/admin/auth/login.php', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      if (!isDev()) throw error;

      const username = String(credentials?.username ?? '').trim();
      const password = String(credentials?.password ?? '');

      // Dev-only fallback when PHP/MySQL backend isn't running.
      if (username === 'admin' && password === 'admin123') {
        const admin = {
          id: 1,
          username: 'admin',
          full_name: 'Local Dev Admin',
          role: 'admin',
        };
        setDevAdminSession(admin);
        return { message: 'تم تسجيل الدخول بنجاح.', admin };
      }

      throw new Error('بيانات الدخول غير صحيحة.');
    }
  },
  logout: async () => {
    try {
      return await request('/api/admin/auth/logout.php', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } catch (error) {
      clearDevAdminSession();
      return { message: 'تم تسجيل الخروج بنجاح.' };
    }
  },
  listNews: async () => request('/api/admin/news.php'),
  createNews: async (payload) =>
    request('/api/admin/news.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateNews: async (id, payload) =>
    request(`/api/admin/news.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteNews: async (id) =>
    request(`/api/admin/news.php?id=${id}`, {
      method: 'DELETE',
    }),
  listBooks: async () => request('/api/admin/books.php'),
  createBook: async (payload) =>
    request('/api/admin/books.php', {
      method: 'POST',
      body: payload,
    }),
  updateBook: async (id, payload) =>
    (() => {
      if (typeof FormData !== 'undefined' && payload instanceof FormData) {
        payload.append('_method', 'PUT');
        return request(`/api/admin/books.php?id=${id}`, {
          method: 'POST',
          body: payload,
        });
      }

      return request(`/api/admin/books.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    })(),
  deleteBook: async (id) =>
    request(`/api/admin/books.php?id=${id}`, {
      method: 'DELETE',
    }),
  listPrograms: async () => request('/api/admin/programs.php'),
  createProgram: async (payload) =>
    (() => {
      if (typeof FormData !== 'undefined' && payload instanceof FormData) {
        return request('/api/admin/programs.php', {
          method: 'POST',
          body: payload,
        });
      }

      return request('/api/admin/programs.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    })(),
  updateProgram: async (id, payload) =>
    (() => {
      if (typeof FormData !== 'undefined' && payload instanceof FormData) {
        payload.append('_method', 'PUT');
        return request(`/api/admin/programs.php?id=${id}`, {
          method: 'POST',
          body: payload,
        });
      }

      return request(`/api/admin/programs.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    })(),
  deleteProgram: async (id) =>
    request(`/api/admin/programs.php?id=${id}`, {
      method: 'DELETE',
    }),
  listPharmacies: async () => request('/api/admin/pharmacies.php'),
  createPharmacy: async (payload) =>
    request('/api/admin/pharmacies.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updatePharmacy: async (id, payload) =>
    request(`/api/admin/pharmacies.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deletePharmacy: async (id) =>
    request(`/api/admin/pharmacies.php?id=${id}`, {
      method: 'DELETE',
    }),
  listHospitals: async () => request('/api/admin/hospitals.php'),
  createHospital: async (payload) =>
    request('/api/admin/hospitals.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateHospital: async (id, payload) =>
    request(`/api/admin/hospitals.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteHospital: async (id) =>
    request(`/api/admin/hospitals.php?id=${id}`, {
      method: 'DELETE',
    }),
  listInternationalHospitals: async () => request('/api/admin/international-hospitals.php'),
  createInternationalHospital: async (payload) =>
    request('/api/admin/international-hospitals.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateInternationalHospital: async (id, payload) =>
    request(`/api/admin/international-hospitals.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteInternationalHospital: async (id) =>
    request(`/api/admin/international-hospitals.php?id=${id}`, {
      method: 'DELETE',
    }),
  listAmbulances: async () => request('/api/admin/ambulances.php'),
  createAmbulance: async (payload) =>
    request('/api/admin/ambulances.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAmbulance: async (id, payload) =>
    request(`/api/admin/ambulances.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAmbulance: async (id) =>
    request(`/api/admin/ambulances.php?id=${id}`, {
      method: 'DELETE',
    }),
  listAccommodations: async () => request('/api/admin/accommodations.php'),
  createAccommodation: async (payload) =>
    request('/api/admin/accommodations.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAccommodation: async (id, payload) =>
    request(`/api/admin/accommodations.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAccommodation: async (id) =>
    request(`/api/admin/accommodations.php?id=${id}`, {
      method: 'DELETE',
    }),
  getSiteSettings: async () => request('/api/admin/site-settings.php'),
  updateSiteSettings: async (settings) =>
    request('/api/admin/site-settings.php', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    }),
  listHeroStats: async () => request('/api/admin/hero-stats.php'),
  createHeroStat: async (payload) =>
    request('/api/admin/hero-stats.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateHeroStat: async (id, payload) =>
    request(`/api/admin/hero-stats.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteHeroStat: async (id) =>
    request(`/api/admin/hero-stats.php?id=${id}`, {
      method: 'DELETE',
    }),
  listServicesContent: async () => request('/api/admin/services-content.php'),
  createServiceContent: async (payload) =>
    request('/api/admin/services-content.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateServiceContent: async (id, payload) =>
    request(`/api/admin/services-content.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteServiceContent: async (id) =>
    request(`/api/admin/services-content.php?id=${id}`, {
      method: 'DELETE',
    }),
  listVideoPrograms: async () => request('/api/admin/video-programs.php'),
  createVideoProgram: async (payload) =>
    request('/api/admin/video-programs.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateVideoProgram: async (id, payload) =>
    request(`/api/admin/video-programs.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteVideoProgram: async (id) =>
    request(`/api/admin/video-programs.php?id=${id}`, {
      method: 'DELETE',
    }),
  listConsultationSpecialties: async () => request('/api/admin/consultation-specialties.php'),
  createConsultationSpecialty: async (payload) =>
    request('/api/admin/consultation-specialties.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateConsultationSpecialty: async (id, payload) =>
    request(`/api/admin/consultation-specialties.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteConsultationSpecialty: async (id) =>
    request(`/api/admin/consultation-specialties.php?id=${id}`, {
      method: 'DELETE',
    }),
  listConsultationDoctors: async () => request('/api/admin/consultation-doctors.php'),
  createConsultationDoctor: async (payload) =>
    request('/api/admin/consultation-doctors.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateConsultationDoctor: async (id, payload) =>
    request(`/api/admin/consultation-doctors.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteConsultationDoctor: async (id) =>
    request(`/api/admin/consultation-doctors.php?id=${id}`, {
      method: 'DELETE',
    }),

  listPublicUsers: async ({ q, limit } = {}) => {
    const searchParams = new URLSearchParams();
    if (q) searchParams.set('q', q);
    if (limit) searchParams.set('limit', String(limit));
    const query = searchParams.toString();
    return request(`/api/admin/public-users.php${query ? `?${query}` : ''}`);
  },
  updatePublicUserRole: async (id, role) =>
    request(`/api/admin/public-users.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
};

export const publicAuthApi = {
  getSession: async () => request('/api/public/auth/session.php'),
  login: async (credentials) =>
    request('/api/public/auth/login.php', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: async (payload) =>
    request('/api/public/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: async () =>
    request('/api/public/auth/logout.php', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
};

export const contentApi = {
  listNews: async ({ archived = false, limit } = {}) => {
    const searchParams = new URLSearchParams();

    if (archived) {
      searchParams.set('archived', '1');
    }

    if (limit) {
      searchParams.set('limit', String(limit));
    }

    const query = searchParams.toString();
    return request(`/api/public/news.php${query ? `?${query}` : ''}`);
  },
  getNewsItem: async (id) => request(`/api/public/news.php?id=${id}`),
  listNewsComments: async (newsId) => request(`/api/public/news-comments.php?news_id=${newsId}`),
  createNewsComment: async (payload) =>
    request('/api/public/news-comments.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteNewsComment: async (id) =>
    request(`/api/public/news-comments.php?id=${id}`, {
      method: 'DELETE',
    }),
  getNewsRatings: async (newsId) => request(`/api/public/news-ratings.php?news_id=${newsId}`),
  rateNews: async (payload) =>
    request('/api/public/news-ratings.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listReviews: async ({ type, targetId }) =>
    request(`/api/public/reviews.php?type=${encodeURIComponent(type)}&target_id=${targetId}`),
  createReview: async (payload) =>
    request('/api/public/reviews.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listBooks: async () => request('/api/public/books.php'),
  listPrograms: async () => request('/api/public/programs.php'),
  listPharmacies: async () => request('/api/public/pharmacies.php'),
  listHospitals: async ({ wilayaId, type, city } = {}) => {
    const searchParams = new URLSearchParams();

    if (wilayaId) {
      searchParams.set('wilaya', wilayaId);
    }

    if (type && type !== 'all') {
      searchParams.set('type', type);
    }

    if (city) {
      searchParams.set('city', city);
    }

    const query = searchParams.toString();
    return request(`/api/public/hospitals.php${query ? `?${query}` : ''}`);
  },
  listInternationalHospitals: async ({ country, specialty } = {}) => {
    const searchParams = new URLSearchParams();

    if (country && country !== 'all') {
      searchParams.set('country', country);
    }

    if (specialty && specialty !== 'all') {
      searchParams.set('specialty', specialty);
    }

    const query = searchParams.toString();
    return request(`/api/public/international-hospitals.php${query ? `?${query}` : ''}`);
  },
  listAmbulances: async ({ wilayaId } = {}) => {
    const searchParams = new URLSearchParams();

    if (wilayaId) {
      searchParams.set('wilaya', wilayaId);
    }

    const query = searchParams.toString();
    return request(`/api/public/ambulances.php${query ? `?${query}` : ''}`);
  },
  createAmbulance: async (payload) =>
    request('/api/public/ambulances.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listAccommodations: async ({ wilayaId } = {}) => {
    const searchParams = new URLSearchParams();

    if (wilayaId) {
      searchParams.set('wilaya', wilayaId);
    }

    const query = searchParams.toString();
    return request(`/api/public/accommodations.php${query ? `?${query}` : ''}`);
  },
  createAccommodation: async (payload) =>
    request('/api/public/accommodations.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getSiteContent: async () => {
    try {
      return await request('/api/public/site-content.php');
    } catch (error) {
      // Dev fallback: allow app to render even if PHP API isn't running.
      return {
        settings: {},
        hero_stats: [],
        services: [],
        video_programs: [],
        consultation_specialties: [],
        consultation_doctors: [],
      };
    }
  },
};

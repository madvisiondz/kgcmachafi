/** Shared field/column configs for CrudResourcePage */

/** @param {Record<string, unknown>} form */
function buildServicesBody(form) {
  const split = (s) =>
    String(s || '')
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  return {
    icon_key: String(form.icon_key || 'heart'),
    title: String(form.title || ''),
    description: String(form.description || ''),
    details: String(form.details || ''),
    features: split(form.features),
    color_class: String(form.color_class || ''),
    bg_class: String(form.bg_class || ''),
    sort_order: Number(form.sort_order || 0),
    is_active: Boolean(form.is_active),
  };
}

export const servicesCrud = {
  title: 'Services catalog',
  apiPath: '/admin/services-content.php',
  buildSaveBody: buildServicesBody,
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'icon_key', label: 'Icon' },
    { key: 'sort_order', label: 'Order' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'icon_key', label: 'Icon key', type: 'text' },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Short description', type: 'textarea', required: true },
    { key: 'details', label: 'Details', type: 'textarea' },
    {
      key: 'features',
      label: 'Feature bullets (comma or new line)',
      type: 'textarea',
      helper: 'Each line becomes one bullet on the public site.',
    },
    { key: 'color_class', label: 'Gradient classes (Tailwind)', type: 'text' },
    { key: 'bg_class', label: 'Background class (Tailwind)', type: 'text' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['title', 'description'],
};

export const newsCrud = {
  title: 'News articles',
  apiPath: '/admin/news.php',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date' },
    { key: 'tag', label: 'Tag' },
    { key: 'is_archived', label: 'Archived' },
  ],
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Short description', type: 'textarea', required: true },
    { key: 'content', label: 'Full content (optional)', type: 'textarea' },
    { key: 'tag', label: 'Tag', type: 'text' },
    { key: 'source', label: 'Source', type: 'text' },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'slug', label: 'Slug (optional, unique)', type: 'text', helper: 'Leave empty if you do not use SEO slugs.' },
    { key: 'is_archived', label: 'Archived (hidden from main lists)', type: 'checkbox' },
  ],
  searchKeys: ['title', 'description', 'tag', 'source'],
};

export const pharmaciesCrud = {
  title: 'Pharmacies',
  apiPath: '/admin/pharmacies.php',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'wilaya', label: 'Wilaya' },
    { key: 'commune', label: 'Commune' },
    { key: 'phone', label: 'Phone' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'name', label: 'Pharmacy name', type: 'text', required: true },
    { key: 'wilaya', label: 'Wilaya code (e.g. 16)', type: 'text', required: true },
    { key: 'commune', label: 'Commune / city', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'latitude', label: 'Latitude (optional)', type: 'text', helper: 'Decimal number or leave empty.' },
    { key: 'longitude', label: 'Longitude (optional)', type: 'text' },
    { key: 'is_night_duty', label: 'Night duty pharmacy', type: 'checkbox' },
    { key: 'is_active', label: 'Visible on website', type: 'checkbox' },
  ],
  searchKeys: ['name', 'wilaya', 'commune', 'phone'],
};

export const hospitalsCrud = {
  title: 'Hospitals (Algeria)',
  apiPath: '/admin/hospitals.php',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'wilaya_id', label: 'Wilaya' },
    { key: 'city', label: 'City' },
    { key: 'type', label: 'Type' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'name', label: 'Hospital name', type: 'text', required: true },
    { key: 'type', label: 'Type (public/private/clinic)', type: 'text', required: true },
    { key: 'wilaya_id', label: 'Wilaya code', type: 'text', required: true },
    { key: 'city', label: 'City', type: 'text', required: true },
    { key: 'address', label: 'Address', type: 'textarea' },
    {
      key: 'specialties',
      label: 'Specialties (comma or line per item)',
      type: 'textarea',
      helper: 'Example: Cardiology, Emergency',
    },
    { key: 'rating', label: 'Rating (0–5)', type: 'number' },
    { key: 'reviews_count', label: 'Reviews count', type: 'number' },
    { key: 'hours', label: 'Opening hours text', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'website', label: 'Website URL', type: 'text' },
    {
      key: 'payment_methods',
      label: 'Payment methods (comma or lines)',
      type: 'textarea',
    },
    {
      key: 'insurance_providers',
      label: 'Insurance providers (comma or lines)',
      type: 'textarea',
    },
    { key: 'features', label: 'Features (comma or lines)', type: 'textarea' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['name', 'city', 'wilaya_id'],
};

export const intlHospitalsCrud = {
  title: 'International hospitals',
  apiPath: '/admin/international-hospitals.php',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'country', label: 'Country code (e.g. turkey)', type: 'text', required: true },
    { key: 'city', label: 'City', type: 'text', required: true },
    { key: 'specialty', label: 'Specialty key', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'reviews_count', label: 'Reviews count', type: 'number' },
    { key: 'hours', label: 'Hours', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'website', label: 'Website', type: 'text' },
    { key: 'payment_methods', label: 'Payment methods (comma/lines)', type: 'textarea' },
    { key: 'insurance_providers', label: 'Insurance (comma/lines)', type: 'textarea' },
    { key: 'features', label: 'Features (comma/lines)', type: 'textarea' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['name', 'city', 'country'],
};

export const ambulancesCrud = {
  title: 'Ambulances',
  apiPath: '/admin/ambulances.php',
  columns: [
    { key: 'owner_name', label: 'Owner' },
    { key: 'phone', label: 'Phone' },
    { key: 'wilaya_id', label: 'Wilaya' },
    { key: 'city', label: 'City' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'owner_name', label: 'Owner / service name', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'wilaya_id', label: 'Wilaya code', type: 'text', required: true },
    { key: 'city', label: 'City', type: 'text', required: true },
    { key: 'vehicle_type', label: 'Vehicle type', type: 'text' },
    { key: 'price_description', label: 'Price description', type: 'text' },
    { key: 'latitude', label: 'Latitude', type: 'text' },
    { key: 'longitude', label: 'Longitude', type: 'text' },
    { key: 'is_free', label: 'Free service', type: 'checkbox' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['owner_name', 'phone', 'city'],
};

export const accommodationsCrud = {
  title: 'Patient accommodations',
  apiPath: '/admin/accommodations.php',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'owner_name', label: 'Owner' },
    { key: 'city', label: 'City' },
    { key: 'price_per_night', label: 'Price/night' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'title', label: 'Listing title', type: 'text', required: true },
    { key: 'owner_name', label: 'Owner name', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'wilaya_id', label: 'Wilaya code', type: 'text', required: true },
    { key: 'city', label: 'City', type: 'text', required: true },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'price_per_night', label: 'Price per night (DZD)', type: 'number' },
    { key: 'capacity', label: 'Capacity (guests)', type: 'number' },
    { key: 'latitude', label: 'Latitude', type: 'text' },
    { key: 'longitude', label: 'Longitude', type: 'text' },
    { key: 'is_free', label: 'Free hosting', type: 'checkbox' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['title', 'city', 'owner_name'],
};

export const programsCrud = {
  title: 'TV / Programs schedule',
  apiPath: '/admin/programs.php',
  mutator: 'postPut',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'time_slot', label: 'Time' },
    { key: 'day_type', label: 'Day type' },
    { key: 'category', label: 'Category' },
  ],
  fields: [
    { key: 'title', label: 'Program title', type: 'text', required: true },
    { key: 'time_slot', label: 'Time slot (e.g. 09:00)', type: 'text', required: true },
    { key: 'days_of_week', label: 'Days of week (comma, 0=Sun … 6=Sat)', type: 'text' },
    { key: 'day_type', label: 'day_type (daily/weekly/…)', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'video_url', label: 'Video URL (https)', type: 'text', helper: 'Paste a link to the video file.' },
    { key: 'image_url', label: 'Cover image URL', type: 'text' },
    { key: 'video_duration_seconds', label: 'Duration (seconds)', type: 'number' },
    { key: 'video_duration_label', label: 'Duration label (e.g. 35 min)', type: 'text' },
  ],
  searchKeys: ['title', 'category', 'program_key'],
};

export const booksCrud = {
  title: 'Library — books',
  apiPath: '/admin/books.php',
  mutator: 'postPut',
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' },
    { key: 'book_type', label: 'Type' },
  ],
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'author', label: 'Author', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    {
      key: 'book_type',
      label: 'Book type',
      type: 'select',
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'ebook', label: 'E-book' },
      ],
    },
    {
      key: 'file_path',
      label: 'File path or PDF URL',
      type: 'text',
      required: true,
      helper: 'Use # as placeholder until a real PDF is uploaded on the server.',
    },
    { key: 'image_url', label: 'Cover image URL', type: 'text' },
    { key: 'pages', label: 'Pages', type: 'number' },
    { key: 'rating', label: 'Rating', type: 'number' },
  ],
  searchKeys: ['title', 'author', 'category'],
};

export const consultationSpecialtiesCrud = {
  title: 'Consultation specialties',
  apiPath: '/admin/consultation-specialties.php',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'specialty_key', label: 'Key' },
    { key: 'doctors_count', label: 'Doctors' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'specialty_key', label: 'Machine key (unique)', type: 'text', required: true },
    { key: 'name', label: 'Display name', type: 'text', required: true },
    { key: 'icon_emoji', label: 'Icon emoji', type: 'text' },
    { key: 'color_class', label: 'Tailwind color classes', type: 'text' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['name', 'specialty_key'],
};

export const consultationDoctorsCrud = {
  title: 'Consultation doctors',
  apiPath: '/admin/consultation-doctors.php',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'specialty_name', label: 'Specialty' },
    { key: 'wilaya_id', label: 'Wilaya' },
    { key: 'price', label: 'Price' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'specialty_id', label: 'Specialty database ID', type: 'number', required: true, helper: 'Open Specialties page to see IDs.' },
    { key: 'name', label: 'Doctor name', type: 'text', required: true },
    { key: 'hospital', label: 'Hospital', type: 'text' },
    { key: 'clinic_name', label: 'Clinic name', type: 'text' },
    { key: 'wilaya_id', label: 'Wilaya code', type: 'text', required: true },
    { key: 'commune_id', label: 'Commune code / name', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'experience_years', label: 'Years experience', type: 'number' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'price', label: 'Consultation price', type: 'number' },
    { key: 'currency', label: 'Currency (DZD)', type: 'text' },
    { key: 'supports_remote', label: 'Remote OK', type: 'checkbox' },
    { key: 'supports_in_person', label: 'In person OK', type: 'checkbox' },
    { key: 'is_verified', label: 'Verified badge', type: 'checkbox' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['name', 'hospital', 'phone'],
};

export const heroStatsCrud = {
  title: 'Homepage — hero numbers',
  apiPath: '/admin/hero-stats.php',
  columns: [
    { key: 'label', label: 'Label' },
    { key: 'value', label: 'Value' },
    { key: 'icon_key', label: 'Icon' },
    { key: 'sort_order', label: 'Order' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'icon_key', label: 'Icon key', type: 'text' },
    { key: 'label', label: 'Label', type: 'text', required: true },
    { key: 'value', label: 'Value text', type: 'text', required: true },
    { key: 'color_class', label: 'Tailwind gradient classes', type: 'text' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['label', 'value'],
};

export const homepageSectionsCrud = {
  title: 'Homepage — sections',
  apiPath: '/admin/homepage-sections.php',
  columns: [
    { key: 'section_key', label: 'Key' },
    { key: 'title', label: 'Title' },
    { key: 'sort_order', label: 'Order' },
    { key: 'is_active', label: 'Active' },
  ],
  fields: [
    { key: 'section_key', label: 'Section key (unique)', type: 'text', required: true },
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    {
      key: 'payload_json',
      label: 'Payload (JSON)',
      type: 'json',
      jsonTarget: 'payload',
      helper: 'Structured data for this block — valid JSON object.',
    },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
    { key: 'is_active', label: 'Visible', type: 'checkbox' },
  ],
  searchKeys: ['section_key', 'title'],
};

export const liveRecordedCrud = {
  title: 'Live — recorded items',
  apiPath: '/admin/live-recorded-items.php',
  mutator: 'postUpsert',
  idKey: 'id',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'program_key', label: 'Program' },
    { key: 'category', label: 'Category' },
    { key: 'duration_min', label: 'Min' },
  ],
  fields: [
    { key: 'id', label: 'Row ID (short code)', type: 'text', required: true, helper: 'Example: vod-3' },
    { key: 'program_key', label: 'Program key', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'duration_min', label: 'Duration minutes', type: 'number' },
    { key: 'video_url', label: 'Video URL', type: 'textarea' },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
  ],
  searchKeys: ['id', 'program_key'],
};

export const liveUpNextCrud = {
  title: 'Live — up next',
  apiPath: '/admin/live-up-next.php',
  mutator: 'postUpsert',
  idKey: 'id',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'program_key', label: 'Program' },
    { key: 'start_time', label: 'Start' },
    { key: 'sort_order', label: 'Order' },
  ],
  fields: [
    { key: 'id', label: 'Row ID', type: 'text', required: true },
    { key: 'program_key', label: 'Program key', type: 'text', required: true },
    { key: 'start_time', label: 'Start time (HH:MM)', type: 'text', required: true },
    { key: 'sort_order', label: 'Sort order', type: 'number' },
  ],
  searchKeys: ['id', 'program_key'],
};

import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import CrudResourcePage from '../../../components/admin/healthservices/CrudResourcePage';
import { heroStatsCrud, homepageSectionsCrud } from './healthAdminCrudConfigs';

export default function HomepageAdminPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState('sections');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-slate-900">{t('admin.hsvc.navHomepage')}</h1>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('sections')}
          className={`rounded-full px-4 py-2 text-xs font-bold ${tab === 'sections' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}
        >
          Sections
        </button>
        <button
          type="button"
          onClick={() => setTab('hero')}
          className={`rounded-full px-4 py-2 text-xs font-bold ${tab === 'hero' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}
        >
          Hero numbers
        </button>
      </div>
      {tab === 'sections' ? <CrudResourcePage {...homepageSectionsCrud} /> : null}
      {tab === 'hero' ? <CrudResourcePage {...heroStatsCrud} /> : null}
    </div>
  );
}

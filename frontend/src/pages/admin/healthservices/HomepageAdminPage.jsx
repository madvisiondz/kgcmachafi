import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nProvider';
import CrudResourcePage from '../../../components/admin/healthservices/CrudResourcePage';
import { heroStatsCrud, homepageSectionsCrud } from './healthAdminCrudConfigs';
import * as ui from '../../../components/admin/healthservices/adminUiClasses';

export default function HomepageAdminPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState('sections');

  return (
    <div className="space-y-4">
      <h1 className={ui.pageTitle}>{t('admin.hsvc.navHomepage')}</h1>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTab('sections')} className={tab === 'sections' ? ui.tabActive : ui.tabInactive}>
          {t('admin.hsvc.crudHomepageSections')}
        </button>
        <button type="button" onClick={() => setTab('hero')} className={tab === 'hero' ? ui.tabActive : ui.tabInactive}>
          {t('admin.hsvc.crudHeroStats')}
        </button>
      </div>
      {tab === 'sections' ? <CrudResourcePage {...homepageSectionsCrud} /> : null}
      {tab === 'hero' ? <CrudResourcePage {...heroStatsCrud} /> : null}
    </div>
  );
}

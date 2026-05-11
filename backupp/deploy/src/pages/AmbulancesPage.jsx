import React from 'react';
import AmbulanceDirectory from '@/components/AmbulanceDirectory';
import HealthMap from '@/components/HealthMap';

const AmbulancesPage = () => {
  return (
    <div className="space-y-16">
      <AmbulanceDirectory />
      <HealthMap />
    </div>
  );
};

export default AmbulancesPage;

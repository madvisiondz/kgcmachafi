import React from 'react';
import AccommodationDirectory from '@/components/AccommodationDirectory';
import AccommodationMap from '@/components/AccommodationMap';

const AccommodationsPage = () => {
  return (
    <div className="space-y-12">
      <AccommodationDirectory />
      <AccommodationMap />
    </div>
  );
};

export default AccommodationsPage;

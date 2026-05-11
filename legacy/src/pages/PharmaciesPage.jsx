import React from 'react';
import AlgeriaPharmacies from '@/components/AlgeriaPharmacies';
import Laboratories from '@/components/Laboratories';

const PharmaciesPage = () => {
  return (
    <div className="space-y-16">
      <AlgeriaPharmacies />
      <Laboratories />
    </div>
  );
};

export default PharmaciesPage;

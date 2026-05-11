import React from 'react';
import ProgramSchedule from '@/components/ProgramSchedule';
import ProgramVideoGallery from '@/components/ProgramVideoGallery';

const ProgramsPage = () => {
  return (
    <div className="space-y-12">
      <ProgramVideoGallery />
      <ProgramSchedule />
    </div>
  );
};

export default ProgramsPage;

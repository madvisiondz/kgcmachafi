import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { contentApi } from '@/lib/localApi';
import { DAYS, getTargetDays } from '@/lib/programSchedule';

const ProgramSchedule = () => {
  const [currentDay, setCurrentDay] = useState(() => new Date().getDay());
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const { items } = await contentApi.listPrograms();
        setPrograms(items || []);
      } catch (error) {
        console.error('Failed to load programs', error);
      }
    };

    loadPrograms();
  }, []);

  const groupedSchedule = useMemo(() => {
    return programs.reduce((accumulator, item) => {
      const programItem = {
        ...item,
        program: item.title,
        time: String(item.time_slot || '').slice(0, 5),
      };

      getTargetDays(item).forEach((day) => {
        if (!accumulator[day]) {
          accumulator[day] = [];
        }

        accumulator[day].push(programItem);
        accumulator[day].sort((left, right) => String(left.time).localeCompare(String(right.time)));
      });

      return accumulator;
    }, {});
  }, [programs]);

  const currentSchedule = groupedSchedule[currentDay] || [];

  const nextDay = () => {
    setCurrentDay((prev) => (prev + 1) % 7);
  };

  const prevDay = () => {
    setCurrentDay((prev) => (prev - 1 + 7) % 7);
  };

  return (
    <section id="schedule" className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              جدول البرامج اليومي
            </span>
          </h2>
          <p className="text-gray-600 text-lg">برامج صحية متنوعة قادمة مباشرة من لوحة التحكم المحلية</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={prevDay}
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-blue-50 border-blue-600 text-blue-600"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">{DAYS[currentDay]}</h3>
            </div>

            <Button
              onClick={nextDay}
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-blue-50 border-blue-600 text-blue-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          {currentSchedule.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-slate-50 rounded-xl border border-dashed">
              لا توجد برامج محفوظة لهذا اليوم بعد.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentSchedule.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.program}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-end bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-500 p-6">
                        <div className="max-w-[75%] text-white">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/75">KGC</p>
                          <h4 className="mt-2 text-2xl font-bold leading-tight">{item.program}</h4>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-lg">
                      {item.time}
                    </div>
                    {item.category && (
                      <div className="absolute bottom-4 right-4 rounded-full bg-orange-500/95 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {item.category}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{item.program}</h4>
                      {item.description ? (
                        <p className="mt-2 h-12 overflow-hidden text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-400">
                          برنامج صحي ضمن الجدول اليومي للقناة.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-400">
                        يعرض يوم {DAYS[currentDay]}
                      </span>
                      {item.video_url ? (
                        <Button
                          size="sm"
                          className="gap-2 rounded-full bg-orange-600 px-4 hover:bg-orange-700"
                          onClick={() => setSelectedProgram(item)}
                        >
                          <Play className="w-4 h-4" />
                          مشاهدة
                        </Button>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">بدون فيديو</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <Dialog open={Boolean(selectedProgram)} onOpenChange={(open) => { if (!open) setSelectedProgram(null); }}>
        <DialogContent className="max-w-5xl">
          {selectedProgram && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProgram.program}</DialogTitle>
              </DialogHeader>
              <video
                src={selectedProgram.video_url}
                controls
                className="w-full rounded-lg bg-black"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProgramSchedule;

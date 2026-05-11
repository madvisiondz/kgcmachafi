import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Clock3, Play, Sparkles, Tv2 } from 'lucide-react';
import { contentApi } from '@/lib/localApi';
import { DAYS, formatCountdown, formatDurationLabel, formatProgramTime, getProgramSnapshot } from '@/lib/programSchedule';

const ProgramArtwork = ({ program, className = '' }) => {
  if (program?.image_url) {
    return (
      <img
        src={program.image_url}
        alt={program.title}
        className={className || 'h-full w-full object-cover'}
      />
    );
  }

  return (
    <div className={`flex h-full w-full items-end bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-500 p-6 text-white ${className}`}>
      <div className="max-w-[80%]">
        <p className="text-xs uppercase tracking-[0.32em] text-white/75">KGC</p>
        <h3 className="mt-3 text-2xl font-bold leading-tight">{program?.title || 'برنامج صحي'}</h3>
      </div>
    </div>
  );
};

const StatusBadge = ({ activeOccurrence, currentOccurrence, referenceNow }) => {
  if (!activeOccurrence) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
        <Tv2 className="h-4 w-4" />
        لا يوجد اختيار
      </div>
    );
  }

  if (currentOccurrence?.id === activeOccurrence.id) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
        <Sparkles className="h-4 w-4" />
        يعرض الآن
      </div>
    );
  }

  if (activeOccurrence.startAt.getTime() > referenceNow.getTime()) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">
        <Clock3 className="h-4 w-4" />
        سيعرض قريبًا
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
      <ArrowDownLeft className="h-4 w-4" />
      عرض سابق
    </div>
  );
};

const ProgramMetaCard = ({ icon: Icon, label, value, accentClass }) => (
  <div className="rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm backdrop-blur">
    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${accentClass}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <p className="mt-3 text-xs font-medium text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-bold text-slate-900">{value || 'غير متوفر'}</p>
  </div>
);

const ProgramVideoGallery = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const { items } = await contentApi.listPrograms();
        setPrograms(items || []);
      } catch (error) {
        console.error('Failed to load program videos', error);
      }
    };

    loadPrograms();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const snapshot = useMemo(() => getProgramSnapshot(programs, now), [programs, now]);
  const {
    currentOccurrence,
    nextOccurrence,
    previousOccurrence,
    upcomingOccurrences,
  } = snapshot;

  useEffect(() => {
    const fallbackOccurrence = currentOccurrence || nextOccurrence || upcomingOccurrences[0] || null;

    if (!fallbackOccurrence) {
      setSelectedOccurrenceId(null);
      return;
    }

    setSelectedOccurrenceId((currentSelected) => currentSelected || fallbackOccurrence.id);
  }, [currentOccurrence, nextOccurrence, upcomingOccurrences]);

  const selectedOccurrence = useMemo(() => {
    const source = [
      ...(currentOccurrence ? [currentOccurrence] : []),
      ...upcomingOccurrences,
      ...(previousOccurrence ? [previousOccurrence] : []),
    ];

    return source.find((item) => item.id === selectedOccurrenceId)
      || currentOccurrence
      || nextOccurrence
      || upcomingOccurrences[0]
      || previousOccurrence
      || null;
  }, [currentOccurrence, nextOccurrence, previousOccurrence, selectedOccurrenceId, upcomingOccurrences]);

  const sidebarOccurrences = useMemo(() => {
    if (upcomingOccurrences.length > 0) {
      return upcomingOccurrences;
    }

    return [];
  }, [upcomingOccurrences]);

  const hasAnyPrograms = programs.length > 0;

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 bg-clip-text text-transparent">
              بث البرامج وجدول العرض
            </span>
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            الصفحة تحدد البرنامج الحالي والقادم تلقائيًا حسب اليوم والتوقيت من لوحة التحكم
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
            {currentOccurrence ? (
              <>
                <div className="grid gap-0 lg:grid-cols-[1.3fr_0.9fr]">
                  <div className="relative min-h-[340px] overflow-hidden bg-slate-950">
                    {selectedOccurrence?.program?.video_url ? (
                      <video
                        key={selectedOccurrence.id}
                        src={selectedOccurrence.program.video_url}
                        poster={selectedOccurrence.program.image_url || undefined}
                        controls
                        className="h-full w-full bg-black object-contain"
                      />
                    ) : (
                      <ProgramArtwork program={selectedOccurrence?.program || currentOccurrence.program} className="h-full w-full object-cover" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute right-5 top-5">
                      <StatusBadge activeOccurrence={selectedOccurrence} currentOccurrence={currentOccurrence} referenceNow={now} />
                    </div>
                    {selectedOccurrence?.program?.video_url && (
                      <div className="pointer-events-none absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-2xl">
                        <Play className="h-6 w-6 text-orange-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between bg-gradient-to-br from-white via-orange-50 to-amber-50 p-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">
                        <Tv2 className="h-4 w-4" />
                        {selectedOccurrence?.dayLabel || DAYS[now.getDay()]}
                      </div>
                      <h3 className="mt-4 text-3xl font-bold leading-tight text-slate-950">
                        {selectedOccurrence?.program?.title || currentOccurrence.program.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {selectedOccurrence?.program?.description || 'برنامج صحي يُعرض ضمن الشبكة اليومية للقناة.'}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <ProgramMetaCard
                        icon={Clock3}
                        label="موعد العرض"
                        value={`${selectedOccurrence?.dayLabel || ''} - ${selectedOccurrence?.timeLabel || ''}`}
                        accentClass="bg-gradient-to-br from-sky-500 to-cyan-600"
                      />
                      <ProgramMetaCard
                        icon={ArrowUpRight}
                        label="البرنامج التالي"
                        value={nextOccurrence?.program?.title || 'لا يوجد برنامج لاحق'}
                        accentClass="bg-gradient-to-br from-orange-500 to-red-500"
                      />
                      <ProgramMetaCard
                        icon={ArrowDownLeft}
                        label="البرنامج السابق"
                        value={previousOccurrence?.program?.title || 'لا يوجد برنامج سابق'}
                        accentClass="bg-gradient-to-br from-slate-500 to-slate-700"
                      />
                      <ProgramMetaCard
                        icon={Play}
                        label="مدة الفيديو"
                        value={selectedOccurrence?.program?.video_duration_label || formatDurationLabel(selectedOccurrence?.program?.video_duration_seconds) || 'غير متوفرة'}
                        accentClass="bg-gradient-to-br from-emerald-500 to-green-600"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden p-8 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_34%)]" />
                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                    <Tv2 className="h-4 w-4 text-orange-500" />
                    حالة البث الحالية
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-950">لا توجد برامج للعرض الآن</h3>
                    <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                      {hasAnyPrograms
                        ? 'سيظهر هنا البرنامج الجاري بثه تلقائيًا بمجرد دخول وقت عرضه. يمكنك الآن تصفح البرامج القادمة من القائمة الجانبية.'
                        : 'لم تتم إضافة أي برامج إلى الجدول بعد. أضف برامج من لوحة التحكم لتظهر هنا تلقائيًا.'}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
                    <ProgramMetaCard
                      icon={ArrowUpRight}
                      label="البرنامج التالي"
                      value={nextOccurrence ? `${nextOccurrence.program.title} - ${formatCountdown(nextOccurrence.startAt, now)}` : 'لا يوجد برنامج مجدول'}
                      accentClass="bg-gradient-to-br from-orange-500 to-red-500"
                    />
                    <ProgramMetaCard
                      icon={ArrowDownLeft}
                      label="آخر برنامج"
                      value={previousOccurrence?.program?.title || 'لا يوجد برنامج سابق'}
                      accentClass="bg-gradient-to-br from-slate-500 to-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
              <p className="text-xs font-bold tracking-[0.25em] text-white/60">UP NEXT</p>
              <h3 className="mt-2 text-2xl font-bold">البرامج القادمة</h3>
              <p className="mt-2 text-sm text-white/70">
                تتحدث تلقائيًا حسب اليوم والوقت
              </p>
            </div>

            {sidebarOccurrences.length === 0 ? (
              <div className="flex min-h-[420px] items-center justify-center p-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <Clock3 className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">لا توجد برامج قادمة الآن</h4>
                  <p className="text-sm leading-7 text-slate-500">
                    ستظهر هنا البرامج التالية تلقائيًا عند توفر مواعيد قادمة في الجدول.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-h-[820px] space-y-4 overflow-y-auto p-4">
                {sidebarOccurrences.map((occurrence, index) => {
                  const isActive = occurrence.id === selectedOccurrence?.id;

                  return (
                    <motion.button
                      key={occurrence.id}
                      type="button"
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => setSelectedOccurrenceId(occurrence.id)}
                      className={`w-full overflow-hidden rounded-3xl border text-right transition-all ${isActive ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg'}`}
                    >
                      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 p-3">
                        <div className="overflow-hidden rounded-2xl bg-slate-100">
                          <div className="aspect-square">
                            <ProgramArtwork program={occurrence.program} className="h-full w-full object-cover" />
                          </div>
                        </div>

                        <div className="min-w-0 space-y-2 py-1">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="line-clamp-1 text-base font-bold text-slate-900">{occurrence.program.title}</h4>
                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                              {occurrence.timeLabel}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                            {occurrence.program.description || 'وصف البرنامج غير متوفر حاليًا.'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {occurrence.dayLabel}
                            </span>
                            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                              بعد {formatCountdown(occurrence.startAt, now)}
                            </span>
                            {(occurrence.program.video_duration_label || occurrence.program.video_duration_seconds) && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                {occurrence.program.video_duration_label || formatDurationLabel(occurrence.program.video_duration_seconds)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </motion.div>
    </section>
  );
};

export default ProgramVideoGallery;

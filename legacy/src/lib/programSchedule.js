export const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const DEFAULT_PROGRAM_DURATION_MINUTES = 60;

export const formatProgramTime = (value) => String(value || '').slice(0, 5);

export const formatDurationLabel = (totalSeconds) => {
  const safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));

  if (!safeSeconds) {
    return '';
  }

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const timeToMinutes = (value) => {
  const [hours, minutes] = formatProgramTime(value).split(':').map((part) => Number(part));
  return ((Number.isNaN(hours) ? 0 : hours) * 60) + (Number.isNaN(minutes) ? 0 : minutes);
};

export const getTargetDays = (program) => {
  const baseDay = Number(program.day_of_week ?? 0);
  const safeDay = Number.isNaN(baseDay) ? 0 : baseDay;
  const multipleDays = String(program.days_of_week || '')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));

  if (program.day_type === 'daily') {
    return [0, 1, 2, 3, 4, 5, 6];
  }

  if (program.day_type === 'weekend') {
    return [5, 6];
  }

  return multipleDays.length > 0 ? multipleDays : [safeDay];
};

const buildOccurrenceDate = (baseDate, minutes) => {
  const occurrenceDate = new Date(baseDate);
  occurrenceDate.setHours(0, 0, 0, 0);
  occurrenceDate.setMinutes(minutes);
  return occurrenceDate;
};

const isSameDay = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const buildOccurrences = (programs, referenceDate = new Date(), { pastDays = 2, futureDays = 7 } = {}) => {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const occurrences = [];

  for (let offset = -pastDays; offset <= futureDays; offset += 1) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);
    const targetDay = targetDate.getDay();

    programs.forEach((program) => {
      if (!getTargetDays(program).includes(targetDay)) {
        return;
      }

      const minutes = timeToMinutes(program.time_slot);
      const startAt = buildOccurrenceDate(targetDate, minutes);

      occurrences.push({
        id: `${program.id}-${targetDate.toISOString().slice(0, 10)}`,
        program,
        startAt,
        timeLabel: formatProgramTime(program.time_slot),
        dayLabel: DAYS[targetDay],
        dayIndex: targetDay,
        isToday: isSameDay(startAt, referenceDate),
      });
    });
  }

  occurrences.sort((left, right) => left.startAt.getTime() - right.startAt.getTime());

  return occurrences.map((occurrence, index) => {
    const nextSameDayOccurrence = occurrences
      .slice(index + 1)
      .find((candidate) => isSameDay(candidate.startAt, occurrence.startAt));
    const durationSeconds = Number(occurrence.program.video_duration_seconds || 0);
    const safeDurationSeconds = durationSeconds > 0 ? durationSeconds : DEFAULT_PROGRAM_DURATION_MINUTES * 60;
    const estimatedEndAt = new Date(occurrence.startAt.getTime() + (safeDurationSeconds * 1000));
    const endAt = nextSameDayOccurrence && nextSameDayOccurrence.startAt < estimatedEndAt
      ? nextSameDayOccurrence.startAt
      : estimatedEndAt;

    return {
      ...occurrence,
      endAt,
    };
  });
};

export const getProgramSnapshot = (programs, referenceDate = new Date()) => {
  const occurrences = buildOccurrences(programs, referenceDate, { pastDays: 2, futureDays: 7 });
  const nowTime = referenceDate.getTime();
  const todayOccurrences = occurrences.filter((occurrence) => occurrence.isToday);
  const currentOccurrence = todayOccurrences.find(
    (occurrence) => occurrence.startAt.getTime() <= nowTime && occurrence.endAt.getTime() > nowTime,
  ) || null;
  const nextOccurrence = occurrences.find((occurrence) => occurrence.startAt.getTime() > nowTime) || null;
  const previousOccurrence = currentOccurrence
    ? occurrences.filter((occurrence) => occurrence.startAt.getTime() < currentOccurrence.startAt.getTime()).slice(-1)[0] || null
    : occurrences.filter((occurrence) => occurrence.startAt.getTime() <= nowTime).slice(-1)[0] || null;
  const upcomingOccurrences = occurrences.filter((occurrence) => occurrence.startAt.getTime() > nowTime).slice(0, 8);

  return {
    occurrences,
    todayOccurrences,
    currentOccurrence,
    nextOccurrence,
    previousOccurrence,
    upcomingOccurrences,
  };
};

export const formatCountdown = (targetDate, referenceDate = new Date()) => {
  const difference = targetDate.getTime() - referenceDate.getTime();

  if (difference <= 0) {
    return 'الآن';
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}ي ${hours}س ${minutes}د`;
  }

  if (hours > 0) {
    return `${hours}س ${minutes}د ${seconds}ث`;
  }

  return `${minutes}د ${seconds}ث`;
};

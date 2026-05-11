import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX, Maximize, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContent } from '@/contexts/SiteContentContext';

const defaultLiveContent = {
  section_title: 'البث المباشر والبرامج المسجلة',
  section_subtitle: 'شاهد البث المباشر أو تصفح مكتبة البرامج الصحية',
  live_title: 'برنامج الاستشارات الطبية المباشرة',
  live_description: 'استشارات طبية مباشرة مع نخبة من الأطباء المتخصصين',
  preview_image_url: 'https://images.unsplash.com/photo-1576671081741-c538eafccfff',
  stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
};

const specialtyColors = {
  general: 'from-green-500 to-emerald-600',
  cardiology: 'from-red-500 to-pink-600',
  pediatrics: 'from-blue-500 to-cyan-600',
  nutrition: 'from-orange-500 to-amber-600',
};

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const { settings, video_programs } = useSiteContent();
  const liveContent = { ...defaultLiveContent, ...(settings.live_player || {}) };

  const playerSource = currentVideoUrl || liveContent.stream_url;
  const recordedPrograms = useMemo(() => video_programs || [], [video_programs]);

  const handlePlay = () => {
    setCurrentVideoUrl(liveContent.stream_url);
    setIsPlaying((current) => !current);

    if (!isPlaying) {
      toast({
        title: 'جاري تشغيل البث المباشر',
        description: 'يتم الآن الاتصال بخادم البث...',
      });
    }
  };

  const getSpecialtyColor = (specialty) => specialtyColors[specialty] || specialtyColors.general;

  const playRecorded = (program) => {
    toast({
      title: `تشغيل: ${program.title}`,
      description: 'جاري تحميل الفيديو...',
    });

    setCurrentVideoUrl(program.video_url);
    setIsPlaying(true);

    const liveElement = document.getElementById('live');
    if (liveElement) {
      liveElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="live" className="py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {liveContent.section_title}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">{liveContent.section_subtitle}</p>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="live" className="gap-2">
              <Radio className="w-4 h-4" />
              البث المباشر
            </TabsTrigger>
            <TabsTrigger value="recorded" className="gap-2">
              <Play className="w-4 h-4" />
              البرامج المسجلة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative aspect-video bg-black">
                {isPlaying ? (
                  <video
                    key={playerSource}
                    src={playerSource}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted={isMuted}
                  />
                ) : (
                  <>
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="font-semibold">البث المباشر</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <img className="w-full h-full object-cover opacity-50" alt="Live medical broadcast" src={liveContent.preview_image_url} />
                      <Button onClick={handlePlay} size="lg" className="absolute gap-2 bg-white text-green-600 hover:bg-green-50 shadow-2xl rounded-full w-20 h-20">
                        <Play className="w-8 h-8 mr-1" />
                      </Button>
                    </div>
                  </>
                )}

                {!isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handlePlay} className="hover:bg-white/20 text-white">
                          <Play className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="hover:bg-white/20 text-white">
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-white/20 text-white"
                          onClick={() => {
                            const element = document.querySelector('video') || document.querySelector('.aspect-video');
                            if (element?.requestFullscreen) {
                              element.requestFullscreen();
                            }
                          }}
                        >
                          <Maximize className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{liveContent.live_title}</h3>
                <p className="text-gray-600">{liveContent.live_description}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recorded" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recordedPrograms.map((program, index) => (
                <motion.div
                  key={program.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => playRecorded(program)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={program.title} src={program.image_url} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getSpecialtyColor(program.specialty)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Play className="w-6 h-6 text-white mr-1" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {program.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors">{program.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
};

export default VideoPlayer;

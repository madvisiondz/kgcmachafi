import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Users, TrendingUp, CheckCircle2, ArrowRight, Globe, CalendarDays, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Donations = () => {
  const [currency, setCurrency] = useState('EUR'); // Changed default currency to EUR
  const [donationAmount, setDonationAmount] = useState([100]);
  const [subscriptionType, setSubscriptionType] = useState('one-time');

  const currencies = {
    EUR: { code: 'EUR', label: 'يورو', symbol: '€', rate: 1, presets: [10, 20, 50, 100], subPresets: [5, 10, 20], max: 500, step: 5 }, // Updated EUR as default and rate
    DZD: { code: 'DZD', label: 'دينار جزائري', symbol: 'د.ج', rate: 150, presets: [1000, 2000, 5000, 10000], subPresets: [500, 1000, 2000], max: 50000, step: 500 }, // Adjusted DZD rate relative to EUR
    USD: { code: 'USD', label: 'دولار أمريكي', symbol: '$', rate: 1.08, presets: [10, 25, 50, 100], subPresets: [5, 10, 20], max: 500, step: 5 } // Adjusted USD rate relative to EUR
  };

  const selectedCurrency = currencies[currency];

  // Reset slider when currency changes
  useEffect(() => {
    setDonationAmount([selectedCurrency.presets[1]]);
  }, [currency]);

  const convertAmount = (amount) => {
    // This conversion is now primarily for displaying other currency equivalent,
    // as campaign goals are now implicitly in EUR base values.
    // Assuming campaign values are in EUR for simplicity
    return Math.round(amount).toLocaleString(); 
  };

  const campaigns = [
    {
      id: 1,
      title: 'علاج طفلة تعاني من مرض القلب',
      description: 'تحتاج لعملية جراحية عاجلة',
      raised: 4500, // Base in EUR
      goal: 8000,   // Base in EUR
      donors: 156,
      image: 'Young child needing urgent heart surgery treatment',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 2,
      title: 'توفير أدوية لمرضى السرطان',
      description: 'مساعدة المرضى العاجزين عن توفير الأدوية',
      raised: 3200,
      goal: 5000,
      donors: 98,
      image: 'Cancer patients receiving medical treatment and medication',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 3,
      title: 'جهاز غسيل كلى لمركز صحي',
      description: 'توفير جهاز غسيل كلى حديث',
      raised: 6500,
      goal: 10000,
      donors: 234,
      image: 'Modern dialysis machine in healthcare facility',
      color: 'from-blue-500 to-cyan-600'
    },
  ];

  const stats = [
    { icon: Heart, label: 'حالة تم مساعدتها', value: '1,234', color: 'from-red-500 to-pink-600' },
    { icon: DollarSign, label: 'إجمالي التبرعات', value: `25,000 ${currencies.EUR.symbol}`, color: 'from-green-500 to-emerald-600' }, // Hardcoded for EUR
    { icon: Users, label: 'متبرع نشط', value: '5,678', color: 'from-blue-500 to-cyan-600' },
    { icon: TrendingUp, label: 'معدل النجاح', value: '94%', color: 'from-purple-500 to-violet-600' },
  ];

  const handleDonate = () => {
    toast({
      title: `تم استلام طلب ${subscriptionType === 'monthly' ? 'الاشتراك' : 'التبرع'}`,
      description: `المبلغ: ${donationAmount[0]} ${selectedCurrency.symbol} - العملة: ${selectedCurrency.label}`,
    });
  };

  return (
    <section id="donations" className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              باب التبرعات والاشتراكات والدعم
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-6">ساهم معنا في تغيير حياة المرضى وصناعة الأمل</p>
          
          {/* Currency Selector */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {Object.values(currencies).map((curr) => (
              <Button
                key={curr.code}
                variant={currency === curr.code ? "default" : "outline"}
                onClick={() => setCurrency(curr.code)}
                className={`rounded-full px-6 ${currency === curr.code ? 'bg-green-600 hover:bg-green-700' : 'hover:text-green-600'}`}
              >
                {curr.label} ({curr.symbol})
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-md`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1 truncate" dir="ltr">{stat.value}</p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {campaigns.map((campaign, index) => {
            const progress = (campaign.raised / campaign.goal) * 100;
            
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={campaign.title} src="https://images.unsplash.com/photo-1676287570057-6b93e8d76649" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{campaign.donors} متبرع</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm flex-grow">{campaign.description}</p>

                  <div className="mb-4 mt-auto">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-green-700">{convertAmount(campaign.raised)} {selectedCurrency.symbol}</span>
                      <span className="text-gray-500">{convertAmount(campaign.goal)} {selectedCurrency.symbol}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${campaign.color} rounded-full shadow-md`}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">{progress.toFixed(0)}% مكتمل</p>
                  </div>

                  <Button
                    onClick={() => {
                       window.location.href = '#donation-form';
                       setDonationAmount([selectedCurrency.presets[0]]);
                    }}
                    className={`w-full gap-2 bg-gradient-to-r ${campaign.color} hover:opacity-90 shadow-lg text-white`}
                  >
                    <Heart className="w-4 h-4" />
                    ساهم الآن
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Donation Form / Subscription Section */}
        <motion.div
          id="donation-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-gray-100"
        >
          <div className="p-8 lg:p-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">نموذج التبرع والاشتراك</h3>
              <p className="text-gray-500">اختر الطريقة التي تناسبك للمساهمة في علاج المرضى</p>
            </div>

            <Tabs defaultValue="one-time" onValueChange={setSubscriptionType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="one-time" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm py-3 text-base">
                  <Heart className="w-4 h-4 ml-2" />
                  تبرع مرة واحدة
                </TabsTrigger>
                <TabsTrigger value="monthly" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm py-3 text-base">
                  <CalendarDays className="w-4 h-4 ml-2" />
                  اشتراك شهري
                </TabsTrigger>
              </TabsList>

              {/* Shared Amount Selector Content */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 mb-6">
                <div className="text-center mb-8">
                  <span className="text-gray-500 text-sm block mb-2">
                    {subscriptionType === 'one-time' ? 'مبلغ التبرع' : 'قيمة الاشتراك الشهري'}
                  </span>
                  <p className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-2" dir="ltr">
                    <span className="text-3xl text-gray-400 font-normal">{selectedCurrency.symbol}</span>
                    {donationAmount[0].toLocaleString()}
                  </p>
                </div>
                
                <Slider
                  value={donationAmount}
                  onValueChange={setDonationAmount}
                  max={selectedCurrency.max}
                  step={selectedCurrency.step}
                  className="mb-8"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(subscriptionType === 'one-time' ? selectedCurrency.presets : selectedCurrency.subPresets).map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setDonationAmount([amount])}
                      className={`h-12 text-lg border-2 ${donationAmount[0] === amount ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200'}`}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleDonate}
                  size="lg"
                  className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl transition-all hover:scale-[1.01]"
                >
                  {subscriptionType === 'one-time' ? <Heart className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  {subscriptionType === 'one-time' ? 'تأكيد التبرع' : 'تأكيد الاشتراك الشهري'}
                  <ArrowRight className="w-5 h-5 mr-auto" />
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                  <Globe className="w-4 h-4" />
                  <span>دفع آمن ومضمون 100%</span>
                  <span className="mx-2">•</span>
                  <CreditCard className="w-4 h-4" />
                  <span>نقبل جميع البطاقات البنكية</span>
                </div>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Donations;
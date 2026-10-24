import { HealthMilestone, LungMetrics, UserProfile } from '../types';

export const HEALTH_MILESTONES: HealthMilestone[] = [
  {
    id: '20m',
    durationSeconds: 20 * 60, // 20 mins
    durationLabel: '20 Dakika',
    title: 'Nabız ve Tansiyon Normale Döner',
    description: 'Kalp atış hızınız ve kan basıncınız, sigaranın tetiklediği anormal yüksek seviyelerden normal değerlere inmeye başlar.',
    benefit: 'El ve ayaklardaki kılcal kan dolaşımı ısınmaya başlar.',
    organ: 'heart',
    category: 'immediate',
  },
  {
    id: '8h',
    durationSeconds: 8 * 3600, // 8 hours
    durationLabel: '8 Saat',
    title: 'Oksijen Seviyesi Yükselir',
    description: 'Kandaki zehirli karbonmonoksit seviyesi yarı yarıya düşer, kan oksijen doyumu ideal seviyeye ulaşır.',
    benefit: 'Hücreleriniz ve beyniniz yeniden bol oksijenle beslenir.',
    organ: 'blood',
    category: 'immediate',
  },
  {
    id: '24h',
    durationSeconds: 24 * 3600, // 24 hours
    durationLabel: '24 Saat (1 Gün)',
    title: 'Kalp Krizi Riski Azalmaya Başlar',
    description: 'Vücudunuz karbonmonoksitten tamamen arınır. Akciğerleriniz biriken mukus ve kalıntıları dışarı atmaya başlar.',
    benefit: 'Akut kalp krizi geçirme riski hissedilir şekilde geriler.',
    organ: 'heart',
    category: 'short_term',
  },
  {
    id: '48h',
    durationSeconds: 48 * 3600, // 48 hours
    durationLabel: '48 Saat (2 Gün)',
    title: 'Tat ve Koku Duyuları Keskinleşir',
    description: 'Vücuttaki nikotin tamamen temizlenir. Hasar görmüş koku ve tat sinir uçları yeniden canlanmaya başlar.',
    benefit: 'Yiyeceklerin gerçek lezzetini ve doğanın kokularını yeniden fark edersiniz.',
    organ: 'senses',
    category: 'short_term',
  },
  {
    id: '72h',
    durationSeconds: 72 * 3600, // 72 hours
    durationLabel: '72 Saat (3 Gün)',
    title: 'Bronşlar Gevşer, Nefes Derinleşir',
    description: 'Akciğerdeki bronş tüpleri gevşeyerek açılır. Akciğer hava kapasitesi artar, solunum bariz şekilde rahatlar.',
    benefit: 'Vücut enerji seviyesi yükselir, sabahları daha zinde uyanırsınız.',
    organ: 'lungs',
    category: 'short_term',
  },
  {
    id: '2w',
    durationSeconds: 14 * 86400, // 2 weeks
    durationLabel: '2 Hafta',
    title: 'Kan Dolaşımı Hızlanır',
    description: 'Genel kan dolaşımı büyük oranda düzelir. Yürürken, merdiven çıkarken veya spor yaparken nefesiniz tıkanmaz.',
    benefit: 'Akciğer fonksiyonu bu süreçte %15-20 oranında iyileşme kaydeder.',
    organ: 'lungs',
    category: 'medium_term',
  },
  {
    id: '1m',
    durationSeconds: 30 * 86400, // 1 month
    durationLabel: '1 Ay',
    title: 'Öksürük ve Hırıltı Bitiyor',
    description: 'Akciğerin kendini temizleyen tüyleri (siliya) yeniden büyür. Mukusu temizler ve enfeksiyon riskini önler.',
    benefit: 'Sabah öksürükleri ve göğüsteki hırıltı yerini berrak bir nefese bırakır.',
    organ: 'lungs',
    category: 'medium_term',
  },
  {
    id: '3m',
    durationSeconds: 90 * 86400, // 3 months
    durationLabel: '3 Ay',
    title: 'Akciğer Kapasitesi %30 Artar',
    description: 'Akciğer hava kesecikleri (alveoller) elastikiyetini yeniden kazanır. Genel dayanıklılık doruk noktaya ulaşır.',
    benefit: 'Yorulmadan tempolu koşular ve uzun yürüyüşler yapabilirsiniz.',
    organ: 'lungs',
    category: 'medium_term',
  },
  {
    id: '9m',
    durationSeconds: 270 * 86400, // 9 months
    durationLabel: '9 Ay',
    title: 'Siliya Tüyleri Tamamen Yenilendi',
    description: 'Hava yollarındaki siliya hücreleri tam kapasiteyle çalışır; toz, polen ve mikropları doğal yollarla dışarı atar.',
    benefit: 'Soğuk algınlığı ve solunum yolu enfeksiyonlarına yakalanma oranı minimuma iner.',
    organ: 'cells',
    category: 'medium_term',
  },
  {
    id: '1y',
    durationSeconds: 365 * 86400, // 1 year
    durationLabel: '1 Yıl',
    title: 'Kalp Damar Hastalığı Riski %50 Düştü',
    description: 'Koroner kalp hastalığına yakalanma riski, sigara içmeye devam eden birine göre yarı yarıya azalır.',
    benefit: 'Damarlarınızdaki plak oluşumu yavaşlar, damar esnekliği gençleşir.',
    organ: 'heart',
    category: 'long_term',
  },
  {
    id: '5y',
    durationSeconds: 5 * 365 * 86400, // 5 years
    durationLabel: '5 Yıl',
    title: 'İnme (Felç) Riski Sıfırlandı',
    description: 'İnme ve beyin kanaması geçirme riski, hayatında hiç sigara içmemiş sağlıklı bir bireyle aynı seviyeye geriler.',
    benefit: 'Ağız, boğaz ve yemek borusu kanseri riski %50 oranında düşer.',
    organ: 'brain',
    category: 'long_term',
  },
  {
    id: '10y',
    durationSeconds: 10 * 365 * 86400, // 10 years
    durationLabel: '10 Yıl',
    title: 'Akciğer Kanseri Riski Yarı Yarıya Azaldı',
    description: 'Akciğer kanserinden ölüm riski sigara içenlere göre %50 azalır. Hücrelerdeki DNA hasarları onarılmıştır.',
    benefit: 'Vücudunuz hücre düzeyinde sigaranın toksik yükünden tamamen kurtulmuştur.',
    organ: 'cells',
    category: 'long_term',
  },
];

export const DEFAULT_SAVINGS_GOALS = [
  { id: '1', title: 'Özel Kahve Makinesi', cost: 1200, iconName: 'Coffee' },
  { id: '2', title: 'Kablosuz Kulaklık (AirPods / ANC)', cost: 4500, iconName: 'Headphones' },
  { id: '3', title: 'Akıllı Saat / Nabız Bandı', cost: 6500, iconName: 'Watch' },
  { id: '4', title: 'Hafta Sonu Butik Otel Tatili', cost: 15000, iconName: 'Palmtree' },
  { id: '5', title: 'Yeni Nesil Akıllı Telefon', cost: 45000, iconName: 'Smartphone' },
];

export const CRAVING_TIPS = [
  {
    title: 'Büyük Bir Bardak Soğuk Su İç',
    desc: 'Yudum yudum içmek boğazdaki reseptörleri uyarır, ağız içi hissi tazeler ve dikkati dağıtır.',
    icon: 'Droplet',
  },
  {
    title: '4-7-8 Derin Nefes Egzersizi',
    desc: '4 sn burnundan derin nefes al, 7 sn tut ve 8 sn boyunca ağzından yavaşça ver. Sinir sistemini anında sakinleştirir.',
    icon: 'Wind',
  },
  {
    title: 'Krizin 3 Dakika Sürdüğünü Hatırla',
    desc: 'Sigara içme isteği biyolojik olarak sadece 3 ila 5 dakika dalgalanır, ardından hızla sönümlenir.',
    icon: 'Timer',
  },
  {
    title: 'Ağzını Çalkala veya Karanfil Çiğne',
    desc: 'Naneli sakız, diş fırçalama veya bir adet karanfil çiğnemek ağızdaki tütün isteğini anında keser.',
    icon: 'Sparkles',
  },
  {
    title: 'Tasarruf Ettiğin Parayı Hatırla',
    desc: 'Cebinde kalan parayı ve sevdiklerine daha sağlıklı bir gelecek hediye ettiğini aklına getir.',
    icon: 'Coins',
  },
  {
    title: '10 Derin Squat veya Yürüyüş',
    desc: 'Fiziksel hareket endorfin salgılatır ve nikotin yoksunluğunun yarattığı huzursuzluğu yok eder.',
    icon: 'Activity',
  },
];

/**
 * Calculates current progress and statistics based on elapsed seconds.
 */
export function calculateStats(profile: UserProfile, simulatedSeconds?: number) {
  const quitTimeMs = new Date(profile.quitDate).getTime();
  const nowMs = Date.now();
  
  // Real elapsed seconds
  const actualSeconds = Math.max(0, Math.floor((nowMs - quitTimeMs) / 1000));
  const elapsedSeconds = simulatedSeconds !== undefined ? simulatedSeconds : actualSeconds;

  const secondsPerDay = 86400;
  const elapsedDaysFloat = elapsedSeconds / secondsPerDay;

  // Cigarettes not smoked
  const cigarettesNotSmoked = (profile.cigarettesPerDay * elapsedSeconds) / secondsPerDay;

  // Money saved in TL
  const singleCigaretteCost = profile.packPrice / (profile.cigarettesPerPack || 20);
  const moneySaved = cigarettesNotSmoked * singleCigaretteCost;

  // Life gained: roughly 11 minutes per unsmoked cigarette
  const lifeMinutesGained = cigarettesNotSmoked * 11;
  const lifeHoursGained = lifeMinutesGained / 60;
  const lifeDaysGained = lifeHoursGained / 24;

  // Tar prevented: each cigarette has roughly 10mg (0.01g) of tar
  const tarPreventedGrams = cigarettesNotSmoked * 0.01;

  // Time components
  const days = Math.floor(elapsedSeconds / 86400);
  const hours = Math.floor((elapsedSeconds % 86400) / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = Math.floor(elapsedSeconds % 60);

  return {
    actualSeconds,
    elapsedSeconds,
    days,
    hours,
    minutes,
    seconds,
    cigarettesNotSmoked: Math.floor(cigarettesNotSmoked * 10) / 10,
    exactCigarettesNotSmoked: cigarettesNotSmoked,
    moneySaved,
    lifeMinutesGained: Math.floor(lifeMinutesGained),
    lifeHoursGained: Math.floor(lifeHoursGained * 10) / 10,
    lifeDaysGained: Math.floor(lifeDaysGained * 10) / 10,
    tarPreventedGrams: Math.floor(tarPreventedGrams * 100) / 100,
  };
}

/**
 * Evaluates physiological lung state and biological recovery percentage
 * across key milestones (up to 10 years / 315,360,000 seconds).
 */
export function getLungMetrics(elapsedSeconds: number): LungMetrics {
  // Max benchmark: 10 years (315,360,000s) = 100% full recovery
  // However, recovery is logarithmic: rapid initial clearing in days/weeks, then cellular repair
  const hours = elapsedSeconds / 3600;
  const days = elapsedSeconds / 86400;
  const months = days / 30;
  const years = days / 365;

  let recoveryPercentage = 0;
  let stageName = 'Başlangıç Aşaması (Toksin Yükü)';
  let stageDescription = 'Akciğer dokularında katran kalıntıları ve hava yollarında kronik inflamasyon mevcut.';
  let oxygenSaturation = 93;
  let ciliaRegenerationPercent = 5;
  let vitalCapacityBonusPercent = 0;
  let carbonMonoxideReductionPercent = 0;
  let strokeRiskReductionPercent = 0;
  let cancerRiskReductionPercent = 0;

  if (hours < 1) {
    recoveryPercentage = Math.min(5, (elapsedSeconds / 3600) * 5);
    stageName = 'İlk Nefes (0-1 Saat)';
    stageDescription = 'Dolaşım sistemi sakinleşiyor, nabız ve kan basıncı normal seviyelere iniyor.';
    oxygenSaturation = 93.5;
    carbonMonoxideReductionPercent = 10;
  } else if (hours < 24) {
    recoveryPercentage = 5 + ((hours - 1) / 23) * 10; // 5% to 15%
    stageName = 'Oksijenlenme & CO Temizliği (8-24 Saat)';
    stageDescription = 'Karbonmonoksit kandan hızla atılıyor. Akciğer kılcallarında oksijen transferi artıyor.';
    oxygenSaturation = 96;
    carbonMonoxideReductionPercent = 60 + ((hours - 8) / 16) * 35;
    ciliaRegenerationPercent = 10;
  } else if (days < 3) {
    recoveryPercentage = 15 + ((days - 1) / 2) * 15; // 15% to 30%
    stageName = 'Bronşların Açılması (1-3 Gün)';
    stageDescription = 'Bronş kasları gevşemeye başladı. Havanın akciğer derinliklerine ulaşması kolaylaşıyor.';
    oxygenSaturation = 97.5;
    carbonMonoxideReductionPercent = 100;
    ciliaRegenerationPercent = 20;
    vitalCapacityBonusPercent = 5;
  } else if (days < 14) {
    recoveryPercentage = 30 + ((days - 3) / 11) * 15; // 30% to 45%
    stageName = 'Dolaşım & Doku İyileşmesi (1-2 Hafta)';
    stageDescription = 'Katran parçacıkları öksürük ve mukus mekanizmasıyla dışarı atılıyor. Dokular canlanıyor.';
    oxygenSaturation = 98.2;
    carbonMonoxideReductionPercent = 100;
    ciliaRegenerationPercent = 35;
    vitalCapacityBonusPercent = 12;
    strokeRiskReductionPercent = 10;
  } else if (months < 3) {
    recoveryPercentage = 45 + ((months - 0.5) / 2.5) * 20; // 45% to 65%
    stageName = 'Hava Yolları Canlanması (1-3 Ay)';
    stageDescription = 'Akciğer siliya tüyleri belirgin şekilde yeniden oluştu. Hırıltı ve öksürük kalmadı.';
    oxygenSaturation = 98.8;
    carbonMonoxideReductionPercent = 100;
    ciliaRegenerationPercent = 65;
    vitalCapacityBonusPercent = 25;
    strokeRiskReductionPercent = 25;
    cancerRiskReductionPercent = 15;
  } else if (months < 12) {
    recoveryPercentage = 65 + ((months - 3) / 9) * 15; // 65% to 80%
    stageName = 'Tam Hücresel Temizlik (3-12 Ay)';
    stageDescription = 'Akciğer alveolleri elastikiyetine kavuştu. Katranın büyük bölümü tamamen arındı.';
    oxygenSaturation = 99.1;
    carbonMonoxideReductionPercent = 100;
    ciliaRegenerationPercent = 95;
    vitalCapacityBonusPercent = 30;
    strokeRiskReductionPercent = 40;
    cancerRiskReductionPercent = 30;
  } else if (years < 5) {
    recoveryPercentage = 80 + ((years - 1) / 4) * 12; // 80% to 92%
    stageName = 'Derin Hücresel Onarım (1-5 Yıl)';
    stageDescription = 'Koroner kalp hastalığı riski yarıya indi. Akciğer dokuları sağlıklı pembe görünümüne kavuştu.';
    oxygenSaturation = 99.4;
    carbonMonoxideReductionPercent = 100;
    ciliaRegenerationPercent = 100;
    vitalCapacityBonusPercent = 30;
    strokeRiskReductionPercent = 75;
    cancerRiskReductionPercent = 45;
  } else {
    recoveryPercentage = Math.min(100, 92 + ((years - 5) / 5) * 8); // 92% to 100%
    stageName = 'Tam Yenilenme & Tertemiz Akciğerler (5-10 Yıl)';
    stageDescription = 'Akciğer kanseri riski %50 azaldı, inme riski hiç içmeyen biriyle aynı seviyeye ulaştı.';
    oxygenSaturation = 99.6;
    carbonMonoxideReductionPercent = 100;
    ciliaRegenerationPercent = 100;
    vitalCapacityBonusPercent = 30;
    strokeRiskReductionPercent = 100;
    cancerRiskReductionPercent = 55;
  }

  // Tar expelled estimation
  const tarExpelledGrams = (recoveryPercentage / 100) * 180; // normalized scale

  return {
    recoveryPercentage: Math.min(100, Math.round(recoveryPercentage * 10) / 10),
    tarExpelledGrams: Math.round(tarExpelledGrams * 10) / 10,
    oxygenSaturation: Math.min(99.6, Math.round(oxygenSaturation * 10) / 10),
    ciliaRegenerationPercent: Math.min(100, Math.round(ciliaRegenerationPercent)),
    vitalCapacityBonusPercent: Math.min(30, Math.round(vitalCapacityBonusPercent)),
    carbonMonoxideReductionPercent: Math.min(100, Math.round(carbonMonoxideReductionPercent)),
    strokeRiskReductionPercent: Math.min(100, Math.round(strokeRiskReductionPercent)),
    cancerRiskReductionPercent: Math.min(100, Math.round(cancerRiskReductionPercent)),
    stageName,
    stageDescription,
  };
}

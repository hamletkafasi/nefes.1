import { Badge, CravingLog, UserProfile } from '../types';
import { calculateStats } from './healthData';

export interface BadgeDefinition {
  id: string;
  category: 'time' | 'savings' | 'craving' | 'health';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'emerald';
  title: string;
  requirementLabel: string;
  description: string;
  benefitDescription: string;
  iconName: string;
  targetValue: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- ZAMAN DÖNÜM NOKTALARI ---
  {
    id: 'time_1h',
    category: 'time',
    tier: 'bronze',
    title: 'İlk Kıvılcım',
    requirementLabel: '1 Saat',
    description: 'Sigara yakma alışkanlık zincirini kırdın ve ilk saati devirdin.',
    benefitDescription: 'Nabız ve kan basıncı normal seviyelere inmeye başladı.',
    iconName: 'Flame',
    targetValue: 3600, // 1 hour
  },
  {
    id: 'time_24h',
    category: 'time',
    tier: 'bronze',
    title: '1 Günlük Zafer',
    requirementLabel: '24 Saat',
    description: 'Tam bir gün boyunca hiç sigara içmedin. En zorlu ilk gün geride kaldı!',
    benefitDescription: 'Vücudun karbonmonoksitten tamamen arındı, kalp krizi riski azalmaya başladı.',
    iconName: 'ShieldCheck',
    targetValue: 24 * 3600, // 24 hours
  },
  {
    id: 'time_72h',
    category: 'time',
    tier: 'silver',
    title: 'Bronş Fatihi',
    requirementLabel: '72 Saat (3 Gün)',
    description: 'Nikotinin vücuttan tamamen temizlendiği 3 günlük kritik eşiği aştın.',
    benefitDescription: 'Bronş tüpleri gevşedi, ciğerlerine giren hava miktarı hissedilir derecede arttı.',
    iconName: 'Wind',
    targetValue: 72 * 3600, // 72 hours
  },
  {
    id: 'time_1w',
    category: 'time',
    tier: 'silver',
    title: 'Demir İrade',
    requirementLabel: '1 Hafta',
    description: 'Sigarasız tam bir hafta! Fiziksel yoksunluk semptomlarının en yoğun olduğu dönem bitti.',
    benefitDescription: 'Koku ve tat duyuların keskinleşti, sabah yorgunluğu azaldı.',
    iconName: 'Award',
    targetValue: 7 * 86400, // 7 days
  },
  {
    id: 'time_2w',
    category: 'time',
    tier: 'gold',
    title: 'Yeniden Doğuş',
    requirementLabel: '2 Hafta',
    description: '14 gün boyunca tertemiz nefes aldın. Vücudun iyileşme ritmini yakaladı.',
    benefitDescription: 'Kan dolaşımı hızlandı, yürüyüş ve merdiven çıkarken tıkanma azaldı.',
    iconName: 'Zap',
    targetValue: 14 * 86400, // 14 days
  },
  {
    id: 'time_1m',
    category: 'time',
    tier: 'gold',
    title: 'Temiz Nefes Ustası',
    requirementLabel: '1 Ay',
    description: 'Tam bir ay boyunca dumansız yaşadın! Zihinsel bağımlılık gücünü yitiriyor.',
    benefitDescription: 'Akciğer siliya tüyleri yeniden büyüdü, öksürük ve hırıltı tamamen son buldu.',
    iconName: 'Smile',
    targetValue: 30 * 86400, // 30 days
  },
  {
    id: 'time_3m',
    category: 'time',
    tier: 'platinum',
    title: 'Süper Kapasite',
    requirementLabel: '3 Ay',
    description: 'Çeyrek yıl geride kaldı! Spor ve günlük aktivitelerde yeni bir insansın.',
    benefitDescription: 'Akciğer fonksiyonu %30 arttı, bağışıklık sistemi güçlendi.',
    iconName: 'Activity',
    targetValue: 90 * 86400, // 90 days
  },
  {
    id: 'time_6m',
    category: 'time',
    tier: 'platinum',
    title: 'Yarım Yıl Şampiyonu',
    requirementLabel: '6 Ay',
    description: 'Yarım yıldır sigarasızsın. Artık kendini gerçek bir sigara içmeyen olarak görüyorsun.',
    benefitDescription: 'Stresle başa çıkma becerin gelişti, damar tıkanıklığı riski belirgin şekilde geriledi.',
    iconName: 'Star',
    targetValue: 180 * 86400, // 180 days
  },
  {
    id: 'time_1y',
    category: 'time',
    tier: 'diamond',
    title: 'Altın Özgürlük',
    requirementLabel: '1 Yıl',
    description: 'Tam 365 gün sigarasız! Hayatının en büyük ve en anlamlı sağlık zaferlerinden biri.',
    benefitDescription: 'Koroner kalp hastalığı riski sigara içen birine göre yarı yarıya azaldı.',
    iconName: 'Crown',
    targetValue: 365 * 86400, // 365 days
  },
  {
    id: 'time_5y',
    category: 'time',
    tier: 'emerald',
    title: 'Efsanevi Sağlık',
    requirementLabel: '5 Yıl',
    description: '5 yıllık tertemiz hayat. Vücudun sigarayı neredeyse tamamen unuttu.',
    benefitDescription: 'İnme ve beyin kanaması riski hiç sigara içmemiş sağlıklı bir bireyle aynı seviyeye geriledi.',
    iconName: 'Sparkles',
    targetValue: 5 * 365 * 86400, // 5 years
  },

  // --- TASARRUF & KUMBARA ROZETLERİ ---
  {
    id: 'sav_250',
    category: 'savings',
    tier: 'bronze',
    title: 'İlk Birikim',
    requirementLabel: '250 ₺',
    description: 'Sigaraya vermek yerine cebinde tuttuğun ilk çeyrek bin lira.',
    benefitDescription: 'Kendine güzel bir öğle yemeği veya kitap hediye edebilirsin.',
    iconName: 'Coins',
    targetValue: 250,
  },
  {
    id: 'sav_1000',
    category: 'savings',
    tier: 'silver',
    title: 'Dört Haneliler Kulübü',
    requirementLabel: '1.000 ₺',
    description: 'Tasarrufun 1.000 TL sınırını aştı! Birkaç haftada biriken somut bir bütçe.',
    benefitDescription: 'Cebinde kalan gerçek nakit, hedeflerine doğru hızla büyüyor.',
    iconName: 'DollarSign',
    targetValue: 1000,
  },
  {
    id: 'sav_5000',
    category: 'savings',
    tier: 'gold',
    title: 'Akıllı Yatırımcı',
    requirementLabel: '5.000 ₺',
    description: '5.000 TL tasarruf! Artık kaliteli bir kulaklık veya akıllı saat satın alabilirsin.',
    benefitDescription: 'Dumana harcanacak paranın konfora ve sağlığa dönüşmesi.',
    iconName: 'TrendingUp',
    targetValue: 5000,
  },
  {
    id: 'sav_15000',
    category: 'savings',
    tier: 'diamond',
    title: 'Özgürlük Fonu',
    requirementLabel: '15.000 ₺',
    description: 'Tam 15.000 TL nakit birikim! Harika bir hafta sonu tatilinin finansmanı hazır.',
    benefitDescription: 'Sigara şirketlerine değil, sevdiklerinle yapacağın anılara yatırım.',
    iconName: 'Gift',
    targetValue: 15000,
  },

  // --- KRİZ VE İRADE ZAFERLERİ ---
  {
    id: 'crav_1',
    category: 'craving',
    tier: 'bronze',
    title: 'İlk Kriz Zaferi',
    requirementLabel: '1 Kriz Atlatıldı',
    description: 'Sigara içme dürtüsü geldiğinde teslim olmak yerine derin nefes alarak savaştın.',
    benefitDescription: 'Beynindeki ödül mekanizmasına kontrolün sende olduğunu kanıtladın.',
    iconName: 'Shield',
    targetValue: 1,
  },
  {
    id: 'crav_5',
    category: 'craving',
    tier: 'silver',
    title: 'Dürtü Avcısı',
    requirementLabel: '5 Kriz Atlatıldı',
    description: '5 farklı nikotin krizini başarıyla savuşturdun. İrade kasların hızla güçleniyor.',
    benefitDescription: 'Her atlatılan kriz, bir sonraki krizin şiddetini yarıya indirir.',
    iconName: 'Target',
    targetValue: 5,
  },
  {
    id: 'crav_10',
    category: 'craving',
    tier: 'gold',
    title: 'Çelik İrade',
    requirementLabel: '10 Kriz Atlatıldı',
    description: '10 krizi yendin! Artık ani nikotin istekleri seni korkutamıyor.',
    benefitDescription: 'Zihinsel bağımlılığın omurgasını kırdın.',
    iconName: 'CheckCircle2',
    targetValue: 10,
  },

  // --- SAĞLIK & ADET ROZETLERİ ---
  {
    id: 'hlth_50',
    category: 'health',
    tier: 'bronze',
    title: '50 Dal Temizliği',
    requirementLabel: '50 Dal Sigara Önleme',
    description: 'Ciğerlerine 50 dal zehirli tütün dumanı girmedi.',
    benefitDescription: 'Yaklaşık 500 mg ölümcül katrandan ve ziftten korundun.',
    iconName: 'Heart',
    targetValue: 50,
  },
  {
    id: 'hlth_200',
    category: 'health',
    tier: 'silver',
    title: 'Duman Bariyeri',
    requirementLabel: '200 Dal Sigara Önleme',
    description: '10 paket dolusu sigarayı içmeyerek sağlığına geri kazandırdın.',
    benefitDescription: 'Yaklaşık 36 saatlik ek sağlıklı ömür kazandın.',
    iconName: 'HeartHandshake',
    targetValue: 200,
  },
  {
    id: 'hlth_1000',
    category: 'health',
    tier: 'diamond',
    title: 'Bin Dal Şampiyonu',
    requirementLabel: '1.000 Dal Sigara Önleme',
    description: '1.000 dal sigara dumanı ciğerlerini es geçti! Muazzam bir temizlik başarısı.',
    benefitDescription: 'Akciğerlerinde birikecek devasa katran kitlesi engellendi.',
    iconName: 'Trophy',
    targetValue: 1000,
  },
];

export function evaluateBadges(
  profile: UserProfile,
  elapsedSeconds: number,
  cravings: CravingLog[] = []
): Badge[] {
  const stats = calculateStats(profile, elapsedSeconds);
  const moneySaved = stats.moneySaved;
  const unsmoked = stats.exactCigarettesNotSmoked;
  const resistedCravings = cravings.filter((c) => c.status === 'survived' || c.status === 'resisted').length;

  return BADGE_DEFINITIONS.map((def) => {
    let currentValue = 0;
    let isUnlocked = false;
    let remainingLabel: string | undefined;

    if (def.category === 'time') {
      currentValue = elapsedSeconds;
      isUnlocked = elapsedSeconds >= def.targetValue;
      if (!isUnlocked) {
        const remainingSec = def.targetValue - elapsedSeconds;
        if (remainingSec < 3600) {
          remainingLabel = `${Math.ceil(remainingSec / 60)} dakika kaldı`;
        } else if (remainingSec < 86400) {
          remainingLabel = `${Math.ceil(remainingSec / 3600)} saat kaldı`;
        } else if (remainingSec < 30 * 86400) {
          remainingLabel = `${Math.ceil(remainingSec / 86400)} gün kaldı`;
        } else {
          remainingLabel = `${Math.ceil(remainingSec / (30 * 86400))} ay kaldı`;
        }
      }
    } else if (def.category === 'savings') {
      currentValue = moneySaved;
      isUnlocked = moneySaved >= def.targetValue;
      if (!isUnlocked) {
        const remainingTL = Math.max(0, def.targetValue - moneySaved);
        remainingLabel = `${Math.ceil(remainingTL).toLocaleString('tr-TR')} ₺ kaldı`;
      }
    } else if (def.category === 'craving') {
      currentValue = resistedCravings;
      isUnlocked = resistedCravings >= def.targetValue;
      if (!isUnlocked) {
        const remainingCount = def.targetValue - resistedCravings;
        remainingLabel = `${remainingCount} kriz zaferi kaldı`;
      }
    } else if (def.category === 'health') {
      currentValue = unsmoked;
      isUnlocked = unsmoked >= def.targetValue;
      if (!isUnlocked) {
        const remainingCigs = Math.max(0, Math.ceil(def.targetValue - unsmoked));
        remainingLabel = `${remainingCigs} dal kaldı`;
      }
    }

    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round((currentValue / def.targetValue) * 100))
    );

    // Calculate simulated unlock timestamp
    let unlockedAt: string | undefined;
    if (isUnlocked) {
      if (def.category === 'time') {
        const quitTime = new Date(profile.quitDate).getTime();
        unlockedAt = new Date(quitTime + def.targetValue * 1000).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } else {
        unlockedAt = 'Kazanıldı!';
      }
    }

    return {
      ...def,
      currentValue,
      isUnlocked,
      progressPercent,
      unlockedAt,
      remainingLabel,
    };
  });
}

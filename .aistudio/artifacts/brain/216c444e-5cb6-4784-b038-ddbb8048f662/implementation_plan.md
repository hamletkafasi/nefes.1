# Dinamik Başarı Rozetleri Sistemi Uygulama Planı

Sigarayı bırakan kullanıcının psikolojik dayanıklılığını ve motivasyonunu artırmak amacıyla, sigarasız geçen zaman (24 saat, 1 hafta, 1 ay, 1 yıl vb.), biriken tasarruf, engellenen sigara adedi ve atlatılan kriz anlarına göre anlık olarak hesaplanan ve açılan **Dinamik Başarı Rozetleri (Achievement Badges)** sisteminin mimarisi.

---

## Kullanıcı İncelemesi & Kritik Kararlar

> [!IMPORTANT]
> - **Rozet Kapsamı**: Zaman odaklı temel dönüm noktalarına (24 saat, 1 hafta, 1 ay, 1 yıl) ek olarak tasarruf (örn. ilk 500 ₺ ve 1.000 ₺) ile kriz savar irade rozetleri sisteme dahil edilecektir.
> - **Sergileme Alanı**: Rozetler hem ana gösterge panelinde öne çıkan bir "Son Başarılar & Sıradaki Rozet" vitrini olarak, hem de "Sağlık & Başarılar" sekmesinde filtrelenebilir zengin bir galeri olarak sunulacaktır.
> - **Kutlama Deneyimi**: Yeni bir rozetin kilidi açıldığında konfeti patlaması, hafif haptik geri bildirim ve özel başarı tebrik kartı gösterilecektir.

---

## 1. Genel Bakış & Temel Değer

- **Ne Sağlar**: Kullanıcının bıraktığı andan itibaren geçen her dakikayı anlamlı birer oyunlaştırılmış (gamified) başarıya dönüştürür.
- **Hedef Kitle**: Nikotin yoksunluğuyla mücadele eden, küçük zaferlerle dopamin takviyesine ihtiyaç duyan sigara bırakma kullanıcıları.
- **Temel Değer**: Sigarayı bırakma sürecinde ilk 24 saat, ilk 3 gün (72 saat), 1 hafta ve 1 ay gibi kritik kırılma noktalarında kullanıcının motivasyonunu diri tutarak nüksetmeyi (relapse) önler.

---

## 2. Kullanıcı Deneyimi & Görsel Tasarım

### A. Rozet Arayüzü ve Durumları
Her rozet 2 ana durumda görselleştirilir:
1. **Kilit Açık (Unlocked / Kazanıldı)**:
   - Zengin renk paleti (Bronz, Gümüş, Altın, Zümrüt, Elmas ışıltısı).
   - Animasyonlu parıltı efekti ve tamamlanma tarihi damgası.
   - Dokunulduğunda biyolojik ve psikolojik kazanımı anlatan detay kartı.
2. **Kilitli (Locked / Hedef)**:
   - Mat koyu arka plan, kilit simgesi.
   - İlerleme çubuğu (örn. *18 / 24 saat - %75 tamamlandı*).
   - "Kalan süre: 6 saat" veya "Kalan tutar: 240 ₺" geri sayımı.

### B. Rozet Kategorileri
- ⏱️ **Zaman Dönüm Noktaları**:
  - `1 Saat`: İlk Adım (Zehir zinciri kırıldı)
  - `24 Saat`: 1 Günlük Zafer (Karbonmonoksit kandan temizlendi)
  - `72 Saat (3 Gün)`: Bronş Fatihi (Fiziksel yoksunluğun zirvesi aşıldı)
  - `1 Hafta`: Demir İrade (İlk kritik hafta geride kaldı)
  - `2 Hafta`: Yeniden Doğuş (Dolaşım ve enerji patlaması)
  - `1 Ay`: Temiz Nefes Ustası (Akciğer siliya tüyleri uyandı)
  - `3 Ay`: Süper Kapasite (Akciğer fonksiyonu +%30)
  - `6 Ay`: Yenilmez Vücut (Enfeksiyon riski tabana indi)
  - `1 Yıl`: Altın Özgürlük (Kalp krizi riski yarı yarıya düştü)
  - `5 Yıl`: Efsanevi Sağlık (İnme ve kanser riskleri sıfırlandı)
- 💰 **Tasarruf & Kumbara Rozetleri**:
  - `500 ₺`: İlk Damla (Cepte kalan ilk 500 lira)
  - `1.000 ₺`: Dört Haneliler Kulübü
  - `5.000 ₺`: Akıllı Yatırımcı
  - `10.000 ₺`: Özgürlük Fonu
- 🛡️ **İrade & Kriz Savar Rozetleri**:
  - `İlk Kriz Zaferi`: Nikotin dürtüsünü derin nefesle yendin
  - `5 Kriz Savar`: Çelik gibi sinirler
  - `10 Kriz Savar`: Sigara isteği artık seni yönetemiyor
- 🫁 **Biyolojik İyileşme Rozetleri**:
  - `100 Dal Sigara Önleme`: Ciğerlerine 100 zehirli dal girmedi
  - `10 Gram Katran Temizliği`: Katranın dışarı atılması

---

## 3. Teknik Mimari & Veri Modeli

```
┌─────────────────────────────────────────────────────────────┐
│                       Uygulama Durumu                       │
│  (UserProfile: quitDate, cigarettesPerDay, packPrice, etc.) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Rozet Hesaplama Motoru                      │
│             (calculateUnlockedBadges utility)               │
│  • elapsedSeconds'a göre zaman rozetleri                    │
│  • moneySaved'e göre finans rozetleri                       │
│  • unsmokedCigarettes'e göre hacim rozetleri                │
│  • cravingLogs'a göre irade rozetleri                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│     Dashboard Vitrini   │           │      Rozet Galerisi     │
│  • Son açılan 2 rozet   │           │  • Filtreler (Zaman,    │
│  • Sıradaki hedef       │           │    Tasarruf, İrade)     │
│  • % İlerleme çubuğu    │           │  • Ayrıntılı popup      │
└─────────────────────────┘           └─────────────────────────┘
```

### Veri Tipi Tanımı (`Badge`):
```typescript
export interface Badge {
  id: string;
  category: 'time' | 'savings' | 'craving' | 'health';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  title: string;
  description: string;
  requirementLabel: string;
  iconName: string;
  isUnlocked: boolean;
  progressPercent: number; // 0-100
  currentValue: number;
  targetValue: number;
  unlockedAt?: string;
  benefitDescription: string;
}
```

---

## 4. Uygulama Adımları

1. **`src/types/index.ts` Güncellemesi**:
   - `Badge` ve `BadgeCategory` tip tanımlarının eklenmesi.
2. **`src/utils/badgeData.ts` Modülü**:
   - Tüm rozetlerin (24 saat, 1 hafta, 1 ay, 1 yıl, 500₺, 1000₺, 1. kriz vb.) tanımları.
   - Gerçek zamanlı `evaluateBadges(profile, elapsedSeconds, cravings)` hesaplama fonksiyonu.
   - Yeni açılan rozetleri tespit eden bildirim kontrol mekanizması.
3. **`src/components/BadgeGallery.tsx` Bileşeni**:
   - Kategori filtreleme butonları (Tümü, Zaman, Tasarruf, İrade).
   - Kart grid yerleşimi, parıltı animasyonları, kilitli/açık durumları.
   - Detay modal penceresi (Rozet madalyası, açıklaması ve kazanım bilgisi).
4. **`src/components/BadgeUnlockModal.tsx` Bileşeni**:
   - Yeni bir dönüm noktasına ulaşıldığında konfeti eşliğinde açılan tebrik penceresi.
5. **Dashboard & Ana Gezinti Entegrasyonu**:
   - Ana ekranda "Başarı Vitrini" kartı.
   - Sağlık & Başarı sekmesinde rozet galerisine kolay erişim.

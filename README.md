# 🫁 Nefes - Sigarayı Bırakma & Canlı Akciğer Simülasyonu

Modern, zarif, bilimsel temelli sigara bırakma takipçisi ve dinamik biyolojik akciğer iyileşme simülasyonu.

---

## 🚀 GitHub Üzerinden Canlı Yayına Alma Rehberi

Bu proje, **GitHub Pages**, **Vercel** veya **Netlify** üzerinde sıfır sunucu maliyetiyle doğrudan yayınlanmaya hazır şekilde yapılandırılmıştır.

---

### Seçenek 1: GitHub Pages ile Otomatik Yayınlama (Önerilen)

Depoda hazır bulunan `.github/workflows/deploy.yml` GitHub Actions iş akışı sayesinde, kodunuzu GitHub'a yüklediğiniz anda siteniz otomatik olarak derlenir ve yayına alınır.

#### Adım 1: Projeyi GitHub Reponuza Yükleyin
Terminalinizde sırasıyla şu komutları çalıştırın:

```bash
git add .
git commit -m "fix: resolve github pages build and enable automated deploy"
git push origin main
```

#### Adım 2: GitHub Pages'ı Aktif Edin (Beyaz Ekranı Önlemek İçin Kritik Adım)
1. GitHub'da `https://github.com/hamletkafasi/nefes.1` reponuza gidin.
2. Üstteki **Settings** (Ayarlar) sekmesine tıklayın.
3. Sol menüdeki **Pages** bölümüne tıklayın.
4. **Build and deployment** başlığı altındaki **Source** açılır kutusunu **"GitHub Actions"** olarak seçin (Eğer "Deploy from a branch" seçiliyse mutlaka "GitHub Actions" yapın).
5. Üstteki **Actions** sekmesine gittiğinizde iş akışının yeşil onay (✔) alarak tamamlandığını göreceksiniz.
6. `https://hamletkafasi.github.io/nefes.1/` adresine girip sayfayı yenilediğinizde uygulama eksiksiz ve canlı olarak açılacaktır!

---

### Seçenek 2: Vercel ile 1 Tıkla Yayınlama

Projede `vercel.json` SPA yönlendirme dosyası tanımlıdır:
1. [vercel.com](https://vercel.com) adresine gidip GitHub hesabınızla giriş yapın.
2. **"Add New..."** -> **"Project"** butonuna tıklayın.
3. Nefes reponuzu seçip **"Deploy"** butonuna basın.
4. Özel alan adınız veya ücretsiz `*.vercel.app` bağlantınız anında aktif olur.

---

### Seçenek 3: Netlify ile Yayınlama

Projede `netlify.toml` dosyası tanımlıdır:
1. [netlify.com](https://netlify.com) adresine gidip GitHub reponuzu bağlayın.
2. Derleme komutu: `npm run build` | Çıktı dizini: `dist`.
3. **"Deploy Site"** butonuna basarak canlıya alın.

---

### Seçenek 4: Node.js ile Kendi Sunucunuzda (Full-Stack JSON Veritabanı ile)

Uygulama çift katmanlı mimariye (Hybrid Storage) sahiptir:
- Statik sunucularda (GitHub Pages, Vercel) tarayıcının yerel hafızasını (`localStorage`) kullanarak offline çalışır.
- Kendi Node.js sunucunuzda çalıştırıldığında `/data/database.json` dosyasını merkezi veritabanı olarak kullanır.

```bash
# Bağımlılıkları yükleyin
npm install

# Projeyi derleyin
npm run build

# Node.js sunucusunu başlatın
npm run start
```
Varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

---

## 🌟 Öne Çıkan Özellikler

- **🫁 Bilimsel Canlı Akciğer Simülasyonu**: Biyolojik loblar, nefes alma animasyonu ve sigarasız geçen zamana göre rengin pembeleşmesi ve katran lekelerinin temizlenmesi.
- **📈 Zaman Grafiği (Recharts)**: Sigara içilmeyen gün sayısı, biriken tasarruf (₺) ve içilmeyen adetlerin interaktif zaman eğrisi (7G, 14G, 30G, Tümü filtreleri).
- **🏆 Başarı Rozetleri**: 24 saat, 48 saat, 1 hafta, 1 ay vb. gibi önemli dönüm noktalarında konfeti kutlamaları ve başarı bildirimleri.
- **🛡️ Esnek Kaçamak (Slip-up) Yönetimi**: Ufak kaçamaklar yaşandığında bırakma tarihini sıfırlamadan veya son içilen saati güncelleyerek gerçekçi ve motive edici takip.
- **💰 Tasarruf Hedefleri**: Biriken parayla alınabilecek kişisel ödüller ve ilerleme çubuğu.
- **🚨 Kriz / Acil Durum Butonu**: Ani sigara krizlerinde 4-7-8 nefes egzersizi, su içme yönlendirmesi ve motivasyon telkinleri.
- **📱 Mobil Uyumlu ve Zarif Tasarım**: Sade, hedef odaklı ve göz yormayan modern arayüz.

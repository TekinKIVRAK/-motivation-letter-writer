# WordPress Plugin Kurulum Rehberi 🚀

## Motivation Letter Writer AI - Kolay Kurulum

---

## 📦 1. ADIM: Plugin'i İndir

Plugin hazır! Dosya adı: `motivation-letter-writer-plugin.zip`

---

## 🔧 2. ADIM: WordPress'e Yükle

### Yöntem A: WordPress Admin Panel (Önerilen ✅)

1. **WordPress Admin Panel**'e giriş yap
2. **Plugins** → **Add New** (Yeni Ekle)
3. **Upload Plugin** butonuna tıkla
4. `motivation-letter-writer-plugin.zip` dosyasını seç
5. **Install Now** tıkla
6. **Activate Plugin** tıkla

### Yöntem B: FTP/cPanel

1. ZIP dosyasını aç
2. `motivation-letter-writer` klasörünü `/wp-content/plugins/` içine yükle
3. WordPress Admin → Plugins → Activate

---

## ⚙️ 3. ADIM: Ayarları Yap

1. **Settings** → **Motivation Letter Writer** menüsüne git

2. **Backend URL** alanına yaz:
   ```
   https://motivation-letter-writer-production.up.railway.app
   ```
   *(Zaten otomatik dolu olabilir)*

3. **Anthropic API Key** alanına API anahtarını gir:
   - https://console.anthropic.com/ adresinden al
   - `sk-ant-` ile başlar
   - Güvenli bir yerde sakla

4. **Save Settings** tıkla

---

## 📄 4. ADIM: Sayfana Ekle

### Gutenberg Editor (Blok Editör)

1. Sayfa veya Post'u aç
2. **+ (Yeni Blok)** ekle
3. **Shortcode** bloğu ara ve ekle
4. Shortcode'u yaz:
   ```
   [motivation_letter_writer]
   ```
5. **Publish** veya **Update** tıkla

### Elementor, Divi, vb. Page Builder

1. **Shortcode Widget** ekle
2. İçine yaz:
   ```
   [motivation_letter_writer]
   ```
3. Kaydet ve yayınla

### Klasik Editör

1. Sayfayı düzenle
2. İstediğin yere yaz:
   ```
   [motivation_letter_writer]
   ```
3. Kaydet

---

## 🎨 5. ADIM (Opsiyonel): Özelleştir

### Genişlik Ayarları

```
[motivation_letter_writer max_width="900px"]
```

```
[motivation_letter_writer width="90%"]
```

### Tam Genişlik

```
[motivation_letter_writer max_width="1400px"]
```

---

## ✅ Test Et

1. Sayfayı aç (frontend'de)
2. Form görünüyor mu? ✅
3. Dosya yükleyebiliyor musun? ✅
4. Mektup oluşturabiliyor musun? ✅

---

## 🐛 Sorun mu Yaşıyorsun?

### "API key not configured" hatası
- Settings → Motivation Letter Writer
- API Key'i gir
- Save Settings

### "Failed to connect to backend" hatası
- Backend URL'i kontrol et
- Railway backend çalışıyor mu?
- Backend URL: https://motivation-letter-writer-production.up.railway.app/health

### Widget görünmüyor
- Plugin aktif mi? (Plugins menüsünden kontrol et)
- Shortcode doğru yazılmış mı?
- Sayfayı yenile (cache temizle)
- Tarayıcı cache'ini temizle (Ctrl+Shift+Del)

### Dosya yüklenmiyor
- WordPress upload limiti: Settings → Media
- Max file size: 10MB
- Sadece PDF, DOC, DOCX desteklenir

---

## 💰 Maliyet

- Backend: Railway (ücretsiz 500 saat/ay)
- Claude API: ~$0.005-0.02 per letter
- 100 mektup/ay = ~$1-2

---

## 📱 Önerilen Sayfa Örnekleri

### Örnek 1: Dedicated Tool Page
**URL:** `/motivation-letter-generator/`
```
# AI ile Motivation Letter Oluştur

Profesyonel, etkileyici motivation letterlar oluşturun.

[motivation_letter_writer]
```

### Örnek 2: Career Services
**URL:** `/kariyer-araclari/`
```
## Ücretsiz Kariyer Araçları

### Motivation Letter Generator
AI destekli mektup oluşturucu.

[motivation_letter_writer max_width="900px"]
```

### Örnek 3: Blog Post İçinde
```
... blog yazısı ...

## Kendi Mektubunu Oluştur

[motivation_letter_writer]
```

---

## 🔐 Güvenlik

✅ **YAP:**
- API key'i güvende tut
- HTTPS kullan
- Düzenli olarak güncelle

❌ **YAPMA:**
- API key'i paylaşma
- Public yerleşim git commit'leme

---

## 📞 Destek

- **Email:** contact@mindtrellis.com
- **Website:** https://mindtrellis.com
- **Railway Backend:** https://motivation-letter-writer-production.up.railway.app/health

---

## ✨ Özellikler

✅ 3 farklı ton (Professional, Friendly, Enthusiastic)
✅ Resume/CV yükleme (PDF, DOC, DOCX)
✅ Özelleştirme önerileri
✅ Mobil uyumlu
✅ Responsive tasarım
✅ Hızlı ve güvenilir

---

**Başarılar! 🎉**

Plugin kurulumu tamamlandı. Artık WordPress sitenizde AI destekli motivation letter oluşturabilirsiniz!

---

## 📋 Hızlı Kontrol Listesi

- [ ] Plugin yüklendi ve aktif edildi
- [ ] Backend URL ayarlandı
- [ ] Anthropic API key girildi
- [ ] Settings kaydedildi
- [ ] Shortcode bir sayfaya eklendi
- [ ] Sayfa yayınlandı
- [ ] Frontend'de test edildi
- [ ] Mektup başarıyla oluşturuldu

**Hepsi tamam mı? Tebrikler! 🎊**

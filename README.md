# Takım Sandığı

Yazılımcıların ve günlük bilgisayar kullanıcılarının ihtiyaç duyduğu pratik araçları tek, sade ve modern bir web uygulamasında toplayan ücretsiz bir platform.

Reklam, üyelik veya ücretli özellik yoktur. Tüm işlemler tarayıcıda yapılır; girilen hiçbir veri bir sunucuya gönderilmez.

**Geliştiren:** İbrahim Taşkın
**Ders:** İnternet Programcılığı-I, Kayseri Ünversitesi Teknik Bilimler M.Y.O.

## Kullanılan teknolojiler

- HTML5
- CSS3 (CSS değişkenleri, Grid, Flexbox, media query'ler)
- Vanilla JavaScript (ES modülleri, dinamik `import()`)
- Web Crypto API (`crypto.getRandomValues`)
- Canvas API ve Clipboard API

Framework veya backend kullanılmamıştır.

## Araçlar

| Araç | Açıklama |
|---|---|
| JSON Biçimlendirici | JSON verisini doğrular, girintili biçimlendirir veya tek satıra küçültür. |
| CSS Gradient Oluşturucu | İki renk, renk konumları ve açıyla canlı önizlemeli `linear-gradient` kodu üretir. |
| Metin Araçları | Kelime, karakter ve satır sayar; büyük/küçük harf ve başlık biçimine dönüştürür, fazla boşlukları temizler. |
| Şifre Oluşturucu | Seçilen karakter türleri ve uzunlukla güvenli rastgele şifre üretir, şifre gücünü gösterir. |
| QR Kod Oluşturucu | Metin veya bağlantıdan taranabilir QR kod oluşturur ve PNG olarak indirir. |
| Renk Dönüştürücü | HEX, RGB ve HSL biçimleri arasında anlık dönüşüm yapar. |

## Öne çıkan özellikler

- **Tek sayfa uygulaması (SPA):** Hash tabanlı router ile araçlar arasında sayfa yenilenmeden geçilir. Tarayıcının geri/ileri düğmeleri ve doğrudan bağlantılar (örneğin `#/json`) çalışır.
- **İhtiyaç anında yükleme:** Her aracın kodu yalnızca o araç açıldığında indirilir.
- **Kaynak temizliği:** Araç değiştirildiğinde önceki aracın olay dinleyicileri `AbortController` ile kaldırılır.
- **Koyu ve açık tema:** Tercih `localStorage` ile saklanır.
- **Tasarım:** Göktürk turkuazı ve Asya bozkırının doğa renklerinden esinlenen palet, buzlu cam kartlar.
- **Responsive:** Mobil, tablet ve masaüstü uyumlu; mobilde açılır menü.
- **Erişilebilirlik:** Anlamlı HTML etiketleri, form etiketleri, ARIA öznitelikleri, klavye ile gezinme, belirgin odak çerçevesi ve hareket azaltma tercihine uyum.
- **Güvenlik:** Kullanıcı girdisi HTML olarak eklenmez (`textContent` ve `.value` kullanılır); şifreler kaydedilmez ve gönderilmez.

## Yerel ortamda çalıştırma

Uygulama JavaScript modülleri kullandığı için `index.html` dosyasına çift tıklayarak açıldığında çalışmaz; bir yerel sunucu gerekir.

1. Projeyi Visual Studio Code ile aç.
2. **Live Server** eklentisini kur.
3. `index.html` dosyasına sağ tıklayıp **Open with Live Server** seçeneğini seç.

## Dosya yapısı

```text
takim-sandigi/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   ├── style.css          Renk değişkenleri ve temel stiller
    │   ├── layout.css         Sayfa düzeni ve mobil menü
    │   ├── components.css     Düğme, form ve bildirim stilleri
    │   ├── tools.css          Araçlara özel stiller
    │   └── effects.css        Buzlu cam ve görsel efektler
    ├── js/
    │   ├── app.js             Uygulamayı başlatır
    │   ├── router.js          Hash tabanlı yönlendirme
    │   ├── tools-data.js      Tüm araçların listesi
    │   ├── navigation.js      Yan menü
    │   ├── home.js            Ana sayfa ve araç arama
    │   ├── views.js           Araç ve "bulunamadı" ekranları
    │   ├── menu.js            Mobil menü davranışı
    │   ├── theme.js           Tema değiştirme
    │   ├── storage.js         Güvenli localStorage işlemleri
    │   ├── toast.js           Bildirimler
    │   ├── clipboard.js       Panoya kopyalama
    │   ├── utils.js           Ortak yardımcı fonksiyonlar
    │   └── tools/             Her aracın kendi modülü
    └── vendor/
        └── qrcode.js          QR kod kütüphanesi
```

## Üçüncü taraf kütüphaneler

| Kütüphane | Sürüm | Lisans | Kullanım amacı |
|---|---|---|---|
| [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (Kazuhiko Arase) | 1.4.4 | MIT | QR kod verisinin hesaplanması |

Kütüphane proje içinde (`assets/vendor/`) bulunur; QR kod oluşturmak için internet bağlantısı gerekmez. Çizim ve PNG indirme işlemi uygulamanın kendi kodu ile Canvas API üzerinden yapılır.

## Bilinen sınırlamalar

- Uygulama yerel bir sunucu olmadan çalışmaz.
- Panoya kopyalama yalnızca güvenli bağlamlarda (`localhost` veya `https`) çalışır.
- Gradient oluşturucu şimdilik iki renkle sınırlıdır.
- QR kod en fazla birkaç bin karakterlik metin taşıyabilir; daha uzun metinlerde uyarı gösterilir.
- JSON hata açıklaması tarayıcıdan geldiği için çoğu tarayıcıda İngilizcedir.
- Açık tema seçiliyken sayfa yenilendiğinde çok kısa süre koyu tema görünebilir.
- Favori araçlar özelliği bu sürümde yoktur.

## Gelecekte eklenebilecekler

- Favori araçlar
- Gradient oluşturucuda ikiden fazla renk
- UUID oluşturucu
- Base64 ve URL encode/decode
- Markdown önizleyici
- Timestamp dönüştürücü
- CSS box-shadow oluşturucu
- Regex test aracı
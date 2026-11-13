# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Koleksiyoncular:** Orijinal eser satın almak ya da koleksiyonuna eklemek isteyen kişiler. Eseri, sanatçıyı ve özgünlüğü değerlendirmek için siteye gelirler.
- **Bireysel alıcılar:** Evleri için ya da hediye olarak orijinal tablo arayan kişiler.
- Ziyaretçiler masaüstü ve mobilden dengeli gelir; iki cihaz da eşit önemde. Site Türkçe ve İngilizce hizmet verir.

## Product Purpose

Piece Of Oblivion, sanatçı Beliz Keskin'in orijinal tablolarını ve çizimlerini sergileyen ve satan kişisel sitesidir. İki işi birlikte yapar:

1. **Satış:** Ziyaretçi bir eseri beğenir ve form ya da e-posta yoluyla iletişime geçer. Satış iletişim üzerinden ilerler.
2. **İtibar ve portfolyo:** Sanatçının adını, işini ve duruşunu güçlendirir.

Başarı, nitelikli e-posta taleplerinin gelmesi ve sanatçının ciddi, seçkin bir sanatçı olarak algılanmasıdır.

## Positioning

Tek bir sanatçının yalnızca orijinal, tek parça tablolarını ve çizimlerini sunar ve dünyanın her yerine gönderir. Her eser bir Özgünlük Sertifikasıyla gelir ve sertifika sitede herkese açık bir doğrulama sayfasından (`/verify/:certId`) kontrol edilebilir.

## Operating Context

- Ziyaretçi eserleri koleksiyonlar ve tüm eserler sayfasında gezer, eser detayını açar ve "Bu eser için yazın" formuyla talep bırakır. Talep panele kaydedilir ve admin ayarlarındaki adrese e-postayla gider (EmailJS). Ödeme planı ve yurt dışı alımlar için crnoktay@gmail.com adresi gösterilir.
- Sanatçı admin panelinden eserleri, koleksiyonları ve gelen talepleri yönetir, yazdırılabilir özgünlük sertifikası üretir.

## Capabilities and Constraints

- **Sepet ve online ödeme yok, eklenmeyecek.** **Fiyatlar sitede hiç gösterilmez ve panelde tutulmaz.** Satış iletişim üzerinden tamamlanır. Talep listesi ("listeye ekle") özelliği kaldırıldı.
- Satılan eser türü: orijinal tablolar ve çizimler (baskı, dijital eser veya obje yok).
- Dünyanın her yerine gönderim yapılır.
- Eserlerin hepsi imzalıdır ve özgünlük sertifikasıyla gelir.
- Sanatçı özel sipariş (kişiye özel eser) kabul eder.
- Mesajlara 24–48 saat içinde yanıt verilir.
- **Sunulmayan hizmetler (sitede yazılmaz):** randevulu atölye ziyareti, özel gösterim, çerçeve ve montaj danışmanlığı, ayrı bir "danışman". Talepleri sanatçı kendisi yanıtlar.
- **Yazılmayacak rakamlar:** kuruluş yılı, deneyim yılı, eser sayısı.
- Korunması gereken teknik yapı (değiştirilemez):
  - React + Vite + Tailwind yığını
  - GitHub Pages yayını, `/carmen-e-commerce-main/` base yolu
  - Firebase (Firestore, Auth) veri yapısı: koleksiyon ve alan adları aynı kalacak, mevcut veriler çalışmaya devam edecek
  - TR / EN iki dil desteği (`src/locales/tr.json`, `src/locales/en.json`). Dil cihaz diline göre seçilir: cihaz Türkçeyse TR, değilse EN. Elle dil değiştirme butonu yoktur.
  - EmailJS ile iletişim, ImgBB ile görsel yükleme
- Yeniden tasarım tüm sayfaları kapsar: vitrin sayfaları, admin paneli, sertifika ve doğrulama sayfası. Çalışma ana sayfadan başlar, onaylandıktan sonra diğer sayfalara yayılır.
- Site yalnızca koyu temada çalışır; açık tema yok.

## Brand Commitments

- **İsimler:** Site ve marka adı **Piece Of Oblivion**; sanatçının adı **Beliz Keskin**. Sayfa başlıkları, logo ve kurumsal satırlar marka adını; eser imzası, biyografi ve sertifikadaki sanatçı satırı sanatçının adını kullanır. "Carmen" yalnızca depo ve kod içi adlarda kalır, sitede görünmez.
- **Sabit (sanatçının seçimi, değiştirilemez):** Piece Of Oblivion logosu (`public/logo.svg`, `src/components/ui/Logo.jsx`), siyah zemin ve bordo-kırmızı vurgu rengi (mevcut değer `#af362c`).
- Sanatçının deneyim süresi sitede belirtilmez ("on yılı aşkın" ifadesi doğru değildir).
- **Onaylı biyografi (2026-11-14, sanatçıdan):** 1998 Ankara doğumlu; ilk, orta ve lise eğitimi Ankara'da; 2020'de Gazi Üniversitesi Radyo, Televizyon ve Sinema Bölümü mezunu. Sanat anlayışı: insanın iç dünyası, bastırılmış duyguları ve yüzleşmekten kaçındığı gerçeklikler; sanat izleyicinin duygusal konfor alanını sarsmalı, sorgulatmalı, "bakılan ile hissedilen arasındaki mesafeyi" kaldırmalı. Sitedeki biyografi metinleri (`about.bio1–3`, `landing.artistQuote/artistBio`) bu metinden türetilmiştir; yeni iddia eklenmez.
- Marka kişiliği: lüks butik. Koyu, dramatik ve seçkin bir koleksiyoncu deneyimi.
- Metinlerin dili yeniden önerilecek: mevcut "Kasa", "Üstat", "Başyapıt" gibi abartılı ifadeler sanatçının onayıyla yeniden yazılacak. Onay gelmeden metin değiştirilmez.

## Evidence on Hand

- Kaliteli eser fotoğrafları (Firestore'daki ürün kayıtlarında, ImgBB üzerinde).
- Sanatçı ve atölye fotoğrafları (`src/assets/images/studio.webP` ve sanatçının sağlayacakları).
- **Yok:** mekânda çekilmiş eser fotoğrafları, basın haberleri, sergi geçmişi, ödüller, müşteri yorumları. Bunlar uydurulmayacak.

## Product Principles

1. **Eser önce gelir.** Arayüz eserin önüne geçmez, onu sahneler.
2. **Güven satışı taşır.** Özgünlük doğrulanabilir, iletişim tek adımdadır.
3. **Seçkinlik abartıyla değil, özenle kurulur.** Kanıtlanamayan iddia ve uydurma içerik kullanılmaz.
4. **Teknik temel korunur.** Mevcut veri, yayın ve dil yapısı bozulmadan yeniden tasarlanır.

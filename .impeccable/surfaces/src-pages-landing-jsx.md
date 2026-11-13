---
version: 1
slug: "src-pages-landing-jsx"
primary_target: "src/pages/Landing.jsx"
related_targets: ["src/components/landing/Hero.jsx","src/components/landing/FeaturedExhibition.jsx","src/components/landing/ArtistSection.jsx"]
---

# Landing (ana sayfa)

Scope: `src/pages/Landing.jsx` ve `src/components/landing/*`. Mode: Persuade. Yeniden tasarım; mevcut bölüm sırası (giriş, seçkin eserler, bülten, sanatçı) korunur. Diğer sayfalar onaydan sonra aynı dünyayı devralacak.

Audience/job: koleksiyoncu ve bireysel alıcı, orijinal tabloyu değerlendirir, fiyatı görür, sanatçıya e-postayla yazar. Proof: gerçek eser fotoğrafları (Firestore), atölye fotoğrafı, doğrulanabilir özgünlük sertifikası. Uydurulmuş basın/yorum yok.

User steer (decision round): "mevcut yapıyı ve havasını bozmadan daha premium bir estetik ve etkileşim".

## Direction contract

THESIS: Ana sayfa bir akşam satışı kataloğudur: kapak eseri, numaralı eser sayfaları, sanatçı yazısı. Reddedilen kategori varsayılanı: koyu zemin üstüne parlamalar, nokta ızgarası, hap rozet, eşit kart ızgarası.

OWN-WORLD: Mat siyah kapak zemini, kemik beyazı künye metni, #af362c yalnızca eser numarası, eylem ve satış durumu için. Kıl çizgisi ayraçlar, künye tanım listesi (teknik / ölçü / yıl / belge), tablo rakamlı fiyat. Gradyan, cam, gölge parlaması, ikon karosu, yuvarlatılmış kart yok.

STORY: Ziyaretçi kapakta en yeni eseri ve künyesini görür, fiyatı okur, tek adımda yazar; kaydırdıkça numaralı eser sayfaları açılır; sonra sanatçı yazısı ve bülten.

FIRST VIEWPORT: Üstte kıl çizgisiyle ayrılmış nav. Solda büyük eser levhası (heroPiece, gerçek oranı, viewport yüksekliğinin ~78'i). Sağda kırmızı dev eser numarası "01", altında kıl çizgisi, eser adı (büyük serif), künye listesi, fiyat ve tek birincil eylem "Bu eser için yazın" (kemik zemin, siyah yazı). Sağ altta folyo: KATALOG · yıl · 01 / N.

FORM: Akşam Müzayedesi Kataloğu, safer re-roll elinde kendi listemde 2. sırada, kullanıcı seçti. seed:8342fb3d9bae8bfb. İmza etkileşimi: "sayfa çevirme" — kaydırmada eser sayfaları sabitlenip sırayla geçer, eser numarası ve künye levhayla birlikte değişir. Hareket sakin, kâğıt ağırlığında; reduced-motion'da sayfalar düz akışta.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions

- Yeni metinler (TR/EN) kullanıcı onayına sunulacak; onaysız metin değişmez.
- Font seçimi build başında doğrulanacak (Türkçe karakter desteği şart).

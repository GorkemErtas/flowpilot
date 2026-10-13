# AI_LOG — FlowPilot

Bu projeyi Enteksis'in full-stack uygulama çalışması için AI desteğiyle geliştirdim. Amacım, kurgusal bir otomasyon hizmetini anlatan sade bir sayfa hazırlamak ve formdan gelen talepleri gerçekten veritabanına kaydetmekti. FlowPilot bir otomasyon motoru değil; otomasyon hizmeti için hazırlanmış bir tanıtım ve talep toplama uygulaması.

## AI'yi nasıl kullandım?

- **Codex:** İlk uygulama iskeletini, arayüzü, API'yi, veritabanı katmanını ve otomatik testleri geliştirdi. Çalışmayı aşamalara bölüp Git commit'leri oluşturmasını istedim.
- **ChatGPT:** Teknik tercihleri anlamak, test ve deployment adımlarını planlamak, karşılaştığım hataları incelemek ve sonradan istediğim tema değişikliklerini yapmak için kullandım.
- **Benim katkım:** Gereksinimleri ve istediğim arayüz yaklaşımını belirledim; çıkan arayüzü değerlendirdim, Neon ve Vercel kurulumlarını yaptım, testleri kendi ortamımda çalıştırdım ve canlı form kaydını kontrol ettim.

AI'nin yazdığı kodu tamamen elle yazmışım gibi sunmuyorum. Teknik uygulamanın önemli bölümü AI tarafından üretildi; yönlendirme, kontrol, geri bildirim ve yayına alma sürecini ben yürüttüm.

## Önemli tercihler

- **Next.js + TypeScript:** Arayüz ve API'yi tek projede tutmak için kullanıldı.
- **PostgreSQL + Prisma:** Form verisinin tarayıcıda değil, sunucuda kalıcı olarak saklanması için seçildi.
- **Zod:** İstemci ve sunucuda tutarlı alan doğrulaması sağlamak için kullanıldı.
- **Vitest + Playwright:** Yalnızca kodun derlenmesini değil, formun ve veritabanı akışının çalışmasını da kontrol etmek için kullanıldı.
- **Neon + Vercel:** Ayrı bir sunucu yönetmeden uygulamayı yayınlamak için tercih edildi.

Bu araçların uygulanmasında AI'den yararlandım; seçimleri case'in ihtiyaçlarına göre değerlendirerek ilerledim.

## Karşılaştığım sorunlar ve kontroller

1. **Entegrasyon testleri başarısız oldu.** Prisma, geçici test şemasındaki tabloları bulamadı. Migration SQL'leri doğru şemada çalışacak şekilde düzeltildi (`7fd3cfd`). Ardından testleri tekrar çalıştırdım: **3/3 geçti**.
2. **Playwright kurulumu P3005 hatası verdi.** Test veritabanındaki dolu `public` şeması yerine ayrı bir `flowpilot_e2e` şeması kullandım. Tarayıcı testleri başarılı oldu.
3. **Canlı kayıt kontrolü yaptım.** Formu Vercel'deki siteden gönderdim ve kaydın Neon PostgreSQL'de oluştuğunu doğruladım.
4. **Tema tasarımını gözden geçirdim.** Light/Dark geçişini sonradan eklettim. Koyu temada talep bölümünün kontrastı bozulunca ekran görüntüsüyle sorunu bildirdim ve düzeltildi.

İlk geliştirme sırasında AI tarafından **47 birim/bileşen testi, 3 PostgreSQL entegrasyon testi ve 8 Playwright testi** başarılı olarak raporlandı. Kendi ortamımda entegrasyon testlerinin 3/3 geçtiğini ve Playwright testlerinin başarılı olduğunu ayrıca gördüm. Son tema değişikliklerinden sonra tüm testlerin yeniden çalıştırıldığını iddia etmiyorum.

## Bilinen sınırlar

FlowPilot gerçek otomasyon süreçleri çalıştırmıyor; kullanıcı hesabı, yönetim paneli veya gerçek müşteri entegrasyonu içermiyor. Bunlar verilen görevin kapsamı dışındaydı. Tema değişikliklerinden sonra mobil görünüm ve kontrastın son kez kontrol edilmesi gerekiyor. Gerçek müşteri verileriyle kullanım için ayrıca gizlilik ve veri saklama süreçleri belirlenmeli.

**Canlı uygulama:** https://flowpilot-orcin.vercel.app/  
**Kaynak kod:** https://github.com/GorkemErtas/flowpilot

> Bu kayıt, AI katkısını ve gerçekten yaptığım kontrolleri açıkça göstermek için tutuldu. Doğrulamadığım bir sonucu başarılı olarak göstermedim.

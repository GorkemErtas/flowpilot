# FlowPilot

**İş otomasyonu hizmetleri için modern bir tanıtım ve talep toplama uygulaması.**

Enteksis full-stack case çalışması kapsamında geliştirdiğim FlowPilot, işletmelerin tekrarlayan işlerini otomatikleştirmeye yönelik **kurgusal bir hizmeti** tanıtıyor. Ziyaretçiler hizmetleri inceleyip talep formu gönderebiliyor; talepler sunucu tarafında doğrulanarak PostgreSQL'e kaydediliyor.

> **Kapsam:** FlowPilot bir otomasyon motoru değil; çalışan bir landing page, API ve kalıcı veri kayıt akışı içeriyor.

**[Canlı uygulama](https://flowpilot-orcin.vercel.app/)** · **[AI kullanım günlüğü](AI_LOG.md)**

## Özellikler

- **Responsive arayüz:** Mobil ve masaüstüne uyumlu tasarım.
- **Tema seçimi:** Açık ve koyu mod; tercih tarayıcıda saklanır.
- **Talep formu:** Ad soyad, e-posta, hizmet ve açıklama alanları.
- **Doğrulama:** İstemci ve sunucu tarafında alan kontrolleri.
- **Kalıcı kayıt:** Başarılı talepler PostgreSQL'e kaydedilir; kayıt tamamlanmadan başarı mesajı gösterilmez.
- **Hata yönetimi:** Gönderim, başarı, doğrulama ve sunucu hatası durumları.
- **Hız sınırlama:** Tekrarlanan istekleri sınırlandıran veritabanı destekli kontrol.

## Teknoloji yığını

| Alan | Teknolojiler | Kullanım amacı |
| --- | --- | --- |
| **Frontend** | Next.js 16, React 19, TypeScript | Arayüz ve uygulama yapısı |
| **Stil ve animasyon** | Tailwind CSS 4, Motion | Responsive tasarım ve geçişler |
| **Form ve doğrulama** | React Hook Form, Zod | Form yönetimi ve veri doğrulama |
| **Backend** | Next.js Route Handlers | Sunucu tarafı API |
| **Veritabanı** | PostgreSQL (Neon), Prisma 6 | Kalıcı kayıt ve veri erişimi |
| **Test** | Vitest, Playwright, axe-core | Birim, entegrasyon, tarayıcı ve erişilebilirlik kontrolleri |
| **Deployment** | Vercel | Canlı yayın |

## Mimari ve veri akışı

```text
Kullanıcı
   │
   ▼
Talep Formu (React Hook Form + Zod)
   │
   ▼
POST /api/requests
   │
   ▼
Sunucu doğrulaması + hız sınırı
   │
   ▼
Prisma → Neon PostgreSQL
   │
   ▼
API yanıtı → Başarı / hata bildirimi
```

- **Sunucu doğrulaması:** İstemci kontrollerinden bağımsız olarak her talep tekrar doğrulanır.
- **Veri bütünlüğü:** Talep kaydı ve hız sınırı sayaçları PostgreSQL transaction'ı içinde işlenir.
- **API yanıtları:** Başarılı kayıt için `201`; geçersiz veri için `422`, hız sınırı için `429`, beklenmeyen hata için `500`. İçerik türü, JSON ve istek boyutu hataları da ele alınır.
- **Sınırlar:** Aynı e-posta için saatte **3**, tüm sistemde dakikada **30** başarılı talep.

## Yerel kurulum

**Gereksinimler:** Node.js 24.x ve PostgreSQL bağlantısı.

**1. Bağımlılıkları kur**

```bash
npm ci
```

**2. Ortam değişkenlerini ayarla**

`.env.example` dosyasını `.env` olarak kopyalayıp kendi bağlantı bilgilerini gir:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/flowpilot?sslmode=require"
TEST_DATABASE_URL="postgresql://USER:PASSWORD@HOST/flowpilot_test?sslmode=require&schema=flowpilot_e2e"
```

- `DATABASE_URL`: Uygulamanın ana veritabanı.
- `TEST_DATABASE_URL`: Yalnızca testler için kullanılan **ayrı veritabanı**. Gerçek veriler içeren bir veritabanını testlerde kullanma.
- `flowpilot_e2e`: Tarayıcı testleri için ayrılmış boş PostgreSQL şeması.

**3. Veritabanını hazırla ve uygulamayı başlat**

```bash
npm run db:deploy
npm run dev
```

Uygulama: **http://localhost:3000**

## Testler ve doğrulama

| Kontrol | Komut |
| --- | --- |
| ESLint | `npm run lint` |
| TypeScript | `npm run typecheck` |
| Biçimlendirme | `npm run format:check` |
| Birim / bileşen testleri | `npm test` |
| PostgreSQL entegrasyonu | `npm run test:integration` |
| Production build | `npm run build` |
| Tarayıcı testleri | `npm run test:e2e` |

İlk tarayıcı testi öncesinde `npx playwright install chromium` çalıştırılmalı. Entegrasyon testleri ayrı test veritabanında geçici şemalar kullanır.

**Son doğrulama:** Yukarıdaki kontrollerin tamamını kendi bilgisayarımda çalıştırdım ve başarılı sonuç aldım. Geliştirme sürecinde **47 birim/bileşen, 3 entegrasyon ve 8 tarayıcı testi** başarılı olarak raporlandı. Ayrıca canlı form gönderiminin Neon'a kaydedildiğini; mobil görünümü, tema geçişini ve metinlerin okunabilirliğini kontrol ettim.

## Geliştirme süreci ve AI kullanımı

Projeyi planlama, geliştirme, test ve canlıya alma dahil **3 saatten kısa sürede** tamamladım.

1. **Planlama:** Uygulamanın amacını, işleyişini, teknoloji yığınını ve mimari yaklaşımı belirledim.
2. **Prompt hazırlığı:** Bu gereksinimleri ChatGPT'ye aktararak Codex için kapsamlı bir AI developer prompt'u oluşturdum.
3. **Geliştirme:** Prompt'u Codex'e vererek uygulamayı geliştirmeye başladım; süreç boyunca sonuçları inceleyip yönlendirmeler yaptım.
4. **Test ve yayın:** Hataları giderdim, testleri çalıştırdım, Neon bağlantısını doğruladım ve uygulamayı Vercel'de yayına aldım.

AI'yi geliştirmeyi hızlandırmak için kullandım; **gereksinimler, teknik kararlar, yönlendirme ve sonuçların doğrulanması** benim sorumluluğumdaydı. AI'nin katkılarını ve karşılaştığım sorunları [AI_LOG.md](AI_LOG.md) dosyasında açıkladım.

## Deployment

- Kaynak kod GitHub üzerinden Vercel'e bağlı.
- Production ortamında Neon bağlantısı `DATABASE_URL` ile sağlanıyor.
- `TEST_DATABASE_URL` production ortamında kullanılmıyor.
- Veritabanı migration'ları `npm run db:deploy` ile uygulanıyor.
- Yeni sürümlerde deployment ve canlı form akışı tekrar kontrol edilmeli.

## Bilinen sınırlar

- Gerçek otomasyon iş akışları ve üçüncü taraf servis entegrasyonları bulunmuyor.
- Kullanıcı hesabı ve yönetim paneli bu case'in kapsamına dahil değil.
- Gerçek müşteri verileriyle kullanımdan önce gizlilik ve veri saklama süreçleri ayrıca ele alınmalı.

---

**Teslim sürümü:** Bu repodaki son `main` commit'i. Tam commit kimliği için `git rev-parse HEAD` komutu kullanılabilir.

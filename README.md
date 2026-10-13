# FlowPilot

**Tekrarlayan işleri otomatikleştirin. İşinize odaklanın.**

FlowPilot, Enteksis full-stack uygulama çalışması için geliştirdiğim kurgusal bir iş otomasyonu hizmeti sitesi. Amacı, hizmeti anlaşılır şekilde tanıtmak ve ziyaretçilerin taleplerini güvenilir biçimde kaydetmek.

Bu proje **gerçek bir otomasyon motoru değil**; çalışan bir landing page, talep formu, API ve PostgreSQL veritabanından oluşuyor.

**[Canlı site](https://flowpilot-orcin.vercel.app/)** · **[AI kullanım süreci](AI_LOG.md)**

## Neler var?

- Mobil ve masaüstüne uyumlu, Türkçe landing page; açık/koyu tema seçimi.
- İsim, e-posta, hizmet ve açıklama alanlarından oluşan talep formu.
- İstemci ve sunucu tarafında doğrulama; gönderiliyor, başarı ve hata durumları.
- Başarılı gönderimlerde Neon PostgreSQL'e **kalıcı kayıt**. Kayıt tamamlanmadan başarı mesajı gösterilmiyor.
- Tekrarlanan taleplere karşı veritabanı tabanlı hız sınırı ve otomatik testler.

## Kullandığım teknolojiler

**Next.js 16, React 19, TypeScript, Tailwind CSS 4** ile arayüz ve API; **React Hook Form + Zod** ile form doğrulaması; **Prisma + PostgreSQL (Neon)** ile veri saklama; **Vitest + Playwright** ile testler. Uygulama **Vercel** üzerinde yayınlanıyor.

Veri akışı basit:

```text
Ziyaretçi → Talep formu → Next.js API → Doğrulama → Prisma → PostgreSQL
                                               ↓
                                     Başarı / hata yanıtı
```

## Bilgisayarında çalıştır

**Node.js 24.x** ve bir PostgreSQL veritabanı gerekiyor.

```bash
npm ci
```

`.env.example` dosyasını `.env` olarak kopyala ve kendi bağlantı bilgilerini gir:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/flowpilot?sslmode=require"
TEST_DATABASE_URL="postgresql://USER:PASSWORD@HOST/flowpilot_test?sslmode=require&schema=flowpilot_e2e"
```

`DATABASE_URL` uygulamanın veritabanıdır. `TEST_DATABASE_URL` ise **ayrı bir test veritabanına** bağlanmalı; gerçek kayıtların olduğu veritabanını testlerde kullanma. Test bağlantısındaki `schema=flowpilot_e2e` parametresi tarayıcı testleri için ayrılmış boş bir şema seçer.

```bash
npm run db:deploy
npm run dev
```

Ardından [http://localhost:3000](http://localhost:3000) adresini aç.

## Testler

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
npx playwright install chromium
npm run test:e2e
```

Entegrasyon testleri gerçek PostgreSQL üzerinde çalışır ve kendilerine ait geçici şemayı temizler. Playwright testleri ise üretim build'ini tarayıcıda açıp form akışını kontrol eder.

Geliştirme sırasında **47 birim/bileşen testi, 3 entegrasyon testi ve 8 tarayıcı testi** başarılı olarak raporlandı. Daha sonra kendi ortamımda **3/3 entegrasyon testinin** ve Playwright testlerinin geçtiğini gördüm. Canlı siteden gönderdiğim kurgusal talebin Neon'da oluştuğunu da doğruladım. Son tema düzenlemelerinin ardından tüm testler yeniden çalıştırılmış değil; ayrıntılar [AI_LOG.md](AI_LOG.md) dosyasında.

## API ve güvenlik

`POST /api/requests` JSON kabul eder. Form alanları hem tarayıcıda hem sunucuda kontrol edilir. Kayıt başarılıysa **201**, geçersiz veri için **422**, hız sınırı için **429**, beklenmeyen sunucu hatasında **500** döner. Hatalı JSON, içerik türü ve büyük istekler için de ayrı yanıtlar vardır.

Kayıt ve hız sınırı sayaçları tek PostgreSQL transaction'ında işlenir. Sınırlar: **aynı e-posta için saatte 3**, **genel olarak dakikada 30** başarılı talep. Bağlantı bilgileri yalnızca sunucuda tutulur; `.env` dosyası Git'e eklenmez.

## Yayına alma

GitHub reposu Vercel'e bağlı. Production ortamında Neon'un **ana veritabanı** `DATABASE_URL` olarak tanımlanıyor; `TEST_DATABASE_URL` production'a eklenmiyor. Migration'lar kontrollü olarak `npm run db:deploy` ile uygulanıyor. Yeni commit'lerden sonra Vercel deployment'ı ve canlı form yeniden kontrol edilmeli.

## Bilinen sınırlar

FlowPilot gerçek iş akışlarını çalıştırmıyor; kullanıcı hesabı, yönetim paneli ve gerçek servis entegrasyonları yok. Bunlar bu çalışmanın kapsamına dahil edilmedi. Gerçek kişisel verilerle kullanımdan önce veri saklama ve gizlilik süreçleri belirlenmeli. Koyu tema için son mobil/kontrast kontrolü de yapılmalı.

Bu projeyi AI desteğiyle geliştirdim. Neyi AI'ye yaptırdığımı, hangi kararları verdiğimi, karşılaştığım hataları ve doğrulama adımlarını **[AI_LOG.md](AI_LOG.md)** dosyasında anlattım.

**Teslim commit'i:** Son kontrollerden sonra sabitlenecek; güncel commit için `git rev-parse HEAD`.

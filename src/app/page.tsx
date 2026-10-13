import { Header } from "@/components/layout/header";
import { RequestForm } from "@/components/forms/request-form";
import { WorkflowVisual } from "@/components/sections/workflow-visual";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { serviceOptions } from "@/features/service-requests/types";

const serviceMeta = [
  {
    icon: "grid" as const,
    eyebrow: "01",
    text: "Dağınık adımları, tek ve izlenebilir bir akışta birleştirin.",
  },
  {
    icon: "brain" as const,
    eyebrow: "02",
    text: "Tekrarlayan kararları doğru bağlamla destekleyen yardımcılar tasarlayın.",
  },
  {
    icon: "chart" as const,
    eyebrow: "03",
    text: "Operasyon verinizi anlaşılır içgörülere ve düzenli raporlara dönüştürün.",
  },
];

const benefits = [
  "Manuel takip yükünü azaltmaya odaklı süreç tasarımı",
  "Ekibinizin günlük çalışma biçimine uyum",
  "İzlenebilir ve geliştirilebilir akışlar",
  "İhtiyacınıza göre sade bir başlangıç noktası",
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="ana-icerik" tabIndex={-1} className="overflow-hidden">
        <section className="relative isolate px-5 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_14%_30%,rgba(200,232,106,.42),transparent_35%),radial-gradient(ellipse_at_85%_6%,rgba(159,216,204,.30),transparent_35%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.03fr_.97fr] lg:gap-10">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#0d6d62]/12 bg-white/70 px-3.5 py-2 text-xs font-extrabold tracking-[.07em] text-[#0d6d62]">
                <span className="size-1.5 rounded-full bg-[#84b434]" />
                OPERASYON İÇİN OTOMASYON
              </p>
              <h1 className="mt-7 max-w-3xl text-[clamp(2.35rem,6vw,5.3rem)] font-extrabold leading-[.98] tracking-[-.07em] text-[#102a2c]">
                Tekrarlayan işleri{" "}
                <em className="font-inherit text-[#0d6d62]">
                  otomatikleştirin.
                </em>
                <br />
                İşinize odaklanın.
              </h1>
              <p className="mt-7 max-w-xl text-base font-medium leading-8 text-[#526968] sm:text-lg">
                FlowPilot, büyüyen ekiplerin dağınık operasyonlarını daha yalın,
                görünür ve yönetilebilir hale getirmesine yardımcı olur.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#talep"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0d6d62] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_9px_22px_rgba(13,109,98,.22)] transition hover:-translate-y-0.5 hover:bg-[#095b52]"
                >
                  Sürecinizi paylaşın <Icon name="arrow" className="size-4" />
                </a>
                <a
                  href="#nasil-calisir"
                  className="inline-flex items-center justify-center rounded-full border border-[#102a2c]/15 bg-white/70 px-6 py-3.5 text-sm font-extrabold text-[#17393a] transition hover:border-[#0d6d62]/35 hover:bg-white"
                >
                  Nasıl çalışır?
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <WorkflowVisual />
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[#102a2c]/8 bg-white px-5 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
              <div>
                <p className="eyebrow">İŞİNİZİN RİTMİNİ ANLIYORUZ</p>
                <h2 className="section-title mt-5">
                  İyi iş, sürekli kopyala-yapıştırla ilerlememeli.
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <p className="text-lg font-medium leading-8 text-[#526968]">
                  Tekrar eden talepler, elle tutulan tablolar ve farklı araçlara
                  bölünen işler ekibin odağını tüketir.
                </p>
                <p className="rounded-2xl border border-[#d5e5df] bg-[#f2f8f5] p-5 text-sm font-bold leading-6 text-[#28504c]">
                  FlowPilot, süreçleri önce anlamaya; sonra ihtiyacınız kadarını
                  otomatikleştirmeye odaklanır.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="cozumler" className="px-5 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow">NELERİ BİRLİKTE İYİLEŞTİREBİLİRİZ?</p>
              <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <h2 className="section-title max-w-2xl">
                  Operasyonunuzun ihtiyaç duyduğu, yerinde otomasyon.
                </h2>
                <p className="max-w-sm text-sm font-medium leading-6 text-[#526968]">
                  Hazır kalıplar yerine, ekibinizin gerçek çalışma biçimini
                  temel alırız.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {serviceOptions.map((service, index) => (
                <Reveal key={service.value} delay={index * 0.08}>
                  <article className="group h-full rounded-[1.6rem] border border-[#102a2c]/9 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0d6d62]/25 hover:shadow-[0_18px_35px_rgba(16,42,44,.08)]">
                    <div className="flex items-start justify-between">
                      <span className="grid size-11 place-items-center rounded-2xl bg-[#e6f1ed] text-[#0d6d62]">
                        <Icon
                          name={serviceMeta[index].icon}
                          className="size-5"
                        />
                      </span>
                      <span className="text-xs font-extrabold text-[#607574]">
                        {serviceMeta[index].eyebrow}
                      </span>
                    </div>
                    <h3 className="mt-12 text-xl font-extrabold tracking-[-.04em] text-[#17393a]">
                      {service.label}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-[#607574]">
                      {serviceMeta[index].text}
                    </p>
                    <a
                      href="#talep"
                      aria-label={`${service.label} için talep oluşturun`}
                      className="mt-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-[#0d6d62]"
                    >
                      Keşfedin{" "}
                      <Icon
                        name="arrow"
                        className="size-4 transition group-hover:translate-x-1"
                      />
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="nasil-calisir"
          className="bg-[#102a2c] px-5 py-20 text-white sm:py-28 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="eyebrow !text-[#c8e86a]">SÜREÇ NASIL İLERLER?</p>
              <h2 className="section-title mt-5 max-w-2xl !text-white">
                Karmaşıklaştırmadan, birlikte netleştiririz.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                "İhtiyacınızı paylaşın",
                "Sürecinizi birlikte değerlendirelim",
                "Size özel çözümü planlayalım",
              ].map((step, index) => (
                <Reveal key={step} delay={index * 0.1}>
                  <div className="border-t border-white/20 pt-5">
                    <span className="text-sm font-extrabold text-[#c8e86a]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-8 text-xl font-extrabold tracking-[-.04em]">
                      {step}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-[#bdd0cc]">
                      {index === 0
                        ? "Tekrarlayan işleri ve hedeflerinizi kendi kelimelerinizle anlatın."
                        : index === 1
                          ? "Bugünkü akışı, kısıtları ve öncelikleri birlikte görünür hale getirelim."
                          : "Uygun yaklaşımı, kapsamı ve sonraki adımları net bir çerçevede ele alalım."}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="faydalar" className="px-5 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow">DAHA SAKİN OPERASYONLAR</p>
              <h2 className="section-title mt-5">
                Ekibinizin enerjisini, değer yaratan işlere saklayın.
              </h2>
              <p className="mt-6 max-w-xl text-base font-medium leading-8 text-[#526968]">
                Doğru kurgulanmış otomasyon, insan muhakemesinin yerini almak
                için değil; ona alan açmak için vardır.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex gap-4 rounded-2xl border border-[#102a2c]/8 bg-white p-4 text-sm font-bold leading-6 text-[#31504e]"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#dcefcf] text-[#4d7d26]">
                      <Icon name="check" className="size-4" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="talep" className="px-5 pb-20 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#e4f0e8] p-7 sm:p-10 lg:p-14">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
                <div>
                  <p className="eyebrow">İLK ADIMI ATIN</p>
                  <h2 className="section-title mt-5">
                    Sürecinizi anlatın, birlikte düşünelim.
                  </h2>
                  <p className="mt-5 max-w-md text-sm font-medium leading-6 text-[#526968]">
                    İhtiyacınızı iletin; mevcut akışınıza uygun bir başlangıç
                    noktasını birlikte değerlendirelim.
                  </p>
                </div>
                <RequestForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#102a2c]/8 px-5 py-9 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs font-medium text-[#526968] sm:flex-row">
          <span>© 2026 FlowPilot · Kurgusal vaka çalışması</span>
          <span>
            Bu sayfa gerçek müşteri, entegrasyon veya performans iddiası
            içermez.
          </span>
        </div>
      </footer>
    </>
  );
}

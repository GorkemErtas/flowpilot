import { Icon } from "@/components/ui/icon";

export function WorkflowVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-[570px]"
      aria-label="Bir iş akışının otomatik olarak ilerlemesini gösteren görselleştirme"
      role="img"
    >
      <div className="absolute -inset-8 -z-10 rounded-full bg-[#c8e86a]/30 blur-3xl" />
      <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-[#fdfefb]/85 p-4 shadow-[0_30px_70px_rgba(16,42,44,.16)] backdrop-blur sm:p-6">
        <div className="flex items-center justify-between border-b border-[#102a2c]/8 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#e99e83]" />
            <span className="size-2.5 rounded-full bg-[#e8c765]" />
            <span className="size-2.5 rounded-full bg-[#72bb9a]" />
          </div>
          <span className="rounded-full bg-[#e4f3c4] px-3 py-1 text-[10px] font-extrabold tracking-[.08em] text-[#487321]">
            ÖRNEK AKIŞ
          </span>
        </div>
        <div className="relative mt-6 grid gap-3">
          <div className="absolute bottom-8 left-[28px] top-8 w-px bg-[#bfd5c9]" />
          <WorkflowNode
            icon="grid"
            title="Yeni talep"
            detail="Operasyon ekibi"
            tone="bg-[#e7f1ee] text-[#0d6d62]"
          />
          <WorkflowNode
            icon="brain"
            title="Akıllı sınıflandırma"
            detail="Öncelik · departman · konu"
            tone="bg-[#f5eecf] text-[#76601d]"
          />
          <WorkflowNode
            icon="chart"
            title="İlerleme görünürlüğü"
            detail="Güncel rapora eklendi"
            tone="bg-[#dcefcf] text-[#427426]"
            active
          />
        </div>
        <div className="mt-6 rounded-2xl bg-[#102a2c] p-4 text-white">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">Bugünkü akış</span>
            <span className="text-[#c8e86a]">Otomatik</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[78%] rounded-full bg-[#c8e86a]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowNode({
  icon,
  title,
  detail,
  tone,
  active = false,
}: {
  icon: "grid" | "brain" | "chart";
  title: string;
  detail: string;
  tone: string;
  active?: boolean;
}) {
  return (
    <div className="relative z-10 flex items-center gap-4 rounded-2xl border border-[#102a2c]/7 bg-white p-3.5 shadow-[0_6px_18px_rgba(16,42,44,.04)]">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-[#17393a]">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-xs font-medium text-[#526968]">
          {detail}
        </span>
      </span>
      {active && (
        <span className="size-2.5 rounded-full bg-[#84b434] ring-4 ring-[#e4f3c4]" />
      )}
    </div>
  );
}

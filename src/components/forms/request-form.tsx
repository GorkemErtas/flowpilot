"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { Icon } from "@/components/ui/icon";
import { serviceRequestSchema } from "@/features/service-requests/schema";
import {
  requestFailureSchema,
  requestReceiptSchema,
} from "@/features/service-requests/response";
import { serviceOptions } from "@/features/service-requests/types";

type FormValues = {
  fullName: string;
  email: string;
  service: string;
  description: string;
};
type Phase = "idle" | "validating" | "submitting" | "success" | "error";
const fields = ["fullName", "email", "service", "description"] as const;

const resolver: Resolver<FormValues> = (values) => {
  const result = serviceRequestSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: FieldErrors<FormValues> = {};
  for (const field of fields) {
    const issue = result.error.issues.find((item) => item.path[0] === field);
    if (issue) errors[field] = { type: "validation", message: issue.message };
  }
  return { values: {}, errors };
};

export function RequestForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState("");
  const locked = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", service: "", description: "" },
  });
  const busy = phase === "validating" || phase === "submitting";

  useEffect(() => {
    if (phase === "success" || phase === "error") resultRef.current?.focus();
  }, [phase]);

  async function save(values: FormValues) {
    setPhase("submitting");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(20_000),
      });
      const body: unknown = await response.json();
      const confirmed = requestReceiptSchema.safeParse(body);
      if (response.status === 201 && confirmed.success) {
        setReceipt(confirmed.data.data.id);
        setPhase("success");
        reset();
        return;
      }
      const failure = requestFailureSchema.safeParse(body);
      if (failure.success) {
        for (const field of fields) {
          const fieldMessage = failure.data.error.fieldErrors?.[field]?.[0];
          if (fieldMessage)
            setError(field, { type: "server", message: fieldMessage });
        }
      }
      setMessage(
        failure.success
          ? failure.data.error.message
          : "Sunucudan kayıt onayı alınamadı. Lütfen daha sonra tekrar deneyin.",
      );
      setPhase("error");
    } catch {
      setMessage(
        "Kayıt onayı alınamadı. Bağlantınızı kontrol edin. Talep sunucuya ulaşmış olabilir; tekrar göndermeden önce bunu göz önünde bulundurun.",
      );
      setPhase("error");
    }
  }

  const fieldProps = (field: keyof FormValues) => ({
    ...register(field),
    id: field,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field]
      ? `${field}-error`
      : field === "description"
        ? "description-hint"
        : undefined,
    className: "form-control",
  });
  const fieldError = (field: keyof FormValues) =>
    errors[field] && (
      <p
        id={`${field}-error`}
        className="mt-2 text-xs font-semibold text-[#a32d28]"
      >
        {errors[field]?.message}
      </p>
    );

  return (
    <div
      className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_30px_rgba(16,42,44,.07)] sm:p-8"
      data-state={phase}
    >
      {phase === "success" ? (
        <div ref={resultRef} tabIndex={-1} className="py-8" role="status">
          <span className="grid size-12 place-items-center rounded-full bg-[#e4f3c4] text-[#0d6d62]">
            <Icon name="check" className="size-6" />
          </span>
          <h3 className="mt-6 text-2xl font-extrabold tracking-tight">
            Talebiniz kaydedildi.
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#526968]">
            Paylaştığınız bilgiler başarıyla alındı. İlginiz için teşekkür
            ederiz.
          </p>
          <p className="mt-4 break-all text-xs text-[#526968]">
            Talep numarası: {receipt}
          </p>
          <button
            type="button"
            className="mt-6 rounded-full border border-[#0d6d62]/30 px-5 py-3 text-sm font-bold text-[#0d6d62]"
            onClick={() => {
              setPhase("idle");
              setMessage("");
              requestAnimationFrame(() => setFocus("fullName"));
            }}
          >
            Yeni talep oluşturun
          </button>
        </div>
      ) : (
        <form
          noValidate
          aria-label="Hizmet talep formu"
          aria-busy={busy}
          onSubmit={async (event) => {
            event.preventDefault();
            if (locked.current) return;
            locked.current = true;
            setMessage("");
            setPhase("validating");
            try {
              await handleSubmit(save, () => {
                setMessage("Lütfen işaretli alanları kontrol edin.");
                setPhase("idle");
              })(event);
            } finally {
              locked.current = false;
            }
          }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-extrabold tracking-tight">
              Sizi ve ihtiyacınızı tanıyalım
            </h3>
            <p className="mt-2 text-xs leading-5 text-[#526968]">
              Tüm alanlar zorunludur. Bu bir vaka çalışmasıdır; lütfen gerçek
              kişisel veya gizli bilgi paylaşmayın.
            </p>
          </div>
          <fieldset disabled={busy} className="min-w-0 space-y-5">
            <legend className="sr-only">Talep bilgileri</legend>
            <div>
              <label htmlFor="fullName" className="form-label">
                Ad soyad
              </label>
              <input
                {...fieldProps("fullName")}
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Örnek Kullanıcı"
              />
              {fieldError("fullName")}
            </div>
            <div>
              <label htmlFor="email" className="form-label">
                E-posta adresi
              </label>
              <input
                {...fieldProps("email")}
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="ornek@example.com"
              />
              {fieldError("email")}
            </div>
            <div>
              <label htmlFor="service" className="form-label">
                İlgilendiğiniz hizmet
              </label>
              <select {...fieldProps("service")} required>
                <option value="">Bir hizmet seçin</option>
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldError("service")}
            </div>
            <div>
              <label htmlFor="description" className="form-label">
                Hangi süreci iyileştirmek istiyorsunuz?
              </label>
              <textarea
                {...fieldProps("description")}
                rows={4}
                required
                minLength={10}
                maxLength={2000}
                placeholder="Tekrar eden işleri, kullandığınız araçları ve hedefinizi kısaca anlatın…"
              />
              <p id="description-hint" className="mt-2 text-xs text-[#526968]">
                10–2000 karakter. Parola veya hassas veri eklemeyin.
              </p>
              {fieldError("description")}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0d6d62] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#095b52] active:scale-[.99] disabled:cursor-wait disabled:opacity-70"
            >
              {busy && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {phase === "validating"
                ? "Bilgiler kontrol ediliyor…"
                : phase === "submitting"
                  ? "Talebiniz kaydediliyor…"
                  : "Talebinizi gönderin"}
              {!busy && <Icon name="arrow" className="size-4" />}
            </button>
          </fieldset>
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mt-4 text-sm leading-6"
          >
            {message && (
              <div
                ref={resultRef}
                tabIndex={-1}
                className={
                  phase === "error"
                    ? "rounded-xl bg-[#fff1ee] p-4 text-[#a32d28]"
                    : "text-[#a32d28]"
                }
              >
                {message}
              </div>
            )}
            {busy && (
              <span className="sr-only">
                {phase === "validating"
                  ? "Bilgiler kontrol ediliyor."
                  : "Talebiniz kaydediliyor."}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

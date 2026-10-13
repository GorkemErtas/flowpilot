export const serviceOptions = [
  { value: "WORKFLOW_AUTOMATION", label: "İş Akışı Otomasyonu" },
  { value: "AI_INTEGRATION", label: "Yapay Zekâ Entegrasyonu" },
  { value: "DATA_REPORTING_AUTOMATION", label: "Veri ve Raporlama Otomasyonu" },
] as const;

export type ServiceType = (typeof serviceOptions)[number]["value"];

export type ServiceRequestInput = {
  fullName: string;
  email: string;
  service: ServiceType;
  description: string;
};

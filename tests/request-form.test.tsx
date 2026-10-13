// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequestForm } from "@/components/forms/request-form";
import { validPayload } from "./fixtures";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function fillForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Ad soyad"), validPayload.fullName);
  await user.type(screen.getByLabelText("E-posta adresi"), validPayload.email);
  await user.selectOptions(
    screen.getByLabelText("İlgilendiğiniz hizmet"),
    validPayload.service,
  );
  await user.type(
    screen.getByLabelText("Hangi süreci iyileştirmek istiyorsunuz?"),
    validPayload.description,
  );
  return user;
}

describe("request form", () => {
  it("announces invalid fields and focuses the first invalid input without fetching", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    render(<RequestForm />);
    await userEvent.click(
      screen.getByRole("button", { name: "Talebinizi gönderin" }),
    );
    expect(
      await screen.findByText("Ad soyad en az 2 karakter olmalıdır."),
    ).toBeVisible();
    expect(screen.getByLabelText("Ad soyad")).toHaveFocus();
    expect(screen.getByLabelText("Ad soyad")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("blocks duplicate submission and only shows success after a confirmed 201 receipt", async () => {
    let confirm!: (value: Response) => void;
    const fetcher = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          confirm = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetcher);
    render(<RequestForm />);
    const user = await fillForm();
    await user.dblClick(
      screen.getByRole("button", { name: "Talebinizi gönderin" }),
    );
    expect(
      screen.getByRole("button", { name: "Talebiniz kaydediliyor…" }),
    ).toBeDisabled();
    expect(screen.queryByText("Talebiniz kaydedildi.")).not.toBeInTheDocument();
    expect(fetcher).toHaveBeenCalledTimes(1);
    await act(async () => {
      confirm(
        Response.json(
          {
            ok: true,
            data: {
              id: "confirmed-record",
              createdAt: "2026-10-13T00:00:00.000Z",
            },
          },
          { status: 201 },
        ),
      );
    });
    expect(await screen.findByText("Talebiniz kaydedildi.")).toBeVisible();
    expect(screen.getByRole("status")).toHaveFocus();
    await user.click(
      screen.getByRole("button", { name: "Yeni talep oluşturun" }),
    );
    await waitFor(() =>
      expect(screen.getByLabelText("Ad soyad")).toHaveFocus(),
    );
    expect(screen.getByLabelText("Ad soyad")).toHaveValue("");
  });
  it.each([500, 429])(
    "preserves input and announces server failure (%i)",
    async (status) => {
      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValue(
            Response.json(
              {
                ok: false,
                error: {
                  code: status === 429 ? "RATE_LIMITED" : "INTERNAL_ERROR",
                  message: "Talebiniz kaydedilemedi.",
                },
              },
              { status },
            ),
          ),
      );
      render(<RequestForm />);
      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: "Talebinizi gönderin" }),
      );
      const error = await screen.findByText("Talebiniz kaydedilemedi.");
      expect(error).toHaveFocus();
      expect(screen.getByLabelText("Ad soyad")).toHaveValue(
        validPayload.fullName,
      );
      expect(
        screen.getByLabelText("Hangi süreci iyileştirmek istiyorsunuz?"),
      ).toHaveValue(validPayload.description);
      expect(
        screen.getByRole("button", { name: "Talebinizi gönderin" }),
      ).toBeEnabled();
      expect(
        screen.queryByText("Talebiniz kaydedildi."),
      ).not.toBeInTheDocument();
    },
  );
  it("does not mistake a malformed success response for a committed insert", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ ok: true }, { status: 201 })),
    );
    render(<RequestForm />);
    const user = await fillForm();
    await user.click(
      screen.getByRole("button", { name: "Talebinizi gönderin" }),
    );
    expect(
      await screen.findByText(/Sunucudan kayıt onayı alınamadı/),
    ).toBeVisible();
    expect(screen.queryByText("Talebiniz kaydedildi.")).not.toBeInTheDocument();
  });
  it("preserves input on connection loss without claiming a confirmed failure or success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("network failure")),
    );
    render(<RequestForm />);
    const user = await fillForm();
    await user.click(
      screen.getByRole("button", { name: "Talebinizi gönderin" }),
    );
    expect(
      await screen.findByText(/Talep sunucuya ulaşmış olabilir/),
    ).toBeVisible();
    expect(screen.getByLabelText("E-posta adresi")).toHaveValue(
      validPayload.email,
    );
  });
});

import QRCode from "qrcode";

/**
 * Sharing abstraction for Care Cards.
 *
 * The QR code intentionally encodes only a route + identifier (never raw pet
 * data), so a hosted public-sharing backend can be swapped in later by changing
 * `buildCareCardUrl` alone.
 */
export interface ShareResult {
  method: "share" | "clipboard" | "unsupported";
}

export function buildCareCardUrl(petId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/care/${petId}`;
}

/** Public, account-backed link that opens the card on any device. */
export function buildSharedCardUrl(token: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/c/${token}`;
}

export function canWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function shareLink(title: string, text: string, url: string): Promise<ShareResult> {
  try {
    if (canWebShare()) {
      await navigator.share({ title, text, url });
      return { method: "share" };
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return { method: "clipboard" };
    }
    return { method: "unsupported" };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { method: "share" };
    }
    throw new Error("We couldn't open the share sheet. You can copy the link instead.");
  }
}

export async function generateQrDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 720,
      margin: 2,
      color: { dark: "#2f2118", light: "#ffffff" },
    });
  } catch {
    throw new Error("We couldn't create the QR code. Please try again.");
  }
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function shareFile(
  file: File,
  title: string,
  text: string,
): Promise<ShareResult> {
  try {
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title, text });
      return { method: "share" };
    }
    return { method: "unsupported" };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { method: "share" };
    }
    throw new Error("We couldn't share that file. You can download it instead.");
  }
}

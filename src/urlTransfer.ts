// src/urlTransfer.ts
export class URLTransfer {
  static encode(data: any): string {
    try {
      const compressed = btoa(encodeURIComponent(JSON.stringify(data)));
      return compressed;
    } catch (error) {
      console.warn("URLTransfer encode failed:", error);
      return "";
    }
  }

  static decode(encoded: string): any {
    try {
      return JSON.parse(decodeURIComponent(atob(encoded)));
    } catch (error) {
      console.warn("URLTransfer decode failed:", error);
      return null;
    }
  }

  static createTransferURL(path: string, data: Record<string, any>): string {
    const encoded = this.encode(data);
    if (!encoded) return path;

    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}__ndata=${encoded}`;
  }

  static extractFromURL(): any {
    if (typeof window === "undefined") return null;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get("__ndata");

      if (encodedData) {
        // Clean URL after extraction
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, "", newUrl);

        return this.decode(encodedData);
      }
    } catch (error) {
      console.warn("URLTransfer extraction failed:", error);
    }

    return null;
  }
}

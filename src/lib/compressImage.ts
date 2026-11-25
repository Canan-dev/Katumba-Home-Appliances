/**
 * Compresses an image file in the browser using Canvas before uploading.
 * Reduces file size from several MB down to ~200–350 KB for fast Firebase Storage uploads.
 */
export async function compressImage(
  file: File,
  maxWidthPx = 1400,
  qualityPercent = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate scaled dimensions, keeping aspect ratio
      let { width, height } = img;
      if (width > maxWidthPx) {
        height = Math.round((height / width) * maxWidthPx);
        width = maxWidthPx;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file); // fallback: upload original
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg", lastModified: Date.now() }
          );
          resolve(compressed);
        },
        "image/jpeg",
        qualityPercent
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback: upload original
    };

    img.src = objectUrl;
  });
}

type ResizeImageFileOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputType?: "image/jpeg" | "image/png" | "image/webp";
};

const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_MAX_HEIGHT = 800;
const DEFAULT_QUALITY = 0.82;
const DEFAULT_OUTPUT_TYPE = "image/jpeg";

const getResizedDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) => {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

const getOutputFileName = (fileName: string, outputType: string) => {
  const extension = outputType.split("/")[1] ?? "jpg";
  const normalizedExtension = extension === "jpeg" ? "jpg" : extension;
  const baseName = fileName.replace(/\.[^/.]+$/, "");

  return `${baseName}.${normalizedExtension}`;
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  outputType: string,
  quality: number
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Failed to resize image."));
      },
      outputType,
      quality
    );
  });

const loadImageSource = async (file: File) => {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);

    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      dispose: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);

  return new Promise<{
    source: HTMLImageElement;
    width: number;
    height: number;
    dispose: () => void;
  }>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        dispose: () => URL.revokeObjectURL(objectUrl),
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image."));
    };
    image.src = objectUrl;
  });
};

export async function resizeImageFile(
  file: File,
  {
    maxWidth = DEFAULT_MAX_WIDTH,
    maxHeight = DEFAULT_MAX_HEIGHT,
    quality = DEFAULT_QUALITY,
    outputType = DEFAULT_OUTPUT_TYPE,
  }: ResizeImageFileOptions = {}
) {
  const imageSource = await loadImageSource(file);
  const targetSize = getResizedDimensions(
    imageSource.width,
    imageSource.height,
    maxWidth,
    maxHeight
  );
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    imageSource.dispose();
    throw new Error("Canvas is not supported.");
  }

  canvas.width = targetSize.width;
  canvas.height = targetSize.height;

  if (outputType === "image/jpeg") {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  try {
    context.drawImage(
      imageSource.source,
      0,
      0,
      targetSize.width,
      targetSize.height
    );
  } finally {
    imageSource.dispose();
  }

  const resizedBlob = await canvasToBlob(canvas, outputType, quality);

  return new File([resizedBlob], getOutputFileName(file.name, outputType), {
    type: outputType,
    lastModified: Date.now(),
  });
}

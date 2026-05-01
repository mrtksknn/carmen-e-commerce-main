/**
 * Converts an image file to WebP format using the browser's Canvas API.
 * @param {File} file - The original image file (jpg, png, etc.)
 * @param {number} quality - Quality from 0 to 1 (default 0.8)
 * @returns {Promise<File>} - A promise that resolves to a WebP File object
 */
export const convertToWebp = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Maintain aspect ratio
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object from the blob
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(webpFile);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

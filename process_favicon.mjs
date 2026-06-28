import sharp from 'sharp';

async function processImage() {
  try {
    // 1. Trim the image with a higher threshold in case there is faint noise
    const trimmed = sharp('ui/Favicon.png').trim({
      threshold: 50 // Increased threshold for trimming
    });
    
    // 2. Get trimmed dimensions
    const { width, height } = await trimmed.metadata();
    console.log(`Trimmed dimensions: ${width}x${height}`);
    
    // 3. We want the icon to occupy 90% of a 512x512 canvas.
    // 90% of 512 = 460px (approx).
    const targetSize = 512;
    const padding = Math.floor(targetSize * 0.05);
    const innerSize = targetSize - (padding * 2);

    await trimmed
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('public/favicon.png');

    console.log('Favicon created successfully at public/favicon.png');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();

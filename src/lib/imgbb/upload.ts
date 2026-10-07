/**
 * ImgBB Image Upload Server Utility
 * Uploads an image base64 or FormData to ImgBB and returns the permanent public hosted URL.
 * Never exposes the IMGBB_API_KEY to the client.
 */

export interface ImgBBUploadResponse {
  success: boolean;
  url?: string;
  display_url?: string;
  thumb_url?: string;
  delete_url?: string;
  error?: string;
}

export async function uploadToImgBB(imageBufferOrBase64: Buffer | string, name?: string): Promise<ImgBBUploadResponse> {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'IMGBB_API_KEY environment variable is not configured.'
    };
  }

  try {
    let base64Data: string;
    if (Buffer.isBuffer(imageBufferOrBase64)) {
      base64Data = imageBufferOrBase64.toString('base64');
    } else {
      // If it's a data URL (e.g. data:image/png;base64,...), strip prefix
      base64Data = imageBufferOrBase64.replace(/^data:image\/\w+;base64,/, '');
    }

    const formData = new FormData();
    formData.append('image', base64Data);
    if (name) {
      formData.append('name', name);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success && result.data) {
      return {
        success: true,
        url: result.data.url,
        display_url: result.data.display_url,
        thumb_url: result.data.thumb?.url || result.data.display_url,
        delete_url: result.data.delete_url,
      };
    } else {
      return {
        success: false,
        error: result.error?.message || 'Failed to upload image to ImgBB'
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during image upload';
    return {
      success: false,
      error: message,
    };
  }
}

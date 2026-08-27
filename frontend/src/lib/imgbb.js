export async function uploadToImgbb(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing in environment variables.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Image upload to ImgBB failed.");
  }

  return {
    url: data.data.url,
    displayUrl: data.data.display_url,
    thumbUrl: data.data.thumb?.url,
    deleteUrl: data.data.delete_url,
  };
}
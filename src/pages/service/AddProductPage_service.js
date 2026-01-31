import config from "../../helper/config";
import APIHandler from "../../handlers/APIHandler";

export const AddProductPage_service = {
  addProduct,
  uploadItemImage,
};

// Add product
async function addProduct(data) {
  
  const requestOptions = {
    method: "POST",
    headers: APIHandler.getHeader(
      config.azure_ad_config.apis.POS.name
    ),
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${config.pos_api_url}/api/item/save`,
    requestOptions
  );

  return APIHandler.handleResponse(response);
}

// Upload product image
async function uploadItemImage(file) {
  try {
    const response = await fetch(
      `${config.pos_api_url}/api/item/upload-image`,
      {
        method: "POST",
        body: file, 
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data.image_code; 
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err;
  }
}

import config from "../../helper/config";
import APIHandler from "../../handlers/APIHandler";

export const Product_service = {
  deleteProduct,
  updateProduct,
};

async function deleteProduct(id) {
  const requestOptions = {
    method: "DELETE",
    headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
  };

  const response = await fetch(`${config.pos_api_url}/api/item/delete-by-id/${id}`, requestOptions);
  return APIHandler.handleResponse(response);
}

async function updateProduct(id, data) {
  const requestOptions = {
    method: "PUT",
    headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    body: JSON.stringify(data),
  };

  const response = await fetch(`${config.pos_api_url}/api/item/update-by-id/${id}`, requestOptions);
  return APIHandler.handleResponse(response);
}

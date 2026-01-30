import config from "../../helper/config";
import APIHandler from "../../handlers/APIHandler";

export const AddProductPage_service = {
  addProduct,
 
};

async function addProduct(data) {
  
  const requestOptions = {
    method: "POST",
    headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    body: JSON.stringify(data),
  };
  console.log("URL being called:",requestOptions, `${config.pos_api_url}/api/item/save`);

  const response = await fetch(
    `${config.pos_api_url}/api/item/save`,
    requestOptions
  );

  return APIHandler.handleResponse(response);
}





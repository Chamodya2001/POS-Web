import config from "../../helper/config";
import APIHandler from "../../handlers/APIHandler";

export const AddEmploymentPage_service = {
  addEmploye,
 
};

async function addEmploye(data) {
  
  const requestOptions = {
    method: "POST",
    headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `${config.pos_api_url}/api/casior/save`,
    requestOptions
  );

  return APIHandler.handleResponse(response);
}





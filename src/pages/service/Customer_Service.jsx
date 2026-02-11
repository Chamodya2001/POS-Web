import config from "../../helper/config";
import APIHandler from "../../handlers/APIHandler";


export const Customer_Service = {
  getCustomerList,
  addCustomer,
};

async function getCustomerList() {
  const requestOptions = {
    method: "GET",
    headers: APIHandler.getHeader(
      config.azure_ad_config.apis.POS.name
    ),
  };

    const response = await fetch(
        `${config.pos_api_url}/api/customer/get-all`,
        requestOptions
    );

    return APIHandler.handleResponse(response);
}

async function addCustomer(data) {
  const requestOptions = {
    method: "POST",
    headers: APIHandler.getHeader(
      config.azure_ad_config.apis.POS.name
    ),
    body: JSON.stringify(data),
  };

    const response = await fetch(
        `${config.pos_api_url}/api/customer/save`,
        requestOptions
    );
    return APIHandler.handleResponse(response);
}
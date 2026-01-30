import config from "../../helper/config";    
import APIHandler from "../../handlers/APIHandler";


async function candidateFullData_service(candidateId) {
    const requestOptions = {
        method: "GET",
        headers: APIHandler.getHeader(config.azure_ad_config.apis.POS.name),
    };

    const response = await fetch(
        `${config.pos_api_url}/api/candidate-full/full-data/${candidateId}`,
        requestOptions
    );
    return APIHandler.handleResponse(response);
}

export default candidateFullData_service

class APIHandler {
  static getHeader(apiName) {
    const token = "kkkkk";

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "x-api-name": apiName,
    };
  }

  static async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  }
}

export default APIHandler;

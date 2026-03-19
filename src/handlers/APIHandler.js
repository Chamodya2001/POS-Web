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
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `Request failed with status ${response.status}`);
      }
      return text;
    }
  }
}

export default APIHandler;

function createJsonResponse(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return data;
    }
  };
}

async function requestJson(fetchImpl, url, options = {}) {
  try {
    const response = await fetchImpl(url, options);
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || data?.mensaje || `HTTP ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    const connectionError = new Error('Error de conexion con backend');
    connectionError.cause = error;
    throw connectionError;
  }
}

module.exports = {
  createJsonResponse,
  requestJson
};



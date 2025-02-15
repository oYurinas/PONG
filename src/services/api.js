const API_URL = "https://SEU-API-GATEWAY.execute-api.REGIAO.amazonaws.com/PROD/"; // URL da sua API

export const fetchData = async () => {
  try {
    const response = await fetch(`${API_URL}/pong`);
    if (!response.ok) throw new Error("Erro ao buscar os dados");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

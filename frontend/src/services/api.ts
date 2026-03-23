const API_URL = "http://localhost:5000/api/v1";

export const signup = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // for cookies
  });

  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  return res.json();
};

export const message = async (prompt: string) => {
  const res = await fetch(`${API_URL}/ask-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    credentials: "include",
  });

  return res.json();
}
export const saveMessage = async (prompt: string, response: string) => {
  const res = await fetch(`${API_URL}/save-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, response }),
    credentials: "include",
  });

  return res.json();
}

export const getMessage = async (page:number) => {
  const res = await fetch(`http://localhost:5000/api/v1/get-message?page=${page}`, {
    credentials: "include",
  });

    return res.json();
}
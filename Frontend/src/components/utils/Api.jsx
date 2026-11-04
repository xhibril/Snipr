export default async function apiFetch(url, options = {}, notify, nav) {
  try {
    const res = await fetch(`http://localhost:8080/api${url}`, {
      credentials: "include",
      ...options,
    });

      if (res.status === 401) {
    window.location.href = "/login";
    return null;
  }

  if (res.status === 403) {
    nav("/verify/email");
    return null;
  }

  if (res.status === 429) {
    notify("Too many requests. Please try again later", "ERROR");
    return null;
  }

  return res;
  
  } catch {
    notify("Can't reach the server. Check your connection.", "ERROR");
    return null;
  }


}

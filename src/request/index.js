const baseURL = import.meta.env.VITE_BASE_URL;

console.log("BASE URL:", baseURL);

export async function getInvoices(query = "") {
  const req = await fetch(baseURL + (query ? `?status=${query}` : ""));
  if (req.status === 200) {
    const result = await req.json();
    return Array.isArray(result.data) ? result.data : [];
  } else {
    throw new Error("Something went wrong :(");
  }
}

export async function getInvoice(id) {
  const req = await fetch(baseURL + `/${id}`);
  if (req.status === 200) {
    const result = await req.json();
    return result;
  } else {
    throw new Error("Something went wrong :(");
  }
}

export async function deleteById(id) {
  const req = await fetch(baseURL + `/${id}`, {
    method: "DELETE",
  });
  if (req.status === 200) {
    return "seccess";
  } else {
    throw new Error("Something went wrong :(");
  }
}

export async function updateById(id, newDate) {
  const req = await fetch(baseURL + `/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDate),
  });
  if (req.status === 200) {
    const result = await req.json();
    return result;
  } else {
    throw new Error("Something went wrong :(");
  }
}

export async function addInvoice(data) {
  console.log(data);
  const req = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (req.status === 200) {
    const result = await req.json();
    return result;
  } else {
    throw new Error("Server error: :(");
  }
}

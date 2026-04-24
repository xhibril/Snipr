export default async function ApiFetch(url, options = {}){

    const res = await fetch(`http://localhost:8080${url}`, {
        credentials: "include",
        ...options
    });

    

    return res;





}
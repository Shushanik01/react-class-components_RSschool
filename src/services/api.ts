const API_URL = 'https://pokeapi.co/api/v2';

export const getData = async(term:string) =>{
    const response = await fetch(`${API_URL}/pokemon/${term.toLowerCase()}`);
     if (!response.ok) {
        if (response.status === 404) throw new Error("Pokemon not found. Please check the name");
        if (response.status === 400) throw new Error("Invalid request. Please check your input");
        if (response.status === 500) throw new Error("Server error. Please try again later");
        if (response.status === 503) throw new Error("Service is temporarily unavailable");
        throw new Error("Something went wrong");
    }
        const data = await response.json()
    
    return data 
};

export const getAllData = async() =>{
    const response = await fetch(`${API_URL}`)
    if(!response.status){
        if (response.status === 404) throw new Error("Not fond");
        if (response.status === 400) throw new Error("Invalid request. Please check your input");
        if (response.status === 500) throw new Error("Server error. Please try again later");
        if (response.status === 503) throw new Error("Service is temporarily unavailable");
        throw new Error("Something went wrong");
    }
    const data = response.json()
    return data
}
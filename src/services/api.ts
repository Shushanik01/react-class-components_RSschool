

const API_URL = 'https://pokeapi.co/api/v2';

export const getData = async(term:string) =>{
    return await fetch(`${API_URL}/pokemon/${term.toLocaleLowerCase()}`)
}
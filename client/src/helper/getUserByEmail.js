export const getUserByEmail = async (email) => {
    try {
        const response = await fetch(`http://modulo-usuarios.vercel.app/api/users/${email}`);
        const data = await response.json();
       
        return data;
    } catch (error) {
        console.log(error)
        return {
            exists: false};
    }
  
}
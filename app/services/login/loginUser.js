

export const loginUser = async(formData) =>{
    try{
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'content-type':'application/josn'
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()

        return data
        
    }catch(e){
        console.log("error",e)
    }
}
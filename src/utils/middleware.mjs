import { mockUsers } from "./constants.mjs"

// middleware 
export const loggingmiddleware = (request,response,next) => {
    console.log(`${request.method} - ${request.url}`)
    next()
}
// next is very important it calls the next middleware
// we can also call it directly by using arrow functions
export const findusermiddleware = (request,response,next)=>{
    const {params:{id}} = request
    const parseId = parseInt(id)
    if(isNaN(parseId)) return response.sendStatus(400)
    const oldUser = mockUsers.findIndex(
        (user)=> user.id === parseId
    )
    if(oldUser === -1) return response.sendStatus(404)
    request.oldUser = oldUser
    next()
}

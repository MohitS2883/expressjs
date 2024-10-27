import { Router } from "express"
import { query, validationResult, checkSchema, matchedData } from "express-validator"
import { mockUsers } from "../utils/constants.mjs"
import { createUserValidationSchema } from "../utils/validationSchema.mjs"
import { findusermiddleware } from "../utils/middleware.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import { hashPassword } from "../utils/helpers.mjs"

const router = Router()


router.get('/api/users',
    query('filter')
    .isString()
    .notEmpty()
    .withMessage('Should not be empty')
    .isLength({min: 3,max: 10})
    .withMessage('Length between 3 and 10'), 
    (request,response)=>{
        // console.log(request.session)
        console.log(request.sessionID)
        console.log(request.sessionStore.get(request.sessionID, (err,sessionData)=>{
            if(err){
                console.log(err)
                throw err
            }
            console.log(sessionData)
        }))
        const result = validationResult(request)
        const {query: {filter,value},} = request
        if(filter && value){
            return response.send(
                mockUsers.filter((user)=> String(user[filter]).includes(value))
            )
    }   
    return response.send(mockUsers)
})

router.get('/api/users/:id',(request,response)=>{
    console.log(request.params)
    const parseId = parseInt(request.params.id)
    console.log(parseId)
    if(isNaN(parseId)){
        return response.status(400).send({msg:'Bad Request'})
    }
    const finduser = mockUsers.find((user)=> user.id === parseId)
    if(!finduser) return response.status(404).send({msg:'user does not exist'})
    console.log(mockUsers)
    return response.send(finduser)
})

router.post('/api/users',
    checkSchema(createUserValidationSchema),
    async (request, response) => {
        const result = validationResult(request);
        
        if (!result.isEmpty()) {
            return response.status(400).send({ errors: result.array() });
        } else {
            const data = matchedData(request);
            console.log(data);
            data.password = hashPassword(data.password)
            console.log(data)
            const newUser = new User(data);
            try {
                const savedUser = await newUser.save();
                return response.status(201).send(savedUser);
            } catch (err) {
                console.log(err);
                return response.status(400).send({ error: 'Failed to save user' });
            }
        }
    }
);


// put request
router.put('/api/users/:id',findusermiddleware,(request,response)=>{
    const { body,oldUser } = request
    // const {body,params:{id}} = request
    // const parseId = parseInt(id)
    // if(isNaN(parseId)) return response.sendStatus(400)
    // const oldUser = mockUsers.findIndex(
    //     (user)=> user.id === parseId
    // )
    // if(oldUser === -1) return response.sendStatus(404)
    // uncomment for without middleware
    mockUsers[oldUser] = {id:mockUsers[oldUser].id,...body} 
    console.log(mockUsers)
    return response.status(200).send(mockUsers)
})

// patch request
router.patch('/api/users/:id',findusermiddleware,(request,response)=>{
    const {body,oldUser} = request
    mockUsers[oldUser] = {...mockUsers[oldUser],...body}
    return response.sendStatus(201)
})

// delete request
router.delete('/api/users/:id',findusermiddleware,(request,response)=>{
    const {body,oldUser} = request
    mockUsers.splice(oldUser,1)
    console.log(mockUsers)
    return response.sendStatus(200)
})

export default router
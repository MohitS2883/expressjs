export const createUserValidationSchema = {
    name:{
        isLength: {
            options:{
                min: 5,
                max: 32
            },
            errorMessage:"Minimum of 5, maximum of 32 characters"
        },
        notEmpty: {
            errorMessage:"Username cannot be empty"
        },
        isString: {
            errorMessage:"Must be a string"
        } 
    },
    age:{
        notEmpty: {
            errorMessage:"Username cannot be empty"
        },
        isNumeric: {
            errorMessage:"Must be a number"
        } 
    }
}
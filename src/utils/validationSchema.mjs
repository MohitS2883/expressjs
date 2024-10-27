export const createUserValidationSchema = {
    username:{
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
    displayName:{
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
    password:{
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
}
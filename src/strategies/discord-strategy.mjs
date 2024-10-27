import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discorduser.mjs";
import dotenv from 'dotenv';
dotenv.config();


passport.serializeUser((user,done)=>{
    console.log(`Inside Serialize User`)
    console.log(user)
    done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    let findUser
    try{
        findUser = await DiscordUser.findById(id)
        if(!findUser) throw new Error('User not Found')
        return findUser ? done(null,findUser) : done(null,null)
    }catch(err){
        done(err,null)
    }
})

export default passport.use(
    new Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ['identify','guilds','email']//define permissions
        },
        async (accessToken,refreshToken,profile,done)=>{
            console.log(profile)
            let findUser
            try{
                findUser = await DiscordUser.findOne({discordid:profile.id})
            }catch(err){
                return done(err,null)
            }
            try{
                if(!findUser){
                    const newUser = new DiscordUser({
                        username:profile.username,
                        discordid:profile.id
                    })
                    const newSavedUser = await newUser.save()
                    return done(null,newSavedUser)
                }
            }catch(err){
                console.log(err)
                return done(err,null)
            }
            return done(null,findUser)
            
        }
    )
)
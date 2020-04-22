require('dotenv').config()
import Common from '../commonLib/common'
let common = new Common()
import auth from './authentication'
let authentication = new auth()

export async function middlewareAuth(req, res , next) {
    // check the token send by the user is authenticated or not
    try {
        authentication.validateToken(req , (response)=>{
            if (response.status) {
                if (req.body._id === response.data) {
                    return next()
                } else {
                    res.json(common.getStandardResponse(false , "Not valid User"))
                }
            }else{
                res.json(response)
            }
        }, (err)=>{
            res.json(err);
        })
    } catch (ex) {
        console.log(common.getStandardResponse(false, "Exception Occured", ex.message))
    }
}

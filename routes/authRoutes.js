const {Router}= require ('express');
const router =Router();
const { register, login, current, sendOtp, verifyOtp, ChangePassword, SearchUser, Logout} = require('../controllers/usercontroller');
const {validateRegister, validatelogin, validateChangePassword} = require('../middlewares/ExpressValidators')
const verifyjwt = require('../middlewares/verifyjwt');

router.get('/current',verifyjwt, current)
router.post('/login',validatelogin,  login)
router.post('/register',validateRegister, register)
router.post('/getOtp', sendOtp )
router.post('/verifyOtp', verifyOtp )
router.post('/changepwd',validateChangePassword,ChangePassword )
router.post('/Search', verifyjwt, SearchUser )
router.post('/logout', verifyjwt, Logout )

module.exports= router
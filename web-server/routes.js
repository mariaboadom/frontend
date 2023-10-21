const { Router } = require ('express')
const router = Router()
const ctrl = require('./controller')

router.post('/',ctrl.getResponse);
router.get('/getEvents',ctrl.getEvents);

// router.get('/:id',ctrl.getJuguete);
// router.get('/usuarios/:id',ctrl.getVerificacion);
// //router.get('/post',ctrl.postEmployees);
// router.post('/',ctrl.postJuguete);
// router.put('/:id',ctrl.putJuguete);
// router.delete('/:id',ctrl.deleteJuguete);

module.exports = router
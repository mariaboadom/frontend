const { Router } = require ('express')
const router = Router()
const ctrl = require('./controller')

router.post('/',ctrl.getResponse);
router.post('/admin',ctrl.updateEvent);
router.get('/getEvents',ctrl.getEvents);
router.post('/getMyTicket',ctrl.getMyTicket);

// router.get('/:id',ctrl.getJuguete);
// router.get('/usuarios/:id',ctrl.getVerificacion);
// //router.get('/post',ctrl.postEmployees);
// router.post('/',ctrl.postJuguete);
// router.put('/:id',ctrl.putJuguete);
// router.delete('/:id',ctrl.deleteJuguete);

module.exports = router
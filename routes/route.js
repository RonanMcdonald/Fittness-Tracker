const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

// --- Routes --- // 
// Index
// router.get("/index", function(req, res) {
//     res.render('index', {
//         title: 'Dashboard'
//     });
// }); 

router.get("/index", controller.index);

// --- Errors --- //
// 404 - Page not found
router.use((req, res, next) => { return res.status(404).send("Error 404 : Page Not Found"); });
// 500 - Any server error
router.use((req, res, next) => { return res.status(500).send("Error 500 : Internal Server Error") });

module.exports = router;
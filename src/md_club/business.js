const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../helper/dbconfig");
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const stoarge = multer.diskStorage({
    destination: './business/image/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const upload = multer({
    storage: stoarge
})

router.post('/business_logo/:id', upload.single('logo'), (req, res) => {
    mysqlConnection.query('update business set logo =? where id = ?', [req.file.filename, req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            res.send(JSON.stringify({ data: "success" }));
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});


// Get an Employees
router.get('/business/:id', (req, res) => {
    mysqlConnection.query('Select * from business where phone = ?', [req.params.id], (err, rows, fields) => {
        res.type('json')

        if (!err)
            if (rows && rows.length) {
                res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ data: "No Rows Found" }));
            }
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});

// // Delete an Employees
// router.delete('/persons/:id', (req, res) => {
//     mysqlConnection.query('delete from persons where PersonID = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.send('Person Deleted Succesfully');
//         else
//             console.log(err);

//     });
// });

// Insert an basic_details
router.post('/business', (req, res) => {
    const data = req.body;
    mysqlConnection.query('Select * from business where phone = ?', [req.body.phone], (err, rows, fields) => {
        res.type('json')

        if (!err)
            if (rows && rows.length >= 1) {
                res.send(JSON.stringify({ res: "already registered" }));
            } else {
                mysqlConnection.query('insert into business set?', data, (err, rows, fields) => {
                    res.type('json')

                    if (!err)
                        res.send(JSON.stringify({ res: 'success' }));
                    else
                        res.send(JSON.stringify({ res: 'error' }));

                });
            }
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});

// generate QR Code
router.post('/business_qr/:bid', (req, res) => {

    res.type('json')
    const phone = req.params.bid;
    mysqlConnection.query('SELECT * FROM business_qr WHERE bid =?', [phone], (err, rows, fields) => {
        if (!err)
            if (rows.length >= 1) {
                res.send(JSON.stringify({ rowsCount: rows.length, Status: "Success", data: rows }));
            } else {
                const upi = uuid.v4()
                QRCode.toFile(`./business_qr/${phone}.png`, upi, {
                    errorCorrectionLevel: 'H'
                }, function (err) {
                    if (err) {
                        res.send(JSON.stringify({ res: 'error' }));
                    };
                    mysqlConnection.query('insert into business_qr set?', [{ qr_code: `${phone}.png`, bid: req.params.bid, upi: `${phone}@md_club`, uniqueid: upi }], (err, rows, fields) => {


                        if (!err)
                            res.send(JSON.stringify({ res: 'success' }));
                        else
                            res.send(JSON.stringify({ res: 'error' }));

                    });
                });
            }
        else
            res.send(JSON.stringify({ res: err}));

    });

});

// add_experience
router.put('/add_experience_hr/:phone', (req, res) => {
    const data = [req.body.experience, req.params.phone];
    console.log(data);
    res.type('json')
    mysqlConnection.query('update basic_details_hr set experience =? where phone =?', data, (err, rows, fields) => {
        if (!err)
            res.send(JSON.stringify({ res: 'success' }));
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});


// Scan QR Code

// add_gender
router.post('/scan_qr', (req, res) => {
    res.type('json')
    mysqlConnection.query('select * from business_qr where uniqueid =?', [req.body.qr_code], (err, rows, fields) => {
        if (!err)
            {
                if(rows.length >= 1){
                    res.send(JSON.stringify({ res: rows }));
                }
                else{
                    res.send(JSON.stringify({ res: "not verified" }));
                }
            }
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});

module.exports = router;
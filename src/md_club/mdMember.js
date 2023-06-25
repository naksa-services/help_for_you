const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../helper/dbconfig");

const multer = require('multer');
const path = require('path');


// const stoarge = multer.diskStorage({
//     destination: './party/image/',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }


// })

// const upload = multer({
//     storage: stoarge
// })



router.get('/mdmeber', (req, res) => {
    mysqlConnection.query('Select * from partyVisit', (err, rows, fields) => {
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


// Get an MD_Member
router.get('/md_member/:id', (req, res) => {
    mysqlConnection.query('Select * from md_member where id = ?', [req.params.id], (err, rows, fields) => {
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



// Login Memebr
router.post('/member_login', (req, res) => {
    const data = req.body;
    mysqlConnection.query('Select * from md_member where phone = ? and passcode =?', [data.phone, data.passcode], (err, rows, fields) => {
        res.type('json')

        if (!err)
            {
                if(rows && rows.length >= 1){
                    res.send(JSON.stringify({ data: "success" })); 
                }
                else{
                    res.send(JSON.stringify({ data: "failed" }));
                }
            }
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});

// Post Md_Member
router.post('/md_member', (req, res) => {
    const data = req.body;
    mysqlConnection.query('Select * from md_member where phone = ?', [data.phone], (err, rows, fields) => {
        res.type('json')

        if (!err)
            if (rows && rows.length >= 1) {
                res.send(JSON.stringify({ data: "Already registered" }));
            } else {
                mysqlConnection.query('insert into md_member set ?', data, (err, rows, fields) => {
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

// Recharge Member
router.post('/user_recharge', (req, res) => {
    const data = req.body;
    mysqlConnection.query('insert into recharge set ?', data, (err, rows, fields) => {
        res.type('json')

        if (!err){
            mysqlConnection.query('Select * from member_wallet where userid = ?', [req.body.userid], (err, rows, fields) => {
                res.type('json')
        
                if (!err)
                    if (rows && rows.length >=1) {
                        const totalamount = parseInt(rows[0].wallet_amount) + parseInt(req.body.amount);
                        mysqlConnection.query('update member_wallet set wallet_amount =? where userid = ?', [totalamount,req.body.userid ], (err, rows, fields) => {
                            res.type('json')
                    
                            if (!err)
                                res.send(JSON.stringify({ res: 'success' }));
                            else
                                res.send(JSON.stringify({ res: 'error' }));
                    
                        });
                    } else {
                        mysqlConnection.query('insert into member_wallet set ?', [{wallet_amount:req.body.amount,userid:req.body.userid} ], (err, rows, fields) => {
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
        }
            
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});


// Get Rechage History

router.get('/recharge/:uid', (req, res) => {
    mysqlConnection.query('Select * from recharge where userid = ?', [req.params.uid], (err, rows, fields) => {
        res.type('json')

        if (!err)
            if (rows && rows.length) {
                res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ data: [] }));
            }
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});

// 






module.exports = router;
const express = require('express');
const router = express.Router();
const SchoolWork = require('../models/schoolWork');

function IsLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

router.get('/', IsLoggedIn, (req, res, next) => {

    SchoolWork.find((err, schoolWork) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('schoolWork/index', { title: 'Task Tracker', dataset: schoolWork, user: req.user });
        }
    })
});

router.get('/add', IsLoggedIn, (req, res, next) => {
    res.render('schoolWork/add', { title: 'Add', user: req.user });
});


router.post('/add',IsLoggedIn, (req, res, next) => {
    SchoolWork.create({
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
        status: req.body.status,
        weight: req.body.weight,
        priority: req.body.priority
    }, (err, newSchoolWork) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/schoolWork');
        }
    });
});


router.get('/delete/:_id',IsLoggedIn, (req, res, next) => {
    SchoolWork.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/schoolWork')
        }
    })
});

router.get('/edit/:_id',IsLoggedIn, (req, res, next) => {
    SchoolWork.findById(req.params._id, (err, schoolWork) => {
        if (err) {
            console.log(err);
        }
        else {
                res.render('schoolWork/edit', {
                    title: 'Edit',
                    schoolWork: schoolWork,
                    user: req.user
                    });
                }
            }).sort({ name: 1 });
        }
    );

router.post('/edit/:_id', IsLoggedIn, (req,res,next) => {
    SchoolWork.findOneAndUpdate({_id: req.params._id}, {
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
        status: req.body.status,
        weight: req.body.weight,
        priority: req.body.priority
    }, (err, updatedSchoolWork) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/schoolWork');
        }
    });
});

module.exports = router;
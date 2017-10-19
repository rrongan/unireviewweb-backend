var Student = require('../models/student');
var express = require('express');

var mongoose = require('mongoose');

var router = express.Router();

mongoose.connect('mongodb://localhost:27017/unireviewdb');
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected to database');
});

//added this in the hope of being able to interface from the command line
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

router.findAll = function(req, res) {
    // Use the Students model to find all donations
    Student.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
}

router.findOne = function(req, res) {

    // Use the Students model to find a single user
    Student.find({ "_id" : req.params.id },function(err, user) {
        if (err)
            res.json({ message: 'Student NOT Found!', errmsg : err } );
        else
            res.json(user);
    });
}

router.addStudent = function(req, res) {

    var student = new Student();

    student.username = req.body.username;
    student.password = req.body.password;
    student.studentid = req.body.studentid;
    student.name = req.body.name;
    student.email = req.body.email;
    student.dob = req.body.dob;
    student.gender = req.body.gender;
    student.address = req.body.address;
    student.college.name = req.body.college.name;
    student.college.course.name = req.body.college.course.name;
    student.college.course.year = req.body.college.course.year;

    console.log('Adding student: ' + JSON.stringify(student));

    // Save the donation and check for errors
    student.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Student Added!', data: student });
    });
}


module.exports = router;
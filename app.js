var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser')

var app = express();
var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "",
    database: "todolist"
})
con.connect();

app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", 'ejs');

//----------------- Main Page ---------------//
app.get('/', function (req, res) {
    res.render('Main-Page')
});

//----------------- Admin-Login  ---------------//
app.get('/Admin-Login', function (req, res) {
    res.render('Admin-Login')
});

app.post("/Admin-Login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var query = "select * from admin where email='" + email + "' and password='" + password + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        if (result.length == 1) {
            res.redirect("/Admin-Page")
        }
        else {
            res.render("Admin-Login");
        }
    })
})

//----------------- User-Login  ---------------//
var user_name , user_email ;
app.get('/User-Login',function(req,res){
    res.render('User-Login');
})

app.post('/User-Login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var query ="select * from staff where email='"+email+"' and password='"+password+"'";
    con.query(query , function (error, result,index){
        if(error) throw error ;
        if(result.length>0){
            user_name = result[0].name;
            user_email = result[0].email;
            res.redirect("/User-Page")
        }
        else{
            res.render("User-Login");
        }
    })

})

//----------------- Admin-Page  ---------------//
app.get('/Admin-Page', function (req, res) {
    res.render('Admin-Page')
});

//----------------- Admin-Page[Add-Staff] ---------------//
app.get('/Add-Staff', function (req, res) {
    res.render('Add-Staff');
});

app.post('/Add-Staff', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var post = req.body.post;
    var password = req.body.password;
    var query = "insert into staff(name,email,password,post) values('" + name + "','" + email + "','" + password + "','" + post + "')";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.redirect('/Admin-Page');
    })
});

//----------------- Admin-Page[View-Staff] ---------------//
app.get('/View-Staff', function (req, res) {
    var query = "select * from staff";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('View-Staff', { result });
    })
});

//----------------- Admin-Page[Add-Task] ---------------//
app.get('/Add-Task', function (req, res) {
    var query = "select * from staff";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Add-Task', { result });
    })
});

app.post('/Add-Task', function (req, res) {
    var email = req.body.email;
    var taskname = req.body.taskname;
    var sdate = req.body.sdate;
    var edate = req.body.edate;
    var name;
    var query = "select name from staff where email='" + email + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        if (result.length > 0) {
            name = result[0].name;
            console.log(name);
            var query1 = "insert into task(name,email,taskname,sdate,edate) values('" + name + "','" + email + "','" + taskname + "','" + sdate + "','" + edate + "')";
            con.query(query1, function (error, result, index) {
                if (error) throw error;
                res.redirect('/Admin-Page');
            })
        }
    })

})


//----------------- Admin-Page[View-Task] ---------------//
app.get('/View-Task', function (req, res) {
    var query = "select * from task";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('View-Task', { result });
    })
});

//----------------- Admin-Page[Manage-Task] ---------------//
app.get('/Manage-Task', function (req, res) {
    var query = "select * from task";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Manage-Task', { result });
    })
});

//----------------- Admin-Page[Manage-Task] ---------------//
app.get('/Delete-Task/:id', function (req, res) {
    var id = req.params.id;
    var query = "delete from task where id=" + id;
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.redirect("/Manage-Task");
    })
});

//----------------- Admin-Page[Update-Task] ---------------//
app.get('/Update-Task/:id', function (req, res) {
    var id = req.params.id;
    var query = "select * from task where id=" + id;
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render("Update-Task", { result });
    })
})

app.post('/Update-Task/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var taskname = req.body.taskname;
    var sdate = req.body.sdate;
    var edate = req.body.edate;

    var query = "UPDATE task SET name=?, taskname=?, sdate=?, edate=? WHERE id=?";
    con.query(query, [name, taskname, sdate, edate, id], function (error, result, fields) {
        if (error) throw error;
        res.redirect("/Manage-Task");
    })
});

//----------------- User-Page ---------------//
app.get('/User-Page', function (req, res) {
    var query = "select * from staff where email='" + user_email + "' and name='" + user_name + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('User-Page', { result });
    })
})

//----------------- User-Page[Assign-Task] ---------------//
app.get('/Assign-Task', function (req, res) {
    var query = "SELECT * FROM task WHERE email='" + user_email + "' AND name='" + user_name + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Assign-Task', { result });
    });
});

//----------------- User-Page[Accept-Task] ---------------//
app.get('/Accept-Task/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE task SET status='Accept' WHERE id=?";
    con.query(query, [id], function (error, result, fields) {
        if (error) throw error;
        res.redirect("/Assign-Task");
    })
})

//----------------- User-Page[Denied-Task] ---------------//
app.get('/Denied-Task/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE task SET status='Denied' WHERE id=?";
    con.query(query, [id], function (error, result, fields) {
        if (error) throw error;
        res.redirect("/Assign-Task");
    })
})

//----------------- User-Page[Accept-View] ---------------//
app.get('/Accept-View', function (req, res) {
    var query = "SELECT * FROM task WHERE status='Accept' and email='" + user_email + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Accept-View', { result });
    });
})

//----------------- User-Page[Denied-View] ---------------//
app.get('/Denied-View', function (req, res) {
    var query = "SELECT * FROM task WHERE status='Denied' and email='" + user_email + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Denied-View', { result });
    });
})

//----------------- User-Page[Pending-View] ---------------//
app.get('/Pending-View', function (req, res) {
    var query = "SELECT * FROM task WHERE status='Accept' and email='" + user_email + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Pending-View', { result });
    });
})

//----------------- User-Page[Running-Task] ---------------//
app.get('/Running-Task/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE task SET work='Running' WHERE id=?";
    con.query(query, [id], function (error, result, fields) {
        if (error) throw error;
        res.redirect("/Pending-View");
    })
})

//----------------- User-Page[Completed-Task] ---------------//
app.get('/Completed-Task/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE task SET work='Completed' WHERE id=?";
    con.query(query, [id], function (error, result, fields) {
        if (error) throw error;
        res.redirect("/Pending-View");
    })
})

//----------------- User-Page[Running-View] ---------------//
app.get('/Running-View', function (req, res) {
    var query = "SELECT * FROM task WHERE work='Running' and email='" + user_email + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Running-View', { result });
    });
})

//----------------- User-Page[Completed-View] ---------------//
app.get('/Completed-View', function (req, res) {
    var query = "SELECT * FROM task WHERE work='Completed' and email='" + user_email + "'";
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render('Completed-View', { result });
    });
})


app.listen(3000);
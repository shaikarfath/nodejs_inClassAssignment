let express = require('express');
let bodyParser = require('body-parser');
//let nodefetch = require('node-fetch');
let mongoose = require('mongoose');
const ToDo = require('./models/todomodel');

var app= express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));


//Connection to MongoDB

const mongoDB = 'mongodb+srv://Admin:admin@cluster0.uwnqt.mongodb.net/todo?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error:  '))
//Connection to MongoDB

let tasks = [];
let completed = [];


// fetch method
app.get('/', function(request, response){
    ToDo.find(function(err, todo){
        if(err){
            console.log(err);
        } else {
            tasks = [];
            completed = [];
            for(let i =0; i< todo.length; i++){
                if(todo[i].done){
                    completed.push(todo[i]);
                } else {
                    tasks.push(todo[i]);
                }
            }
            response.render('index', {tasks: tasks , completed: completed});
        }
    })
    //response.render('index', {tasks: tasks , completed: completed});
    //response.send('Hello World!');
});


// create method on database
app.post('/addToDo', function(req, res){
    let newTodo = new ToDo({
        item: req.body.newtodo,
        done: false
    })
    newTodo.save(function(err, todo){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

    //tasks.push(req.body.newtodo)
    //res.redirect('/');
})


// update method
app.post('/removeToDo', function(req,res){
    const remove = req.body.check;
  
    if(typeof remove === 'string'){
        ToDo.updateOne({_id:remove}, {done:true}, function(err){
            if(err){
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
        // tasks.splice( tasks.indexOf(remove),1);
        // completed.push(remove);
    } else if(typeof remove === "object"){
        for(var i=0; i<remove.length; i++){
            ToDo.updateOne({_id:remove[i]}, {done:true}, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
        }
    }
        //     tasks.splice( tasks.indexOf(remove[i]),1);
        //     completed.push(remove[i]);
        // }
        // res.redirect('/')
    // }
    
})

//delete method
app.post('/deleteToDo', function(req,res){
    const deleteTask = req.body.delete;
  
    if(typeof deleteTask === 'string'){
        //completed.splice( completed.indexOf(deleteTask),1);
        ToDo.deleteOne({_id:deleteTask}, function(err){
            if(err){
                console.log(err);
            } 
            res.redirect('/')
        })
    } else if(typeof deleteTask === "object"){
        for(var i=0; i<deleteTask.length; i++){
            //completed.splice( completed.indexOf(deleteTask[i]),1);
            ToDo.deleteOne({_id:deleteTask[i]}, function(err){
                if(err){
                    console.log(err);
                } 
                
            })
        }
        res.redirect('/')
    }
   
})

app.listen(3000, function(){
    console.log('App is running on port 3000!')
})


let zipdata = null
const axios = require('axios').default;



app.get('/zip', function(request, response){
    response.render('zip', {zipdata : zipdata});
});

app.post('/zip', function(req,res){
    
    axios.get(`http://api.zippopotam.us/${req.body.country}/${req.body.zipcode}`)
    .then(function(response){
        console.log(response);
        zipdata = response.data
        res.redirect('/zip');
    })
    .catch(function(error){
        console.log(error);
        res.redirect('/zip');
    })
    
});
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


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

var tasks = ['wake up', 'eat breakfast'];
var completed = [];


app.get('/', function(request, response){
    response.render('index', {tasks: tasks , completed: completed});
    //response.send('Hello World!');
});

app.post('/addToDo', function(req, res){
    
    tasks.push(req.body.newtodo)
    res.redirect('/');
})

app.post('/removeToDo', function(req,res){
    const remove = req.body.check;
  
    if(typeof remove === 'string'){
        tasks.splice( tasks.indexOf(remove),1);
        completed.push(remove);
    } else if(typeof remove === "object"){
        for(var i=0; i<remove.length; i++){
            tasks.splice( tasks.indexOf(remove[i]),1);
            completed.push(remove[i]);
        }
    }
    res.redirect('/')
})

app.post('/deleteToDo', function(req,res){
    const deleteTask = req.body.delete;
  
    if(typeof deleteTask === 'string'){
        completed.splice( completed.indexOf(deleteTask),1);
        
    } else if(typeof deleteTask === "object"){
        for(var i=0; i<deleteTask.length; i++){
            completed.splice( completed.indexOf(deleteTask[i]),1);
            
        }
    }
    res.redirect('/')
})

app.listen(3000, function(){
    console.log('App is running on port 3000!')
})

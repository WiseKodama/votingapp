var Poll = require('../app/models/polls');

module.exports = function(app,passport){
    app.get('/',function(req,res){
        var myChart = {title:String,data:Array,results:Array,canVote:Boolean,id:String};
        Poll.findById('58e4dd304e79012761122310',function(err,docs){
            if(err) return console.error(err);
            myChart.title = docs.title;
            myChart.data = docs.data;
            myChart.results = docs.results;
            myChart.id = docs._id;
            if(docs.userList.indexOf(req.headers['x-forwarded-for']) > -1){
                myChart.canVote = false;
            }else{myChart.canVote = true;}
            if(req.isAuthenticated()) {res.render('index.ejs',{mainChart:myChart,user:req.user.username,message:req.flash('Message')});}
            else {res.render('index.ejs',{mainChart:myChart,user:'',message:req.flash('Message')});}
        });
    });
    app.post('/update/:id',function(req,res){
        if(req.body.results > -1){
            Poll.findOneAndUpdate({_id:req.params.id},{$inc:{['results.'+req.body.results]:1},$push:{['userList']:req.headers['x-forwarded-for']}},function(err,docs){
                if(err) return console.error(err);
                res.status(200).send('success');
            });
        }
        else{
            Poll.findOneAndUpdate({_id:req.params.id},{$push:{['results']:1,['userList']:req.headers['x-forwarded-for'],['data']:req.body.data}},function(err,docs){
                if(err) return console.error(err);
                res.status(200).send('success');
                console.log(req.body);
            });
        }
    });
    app.get('/latest',function(req,res){
       var latestPolls = '';
       Poll.find().sort({date:-1}).exec(function(err,docs){
          if(err) return console.error(err);
          for(var x=0;x<docs.length;x++){
              latestPolls += '<a class="darkLink" href="/poll/' + docs[x].id + '">' + docs[x].title + ' by ' + docs[x].madeby + '</a><br>';
          }
          if(req.isAuthenticated()){
            res.render('latest.ejs',{user:req.user.username,latPolls:latestPolls,message:req.flash('Message')});
          }
          else{
            res.render('latest.ejs',{user:'',latPolls:latestPolls,message:req.flash('Message')});
          }
       });
    });
    app.get('/profile',isLoggedIn,function(req,res){
        var mPolls = '';
        Poll.find({madeby:req.user.username}).sort({date:-1}).exec(function(err,docs){
           if(err) return console.error(err);
           for(var y=0;y<docs.length;y++){
               mPolls += '<a class="darkLink" href="/poll/' + docs[y].id + '">' + docs[y].title + '</a><br>';
           }
        res.render('profile.ejs',{
           user:req.user.username,
           userPolls:mPolls});
        });
    });
    app.get('/addpoll',isLoggedIn,function(req,res){
        res.render('addpoll.ejs',{user:req.user.username});
    });
    app.post('/addpoll',function(req,res){
        var newPoll = new Poll();
        newPoll.title = req.body.title;
        newPoll.madeby = req.user.username;
        for(var x=0;x<req.body.options.length;x++){
        newPoll.data.push(req.body.options[x]);
        newPoll.results.push(0);
        }
        newPoll.date = new Date();
        newPoll.userList = [];
        newPoll.save(function(err,pool){
            if(err) return console.error(err);
            res.redirect('/poll/' + pool.id)
        })
    });
    app.get('/poll/:id',function(req,res){
        var myChart = {title:String,data:Array,results:Array,canVote:Boolean,id:String};
        Poll.findById(req.params.id,function(err,docs){
            if(err) return console.error(err);
            myChart.title = docs.title;
            myChart.data = docs.data;
            myChart.results = docs.results;
            myChart.id = docs._id;
            if(docs.userList.indexOf(req.headers['x-forwarded-for']) > -1){
                myChart.canVote = false;
            }else{myChart.canVote = true;}
            if(req.isAuthenticated()) {res.render('poll.ejs',{mainChart:myChart,user:req.user.username,message:req.flash('Message')});}
            else {res.render('poll.ejs',{mainChart:myChart,user:'',message:req.flash('Message')});}
        });
    });
    app.post('/signup',passport.authenticate('signup',{
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash : true
    }));
    app.post('/login',passport.authenticate('login',{
        successRedirect : '/profile',
        failureRedirect : '/',
        failureFlash : true
    }));
     app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};
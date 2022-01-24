const express = require('express');
const bodyParse = require("body-parser");
const mongoose = require('mongoose');
const { json } = require('body-parser');

const app = express();
const PORT = 3000;
app.set('view_engine', 'ejs');
app.use(bodyParse.urlencoded({
    extended: true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Articles", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find({}, function (err, results) {
            if (!err) {
                res.json(results)
            } else {
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.json(newArticle)
            } else {
                res.send(err)
            }
        });

    })
    .delete((req, res) => {
        Article.deleteMany(function (err) {
            if (!err) {
                res.json({
                    "message": "Successfully deleted all articles"
                });
            } else {
                res.send(err);
            }
        });
    });

////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({
        title: req.params.articleTitle
    }, function (err, result) {
        if (!err) {
            res.json(result)
        } else {
            res.json({
                "error": "No articles Found"
            })
        }
    })
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title:req.body.title, content: req.body.content},
        function(err,result){
            if(!err){
                res.json(result)
            }else {
                res.json({
                    "error": err
                })
            }
        }
    )
})

.patch(function(req,res) {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err,result){
            if(!err){
                res.json(result)
            }else{
                res.json({
                    "error": err
                })
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err,result){
            if (!err){
                res.json(result)
            }else{
                res.json({
                    "error":err
                })
            }
        }
    )

});

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
})
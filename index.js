import express from "express"
import path from "path"
import fs from "fs"

const app=express();
const Port=3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    fs.readdir('./notes',(err,files)=>{
        if(err){
            console.log(err);
        }
        res.render("index",{files:files});
    })
});

app.get('/file/:filename',(req,res)=>{
    const filename=req.params.filename;
    fs.readFile(`./notes/${filename}`,"utf-8",(err,data)=>{
        if(err) console.log(err);
       res.render("show",{title:filename, description:data})
    })
});


app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./notes/${req.params.filename}`,"utf-8",(err,data)=>{
        if(err) console.log(err);
        res.render("edit",{filename:req.params.filename, description:data});
    });
    
})

app.post('/edit', (req, res) => {
  const oldPath = `./notes/${req.body.oldTitle}`;
  const newTitle = req.body.newTitle.trim() ? req.body.newTitle.split(' ').join('_') + '.txt' : req.body.oldTitle;
  const newPath = `./notes/${newTitle}`;

  // Step 1: Rename file if title changed
  if (oldPath !== newPath) {
    fs.renameSync(oldPath, newPath);
  }

  // Step 2: Update description (overwrite file content)
  fs.writeFile(newPath, req.body.description, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating note");
    }
    res.redirect('/');
  });
});

app.post('/create',(req,res)=>{
    // console.log(req.body);
    fs.writeFile(`./notes/${req.body.title.split(' ').join('_')}.txt`,req.body.description,(err)=>{
        if(err){
            console.log(err);
            return res.status(500).send("Unable to create note");
        }
        res.redirect('/');
    });
});


app.listen(Port,()=>{
    console.log(`server is running on port http://localhost:${Port}`);
});
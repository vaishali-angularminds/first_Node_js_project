const Post = require('../Model/postModal')
const user = require('../Model/userModel')

 exports.newPost = async (req, res, next) => {     
     try {
        const newPost =  new Post(req.body);
        newPost.createdBy = req.user._id
        newPost.img = req.files.map((item)=>( 
            {fileName: item.fileName, path: item.path}
        )
        )
        const post = await newPost.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(400).json(error.message);        
    }
 }

 exports.getPosts = async(req,res,next) => {
    try{
       const results = await Post.find().populate("createdBy","_id name email").populate("comments.commentBy","_id name email").populate("comments.reply.replyBy","_id name email")
        res.status(200).json(results);
    }catch(error){
        console.log(error);
    }
 }

 exports.deletePost = async(req, res, next) =>{
     try{
        const post = await Post.find()
        const index = post.indexOf(req.params.id)                 
        await Post.deleteOne({'_id':req.params.id})
        return res.status(200).json('Post Deteted successfully')
    }catch(error){
        console.log(error)
        return rep.status(400).json(error)
    }
 }

 exports.commentOnPost = async(req, res, next) =>{
    try{        
        let post = await Post.findById(req.params.id);
        Object.assign(post,
            {comments:[...post.comments,
                {
                    comment: req.body.comment,
                    commentBy: req.user._id
                }
            ]}
        )
        await Post.findByIdAndUpdate(req.params.id,post)
        res.status(200).json("post updated successfully");
    }catch(error){
        console.log(error)
    return res.status(404).json({ message:error.message })
    }
 }

 exports.likePost = async (req, res) => {
    try{
    const post = await Post.findById(req.params.id)
       if(post.likes.includes(req.user._id)){
            for (var i = post.likes.length; i--;) {
                if (post.likes[i] === req.user._id) {
                    post.likes.splice(i, 1);             
                }
            }
            await Post.findByIdAndUpdate(req.params.id,post)
            res.status(200).json(post);      
    }else{
        post.likes = [...post.likes,req.user._id] 
        await Post.findByIdAndUpdate(req.params.id,post)
        res.status(200).json(post);    }    
    }catch(error){
        return res.status(404).json({message:error.message})
    }
 }

exports.likeComment = async (req, res) =>{
    try{
        const post = await Post.findById(req.params.postid)        
        for (var i = post.comments.length; i--;) {                   
            if ( JSON.stringify(post.comments[i]._id) === JSON.stringify(req.params.commid)) { 
                if(post.comments[i].likes.includes(req.user._id)){
                    const index = post.comments[i].likes.indexOf(req.user._id.toString())
                    post.comments[i].likes.splice(index,1)                                        
                    await Post.findByIdAndUpdate(req.params.postid,post)
                } else{
                    post.comments[i].likes = [...post.comments[i].likes,req.user._id]
                    await Post.findByIdAndUpdate(req.params.postid,post)
                }         
            }
        } 
        return res.status(200).json({post:post})
    }catch(error) {     
        return res.status(400).json({message:error.message})
    }
}
exports.likeToReply = async (req, res) => {
    console.log("post reply like")
    try{
        const post = await Post.findById(req.params.postid);
        for(var i = post.comments.length; i--;){
            if(JSON.stringify(post.comments[i]._id) === JSON.stringify(req.params.commid)){
                    for(var j = post.comments[i].reply.length;j--;){
                        if(JSON.stringify(post.comments[i].reply[j]._id) === JSON.stringify(req.body.replyid)){
                            if(post.comments[i].reply[j].like.includes(req.user._id)){                                                              
                                for (var x = post.comments[i].reply[j].like.length; x--;) {
                                    console.log(post.comments[i].reply[j].like[x])
                                    if (JSON.stringify(post.comments[i].reply[j].like[x]) === JSON.stringify(req.user._id)) {
                                        post.comments[i].reply[j].like.splice(x, 1);             
                                        await Post.findByIdAndUpdate(req.params.id,post)
                                        return res.status(200).json(post);
                                    }
                                }                                
                            }else{                                    
                                post.comments[i].reply[j].like = [...post.comments[i].reply[j].like,req.user._id] 
                                await Post.findByIdAndUpdate(req.params.postid,post)
                                return res.status(200).json(post);   
                            }                                
                        }
                    }
                }
            }
    }catch(error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

exports.replyToComment = async (req, res) => {
    try{
        const post = await Post.findById(req.params.postid)
        for (var i = post.comments.length; i--;) {  
            if ( JSON.stringify(post.comments[i]._id) === JSON.stringify(req.params.commid)) {
                const data =  {
                    reply : req.body.reply,
                    replyBy : req.user._id,
                }
                    post.comments[i].reply = [...post.comments[i].reply,data]
                    await Post.findByIdAndUpdate(req.params.postid,post)
                    console.log(post)
                    return res.status(200).json(post)
                }         
            }
    }catch(error){
        return res.status(200).json(error)
    }
}
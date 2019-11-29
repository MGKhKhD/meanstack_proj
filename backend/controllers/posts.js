
const Post = require('../models/post');

exports.createPost = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(result => {
    const {title, content, imagePath} = result;
    res.status(201).json({
      post: {
        id: result._id,
        title, content, imagePath,
        username: req.userData.username,
        userId: req.userData.userId
      },
      message: 'post added successfully'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Creaing the post failed.'});
  });

};

exports.updatePost = (req, res) => {
   let imagePath = req.body.imagePath;
   if (req.file) {
     const url = req.protocol + "://" + req.get("host");
     imagePath = url + "/images/" + req.file.filename
   }


  Post.updateOne({_id: req.params.postId, creator: req.userData.userId},
    {title: req.body.title,
      content: req.body.content,
      imagePath,
      creator: req.userData.userId
    })
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({
            imagePath: imagePath,
            message: 'Updated successfully'});
        } else {
          res.status(401).json({
            imagePath: imagePath,
            message: 'Update failed'});
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Unable to update the post" });
      })
};

exports.getPost = (req, res) => {
  Post.findById(req.params.postId).then(rec => {
    if(rec) {
      const post = {id: rec._id,
        title: rec.title,
        content: rec.content,
        imagePath: rec.imagePath,
      creator: rec.creator};
      res.status(200).json(post);
    } else {
      res.status(500).json({message: "No record found"});
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Could not get the post."});
  });
};

exports.getPosts = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let posts;
  if(pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(records => {
    posts = records.map(rec =>
      ({id: rec._id,
        title: rec.title,
        content: rec.content,
        imagePath: rec.imagePath,
      creator: rec.creator}));
    return Post.countDocuments();
  })
  .then(count => {
    return res.status(200).json({ posts, totalPosts: count,
      message: 'successfully fetched data' });
  })
  .catch(err => {
    return res.status(500).json({ message: "Unable to fetch posts." });
  });
};

exports.deletePost = (req, res) => {
  Post.deleteOne({_id: req.params.postId, creator: req.userData.userId})
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Successfully deleted data' });
    } else {
      res.status(401).json({ message: 'Unauthorized action' });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "Unable to delet post."});
  });
};

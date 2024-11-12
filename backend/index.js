import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import serviceAccountKey from './uination-firebase-adminsdk-4h164-5955af4d35.json' assert {type: "json"};
import { getAuth } from 'firebase-admin/auth';
import User from './model/User.js';
import Post from './model/Post.js';
import Admin from './model/Admin.js';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 5000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


mongoose.connect(process.env.MONGODB_URL, {
    autoIndex: true
});

const generateUsername = async (fullname) => {
    let username = fullname.split(" ")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result);

    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";

    return username;
}

const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    return {
        access_token,
        fullname: user.personal_info.fullname,
        email: user.personal_info.email,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        userId:user._id,
        contributor_points: user.account_info.contributor_points,
    }
}

const formatDatatoSendForAdmin = (admin) => {
    const access_token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET)
    return {
        access_token,
        fullname: admin.personal_info.fullname,
        email: admin.personal_info.email,
        profile_img: admin.personal_info.profile_img,
        username: admin.personal_info.username,
    }
}

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(404).json({ error: "No access token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Access token is invalid" });
        }
        req.user = user.id;
        next();
    });
}

app.post("/google-auth", async (req, res) => {
    const { access_token } = req.body;

    getAuth().verifyIdToken(access_token).then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;

        picture = picture.replace("s96-c", "s384-c");

        // Check if user already exists in the database
        let user = await User.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.username personal_info.profile_img account_info.contributor_points")
            .then((u) => {
                return u || null;
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({ error: err.message });
            });

        // If user doesn't exist, create a new one
        if (!user) {
            let username = await generateUsername(name);  // Generate a unique username based on the user's name
            user = new User({
                personal_info: { fullname: name, email, username, profile_img: picture }
            });

            // Save the new user to the database
            await user.save().then((u) => {
                user = u;
            }).catch(err => {
                console.log(err)
                return res.status(500).json({ error: err.message });
            });
        }
        return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
        return res.status(500).json({ error: "Failed to authenticate you with Google. Try with another account", err });
    });
});


// Get profile
app.post("/get-profile", async (req, res) => {
    let { username } = req.body;
    await User.findOne({ "personal_info.username": username })
        .select(" -updatedAt -posts")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.get("/logged-user", verifyJWT, async(req, res) => {
    let userId = req.user;

    await User.findById(userId).then((user) => {
        return res.status(200).json(user);
    }).catch(err => {
        return res.status(403).json(err);
    })
})

// Update profile

app.post("/update-profile", verifyJWT, (req, res) => {

    let { fullname, location, social_links, bio } = req.body;

    if (bio.length > 300) {
        return res.status(403).json({ error: "Bio should not exceed 300 characters." })
    }

    let socialLinksArr = Object.keys(social_links);

    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                    return res.status(403).json({ error: "You must provide valid links." })
                }

            }
        }
    } catch (error) {
        return res.status(500).json({ error: "You must provide valid social links" })
    }

    let updateObj = {
        "personal_info.fullname": fullname,
        "personal_info.bio": bio,
        "personal_info.location": location,
        social_links
    }

    User.findOneAndUpdate({ _id: req.user }, updateObj, {
        runValidators: true
    }).then(() => {
        return res.status(200).json({ message: "Updated successfully." })
    })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

// Create Posts

app.post("/create-post", verifyJWT, async (req, res) => {
    let { htmlCode, cssCode, category, status, theme } = req.body;
    let userId = req.user;
    let incrementVal = 1;
    let post_id = category.replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim() + nanoid();

    const post = new Post({
        postId: post_id,
        user: userId,
        htmlCode,
        cssCode,
        category,
        theme,
        status
    });

    await post.save().then(post => {
        User.findOneAndUpdate({ _id: userId }, { $push: { "posts": post._id } })
            .then(user => {
                console.log(user)
                return res.status(200).json({ id: post._id })
            })
            .catch(err => {
                return res.status(500).json({ error: "Internal server error" })
            })
    }).catch(err => {
        return res.status(500).json({ error: err.message })
    })
})

// Get All post

app.post('/explore-post', async (req, res) => {
    let { query, category, page, limit, theme, sort } = req.body;
    let findQuery = { status: 'published' };

    if (category) {
        findQuery.category = category;
    }

    if (theme && theme != "any") {
        findQuery.theme = theme;
    }

    // Construct additional search criteria
    if (query) {
        const userDocs = await User.find({ "personal_info.username": new RegExp(query, "i") }).select('_id');
        const userIds = userDocs.map(user => user._id);
        findQuery.$or = [
            { tags: { $regex: query, $options: 'i' } },
            { category: new RegExp(query, "i") },
            { user: { $in: userIds } }
        ];
    }

    let maxLimit = limit ? limit : 6;

    Post.find(findQuery)
        .populate('user', 'personal_info.username personal_info.profile_img -_id')
        .sort({ [sort]: -1 })
        .select('postId htmlCode cssCode category tags views saved theme createdAt _id')
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(posts => {
            // Filter out posts where user population failed (no matching username)
            posts = posts.filter(post => post.user);

            return res.status(200).json({ posts });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
})

app.post('/explore-post-count', async (req, res) => {
    let { query, category, page, limit, theme, sort } = req.body;
    let findQuery = { status: 'published' };

    if (category) {
        findQuery.category = category;
    }

    if (theme && theme != "any") {
        findQuery.theme = theme;
    }

    // Construct additional search criteria
    if (query) {
        const userDocs = await User.find({ "personal_info.username": new RegExp(query, "i") }).select('_id');
        const userIds = userDocs.map(user => user._id);
        findQuery.$or = [
            { tags: { $regex: query, $options: 'i' } },
            { category: new RegExp(query, "i") },
            { user: { $in: userIds } }
        ];
    }

    Post.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        }).catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.post('/get-post', async (req, res) => {
    let { postId } = req.body;
    let incrementVal = 1;

    await Post.findOneAndUpdate({ status: "published", "postId": postId }, { $inc: { "views": incrementVal } })
        .populate("user", "personal_info.username personal_info.profile_img -_id")
        .then((result) => {
            return res.status(200).json({ result })
        }).catch(err => {
            return res.status(500).json(err);
        })
})

app.post('/toggle-save-post', verifyJWT, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user;
  
    try {
      // Find the post and user by ID
      const post = await Post.findById(postId);
      const user = await User.findById(userId);
  
      if (!post || !user) {
        return res.status(404).json({ message: "User or Post not found" });
      }
  
      const isSaved = user.saved_post.includes(postId);
  
      if (isSaved) {
        user.saved_post = user.saved_post.filter(id => id.toString() !== postId);
        post.user_saved = post.user_saved.filter(id => id.toString() !== userId);
        post.saved -= 1;
      } else {
        user.saved_post.push(postId);
        post.user_saved.push(userId);
        post.saved += 1;
      }
  
      // Save the changes to the database
      await user.save();
      await post.save();
  
      // Return the updated save status
      res.status(200).json({ isSaved: !isSaved, message: isSaved ? "Post unsaved" : "Post saved" });
    } catch (error) {
      console.error("Error toggling save status:", error);
      res.status(500).json({ message: "Failed to toggle save status" });
    }
  });
  


// Admin Routes
// Login & Signup

// Admin Signup route


app.post("/admin/google-auth", async (req, res) => {
    const { access_token } = req.body;

    getAuth().verifyIdToken(access_token).then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;

        picture = picture.replace("s96-c", "s384-c");

        let admin = await Admin.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.username personal_info.profile_img").then((u) => {
                return u || null
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message })
            })

        if (!admin) {
            let username = await generateUsername(name);
            admin = new Admin({
                personal_info: { fullname: name, email, username, profile_img: picture }
            })

            await admin.save().then((u) => {
                admin = u;
            })
                .catch(err => {
                    return res.status(500).json({ "error": err.message })
                })
        }
        return res.status(200).json(formatDatatoSendForAdmin(admin));
    })
        .catch((err) => {
            return res.status(500).json({ "error": "Failed to authenticate you with Google. Try with another account", err });
        })
})

// Admin Profile route

app.post("/admin/get-profile", verifyJWT, async (req, res) => {
    let { adminId } = req.user;
    await Admin.findOne({ adminId })
        .select(" -updatedAt")
        .then(admin => {
            return res.status(200).json(admin);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.post('/admin/posts', verifyJWT, async (req, res) => {

    let { status } = req.body;

    await Post.find({ status: status })
        .populate("user", " personal_info.username -_id").then(post => {
            return res.status(200).json(post)
        }).catch(err => {
            return res.status(500).json({ error: "Internal eserver error" });
        })

})

app.post('/admin/get-post', verifyJWT, async (req, res) => {
    let { postId } = req.body;

    await Post.findOne({ "postId": postId })
        .populate("user", "personal_info.username personal_info.profile_img -_id")
        .then((result) => {
            return res.status(200).json({ result })
        }).catch(err => {
            return res.status(500).json(err);
        })
})

app.post('/admin/update-post', verifyJWT, async (req, res) => {

    let { postId, status, tags } = req.body;

    try {
        const admin = await Admin.findById(req.user);

        if (!admin || !admin.personal_info.isVerified) {
            return res.status(403).json({ error: "Access denied" });
        }

        const post = await Post.findOneAndUpdate(
            { postId },
            { status, tags },
            { new: true, runValidators: true }
        );

        if (!post) return res.status(404).json({ error: "Post not found" });

        const user = await User.findOne({_id:post.user})
        // Update admin counts based on post status
        if (status === 'published') {
            admin.account_info.total_post_published += 1;
            admin.post_published.push(post._id);
            user.account_info.total_posts += 1;
            user.account_info.contributor_points += 100;
        } else if (status === 'rejected') {
            admin.account_info.total_post_rejected += 1;
            admin.post_rejected.push(post._id);
        }

        await admin.save();
        await user.save();

        return res.status(200).json({ message: "Post updated successfully", post });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

})

app.listen(PORT, () => {
    console.log("Server is running at PORT: " + PORT);
})
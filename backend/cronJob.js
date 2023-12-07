const cron = require('node-cron');
const ProfileSetting = require("./models/ProfileSetting");
const User = require("./models/User");
const sendEmail = require("./utils/email")
const ejs = require('ejs');
const isEmpty = require("./validation/is-empty");
const { headingDistanceTo } = require("geolocation-utils");
const Listing = require("./models/Listing");
const BulkEmail = require('./models/BulkEmail');
const { default: axios } = require('axios');

// Set the EJS template file
const templateFile = './template/template.ejs';

// console.log("Log From Cron Job")
// Update DB Update Every Monday
cron.schedule('45 7 * * 1', async function () {
    console.log("Cron Job Run And Loop started")
    try {
        const recentUser = await User.aggregate([
            {
                $match: { "createdAt": { "$gte": new Date(new Date() - 7 * 60 * 60 * 24 * 1000) }, "isActive": true }
            },
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'profile',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $addFields: {
                    "profile": { $arrayElemAt: ["$profile", 0] }
                }
            },
            {
                $lookup: {
                    from: "endorsements",
                    foreignField: "recipientId",
                    localField: "_id",
                    as: "followers",
                    pipeline: [
                        {
                            $match: { weight: { $ne: Number(0) } }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: { endorserId: 1, _id: 0 }
                        },
                        {
                            $group: { _id: null, endorsers: { $push: { $toString: '$endorserId' } } }
                        },
                    ]
                }
            },
            {
                $addFields: {
                    "followers": {
                        $cond: {
                            if: { $eq: [{ $size: "$followers.endorsers" }, 0] },
                            then: [],
                            else: { $arrayElemAt: ["$followers.endorsers", 0] }
                        }
                    }
                }
            }

        ]).exec()

        const recentPost = await Listing.aggregate([
            {
                $match: { "createdAt": { "$gte": new Date(new Date() - 7 * 60 * 60 * 24 * 1000) } }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: { email: 1, latitude: 1, longitude: 1, username: 1, firstName: 1, lastName: 1, isActive: 1, createdAt: 1 }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "user": { $arrayElemAt: ["$user", 0] }
                }
            }, {
                $lookup: {
                    from: "endorsements",
                    foreignField: "recipientId",
                    localField: "user._id",
                    as: "followers",
                    pipeline: [
                        {
                            $match: { weight: { $ne: Number(0) } }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: { endorserId: 1, _id: 0 }
                        },
                        {
                            $group: { _id: null, endorsers: { $push: { $toString: '$endorserId' } } }
                        },
                    ]
                }
            },
            {
                $addFields: {
                    "followers": {
                        $cond: {
                            if: { $eq: [{ $size: "$followers.endorsers" }, 0] },
                            then: [],
                            else: { $arrayElemAt: ["$followers.endorsers", 0] }
                        }
                    }
                }
            }
        ])

        const profileSettingUser = await ProfileSetting.aggregate([
            {
                $match: { receiveUser: true }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $match: {
                                isActive: true,
                                $expr: {
                                    $gt: [{
                                        $strLenCP: {
                                            $ifNull: ["$email", ""],
                                        }
                                    }, 1]
                                }
                            }
                        },
                        {
                            $project: { email: 1, latitude: 1, longitude: 1, username: 1, firstName: 1, lastName: 1, isActive: 1, createdAt: 1 }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "user": { $arrayElemAt: ["$user", 0] }
                }
            },
            {
                $addFields: {
                    "userCreatedAt": "$user.createdAt"
                }
            },
            {
                $lookup: {
                    from: "endorsements",
                    foreignField: "endorserId",
                    localField: "user._id",
                    as: "followings",
                    pipeline: [
                        {
                            $match: { weight: { $ne: Number(0) } }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: { recipientId: 1, _id: 0 }
                        },
                        {
                            $group: { _id: null, recipients: { $push: { $toString: '$recipientId' } } }
                        },
                    ]
                }
            },
            {
                $addFields: {
                    "followings": {
                        $cond: {
                            if: { $eq: [{ $size: "$followings.recipients" }, 0] },
                            then: [],
                            else: { $arrayElemAt: ["$followings.recipients", 0] }
                        }
                    }
                }
            },
            {
                $sort: { "userCreatedAt": -1 }
            }
        ])
        const profileSettingPost = await ProfileSetting.aggregate([
            {
                $match: { receiveUpdates: true }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $match: {
                                isActive: true,
                                $expr: {
                                    $gt: [{
                                        $strLenCP: {
                                            $ifNull: ["$email", ""],
                                        }
                                    }, 1]
                                }
                            }
                        },
                        {
                            $project: { email: 1, latitude: 1, longitude: 1, username: 1, firstName: 1, lastName: 1, isActive: 1, createdAt: 1 }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    "user": { $arrayElemAt: ["$user", 0] }
                }
            },
            {
                $addFields: {
                    "userCreatedAt": "$user.createdAt"
                }
            },
            {
                $lookup: {
                    from: "endorsements",
                    foreignField: "endorserId",
                    localField: "user._id",
                    as: "followings",
                    pipeline: [
                        {
                            $match: { weight: { $ne: Number(0) } }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: { recipientId: 1, _id: 0 }
                        },
                        {
                            $group: { _id: null, recipients: { $push: { $toString: '$recipientId' } } }
                        },
                    ]
                }
            },
            {
                $addFields: {
                    "followings": {
                        $cond: {
                            if: { $eq: [{ $size: "$followings.recipients" }, 0] },
                            then: [],
                            else: { $arrayElemAt: ["$followings.recipients", 0] }
                        }
                    }
                }
            },
            {
                $sort: { "userCreatedAt": -1 }
            }
        ])

        const newFilteredUser = []
        for (var i = 0; i < recentUser.length; i++) {
            for (j = 0; j < profileSettingUser.length; j++) {
                if (recentUser[i].followers?.filter(id => profileSettingUser[j].followings.includes(id))?.length) {
                    if (newFilteredUser.some(data => data['userEmail'] === profileSettingUser[j]?.user?.email)) {
                        let index = newFilteredUser.findIndex(x => x.userEmail === profileSettingUser[j]?.user?.email)
                        if (!newFilteredUser[index].newUser.filter(x => x?._id === recentUser[i]?._id)?.length) {
                            newFilteredUser[index].newUser.push(recentUser[i])
                        }
                    }
                    else {
                        newFilteredUser.push({ userEmail: profileSettingUser[j]?.user?.email, userId: profileSettingUser[j].user, newUser: [recentUser[i]], newPost: [] })
                    }
                }
                else {
                    const centerLocation = {
                        lat: typeof (profileSettingUser[j].user?.latitude) == 'number' ? profileSettingUser[j].user?.latitude : 0,
                        lon: typeof (profileSettingUser[j].user?.longitude) == 'number' ? profileSettingUser[j].user?.longitude : 0,
                    };
                    const filterLocation = {
                        lat: typeof (recentUser[i]?.latitude) == 'number' ? recentUser[i]?.latitude : 0,
                        lon: typeof (recentUser[i]?.longitude) == 'number' ? recentUser[i]?.longitude : 0,
                    };
                    const result = await headingDistanceTo(
                        centerLocation,
                        filterLocation
                    );
                    if (filterLocation.lat !== 0 && filterLocation.lon !== 0) {
                        if (profileSettingUser[j].feedRadius === 0) {
                            if (newFilteredUser.some(data => data['userEmail'] === profileSettingUser[j]?.user?.email)) {
                                let index = newFilteredUser.findIndex(x => x.userEmail === profileSettingUser[j]?.user?.email)
                                if (!newFilteredUser[index].newUser.filter(x => x?._id === recentUser[i]?._id)?.length) {
                                    newFilteredUser[index].newUser.push(recentUser[i])
                                }
                            }
                            else {
                                newFilteredUser.push({ userEmail: profileSettingUser[j]?.user?.email, userId: profileSettingUser[j].user, newUser: [recentUser[i]], newPost: [] })
                            }
                        }
                        else {
                            if (result.distance <= profileSettingUser[j].feedRadius) {
                                if (newFilteredUser.some(data => data['userEmail'] === profileSettingUser[j]?.user?.email)) {
                                    let index = newFilteredUser.findIndex(x => x.userEmail === profileSettingUser[j]?.user?.email)
                                    if (!newFilteredUser[index].newUser.filter(x => x?._id === recentUser[i]?._id)?.length) {
                                        newFilteredUser[index].newUser.push(recentUser[i])
                                    }
                                }
                                else {
                                    newFilteredUser.push({ userEmail: profileSettingUser[j]?.user?.email, userId: profileSettingUser[j].user, newUser: [recentUser[i]], newPost: [] })
                                }
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < recentPost.length; i++) {
            for (j = 0; j < profileSettingPost.length; j++) {
                if (recentPost[i].followers?.filter(id => profileSettingPost[j].followings.includes(id))?.length) {
                    if (newFilteredUser.some(data => data['userEmail'] === profileSettingPost[j]?.user?.email)) {
                        let index = newFilteredUser.findIndex(x => x.userEmail === profileSettingPost[j]?.user?.email)
                        if (!newFilteredUser[index].newPost.filter(x => x?._id === recentPost[i]?._id)?.length) {
                            newFilteredUser[index].newPost.push(recentPost[i])
                        }
                    }
                    else {
                        newFilteredUser.push({ userEmail: profileSettingPost[j]?.user?.email, userId: profileSettingPost[j].user, newUser: [], newPost: [recentPost[i]] })
                    }
                }
                else {
                    const centerLocation = {
                        lat: typeof (profileSettingPost[j].user?.latitude) == 'number' ? profileSettingPost[j].user?.latitude : 0,
                        lon: typeof (profileSettingPost[j].user?.longitude) == 'number' ? profileSettingPost[j].user?.longitude : 0,
                    };
                    const filterLocation = {
                        lat: typeof (recentPost[i].user?.latitude) == 'number' ? recentPost[i].user?.latitude : 0,
                        lon: typeof (recentPost[i].user?.longitude) == 'number' ? recentPost[i].user?.longitude : 0,
                    };
                    // console.log(profileSettingPost[j].user._id)
                    const result = await headingDistanceTo(
                        centerLocation,
                        filterLocation
                    );

                    if (filterLocation.lat !== 0 && filterLocation.lon !== 0) {
                        if (profileSettingPost[j].feedRadius === 0) {
                            if (newFilteredUser.some(data => data['userEmail'] === profileSettingPost[j]?.user?.email)) {
                                let index = newFilteredUser.findIndex(x => x.userEmail === profileSettingPost[j]?.user?.email)
                                if (!newFilteredUser[index].newPost.filter(x => x?._id === recentPost[i]?._id)?.length) {
                                    newFilteredUser[index].newPost.push(recentPost[i])
                                }
                            }
                            else {
                                newFilteredUser.push({ userEmail: profileSettingPost[j]?.user?.email, userId: profileSettingPost[j].user, newUser: [], newPost: [recentPost[i]] })
                            }
                        }
                        else {
                            if (result.distance <= profileSettingPost[j].feedRadius) {
                                if (newFilteredUser.some(data => data['userEmail'] === profileSettingPost[j]?.user?.email)) {
                                    let index = newFilteredUser.findIndex(x => x.userEmail === profileSettingPost[j]?.user?.email)
                                    if (!newFilteredUser[index].newPost.filter(x => x?._id === recentPost[i]?._id)?.length) {
                                        newFilteredUser[index].newPost.push(recentPost[i])
                                    }
                                }
                                else {
                                    newFilteredUser.push({ userEmail: profileSettingPost[j]?.user?.email, userId: profileSettingPost[j].user, newUser: [], newPost: [recentPost[i]] })
                                }
                            }
                        }
                    }
                }
            }
        }

        // let dataTest = newFilteredUser.filter(x => x.userEmail === "danielaloha@pm.me")

        const excludedContacts = await axios({
            method: "GET",
            url: "https://api.mailjet.com/v3/REST/contact?IsExcludedFromCampaigns=true&Limit=1000",
            auth: {
                username: process.env.MJ_APIKEY_PUBLIC,
                password: process.env.MJ_APIKEY_PRIVATE,
            }
        })
        const excludedContactsEmail = excludedContacts?.data?.Data?.map(e => e?.Email)
        let manuplatedData = []
        const emailSendWrapper = (email, cards, post) => {
            if (cards?.length || post.length) {
                manuplatedData.push({ "email": email, "users": cards, "posts": post })
            }
        }
        newFilteredUser?.map((x) => {
            let cards = []
            const userCard = (user) => {
                user?.map(x => {
                    cards.push({
                        username: `${x?.firstName?.length ? x.firstName?.trim() : ''} ${x?.lastName?.length ? x.lastName?.trim() : ''}(${x.username?.trim()})`, avatar: !isEmpty(x.profile?.avatar) ? `https://villages.io/upload/avatar/` + x.profile.avatar : "https://villages.io/upload/avatar/default.png", description: x.profile?.description ? x.profile?.description : "No Bio Available", urlLink: 'https://villages.io/' + x.username
                    },)
                })
            }
            userCard(x?.newUser)

            let post = []
            const postCard = (user) => {
                user?.map(x => {
                    post.push({
                        title: `${x?.title?.length ? x.title?.trim() : ''}`, listingType: x?.listing_type, avatar: !isEmpty(x.photo) ? `https://villages.io/upload/posting/` + x.photo : "https://villages.io/static/media/default.a63cc45ca4f1a7dc983f.png", description: x?.description ? x?.description : "No description Available", urlLink: 'https://villages.io/' + x.user.username + '/' + x.title
                    },)
                })
            }
            postCard(x?.newPost)

            if (!excludedContactsEmail?.includes(x.userEmail)) {
                emailSendWrapper(x.userEmail, cards, post)
            }
        })

        await BulkEmail.deleteMany({})
        await BulkEmail.insertMany(manuplatedData).then(res =>
            console.log("Data Updated For email")
        ).catch(err => console.log(err, "Error"))

    } catch (err) {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        // next(err);
    }
}, {
    timezone: 'Pacific/Honolulu'
});

// Monday
cron.schedule('0 8 * * 1', async () => {
    const data = await BulkEmail.find({}).skip(0).limit(200)
    console.log(data?.length, "Monday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail('info@villages.io', x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })

}, {
    timezone: 'Pacific/Honolulu'
});

// Tuesday
cron.schedule('0 8 * * 2', async () => {
    const data = await BulkEmail.find({}).skip(200).limit(200)
    console.log(data?.length, "Tuesday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail("info@villages.io", x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Wednesday
cron.schedule('0 8 * * 3', async () => {
    const data = await BulkEmail.find({}).skip(400).limit(200)
    console.log(data?.length, "Wednesday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail("info@villages.io", x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Thursday
cron.schedule('0 8 * * 4', async () => {
    const data = await BulkEmail.find({}).skip(600).limit(200)
    console.log(data?.length, "Thursday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail("info@villages.io", x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Friday
cron.schedule('0 8 * * 5', async () => {
    const data = await BulkEmail.find({}).skip(800).limit(200)
    console.log(data?.length, "Friday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail("info@villages.io", x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Saturday
cron.schedule('0 8 * * 6', async () => {
    const data = await BulkEmail.find({}).skip(1000).limit(200)
    console.log(data?.length, "Saturday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail("info@villages.io", x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Sunday
cron.schedule('0 8 * * 7', async () => {
    const data = await BulkEmail.find({}).skip(1200).limit(200)
    console.log(data?.length, "Sunday")
    data?.map(x => {
        let cards = x?.users
        let post = x?.posts
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email
                await sendEmail("info@villages.io", x?.email, 'Your Network is Growing - Discover New Trusted Members and Posts!', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

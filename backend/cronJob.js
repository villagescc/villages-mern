const cron = require('node-cron');
const ProfileSetting = require("./models/ProfileSetting");
const User = require("./models/User");
const sendEmail = require("./utils/email")
const ejs = require('ejs');
const isEmpty = require("./validation/is-empty");
const { headingDistanceTo } = require("geolocation-utils");
const Listing = require("./models/Listing");

// Set the EJS template file
const templateFile = './template/template.ejs';

let fetchedData = [];

console.log("Log From Cron Job")
cron.schedule('45 7 * * 2', async function () {
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
                                    $gt: [{ $strLenCP: "$email" }, 1]
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
                                    $gt: [{ $strLenCP: "$email" }, 1]
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
                    const centerLocation = {
                        lat: typeof (profileSettingUser[j].user?.latitude) == 'number' ? profileSettingUser[j].user?.latitude : 0,
                        lon: typeof (profileSettingUser[j].user?.longitude) == 'number' ? profileSettingUser[j].user?.longitude : 0,
                    };
                    const filterLocation = {
                        lat: typeof (recentUser[i]?.latitude) == 'number' ? recentUser[i]?.latitude : 0,
                        lon: typeof (recentUser[i]?.longitude) == 'number' ? recentUser[i]?.longitude : 0,
                    };
                    // console.log(profileSettingUser[j].user._id)
                    const result = await headingDistanceTo(
                        centerLocation,
                        filterLocation
                    );
                    // console.log(profileSettingUser[j].feedRadius ?? 0, "Feed Radius");
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
                    else {
                        // console.log(recentUser[i].followers?.filter(id => profileSettingUser[j].followings.includes(id))?.length, "length")
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
                    }
                }
            }
        }
        for (var i = 0; i < recentPost.length; i++) {
            for (j = 0; j < profileSettingPost.length; j++) {
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
                    // console.log(profileSettingPost[j].feedRadius ?? 0, "Feed Radius");
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
                    else {
                        // console.log(recentPost[i].followers?.filter(id => profileSettingPost[j].followings.includes(id))?.length, "length")
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
                    }
                }
            }
        }

        // let dataTest = newFilteredUser.filter(x => x.userEmail === "danielaloha@pm.me")

        let manuplatedData = []

        newFilteredUser?.map(async (x) => {
            let cards = []
            const userCard = (user) => {
                user?.map(x => {
                    cards.push({
                        username: `${x?.firstName?.length ? x.firstName?.trim() : ''} ${x?.lastName?.length ? x.lastName?.trim() : ''}(${x.username?.trim()})`, avatar: !isEmpty(x.profile?.avatar) ? `https://villages.io/upload/avatar/` + x.profile.avatar : "https://villages.io/upload/avatar/default.png", description: x.profile?.description ? x.profile?.description : "No Bio Available", urlLink: 'https://villages.io/' + x.username
                    },)
                })
            }
            await userCard(x?.newUser)

            let post = []
            const postCard = (user) => {
                user?.map(x => {
                    post.push({
                        title: `${x?.title?.length ? x.title?.trim() : ''}`, avatar: !isEmpty(x.photo) ? `https://villages.io/upload/posting/` + x.photo : "https://villages.io/static/media/default.a63cc45ca4f1a7dc983f.png", description: x?.description ? x?.description : "No description Available", urlLink: 'https://villages.io/' + x.user.username + '/' + x.title
                    },)
                })
            }
            await postCard(x?.newPost)

            emailSendWrapper(x.userEmail, cards, post)
        })

        const emailSendWrapper = (email, cards, post) => {
            if (cards?.length || post.length) {
                manuplatedData.push({ "email": email, "cards": cards, "post": post })
            }
        }

        fetchedData = manuplatedData

    } catch (err) {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        next(err);
    }
}, {
    timezone: 'Pacific/Honolulu'
});

// Monday
cron.schedule('0 8 * * 1', () => {
    let data = fetchedData.slice(0, 200)
    console.log(data.length, "Monday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })

}, {
    timezone: 'Pacific/Honolulu'
});

// Tuesday
cron.schedule('0 8 * * 2', () => {
    let data = fetchedData.slice(200, 400)
    console.log(data.length, "Tuesday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Wednesday
cron.schedule('0 8 * * 3', () => {
    let data = fetchedData.slice(400, 600)
    console.log(data.length, "Wednesday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Thursday
cron.schedule('0 8 * * 4', () => {
    let data = fetchedData.slice(600, 800)
    console.log(data.length, "Thursday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Friday
cron.schedule('0 8 * * 5', () => {
    let data = fetchedData.slice(800, 1000)
    console.log(data.length, "Friday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Saturday
cron.schedule('0 8 * * 6', () => {
    let data = fetchedData.slice(1000, 1200)
    console.log(data.length, "Saturday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

// Sunday
cron.schedule('0 8 * * 7', () => {
    let data = fetchedData.slice(1200, 1400)
    console.log(data.length, "Sunday")
    data?.map(x => {
        let cards = x?.cards
        let post = x?.post
        ejs.renderFile(templateFile, { cards, post }, async (error, renderedTemplate) => {
            if (error) {
                console.log('Error rendering template:', error);
            } else {
                // Use the renderedTemplate to send the email

                await sendEmail(x?.email, 'Weekly Digest', renderedTemplate)
            }
        });
    })
}, {
    timezone: 'Pacific/Honolulu'
});

const moongose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const isEmpty = require("../validation/is-empty");

//calling database using async await
const db = process.env.mongoURI || "mongodb://localhost:27017";

const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Tag = require("../models/Tag");
const User = require("../models/User");
const Endorsement = require("../models/Endorsement");

const users = require("../DB/auth_user.json");
const profiles = require("../DB/profile_profile.json");
const endorsements = require("../DB/relate_endorsement.json");

const profileController = require("../controller/profile.controller");
const accountController = require("../controller/account.controller");

const connectDB = async () => {
  try {
    try {
      await moongose.connect(db);
    } catch (err) {
      console.log("mongo connect error:", err);
    }

    async function initialDB() {
      const adminUser = await User.findOne({ username: "dlevy" });
      if (adminUser.isSuperuser !== true) {
        adminUser.isSuperuser = true;
        adminUser.save();
      }

      Category.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          Category.insertMany([
            { title: "PRODUCTS", icon: "categories/products.png" },
            { title: "SERVICES", icon: "categories/services.png" },
            { title: "HOUSING", icon: "categories/housing.png" },
          ])
            .then(() => {
              console.log("Categories are initialized.");
            })
            .catch(() => {
              console.log("Categories cannot be initialized.");
            });
        }
      });

      Subcategory.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          Subcategory.insertMany([
            {
              title: "AUTOMOTIVE",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "OTHER",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "TRAVEL",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "GARDEN",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "FILM & MOVIES",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "PETS & ANIMALS",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "ELECTRONICS",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "FOOD & KITCHEN",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "CAMPING & OUTDOORS",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "FURNITURE",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "GAMES & TOYS",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "BOOKS & MAGAZINES",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "MUSIC",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "SPORTS",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "TOOLS",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "BEAUTY",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "COMPUTER",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "CYCLE",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "FARM+GARDEN",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "FINANCIAL",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "LABOR",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "LEGAL",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "EDUCATION",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "PET",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "REAL ESTATE",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "SKILLED TRADE",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "THERAPEUTIC",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "MEDIA",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "HOUSING",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "OTHER",
              categoryId: "635ff477fd65b00975147e95",
            },
            {
              title: "FARM",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "APARTMENTS",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "SHARED",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "TEMP",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "WORKTRADE",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "SWAP",
              categoryId: "635ff477fd65b00975147e96",
            },
            {
              title: "CLOTHES & ACCESSORIES",
              categoryId: "635ff477fd65b00975147e94",
            },
            {
              title: "HOUSEHOLD",
              categoryId: "635ff477fd65b00975147e95",
            },
          ])
            .then(() => {
              console.log("SubCategories are initialized.");
            })
            .catch((err) => {
              console.log("SubCategories cannot be initialized.", err);
            });
        }
      });

      Tag.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          Tag.insertMany([
            {
              title: "test",
            },
            {
              title: " post",
            },
            {
              title: " tags",
            },
            {
              title: "cryptography",
            },
            {
              title: " privacy",
            },
            {
              title: " security",
            },
            {
              title: " bitcoin",
            },
            {
              title: "bananas",
            },
            {
              title: " tropical",
            },
            {
              title: " fruit",
            },
            {
              title: " ",
            },
            {
              title: "html",
            },
            {
              title: "css",
            },
            {
              title: "javascript",
            },
            {
              title: "php",
            },
            {
              title: "wordpress",
            },
            {
              title: "internet",
            },
            {
              title: "Masa",
            },
            {
              title: " mexican food",
            },
            {
              title: " corn",
            },
            {
              title: " tortillas",
            },
            {
              title: " tamales",
            },
            {
              title: "Japanese food",
            },
            {
              title: " soy",
            },
            {
              title: " gluten-free",
            },
            {
              title: "Yoga",
            },
            {
              title: " community",
            },
            {
              title: " manifestation",
            },
            {
              title: " ceremony",
            },
            {
              title: " spirituality",
            },
            {
              title: "yoga",
            },
            {
              title: " meditation",
            },
            {
              title: "humandalas",
            },
            {
              title: "heal",
            },
            {
              title: "friendly",
            },
            {
              title: "hard working ",
            },
            {
              title: "moringa",
            },
            {
              title: "vegetables",
            },
            {
              title: "superfood",
            },
            {
              title: "restaurant",
            },
            {
              title: " dishes",
            },
            {
              title: " food",
            },
            {
              title: "money",
            },
            {
              title: "hawaii",
            },
            {
              title: "organizers",
            },
            {
              title: "meetup",
            },
            {
              title: "Writing",
            },
            {
              title: " editing",
            },
            {
              title: " books",
            },
            {
              title: "Travel ",
            },
            {
              title: "computer",
            },
            {
              title: "marketing",
            },
            {
              title: "website",
            },
            {
              title: "social media",
            },
            {
              title: "google adwords",
            },
            {
              title: "facebook ads",
            },
            {
              title: "rawvegan",
            },
            {
              title: "vegan",
            },
            {
              title: "raw",
            },
            {
              title: "nonprofit",
            },
            {
              title: " fundraising",
            },
            {
              title: " capacity building",
            },
            {
              title: " small business",
            },
            {
              title: " operations",
            },
            {
              title: " grantwriting",
            },
            {
              title: " communications",
            },
            {
              title: " human resources",
            },
            {
              title: " compliance",
            },
            {
              title: " management",
            },
            {
              title: " programming",
            },
            {
              title: " curriculum design",
            },
            {
              title: " training",
            },
            {
              title: " staff development",
            },
            {
              title: " volunteer development",
            },
            {
              title: " financial management",
            },
            {
              title: " mba",
            },
            {
              title: " group dynamics",
            },
            {
              title: " community development",
            },
            {
              title: " child",
            },
            {
              title: " youth",
            },
            {
              title: " teen",
            },
            {
              title: " young adultdevelopment",
            },
            {
              title: " values/ethics development",
            },
            {
              title: " leadership development",
            },
            {
              title: "landscaper",
            },
            {
              title: "cleanup",
            },
            {
              title: "farmer",
            },
            {
              title: "baking",
            },
            {
              title: "autistic",
            },
            {
              title: "neurocoin",
            },
            {
              title: "Mechanic",
            },
            {
              title: "Auto Repair",
            },
            {
              title: "Breadfruit",
            },
            {
              title: " ulu",
            },
            {
              title: " nutritious",
            },
            {
              title: "Healing",
            },
            {
              title: "Probiotic",
            },
            {
              title: " fermentation",
            },
            {
              title: " writing",
            },
            {
              title: " photography",
            },
            {
              title: " health",
            },
            {
              title: " film",
            },
            {
              title: "ukelele",
            },
            {
              title: "bunny ",
            },
            {
              title: "Farm ",
            },
            {
              title: "Animals",
            },
            {
              title: "children",
            },
            {
              title: " arts",
            },
            {
              title: " crafts",
            },
            {
              title: " waldorf",
            },
            {
              title: " Hawaiian crafts",
            },
            {
              title: " placed based learning",
            },
            {
              title: " home-school",
            },
            {
              title: " teens",
            },
            {
              title: " local",
            },
            {
              title: "hawaiian sea salt medicinaloil blends ",
            },
            {
              title: "pa'akai",
            },
            {
              title: "Pa'akai",
            },
            {
              title: "flower essences",
            },
            {
              title: "herbalism",
            },
            {
              title: "speech therapy",
            },
            {
              title: "salves",
            },
            {
              title: "body oils",
            },
            {
              title: "tinctures",
            },
            {
              title: "energy work",
            },
            {
              title: "body butter",
            },
            {
              title: "flowers",
            },
            {
              title: "flower essence practitioner",
            },
            {
              title: "herbalist",
            },
            {
              title: "palm",
            },
            {
              title: " weaving",
            },
            {
              title: " workshop",
            },
            {
              title: " creative",
            },
            {
              title: "learning",
            },
            {
              title: " art",
            },
            {
              title: "salve",
            },
            {
              title: "cushions",
            },
            {
              title: " pillows",
            },
            {
              title: "sound",
            },
            {
              title: "sacred",
            },
            {
              title: "intuitive",
            },
            {
              title: "Reiki",
            },
            {
              title: "energy",
            },
            {
              title: "meditation",
            },
            {
              title: "visualization",
            },
            {
              title: "crystals",
            },
            {
              title: "lava",
            },
            {
              title: "relationships",
            },
            {
              title: "relationship counseling ",
            },
            {
              title: "food",
            },
            {
              title: "catering",
            },
            {
              title: "personal chef",
            },
            {
              title: "cook",
            },
            {
              title: "labor",
            },
            {
              title: "construction",
            },
            {
              title: "artist",
            },
            {
              title: "painter",
            },
            {
              title: "landscape",
            },
            {
              title: "chainsaw",
            },
            {
              title: "Sensuality",
            },
            {
              title: "tantra",
            },
            {
              title: "guitar",
            },
            {
              title: "Relationship therapy",
            },
            {
              title: "Couples Counseling",
            },
            {
              title: "Marriage Counseling",
            },
            {
              title: "Women's Counseling",
            },
            {
              title: "Birth",
            },
            {
              title: " midwife",
            },
            {
              title: " homebirth",
            },
            {
              title: " midwifery",
            },
            {
              title: " pregnancy",
            },
            {
              title: "mixing mastering album music",
            },
            {
              title: "graphic design",
            },
            {
              title: "pahoa",
            },
            {
              title: "django",
            },
            {
              title: "framework",
            },
            {
              title: "python",
            },
            {
              title: "development",
            },
            {
              title: "HipCoin Digital Currency",
            },
            {
              title: "American Permanent Fund",
            },
            {
              title: "Alaska Permanent Fund",
            },
            {
              title: "Digital Currency",
            },
            {
              title: "Crypto Currency",
            },
            {
              title: "Self-Governing",
            },
            {
              title: "Education",
            },
            {
              title: "Health",
            },
            {
              title: "Renewable Natural Resources",
            },
            {
              title: "501 c 3 nonprofit",
            },
            {
              title: "NGO Non-governmental SISDnonprofit",
            },
            {
              title: "organizing",
            },
            {
              title: "cleaning",
            },
            {
              title: "Care Giving",
            },
            {
              title: "Housekeeping",
            },
            {
              title: "Child Care",
            },
            {
              title: "Elder Care",
            },
            {
              title: "Farm Management",
            },
            {
              title: "Corporate Consultation",
            },
            {
              title: "Conflict Resolution",
            },
            {
              title: "Increasing Bottom Line",
            },
            {
              title: "bitcoin",
            },
            {
              title: "ethereum",
            },
            {
              title: "cryptocurrencies",
            },
            {
              title: "mutual credit",
            },
            {
              title: "produce",
            },
            {
              title: "doterra",
            },
            {
              title: "fun",
            },
            {
              title: "hobby",
            },
            {
              title: "entertainment",
            },
            {
              title: "aging",
            },
            {
              title: "christmas",
            },
            {
              title: "tutor",
            },
            {
              title: "art mural painting drawing poster design",
            },
            {
              title: "Gift card",
            },
            {
              title: "books",
            },
            {
              title: "landscaping",
            },
            {
              title: "housepainting",
            },
            {
              title: "light construction",
            },
            {
              title: "business ",
            },
            {
              title: "Buddhism",
            },
            {
              title: "Spiritual",
            },
            {
              title: "Awakening",
            },
            {
              title: "wikipedia",
            },
            {
              title: "writing",
            },
            {
              title: "publishing",
            },
            {
              title: "copywrite",
            },
            {
              title: "journalism",
            },
            {
              title: "massage body energy work",
            },
            {
              title: "essential oils",
            },
            {
              title: " clothing",
            },
            {
              title: " seasonings",
            },
            {
              title: " custom sewing",
            },
            {
              title: "seasonings",
            },
            {
              title: "gift set",
            },
            {
              title: "Steemit",
            },
            {
              title: "blogging",
            },
            {
              title: "cryptocurrency",
            },
            {
              title: "thai-yoga massage",
            },
            {
              title: "thai massage",
            },
            {
              title: "deep tissue",
            },
            {
              title: "Reiki Master",
            },
            {
              title: "Energy Work",
            },
            {
              title: " reiki master",
            },
            {
              title: " healing",
            },
            {
              title: " therapy",
            },
            {
              title: "counselling",
            },
            {
              title: "mental health",
            },
            {
              title: "art",
            },
            {
              title: "thewall",
            },
            {
              title: "editing",
            },
            {
              title: "media",
            },
            {
              title: "video",
            },
            {
              title: "Hawaiian sea salt",
            },
            {
              title: "garlic",
            },
            {
              title: "celery",
            },
            {
              title: "turmeric",
            },
            {
              title: "gourmet",
            },
            {
              title: "#vegantreats ",
            },
            {
              title: "fruittrees ",
            },
            {
              title: "vegantreats",
            },
            {
              title: "childrenskirts",
            },
            {
              title: "copy",
            },
            {
              title: "management",
            },
            {
              title: "chi gong",
            },
            {
              title: "thai",
            },
            {
              title: "shiatsu",
            },
            {
              title: "key",
            },
            {
              title: "may",
            },
            {
              title: "first",
            },
            {
              title: "last",
            },
            {
              title: "Female travel companion",
            },
            {
              title: "korean girls in los angeles",
            },
            {
              title: "Rent a date",
            },
            {
              title: "sinblr",
            },
            {
              title: "mastodon",
            },
            {
              title: "Macadamia nuts",
            },
            {
              title: "tree trimming",
            },
            {
              title: "arborist",
            },
            {
              title: "Coconut",
            },
            {
              title: "coconuts",
            },
            {
              title: "Social dance chacha learn",
            },
            {
              title: "Art design rpg character",
            },
            {
              title: "Childcare",
            },
            {
              title: "Language",
            },
            {
              title: "japanese",
            },
            {
              title: "wellness",
            },
            {
              title: "health",
            },
            {
              title: "watsu",
            },
            {
              title: "education",
            },
            {
              title: "design",
            },
            {
              title: "logo",
            },
            {
              title: "custom logo",
            },
            {
              title: "artwork",
            },
            {
              title: "custom artwork",
            },
            {
              title: "Ride",
            },
            {
              title: "Support",
            },
            {
              title: "trainer",
            },
            {
              title: "helper",
            },
            {
              title: "healer",
            },
            {
              title: "creator",
            },
            {
              title: "guide",
            },
            {
              title: "motivator",
            },
            {
              title: "designer",
            },
            {
              title: "buddy",
            },
            {
              title: "drummer",
            },
            {
              title: "communication",
            },
            {
              title: "singing",
            },
            {
              title: "song",
            },
            {
              title: "voice activation",
            },
            {
              title: "nature",
            },
            {
              title: "relationship",
            },
            {
              title: "soundbath",
            },
            {
              title: "frequency",
            },
            {
              title: "5th chakra",
            },
            {
              title: "sacral chakra",
            },
            {
              title: "ceremony",
            },
            {
              title: "therapy",
            },
            {
              title: "reiki",
            },
            {
              title: "song bath",
            },
            {
              title: "sound healing",
            },
            {
              title: "clearing",
            },
            {
              title: "rest",
            },
            {
              title: "relaxation",
            },
            {
              title: "solutionary",
            },
            {
              title: " visionary",
            },
            {
              title: " council",
            },
            {
              title: " artists",
            },
            {
              title: " healers",
            },
            {
              title: " teachers",
            },
            {
              title: " permaculture",
            },
            {
              title: " grounding",
            },
            {
              title: " hypnosis",
            },
            {
              title: " play",
            },
            {
              title: " fun",
            },
            {
              title: " dreaming awake",
            },
            {
              title: "business consultation",
            },
            {
              title: "branding",
            },
            {
              title: "digital",
            },
            {
              title: "community outreach",
            },
            {
              title: "growth",
            },
            {
              title: "authentic sales",
            },
            {
              title: "clarity",
            },
            {
              title: "focus",
            },
            {
              title: "delegation",
            },
            {
              title: "calendarization",
            },
            {
              title: "meetups",
            },
            {
              title: "networking",
            },
            {
              title: "villages.io",
            },
            {
              title: "Web",
            },
            {
              title: "Consulting",
            },
            {
              title: "Business Strategy",
            },
            {
              title: "Design",
            },
            {
              title: "Graphics",
            },
            {
              title: "Wordpress",
            },
            {
              title: "Produce",
            },
            {
              title: "Food",
            },
            {
              title: "Weeding",
            },
            {
              title: "Gardening",
            },
            {
              title: "Friendship",
            },
            {
              title: "vegetable",
            },
            {
              title: "fruit",
            },
            {
              title: "homegrown",
            },
            {
              title: "permaculture",
            },
            {
              title: "Probiotic ferment fresh",
            },
            {
              title: "IT",
            },
            {
              title: "Technology",
            },
            {
              title: "phone",
            },
            {
              title: "web",
            },
            {
              title: "Energy work",
            },
            {
              title: "town run",
            },
            {
              title: "Kipahulu",
            },
            {
              title: "perth escorts",
            },
            {
              title: "human design",
            },
            {
              title: "liberation",
            },
            {
              title: "self love",
            },
            {
              title: "love",
            },
            {
              title: "self care",
            },
            {
              title: "soul songs",
            },
            {
              title: "majestic reminder",
            },
            {
              title: "heartistry",
            },
            {
              title: "remembering",
            },
            {
              title: "music",
            },
            {
              title: "massage services muscle relax bodywork",
            },
            {
              title: "cloudflare",
            },
            {
              title: "crimeflare",
            },
            {
              title: "tor",
            },
            {
              title: "privacy",
            },
            {
              title: "scriptwriting",
            },
            {
              title: "Permaculture",
            },
            {
              title: "ponds",
            },
            {
              title: "Farm",
            },
            {
              title: "backhoe work",
            },
            {
              title: "community",
            },
            {
              title: "event",
            },
            {
              title: "homemade",
            },
            {
              title: "crafts   knitting",
            },
            {
              title: "Cacao",
            },
            {
              title: "chocolate",
            },
            {
              title: "medicine",
            },
            {
              title: "general admin|customer service virtual assistant",
            },
            {
              title: "hr",
            },
            {
              title: "data entry",
            },
            {
              title: "pdf to word",
            },
            {
              title: "image to word",
            },
            {
              title: "customer service",
            },
            {
              title: "email support",
            },
            {
              title: "Recruitment",
            },
            {
              title: "Human resources",
            },
            {
              title: "Data Entry",
            },
            {
              title: "Office Administration",
            },
            {
              title: "Virtual Assistant",
            },
            {
              title: "Admin Support",
            },
            {
              title: "D&D",
            },
            {
              title: "decloudflare",
            },
            {
              title: "electrojica",
            },
            {
              title: "Paper Bag Puppets",
            },
            {
              title: "Kundalini",
            },
            {
              title: "Exercise ",
            },
            {
              title: "Kombucha",
            },
            {
              title: "Arduino ",
            },
            {
              title: "IOT",
            },
            {
              title: "Living food for Living bodies",
            },
            {
              title: "Trauma Informed Therapy",
            },
            {
              title: " Communication & Relationship",
            },
            {
              title: " EMDR",
            },
            {
              title: " Art Therapy",
            },
            {
              title: " Eco Therapy",
            },
            {
              title: "farming",
            },
            {
              title: "gardening",
            },
            {
              title: "Fruit",
            },
            {
              title: "Trees",
            },
            {
              title: "Dance",
            },
            {
              title: "Spanish",
            },
            {
              title: "ocean",
            },
            {
              title: "water-safety",
            },
            {
              title: "mural",
            },
            {
              title: "writer",
            },
            {
              title: "Massage",
            },
            {
              title: "bodywork",
            },
            {
              title: "healing",
            },
            {
              title: "#humanpyschology",
            },
            {
              title: "massage",
            },
          ])
            .then(() => {
              console.log("Tags are initialized.");
            })
            .catch(() => {
              console.log("Tags cannot be initialized.");
            });
        }
      });

      let profile_to_user_ids = [];

      if (users.RECORDS && users.RECORDS.length > 0) {
        for (const each of users.RECORDS) {
          let profile, account, user;
          try {
            const {
              id: user_id,
              username,
              first_name: firstName,
              last_name: lastName,
              email,
            } = each;
            if (isEmpty(email)) continue;

            user = await User.findOne({ $or: [{ email }, { username }] });
            if (user) continue;

            const token = crypto.randomBytes(32).toString("hex");
            user = new User({
              password: "123123",
              username,
              firstName,
              lastName,
              email,
              token,
            });

            let profileData = {
              user: user._id,
              name: `${firstName} ${lastName}`,
            };
            if (
              profiles.RECORDS &&
              profiles.RECORDS.find((profile) => profile?.user_id === user_id)
            ) {
              profileData = {
                ...profileData,
                description: profiles.RECORDS.find(
                  (profile) => profile?.user_id === user_id
                ).description,
              };
            }

            profile = await profileController._createProfile(profileData);
            account = await accountController._createAccount({
              user: user._id,
              balance: 0,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash("123123", salt);
            user.profile = profile._id;
            user.account = account._id;

            await user.save();
            if (
              profiles.RECORDS &&
              profiles.RECORDS.find((profile) => profile?.user_id === user_id)
            ) {
              profile_to_user_ids[
                profiles.RECORDS.find(
                  (profile) => profile?.user_id === user_id
                ).id
              ] = user._id;
            }
          } catch (err) {
            console.log(err);
            if (profile) await profileController._removeProfileById(profile.id);
            if (account) await accountController._removeAccountById(account.id);
            if (user) await User.find({ id: user.id }).remove().exec();
          }
        }
      }

      if (endorsements.RECORDS && endorsements.RECORDS.length > 0) {
        for (const each of endorsements.RECORDS) {
          let endorsement;
          try {
            endorsement = await Endorsement.findOne({
              endorserId: profile_to_user_ids[each.endorser_id],
              recipientId: profile_to_user_ids[each.recipient_id],
            });

            if (endorsement) {
              endorsement.weight = each.weight;
              endorsement.text = each.text;
              await endorsement.save();
            } else {
              await Endorsement.create({
                weight: each.weight,
                text: each.text,
                endorserId: profile_to_user_ids[each.endorser_id],
                recipientId: profile_to_user_ids[each.recipient_id],
              });
            }
          } catch (err) {
            if (endorsement)
              await Endorsement.find({ id: endorsement.id }).remove().exec();
          }
        }
      }
    }

    initialDB();

    console.log("MongoDb Connected..");
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

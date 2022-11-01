const moongose = require('mongoose');

//calling database using async await
const db = process.env.mongoURI || 'mongodb://localhost:27017';
const Category = require('../models/Category');
const Tag = require('../models/Tag');

const connectDB = async () => {
    try {
        await moongose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        function initialCategories() {
            Category.estimatedDocumentCount((err, count) => {
                if (!err && count === 0) {
                    Category.insertMany(
                      [
                          { title: 'PRODUCTS', icon: 'categories/products.png' },
                          { title: 'SERVICES', icon: 'categories/services.png' },
                          { title: 'HOUSING', icon: 'categories/housing.png' },
                      ]
                    )
                      .then(() => {
                          console.log('Categories are initialized.')
                      })
                      .catch(() => {
                          console.log('Categories cannot be initialized.')
                      })
                }
            })

            Tag.estimatedDocumentCount((err, count) => {
                if (!err && count === 0) {
                    Tag.insertMany(
                      [
                        {
                          "title": "test",
                        },
                        {
                          "title": " post",
                        },
                        {
                          "title": " tags",
                        },
                        {
                          "title": "cryptography",
                        },
                        {
                          "title": " privacy",
                        },
                        {
                          "title": " security",
                        },
                        {
                          "title": " bitcoin",
                        },
                        {
                          "title": "bananas",
                        },
                        {
                          "title": " tropical",
                        },
                        {
                          "title": " fruit",
                        },
                        {
                          "title": " ",
                        },
                        {
                          "title": "html",
                        },
                        {
                          "title": "css",
                        },
                        {
                          "title": "javascript",
                        },
                        {
                          "title": "php",
                        },
                        {
                          "title": "wordpress",
                        },
                        {
                          "title": "internet",
                        },
                        {
                          "title": "Masa",
                        },
                        {
                          "title": " mexican food",
                        },
                        {
                          "title": " corn",
                        },
                        {
                          "title": " tortillas",
                        },
                        {
                          "title": " tamales",
                        },
                        {
                          "title": "Japanese food",
                        },
                        {
                          "title": " soy",
                        },
                        {
                          "title": " gluten-free",
                        },
                        {
                          "title": "Yoga",
                        },
                        {
                          "title": " community",
                        },
                        {
                          "title": " manifestation",
                        },
                        {
                          "title": " ceremony",
                        },
                        {
                          "title": " spirituality",
                        },
                        {
                          "title": "yoga",
                        },
                        {
                          "title": " meditation",
                        },
                        {
                          "title": "humandalas",
                        },
                        {
                          "title": "heal",
                        },
                        {
                          "title": "friendly",
                        },
                        {
                          "title": "hard working ",
                        },
                        {
                          "title": "moringa",
                        },
                        {
                          "title": "vegetables",
                        },
                        {
                          "title": "superfood",
                        },
                        {
                          "title": "restaurant",
                        },
                        {
                          "title": " dishes",
                        },
                        {
                          "title": " food",
                        },
                        {
                          "title": "money",
                        },
                        {
                          "title": "hawaii",
                        },
                        {
                          "title": "organizers",
                        },
                        {
                          "title": "meetup",
                        },
                        {
                          "title": "Writing",
                        },
                        {
                          "title": " editing",
                        },
                        {
                          "title": " books",
                        },
                        {
                          "title": "Travel ",
                        },
                        {
                          "title": "computer",
                        },
                        {
                          "title": "marketing",
                        },
                        {
                          "title": "website",
                        },
                        {
                          "title": "social media",
                        },
                        {
                          "title": "google adwords",
                        },
                        {
                          "title": "facebook ads",
                        },
                        {
                          "title": "rawvegan",
                        },
                        {
                          "title": "vegan",
                        },
                        {
                          "title": "raw",
                        },
                        {
                          "title": "nonprofit",
                        },
                        {
                          "title": " fundraising",
                        },
                        {
                          "title": " capacity building",
                        },
                        {
                          "title": " small business",
                        },
                        {
                          "title": " operations",
                        },
                        {
                          "title": " grantwriting",
                        },
                        {
                          "title": " communications",
                        },
                        {
                          "title": " human resources",
                        },
                        {
                          "title": " compliance",
                        },
                        {
                          "title": " management",
                        },
                        {
                          "title": " programming",
                        },
                        {
                          "title": " curriculum design",
                        },
                        {
                          "title": " training",
                        },
                        {
                          "title": " staff development",
                        },
                        {
                          "title": " volunteer development",
                        },
                        {
                          "title": " financial management",
                        },
                        {
                          "title": " mba",
                        },
                        {
                          "title": " group dynamics",
                        },
                        {
                          "title": " community development",
                        },
                        {
                          "title": " child",
                        },
                        {
                          "title": " youth",
                        },
                        {
                          "title": " teen",
                        },
                        {
                          "title": " young adultdevelopment",
                        },
                        {
                          "title": " values/ethics development",
                        },
                        {
                          "title": " leadership development",
                        },
                        {
                          "title": "landscaper",
                        },
                        {
                          "title": "cleanup",
                        },
                        {
                          "title": "farmer",
                        },
                        {
                          "title": "baking",
                        },
                        {
                          "title": "autistic",
                        },
                        {
                          "title": "neurocoin",
                        },
                        {
                          "title": "Mechanic",
                        },
                        {
                          "title": "Auto Repair",
                        },
                        {
                          "title": "Breadfruit",
                        },
                        {
                          "title": " ulu",
                        },
                        {
                          "title": " nutritious",
                        },
                        {
                          "title": "Healing",
                        },
                        {
                          "title": "Probiotic",
                        },
                        {
                          "title": " fermentation",
                        },
                        {
                          "title": " writing",
                        },
                        {
                          "title": " photography",
                        },
                        {
                          "title": " health",
                        },
                        {
                          "title": " film",
                        },
                        {
                          "title": "ukelele",
                        },
                        {
                          "title": "bunny ",
                        },
                        {
                          "title": "Farm ",
                        },
                        {
                          "title": "Animals",
                        },
                        {
                          "title": "children",
                        },
                        {
                          "title": " arts",
                        },
                        {
                          "title": " crafts",
                        },
                        {
                          "title": " waldorf",
                        },
                        {
                          "title": " Hawaiian crafts",
                        },
                        {
                          "title": " placed based learning",
                        },
                        {
                          "title": " home-school",
                        },
                        {
                          "title": " teens",
                        },
                        {
                          "title": " local",
                        },
                        {
                          "title": "hawaiian sea salt medicinaloil blends ",
                        },
                        {
                          "title": "pa'akai",
                        },
                        {
                          "title": "Pa'akai",
                        },
                        {
                          "title": "flower essences",
                        },
                        {
                          "title": "herbalism",
                        },
                        {
                          "title": "speech therapy",
                        },
                        {
                          "title": "salves",
                        },
                        {
                          "title": "body oils",
                        },
                        {
                          "title": "tinctures",
                        },
                        {
                          "title": "energy work",
                        },
                        {
                          "title": "body butter",
                        },
                        {
                          "title": "flowers",
                        },
                        {
                          "title": "flower essence practitioner",
                        },
                        {
                          "title": "herbalist",
                        },
                        {
                          "title": "palm",
                        },
                        {
                          "title": " weaving",
                        },
                        {
                          "title": " workshop",
                        },
                        {
                          "title": " creative",
                        },
                        {
                          "title": "learning",
                        },
                        {
                          "title": " art",
                        },
                        {
                          "title": "salve",
                        },
                        {
                          "title": "cushions",
                        },
                        {
                          "title": " pillows",
                        },
                        {
                          "title": "sound",
                        },
                        {
                          "title": "sacred",
                        },
                        {
                          "title": "intuitive",
                        },
                        {
                          "title": "Reiki",
                        },
                        {
                          "title": "energy",
                        },
                        {
                          "title": "meditation",
                        },
                        {
                          "title": "visualization",
                        },
                        {
                          "title": "crystals",
                        },
                        {
                          "title": "lava",
                        },
                        {
                          "title": "relationships",
                        },
                        {
                          "title": "relationship counseling ",
                        },
                        {
                          "title": "food",
                        },
                        {
                          "title": "catering",
                        },
                        {
                          "title": "personal chef",
                        },
                        {
                          "title": "cook",
                        },
                        {
                          "title": "labor",
                        },
                        {
                          "title": "construction",
                        },
                        {
                          "title": "artist",
                        },
                        {
                          "title": "painter",
                        },
                        {
                          "title": "landscape",
                        },
                        {
                          "title": "chainsaw",
                        },
                        {
                          "title": "Sensuality",
                        },
                        {
                          "title": "tantra",
                        },
                        {
                          "title": "guitar",
                        },
                        {
                          "title": "Relationship therapy",
                        },
                        {
                          "title": "Couples Counseling",
                        },
                        {
                          "title": "Marriage Counseling",
                        },
                        {
                          "title": "Women's Counseling",
                        },
                        {
                          "title": "Birth",
                        },
                        {
                          "title": " midwife",
                        },
                        {
                          "title": " homebirth",
                        },
                        {
                          "title": " midwifery",
                        },
                        {
                          "title": " pregnancy",
                        },
                        {
                          "title": "mixing mastering album music",
                        },
                        {
                          "title": "graphic design",
                        },
                        {
                          "title": "pahoa",
                        },
                        {
                          "title": "django",
                        },
                        {
                          "title": "framework",
                        },
                        {
                          "title": "python",
                        },
                        {
                          "title": "development",
                        },
                        {
                          "title": "HipCoin Digital Currency",
                        },
                        {
                          "title": "American Permanent Fund",
                        },
                        {
                          "title": "Alaska Permanent Fund",
                        },
                        {
                          "title": "Digital Currency",
                        },
                        {
                          "title": "Crypto Currency",
                        },
                        {
                          "title": "Self-Governing",
                        },
                        {
                          "title": "Education",
                        },
                        {
                          "title": "Health",
                        },
                        {
                          "title": "Renewable Natural Resources",
                        },
                        {
                          "title": "501 c 3 nonprofit",
                        },
                        {
                          "title": "NGO Non-governmental SISDnonprofit",
                        },
                        {
                          "title": "organizing",
                        },
                        {
                          "title": "cleaning",
                        },
                        {
                          "title": "Care Giving",
                        },
                        {
                          "title": "Housekeeping",
                        },
                        {
                          "title": "Child Care",
                        },
                        {
                          "title": "Elder Care",
                        },
                        {
                          "title": "Farm Management",
                        },
                        {
                          "title": "Corporate Consultation",
                        },
                        {
                          "title": "Conflict Resolution",
                        },
                        {
                          "title": "Increasing Bottom Line",
                        },
                        {
                          "title": "bitcoin",
                        },
                        {
                          "title": "ethereum",
                        },
                        {
                          "title": "cryptocurrencies",
                        },
                        {
                          "title": "mutual credit",
                        },
                        {
                          "title": "produce",
                        },
                        {
                          "title": "doterra",
                        },
                        {
                          "title": "fun",
                        },
                        {
                          "title": "hobby",
                        },
                        {
                          "title": "entertainment",
                        },
                        {
                          "title": "aging",
                        },
                        {
                          "title": "christmas",
                        },
                        {
                          "title": "tutor",
                        },
                        {
                          "title": "art mural painting drawing poster design",
                        },
                        {
                          "title": "Gift card",
                        },
                        {
                          "title": "books",
                        },
                        {
                          "title": "landscaping",
                        },
                        {
                          "title": "housepainting",
                        },
                        {
                          "title": "light construction",
                        },
                        {
                          "title": "business ",
                        },
                        {
                          "title": "Buddhism",
                        },
                        {
                          "title": "Spiritual",
                        },
                        {
                          "title": "Awakening",
                        },
                        {
                          "title": "wikipedia",
                        },
                        {
                          "title": "writing",
                        },
                        {
                          "title": "publishing",
                        },
                        {
                          "title": "copywrite",
                        },
                        {
                          "title": "journalism",
                        },
                        {
                          "title": "massage body energy work",
                        },
                        {
                          "title": "essential oils",
                        },
                        {
                          "title": " clothing",
                        },
                        {
                          "title": " seasonings",
                        },
                        {
                          "title": " custom sewing",
                        },
                        {
                          "title": "seasonings",
                        },
                        {
                          "title": "gift set",
                        },
                        {
                          "title": "Steemit",
                        },
                        {
                          "title": "blogging",
                        },
                        {
                          "title": "cryptocurrency",
                        },
                        {
                          "title": "thai-yoga massage",
                        },
                        {
                          "title": "thai massage",
                        },
                        {
                          "title": "deep tissue",
                        },
                        {
                          "title": "Reiki Master",
                        },
                        {
                          "title": "Energy Work",
                        },
                        {
                          "title": " reiki master",
                        },
                        {
                          "title": " healing",
                        },
                        {
                          "title": " therapy",
                        },
                        {
                          "title": "counselling",
                        },
                        {
                          "title": "mental health",
                        },
                        {
                          "title": "art",
                        },
                        {
                          "title": "thewall",
                        },
                        {
                          "title": "editing",
                        },
                        {
                          "title": "media",
                        },
                        {
                          "title": "video",
                        },
                        {
                          "title": "Hawaiian sea salt",
                        },
                        {
                          "title": "garlic",
                        },
                        {
                          "title": "celery",
                        },
                        {
                          "title": "turmeric",
                        },
                        {
                          "title": "gourmet",
                        },
                        {
                          "title": "#vegantreats ",
                        },
                        {
                          "title": "fruittrees ",
                        },
                        {
                          "title": "vegantreats",
                        },
                        {
                          "title": "childrenskirts",
                        },
                        {
                          "title": "copy",
                        },
                        {
                          "title": "management",
                        },
                        {
                          "title": "chi gong",
                        },
                        {
                          "title": "thai",
                        },
                        {
                          "title": "shiatsu",
                        },
                        {
                          "title": "key",
                        },
                        {
                          "title": "may",
                        },
                        {
                          "title": "first",
                        },
                        {
                          "title": "last",
                        },
                        {
                          "title": "Female travel companion",
                        },
                        {
                          "title": "korean girls in los angeles",
                        },
                        {
                          "title": "Rent a date",
                        },
                        {
                          "title": "sinblr",
                        },
                        {
                          "title": "mastodon",
                        },
                        {
                          "title": "Macadamia nuts",
                        },
                        {
                          "title": "tree trimming",
                        },
                        {
                          "title": "arborist",
                        },
                        {
                          "title": "Coconut",
                        },
                        {
                          "title": "coconuts",
                        },
                        {
                          "title": "Social dance chacha learn",
                        },
                        {
                          "title": "Art design rpg character",
                        },
                        {
                          "title": "Childcare",
                        },
                        {
                          "title": "Language",
                        },
                        {
                          "title": "japanese",
                        },
                        {
                          "title": "wellness",
                        },
                        {
                          "title": "health",
                        },
                        {
                          "title": "watsu",
                        },
                        {
                          "title": "education",
                        },
                        {
                          "title": "design",
                        },
                        {
                          "title": "logo",
                        },
                        {
                          "title": "custom logo",
                        },
                        {
                          "title": "artwork",
                        },
                        {
                          "title": "custom artwork",
                        },
                        {
                          "title": "Ride",
                        },
                        {
                          "title": "Support",
                        },
                        {
                          "title": "trainer",
                        },
                        {
                          "title": "helper",
                        },
                        {
                          "title": "healer",
                        },
                        {
                          "title": "creator",
                        },
                        {
                          "title": "guide",
                        },
                        {
                          "title": "motivator",
                        },
                        {
                          "title": "designer",
                        },
                        {
                          "title": "buddy",
                        },
                        {
                          "title": "drummer",
                        },
                        {
                          "title": "communication",
                        },
                        {
                          "title": "singing",
                        },
                        {
                          "title": "song",
                        },
                        {
                          "title": "voice activation",
                        },
                        {
                          "title": "nature",
                        },
                        {
                          "title": "relationship",
                        },
                        {
                          "title": "soundbath",
                        },
                        {
                          "title": "frequency",
                        },
                        {
                          "title": "5th chakra",
                        },
                        {
                          "title": "sacral chakra",
                        },
                        {
                          "title": "ceremony",
                        },
                        {
                          "title": "therapy",
                        },
                        {
                          "title": "reiki",
                        },
                        {
                          "title": "song bath",
                        },
                        {
                          "title": "sound healing",
                        },
                        {
                          "title": "clearing",
                        },
                        {
                          "title": "rest",
                        },
                        {
                          "title": "relaxation",
                        },
                        {
                          "title": "solutionary",
                        },
                        {
                          "title": " visionary",
                        },
                        {
                          "title": " council",
                        },
                        {
                          "title": " artists",
                        },
                        {
                          "title": " healers",
                        },
                        {
                          "title": " teachers",
                        },
                        {
                          "title": " permaculture",
                        },
                        {
                          "title": " grounding",
                        },
                        {
                          "title": " hypnosis",
                        },
                        {
                          "title": " play",
                        },
                        {
                          "title": " fun",
                        },
                        {
                          "title": " dreaming awake",
                        },
                        {
                          "title": "business consultation",
                        },
                        {
                          "title": "branding",
                        },
                        {
                          "title": "digital",
                        },
                        {
                          "title": "community outreach",
                        },
                        {
                          "title": "growth",
                        },
                        {
                          "title": "authentic sales",
                        },
                        {
                          "title": "clarity",
                        },
                        {
                          "title": "focus",
                        },
                        {
                          "title": "delegation",
                        },
                        {
                          "title": "calendarization",
                        },
                        {
                          "title": "meetups",
                        },
                        {
                          "title": "networking",
                        },
                        {
                          "title": "villages.io",
                        },
                        {
                          "title": "Web",
                        },
                        {
                          "title": "Consulting",
                        },
                        {
                          "title": "Business Strategy",
                        },
                        {
                          "title": "Design",
                        },
                        {
                          "title": "Graphics",
                        },
                        {
                          "title": "Wordpress",
                        },
                        {
                          "title": "Produce",
                        },
                        {
                          "title": "Food",
                        },
                        {
                          "title": "Weeding",
                        },
                        {
                          "title": "Gardening",
                        },
                        {
                          "title": "Friendship",
                        },
                        {
                          "title": "vegetable",
                        },
                        {
                          "title": "fruit",
                        },
                        {
                          "title": "homegrown",
                        },
                        {
                          "title": "permaculture",
                        },
                        {
                          "title": "Probiotic ferment fresh",
                        },
                        {
                          "title": "IT",
                        },
                        {
                          "title": "Technology",
                        },
                        {
                          "title": "phone",
                        },
                        {
                          "title": "web",
                        },
                        {
                          "title": "Energy work",
                        },
                        {
                          "title": "town run",
                        },
                        {
                          "title": "Kipahulu",
                        },
                        {
                          "title": "perth escorts",
                        },
                        {
                          "title": "human design",
                        },
                        {
                          "title": "liberation",
                        },
                        {
                          "title": "self love",
                        },
                        {
                          "title": "love",
                        },
                        {
                          "title": "self care",
                        },
                        {
                          "title": "soul songs",
                        },
                        {
                          "title": "majestic reminder",
                        },
                        {
                          "title": "heartistry",
                        },
                        {
                          "title": "remembering",
                        },
                        {
                          "title": "music",
                        },
                        {
                          "title": "massage services muscle relax bodywork",
                        },
                        {
                          "title": "cloudflare",
                        },
                        {
                          "title": "crimeflare",
                        },
                        {
                          "title": "tor",
                        },
                        {
                          "title": "privacy",
                        },
                        {
                          "title": "scriptwriting",
                        },
                        {
                          "title": "Permaculture",
                        },
                        {
                          "title": "ponds",
                        },
                        {
                          "title": "Farm",
                        },
                        {
                          "title": "backhoe work",
                        },
                        {
                          "title": "community",
                        },
                        {
                          "title": "event",
                        },
                        {
                          "title": "homemade",
                        },
                        {
                          "title": "crafts   knitting",
                        },
                        {
                          "title": "Cacao",
                        },
                        {
                          "title": "chocolate",
                        },
                        {
                          "title": "medicine",
                        },
                        {
                          "title": "general admin|customer service virtual assistant",
                        },
                        {
                          "title": "hr",
                        },
                        {
                          "title": "data entry",
                        },
                        {
                          "title": "pdf to word",
                        },
                        {
                          "title": "image to word",
                        },
                        {
                          "title": "customer service",
                        },
                        {
                          "title": "email support",
                        },
                        {
                          "title": "Recruitment",
                        },
                        {
                          "title": "Human resources",
                        },
                        {
                          "title": "Data Entry",
                        },
                        {
                          "title": "Office Administration",
                        },
                        {
                          "title": "Virtual Assistant",
                        },
                        {
                          "title": "Admin Support",
                        },
                        {
                          "title": "D&D",
                        },
                        {
                          "title": "decloudflare",
                        },
                        {
                          "title": "electrojica",
                        },
                        {
                          "title": "Paper Bag Puppets",
                        },
                        {
                          "title": "Kundalini",
                        },
                        {
                          "title": "Exercise ",
                        },
                        {
                          "title": "Kombucha",
                        },
                        {
                          "title": "Arduino ",
                        },
                        {
                          "title": "IOT",
                        },
                        {
                          "title": "Living food for Living bodies",
                        },
                        {
                          "title": "Trauma Informed Therapy",
                        },
                        {
                          "title": " Communication & Relationship",
                        },
                        {
                          "title": " EMDR",
                        },
                        {
                          "title": " Art Therapy",
                        },
                        {
                          "title": " Eco Therapy",
                        },
                        {
                          "title": "farming",
                        },
                        {
                          "title": "gardening",
                        },
                        {
                          "title": "Fruit",
                        },
                        {
                          "title": "Trees",
                        },
                        {
                          "title": "Dance",
                        },
                        {
                          "title": "Spanish",
                        },
                        {
                          "title": "ocean",
                        },
                        {
                          "title": "water-safety",
                        },
                        {
                          "title": "mural",
                        },
                        {
                          "title": "writer",
                        },
                        {
                          "title": "Massage",
                        },
                        {
                          "title": "bodywork",
                        },
                        {
                          "title": "healing",
                        },
                        {
                          "title": "#humanpyschology",
                        },
                        {
                          "title": "massage",
                        }
                      ]
                    )
                      .then(() => {
                          console.log('Tags are initialized.')
                      })
                      .catch(() => {
                          console.log('Tags cannot be initialized.')
                      })
                }
            })
        }

        initialCategories()

        console.log('MongoDb Connected..');
    } catch (err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;

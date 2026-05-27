const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Article = require('./models/Article');

// ─── Seed Data ────────────────────────────────────────────────────────────────

const users = [
    {
        firstName: "Alicia", lastName: "Reyes", age: "29", gender: "female",
        contactNumber: "09171234567", email: "alicia.reyes@smiski.com",
        type: "admin", username: "aliciareyes", password: "Alicia123!",
        address: "Sampaloc, Manila, Metro Manila", isActive: true,
    },
    {
        firstName: "Marco", lastName: "Santos", age: "31", gender: "male",
        contactNumber: "09182345678", email: "marco.santos@smiski.com",
        type: "viewer", username: "marcosantos", password: "Marco123!",
        address: "Tondo, Manila, Metro Manila", isActive: true,
    },
    {
        firstName: "Bianca", lastName: "Cruz", age: "26", gender: "female",
        contactNumber: "09193456789", email: "bianca.cruz@smiski.com",
        type: "editor", username: "biancacruz", password: "Bianca123!",
        address: "Quezon City, Metro Manila", isActive: false,
    },
    {
        firstName: "Nathan", lastName: "Diaz", age: "34", gender: "male",
        contactNumber: "09214567890", email: "nathan.diaz@smiski.com",
        type: "viewer", username: "nathandiaz", password: "Nathan123!",
        address: "Pasig City, Metro Manila", isActive: true,
    },
    {
        firstName: "Jasmine", lastName: "Garcia", age: "28", gender: "female",
        contactNumber: "09225678901", email: "jasmine.garcia@smiski.com",
        type: "editor", username: "jasminegarcia", password: "Jasmine123!",
        address: "Makati City, Metro Manila", isActive: false,
    },
    {
        firstName: "Ethan", lastName: "Lopez", age: "33", gender: "male",
        contactNumber: "09236789012", email: "ethan.lopez@smiski.com",
        type: "viewer", username: "ethanlopez", password: "Ethan123!",
        address: "Taguig City, Metro Manila", isActive: true,
    },
];

const articles = [
    {
        slug: "how-to-start-your-smiski-collection",
        title: "How to Start Your Smiski Collection",
        imageUrl: "",
        content: [
            "New to Smiski? This beginner guide walks you through the best series to start with, where to buy, and tips for building your collection.",
            "Smiskis are small, glow-in-the-dark figurines made by Dreams Inc. They come in themed series and are sold in blind boxes, meaning you won't know which figure you'll get until you open it.",
            "The best series to start with are the original Basic Series or the Bath Series, as they are widely available and very beginner-friendly.",
            "You can find Smiskis at specialty toy stores, anime shops, and online retailers. Always buy from authorized sellers to avoid counterfeits.",
        ],
        paragraphs: 4,
        preview: "New to Smiski? This beginner guide walks you through the best series to start with, where to buy, and tips for building your collection.",
        isFeatured: false,
        isActive: true,
    },
    {
        slug: "smiski-bath-series-guide",
        title: "A Complete Look at the Smiski Bath Series",
        imageUrl: "",
        content: [
            "One of the most popular series ever released — explore every figure in the Bath Series and find out which ones are hardest to find.",
            "The Bath Series features Smiskis in adorable bathroom-themed poses — sitting in a tub, wrapped in a towel, brushing teeth, and more.",
            "There are 6 figures in the Bath Series, with one secret rare figure that has a much lower pull rate than the others.",
            "The rarest figure in this series is the one wrapped in a towel with a surprised expression — collectors consider it the holy grail of the Bath Series.",
        ],
        paragraphs: 4,
        preview: "One of the most popular series ever released — explore every figure in the Bath Series and find out which ones are hardest to find.",
        isFeatured: false,
        isActive: true,
    },
    {
        slug: "how-to-display-smiskis",
        title: "How to Display Your Smiskis at Home",
        imageUrl: "",
        content: [
            "From shelves to shadow boxes — creative and practical ways to show off your Smiski collection while keeping them safe and dust-free.",
            "A floating wall shelf is one of the most popular display methods. Arrange your Smiskis by series or color for a clean, cohesive look.",
            "Shadow boxes with glass fronts are great for protecting rare figures while still keeping them visible. You can line the back with colored paper for contrast.",
            "For a fun twist, try displaying your Smiskis in themed dioramas — small scenes built from miniature props that match the figure's pose or series theme.",
        ],
        paragraphs: 4,
        preview: "From shelves to shadow boxes — creative and practical ways to show off your Smiski collection while keeping them safe and dust-free.",
        isFeatured: false,
        isActive: true,
    },
    {
        slug: "new-smiski-series",
        title: "New Smiski Series: What We Know So Far",
        imageUrl: "",
        content: [
            "Dreams Inc. has been teasing a brand new Smiski series. Here is everything collectors need to know about the upcoming release.",
            "Based on recent social media posts from Dreams Inc., the new series appears to feature outdoor and nature-themed poses, possibly a Garden or Forest Series.",
            "No official release date has been announced yet, but based on past release patterns, collectors expect it to drop within the next quarter.",
            "Pre-orders are expected to open on the official Dreams Inc. website and select partner retailers. Sign up for their newsletter to be notified first.",
        ],
        paragraphs: 4,
        preview: "Dreams Inc. has been teasing a brand new Smiski series. Here is everything collectors need to know about the upcoming release.",
        isFeatured: false,
        isActive: true,
    },
    {
        slug: "smiski-glow-in-the-dark",
        title: "The Magic Behind Smiski's Glow in the Dark",
        imageUrl: "",
        content: [
            "One of the most iconic features of every Smiski figure is its soft, glow-in-the-dark body. But what makes them glow, and how do you get the best glow out of your figures?",
            "Smiskis are made from a phosphorescent material that absorbs light and slowly releases it in the dark. The longer you expose them to light, the brighter and longer they will glow.",
            "For the best glow, place your Smiski under a bright light source for at least 30 seconds before turning off the lights. Natural sunlight and UV lights tend to charge them the fastest.",
            "The glow typically lasts between 5 to 15 minutes depending on how long the figure was charged. Over time, the glow effect does not wear out — it recharges every time you expose it to light.",
            "Displaying your Smiskis near a window during the day is a great way to keep them passively charged so they are ready to glow at night without any extra effort.",
            "Collectors often use the glow feature as part of their display setups — arranging Smiskis in dark shelves or cabinets so the glow creates a dreamy, ambient effect in the room.",
        ],
        paragraphs: 6,
        preview: "One of the most iconic features of every Smiski figure is its soft, glow-in-the-dark body. But what makes them glow, and how do you get the best glow out of your figures?",
        isFeatured: false,
        isActive: true,
    },
    // ── Three new featured series articles ────────────────────────────────────
    {
        slug: "smiski-basic-series",
        title: "Smiski Basic Series: The One That Started It All",
        imageUrl: "",
        content: [
            "The original series featuring Smiski in everyday poses — perfect for first-time collectors starting their journey into the world of these glowing little companions.",
            "The Basic Series was the very first Smiski line released by Dreams Inc. and remains one of the most beloved collections to this day. It introduced collectors to the iconic glow-in-the-dark vinyl material and the mysterious blind box format that the brand is known for.",
            "Each figure in the Basic Series depicts Smiski in a simple, relatable everyday pose — stretching, tiptoeing, peeking around a corner, or just standing quietly. The charm of these figures lies in their minimalist design and the way they seem to capture small, human moments in a tiny glowing form.",
            "There are six figures in the standard Basic Series lineup, plus one secret rare figure that has a significantly lower pull rate. Collectors who manage to complete the full set — including the secret — consider it a major milestone in their Smiski journey.",
            "Because the Basic Series was the first, it is also the most widely available. You can find it at most toy stores, anime and hobby shops, and online retailers that carry Smiski products. It is the ideal starting point for anyone new to collecting.",
            "If you are just getting started, the Basic Series is the perfect introduction. It is affordable, easy to find, and gives you a great sense of what Smiski collecting is all about — the thrill of the blind box, the delight of the glow, and the quiet joy of a tiny figure watching over your space.",
        ],
        paragraphs: 6,
        preview: "The original series featuring Smiski in everyday poses — perfect for first-time collectors starting their journey into the world of these glowing little companions.",
        isFeatured: true,
        isActive: true,
    },
    {
        slug: "smiski-bath-series",
        title: "Smiski Bath Series: Adorable Moments in the Bathroom",
        imageUrl: "",
        content: [
            "Adorable Smiskis caught in bath-time moments — one of the most beloved and sought-after series among fans of all ages.",
            "The Bath Series takes the signature Smiski charm and places it squarely in the most unexpected location — the bathroom. Each figure in this series depicts Smiski in a bath-related pose, from soaking in a tiny tub to wrapping up in a towel or scrubbing away with a loofah.",
            "What makes the Bath Series so special is the combination of humor and cuteness. Seeing a tiny glowing figure sitting in a miniature bathtub or shyly peeking out from under a towel brings an instant smile, and collectors love placing these figures in their actual bathrooms for a fun surprise.",
            "The series consists of six standard figures and one secret rare figure. The secret figure — widely regarded as the most charming in the lineup — has a noticeably lower pull rate, making it the crown jewel for anyone trying to complete the set.",
            "The Bath Series has been rereleased multiple times due to its popularity, making it more accessible than some of the rarer themed series. However, the secret figure remains difficult to find, and complete sets in good condition command premium prices in the secondary market.",
            "Whether you display them in your bathroom, on a shelf, or in a diorama with tiny bath accessories, the Bath Series figures bring a unique kind of warmth and whimsy to any collection. It is easy to see why this series consistently ranks among the top favorites in the Smiski community.",
        ],
        paragraphs: 6,
        preview: "Adorable Smiskis caught in bath-time moments — one of the most beloved and sought-after series among fans of all ages.",
        isFeatured: true,
        isActive: true,
    },
    {
        slug: "smiski-desk-series",
        title: "Smiski Desk Series: Your Tiny Workspace Companion",
        imageUrl: "",
        content: [
            "Smiskis hiding around your workspace — great companions for your desk, shelves, and study corners that bring a little magic to your everyday routine.",
            "The Desk Series was designed with students, remote workers, and anyone who spends long hours at a desk in mind. Each figure depicts Smiski tucked into a desk-related scenario — hiding behind a stack of books, peeking out from a pencil cup, napping on a tiny keyboard, or sitting beside a miniature lamp.",
            "The appeal of the Desk Series is how naturally these figures blend into a real workspace. Place one beside your monitor and it feels like a tiny companion quietly keeping you company through long study sessions or late-night work. Their soft glow is especially comforting in a dimly lit room.",
            "Like other Smiski series, the Desk Series comes in blind boxes with six standard figures and one secret rare. The secret figure in this series is particularly popular among collectors who work from home, as it depicts Smiski in an especially relatable and endearing pose.",
            "The Desk Series makes an excellent gift for students, creatives, and professionals. It is practical in the sense that the figures genuinely look at home on a desk or bookshelf, and the glow-in-the-dark feature adds a subtle, magical touch to any workspace after the lights go out.",
            "If you spend a lot of time at your desk, the Desk Series is a must-have. These tiny figures have a way of making even the most mundane work sessions feel a little more whimsical — and on the hardest days, catching a glimpse of a tiny glowing Smiski peeking out from behind your notebook is enough to bring a smile.",
        ],
        paragraphs: 6,
        preview: "Smiskis hiding around your workspace — great companions for your desk, shelves, and study corners that bring a little magic to your everyday routine.",
        isFeatured: true,
        isActive: true,
    },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        await User.deleteMany({});
        console.log('Existing users cleared.');

        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
            }))
        );
        await User.insertMany(hashedUsers);
        console.log(`${hashedUsers.length} users seeded.`);

        await Article.deleteMany({});
        console.log('Existing articles cleared.');

        await Article.insertMany(articles);
        console.log(`${articles.length} articles seeded.`);

        console.log('\n Seed complete! You can now log in with:');
        console.log('   Admin:  alicia.reyes@smiski.com / Alicia123!');
        console.log('   Editor: bianca.cruz@smiski.com  / Bianca123!');

    } catch (error) {
        console.error('Seed failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seed();
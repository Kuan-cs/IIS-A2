const categories = [
    "Travel",
    "Pets",
    "Music",
    "Food",
    "Sports",
    "Technology",
    "Gaming",
    "Fashion"
];

const postData = {
    Travel: [
        [
            "Beautiful Places Around the World",
            "Discover interesting destinations and travel experiences.",
            "🌍",
            "A memorable trip does not need a packed itinerary. Explore a neighbourhood on foot, visit a local market and leave time to enjoy the scenery. Compare transport options and choose a destination that fits your budget."
        ],
        [
            "A Weekend in the Mountains",
            "Enjoy mountain views and outdoor adventures.",
            "🏔️",
            "A mountain weekend can combine gentle walking and scenic viewpoints. Check local conditions before leaving, carry water and choose a route suited to your experience. Leave enough time to return before dark."
        ],
        [
            "Exploring Ancient Cities",
            "Discover historical buildings and different cultures.",
            "🏛️",
            "Historic cities reveal their past through streets, public squares and buildings. Start with a walk around the older district and look for architectural details. A museum can provide context for what you see."
        ],
        [
            "Relaxing Beach Destinations",
            "Explore beautiful beaches and coastal scenery.",
            "🏖️",
            "Coastal walks offer a quieter alternative to crowded beaches. Check local tide information and follow safety signs. Bring suitable footwear and take time to enjoy the scenery."
        ],
        [
            "Travelling by Train",
            "Discover scenic railway journeys.",
            "🚆",
            "Train journeys offer opportunities to enjoy changing landscapes without driving. Planning connections in advance can make travelling easier. Consider stopping in smaller towns along the route."
        ],
        [
            "A Guide to Solo Travel",
            "Explore the advantages of travelling alone.",
            "🎒",
            "Solo travel allows you to explore at your own pace. Research your accommodation and transport options before leaving. Keep your plans flexible while allowing enough time for rest."
        ]
    ],

    Pets: [
        [
            "Funny Cat Moments",
            "Enjoy funny and adorable cat behaviour.",
            "🐱",
            "Cats often turn ordinary objects into toys. A cardboard box or a moving shadow can hold their attention for a surprisingly long time. Give cats safe opportunities to play at their own pace."
        ],
        [
            "Dogs Learning New Tricks",
            "Discover how dogs practise simple tricks.",
            "🐶",
            "Dogs can learn simple tricks through short and rewarding practice sessions. Start with a familiar command and reward a successful response. Stop when the dog loses interest."
        ],
        [
            "Playful Puppies",
            "Enjoy adorable moments with playful puppies.",
            "🐕",
            "Puppies explore unfamiliar surroundings through play. Short activities and regular rest help them stay comfortable. Choose safe toys and supervise interactions with other animals."
        ],
        [
            "Understanding Rabbit Behaviour",
            "Learn about the everyday behaviour of rabbits.",
            "🐰",
            "Rabbits communicate through movement, posture and behaviour. They need suitable space to explore and places where they can feel secure. Observe their behaviour without forcing interaction."
        ],
        [
            "Creating a Comfortable Aquarium",
            "Discover ideas for maintaining a fish tank.",
            "🐠",
            "A comfortable aquarium requires suitable water conditions, sufficient space and appropriate equipment. Research the needs of each species before introducing fish into a new environment."
        ],
        [
            "Living with a Pet Bird",
            "Explore the everyday needs of pet birds.",
            "🦜",
            "Pet birds benefit from suitable surroundings, regular activity and appropriate social interaction. Owners should understand the needs of their particular species and provide a safe environment."
        ]
    ],

    Music: [
        [
            "New Music Discoveries",
            "Explore different songs and new artists.",
            "🎵",
            "Discovering music outside your usual playlist can introduce new styles and artists. Try listening to a complete album and notice the instruments and rhythms that stand out."
        ],
        [
            "Relaxing Music Playlist",
            "Find music for studying and everyday life.",
            "🎧",
            "A study playlist can include quiet instrumental tracks with relatively consistent volume. Experiment with different styles and notice whether they help concentration. Silence may work better for some tasks."
        ],
        [
            "Live Concert Experience",
            "Explore memorable moments from live performances.",
            "🎸",
            "A live performance offers a different experience from a recording. Pay attention to how musicians interact with the audience and adapt familiar songs."
        ],
        [
            "Discover Jazz Music",
            "Explore improvisation and jazz performances.",
            "🎷",
            "Jazz often uses improvisation and interaction between musicians. Listen for recurring melodies and changes in rhythm. Small ensembles make individual instruments easier to identify."
        ],
        [
            "Learning to Play the Piano",
            "Discover simple ways to practise piano.",
            "🎹",
            "Learning piano involves developing coordination and understanding musical patterns. Short and regular practice sessions can help beginners build confidence. Start with simple melodies before attempting difficult pieces."
        ],
        [
            "The World of Electronic Music",
            "Explore electronic sounds and music production.",
            "🎛️",
            "Electronic music uses synthesisers, samples and digital production tools. Producers combine different sounds to create rhythm and atmosphere. Experimenting with sound can reveal how musical arrangements are constructed."
        ]
    ],

    Food: [
        [
            "Easy Cooking Ideas",
            "Discover simple recipes for everyday meals.",
            "🍜",
            "A vegetable noodle bowl is an easy starting point. Prepare vegetables, cook noodles and combine them with a sauce of your choice. Adjust the seasoning gradually."
        ],
        [
            "Street Food Around the World",
            "Explore different street food cultures.",
            "🍔",
            "Street food reflects local ingredients and everyday cooking traditions. Markets often offer small portions that make it possible to sample several dishes."
        ],
        [
            "Homemade Pizza",
            "Learn simple ways to prepare homemade pizza.",
            "🍕",
            "Homemade pizza can be made with dough, tomato sauce and toppings. Spread the sauce thinly and avoid adding too much moisture. Bake until the base is cooked and the cheese is melted."
        ],
        [
            "Delicious Desserts",
            "Discover creative desserts and sweet treats.",
            "🍰",
            "A simple dessert can combine seasonal fruit with yoghurt or a baked topping. Balance sweetness with acidity and adjust portions to suit the occasion."
        ],
        [
            "Making Coffee at Home",
            "Explore different coffee preparation methods.",
            "☕",
            "Coffee preparation involves choosing beans, controlling the grind size and adjusting the amount of water. Different brewing methods produce different flavours. Experiment with small changes to find your preferred taste."
        ],
        [
            "Simple Breakfast Ideas",
            "Find inspiration for your morning meals.",
            "🥞",
            "Breakfast can be prepared using simple ingredients such as oats, fruit, eggs and bread. Planning ingredients in advance can save time during busy mornings."
        ]
    ],

    Sports: [
        [
            "Exciting Sports Highlights",
            "Discover memorable moments from different sports.",
            "⚽",
            "Sporting highlights often focus on decisive goals, saves and unexpected comebacks. A match can reveal how players coordinate movement and respond to pressure. A single exciting moment may appeal even to someone who rarely follows sport."
        ],
        [
            "Amazing Basketball Moments",
            "Explore exciting basketball highlights.",
            "🏀",
            "Basketball highlights showcase passing, defensive positioning and shooting under pressure. Notice how players create space for teammates rather than focusing only on the final basket."
        ],
        [
            "Tennis Highlights",
            "Discover interesting moments from professional tennis.",
            "🎾",
            "Tennis rallies combine movement, placement and anticipation. Notice how players change direction and vary the speed of their shots. A long rally can be engaging even without following the tournament."
        ],
        [
            "Cycling Adventures",
            "Explore interesting cycling routes.",
            "🚴",
            "Cycling routes vary in distance, terrain and difficulty. Choose a route suited to your ability, check your equipment and follow local road rules."
        ],
        [
            "Understanding Formula Racing",
            "Explore the strategy behind motor racing.",
            "🏎️",
            "Motor racing involves vehicle performance, driver skill and team strategy. Teams consider tyre wear, weather conditions and timing when making decisions during a race."
        ],
        [
            "Getting Started with Badminton",
            "Discover the basic techniques of badminton.",
            "🏸",
            "Badminton combines coordination, movement and anticipation. Beginners can practise serving and returning the shuttle before learning more complex techniques."
        ]
    ],

    Technology: [
        [
            "How Artificial Intelligence Works",
            "Explore basic concepts behind intelligent systems.",
            "🤖",
            "Artificial intelligence systems use different approaches to perform tasks that normally require human judgement. Some systems learn patterns from data, while others follow predefined rules. Their outputs may contain errors and should be interpreted carefully."
        ],
        [
            "Building a Personal Computer",
            "Discover the main components of a computer.",
            "🖥️",
            "A personal computer combines a processor, memory, storage and other components. Choosing compatible parts depends on performance requirements, available space and budget."
        ],
        [
            "The Future of Smartphones",
            "Explore developments in mobile technology.",
            "📱",
            "Smartphones combine communication, photography and computing capabilities. Improvements in hardware and software can change how people interact with everyday services."
        ],
        [
            "Understanding Virtual Reality",
            "Discover how virtual environments are created.",
            "🥽",
            "Virtual reality creates interactive digital environments using displays and tracking systems. Applications include entertainment, education and training. Comfortable interaction requires careful attention to movement and feedback."
        ],
        [
            "Introduction to Programming",
            "Explore how software is developed.",
            "💻",
            "Programming involves expressing instructions in a form that computers can execute. Developers break problems into smaller tasks, test their solutions and revise their work when errors occur."
        ],
        [
            "Exploring Smart Home Technology",
            "Discover connected devices for everyday life.",
            "🏠",
            "Smart home devices can automate lighting, temperature and other household functions. Their usefulness depends on reliable connections, understandable controls and appropriate privacy settings."
        ]
    ],

    Gaming: [
        [
            "Exploring Open World Games",
            "Discover interactive virtual environments.",
            "🎮",
            "Open world games allow players to explore environments and choose different activities. Their design often balances freedom with guidance so that players can understand available goals."
        ],
        [
            "Competitive Gaming Strategies",
            "Explore teamwork and decision-making in games.",
            "🏆",
            "Competitive games often reward communication, practice and quick decisions. Reviewing previous matches can help players recognise mistakes and develop better strategies."
        ],
        [
            "The Art of Game Design",
            "Discover how game mechanics are created.",
            "🕹️",
            "Game designers create rules, environments and feedback systems that shape player experiences. Testing helps identify confusing interactions and balance challenges with player abilities."
        ],
        [
            "Puzzle Games and Problem Solving",
            "Explore games that encourage logical thinking.",
            "🧩",
            "Puzzle games present challenges that require observation and experimentation. Clear feedback helps players understand which actions are successful and develop new approaches."
        ],
        [
            "Retro Video Games",
            "Discover classic gaming experiences.",
            "👾",
            "Retro games often use simple graphics and carefully designed mechanics. Their limitations encouraged developers to create distinctive visual styles and memorable challenges."
        ],
        [
            "Playing Games with Friends",
            "Explore cooperative multiplayer experiences.",
            "🤝",
            "Cooperative games encourage players to share responsibilities and communicate. Good multiplayer design makes individual contributions visible while supporting shared objectives."
        ]
    ],

    Fashion: [
        [
            "Everyday Outfit Ideas",
            "Discover simple clothing combinations.",
            "👕",
            "Everyday outfits can be built around comfortable and versatile clothing. Combining neutral colours with different textures allows the same items to suit several occasions."
        ],
        [
            "Choosing a Winter Jacket",
            "Explore practical clothing for colder weather.",
            "🧥",
            "Winter jackets vary in insulation, material and length. Choosing suitable clothing depends on temperature, weather conditions and personal comfort."
        ],
        [
            "Classic Sneaker Styles",
            "Discover different casual footwear designs.",
            "👟",
            "Sneakers combine practical footwear with different visual styles. Comfort, fit and intended use are important considerations when choosing a pair."
        ],
        [
            "Building a Minimal Wardrobe",
            "Explore versatile clothing choices.",
            "👔",
            "A minimal wardrobe focuses on a smaller collection of clothing that works well together. Selecting complementary colours and suitable fits can simplify everyday decisions."
        ],
        [
            "Understanding Clothing Materials",
            "Discover common fabrics and their properties.",
            "🧶",
            "Clothing materials differ in texture, breathability and durability. Cotton, wool and synthetic fabrics offer different advantages depending on the intended use."
        ],
        [
            "Exploring Streetwear",
            "Discover influences on modern casual fashion.",
            "🧢",
            "Streetwear combines influences from music, sport and everyday culture. Its designs often emphasise relaxed silhouettes, distinctive graphics and individual expression."
        ]
    ]
};

let nextPostId = 1;

const posts = categories.flatMap(category =>
    postData[category].map(([title, description, image, content]) => ({
        id: nextPostId++,
        category,
        title,
        description,
        image,
        content
    }))
);
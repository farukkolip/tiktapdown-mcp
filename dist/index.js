#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const zod_1 = require("zod");
const express_1 = __importDefault(require("express"));
// ============================================================
//  DATA
// ============================================================
const NICHES = {
    fitness: {
        label: "Fitness",
        hashtags: ["fitnessmotivation", "workout", "gymtok", "fittok", "homeworkout", "weightloss", "musclebuilding", "cardio", "fitnessgirl", "fitnessjourney", "healthylifestyle", "workoutmotivation", "gym", "bodybuilding", "personaltrainer"],
        tips: [
            "Goal tags (#weightloss, #musclebuilding) outperform method tags (#cardio) — they reach viewers with intent.",
            "Commit to either #gymtok OR #homeworkout, not both. Mixed signals confuse the algorithm.",
            "Use #fitnessmotivation only for emotional peak moments — not routine content.",
        ],
    },
    beauty: {
        label: "Beauty",
        hashtags: ["beautytok", "makeuptutorial", "skincare", "grwm", "makeupartist", "skincareroutine", "glassskin", "cleanbeauty", "beautyreview", "drugstoremakeup", "makeuptransformation", "skintok", "beautyover40", "naturalmakeup", "makeuptips"],
        tips: [
            "#grwm (Get Ready With Me) is the highest-retention beauty format — use it as your anchor.",
            "Pair transformation tags (#makeuptransformation) with routine tags for algorithm breadth.",
            "#skintok has a highly engaged micro-community — great for skincare-specific content.",
        ],
    },
    food: {
        label: "Food",
        hashtags: ["foodtok", "recipe", "cooking", "foodie", "easyrecipe", "mealprep", "whatieatinaday", "tasty", "homecooking", "foodlovers", "quickrecipes", "healthyfood", "asmrfood", "mukbang", "dinnerideas"],
        tips: [
            "#easyrecipe and #quickrecipes filter for high-intent viewers who actually cook.",
            "ASMR food content paired with #asmrfood drives 3x longer watch time.",
            "#whatieatinaday is a strong lifestyle/food crossover tag for account growth.",
        ],
    },
    travel: {
        label: "Travel",
        hashtags: ["traveltok", "travel", "wanderlust", "travelgram", "travelreels", "budgettravel", "solotravel", "travelcouple", "hiddengems", "travellife", "adventure", "digitalnomad", "backpacker", "traveladvice", "travelinspiration"],
        tips: [
            "#hiddengems earns saves — saved content signals high value to the algorithm.",
            "#budgettravel and #solotravel attract highly engaged niche communities.",
            "Destination-specific hashtags outperform generic #travel for SEO discovery.",
        ],
    },
    tech: {
        label: "Tech",
        hashtags: ["techtok", "technology", "techreview", "gadgets", "apple", "android", "coding", "programming", "techlifestyle", "aitools", "chatgpt", "techhacks", "softwareengineer", "techsetup", "productivitytools"],
        tips: [
            "#aitools is the fastest-growing tech tag — huge early-mover opportunity.",
            "#techsetup drives aspirational saves — people save setup content for reference.",
            "Pair #coding with language-specific tags (#python, #javascript) for algorithm precision.",
        ],
    },
    education: {
        label: "Education",
        hashtags: ["learnontiktok", "edutok", "didyouknow", "funfacts", "studytok", "science", "history", "psychologyfacts", "lifelessons", "mindblown", "studywithme", "learning", "knowledge", "factcheck", "educationalcontent"],
        tips: [
            "#learnontiktok and #edutok are TikTok-endorsed education hubs — always include both.",
            "Hook your video with a surprising fact, then use #didyouknow and #mindblown.",
            "#studywithme drives long watch-time sessions — great for boosting account ranking.",
        ],
    },
    finance: {
        label: "Finance",
        hashtags: ["personalfinance", "moneytok", "investing", "financetok", "stockmarket", "budgeting", "financialfreedom", "savingmoney", "passiveincome", "wealthbuilding", "crypto", "daytrading", "sidehustle", "moneyadvice", "financialliteracy"],
        tips: [
            "#sidehustle has extraordinary reach-to-follower conversion — strong CTA opportunity.",
            "#financialliteracy signals educational intent and builds authority faster than broad tags.",
            "Combine #personalfinance + #moneytok as your consistent anchor pair.",
        ],
    },
    fashion: {
        label: "Fashion",
        hashtags: ["fashiontok", "outfitoftheday", "ootd", "styletips", "fashioninspo", "streetstyle", "outfitinspiration", "fashiontrends", "thriftflip", "stylechallenge", "fashionover40", "capsulewardrobe", "sustainablefashion", "fashionreview", "outfitcheck"],
        tips: [
            "#thriftflip is a high-engagement format with built-in transformation payoff.",
            "#capsulewardrobe drives saves — viewers return to reference your content.",
            "#ootd and #outfitoftheday together cover both search and FYP distribution.",
        ],
    },
    lifestyle: {
        label: "Lifestyle",
        hashtags: ["lifestyletok", "dayinmylife", "morningroutine", "selfcare", "productividad", "slowliving", "minimalismlifestyle", "wellbeing", "lifestylegoals", "selfimprovement", "nightroutine", "workfromhome", "adulting", "lifehacks", "positivevibes"],
        tips: [
            "#dayinmylife is the highest-retention lifestyle format — use it for your best content.",
            "#morningroutine and #nightroutine create episodic content that grows followers.",
            "#selfimprovement has strong crossover with finance and education audiences.",
        ],
    },
    gaming: {
        label: "Gaming",
        hashtags: ["gamingtok", "gamertok", "gaming", "gameplay", "gamer", "twitch", "streamer", "esports", "pcgaming", "consolegaming", "gamingsetup", "videogames", "fps", "rpggames", "gamingnews"],
        tips: [
            "#gamingtok and #gamertok are TikTok-native — use both over generic #gaming.",
            "Platform-specific tags (#pcgaming, #consolegaming) attract more loyal sub-audiences.",
            "#gamingsetup is a high-save aspirational format — great for gear showcase content.",
        ],
    },
    motivation: {
        label: "Motivation",
        hashtags: ["motivationtok", "motivation", "inspiration", "mindset", "successmindset", "grindset", "hustle", "growthmindset", "selfmotivation", "dailymotivation", "motivationalquotes", "entrepreneur", "mentalhealthawareness", "positivity", "nevergiveup"],
        tips: [
            "Combine #mindset + #growthmindset for maximum psychology-audience penetration.",
            "#entrepreneur crossover dramatically expands reach beyond pure motivation audience.",
            "Use #motivationtok for FYP + #dailymotivation for search discovery.",
        ],
    },
    business: {
        label: "Business",
        hashtags: ["businesstok", "entrepreneur", "startuplife", "smallbusiness", "businessadvice", "marketing", "ecommerce", "socialmediatips", "contentcreator", "brandbuilding", "businessmindset", "freelance", "digitalmarketing", "saas", "b2b"],
        tips: [
            "#smallbusiness has massive organic reach — TikTok actively promotes small business content.",
            "#saas and #b2b are high-intent, low-competition — strong B2B lead generation tags.",
            "#digitalmarketing crossover reaches both business owners and marketers.",
        ],
    },
    pets: {
        label: "Pets",
        hashtags: ["pettok", "dogsoftiktok", "catsoftiktok", "petlover", "funnypets", "dogmom", "catmom", "petcare", "animalsoftiktok", "dogtraining", "cuteanimals", "petsofinstagram", "bunnytok", "reptiletek", "petadvice"],
        tips: [
            "#dogsoftiktok and #catsoftiktok are two of TikTok's most engaged communities.",
            "#dogtraining content saves extremely well — strong algorithm signal.",
            "Species-specific niche tags (#bunnytok, #reptiletek) unlock dedicated micro-communities.",
        ],
    },
    music: {
        label: "Music",
        hashtags: ["musictok", "musician", "originalmusic", "coversong", "singertok", "producertok", "musicproduction", "guitarplayer", "pianotok", "beatmaker", "indieartist", "newmusic", "musiciansoftiktok", "songwriting", "musicvideo"],
        tips: [
            "#originalmusic tags signal creative ownership — stronger for artist brand building.",
            "#coversong drives discovery — viewers search for specific song covers regularly.",
            "#producertok and #beatmaker have a highly engaged niche with strong creator community.",
        ],
    },
    comedy: {
        label: "Comedy",
        hashtags: ["comedytok", "funny", "funnyvideo", "humor", "memes", "relatable", "skit", "parody", "standup", "comedyskits", "funnymoments", "fail", "adulthumor", "darkhumor", "comedylife"],
        tips: [
            "#relatable is comedy's highest-engagement crossover tag — always include it.",
            "#skit and #parody signal a content format — helps algorithm categorize and distribute.",
            "Keep hooks under 2 seconds for comedy — if they're not laughing in 2s, they've scrolled.",
        ],
    },
};
const BEST_TIMES = {
    US: { slots: [
            { day: "Tuesday", time: "9:00 AM EST", note: "Early morning scrollers before work — high intent audience" },
            { day: "Thursday", time: "12:00 PM EST", note: "Lunch break browsing peak — broad audience" },
            { day: "Friday", time: "5:00 PM EST", note: "End-of-week unwinding — entertainment-hungry viewers" },
            { day: "Saturday", time: "11:00 AM EST", note: "Weekend leisure browsing — longer watch times" },
            { day: "Sunday", time: "7:00 PM EST", note: "Pre-week anxiety scrolling — high engagement" },
        ] },
    GB: { slots: [
            { day: "Tuesday", time: "8:00 AM GMT", note: "Morning commute window — tube & bus browsing" },
            { day: "Thursday", time: "1:00 PM GMT", note: "Lunch hour peak — office workers unwinding" },
            { day: "Friday", time: "6:00 PM GMT", note: "Post-work Friday mood — entertainment-focused" },
            { day: "Saturday", time: "10:00 AM GMT", note: "Weekend morning browse — relaxed audience" },
            { day: "Sunday", time: "8:00 PM GMT", note: "Sunday evening ritual — high retention content" },
        ] },
    AU: { slots: [
            { day: "Tuesday", time: "7:00 AM AEST", note: "Early risers before the heat — commute scroll" },
            { day: "Thursday", time: "12:00 PM AEST", note: "Midday break peak — consistent engagement" },
            { day: "Friday", time: "4:00 PM AEST", note: "Knock-off time — weekend mood begins" },
            { day: "Saturday", time: "9:00 AM AEST", note: "Active weekend mornings — lifestyle content thrives" },
            { day: "Sunday", time: "6:00 PM AEST", note: "Evening — highest Sunday engagement" },
        ] },
    CA: { slots: [
            { day: "Tuesday", time: "9:00 AM EST", note: "EST morning window — cross-timezone reach" },
            { day: "Thursday", time: "12:00 PM EST", note: "National lunch hour — bilingual audience active" },
            { day: "Friday", time: "5:00 PM EST", note: "TGIF post-work scroll — entertainment peaks" },
            { day: "Saturday", time: "10:00 AM EST", note: "Weekend brunch browsing — lifestyle & food content" },
            { day: "Sunday", time: "7:00 PM EST", note: "Family time ends — personal device usage spikes" },
        ] },
    TR: { slots: [
            { day: "Tuesday", time: "9:00 AM TRT", note: "Morning commute — Istanbul metro scroll peak" },
            { day: "Thursday", time: "1:00 PM TRT", note: "Öğle arası — peak lunch browsing" },
            { day: "Friday", time: "8:00 PM TRT", note: "Cuma akşamı — family viewing prime time" },
            { day: "Saturday", time: "11:00 AM TRT", note: "Weekend morning — highest Gen Z activity" },
            { day: "Sunday", time: "9:00 PM TRT", note: "Pazar akşamı — pre-week content binge" },
        ] },
    DE: { slots: [
            { day: "Tuesday", time: "8:00 AM CET", note: "Morning routine scroll — pre-work window" },
            { day: "Thursday", time: "12:00 PM CET", note: "Mittagspause peak — highest weekday lunch traffic" },
            { day: "Friday", time: "6:00 PM CET", note: "Feierabend — post-work relaxation begins" },
            { day: "Saturday", time: "10:00 AM CET", note: "Weekend market/leisure browsing" },
            { day: "Sunday", time: "7:00 PM CET", note: "Sonntagabend — strong pre-week engagement" },
        ] },
    FR: { slots: [
            { day: "Tuesday", time: "8:00 AM CET", note: "Metro scroll — Paris commuter peak" },
            { day: "Wednesday", time: "4:00 PM CET", note: "No school Wednesday — youth audience spike" },
            { day: "Friday", time: "6:00 PM CET", note: "Apéro hour begins — social content thrives" },
            { day: "Saturday", time: "11:00 AM CET", note: "Weekend late-morning browse" },
            { day: "Sunday", time: "8:00 PM CET", note: "Dimanche soir — highest weekend engagement" },
        ] },
    BR: { slots: [
            { day: "Tuesday", time: "9:00 AM BRT", note: "Morning commute — São Paulo metro peak" },
            { day: "Thursday", time: "12:00 PM BRT", note: "Almoço break — highest weekday engagement" },
            { day: "Friday", time: "7:00 PM BRT", note: "Sexta à noite — entertainment-hungry audience" },
            { day: "Saturday", time: "2:00 PM BRT", note: "Weekend afternoon — family relaxation time" },
            { day: "Sunday", time: "8:00 PM BRT", note: "Domingo à noite — pre-week content binge" },
        ] },
    MX: { slots: [
            { day: "Tuesday", time: "9:00 AM CST", note: "Morning routine scroll — pre-work window" },
            { day: "Thursday", time: "2:00 PM CST", note: "Comida peak — extended Mexican lunch break" },
            { day: "Friday", time: "7:00 PM CST", note: "Viernes social — entertainment peak begins" },
            { day: "Saturday", time: "12:00 PM CST", note: "Weekend midday — family & youth audience" },
            { day: "Sunday", time: "9:00 PM CST", note: "Domingo noche — highest weekend engagement" },
        ] },
    JP: { slots: [
            { day: "Tuesday", time: "7:00 AM JST", note: "Densha commute — train browsing peak" },
            { day: "Thursday", time: "12:00 PM JST", note: "Hiruyasumi — lunch break scroll" },
            { day: "Friday", time: "9:00 PM JST", note: "After-work entertainment wind-down" },
            { day: "Saturday", time: "10:00 AM JST", note: "Weekend morning leisure browse" },
            { day: "Sunday", time: "8:00 PM JST", note: "Pre-week Sunday night peak" },
        ] },
    SA: { slots: [
            { day: "Tuesday", time: "10:00 AM AST", note: "Mid-morning peak — post-commute browsing" },
            { day: "Thursday", time: "3:00 PM AST", note: "Afternoon break — pre-weekend mindset" },
            { day: "Friday", time: "9:00 PM AST", note: "Yawm al-Jum'a evening — highest weekly engagement" },
            { day: "Saturday", time: "11:00 AM AST", note: "Weekend morning — youth audience active" },
            { day: "Sunday", time: "8:00 PM AST", note: "Pre-work-week scrolling peak" },
        ] },
    AE: { slots: [
            { day: "Tuesday", time: "9:00 AM GST", note: "Dubai morning rush — metro scroll" },
            { day: "Thursday", time: "1:00 PM GST", note: "Lunch break — multicultural audience peak" },
            { day: "Friday", time: "8:00 PM GST", note: "Yawm al-Jum'a prime time — high engagement" },
            { day: "Saturday", time: "11:00 AM GST", note: "Weekend brunch browsing" },
            { day: "Sunday", time: "9:00 PM GST", note: "Pre-work Monday scroll" },
        ] },
};
const HOOKS = {
    Curiosity: [
        { formula: "Nobody talks about [topic] but it changed everything for me", example: "Nobody talks about mouth taping but it changed my sleep quality forever", tip: "Positions your content as hidden knowledge — triggers FOMO." },
        { formula: "The [adjective] truth about [topic] that [authority] won't tell you", example: "The uncomfortable truth about supplements that influencers won't tell you", tip: "Us-vs-them dynamic drives curiosity and shares." },
        { formula: "I tried [thing] for [duration] — here's what actually happened", example: "I tried cold showers for 30 days — here's what actually happened", tip: "First-person experiments feel authentic and are highly shareable." },
    ],
    Controversy: [
        { formula: "[Popular belief] is a lie. Here's the truth.", example: "8 glasses of water a day is a lie. Here's the truth.", tip: "Challenge a widely-held belief to trigger immediate reactions." },
        { formula: "Unpopular opinion: [contrarian take] (and I have receipts)", example: "Unpopular opinion: journaling is overrated (and I have receipts)", tip: "Label it 'unpopular opinion' so people feel compelled to agree or disagree." },
        { formula: "Why I quit [respected thing] — and I'm not going back", example: "Why I quit going to the gym — and I'm not going back", tip: "Quitting something respected makes viewers defensive and curious." },
    ],
    Relatability: [
        { formula: "POV: You're a [identity] who [relatable situation]", example: "POV: You're a night owl trying to be a morning person", tip: "POV format puts viewers in the scene and builds instant connection." },
        { formula: "Me at [time/age] vs. me after [discovery/change]", example: "Me at 22 vs. me after learning about compound interest", tip: "Before/after framing is universally relatable and sparks aspiration." },
        { formula: "If you [relatable experience], this video is for you", example: "If you overthink every conversation after it happens, this video is for you", tip: "Address your niche pain point directly to filter the perfect audience." },
    ],
    Authority: [
        { formula: "After [large number] [units], here's what I know about [topic]", example: "After 5,000 hours of coaching, here's what I know about motivation", tip: "Large numbers signal deep experience." },
        { formula: "[Number] things [expert role] never tell clients about [topic]", example: "4 things personal trainers never tell clients about fat loss", tip: "Insider secrets trigger fear of missing out." },
        { formula: "I studied [topic] for [duration] so you don't have to", example: "I studied productivity science for 6 months so you don't have to", tip: "Positions you as the researcher — saves the viewer time." },
    ],
    Urgency: [
        { formula: "Stop doing [common action] if you want [desired outcome]", example: "Stop drinking coffee first thing if you want real energy", tip: "Telling people to 'stop' is more compelling than 'start'." },
        { formula: "You have [timeframe] to [action] before [consequence]", example: "You have until December to make this tax move before it's too late", tip: "Hard deadlines activate loss aversion." },
        { formula: "Most people don't know [time-sensitive thing] — watch this now", example: "Most people don't know about this interest rate change — watch this now", tip: "Combine scarcity with authority for maximum urgency." },
    ],
    Story: [
        { formula: "At [low point], I [desperate action]. What happened next changed everything.", example: "At $40k in debt, I sold everything I owned. What happened next changed everything.", tip: "Open with your lowest point to hook viewers emotionally from second one." },
        { formula: "Nobody believed I could [goal]. Here's how I proved them wrong.", example: "Nobody believed I could build a business from my phone. Here's how I proved them wrong.", tip: "Underdog framing earns instant emotional investment." },
        { formula: "This is the story of how [transformation] in [short timeframe]", example: "This is the story of how I lost 30 pounds in 4 months without a gym", tip: "Compressed transformation timelines trigger disbelief that demands watching." },
    ],
    List: [
        { formula: "[Number] [topic] mistakes that are silently [negative consequence]", example: "5 morning routine mistakes that are silently destroying your productivity", tip: "Mistakes perform better than tips — people fear loss more than they desire gain." },
        { formula: "[Number] signs you're [diagnosis] (most people miss #[specific number])", example: "7 signs you're chronically dehydrated (most people miss #4)", tip: "The parenthetical creates curiosity about a specific item." },
        { formula: "[Number] things I wish I knew about [topic] before [experience]", example: "6 things I wish I knew about investing before I turned 30", tip: "Regret framing makes content feel like a gift to the viewer." },
    ],
    Challenge: [
        { formula: "I challenged myself to [extreme action] for [duration] — day [number]", example: "I challenged myself to wake up at 4 AM for 30 days — day 1", tip: "Challenge series create follow-back loops — viewers return for updates." },
        { formula: "Can [simple person] do [expert thing] in [short time]? Watch.", example: "Can a complete beginner learn to code in 7 days? Watch.", tip: "Stakes + skepticism = built-in tension that demands resolution." },
        { formula: "I spent [amount] on [experience]. Was it worth it?", example: "I spent $500 on a personal trainer for one month. Was it worth it?", tip: "Money spent creates instant investment — viewers want to know the verdict." },
    ],
};
// ============================================================
//  SERVER SETUP
// ============================================================
const server = new mcp_js_1.McpServer({
    name: "tiktapdown",
    version: "1.0.0",
});
// ============================================================
//  TOOL 1: Download TikTok Video
// ============================================================
server.tool("download_tiktok_video", "Download a TikTok video without watermark. Returns direct download links (no-watermark + with-watermark), video title, author info, and stats.", {
    url: zod_1.z.string().describe("The TikTok video URL (e.g. https://www.tiktok.com/@user/video/123456789)"),
}, async ({ url }) => {
    if (!url.includes("tiktok.com") && !url.includes("vm.tiktok.com")) {
        return {
            content: [{ type: "text", text: "❌ Invalid URL. Please provide a valid TikTok video link (tiktok.com or vm.tiktok.com)." }],
        };
    }
    try {
        const formData = new URLSearchParams();
        formData.append("url", url);
        formData.append("hd", "1");
        const res = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            },
            body: formData.toString(),
        });
        if (!res.ok)
            throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (data.code !== 0 || !data.data) {
            return {
                content: [{ type: "text", text: `❌ Could not process video: ${data.msg ?? "Unknown error"}` }],
            };
        }
        const v = data.data;
        const result = [
            `✅ TikTok Video Downloaded via TikTapDown`,
            ``,
            `📌 Title: ${v.title || "No title"}`,
            `👤 Author: @${v.author?.unique_id || v.author?.nickname}`,
            `⏱️ Duration: ${v.duration}s`,
            ``,
            `📊 Stats:`,
            `  • Views: ${v.play_count?.toLocaleString() ?? "N/A"}`,
            `  • Likes: ${v.digg_count?.toLocaleString() ?? "N/A"}`,
            `  • Comments: ${v.comment_count?.toLocaleString() ?? "N/A"}`,
            `  • Shares: ${v.share_count?.toLocaleString() ?? "N/A"}`,
            ``,
            `🎵 Music: ${v.music_info?.title} by ${v.music_info?.author}`,
            ``,
            `⬇️ Download Links:`,
            `  • No Watermark (HD): ${v.play}`,
            `  • With Watermark: ${v.wmplay}`,
            ``,
            `🔗 Full toolkit: https://tiktapdown.com`,
        ].join("\n");
        return { content: [{ type: "text", text: result }] };
    }
    catch (err) {
        return {
            content: [{ type: "text", text: `❌ Network error: ${err instanceof Error ? err.message : "Unknown error"}` }],
        };
    }
});
// ============================================================
//  TOOL 2: Get TikTok Hashtags
// ============================================================
server.tool("get_tiktok_hashtags", "Get the top 15 TikTok hashtags for a specific niche, plus 3 expert strategy tips on how to use them effectively.", {
    niche: zod_1.z
        .enum(["fitness", "beauty", "food", "travel", "tech", "education", "finance", "fashion", "lifestyle", "gaming", "motivation", "business", "pets", "music", "comedy"])
        .describe("The content niche to get hashtags for"),
}, async ({ niche }) => {
    const data = NICHES[niche];
    if (!data) {
        return { content: [{ type: "text", text: "❌ Unknown niche." }] };
    }
    const hashtagList = data.hashtags.map((h) => `#${h}`).join("  ");
    const result = [
        `📌 Top 15 TikTok Hashtags — ${data.label}`,
        ``,
        `Copy & paste:`,
        hashtagList,
        ``,
        `💡 Strategy Tips:`,
        ...data.tips.map((t, i) => `${i + 1}. ${t}`),
        ``,
        `🔗 Full hashtag library + strategy guides: https://tiktapdown.com/hashtags/${niche}`,
    ].join("\n");
    return { content: [{ type: "text", text: result }] };
});
// ============================================================
//  TOOL 3: Best Time to Post on TikTok
// ============================================================
server.tool("get_best_time_to_post", "Get the best times to post on TikTok for a specific country, with day-by-day recommendations and the reasoning behind each time slot.", {
    country: zod_1.z
        .enum(["US", "GB", "AU", "CA", "TR", "DE", "FR", "BR", "MX", "JP", "SA", "AE"])
        .describe("Country code (US, GB, AU, CA, TR, DE, FR, BR, MX, JP, SA, AE)"),
}, async ({ country }) => {
    const data = BEST_TIMES[country];
    if (!data) {
        return { content: [{ type: "text", text: "❌ Country not supported yet." }] };
    }
    const countryNames = {
        US: "United States 🇺🇸", GB: "United Kingdom 🇬🇧", AU: "Australia 🇦🇺",
        CA: "Canada 🇨🇦", TR: "Turkey 🇹🇷", DE: "Germany 🇩🇪",
        FR: "France 🇫🇷", BR: "Brazil 🇧🇷", MX: "Mexico 🇲🇽",
        JP: "Japan 🇯🇵", SA: "Saudi Arabia 🇸🇦", AE: "UAE 🇦🇪",
    };
    const result = [
        `⏰ Best Times to Post on TikTok — ${countryNames[country]}`,
        ``,
        ...data.slots.map((s) => `📅 ${s.day} @ ${s.time}\n   → ${s.note}`),
        ``,
        `🔗 Full schedule + weekly breakdown: https://tiktapdown.com/best-time/${country}`,
    ].join("\n");
    return { content: [{ type: "text", text: result }] };
});
// ============================================================
//  TOOL 4: Generate Viral TikTok Hook
// ============================================================
server.tool("generate_tiktok_hook", "Generate proven viral TikTok hook formulas for a specific category. Returns 3 ready-to-use hook templates with examples and tips.", {
    category: zod_1.z
        .enum(["Curiosity", "Controversy", "Relatability", "Authority", "Urgency", "Story", "List", "Challenge"])
        .describe("The hook category/type that fits your content"),
    topic: zod_1.z
        .string()
        .optional()
        .describe("Optional: your specific topic to customize examples (e.g. 'fitness', 'investing', 'cooking')"),
}, async ({ category, topic }) => {
    const hooks = HOOKS[category];
    if (!hooks) {
        return { content: [{ type: "text", text: "❌ Unknown category." }] };
    }
    const result = [
        `⚡ TikTok ${category} Hook Formulas`,
        topic ? `   Topic: ${topic}` : "",
        ``,
        ...hooks.map((h, i) => [
            `${i + 1}. Formula:`,
            `   "${h.formula}"`,
            ``,
            `   Example:`,
            `   "${h.example}"`,
            ``,
            `   💡 ${h.tip}`,
            ``,
        ].join("\n")),
        `🔗 100+ more hooks in 8 categories: https://tiktapdown.com/hooks`,
    ].join("\n");
    return { content: [{ type: "text", text: result }] };
});
// ============================================================
//  DATA: RPM (per niche, USD per 1000 views, US baseline)
// ============================================================
const RPM_NICHES = {
    finance: { label: "Finance & Investing", rpmMin: 4.00, rpmMax: 8.50, why: "High-intent audience making financial decisions. Advertisers pay premium." },
    business: { label: "Business & Entrepreneurship", rpmMin: 3.50, rpmMax: 6.50, why: "B2B and SaaS advertisers have large budgets in this niche." },
    realestate: { label: "Real Estate", rpmMin: 3.00, rpmMax: 6.00, why: "Single transactions involve large sums. Advertisers pay top dollar." },
    tech: { label: "Tech & Software", rpmMin: 2.50, rpmMax: 5.00, why: "Software and SaaS companies compete aggressively for tech-savvy audiences." },
    education: { label: "Education & eLearning", rpmMin: 2.50, rpmMax: 5.00, why: "Course platforms and tutoring services are big spenders." },
    health: { label: "Health & Wellness", rpmMin: 2.00, rpmMax: 4.00, why: "Supplement, insurance, and wellness brand budgets are large." },
    beauty: { label: "Beauty & Skincare", rpmMin: 1.50, rpmMax: 3.50, why: "Massive advertiser competition from beauty brands." },
    fitness: { label: "Fitness & Sports", rpmMin: 1.50, rpmMax: 3.00, why: "Gym equipment, nutrition, and apparel brands keep demand solid." },
    food: { label: "Food & Cooking", rpmMin: 1.50, rpmMax: 3.00, why: "Food delivery and CPG brand advertising keeps RPM healthy." },
    travel: { label: "Travel & Adventure", rpmMin: 1.50, rpmMax: 3.00, why: "Travel bookings are high-value. Airlines and hotels pay well." },
    fashion: { label: "Fashion & Lifestyle", rpmMin: 1.00, rpmMax: 2.50, why: "Large audience but diluted by fast fashion." },
    diy: { label: "DIY & Home Decor", rpmMin: 1.00, rpmMax: 2.50, why: "Home improvement advertisers have seasonal spikes." },
    gaming: { label: "Gaming", rpmMin: 0.80, rpmMax: 2.00, why: "Large audience but advertiser CPMs are lower for entertainment-first content." },
    comedy: { label: "Comedy & Entertainment", rpmMin: 0.80, rpmMax: 1.80, why: "Huge reach but broad targeting lowers per-view value." },
    music: { label: "Music & Dance", rpmMin: 0.70, rpmMax: 1.80, why: "Younger demographic with lower purchasing power." },
    pets: { label: "Pets & Animals", rpmMin: 0.80, rpmMax: 2.00, why: "Pet product companies growing but mid CPM." },
};
const RPM_COUNTRIES = {
    US: { name: "United States 🇺🇸", multiplier: 1.00 },
    GB: { name: "United Kingdom 🇬🇧", multiplier: 0.85 },
    AU: { name: "Australia 🇦🇺", multiplier: 0.80 },
    CA: { name: "Canada 🇨🇦", multiplier: 0.80 },
    DE: { name: "Germany 🇩🇪", multiplier: 0.70 },
    NL: { name: "Netherlands 🇳🇱", multiplier: 0.65 },
    FR: { name: "France 🇫🇷", multiplier: 0.65 },
    SE: { name: "Sweden 🇸🇪", multiplier: 0.60 },
    IT: { name: "Italy 🇮🇹", multiplier: 0.55 },
    ES: { name: "Spain 🇪🇸", multiplier: 0.50 },
    JP: { name: "Japan 🇯🇵", multiplier: 0.50 },
    AE: { name: "UAE 🇦🇪", multiplier: 0.40 },
    SA: { name: "Saudi Arabia 🇸🇦", multiplier: 0.35 },
    MX: { name: "Mexico 🇲🇽", multiplier: 0.30 },
    BR: { name: "Brazil 🇧🇷", multiplier: 0.25 },
    TR: { name: "Turkey 🇹🇷", multiplier: 0.20 },
};
// ============================================================
//  DATA: Unicode font maps (TikTok bio / caption styling)
// ============================================================
function convertFont(text, style) {
    const maps = {
        bold: { upper: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙", lower: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳", digits: "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗" },
        italic: { upper: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍", lower: "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧", digits: "0123456789" },
        boldItalic: { upper: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁", lower: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛", digits: "0123456789" },
        cursive: { upper: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵", lower: "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏", digits: "0123456789" },
        monospace: { upper: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉", lower: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣", digits: "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿" },
        doubleStruck: { upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ", lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫", digits: "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡" },
        fraktur: { upper: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ", lower: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷", digits: "0123456789" },
    };
    const m = maps[style];
    if (!m)
        return text;
    const ascii = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const asciiLow = "abcdefghijklmnopqrstuvwxyz";
    const asciiDig = "0123456789";
    const arr = Array.from(text);
    return arr.map(ch => {
        const u = ascii.indexOf(ch);
        if (u !== -1)
            return Array.from(m.upper)[u] ?? ch;
        const l = asciiLow.indexOf(ch);
        if (l !== -1)
            return Array.from(m.lower)[l] ?? ch;
        const d = asciiDig.indexOf(ch);
        if (d !== -1)
            return Array.from(m.digits)[d] ?? ch;
        return ch;
    }).join("");
}
// ============================================================
//  TOOL 5: Extract TikTok Audio (MP3)
// ============================================================
server.tool("extract_tiktok_audio_mp3", "Extract the audio (MP3) from a TikTok video. Returns the original sound title, artist, and a direct audio download link useful for sound discovery, music analysis, and trend research.", {
    url: zod_1.z.string().describe("The TikTok video URL"),
}, async ({ url }) => {
    if (!url.includes("tiktok.com") && !url.includes("vm.tiktok.com")) {
        return { content: [{ type: "text", text: "❌ Invalid URL. Provide a valid TikTok video link." }] };
    }
    try {
        const formData = new URLSearchParams();
        formData.append("url", url);
        formData.append("hd", "1");
        const res = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            },
            body: formData.toString(),
        });
        if (!res.ok)
            throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (data.code !== 0 || !data.data) {
            return { content: [{ type: "text", text: `❌ Could not extract audio: ${data.msg ?? "Unknown error"}` }] };
        }
        const m = data.data.music_info;
        const result = [
            `🎵 TikTok Audio Extracted via TikTapDown`,
            ``,
            `Title: ${m.title}`,
            `Artist: ${m.author}`,
            `Duration: ${m.duration}s`,
            `Original Sound: ${m.original ? "Yes (creator-made)" : "No (existing track)"}`,
            ``,
            `⬇️ MP3 Download: ${data.data.music}`,
            ``,
            `🔗 Audio extractor in browser: https://tiktapdown.com/tiktok-to-mp3`,
        ].join("\n");
        return { content: [{ type: "text", text: result }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: `❌ Network error: ${err instanceof Error ? err.message : "Unknown"}` }] };
    }
});
// ============================================================
//  TOOL 6: Calculate TikTok RPM (Revenue per 1000 views)
// ============================================================
server.tool("calculate_tiktok_rpm", "Estimate TikTok Creator Rewards revenue for a given niche, audience country, and view count. Returns RPM range, per-video estimate, and monthly projection. Based on 2026 Creator Rewards benchmarks.", {
    niche: zod_1.z.enum(["finance", "business", "realestate", "tech", "education", "health", "beauty", "fitness", "food", "travel", "fashion", "diy", "gaming", "comedy", "music", "pets"]).describe("Content niche"),
    country: zod_1.z.enum(["US", "GB", "AU", "CA", "DE", "NL", "FR", "SE", "IT", "ES", "JP", "AE", "SA", "MX", "BR", "TR"]).describe("Primary audience country"),
    views: zod_1.z.number().int().positive().describe("Total views per video (or campaign)"),
    videosPerMonth: zod_1.z.number().int().positive().optional().describe("Optional: videos per month for monthly projection"),
}, async ({ niche, country, views, videosPerMonth }) => {
    const n = RPM_NICHES[niche];
    const c = RPM_COUNTRIES[country];
    if (!n || !c)
        return { content: [{ type: "text", text: "❌ Unknown niche or country." }] };
    const rpmMin = n.rpmMin * c.multiplier;
    const rpmMax = n.rpmMax * c.multiplier;
    const perVideoMin = (views / 1000) * rpmMin;
    const perVideoMax = (views / 1000) * rpmMax;
    const lines = [
        `💰 TikTok RPM Estimate — ${n.label} in ${c.name}`,
        ``,
        `RPM range: $${rpmMin.toFixed(2)} – $${rpmMax.toFixed(2)} per 1,000 views`,
        `Per video (${views.toLocaleString()} views): $${perVideoMin.toFixed(2)} – $${perVideoMax.toFixed(2)}`,
    ];
    if (videosPerMonth) {
        const monthlyMin = perVideoMin * videosPerMonth;
        const monthlyMax = perVideoMax * videosPerMonth;
        lines.push(`Monthly projection (${videosPerMonth} videos): $${monthlyMin.toFixed(0)} – $${monthlyMax.toFixed(0)}`);
    }
    lines.push(``, `Why this niche pays at this rate:`, `  ${n.why}`, ``, `Note: Country multiplier applied is ${c.multiplier.toFixed(2)}x (US baseline = 1.00x).`, ``, `🔗 Full calculator with charts: https://tiktapdown.com/rpm-calculator`);
    return { content: [{ type: "text", text: lines.join("\n") }] };
});
// ============================================================
//  TOOL 7: Calculate TikTok Engagement Rate
// ============================================================
server.tool("calculate_tiktok_engagement_rate", "Calculate a TikTok video or account engagement rate and benchmark it against tier averages. Inputs are raw counts; output includes ER percentage, tier classification, and improvement tips.", {
    views: zod_1.z.number().int().nonnegative().describe("Total views"),
    likes: zod_1.z.number().int().nonnegative().describe("Total likes"),
    comments: zod_1.z.number().int().nonnegative().describe("Total comments"),
    shares: zod_1.z.number().int().nonnegative().describe("Total shares"),
    saves: zod_1.z.number().int().nonnegative().optional().describe("Optional: saves (TikTok counts these as bookmarks)"),
}, async ({ views, likes, comments, shares, saves }) => {
    if (views === 0)
        return { content: [{ type: "text", text: "❌ Views must be greater than 0." }] };
    const totalEngagement = likes + comments + shares + (saves ?? 0);
    const er = (totalEngagement / views) * 100;
    const tier = er < 3 ? { label: "Below Average", note: "Most TikTok videos sit in this range. Focus on hook quality and the first 3 seconds." } :
        er < 6 ? { label: "Average", note: "Solid baseline. To break out, work on watch-through rate and CTAs." } :
            er < 9 ? { label: "Good", note: "Above the platform average. Algorithm is favoring you. Lean into the format that worked." } :
                er < 12 ? { label: "Great", note: "Top quartile performance. This kind of video usually triggers FYP distribution." } :
                    { label: "Exceptional", note: "Top 5 percent. Document everything you did right and replicate." };
    const lines = [
        `📊 TikTok Engagement Rate`,
        ``,
        `Views: ${views.toLocaleString()}`,
        `Likes: ${likes.toLocaleString()}`,
        `Comments: ${comments.toLocaleString()}`,
        `Shares: ${shares.toLocaleString()}`,
        saves !== undefined ? `Saves: ${saves.toLocaleString()}` : null,
        ``,
        `Engagement rate: ${er.toFixed(2)}%`,
        `Tier: ${tier.label}`,
        ``,
        `What this means: ${tier.note}`,
        ``,
        `Formula: (likes + comments + shares${saves !== undefined ? " + saves" : ""}) / views × 100`,
        ``,
        `🔗 Full calculator with niche benchmarks: https://tiktapdown.com/engagement-calculator`,
    ].filter(Boolean).join("\n");
    return { content: [{ type: "text", text: lines }] };
});
// ============================================================
//  TOOL 8: Convert Text to TikTok Unicode Font
// ============================================================
server.tool("convert_tiktok_unicode_font", "Convert plain text to Unicode font styles for TikTok bios, captions, and on-screen text. Supports bold, italic, boldItalic, cursive, monospace, doubleStruck, and fraktur.", {
    text: zod_1.z.string().min(1).max(280).describe("Text to convert (max 280 characters, like a tweet)"),
    style: zod_1.z.enum(["bold", "italic", "boldItalic", "cursive", "monospace", "doubleStruck", "fraktur"]).describe("Font style to apply"),
}, async ({ text, style }) => {
    const converted = convertFont(text, style);
    const result = [
        `🅰️ TikTok Unicode Font — ${style}`,
        ``,
        `Original: ${text}`,
        `Converted: ${converted}`,
        ``,
        `Copy-paste ready: ${converted}`,
        ``,
        `Tip: Unicode fonts work in TikTok bios, captions, and comment text. They render natively without needing a special keyboard or app.`,
        ``,
        `🔗 Browse all font styles: https://tiktapdown.com/tiktok-font-generator`,
    ].join("\n");
    return { content: [{ type: "text", text: result }] };
});
// ============================================================
//  TOOL 9: Get TikTok Trends by Country (live)
// ============================================================
server.tool("get_tiktok_trends_by_country", "Get the current trending TikTok music, hashtags, and videos for a specific country. Returns a snapshot of what is climbing right now. Data is refreshed daily.", {
    country: zod_1.z.enum(["US", "GB", "AU", "CA", "TR", "DE", "FR", "BR", "MX", "JP", "SA", "AE", "IN", "ID", "ES", "IT"]).describe("Country code"),
}, async ({ country }) => {
    try {
        const res = await fetch(`https://tiktapdown.com/api/trends/${country}`, {
            headers: { "User-Agent": "tiktapdown-mcp/1.2" },
        });
        if (res.ok) {
            const data = await res.json();
            if (data) {
                const blocks = [`📈 TikTok Trends — ${country} (live snapshot)`, ``];
                if (Array.isArray(data.music) && data.music.length > 0) {
                    blocks.push(`🎵 Trending Music:`, ...data.music.slice(0, 10).map((m, i) => `  ${i + 1}. ${m.title} — ${m.author}`), ``);
                }
                if (Array.isArray(data.hashtags) && data.hashtags.length > 0) {
                    blocks.push(`#️⃣ Trending Hashtags:`, ...data.hashtags.slice(0, 10).map((h, i) => `  ${i + 1}. #${h.name}${h.volume ? ` (${h.volume})` : ""}`), ``);
                }
                if (Array.isArray(data.videos) && data.videos.length > 0) {
                    blocks.push(`🎬 Trending Videos:`, ...data.videos.slice(0, 5).map((v, i) => `  ${i + 1}. ${v.title} — @${v.author}`), ``);
                }
                blocks.push(`🔗 Live trends page: https://tiktapdown.com/trends/${country}`);
                return { content: [{ type: "text", text: blocks.join("\n") }] };
            }
        }
    }
    catch {
        // fall through to fallback
    }
    return {
        content: [{
                type: "text",
                text: [
                    `📈 TikTok Trends — ${country}`,
                    ``,
                    `Live trends data is best viewed on the dashboard, which refreshes daily with the climbing music, hashtags, and videos for ${country}:`,
                    ``,
                    `🔗 https://tiktapdown.com/trends/${country}`,
                    ``,
                    `Tip: For sound discovery, focus on items in positions 20–50 with a steep climb arrow — those are the ones that have not saturated yet.`,
                ].join("\n"),
            }],
    };
});
// ============================================================
//  TOOL 10: TikTok Keyword Research (search intent + volume directional)
// ============================================================
server.tool("get_tiktok_keyword_research", "Get TikTok-specific keyword research data: search intent type, suggested related keywords, and content angle ideas. Useful for planning a TikTok content calendar.", {
    keyword: zod_1.z.string().min(2).max(80).describe("Seed keyword to research (e.g. 'meal prep', 'productivity hacks', 'iPhone tips')"),
}, async ({ keyword }) => {
    const k = keyword.trim().toLowerCase();
    // Heuristic intent classification
    const howToSignals = ["how", "how to", "tutorial", "guide", "tips", "hacks", "steps"];
    const reviewSignals = ["best", "review", "vs", "comparison", "worth it"];
    const trendSignals = ["trend", "trending", "viral", "2026", "this week"];
    const lifestyleSignals = ["routine", "day in the life", "what i eat", "grwm", "morning"];
    let intent = "Educational / How-to";
    if (howToSignals.some(s => k.includes(s)))
        intent = "Educational / How-to";
    else if (reviewSignals.some(s => k.includes(s)))
        intent = "Review / Comparison";
    else if (trendSignals.some(s => k.includes(s)))
        intent = "Trend / Hype";
    else if (lifestyleSignals.some(s => k.includes(s)))
        intent = "Lifestyle / Routine";
    const angles = [
        `"${keyword} mistakes nobody talks about"`,
        `"I tested ${keyword} for 30 days — here is what happened"`,
        `"${keyword} vs the alternative everyone is missing"`,
        `"3 things I wish I knew before ${keyword}"`,
        `"Stop doing ${keyword} like this in 2026"`,
    ];
    const related = [
        `${keyword} for beginners`,
        `${keyword} tutorial`,
        `${keyword} tips and tricks`,
        `best ${keyword}`,
        `${keyword} 2026`,
        `${keyword} routine`,
        `${keyword} vs`,
        `${keyword} review`,
    ];
    const result = [
        `🔍 TikTok Keyword Research — "${keyword}"`,
        ``,
        `Search intent: ${intent}`,
        ``,
        `Related keywords to target:`,
        ...related.map(r => `  • ${r}`),
        ``,
        `Content angles that perform on TikTok for this seed:`,
        ...angles.map(a => `  • ${a}`),
        ``,
        `Note: For exact search volume and competition data, use the in-browser tool which queries DataForSEO.`,
        ``,
        `🔗 Live keyword research: https://tiktapdown.com/keywords`,
    ].join("\n");
    return { content: [{ type: "text", text: result }] };
});
// ============================================================
//  START — stdio (local) or HTTP (Railway/remote)
// ============================================================
const isHttp = process.env.PORT !== undefined;
if (isHttp) {
    // HTTP mode for Railway / Smithery
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post("/mcp", async (req, res) => {
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/mcp", async (req, res) => {
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res);
    });
    app.get("/", (_req, res) => {
        res.json({ name: "tiktapdown-mcp", version: "1.0.0", status: "ok" });
    });
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`TikTapDown MCP Server running on HTTP port ${port}`);
    });
}
else {
    // Stdio mode for local Claude Desktop / npx
    (async () => {
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        console.error("TikTapDown MCP Server running on stdio");
    })().catch((err) => { console.error(err); process.exit(1); });
}

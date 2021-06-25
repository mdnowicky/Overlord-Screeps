
global.COMBAT_SERVER = ['shard3', 'shard0', 'shard1', 'shard2']; // Insert the Game.shard.name of servers you'd like to declare everyone hostile
global.HOSTILES = ['NicGibbs', 'static_machine', 'kshshel']; // Manually set players as hostile
global.MANUAL_FRIENDS = ['the_rogue_end_user']; // Manually set players as friends (overrides COMBAT_SERVER)
global.RAMPART_ACCESS = true // Allow friends and allies access thru ramparts
global.NAP_ALLIANCE = []; // Do not attack members of this alliance
global.HOLD_SECTOR = true; // Attack rooms in sectors you have rooms (ignores local sphere)
global.ATTACK_LOCALS = true; // Attacks targets within range of the next entry
global.LOCAL_SPHERE = 2; // Range that rooms consider local via linear distance
global.NEW_SPAWN_DENIAL = true; // Crush new spawns immediately
global.POKE_ATTACKS = true; // Small cheap annoying attacks
global.POKE_NEUTRALS = true; // Poke everyone
global.OFFENSIVE_OPERATIONS = true; // Offensive Combat
global.NCP_HOSTILE = true; // Always attack users of open source bots
global.ATTACK_COOLDOWN = 4500; //Time between attacks on a room

// Signing and whatnot
global.OWNED_ROOM_SIGNS = ["#!"];
global.RESERVE_ROOM_SIGNS = ["KEEP OUT"];
global.EXPLORED_ROOM_SIGNS = ["Exploring new lands.", "We see you.", "We know.", "Intel gathered."];
global.ATTACK_ROOM_SIGNS = ["0wned", "pwned"];
global.EXPLORER_SPAM = ['HI', 'Hello', 'Beep', 'Boop', 'Aloha', 'koneechiwa', 'i smol penis', 'v tiny penis'];

// Wall and rampart target amounts
global.BARRIER_TARGET_HIT_POINTS = {
    1: 1000,
    2: 50000,
    3: 200000,
    4: 450000,
    5: 750000,
    6: 1500000,
    7: 5000000,
    8: 10000000
};

// The boosts you want labs to focus on first (resources permitted)
global.LAB_PRIORITY = [RESOURCE_GHODIUM_ACID, RESOURCE_GHODIUM_HYDRIDE, RESOURCE_GHODIUM, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_LEMERGIUM_ACID];
// If credits permit, buy these boosts
global.BUY_THESE_BOOSTS = [RESOURCE_GHODIUM_ACID, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_LEMERGIUM_ACID];

// Amount targets (Advanced)
global.PIXEL_BUFFER = 500; // Sell any pixels above this amount
global.BUY_ENERGY = true; // If true it will buy energy at anything below the baseline energy price if a room isn't considered in surplus
global.CREDIT_BUFFER = 10000; // Stay above
global.ENERGY_AMOUNT = (TERMINAL_CAPACITY * 0.1 + STORAGE_CAPACITY * 0.1); // Aim for this amount in a room
global.FACTORY_CUTOFF = ENERGY_AMOUNT * 0.5; // Amount needed for a factory to be active
global.MINERAL_TRADE_AMOUNT = (TERMINAL_CAPACITY * 0.015 + STORAGE_CAPACITY * 0.015);  // Hold this much of a mineral before selling
global.BOOST_TRADE_AMOUNT = (TERMINAL_CAPACITY * 0.01 + STORAGE_CAPACITY * 0.01);  // Hold this much of a mineral before selling
global.TERMINAL_ENERGY_BUFFER = 10000; // Keep this much in terminal (Needed for trade)
global.REACTION_AMOUNT = (TERMINAL_CAPACITY * 0.005 + STORAGE_CAPACITY * 0.005); // Minimum amount for base reaction minerals and power
global.BOOST_AMOUNT = (TERMINAL_CAPACITY * 0.005 + STORAGE_CAPACITY * 0.005); // Try to have this much of all applicable boosts
global.DUMP_AMOUNT = TERMINAL_CAPACITY * 0.1; // Fills buys (of if overflowing it will offload to other terminals)

// Baseline/Default prices
global.ENERGY_MARKET_BASELINE = 0.010;
global.COMMODITY_MARKET_BASELINE = 0.020;
global.TIER_3_MARKET_BASELINE = 2.250;
global.TIER_2_MARKET_BASELINE = 1.250;
global.TIER_1_MARKET_BASELINE = 0.750;
global.BASE_COMPOUNDS_MARKET_BASELINE = 0.350;
global.GHODIUM_MARKET_BASELINE = 1.100;
global.BASE_MINERALS_MARKET_BASELINE = 0.100;

// Room stuff
global.BUILD_PRAISE_ROOMS = false;

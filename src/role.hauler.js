/*
 * Copyright (c) 2020.
 * Github - Shibdib
 * Name - Bob Sardinia
 * Project - Overlord-Bot (Screeps)
 */

module.exports.role = function (creep) {
    creep.say(ICONS.haul, true);
    if (creep.towTruck()) return true;
    // If hauling do things
    if (creep.store[RESOURCE_ENERGY]) {
        if (!_.sum(creep.store)) return creep.memory.hauling = undefined;
        creep.haulerDelivery();
        // Perform opportunistic filling
        creep.opportunisticFill();
    } else if (creep.memory.energyDestination || creep.locateEnergy()) {
        creep.withdrawResource()
    } else {
        creep.idleFor(10)
    }
};
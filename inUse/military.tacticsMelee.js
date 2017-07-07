/**
 * Created by Bob on 7/2/2017.
 */
let borderChecks = require('module.borderChecks');
let militaryFunctions = require('module.militaryFunctions');
const profiler = require('screeps-profiler');

let doNotAggress = RawMemory.segments[2];

meleeTeamLeader = function () {
    let squadLeader = _.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.squadLeader === true);
    let rangedLeader = _.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.rangedLeader === true);
    let siege = _.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.siegeComplete === true);
    let healers = _.filter(Game.creeps, (h) => h.memory.role === 'healer');
    let hostiles = this.room.find(FIND_CREEPS, {filter: (c) => c.pos.y < 47 && c.pos.y > 3 && c.pos.x < 47 && c.pos.y > 3 && _.includes(RawMemory.segments[2], c.owner['username']) === false});
    let armedHostile = _.filter(hostiles, (e) => (e.getActiveBodyparts(ATTACK) >= 1 || e.getActiveBodyparts(RANGED_ATTACK) >= 1) && _.includes(RawMemory.segments[2], e.owner['username']) === false);
    let inRangeHostile = this.pos.findInRange(hostiles, 1);
    let inRangeArmed = this.pos.findInRange(armedHostile, 1);
    let closestArmed;
    let closestHostile;
    closestArmed = this.pos.findClosestByPath(armedHostile);
    closestHostile = this.pos.findClosestByPath(hostiles);
    let nearbyHealers = this.pos.findInRange(healers, 5);
    let farHealers = this.pos.findInRange(healers, 15);
    let needsHeals = this.pos.findInRange(FIND_CREEPS, 3, {filter: (c) => c.hits < c.hitsMax && _.includes(RawMemory.segments[2], c.owner['username']) === true});

    //Retreat if wounded
    if (this.getActiveBodyparts(TOUGH) === 0) {
        this.heal(this);
        if (nearbyHealers.length > 0) {
            this.travelTo(nearbyHealers[0], {allowHostile: false, movingTarget: true});
            return null;
        } else if (squadLeader.length > 0) {
            this.travelTo(squadLeader[0], {allowHostile: false, movingTarget: true});
            return null;
        } else if (farHealers.length > 0) {
            this.travelTo(farHealers[0], {allowHostile: false, movingTarget: true});
            return null;
        } else {
            this.retreat();
        }
    }
    if (this.hits < this.hitsMax) {
        this.heal(this);
    } else
    if (needsHeals.length > 0) {
        this.rangedHeal(needsHeals[0]);
    }
    if (this.memory.meleeLeader === true) {
        let weakPoint = _.min(this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 10, {filter: (s) => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) && _.includes(RawMemory.segments[2], s.owner['username']) === false}), 'hits');
        //Check if safe mode
        if (this.room.controller && this.room.controller.owner && _.includes(RawMemory.segments[2], this.room.controller.owner['username']) === false && this.room.controller.safeMode) {
            this.memory.attackStarted = 'safe';
            Memory.warControl[this.memory.attackTarget] = undefined;
            Memory.militaryNeeds[this.memory.attackTarget] = undefined;
            this.travelTo(new RoomPosition(25, 25, this.memory.staging), {range: 15});
        }
        if (closestArmed || closestHostile) {
            this.memory.inCombat = true;
            borderChecks.borderCheck(this);
            if (closestArmed) {
                this.memory.meleeTarget = closestArmed.id;
                if (closestArmed.getActiveBodyparts(ATTACK) > 0) {
                    if (this.attack(closestArmed) === ERR_NOT_IN_RANGE) {
                        this.travelTo(closestArmed, {movingTarget: true});
                    }
                    if (inRangeArmed.length > 1) {
                        this.rangedMassAttack();
                    } else {
                        this.rangedAttack(closestArmed);
                    }
                } else if (this.pos.getRangeTo(closestArmed) <= 3){
                    this.kite(5);
                } else if (rangedLeader[0]) {
                    this.travelTo(rangedLeader[0], {movingTarget: true});
                }
            } else if (closestHostile) {
                this.memory.meleeTarget = closestHostile.id;
                if (this.attack(closestHostile) === ERR_NOT_IN_RANGE) {
                    this.travelTo(closestHostile, {movingTarget: true});
                }
                if (inRangeHostile.length > 1) {
                    this.rangedMassAttack();
                } else {
                    this.rangedAttack(closestHostile);
                }
            }
        } else if (squadLeader[0]) {
            this.memory.inCombat = undefined;
            if (this.pos.getRangeTo(squadLeader[0]) > 6) {
                if (this.room.name !== squadLeader[0].pos.roomName) {
                    this.travelTo(squadLeader[0], {allowHostile: false});
                } else {
                    this.travelTo(squadLeader[0], {allowHostile: false, movingTarget: true});
                }
            }
        } else if (weakPoint && this.pos.getRangeTo(weakPoint) <= 2) {
            this.memory.inCombat = undefined;
            this.attack(weakPoint);
            this.rangedAttack(weakPoint);
        } else if (this.memory.attackStarted !== true) {
            this.memory.meleeTarget = undefined;
            this.travelTo(new RoomPosition(25, 25, this.memory.staging), {range: 15});
            if (this.memory.attackTarget) {
                let nearbyAttackers = this.pos.findInRange(_.filter(Game.creeps, (a) => a.memory.attackTarget === this.memory.attackTarget && a.memory.role === 'attacker'), 35);
                let nearbyHealers = this.pos.findInRange(_.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.role === 'healer'), 35);
                let nearbyRanged = this.pos.findInRange(_.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.role === 'ranged'), 35);
                let nearbyDeconstructors = this.pos.findInRange(_.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.role === 'deconstructor'), 35);
                if ((nearbyRanged.length >= this.memory.waitForRanged && nearbyAttackers.length >= this.memory.waitForAttackers && nearbyHealers.length >= this.memory.waitForHealers && nearbyDeconstructors.length >= this.memory.waitForDeconstructor) || this.memory.attackType === 'raid') {
                    this.memory.attackStarted = true;
                }
            }
        } else if (this.memory.attackType === 'raid' || siege.length > 0) {
            this.travelTo(new RoomPosition(25, 25, this.memory.attackTarget), {range: 12});
        } else if (this.memory.attackType !== 'siege' || siege.length > 0) {
            this.travelTo(new RoomPosition(25, 25, this.memory.attackTarget), {range: 24});
        } else if (this.memory.attackType === 'siege') {
            this.travelTo(new RoomPosition(25, 25, this.memory.siegePoint), {range: 15});
        }
    }
};
Creep.prototype.meleeTeamLeader = profiler.registerFN(meleeTeamLeader, 'meleeTeamLeaderTactic');

meleeTeamMember = function () {
    let squadLeader = _.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.squadLeader === true);
    let meleeLeader = _.filter(Game.creeps, (h) => h.memory.attackTarget === this.memory.attackTarget && h.memory.meleeLeader === true);
    let healers = _.filter(Game.creeps, (h) => h.memory.role === 'healer');
    let hostiles = this.room.find(FIND_CREEPS, {filter: (c) => c.pos.y < 47 && c.pos.y > 3 && c.pos.x < 47 && c.pos.y > 3 && _.includes(RawMemory.segments[2], c.owner['username']) === false});
    let armedHostile = _.filter(hostiles, (e) => (e.getActiveBodyparts(ATTACK) >= 1 || e.getActiveBodyparts(RANGED_ATTACK) >= 1) && _.includes(RawMemory.segments[2], e.owner['username']) === false);
    let inRangeHostile = this.pos.findInRange(hostiles, 1);
    let inRangeArmed = this.pos.findInRange(armedHostile, 1);
    let closestArmed;
    let closestHostile;
    if (inRangeArmed.length > 0) {
        closestArmed = this.pos.findClosestByPath(inRangeArmed);
    }
    if (inRangeHostile.length > 0) {
        closestHostile = this.pos.findClosestByPath(inRangeHostile);
    }
    let nearbyHealers = this.pos.findInRange(healers, 5);
    let farHealers = this.pos.findInRange(healers, 15);
    let needsHeals = this.pos.findInRange(FIND_CREEPS, 3, {filter: (c) => c.hits < c.hitsMax && _.includes(RawMemory.segments[2], c.owner['username']) === true});

    //Retreat if wounded
    if (this.hits < this.hitsMax * 0.75) {
        this.heal(this);
        if (inRangeArmed.length > 1) {
            this.rangedMassAttack();
        } else if (inRangeArmed.length === 1) {
            this.rangedAttack(inRangeArmed[0]);
        }
        if (nearbyHealers.length > 0) {
            this.travelTo(nearbyHealers[0], {allowHostile: false, movingTarget: true});
            return null;
        } else if (squadLeader.length > 0) {
            this.travelTo(squadLeader[0], {allowHostile: false, movingTarget: true});
            return null;
        } else if (farHealers.length > 0) {
            this.travelTo(farHealers[0], {allowHostile: false, movingTarget: true});
            return null;
        } else {
            militaryFunctions.retreat(this);
        }
    } else if (this.hits < this.hitsMax) {
        this.heal(this);
    } else if (needsHeals.length > 0) {
        this.rangedHeal(needsHeals[0])
    }
    if (meleeLeader[0]) {
        if (this.pos.getRangeTo(meleeLeader[0]) > 4) {
            if (this.room.name !== meleeLeader[0].pos.roomName) {
                this.travelTo(meleeLeader[0], {allowHostile: false});
            } else {
                this.travelTo(meleeLeader[0], {allowHostile: false, movingTarget: true});
            }
        }
    } else if ((closestArmed || closestHostile) && (this.pos.getRangeTo(closestArmed) < 5 || this.pos.getRangeTo(closestHostile) < 5)) {
        borderChecks.borderCheck(this);
        if (closestArmed) {
            this.memory.meleeTarget = closestArmed.id;
            if (closestArmed.getActiveBodyparts(ATTACK) > 0) {
                if (this.attack(closestArmed) === ERR_NOT_IN_RANGE) {
                    this.travelTo(closestArmed, {movingTarget: true});
                }
                if (inRangeArmed.length > 1) {
                    this.rangedMassAttack();
                } else {
                    this.rangedAttack(closestArmed);
                }
            } else {
                this.kite(5);
            }
        } else if (closestHostile) {
            this.memory.meleeTarget = closestHostile.id;
            this.attack(closestHostile);
            this.travelTo(closestHostile, {movingTarget: true});
            if (inRangeHostile.length > 1) {
                this.rangedMassAttack();
            } else {
                this.rangedAttack(closestHostile);
            }
        }
    } else if (meleeLeader[0].memory.meleeTarget) {
        if (this.attack(Game.getObjectById(meleeLeader[0].memory.meleeTarget)) === ERR_NOT_IN_RANGE) {
            this.travelTo(Game.getObjectById(meleeLeader[0].memory.meleeTarget))
        }
        if (needsHeals.length > 0) {
            this.rangedHeal(needsHeals[0])
        }
    }
};
Creep.prototype.meleeTeamMember = profiler.registerFN(meleeTeamMember, 'meleeTeamMemberTactic');
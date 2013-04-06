/*
 * This file was AUTOMATICALLY generated from an ALPACA description.
 * EDIT AT YOUR OWN RISK!
 */


function in_nbhd_pred(pf, x, y, pred, nbhd) {
  var count = 0;
  for (var i = 0; i < nbhd.length; i++) {
    if (pred(pf.get(x+nbhd[i][0], y+nbhd[i][1]))) {
      count++;
    }
  }
  return count;
}

function in_nbhd_eq(pf, x, y, stateId, nbhd) {
  return in_nbhd_pred(pf, x, y, function(x) { return x === stateId; }, nbhd);
}

function evolve_playfield(pf, new_pf) {
  pf.map(new_pf, evalState, -1, -1, 1, 1);
}
function loadMapper(c) {
  if (c === ' ') return 'Space';
  if (c === '#') return 'Wall';
  if (c === ':') return 'Slime';
  if (c === 'S') return 'Food2';
  if (c === 'F') return 'Food';
};
function dumpMapper(s) {
  if (s === 'Space') return ' ';
  if (s === 'Wall') return '#';
  if (s === 'Slime') return ':';
  if (s === 'Food2') return 'S';
  if (s === 'Food') return 'F';
};
function is_Sustainer(st) {
  return (st === 'Food') || (st === 'Food2') || (st === 'Slime') || 0;
}

function evalClass_Sustainer(pf, x, y) {
var id;
return undefined;
}

function eval_Space(pf, x, y) {
var id;
return 'Space';
}

function eval_Wall(pf, x, y) {
var id;
return 'Wall';
}

function eval_Food(pf, x, y) {
var id;
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
return 'Food';
}

function eval_Food2(pf, x, y) {
var id;
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
return 'Food2';
}

function eval_Slime(pf, x, y) {
var id;
if (!((in_nbhd_pred(pf, x, y, is_Sustainer, [[0,-1],[0,1],[-1,0],[1,0]]) >= 2))) {
  return 'Space';
}
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
return 'Slime';
}

function evalState(pf, x, y) {
  var stateId = pf.get(x, y);
  if (stateId === 'Space') return eval_Space(pf, x, y);
  if (stateId === 'Wall') return eval_Wall(pf, x, y);
  if (stateId === 'Food') return eval_Food(pf, x, y);
  if (stateId === 'Food2') return eval_Food2(pf, x, y);
  if (stateId === 'Slime') return eval_Slime(pf, x, y);
}

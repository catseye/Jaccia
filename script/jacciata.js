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
  if (c === '%') return 'Slime';
  if (c === '@') return 'Solved';
  if (c === 'F') return 'Finish';
  if (c === '-') return 'Head';
  if (c === 'S') return 'Start';
  if (c === '?') return 'Body';
};
function dumpMapper(s) {
  if (s === 'Space') return ' ';
  if (s === 'Wall') return '#';
  if (s === 'Slime') return '%';
  if (s === 'Solved') return '@';
  if (s === 'Finish') return 'F';
  if (s === 'Head') return '-';
  if (s === 'Start') return 'S';
  if (s === 'Body') return '?';
};
function is_Sassy(st) {
  return (st === 'Body') || (st === 'Solved') || (st === 'Head') || (st === 'Finish') || (st === 'Start') || 0;
}

function is_Solution(st) {
  return (st === 'Solved') || (st === 'Finish') || 0;
}

function is_Starter(st) {
  return (st === 'Body') || (st === 'Start') || (st === 'Head') || 0;
}

function is_Sustainer(st) {
  return (st === 'Start') || (st === 'Head') || (st === 'Finish') || (st === 'Slime') || 0;
}

function evalClass_Starter(pf, x, y) {
var id;
return undefined;
}

function evalClass_Sustainer(pf, x, y) {
var id;
return undefined;
}

function evalClass_Sassy(pf, x, y) {
var id;
return undefined;
}

function evalClass_Solution(pf, x, y) {
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

function eval_Slime(pf, x, y) {
var id;
if ((!((in_nbhd_pred(pf, x, y, is_Sustainer, [[0,-1],[0,1],[-1,0],[1,0]]) >= 2))||(in_nbhd_eq(pf, x, y, 'Head', [[0,-1],[0,1],[-1,0],[1,0]]) >= 2))) {
  return 'Space';
}
if ((in_nbhd_pred(pf, x, y, is_Starter, [[0,-1],[0,1],[-1,0],[1,0]]) >= 1)) {
  return 'Head';
}
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
return 'Slime';
}

function eval_Head(pf, x, y) {
var id;
if (true) {
  return 'Body';
}
id = evalClass_Starter(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Sassy(pf, x, y);
if (id !== undefined) return id;
return 'Head';
}

function eval_Body(pf, x, y) {
var id;
if ((in_nbhd_pred(pf, x, y, is_Solution, [[0,-1],[0,1],[-1,0],[1,0]]) >= 1)) {
  return 'Solved';
}
if (!((in_nbhd_pred(pf, x, y, is_Sassy, [[0,-1],[0,1],[-1,0],[1,0]]) >= 2))) {
  return 'Space';
}
id = evalClass_Starter(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Sassy(pf, x, y);
if (id !== undefined) return id;
return 'Body';
}

function eval_Solved(pf, x, y) {
var id;
if (!((in_nbhd_pred(pf, x, y, is_Sassy, [[0,-1],[0,1],[-1,0],[1,0]]) >= 2))) {
  return 'Space';
}
id = evalClass_Sassy(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Solution(pf, x, y);
if (id !== undefined) return id;
return 'Solved';
}

function eval_Start(pf, x, y) {
var id;
id = evalClass_Starter(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Sassy(pf, x, y);
if (id !== undefined) return id;
return 'Start';
}

function eval_Finish(pf, x, y) {
var id;
id = evalClass_Sustainer(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Sassy(pf, x, y);
if (id !== undefined) return id;
id = evalClass_Solution(pf, x, y);
if (id !== undefined) return id;
return 'Finish';
}

function evalState(pf, x, y) {
  var stateId = pf.get(x, y);
  if (stateId === 'Space') return eval_Space(pf, x, y);
  if (stateId === 'Wall') return eval_Wall(pf, x, y);
  if (stateId === 'Slime') return eval_Slime(pf, x, y);
  if (stateId === 'Head') return eval_Head(pf, x, y);
  if (stateId === 'Body') return eval_Body(pf, x, y);
  if (stateId === 'Solved') return eval_Solved(pf, x, y);
  if (stateId === 'Start') return eval_Start(pf, x, y);
  if (stateId === 'Finish') return eval_Finish(pf, x, y);
}

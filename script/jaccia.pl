#!/usr/bin/perl
#  - automatically generated from  by:
# alpaca.pl v0.93
# http://catseye.webhop.net/projects/alpaca/
######################################################

use Alpaca qw(true false guess
	      adjacent_state adjacent_class
	      load_playfield display_playfield process_playfield);

sub SustainerClassRules {
  return 0
 };

sub SpaceStateRules {
  return 'Space'
 };

sub WallStateRules {
  return 'Wall'
 };

sub FoodStateRules {
  return SustainerClassRules() || 'Food'
 };

sub Food2StateRules {
  return SustainerClassRules() || 'Food2'
 };

sub SlimeStateRules {
  return 'Space' if ((not ((SustainerClassMember($Playfield->[$x][$y-1]) and SustainerClassMember($Playfield->[$x+1][$y])) or (SustainerClassMember($Playfield->[$x][$y-1]) and SustainerClassMember($Playfield->[$x][$y+1])) or (SustainerClassMember($Playfield->[$x][$y-1]) and SustainerClassMember($Playfield->[$x-1][$y])) or (SustainerClassMember($Playfield->[$x+1][$y]) and SustainerClassMember($Playfield->[$x][$y+1])) or (SustainerClassMember($Playfield->[$x+1][$y]) and SustainerClassMember($Playfield->[$x-1][$y])) or (SustainerClassMember($Playfield->[$x][$y+1]) and SustainerClassMember($Playfield->[$x-1][$y])))));
  return SustainerClassRules() || 'Slime'
 };

sub SustainerClassMember {
  return $_[0] eq 'Food' ||
         $_[0] eq 'Food2' ||
         $_[0] eq 'Slime' ||
         0
};

$Appearance = {
  'Food' => 'F',
  'Food2' => 'S',
  'Slime' => ':',
  'Space' => ' ',
  'Wall' => '#',

};

$InputCodec = {
  'F' => 'Food',
  'S' => 'Food2',
  ':' => 'Slime',
  ' ' => 'Space',
  '#' => 'Wall',

};

$StateRule = {
  'Food' => \&main::FoodStateRules,
  'Food2' => \&main::Food2StateRules,
  'Slime' => \&main::SlimeStateRules,
  'Space' => \&main::SpaceStateRules,
  'Wall' => \&main::WallStateRules,

};

load_playfield($ARGV[0]);

display_playfield();

while (!$done)
{
  process_playfield();
  display_playfield();
}

exit(0);

### END ###

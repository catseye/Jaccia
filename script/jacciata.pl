#!/usr/bin/perl
#  - automatically generated from  by:
# alpaca.pl v0.93
# http://catseye.webhop.net/projects/alpaca/
######################################################

use Alpaca qw(true false guess
	      adjacent_state adjacent_class
	      load_playfield display_playfield process_playfield);

sub StarterClassRules {
  return 0
 };

sub SustainerClassRules {
  return 0
 };

sub SassyClassRules {
  return 0
 };

sub SolutionClassRules {
  return 0
 };

sub SpaceStateRules {
  return 'Space'
 };

sub WallStateRules {
  return 'Wall'
 };

sub SlimeStateRules {
  return 'Space' if ((not ((SustainerClassMember($Playfield->[$x][$y-1]) and SustainerClassMember($Playfield->[$x+1][$y])) or (SustainerClassMember($Playfield->[$x][$y-1]) and SustainerClassMember($Playfield->[$x][$y+1])) or (SustainerClassMember($Playfield->[$x][$y-1]) and SustainerClassMember($Playfield->[$x-1][$y])) or (SustainerClassMember($Playfield->[$x+1][$y]) and SustainerClassMember($Playfield->[$x][$y+1])) or (SustainerClassMember($Playfield->[$x+1][$y]) and SustainerClassMember($Playfield->[$x-1][$y])) or (SustainerClassMember($Playfield->[$x][$y+1]) and SustainerClassMember($Playfield->[$x-1][$y])))) or (($Playfield->[$x][$y-1] eq 'Head' and $Playfield->[$x+1][$y] eq 'Head') or ($Playfield->[$x][$y-1] eq 'Head' and $Playfield->[$x][$y+1] eq 'Head') or ($Playfield->[$x][$y-1] eq 'Head' and $Playfield->[$x-1][$y] eq 'Head') or ($Playfield->[$x+1][$y] eq 'Head' and $Playfield->[$x][$y+1] eq 'Head') or ($Playfield->[$x+1][$y] eq 'Head' and $Playfield->[$x-1][$y] eq 'Head') or ($Playfield->[$x][$y+1] eq 'Head' and $Playfield->[$x-1][$y] eq 'Head')));
  return 'Head' if ((StarterClassMember($Playfield->[$x][$y+1]) or StarterClassMember($Playfield->[$x][$y-1]) or StarterClassMember($Playfield->[$x+1][$y]) or StarterClassMember($Playfield->[$x-1][$y])));
  return SustainerClassRules() || 'Slime'
 };

sub HeadStateRules {
  return 'Body' if (1);
  return StarterClassRules() || SustainerClassRules() || SassyClassRules() || 'Head'
 };

sub BodyStateRules {
  return 'Solved' if ((SolutionClassMember($Playfield->[$x][$y+1]) or SolutionClassMember($Playfield->[$x][$y-1]) or SolutionClassMember($Playfield->[$x+1][$y]) or SolutionClassMember($Playfield->[$x-1][$y])));
  return 'Space' if ((not ((SassyClassMember($Playfield->[$x][$y-1]) and SassyClassMember($Playfield->[$x+1][$y])) or (SassyClassMember($Playfield->[$x][$y-1]) and SassyClassMember($Playfield->[$x][$y+1])) or (SassyClassMember($Playfield->[$x][$y-1]) and SassyClassMember($Playfield->[$x-1][$y])) or (SassyClassMember($Playfield->[$x+1][$y]) and SassyClassMember($Playfield->[$x][$y+1])) or (SassyClassMember($Playfield->[$x+1][$y]) and SassyClassMember($Playfield->[$x-1][$y])) or (SassyClassMember($Playfield->[$x][$y+1]) and SassyClassMember($Playfield->[$x-1][$y])))));
  return StarterClassRules() || SassyClassRules() || 'Body'
 };

sub SolvedStateRules {
  return 'Space' if ((not ((SassyClassMember($Playfield->[$x][$y-1]) and SassyClassMember($Playfield->[$x+1][$y])) or (SassyClassMember($Playfield->[$x][$y-1]) and SassyClassMember($Playfield->[$x][$y+1])) or (SassyClassMember($Playfield->[$x][$y-1]) and SassyClassMember($Playfield->[$x-1][$y])) or (SassyClassMember($Playfield->[$x+1][$y]) and SassyClassMember($Playfield->[$x][$y+1])) or (SassyClassMember($Playfield->[$x+1][$y]) and SassyClassMember($Playfield->[$x-1][$y])) or (SassyClassMember($Playfield->[$x][$y+1]) and SassyClassMember($Playfield->[$x-1][$y])))));
  return SassyClassRules() || SolutionClassRules() || 'Solved'
 };

sub StartStateRules {
  return StarterClassRules() || SustainerClassRules() || SassyClassRules() || 'Start'
 };

sub FinishStateRules {
  return SustainerClassRules() || SassyClassRules() || SolutionClassRules() || 'Finish'
 };

sub SassyClassMember {
  return $_[0] eq 'Head' ||
         $_[0] eq 'Body' ||
         $_[0] eq 'Solved' ||
         $_[0] eq 'Start' ||
         $_[0] eq 'Finish' ||
         0
};

sub SolutionClassMember {
  return $_[0] eq 'Solved' ||
         $_[0] eq 'Finish' ||
         0
};

sub StarterClassMember {
  return $_[0] eq 'Head' ||
         $_[0] eq 'Body' ||
         $_[0] eq 'Start' ||
         0
};

sub SustainerClassMember {
  return $_[0] eq 'Slime' ||
         $_[0] eq 'Head' ||
         $_[0] eq 'Start' ||
         $_[0] eq 'Finish' ||
         0
};

$Appearance = {
  'Body' => '?',
  'Finish' => 'F',
  'Head' => '-',
  'Slime' => '%',
  'Solved' => '@',
  'Space' => ' ',
  'Start' => 'S',
  'Wall' => '#',

};

$InputCodec = {
  '?' => 'Body',
  'F' => 'Finish',
  '-' => 'Head',
  '%' => 'Slime',
  '@' => 'Solved',
  ' ' => 'Space',
  'S' => 'Start',
  '#' => 'Wall',

};

$StateRule = {
  'Body' => \&main::BodyStateRules,
  'Finish' => \&main::FinishStateRules,
  'Head' => \&main::HeadStateRules,
  'Slime' => \&main::SlimeStateRules,
  'Solved' => \&main::SolvedStateRules,
  'Space' => \&main::SpaceStateRules,
  'Start' => \&main::StartStateRules,
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

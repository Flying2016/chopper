#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use Data::Dumper;

open(DATA, "<file.txt") or die "file.txt 文件无法打开, $!";

my $phData = ();
my $num = 0;
my $suitName = 0;
my $index = 0;
my $flag = 0;
my $primaryLabel = ();
my %phTimeInfo = ();

while (my $line = <DATA>) {
    chomp($line);
    if ($line =~ /Executing\s+Test\s+Flow\s+Iteration\s*:\s*(\d+)/) {
        $num = $1;
        print $num."\n";
    }
    elsif ($line =~ /Test Suit Name\s\:\s(.*)/) {
        $suitName = $1;
        $index = 0;
        $flag = 0;
    }
    elsif ($line =~ /Primary Label\s*\s*:(.*)/) {
        $flag = 1;
        $index++;
        $primaryLabel = $1;
    }
    elsif ($line =~ /^--/) {
        $flag = 0;
    }
    if ($flag == 1) {
        if ($line =~ /Upload Time\s+(.*)msec/) {
            $phTimeInfo{$num}->{$suitName}->{$index}->{'uploadtime'} = $1;
        }
        elsif ($line =~ /process time\s+(.*)\s+msec/) {
            $phTimeInfo{$num}->{$suitName}->{$index}->{'processtime'} = $1;
        }
    }
}

print Dumper \%phTimeInfo;

#foreach my $num (sort {$a <=> $b} keys %phTimeInfo) {
#    if ($num != 1) {
#        foreach my $suitName (keys %{phTimeInfo{$num}}) {
#            foreach my $index (sort {$a <=> $b} (keys %{phTimeInfo{$num}->{$suitName}})) {
#                my $upload = $phTimeInfo{$num}->{$suitName}->{'uploadtime'};
#                my $process = $phTimeInfo{$num}->{$suitName}->{'pocesstime'};
#                if (not defined $phData->$suitName->$index) {
#                    $phData->$suitName->{$index}->{'upload'} = $upload;
#                    $phData->$suitName->{$index}->{'process'} = $process;
#                }
#                elsif ($phData->$suitName->$index) {
#                    $phData->$suitName->{$index}->{'upload'} += $upload;
#                    $phData->$suitName->{$index}->{'process'} += $process;
#                }
#            }
#        }
#    }
#}
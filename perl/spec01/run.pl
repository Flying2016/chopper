#!/usr/bin/perl
use warnings;
use strict;
use Data::Dumper;;


my $szFile = "./cindy.txt";
if (not -e $szFile) {
    print "error,the file is not exsit.\n";
}
my $outputfile = "DataTime.csv";
my $FILE_OUT;
my $FILE_IN;
open($FILE_IN, "<$szFile");
open($FILE_OUT, ">$outputfile");

my @lines = ();


unless (open $FILE_IN, $szFile) {
    print "failed to open the File\n";
}

my @avguploadtime = ();
my @avgprocesstime = ();
my $num = 0;
my $index = 0;
my $flag = 0;
my $suiteName = 0;
my $uploadTime = 0;
my $primaryLable = 0;
my %phTimeInfo = ();
my $phData = ();
my @suitnames = ();
while (my $line = <$FILE_IN>) {
    chomp($line);

    if ($line =~ /Executing\s+Test\s+Flow\s+Loop\s+Iteration\s*:\s*(\d+)/) {

        $num = $1;
        #        print $num . "\n";

    }
    elsif ($line =~ /Test Suite Name\s\:\s(.*)/) {

        push @suitnames, $1;
        $index = 0;
        $flag = 0;
        #        print $suiteName . "\n";
    }
    elsif ($line =~ /Primary Label\s*:\s*(.*)/) {
        $flag = 1;
        $index++;
        $primaryLable = $1;
    }
    elsif ($line =~ /^--/) {
        $flag = 0;
    }
    if ($flag == 1) {

        if ($line =~ /upload time\s+(.*)\s+msec/) {

            $phTimeInfo{$num}->{$suiteName}->{$index}->{"UPLOADTIME"} = $1;

        }
        elsif ($line =~ /process time\s+(.*)\s+msec/) {

            $phTimeInfo{$num}->{$suiteName}->{$index}->{"PROCESSTIME"} = $1;

        }
    }
}

#print Dumper \%phTimeInfo;
#exit;
foreach $num (sort {$a <=> $b} keys %phTimeInfo) {
    if ($num != 1) {
        foreach  $suiteName (@suitnames) {
            #            print Dumper \%phTimeInfo;
#            print Dumper \$phTimeInfo{$num};
            print Dumper keys @phTimeInfo{$num}{$suiteName};
            #            print Dumper \$suiteName;
            #            print Dumper \$phTimeInfo{$num}->{$suiteName};

#            foreach $index (sort {$a <=> $b}  (keys ($phTimeInfo{$num}->{$suiteName}))) {
#
#                my $upload = $phTimeInfo{$num}->{$suiteName}->{$index}->{"upload"};
#                my $process = $phTimeInfo{$num}->{$suiteName}->{$index}->{"process"};
#
#                if (not defined $phData->$suiteName->$index) {
#                    $phData->$suiteName->{$index}->{"upload"} = $upload;
#                    $phData->$suiteName->{$index}->{"process"} = $process;
#
#                }
#                elsif ($phData->$suiteName->$index) {
#                    $phData->$suiteName->{$index}->{"upload"} += $upload;
#                    $phData->$suiteName->{$index}->{"process"} += $process;
#                }
#
#            }

        }

    }

}
#print Dumper $phData;



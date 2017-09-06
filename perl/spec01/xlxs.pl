#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use Excel::Writer::XLSX;
use warnings;
use Data::Dumper;

my $workbook = Excel::Writer::XLSX->new( "DataTime.xlsx" );
my $worksheet = $workbook->add_worksheet("upload_processTime");

$format_title = $workbook->add_format();
$format_title->set_bold();
$format_title->set_color( 'black' );
$format_title->set_align( 'right' );

$format = $workbook->add_format();
$format->set_bold(0);
$format->set_color( 'black' );
$format->set_align( 'right' );
$format->set_size(11);

$format_1 = $workbook->add_format();
$format_1->set_bold(0);
$format_1->set_color( 'black' );
$format_1->set_bg_color( 'red' );
$format_1->set_align( 'right' );
$format_1->set_size(11);

my $szFile1 = "./upload_process_time_245_0719";
my $szFile2 = "./upload_process_time_250_0719";

my @version1 = split("_", $szFile1);
print "File 1 version:$version1[3]\n";

my @version2 = split("_", $szFile2);
print "File 2 version:$version2[3]\n";

if (($version1[3] - $version2[3]) <= 0) {
    print "Version Check Done!\n";
}
else {
    my $szfile_temp = $szFile1;
    $szFile1 = $szFile2;
    $szFile2 = $szfile_temp;
    print "Version adjust done\n";
}

if ((not -e $szFile1) && (not -e $szFile2)) {
    print "error,the file is not exsit.\n";
}

our $FILE_IN;
my $FILE_OUT;
my $test_flow_index;
my $isBlock = 0;
my $block_index;
my $result;
my $test_suite_index;
my $outputfile = "DataTime_1.csv";
my $suitname_temp_before;
my $suitname_temp_after;
my @suitname;
my @arr1;
my @arr1_null;
my @arr2;
my $phtimeInfo1;
my $phtimeInfo2;
my %phOuputData1;
my %phOuputData2;
open $FILE_OUT, ">$outputfile" || die "faied to open the file!";

sub DataTime
{
    my ($szFile1) = @_;
    my %phtimeInfo;
    open(FILE_IN, "<$szFile1") || die "faied to open the file!";
    while ($line = <FILE_IN>)
    {
        if ($line =~ /Executing\s+Test\s+Flow\s+Loop\s+Iteration\s*:\s*(\d+)/)
        {
            chomp($line);
            $test_flow_index = $1;
            $test_suite_index = 0;
        }
        elsif ($line =~ /Test Suite Name\s\:\s(.*)/)
        {
            $test_suite_index++;
            $test_suite_name = $1;
            $phtimeInfo{$test_flow_index}->{"index"}->{$test_suite_index} = $test_suite_name;
            $block_index = 0;
        }
        elsif ($line =~ /Primary Label\s*:\s*(.*)/)
        {
            $isBlock = 1;
            $block_index++;
        }
        elsif ($line =~ /^--/)
        {
            $isBlock = 0;
        }
        if ($isBlock == 1)
        {
            if ($line =~ /upload time\s+(.*)\s+msec/)
            {
                $phtimeInfo{$test_flow_index}->{"data"}->{$test_suite_name}->{$block_index}->{"uploadtime"} = $1;
            }
            elsif ($line =~ /process time\s+(.*)\s+msec/)
            {
                $phtimeInfo{$test_flow_index}->{"data"}->{$test_suite_name}->{$block_index}->{"processtime"} = $1;
            }
        }
    }
    if (exists  $phtimeInfo{1}) {
        delete $phtimeInfo{1};
    }
    return %phtimeInfo;
}


sub Dataprocess
{
    my %phOuputData = ();
    my (%phtimeInfo) = @_;
    foreach
    my $test_flow_index;
    (sort {$a <=> $b} keys %phtimeInfo);
    my $phIndexData = $phtimeInfo{$test_flow_index}->{"index"};
    #	print Dumper $phIndexData;
    foreach my $suite_index (sort {$a <=> $b} keys %{$phIndexData})
    {
        my $suite_name = $phIndexData->{$suite_index};
        my $phSuiteData = $phtimeInfo{$test_flow_index}->{"data"}->{$suite_name};
        $phOuputData{$suite_index}->{"name"} = $suite_name;
        foreach my $index (sort {$a <=> $b} keys %{$phSuiteData})
        {
            my $upTime = $phSuiteData->{$index}->{"uploadtime"};
            my $proTime = $phSuiteData->{$index}->{"processtime"};
            if (not defined $phOuputData{$suite_index}->{"data"}->{$index}->{"uploadtime"})
            {
                $phOuputData{$suite_index}->{"data"}->{$index}->{"uploadtime"} = $upTime;
            }
            else {
                my $tempUp = $phOuputData{$suite_index}->{"data"}->{$index}->{"uploadtime"};
                $phOuputData{$suite_index}->{"data"}->{$index}->{"uploadtime"} = $tempUp + $upTime;
            }
            if (not defined $phOuputData{$suite_index}->{"data"}->{$index}->{"processtime"})
            {
                $phOuputData{$suite_index}->{"data"}->{$index}->{"processtime"} = $proTime;
            }
            else {
                my $tempPro = $phOuputData{$suite_index}->{"data"}->{$index}->{"processtime"};
                $phOuputData{$suite_index}->{"data"}->{$index}->{"processtime"} = $tempPro + $proTime;
            }
        }
    }
}
return %phOuputData;
}


%phtimeInfo1 = DataTime($szFile1);
%phtimeInfo2 = DataTime($szFile2);
%phOuputData1 = Dataprocess(%phtimeInfo1);
%phOuputData2 = Dataprocess(%phtimeInfo2);
my $num = keys %phtimeInfo1;
print $num;
my $num_rows = 0;
my $timeName = " ";
my @uptime1 = ();
my @uptime2 = ();
$testname = "TestName,uploadtime,processtime,uploadtime,processtime";
@tn = split(",", $testname);
for ($i = 0; $i < 5; $i++)
{
    $worksheet->write( 0, $i, $tn[$i], $format_title );
}


foreach my $suite_index (sort {$a <=> $b} keys %phOuputData1)
{
    my $suite_name = $phOuputData1{$suite_index}->{"name"};
    foreach my $index(sort {$a <=> $b} keys %{$phOuputData1{$suite_index}->{"data"}}) {
        my $upTime1 = $phOuputData1{$suite_index}->{"data"}->{$index}->{"uploadtime"};
        my $proTime1 = $phOuputData1{$suite_index}->{"data"}->{$index}->{"processtime"};
        if ($upTime1 eq 0)
        {
            delete  $phOuputData1{$suite_index}->{"data"}->{$index};
        }
        else {
            my $avg_up1 = sprintf "%0.3f", ($upTime1 / $num);
            my $avg_pro1 = sprintf "%0.3f", ($proTime1 / $num);
            push(@arr1, "$suite_name,$avg_up1,$avg_pro1");
            push(@arr1_null, " ,$avg_up1,$avg_pro1");
            $num_rows++;
        }
    }
}


#print"@arr1";
foreach my $suite_index (sort {$a <=> $b} keys %phOuputData2)
{
    my $suite_name = $phOuputData2{$suite_index}->{"name"};
    foreach my $index(sort {$a <=> $b} keys %{$phOuputData2{$suite_index}->{"data"}}) {
        my $upTime2 = $phOuputData2{$suite_index}->{"data"}->{$index}->{"uploadtime"};
        my $proTime2 = $phOuputData2{$suite_index}->{"data"}->{$index}->{"processtime"};
        if ($upTime2 eq 0)
        {
            delete  $phOuputData2{$suite_index}->{"data"}->{$index};
        }
        else {
            my $avg_up2 = sprintf "%0.3f", ($upTime2 / $num);
            my $avg_pro2 = sprintf "%0.3f", ($proTime2 / $num);
            push(@arr2, "$avg_up2,$avg_pro2");
        }
    }
}



for ($i = 0; $i < $num_rows; $i++)
{
    if ($i == 0)
    {
        $result = "$arr1[$i],$arr2[$i]\n";
        @suitname = split(",", $result);
        if ((($suitname[1] - $suitname[3]) < 0) || (($suitname[2] - $suitname[4]) < 0))
        {
            for ($j = 0; $j < 5; $j++)
            {
                if (($j eq 1) || ($j eq 3))
                {
                    $worksheet->write( ($i + 1), $j, $suitname[$j], $format_1);
                }
                else {
                    $worksheet->write( ($i + 1), $j, $suitname[$j], $format);
                }
            }
        }
        else
        {
            for ($j = 0; $j < 5; $j++)
            {
                $worksheet->write( 1, $j, $suitname[$j], $format);
            }
        }

        $suitname_temp_after = $suitname[0];
    }
    else
    {
        $result = "$arr1[$i],$arr2[$i]\n";
        @suitname = split(",", $result);
        $suitname_temp_before = $suitname[0];
        if ($suitname_temp_before eq $suitname_temp_after)
        {
            if ((($suitname[1] - $suitname[3]) < 0) || (($suitname[2] - $suitname[4]) < 0))
            {
                for ($j = 1; $j < 5; $j++)
                {
                    if (($j eq 1) || ($j eq 3))
                    {
                        $worksheet->write( ($i + 1), $j, $suitname[$j], $format_1);
                    }
                    else {
                        $worksheet->write( ($i + 1), $j, $suitname[$j], $format);
                    }
                }
            }
            else
            {
                for ($j = 1; $j < 5; $j++)
                {
                    $worksheet->write( ($i + 1), $j, $suitname[$j], $format);
                }
            }
        }
        else
        {
            if ((($suitname[1] - $suitname[3]) < 0) || (($suitname[2] - $suitname[4]) < 0))
            {
                for ($j = 0; $j < 5; $j++)
                {
                    if (($j eq 1) || ($j eq 3))
                    {
                        $worksheet->write( ($i + 1), $j, $suitname[$j], $format_1);
                    }
                    else {
                        $worksheet->write( ($i + 1), $j, $suitname[$j], $format);
                    }
                }
            }
            else
            {
                for ($j = 0; $j < 5; $j++)
                {
                    $worksheet->write( ($i + 1), $j, $suitname[$j], $format);
                }
            }
        }

    }
    @suitname = split(",", $arr1[$i]);
    $suitname_temp_after = $suitname[0];
}

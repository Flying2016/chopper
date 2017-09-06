#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use Cwd;
use Carp;
use Excel::Writer::XLSX;
use Switch;

my @file_RDI;
my @ver;
my @arr_v1_1;
my @arr_v1_128;
my @arr_v2_1;
my @arr_v2_128;
my @radio1;
my @radio2;
my $dir = getcwd;
my $rows;
my $version1 = 0;
my $version2 = 0000;
my $dataflag1 = 0;
my $dataflag2 = 0;
my $divideflag = 0;
open(DATA, "<$dir/RDI_INIT_TEST_ui_report.txt") or die  "File open failed!\n";
while(<DATA>)
{
    push(@file_RDI, $_);
}
# 文件所有行
$rows = @file_RDI;
# 遍历
for (my $i = 0; $i < $rows; $i++)
{
    # 如果是mdri
    if ($file_RDI[$i] =~ mRDI version)
    {
        if ($version1 eq 0)
        {
            @ver = split(" ", $file_RDI[$i]);
            $ver[3] =~ s/\.//g;
            $version1 = $ver[3];
        }
        else
        {
            @ver = split(" ", $file_RDI[$i]);
            $ver[3] =~ s/\.//g;
            $version2 = $ver[3];
            if ($version1 eq $version2)
            {
                $version2 = 0;
            }
        }
    }
    # 如果是这个
    if ($file_RDI[$i] =~ m/Testsuite Nothing_1\: \( \#devices tested: 1,/)
    {
        switch($dataflag1)
        {
            case 0 {
                for (my $j = 0; $j < 4; $j++)
                {
                    my @temp1 = split(" ", $file_RDI[$i + ($j * 6)]);
                    $temp1[8] =~ s/ms//;
                    push(@arr_v1_1, $temp1[8]);
                }
            }
            case 1 {
                for (my $j = 0; $j < 4; $j++)
                {
                    my @temp1 = split(" ", $file_RDI[$i + ($j * 6)]);
                    $temp1[8] =~ s/ms//;
                    push(@arr_v2_1, $temp1[8]);
                }
            }
            else {}
        }
        $dataflag1++;
    }
    # 如果
    if ($file_RDI[$i] =~ m/Testsuite Nothing_1: \( \#devices tested: 12800/)
    {
        switch($dataflag2)
        {
            case 0 {
                for (my $j = 0; $j < 4; $j++)
                {
                    my @temp1 = split(" ", $file_RDI[$i + ($j * 6)]);
                    $temp1[8] =~ s/ms//;
                    push(@arr_v1_128, $temp1[8]);
                }
            }
            case 1 {
                for (my $j = 0; $j < 4; $j++)
                {
                    my @temp1 = split(" ", $file_RDI[$i + ($j * 6)]);
                    $temp1[8] =~ s/ms//;
                    push(@arr_v2_128, $temp1[8]);
                }
            }
            else {}
        }
        $dataflag2++;
    }
}

# 四 循环
for (my $n = 0; $n < 4; $n++)
{
    $radio1[$n] = sprintf "%0.9f", ($arr_v1_128[$n] - $arr_v1_1[$n]) / 127;
    $radio2[$n] = sprintf "%0.9f", ($arr_v2_128[$n] - $arr_v2_1[$n]) / 127;
}
#$single_site_rdi_api_per[$m]= sprintf "%0.2f",($single_site_rdi_api_int[$m]/$single_site_API[$m]*100);

#------------------------------------------

(my $sec, my $min, my $hour, my $mday, my $mon, my $year, my $wday, my $yday, my $isdst) = localtime();

$year = $year + 1900;
$mon++;
if ($mon < 10)
{
    $mon = "0".$mon;
}
if ($mday < 10)
{
    $mday = "0".$mday;
}
my $now_string = $year.$mon.$mday;
print "$now_string\n";
my $name = "RDI_2500_RDI_INIT_Time_Report_".$now_string."_New_format.xlsx";
my $workbook = Excel::Writer::XLSX->new($name) or die "open failed!\n";        # Create a new Excel workbook
my $worksheet = $workbook->add_worksheet("$version1 vs $version2");     # Add a worksheet
my $format_title = $workbook->add_format();
my $format_title_blue = $workbook->add_format();
my $format_title_type = $workbook->add_format();
my $format_font = $workbook->add_format();


$format_title->set_bold(1);
$format_title->set_color( 'black' );
$format_title->set_align( 'left' );
$format_title->set_size(10);
$format_title->set_font('Times New Roman');


$format_title_type->set_bold(1);
$format_title_type->set_color( 'black' );
$format_title_type->set_align( 'center' );
$format_title_type->set_size(10);
$format_title_type->set_font('Times New Roman');
$format_title_blue->set_bold(1);
$format_title_blue->set_color( 'blue' );
$format_title_blue->set_align( 'left' );
$format_title_blue->set_size(10);
$format_title_blue->set_font('Times New Roman');


$format_font->set_bold(0);
$format_font->set_color( 'black' );
$format_font->set_align( 'right' );
$format_font->set_size(9);
$format_font->set_font('Times New Roman');


my $chinese1 = "Nothing_1\(Empty test 1)";
my $chinese2 = "Nothing_2\(Empty test 2)";


$worksheet->write(0, 0, 'SMT:7.4.3.1  Release Mode 128sites Online COE2', $format_title_blue);
$worksheet->write(1, 0, 'Testsuite Name', $format_title);
$worksheet->write(2, 0, $chinese1, $format_title);
$worksheet->write(3, 0, "RDI_INIT_1", $format_title);
$worksheet->write(4, 0, $chinese2, $format_title);
$worksheet->write(5, 0, "RDI_INIT_2", $format_title);
$worksheet->write(6, 0, "RDI_INIT_2-Nothing_2", $format_title);
$worksheet->write(7, 0, "RDI_INIT_$version1-$version2", $format_title_blue);
$worksheet->write(1, 1, " Site 1 Time", $format_title_type);
$worksheet->write(1, 2, "128 sites Total Time/ms", $format_title_type);
$worksheet->write(1, 3, "Site2-128 Per Site Time/ms", $format_title_type);
$worksheet->write(1, 4, " Site 1 Time", $format_title_type);
$worksheet->write(1, 5, "128 sites Total Time/ms", $format_title_type);
$worksheet->write(1, 6, "Site2-128 Per Site Time/ms", $format_title_type);
$worksheet->merge_range( 'B1:D1', "$version1", $format_title_type );
$worksheet->merge_range( 'E1:G1', "$version2", $format_title_type );



for (my $col = 1; $col <= 7; $col++)
{
    for (my $row = 2; $row < 6; $row++)
    {
        if ($col eq 1)
        {
            $worksheet->write($row, $col, $arr_v1_1[$row - 2], $format_font);
        }
        if ($col eq 2)
        {
            $worksheet->write($row, $col, $arr_v1_128[$row - 2], $format_font);
        }
        if ($col eq 3)
        {
            $worksheet->write($row, $col, $radio1[$row - 2], $format_font);
        }
        if ($col eq 4)
        {
            $worksheet->write($row, $col, $arr_v2_1[$row - 2], $format_font);
        }
        if ($col eq 5)
        {
            $worksheet->write($row, $col, $arr_v2_128[$row - 2], $format_font);
        }
        if ($col eq 6)
        {
            $worksheet->write($row, $col, $radio2[$row - 2], $format_font);
        }
    }
}

$worksheet->write('B7', $arr_v1_1[3] - $arr_v1_1[2], $format_font);
$worksheet->write('C7', $arr_v1_128[3] - $arr_v1_128[2], $format_font);
$worksheet->write('E7', $arr_v2_1[3] - $arr_v2_1[2], $format_font);
$worksheet->write('F7', $arr_v2_128[3] - $arr_v2_128[2], $format_font);
$worksheet->write('D7', $radio1[3] - $radio1[2], $format_font);
$worksheet->write('G7', $radio2[3] - $radio2[2], $format_font);
$worksheet->write('B8', ($arr_v1_1[3] - $arr_v1_1[2]) - ($arr_v2_1[3] - $arr_v2_1[2]), $format_font);
$worksheet->write('C8', ($arr_v1_128[3] - $arr_v1_128[2]) - ($arr_v2_128[3] - $arr_v2_128[2]), $format_font);
$worksheet->write('D8', ($radio1[3] - $radio1[2]) - ($radio2[3] - $radio2[2]), $format_font);

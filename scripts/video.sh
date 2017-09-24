#!/usr/bin/env bash
# author : owen-carter

declare engine="ffmpeg"


function installFFMPEG(){
    printf "start install engine ..."
    yum install ffmpeg -y
}

function split(){
    ffmpeg -i input_file -vcodec copy -an output_file_video #分离视频流
    ffmpeg -i input_file -acodec copy -vn output_file_audio
}


function convert2Mp4(){
    ffmpeg -i input.mov -crf 25 out.mp4
}
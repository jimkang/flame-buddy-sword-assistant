#!/bin/bash

root=.

for file in *.ogg

do
    basename="${file%.*}"
    opusdec ${file} ${basename}.wav
    lame ${basename}.wav ${basename}.mp3
done


#!/bin/bash

# use ImageMagick to convert directory of .dds to .png

for file in *.dds
do
    convert "$file" "$(basename "$file" .dds).png"
done

#!/usr/bin/env bash
for font in *.woff2; do
   basename="${font%.woff2}"
   pyftsubset "$font" --unicodes=U+0020-007F,U+00A0-00FF --output-file="$basename-subset.woff2"
   echo "Subsetted $font -> $basename-subset.woff2"
done

#!/bin/sh

found=`find . -type f`

oldFileName="article"
newFileName="supplier"
OldFileName="Article"
NewFileName="Supplier"

sedSingular="s/$oldFileName/$newFileName/g"
sedMajuscul="s/$OldFileName/$NewFileName/g"

echo $sedSingular
echo $sedMajuscul

for thisFile in $found
do
  echo $thisFile
  newName=$(echo $thisFile | sed s/$oldFileName/$newFileName/g)
  sed s/$oldFileName/$newFileName/g $thisFile | sed s/$OldFileName/$NewFileName/g > $newName
done

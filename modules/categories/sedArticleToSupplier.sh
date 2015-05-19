#!/bin/sh

found=`find . -type f`

oldFileName="categories"
OldFileName="Categories"
old="category"
Old=""
newFileName="categories"
NewFileName="Categories"
new="category"
Newm="Category"

sedSingular="s/$oldFileName/$newFileName/g"
sedMajuscul="s/$OldFileName/$NewFileName/g"

echo $sedSingular
echo $sedMajuscul

for thisFile in $found
do
  echo $thisFile
  newName=$(echo $thisFile | sed s/$oldFileName/$newFileName/g)
  sed s/$oldFileName/$newFileName/g $thisFile | sed s/$OldFileName/$NewFileName/g | sed s/$Old/$New/g | sed s/$old/$new/g > $newName
done

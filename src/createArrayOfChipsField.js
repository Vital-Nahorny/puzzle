export default function createArrayOfChipsField(fldSize) {
  const numberOfChips = fldSize ** 2;
  const chipLayout = [...Array(numberOfChips).keys()].map((x) => x + 1);
  let generator = 0;

  while (generator === 0) {
    chipLayout.sort(() => Math.random() - 0.5);
    let emptyRow;
    const emptyChip = chipLayout.indexOf(numberOfChips);
    if (fldSize % 2 !== 0) {
      emptyRow = 0;
    } else {
      if (emptyChip <= (fldSize - 1)) {
        emptyRow = 1;
      } if (emptyChip > (fldSize - 1) && emptyChip <= (fldSize * 2 - 1)) {
        emptyRow = 2;
      } if (emptyChip > (fldSize * 2 - 1) && emptyChip <= (fldSize * 3 - 1)) {
        emptyRow = 3;
      } if (emptyChip > (fldSize * 3 - 1) && emptyChip <= (fldSize * 4 - 1)) {
        emptyRow = 4;
      } if (emptyChip > (fldSize * 4 - 1) && emptyChip <= (fldSize * 5 - 1)) {
        emptyRow = 5;
      } if (emptyChip > (fldSize * 5 - 1) && emptyChip <= (fldSize * 6 - 1)) {
        emptyRow = 6;
      } if (emptyChip > (fldSize * 6 - 1) && emptyChip <= (fldSize * 7 - 1)) {
        emptyRow = 7;
      } if (emptyChip > (fldSize * 7 - 1) && emptyChip <= (fldSize * 8 - 1)) {
        emptyRow = 8;
      }
    }

    let thisSum = 0;

    for (let i = 0; i < 15; i += 1) {
      const val1 = chipLayout[i];
      if (val1 !== 0) {
        for (let j = i + 1; j <= 15; j += 1) {
          const val2 = chipLayout[j];
          if (val1 > val2 && val2 !== 0) {
            thisSum += 1;
          }
        }
      }
    }
    thisSum += emptyRow;
    if (thisSum % 2 === 0) {
      generator = 1;
    }
  }
  return chipLayout;
}

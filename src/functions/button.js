export const computeButtonClassNames = (selected, okCount, totalCount) => {
  const buttonClassNames = [];
  if (selected) {
    buttonClassNames.push('selected-button');
  }
  if (okCount === 0) {
    buttonClassNames.push('group-incomplete-button');
  }
  if (okCount < totalCount) {
    buttonClassNames.push('group-empty-button');
  }
  return buttonClassNames;
};

import React from 'react';
import { computeButtonClassNames } from '../functions/button';
import { EditableItem } from './EditableItem';
import './Brand.css';

export const Brand = ({brand, selectedBrand, brandMap, select, update, remove}) => {
  const brandStats = brandMap[brand._id];
  const okCount = brandStats && brandStats.okCount ? brandStats.okCount : 0;
  const totalCount = brandStats && brandStats.totalCount ? brandStats.totalCount : 0;
  const isSelected = selectedBrand && selectedBrand._id === brand._id;
  const buttonClassNames = computeButtonClassNames(isSelected, okCount, totalCount);
  return (
    <EditableItem
      key={ brand._id }
      initValue={brand.name}
      initEdit={false}
      buttonClassNames={buttonClassNames}
      itemClick={select}
      itemUpdate={update}
      itemRemove={remove}
    />
  );
};

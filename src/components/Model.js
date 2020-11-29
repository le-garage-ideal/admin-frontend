import React from 'react';
import { computeButtonClassNames } from '../functions/button';
import { EditableItem } from './EditableItem';
import './Model.css';

export const Model = ({model, modelMap, selectedModel, select, update, remove}) => {
  const modelStats = modelMap[model._id];
  const okCount = modelStats && modelStats.okCount ? modelStats.okCount : 0;
  const totalCount = modelStats && modelStats.totalCount ? modelStats.totalCount : 0;
  const isSelected = selectedModel && selectedModel._id === model._id;
  const buttonClassNames = computeButtonClassNames(isSelected, okCount, totalCount);
  return (
    <EditableItem
      key={ model._id }
      initValue={model.name}
      initEdit={false}
      buttonClassNames={buttonClassNames}
      itemClick={select}
      itemUpdate={update}
      itemRemove={remove}
    />
  );
};

import React, {useState} from 'react';
import './EditableItem.css';

export const EditableItem = ({initValue, initEdit, buttonClassNames, itemClick, itemUpdate, itemRemove, itemCancel}) => {
  const [edit, setEdit] = useState(initEdit);
  const [value, setValue] = useState(initValue);

  return (
    <div className="item-button">
      { !edit && (
        <>
          <button onClick={itemClick}
            className={buttonClassNames.join(' ')}>
            { value }
          </button>
          <div className="icon-button-container">
            <button onClick={itemRemove} className="icon-button"><span role="img" aria-label="remove">🗑️</span></button>
            <button onClick={() => setEdit(true)} className="icon-button"><span role="img" aria-label="edit">🖊</span></button>
          </div>
        </>
      )}
      { edit && (
        <>
          <input type="text" name="variant" placeholder="Name" value={value} onChange={e => setValue(e.target.value)}></input>
          <div>
            <button className="icon-button" onClick={() => { setValue(initValue); setEdit(false); itemCancel(); }}><span role="img" aria-label="cancel">❎</span></button>
            <button className="icon-button" onClick={() => { itemUpdate(value); setEdit(false); }}><span role="img" aria-label="validate">✅</span></button>
          </div>
        </>
      )}
    </div>
  );
};

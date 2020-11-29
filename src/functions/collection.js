
export const refreshCollection = (item, collection) => {
  const refreshIndex = collection.findIndex(c => c._id === item._id);
  const refreshedItems = [...collection];
  if (refreshIndex >= 0) {
    refreshedItems[refreshIndex] = item;
  } else {
    refreshedItems.push(item);
  }
  return refreshedItems;
};

export const refreshCollectionRemove = (itemId, collection) => {
  const refreshIndex = collection.findIndex(c => c._id === itemId);
  if (refreshIndex >= 0) {
    const refreshedItems = [...collection];
    refreshedItems.splice(refreshIndex, 1);
    return refreshedItems;
  }
};

import { authFetch } from './api';

export const createModel = name => {
  return authFetch('/models', {
    method: 'post',
    body: JSON.stringify({name}),
  }).then(response => response.json());
};

export const updateModel = model => {
  return authFetch('/models', {
    method: 'put',
    body: JSON.stringify(model),
  }).then(response => response.json());
}

export const deleteModel = model => {
  return authFetch(`/models/${model._id}`, {
    method: 'delete',
  }).then(response => response.json());
}

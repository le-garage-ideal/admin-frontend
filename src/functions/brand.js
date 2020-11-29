import { authFetch } from './api';

export const createBrand = name => {
  return authFetch('/brands', {
    method: 'post',
    body: JSON.stringify({name}),
  }).then(response => response.json());
};

export const updateBrand = brand => {
  return authFetch('/brands', {
    method: 'put',
    body: JSON.stringify(brand),
  }).then(response => response.json());
}

export const deleteBrand = brand => {
  return authFetch(`/brands/${brand._id}`, {
    method: 'delete',
  }).then(response => response.json());
}

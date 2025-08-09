import { request } from './api';

export const User = {
  async me() {
    return request('/users/me');
  },
  async updateMyUserData(data) {
    const user = await this.me();
    return request(`/users/${user.id}/my-data`, {
      method: 'PATCH',
      body: data
    });
  }
};

export const Charity = {
  async list() {
    return request('/charities');
  }
};

export const Transaction = {
  async filter(params = {}, sort) {
    const search = new URLSearchParams(params);
    if (sort) search.append('sortBy', sort);
    return request(`/transactions?${search.toString()}`);
  },
  async create(data) {
    return request('/transactions', { method: 'POST', body: data });
  },
  async update(id, data) {
    return request(`/transactions/${id}`, { method: 'PATCH', body: data });
  }
};

export const Donation = {
  async filter(params = {}, sort) {
    const search = new URLSearchParams(params);
    if (sort) search.append('sortBy', sort);
    return request(`/donations?${search.toString()}`);
  }
};

export const Pledge = {
  async create(data) {
    return request('/pledges', { method: 'POST', body: data });
  }
};

export const BankAccount = {
  async create(data) {
    return request('/bankaccounts', { method: 'POST', body: data });
  }
};

export default {
  User,
  Charity,
  Transaction,
  Donation,
  Pledge,
  BankAccount
};

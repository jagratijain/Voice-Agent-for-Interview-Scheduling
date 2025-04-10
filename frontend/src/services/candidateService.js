import API from './api';

export const getAllCandidates = () => API.get('/candidate');
export const getCandidateById = (id) => API.get(`/candidate/${id}`);
export const createCandidate = (data) => API.post('/candidate', data);
export const deleteCandidate = (id) => API.delete(`/candidate/${id}`);

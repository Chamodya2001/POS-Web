import React, { createContext, useContext, useState, useEffect } from 'react';
import candidateFullData_service from './service/candidateFullData_service';


const CandidateContext = createContext();


export const CandidateProvider = ({ candidateId, children }) => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!candidateId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await candidateFullData_service(candidateId);
        setCandidateData(data);// save globally
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

 
  const updateCandidateData = (newData) => {
    setCandidateData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <CandidateContext.Provider
      value={{ candidateData, loading, error, updateCandidateData }}
    >
      {children}
    </CandidateContext.Provider>
  );
};


export const useCandidateData = () => useContext(CandidateContext);

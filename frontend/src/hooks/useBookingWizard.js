import { useState, useEffect } from 'react';
import { getTypes, getVehicles, checkAvailability } from '../services/api';

const useBookingWizard = () => {
  // Form state
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    wheels: null,
    typeId: null,
    vehicleId: null,
    startDate: '',
    endDate: '',
    stepIndex: 0
  });
  
  // Additional state
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState({});

  // Load types when wheels is selected
  useEffect(() => {
    const fetchTypes = async () => {
      if (!state.wheels) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTypes(state.wheels);
        setTypes(data);
        // Reset type selection when wheels change
        setState(prev => ({ ...prev, typeId: null, vehicleId: null }));
        setVehicles([]);
      } catch (err) {
        setError('Failed to load vehicle types');
        console.error('Error fetching types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [state.wheels]);

  // Load vehicles when type is selected
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!state.typeId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getVehicles(state.typeId);
        setVehicles(data);
        // Reset vehicle selection when type changes
        setState(prev => ({ ...prev, vehicleId: null }));
      } catch (err) {
        setError('Failed to load vehicles');
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [state.typeId]);

  // Check vehicle availability when dates change
  useEffect(() => {
    const checkVehicleAvailability = async () => {
      if (!state.vehicleId || !state.startDate || !state.endDate) return;
      
      try {
        const result = await checkAvailability(
          state.vehicleId,
          state.startDate,
          state.endDate
        );
        
        setAvailability(prev => ({
          ...prev,
          [state.vehicleId]: result.available
        }));
      } catch (err) {
        console.error('Error checking availability:', err);
      }
    };

    const timer = setTimeout(checkVehicleAvailability, 500);
    return () => clearTimeout(timer);
  }, [state.vehicleId, state.startDate, state.endDate]);

  // Update form field
  const updateField = (field, value) => {
    setState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user makes changes
    if (error) {
      setError(null);
    }
  };

  // Navigation
  const nextStep = () => {
    if (canProceed()) {
      setState(prev => ({
        ...prev,
        stepIndex: Math.min(prev.stepIndex + 1, 5)
      }));
      setError(null);
    }
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      stepIndex: Math.max(prev.stepIndex - 1, 0)
    }));
    setError(null);
  };

  // Validation for current step
  const canProceed = () => {
    const { stepIndex, firstName, lastName, wheels, typeId, vehicleId, startDate, endDate } = state;
    const today = new Date().toISOString().split('T')[0];
    
    switch (stepIndex) {
      case 0: // Name step
        return (
          firstName.trim().length > 0 &&
          lastName.trim().length > 0 &&
          firstName.length <= 50 &&
          lastName.length <= 50
        );
      case 1: // Wheels step
        return wheels !== null;
      case 2: // Type step
        return typeId !== null;
      case 3: // Model step
        return vehicleId !== null;
      case 4: // Date step
        return (
          startDate &&
          endDate &&
          startDate <= endDate &&
          startDate >= today
        );
      default:
        return true;
    }
  };

  // Check if current vehicle is available
  const isVehicleAvailable = () => {
    if (!state.vehicleId) return false;
    return availability[state.vehicleId] !== false; // Default to true if not checked yet
  };

  return {
    // State
    state,
    types,
    vehicles,
    loading,
    error,
    
    // Methods
    updateField,
    nextStep,
    prevStep,
    canProceed,
    isVehicleAvailable,
    
    // Setters
    setError,
    setLoading
  };
};

export default useBookingWizard;
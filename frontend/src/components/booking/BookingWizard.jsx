// frontend/src/components/booking/BookingWizard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Bike,
  Car as CarIcon,
  Check,
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTypes, getVehicles, createBooking, checkAvailability, getVehicleById } from '../../services/api';
import { formatDate, calculateDays } from '../../utils/helpers';

const STEPS = ['Type', 'Model', 'Vehicle', 'Dates'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } }
};

export default function BookingWizard({ onSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [wheels, setWheels] = useState(null);
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTypes([
      { id: 1, name: 'Bike', wheels: 2, category: 'Standard' },
      { id: 2, name: 'Car', wheels: 4, category: 'Standard' }
    ]);
  }, []);

  useEffect(() => {
    if (!wheels) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const vehicleTypes = await getTypes(wheels);
        if (!cancelled && Array.isArray(vehicleTypes) && vehicleTypes.length) setTypes(vehicleTypes);
      } catch (err) {
        if (!cancelled) setError('Failed to load vehicle types');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [wheels]);

  useEffect(() => {
    if (!selectedType) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const available = await getVehicles(selectedType);
        if (!cancelled) setVehicles(Array.isArray(available) ? available : []);
      } catch (err) {
        if (!cancelled) setError('Failed to load vehicles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedType]);

  const handleWheelSelect = (wheelCount) => {
    setWheels(wheelCount);
    setSelectedType(null);
    setSelectedVehicle(null);
    setVehicles([]);
    setStep(2);
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setSelectedVehicle(null);
    setStep(3);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setStep(4);
  };

  const handleDateSelect = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
      if (endDate && value > endDate) setEndDate('');
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const calculateTotalPrice = (pricePerDay, start, end) => {
    if (!pricePerDay || !start || !end) return 0;
    const days = calculateDays(start, end);
    return pricePerDay * Math.max(1, days);
  };

  const handleSubmit = async (e) => {
    console.log('Form submitted');
    e.preventDefault();
    setError('');
    
    // Validate inputs
    console.log('Form data:', { startDate, endDate, selectedVehicle });
    
    if (!startDate || !endDate) {
      console.log('Missing dates');
      setError('Please select both start and end dates');
      return;
    }
    if (!selectedVehicle) {
      console.log('No vehicle selected');
      setError('Please select a vehicle');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      console.log('Invalid date range');
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare booking data according to backend expectations
      const bookingData = {
        vehicleId: selectedVehicle.id,
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0]
      };
      
      console.log('Submitting booking:', bookingData);
      
      // Check vehicle exists on backend (avoid 'Vehicle not found')
      try {
        await getVehicleById(selectedVehicle.id);
      } catch (e) {
        setError('Selected vehicle no longer exists. Please go back and choose another vehicle.');
        setLoading(false);
        return;
      }
      
      // Check availability first
      const isAvailable = await checkAvailability(
        selectedVehicle.id, 
        bookingData.startDate, 
        bookingData.endDate
      );
      
      if (!isAvailable.available) {
        throw new Error('The selected vehicle is not available for the chosen dates');
      }
      
      // Create the booking
      const result = await createBooking(bookingData);
      console.log('Booking successful:', result);
      
      // Show success message
      if (typeof onSuccess === 'function') {
        onSuccess(result);
      } else {
        navigate('/my-bookings', { 
          state: { 
            bookingSuccess: true,
            bookingId: result.id
          } 
        });
      }
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const HeaderStepper = () => {
    const pct = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
    return (
      <div className="card-header bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Book Your Ride</h1>
            <p className="text-blue-100">Complete your booking in just a few steps</p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {STEPS.map((label, idx) => {
              const num = idx + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={label} className="flex flex-col items-center text-center">
                  <div className={`progress-number ${active ? 'active' : done ? 'completed' : ''}`} style={{ width: 40, height: 40 }}>
                    {done ? <Check className="icon" /> : num}
                  </div>
                  <span className="progress-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
            <motion.div className="bg-white h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.45 }} />
          </div>
        </div>
      </div>
    );
  };

  const StepChooseWheels = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">What would you like to rent?</h2>
        <p className="text-gray-500 mt-2">Choose your preferred vehicle type</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleWheelSelect(2)} className="group relative p-8 vehicle-card" aria-label="Select 2 wheeler">
          <div className="vehicle-icon mb-4"><Bike className="icon" /></div>
          <h3 className="vehicle-name">2 Wheeler</h3>
          <p className="vehicle-meta">Perfect for quick city commutes</p>
          <div className="mt-4 flex items-center text-blue-600 font-medium justify-center"><span>Select</span><ArrowRight className="icon ml-2" /></div>
        </motion.button>

        <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleWheelSelect(4)} className="group relative p-8 vehicle-card" aria-label="Select 4 wheeler">
          <div className="vehicle-icon mb-4"><CarIcon className="icon" /></div>
          <h3 className="vehicle-name">4 Wheeler</h3>
          <p className="vehicle-meta">Comfortable rides for any distance</p>
          <div className="mt-4 flex items-center text-indigo-600 font-medium justify-center"><span>Select</span><ArrowRight className="icon ml-2" /></div>
        </motion.button>
      </div>
    </motion.div>
  );

  const StepChooseType = () => (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }} className="space-y-6">
      <div>
        <button onClick={() => setStep(1)} className="flex items-center text-gray-500 hover:text-gray-700 mb-2"><ArrowLeft className="icon mr-1" /> Back</button>
        <h2 className="text-2xl font-bold text-gray-900">Select Vehicle Type</h2>
        <p className="text-gray-500">Choose the type that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <div className="col-span-full flex justify-center py-8"><div className="spinner" /></div> :
          (types.length ? types.map((type, i) => (
            <motion.button key={type.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleTypeSelect(type.id)} className="p-5 vehicle-card flex items-center gap-4" aria-label={`Select ${type.name}`}>
              <div className="vehicle-icon"><Bike className="icon" /></div>
              <div className="flex-1"><h3 className="font-semibold text-gray-900">{type.name}</h3><p className="text-sm text-gray-500">{wheels} Wheels • {type.category || 'Standard'}</p></div>
              <ChevronRight className="icon" />
            </motion.button>
          )) : <div className="col-span-full text-center text-gray-500 py-8">No types available for the selected wheels.</div>
        )}
      </div>
    </motion.div>
  );

  const StepChooseVehicle = () => (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }} className="space-y-6">
      <div>
        <button onClick={() => setStep(2)} className="flex items-center text-gray-500 hover:text-gray-700 mb-2"><ArrowLeft className="icon mr-1" /> Back</button>
        <h2 className="text-2xl font-bold text-gray-900">Available Vehicles</h2>
        <p className="text-gray-500">Select your preferred vehicle</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? <div className="flex justify-center py-12"><div className="spinner" /></div> :
          (vehicles.length ? vehicles.map((vehicle, idx) => (
            <motion.button key={vehicle.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => handleVehicleSelect(vehicle)} className={`w-full vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`} aria-label={`Select ${vehicle.name}`}>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 h-28 bg-gray-50 rounded-lg mb-4 sm:mb-0 sm:mr-6 overflow-hidden flex items-center justify-center">
                  {vehicle.image ? <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" /> : <CarIcon className="icon text-gray-300" />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div><h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3><p className="text-sm text-gray-500 mt-1">{vehicle.type || 'Standard'}</p></div>
                    <div className="text-right"><span className="text-lg font-bold text-gray-900">${vehicle.price}</span><span className="text-gray-500 text-sm block">/ day</span></div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center text-sm text-gray-500"><Clock className="icon mr-1" /><span>{vehicle.available ? 'Available now' : 'Check availability'}</span></div>
                    <div className="px-3 py-1 badge badge-info">Select</div>
                  </div>
                </div>
              </div>
            </motion.button>
          )) : <div className="text-center text-gray-500 py-8">No vehicles found for this type.</div>
        )}
      </div>
    </motion.div>
  );

  const StepDates = () => (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }} className="space-y-6">
      <div>
        <button onClick={() => setStep(3)} className="flex items-center text-gray-500 hover:text-gray-700 mb-2"><ArrowLeft className="icon mr-1" /> Back</button>
        <h2 className="text-2xl font-bold text-gray-900">Select Rental Dates</h2>
        <p className="text-gray-500">Choose your rental period</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="form-label">Start Date</label>
            <div className="relative">
              <input type="date" name="startDate" value={startDate} onChange={handleDateSelect} min={new Date().toISOString().split('T')[0]} className="form-input pl-10" required />
              <Calendar className="icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">End Date</label>
            <div className="relative">
              <input type="date" name="endDate" value={endDate} onChange={handleDateSelect} min={startDate || new Date().toISOString().split('T')[0]} disabled={!startDate} className="form-input pl-10" required />
              <Calendar className="icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {startDate && endDate && selectedVehicle && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div><p className="font-medium text-gray-900">{selectedVehicle.name}</p><p className="text-sm text-gray-500">{selectedVehicle.type || 'Standard'}</p></div>
                <span className="text-lg font-bold text-gray-900">${selectedVehicle.price}</span>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Pick-up</p><p className="font-medium">{formatDate(startDate)}</p></div>
                <div><p className="text-sm text-gray-500">Drop-off</p><p className="font-medium">{formatDate(endDate)}</p></div>
                <div><p className="text-sm text-gray-500">Duration</p><p className="font-medium">{calculateDays(startDate, endDate)} days</p></div>
                <div><p className="text-sm text-gray-500">Total</p><p className="text-lg font-bold text-blue-600">${calculateTotalPrice(selectedVehicle.price, startDate, endDate)}</p></div>
              </div>
            </div>
          </motion.div>
        )}

        <button type="submit" disabled={!startDate || !endDate || loading} className={`btn btn-primary w-full ${loading || !startDate || !endDate ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
          </> : <>
            Confirm Booking <CheckCircle className="icon ml-2" />
          </>}
        </button>
      </form>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto card fade-in">
      <HeaderStepper />
      <div className="p-6 md:p-10">
        <AnimatePresence mode="wait">
          {error && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="alert alert-error mb-6">{error}</motion.div>}
          {loading && step === 1 ? <div className="flex justify-center py-16"><div className="spinner" /></div> : (
            <AnimatePresence mode="wait">
              {step === 1 && <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}><StepChooseWheels /></motion.div>}
              {step === 2 && <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}><StepChooseType /></motion.div>}
              {step === 3 && <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}><StepChooseVehicle /></motion.div>}
              {step === 4 && <motion.div key="s4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}><StepDates /></motion.div>}
            </AnimatePresence>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

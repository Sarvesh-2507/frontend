import React, { useEffect, useState } from 'react';
import { Holiday } from '../../types/leave';
import { apiService } from '../../services/leaveApi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ViewHolidays: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    apiService.getHolidays().then(setHolidays).finally(() => setLoading(false));
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Holiday List">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : holidays.length === 0 ? (
        <div className="text-center text-gray-500">No holidays found.</div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map(h => (
              <tr key={h.id}>
                <td className="px-4 py-2">{h.name}</td>
                <td className="px-4 py-2">{new Date(h.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{h.is_regional ? 'Regional' : 'National'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default ViewHolidays;

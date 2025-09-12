import React, { useState } from "react";
import { Calendar } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

const RequestRegularizationForm: React.FC = () => {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(today);
  const [intime, setIntime] = useState("");
  const [outtime, setOuttime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ reason, date, intime, outtime });
    // TODO: Integrate with backend API
  };

  const handleClear = () => {
    setReason("");
    setDate(today);
    setIntime("");
    setOuttime("");
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-6"
      >
        <h2 className="text-xl font-bold text-center mb-2">Request Regularization</h2>
        <div>
          <label className="block font-medium mb-1" htmlFor="reason">
            Reason
          </label>
          <textarea
            id="reason"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            placeholder="Provide brief details..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="date">
            Date
          </label>
          <div className="relative">
            <input
              id="date"
              type="date"
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1" htmlFor="intime">
              Intime
            </label>
            <input
              id="intime"
              type="time"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={intime}
              onChange={(e) => setIntime(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1" htmlFor="outtime">
              Outtime
            </label>
            <input
              id="outtime"
              type="time"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={outtime}
              onChange={(e) => setOuttime(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestRegularizationForm;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CheckCircle2, Download, MapPin, UserCheck, Users, X } from "lucide-react";

// ---- Utilities --------------------------------------------------------------
const OFFICE_COORDS = { lat: 12.9716, lon: 77.5946 }; // Example: Bengaluru.

function haversineDistanceMeters(a, b) {
  const R = 6371e3; // meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * y;
}

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

// ---- Simple Calendar --------------------------------------------------------
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function formatISO(d) {
  return d.toISOString().slice(0, 10);
}

export function Calendar({
  value,
  onSelect,
  markers = {}, // {"YYYY-MM-DD": "present"|"absent"}
  className,
}) {
  const [cursor, setCursor] = useState(startOfMonth(value || new Date()));
  const today = new Date();

  const grid = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);

    const startWeekday = (start.getDay() + 6) % 7; // Monday=0
    const days = [];

    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }
    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [cursor]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() =>
            setCursor(
              new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
            )
          }
          className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
        >
          ◀
        </button>
        <div className="font-medium">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          onClick={() =>
            setCursor(
              new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
            )
          }
          className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500">
        {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((d) => (
          <div key={d} className="text-center py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {grid.map((d, i) => {
          if (!d) return <div key={i} className="h-8" />;
          const iso = formatISO(d);
          const mark = markers[iso];
          const isToday = isSameDay(d, today);
          return (
            <button
              key={iso}
              onClick={() => onSelect && onSelect(d)}
              className={classNames(
                "h-8 rounded flex items-center justify-center border",
                isToday && "border-blue-400",
                mark === "present" && "bg-green-100 border-green-300",
                mark === "absent" && "bg-red-100 border-red-300",
                !mark && "bg-white border-gray-200 hover:bg-gray-50"
              )}
              title={mark ? mark : "No record"}
            >
              <span
                className={classNames(
                  "text-sm",
                  mark === "present" && "text-green-700",
                  mark === "absent" && "text-red-700"
                )}
              >
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-600 mt-3">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-200 border border-green-400" />
          Present
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-200 border border-red-400" />
          Absent
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border" /> Today border
        </span>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
          {actions && <div className="p-4 border-t">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

// ---- Employee Dashboard -----------------------------------------------------
// Mount this in the employee-side Attendance route only. Do NOT use HRDashboard here.
export function EmployeeDashboard() {
  const [workMode, setWorkMode] = useState("Office"); // Office | WFH | Remote
  const [attendanceMarkers, setAttendanceMarkers] = useState(() => {
    const today = new Date();
    const m = {};
    for (let i = 1; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      m[formatISO(d)] = i % 2 === 0 ? "present" : "absent";
    }
    return m;
  });
  const [showCapture, setShowCapture] = useState(false);
  const [successModal, setSuccessModal] = useState(null); // {message, meta}
  const [pending, setPending] = useState([]); // regularization list

  // Regularization form
  const [regOpen, setRegOpen] = useState(false);
  const [regReason, setRegReason] = useState("");
  const [regNote, setRegNote] = useState("");

  // Camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  function openCamera() {
    setShowCapture(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(() => {
        // If user blocks camera, still allow simulation
      });
  }

  function simulateFaceValidation() {
    // For demo we assume success; in real app call your face-verify API
    return true;
  }

  function getBrowserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }

  async function handleCapture() {
    const faceOk = simulateFaceValidation();
    const now = new Date();

    let meta = { mode: workMode };

    if (workMode === "Office") {
      const loc = await getBrowserLocation();
      meta.location = loc;
      if (loc) {
        const dist = haversineDistanceMeters(loc, OFFICE_COORDS);
        meta.distanceMeters = Math.round(dist);
        if (dist > 500) {
          setSuccessModal({
            message:
              "Location check failed. You appear to be outside the 500m office radius.",
            meta,
          });
          return;
        }
      }
    } else if (workMode === "Work From Home") {
      const loc = await getBrowserLocation();
      meta.homeLocation = loc || { lat: null, lon: null };
    } else {
      // Remote: allow without geo
    }

    if (faceOk) {
      const iso = formatISO(now);
      setAttendanceMarkers((m) => ({ ...m, [iso]: "present" }));
      setSuccessModal({ message: "Attendance Marked Successfully", meta });
    } else {
      setSuccessModal({ message: "Face validation failed", meta });
    }

    // Stop camera after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function submitRegularization() {
    if (!regReason) return;
    const item = {
      id: crypto.randomUUID(),
      date: formatISO(new Date()),
      reason: regReason,
      note: regNote,
      status: "Pending",
    };
    setPending((p) => [item, ...p]);
    setRegOpen(false);
    setRegReason("");
    setRegNote("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Attendance & Leave</h1>
          <p className="text-sm text-gray-600">Employee Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status managed by terminal system</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs border border-green-300">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
          </span>
        </div>
      </div>

      {/* Work Mode switch */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Work Mode</h3>
              <p className="text-xs text-gray-500">Slide to change your working mode</p>
            </div>
            <div className="flex items-center gap-2">
              {(["Office", "Work From Home", "Remote"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setWorkMode(opt)}
                  className={classNames(
                    "px-3 py-1 rounded-full text-xs border",
                    workMode === opt
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 inline-flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {workMode === "Office" && <span>Location verification within 500m of office</span>}
            {workMode === "Work From Home" && <span>Home location will be stored</span>}
            {workMode === "Remote" && <span>Remote capture - no geo validation</span>}
          </div>
        </div>

        {/* Capture Card */}
        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Mark Attendance</h3>
              <p className="text-xs text-gray-500">Webcam capture + simulated face validation</p>
            </div>
            <button
              onClick={openCamera}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 shadow"
            >
              <Camera className="w-4 h-4" /> Capture Attendance
            </button>
          </div>
          {showCapture && (
            <div className="mt-3">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                <video ref={videoRef} className="w-full h-full object-cover" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleCapture}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                >
                  Capture
                </button>
                <button
                  onClick={() => {
                    setShowCapture(false);
                    if (streamRef.current) {
                      streamRef.current.getTracks().forEach((t) => t.stop());
                      streamRef.current = null;
                    }
                  }}
                  className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calendar + Regularization */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white shadow-sm p-4 lg:col-span-2">
          <h3 className="font-medium mb-2">Attendance Calendar</h3>
          <Calendar
            value={new Date()}
            markers={attendanceMarkers}
            onSelect={() => {}}
          />
        </div>

        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Request Regularization</h3>
            <button
              onClick={() => setRegOpen((v) => !v)}
              className="text-xs px-2 py-1 rounded-full border hover:bg-gray-50"
            >
              {regOpen ? "Hide" : "Request"}
            </button>
          </div>

          {regOpen && (
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Reason</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={regReason}
                onChange={(e) => setRegReason(e.target.value)}
              >
                <option value="">Select reason</option>
                <option>Forgot to punch</option>
                <option>System error</option>
                <option>Traffic delay</option>
              </select>
              <label className="text-xs text-gray-600">Explanation</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
                value={regNote}
                onChange={(e) => setRegNote(e.target.value)}
                placeholder="Provide brief details..."
              />
              <div className="flex gap-2">
                <button
                  onClick={submitRegularization}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setRegReason("");
                    setRegNote("");
                  }}
                  className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Pending Requests</h4>
            <div className="space-y-2">
              {pending.length === 0 && (
                <div className="text-xs text-gray-500">No pending requests</div>
              )}
              {pending.map((r) => (
                <div key={r.id} className="p-3 rounded-xl border text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.reason}</div>
                      <div className="text-xs text-gray-500">{r.date}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      {r.status}
                    </span>
                  </div>
                  {r.note && <div className="text-xs text-gray-600 mt-1">{r.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <Modal
        open={!!successModal}
        onClose={() => setSuccessModal(null)}
        title="Attendance"
        actions={
          <div className="flex justify-end">
            <button
              onClick={() => setSuccessModal(null)}
              className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div>
            <div className="font-medium">{successModal?.message}</div>
            {successModal?.meta && (
              <div className="text-xs text-gray-600 mt-1">
                Mode: {successModal.meta.mode}
                {successModal.meta.distanceMeters != null && (
                  <>
                    {" "}- Distance: {successModal.meta.distanceMeters} m
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ---- HR Dashboard -----------------------------------------------------------
// Mount this in the HR-side Attendance route only. Do NOT use EmployeeDashboard here.
export function HRDashboard() {
  // ...existing code from your HRDashboard implementation...
}

// ---- Shell (role switch for demo) ------------------------------------------
// Demo shell for local testing only. Do NOT use in production routing.
export default function AttendanceLeaveModule() {
  // ...existing code from your AttendanceLeaveModule implementation...
}

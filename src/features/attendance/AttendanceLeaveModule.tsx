import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Download,
  MapPin,
  UserCheck,
  Users,
  X,
  Clock,
  BarChart3,
  FileText,
  Settings,
  TrendingUp,
  Upload,
  Edit,
} from "lucide-react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import Sidebar from "../../components/Sidebar";

// ---- Utilities --------------------------------------------------------------
const OFFICE_COORDS = { lat: 12.9716, lon: 77.5946 }; // Example: Bengaluru.

function haversineDistanceMeters(a: any, b: any) {
  const R = 6371e3; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
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

function classNames(...c: any[]) {
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
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
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
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
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
export function EmployeeDashboard({ RequestRegularizationComponent }) {
  const [workMode, setWorkMode] = useState("Office"); // Office | Remote
  const [remoteLocation, setRemoteLocation] = useState(""); // For remote work location type
  const [attendanceMarkers, setAttendanceMarkers] = useState(() => {
    const today = new Date();
    const m: Record<string, string> = {};
    for (let i = 1; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      m[formatISO(d)] = i % 2 === 0 ? "present" : "absent";
    }
    return m;
  });
  const [showCapture, setShowCapture] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    message: string;
    meta: any;
  } | null>(null);
  const [pending, setPending] = useState<
    Array<{
      id: string;
      date: string;
      reason: string;
      note: string;
      status: string;
    }>
  >([]); // regularization list

  // Face registration states
  const [hasFaceData, setHasFaceData] = useState<boolean | null>(null);
  const [faceDataLoading, setFaceDataLoading] = useState(true);
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [faceRegistrationStep, setFaceRegistrationStep] = useState(0); // 0: front, 1: left, 2: right
  const [capturedFaces, setCapturedFaces] = useState<string[]>([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // API Response Popup states
  const [showApiResponsePopup, setShowApiResponsePopup] = useState(false);
  const [apiResponseData, setApiResponseData] = useState<any>(null);

  // Current location state
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "checking" | "available" | "unavailable"
  >("checking");

  // Regularization form
  const [regOpen, setRegOpen] = useState(false);
  const [regReason, setRegReason] = useState("");
  const [regNote, setRegNote] = useState("");

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://192.168.1.117:5000";

  console.log("Backend URL:", BACKEND_URL); // Debug log

  // Temporary flag to enable mock mode for testing (set to false when backend is ready)
  const MOCK_MODE = false;

  // Predefined location clusters for consistent coordinate mapping across devices
  const LOCATION_CLUSTERS = [
    {
      name: "office",
      center: { latitude: 12.9716, longitude: 77.5946 }, // Example office coordinates
      radius: 150, // 150 meters radius to handle GPS variations
      snapTo: { latitude: 12.9716, longitude: 77.5946 }, // Exact coordinates to use
    },
    {
      name: "home_area",
      center: { latitude: 12.9352, longitude: 77.6245 }, // Example home area
      radius: 200, // 200 meters radius for residential area
      snapTo: { latitude: 12.9352, longitude: 77.6245 },
    },
    {
      name: "vels_university",
      center: { latitude: 12.8205, longitude: 80.0507 }, // Example university coordinates
      radius: 300, // 300 meters radius for large campus area
      snapTo: { latitude: 12.8205, longitude: 80.0507 },
    },
  ];

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Function to normalize location coordinates
  const normalizeLocation = (
    rawLatitude: number,
    rawLongitude: number,
    locationType: string
  ): {
    latitude: number;
    longitude: number;
    isNormalized: boolean;
    originalDistance?: number;
  } => {
    console.log("=== Location Normalization ===");
    console.log("Raw coordinates:", rawLatitude, rawLongitude);
    console.log("Location type:", locationType);

    // Find matching cluster based on distance
    for (const cluster of LOCATION_CLUSTERS) {
      const distance = calculateDistance(
        rawLatitude,
        rawLongitude,
        cluster.center.latitude,
        cluster.center.longitude
      );

      console.log(
        `Distance to ${cluster.name}: ${Math.round(distance)}m (radius: ${
          cluster.radius
        }m)`
      );

      if (distance <= cluster.radius) {
        console.log(`✅ Location matched to cluster: ${cluster.name}`);
        console.log(
          `📍 Normalized coordinates: ${cluster.snapTo.latitude}, ${cluster.snapTo.longitude}`
        );

        return {
          latitude: cluster.snapTo.latitude,
          longitude: cluster.snapTo.longitude,
          isNormalized: true,
          originalDistance: Math.round(distance),
        };
      }
    }

    // If no cluster match found, try to match based on location type
    const typeBasedCluster = LOCATION_CLUSTERS.find((cluster) => {
      if (locationType === "office" && cluster.name === "office") return true;
      if (locationType === "home" && cluster.name === "home_area") return true;
      if (locationType === "vels" && cluster.name === "vels_university")
        return true;
      return false;
    });

    if (typeBasedCluster) {
      const distance = calculateDistance(
        rawLatitude,
        rawLongitude,
        typeBasedCluster.center.latitude,
        typeBasedCluster.center.longitude
      );

      // Use a larger radius for type-based matching (800m) to handle cases where
      // devices might be slightly outside the primary cluster radius
      if (distance <= 800) {
        console.log(`✅ Location matched by type: ${typeBasedCluster.name}`);
        console.log(
          `📍 Normalized coordinates: ${typeBasedCluster.snapTo.latitude}, ${typeBasedCluster.snapTo.longitude}`
        );

        return {
          latitude: typeBasedCluster.snapTo.latitude,
          longitude: typeBasedCluster.snapTo.longitude,
          isNormalized: true,
          originalDistance: Math.round(distance),
        };
      }
    }

    console.log("⚠️ No cluster match found, using raw coordinates");
    return {
      latitude: rawLatitude,
      longitude: rawLongitude,
      isNormalized: false,
    };
  };

  useEffect(() => {
    // Check face data status on component mount and when attendance page is accessed
    console.log("Attendance page accessed - validating face data status API");
    checkFaceDataStatus();

    // Get current location when component mounts
    getCurrentLocationForDisplay();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Get current location for display purposes (non-blocking)
  async function getCurrentLocationForDisplay() {
    try {
      setLocationStatus("checking");
      console.log("🔍 Getting current location for display...");

      if (!navigator.geolocation) {
        setLocationStatus("unavailable");
        return;
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => {
              console.log("Location error for display:", error);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            }
          );
        }
      );

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      setCurrentLocation(locationData);
      setLocationStatus("available");
      console.log("✅ Current location obtained for display:", locationData);
    } catch (error) {
      console.log("❌ Could not get location for display:", error);
      setCurrentLocation(null);
      setLocationStatus("unavailable");
    }
  }

  // Check if employee has face data registered
  async function checkFaceDataStatus() {
    try {
      setFaceDataLoading(true);
      console.log("=== Face Data Status API Check ===");
      console.log(
        "Checking face data status at:",
        `${BACKEND_URL}/api/profiles/profile/face_data-status/`
      );

      if (MOCK_MODE) {
        console.log("Mock mode: Simulating face data check");
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // For testing, assume no face data initially
        setHasFaceData(false);
        return;
      }

      // Get access token for authentication
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken") ||
        "";

      const response = await fetch(
        `${BACKEND_URL}/api/profiles/profile/face_data-status/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );

      console.log("✅ Face Data API Response Status:", response.status);
      console.log(
        "✅ Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Face Data API Response:", data);

        // Don't show popup for successful responses - only log to console
        // Store response data for potential debugging but don't show popup
        setApiResponseData({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: data,
          url: `${BACKEND_URL}/api/profiles/profile/face_data-status/`,
          timestamp: new Date().toISOString(),
          success: true,
        });
        // setShowApiResponsePopup(true); // Commented out - don't show popup for success

        // Handle specific payload format: {emp_id: "EMP001", has_face: false}
        let hasFaceDataValue = false;

        if (data.has_face !== undefined) {
          // Primary format from your API: has_face field
          hasFaceDataValue = Boolean(data.has_face);
          console.log("✅ Using 'has_face' field:", data.has_face);
        } else if (data.has_face_data !== undefined) {
          // Fallback: has_face_data field
          hasFaceDataValue = Boolean(data.has_face_data);
          console.log("✅ Using 'has_face_data' field:", data.has_face_data);
        } else if (data.face_data !== undefined) {
          // Fallback: face_data field
          hasFaceDataValue = Boolean(data.face_data);
          console.log("✅ Using 'face_data' field:", data.face_data);
        } else if (data.status !== undefined) {
          // Fallback: status field
          hasFaceDataValue =
            data.status === true || data.status === "true" || data.status === 1;
          console.log("✅ Using 'status' field:", data.status);
        } else if (data.registered !== undefined) {
          // Fallback: registered field
          hasFaceDataValue = Boolean(data.registered);
          console.log("✅ Using 'registered' field:", data.registered);
        } else if (data.exists !== undefined) {
          // Fallback: exists field
          hasFaceDataValue = Boolean(data.exists);
          console.log("✅ Using 'exists' field:", data.exists);
        } else if (typeof data === "boolean") {
          // Fallback: direct boolean response
          hasFaceDataValue = data;
          console.log("✅ Using direct boolean:", data);
        } else {
          // Last fallback: convert any truthy response to boolean
          hasFaceDataValue = Boolean(data);
          console.log("✅ Using truthy conversion:", Boolean(data));
        }

        setHasFaceData(hasFaceDataValue);
        console.log("✅ Final face data status determined:", hasFaceDataValue);

        // Log employee information if available
        if (data.emp_id) {
          console.log("✅ Employee ID:", data.emp_id);
        }

        // Show appropriate UI message
        if (hasFaceDataValue) {
          console.log(
            "✅ Employee has face data - showing green 'Capture Attendance' button"
          );
        } else {
          console.log(
            "⚠️ Employee has no face data - showing amber 'Register Face' button"
          );
        }
      } else {
        console.error("❌ Face Data API Error - Status:", response.status);
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);

        // Show popup with error response
        setApiResponseData({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: errorText,
          url: `${BACKEND_URL}/api/profiles/profile/face_data-status/`,
          timestamp: new Date().toISOString(),
          success: false,
        });
        setShowApiResponsePopup(true);

        // Handle specific error cases
        if (response.status === 401) {
          console.error("❌ Authentication error - check access token");
        } else if (response.status === 404) {
          console.error("❌ API endpoint not found");
        } else if (response.status === 403) {
          console.error("❌ Access forbidden - check permissions");
        }

        // Default to no face data if API fails
        setHasFaceData(false);
        console.log("❌ Setting hasFaceData to false due to API error");
      }
    } catch (error) {
      console.error("❌ Face Data API Network Error:", error);

      // Show popup with network error
      setApiResponseData({
        error: error.message,
        errorType: "Network Error",
        url: `${BACKEND_URL}/api/profiles/profile/face_data-status/`,
        timestamp: new Date().toISOString(),
        success: false,
      });
      setShowApiResponsePopup(true);

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("❌ Network connection failed to backend API");
      }

      // Default to no face data if there's an error
      setHasFaceData(false);
      console.log("❌ Setting hasFaceData to false due to network error");
    } finally {
      setFaceDataLoading(false);
      console.log("=== Face Data Status Check Complete ===");
    }
  }

  // Mark attendance API call
  async function markAttendance(imageData: string) {
    try {
      console.log("=== Starting Attendance Marking Process ===");
      console.log("Work mode:", workMode);
      console.log("Remote location:", remoteLocation);

      if (MOCK_MODE) {
        console.log("Mock mode: Simulating attendance marking");
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock successful attendance
        const iso = formatISO(new Date());
        setAttendanceMarkers((m) => ({ ...m, [iso]: "present" }));
        setSuccessModal({
          message: "Attendance Marked Successfully! (Mock Mode)",
          meta: { mode: workMode, photo: imageData },
        });
        return;
      }

      // First check if geolocation is supported and available
      if (!navigator.geolocation) {
        console.log("❌ Geolocation not supported by browser");
        setSuccessModal({
          message: `📍 Turn On Location

❌ Location services are not supported by your browser.

🔧 Please try:
1. **Update your browser** to the latest version
2. **Use a modern browser** like:
   • Chrome (recommended)
   • Firefox
   • Safari
   • Microsoft Edge

3. **Enable location services** in your browser settings

Turn on location services and try again.`,
          meta: { mode: workMode, locationError: true },
        });
        return;
      }

      // Test location services availability before proceeding
      console.log("🔍 Testing location services availability...");
      try {
        // Quick test to check if location services are available
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("LOCATION_TIMEOUT"));
          }, 5000);

          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              console.log("✅ Location services are available");
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              console.log("❌ Location services test failed:", error);
              if (error.code === error.PERMISSION_DENIED) {
                reject(new Error("LOCATION_PERMISSION_DENIED"));
              } else if (error.code === error.POSITION_UNAVAILABLE) {
                reject(new Error("LOCATION_UNAVAILABLE"));
              } else {
                reject(new Error("LOCATION_ERROR"));
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 3000,
              maximumAge: 60000,
            }
          );
        });
      } catch (locationTestError) {
        console.log("❌ Location services test failed:", locationTestError);

        const errorMessage =
          locationTestError instanceof Error
            ? locationTestError.message
            : "LOCATION_ERROR";

        if (errorMessage === "LOCATION_PERMISSION_DENIED") {
          setSuccessModal({
            message: `📍 Turn On Location

❌ Location access was denied.

🔧 To enable location:
1. **Click the location icon** in your browser address bar
2. **Select "Allow"** for location access
3. **Or go to browser settings** and enable location for this site
4. **Refresh the page** and try again

Turn on location services to mark attendance.`,
            meta: { mode: workMode, locationError: true },
          });
          return;
        } else if (errorMessage === "LOCATION_UNAVAILABLE") {
          setSuccessModal({
            message: `📍 Turn On Location

❌ Location services are turned off.

🔧 Please turn on location:
1. **Android:** Settings > Location > Turn on
2. **iPhone:** Settings > Privacy > Location Services > Turn on
3. **Windows:** Settings > Privacy > Location > Turn on
4. **Mac:** System Preferences > Privacy > Location Services

Turn on location services and try again.`,
            meta: { mode: workMode, locationError: true },
          });
          return;
        } else {
          setSuccessModal({
            message: `📍 Turn On Location

❌ Unable to access location services.

🔧 Please ensure:
1. **Location services are ON** in your device settings
2. **Browser has location permission** for this site
3. **Try refreshing** the page and allow location access

Turn on location services to mark attendance.`,
            meta: { mode: workMode, locationError: true },
          });
          return;
        }
      }

      // Get current location using geolocation API
      const getCurrentLocation = (): Promise<{
        latitude: number;
        longitude: number;
      }> => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(
              new Error(
                "LOCATION_NOT_SUPPORTED: Geolocation is not supported by this browser. Please use a modern browser with location support."
              )
            );
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.warn("Geolocation error:", error);

              // Handle specific geolocation errors
              if (error.code === error.PERMISSION_DENIED) {
                reject(
                  new Error(
                    "LOCATION_PERMISSION_DENIED: Location access was denied. Please turn on location services and allow location access for this site."
                  )
                );
              } else if (error.code === error.POSITION_UNAVAILABLE) {
                reject(
                  new Error(
                    "LOCATION_UNAVAILABLE: Location information is unavailable. Please turn on location services on your device."
                  )
                );
              } else if (error.code === error.TIMEOUT) {
                reject(
                  new Error(
                    "LOCATION_TIMEOUT: Location request timed out. Please check if location services are enabled and try again."
                  )
                );
              } else {
                reject(
                  new Error(
                    "LOCATION_ERROR: Unable to retrieve your location. Please turn on location services."
                  )
                );
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            }
          );
        });
      };

      // Get current location - this will throw an error if location is not available
      const rawLocation = await getCurrentLocation();
      console.log(
        "✅ Location services are working - Got coordinates:",
        rawLocation
      );

      // Determine location type based on work mode and selection
      let locationType = "office"; // default
      if (workMode === "Remote") {
        if (remoteLocation === "home") {
          locationType = "home";
        } else if (remoteLocation === "vels-university") {
          locationType = "vels";
        } else if (remoteLocation === "others") {
          locationType = "other";
        } else {
          locationType = "other"; // fallback for remote
        }
      }

      console.log("Location type:", locationType);

      // Normalize location coordinates to ensure consistency across devices at same location
      const normalizedLocation = normalizeLocation(
        rawLocation.latitude,
        rawLocation.longitude,
        locationType
      );

      const location = {
        latitude: normalizedLocation.latitude,
        longitude: normalizedLocation.longitude,
      };

      console.log("=== Current Location Information ===");
      console.log(
        "📍 Raw Device Location:",
        rawLocation.latitude.toFixed(6),
        rawLocation.longitude.toFixed(6)
      );
      console.log(
        "📍 Normalized Location:",
        location.latitude.toFixed(6),
        location.longitude.toFixed(6)
      );
      console.log("🏢 Work Mode:", workMode);
      console.log("📋 Location Type:", locationType);
      console.log(
        normalizedLocation.isNormalized
          ? "✅ Using normalized coordinates (clustered for consistency)"
          : "⚠️ Using raw coordinates (no cluster match found)"
      );

      // Convert base64 to blob for image
      const blob = base64ToBlob(imageData, "image/jpeg");

      // Create FormData with all required fields
      const formData = new FormData();
      formData.append("image", blob, "attendance.jpg");
      formData.append("work_mode", workMode.toLowerCase()); // "office" or "remote"
      formData.append("location_type", locationType); // "office", "home", "vels", "other"
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());

      console.log("FormData contents:");
      console.log("- work_mode:", workMode.toLowerCase());
      console.log("- location_type:", locationType);
      console.log("- latitude:", location.latitude);
      console.log("- longitude:", location.longitude);
      console.log("- image blob size:", blob.size, "bytes");

      // Debug: Log image data details
      console.log("=== Image Debug Info ===");
      console.log("- Original imageData length:", imageData.length);
      console.log("- Image data starts with:", imageData.substring(0, 50));
      console.log("- Image format detected:", imageData.split(";")[0]);
      console.log(
        "- Base64 data length:",
        imageData.split(",")[1]?.length || 0
      );
      console.log("- Blob type:", blob.type);
      console.log("- Blob size (KB):", (blob.size / 1024).toFixed(2));

      // Validate image quality and size
      if (blob.size < 1000) {
        console.warn("⚠️ Image size very small, may affect recognition");
      }
      if (blob.size > 5 * 1024 * 1024) {
        console.warn("⚠️ Image size very large, may cause upload issues");
      }

      console.log("Making request to:", `${BACKEND_URL}/api/attendance/mark/`);

      // Get access token from localStorage or wherever it's stored
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken") ||
        ""; // Add your token retrieval logic here

      const apiResponse = await fetch(`${BACKEND_URL}/api/attendance/mark/`, {
        method: "POST",
        headers: {
          // Add authentication headers
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          // Note: Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      console.log("Attendance API response status:", apiResponse.status);
      console.log("Attendance API response headers:", apiResponse.headers);

      // Check if response is ok before trying to parse JSON
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error Response:", errorText);

        // Check if we're getting the API root instead of our endpoint
        if (
          errorText.includes("api/organizations/") ||
          errorText.includes("admin/")
        ) {
          throw new Error(
            "Attendance endpoint not found. Please check if the attendance API is properly configured on the backend."
          );
        }

        // Parse error response to check for specific errors
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch (e) {
          parsedError = { error: errorText };
        }

        console.log("=== Parsed Error Details ===");
        console.log("Error object:", parsedError);
        console.log("Error type:", typeof parsedError.error);
        console.log("Error message:", parsedError.error);

        // Special handling for face recognition errors
        if (
          apiResponse.status === 400 &&
          (parsedError.error?.includes("Face not recognized") ||
            parsedError.error?.includes("face not recognized") ||
            parsedError.error?.includes("No face detected") ||
            parsedError.error?.includes("Face recognition failed") ||
            parsedError.error?.includes("face"))
        ) {
          // Create detailed face recognition error
          const faceErrorDetails = {
            error: parsedError.error || "Face recognition failed",
            imageSize: blob.size,
            imageType: blob.type,
            workMode: workMode,
            locationType: locationType,
            suggestion:
              "Face recognition issue - check image quality and lighting",
          };

          throw new Error(`FACE_ERROR:${JSON.stringify(faceErrorDetails)}`);
        }

        // Special handling for location-related errors
        if (
          apiResponse.status === 400 &&
          (parsedError.error?.includes("Not within office location") ||
            parsedError.error?.includes("location"))
        ) {
          // Create detailed location error with current device coordinates
          const locationErrorDetails = {
            error: parsedError.error || "Location validation failed",
            currentLocation: location, // Current device coordinates
            workMode: workMode,
            locationType: locationType,
            timestamp: new Date().toISOString(),
          };

          throw new Error(
            `LOCATION_ERROR:${JSON.stringify(locationErrorDetails)}`
          );
        }

        throw new Error(
          `HTTP ${apiResponse.status}: ${errorText || "Unknown error"}`
        );
      }

      const result = await apiResponse.json();
      console.log("Attendance marked successfully:", result);

      // Success
      const iso = formatISO(new Date());
      setAttendanceMarkers((m) => ({ ...m, [iso]: "present" }));
      setSuccessModal({
        message: `${result.message || "Attendance Marked Successfully!"}

📍 Location Details:
${
  normalizedLocation.isNormalized
    ? `• Raw Device Location: ${rawLocation.latitude.toFixed(
        6
      )}, ${rawLocation.longitude.toFixed(6)}
• Normalized Location: ${location.latitude.toFixed(
        6
      )}, ${location.longitude.toFixed(6)}
• Distance from center: ${Math.round(
        normalizedLocation.originalDistance || 0
      )}m`
    : `• Device Location: ${location.latitude.toFixed(
        6
      )}, ${location.longitude.toFixed(6)}`
}
• Work Mode: ${workMode}
• Location Type: ${locationType}

✅ ${
          normalizedLocation.isNormalized
            ? "Your attendance has been recorded with normalized coordinates for consistency across devices."
            : "Your attendance has been recorded with actual device coordinates."
        }`,
        meta: {
          mode: workMode,
          locationType: locationType,
          latitude: location.latitude,
          longitude: location.longitude,
          rawLatitude: rawLocation.latitude,
          rawLongitude: rawLocation.longitude,
          isNormalized: normalizedLocation.isNormalized,
          photo: imageData,
          currentLocation: true,
        },
      });
    } catch (error) {
      console.error("Error marking attendance:", error);

      let errorMessage = "Failed to mark attendance. ";
      let locationDetails = null;

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage +=
          "Network connection failed. Please check your internet connection.";
      } else if (error instanceof Error) {
        // Check for face recognition errors
        if (error.message.startsWith("FACE_ERROR:")) {
          const faceData = JSON.parse(error.message.replace("FACE_ERROR:", ""));

          errorMessage = `❌ ${faceData.error}

📷 Face Recognition Debug Info:
• Image Size: ${(faceData.imageSize / 1024).toFixed(2)} KB
• Image Type: ${faceData.imageType}
• Work Mode: ${faceData.workMode}
• Location Type: ${faceData.locationType}

🔧 Troubleshooting Steps:
1. **Lighting Issues:**
   • Ensure good lighting on your face
   • Avoid backlighting or shadows
   • Try moving to a well-lit area

2. **Camera Position:**
   • Hold camera at eye level
   • Keep face centered in frame
   • Maintain 12-18 inches distance

3. **Image Quality:**
   • Clean camera lens
   • Ensure stable connection
   • Wait for camera to focus

4. **Face Registration:**
   • Capture images in similar lighting
   • Follow the 3-step registration process

5. **Technical Issues:**
   • Check internet connection
   • Try refreshing the page
   • Clear browser cache

💡 Quick Fixes:
• Ensure face is clearly visible and well-lit
• Try capturing from a different angle`;

          locationDetails = faceData;
        }
        // Check for location-specific errors
        else if (error.message.startsWith("LOCATION_ERROR:")) {
          const locationData = JSON.parse(
            error.message.replace("LOCATION_ERROR:", "")
          );
          locationDetails = locationData;

          let locationMessage = `❌ ${locationData.error}

📍 Current Location:`;

          // Show current device coordinates
          if (locationData.currentLocation) {
            locationMessage += `
• Latitude: ${locationData.currentLocation.latitude.toFixed(6)}
• Longitude: ${locationData.currentLocation.longitude.toFixed(6)}
• Work Mode: ${locationData.workMode}
• Location Type: ${locationData.locationType}

🔧 Your location was detected but may not be within the allowed area for attendance marking.`;
          }

          errorMessage = locationMessage;
        }
        // Check for location service errors
        else if (error.message.startsWith("LOCATION_PERMISSION_DENIED:")) {
          errorMessage = `📍 Turn On Location Access

❌ Location access was denied by your browser.

🔧 To enable location access:
1. **Chrome/Edge:**
   • Click the location icon in the address bar
   • Select "Always allow" for this site
   • Or go to Settings > Privacy > Site Settings > Location

2. **Firefox:**
   • Click the shield icon in the address bar  
   • Select "Allow Location Access"
   • Or go to Settings > Privacy > Permissions > Location

3. **Safari:**
   • Go to Safari > Settings > Websites > Location
   • Set this site to "Allow"

4. **Mobile:**
   • Enable location services in device settings
   • Allow location access for your browser

After enabling location access, please refresh the page and try again.`;
        } else if (error.message.startsWith("LOCATION_UNAVAILABLE:")) {
          errorMessage = `📍 Turn On Location Services

❌ Location services are not available or turned off.

🔧 Please turn on location services:
1. **Android:**
   • Go to Settings > Location
   • Turn on "Use location"
   • Ensure "High accuracy" mode is selected

2. **iPhone:**
   • Go to Settings > Privacy & Security > Location Services
   • Turn on "Location Services"

3. **Windows:**
   • Go to Settings > Privacy > Location
   • Turn on "Location service"

4. **Mac:**
   • Go to System Preferences > Security & Privacy > Privacy > Location Services
   • Enable "Location Services"

After turning on location services, please try again.`;
        } else if (error.message.startsWith("LOCATION_TIMEOUT:")) {
          errorMessage = `📍 Location Request Timed Out

❌ Unable to get your location - request timed out.

🔧 Please check:
1. **Location Services:**
   • Make sure location services are turned ON
   • Check if GPS is enabled (for mobile devices)

2. **Network Connection:**
   • Ensure you have a stable internet connection
   • WiFi location services may be needed

3. **Try Again:**
   • Move to an area with better signal
   • Wait a moment and try again

If the problem persists, please turn on location services and refresh the page.`;
        } else if (error.message.startsWith("LOCATION_ERROR:")) {
          errorMessage = `📍 Turn On Location

❌ Unable to access your location.

🔧 Please ensure:
1. **Location services are turned ON** on your device
2. **Browser has location permission** for this site
3. **GPS is enabled** (for mobile devices)
4. You have a **stable internet connection**

💡 Quick fix: Turn on location services in your device settings and refresh this page.`;
        } else if (error.message.startsWith("LOCATION_NOT_SUPPORTED:")) {
          errorMessage = `📍 Location Not Supported

❌ Your browser doesn't support location services.

🔧 Please try:
1. **Update your browser** to the latest version
2. **Use a modern browser** like:
   • Chrome (recommended)
   • Firefox
   • Safari
   • Microsoft Edge

3. **Check if location is disabled** in browser settings

If using an older device, location services may not be available.`;
        } else if (error.message.includes("HTTP")) {
          errorMessage += error.message;
        } else if (error.message.includes("endpoint not found")) {
          errorMessage += error.message;
        } else {
          errorMessage += "Please check your connection and try again.";
        }
      } else {
        errorMessage += "Please check your connection and try again.";
      }

      setSuccessModal({
        message: errorMessage,
        meta: {
          mode: workMode,
          locationError: locationDetails,
          showLocationDetails: !!locationDetails,
        },
      });
    }
  }

  // Helper function to convert base64 to blob
  function base64ToBlob(
    base64Data: string,
    contentType: string = "image/jpeg"
  ): Blob {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  // Register face data API call
  async function registerFaceData(images: string[]) {
    try {
      setRegistrationLoading(true);

      // Validate inputs
      if (!images || images.length === 0) {
        throw new Error("No images to register");
      }

      if (images.length !== 3) {
        throw new Error(`Expected 3 images, but got ${images.length}`);
      }

      if (MOCK_MODE) {
        console.log("Mock mode: Simulating face registration");
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock successful registration
        setSuccessModal({
          message:
            "Face registration completed successfully! You can now mark attendance. (Mock Mode)",
          meta: { type: "registration", showAttendanceButton: true },
        });
        setHasFaceData(true);
        setShowFaceRegistration(false);
        setCapturedFaces([]);
        setFaceRegistrationStep(0);

        // Re-check face data status from backend to ensure consistency
        setTimeout(() => {
          checkFaceDataStatus();
        }, 1000);
        return;
      }

      console.log("Registering face data with", images.length, "images");
      console.log("Backend URL:", BACKEND_URL);
      console.log(
        "Making request to:",
        `${BACKEND_URL}/api/attendance/register-face/`
      );
      console.log("Sending 3 images with field name 'images'");

      const formData = new FormData();

      // Convert each base64 image to blob and append to FormData with field name "images"
      for (let i = 0; i < images.length; i++) {
        try {
          if (!images[i] || !images[i].startsWith("data:image/")) {
            throw new Error(`Invalid image format for image ${i + 1}`);
          }

          const blob = base64ToBlob(images[i], "image/jpeg");
          console.log(
            `Image ${i + 1} (${["Front", "Left", "Right"][i]}) blob size:`,
            blob.size,
            "bytes"
          );
          // Send all images with field name "images" as required by your API
          formData.append(
            "images",
            blob,
            `face_${["front", "left", "right"][i]}.jpg`
          );
        } catch (conversionError) {
          console.error(
            `Error converting image ${i} to blob:`,
            conversionError
          );
          throw new Error(`Failed to process image ${i + 1}`);
        }
      }

      console.log("FormData prepared with 3 images under 'images' field");

      // Get access token for authentication
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken") ||
        "";

      const apiResponse = await fetch(
        `${BACKEND_URL}/api/attendance/register-face/`,
        {
          method: "POST",
          headers: {
            // Add authentication headers
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            // Note: Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        }
      );

      console.log("Face registration API response status:", apiResponse.status);
      console.log(
        "Face registration API response headers:",
        apiResponse.headers
      );

      // Check if response is ok before trying to parse JSON
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error Response:", errorText);

        // Check if we're getting the API root instead of our endpoint
        if (
          errorText.includes("api/organizations/") ||
          errorText.includes("admin/")
        ) {
          throw new Error(
            "Face registration endpoint not found. Please check if the face recognition API is properly configured on the backend."
          );
        }

        throw new Error(
          `HTTP ${apiResponse.status}: ${errorText || "Unknown error"}`
        );
      }

      const result = await apiResponse.json();
      console.log("Face registration successful:", result);

      // Success
      setSuccessModal({
        message:
          result.message ||
          `Face ${
            hasFaceData ? "re-registration" : "registration"
          } completed successfully! You can now mark attendance.`,
        meta: { type: "registration", showAttendanceButton: true },
      });
      setHasFaceData(true);
      setShowFaceRegistration(false);
      setCapturedFaces([]);
      setFaceRegistrationStep(0);

      // Re-check face data status from backend to ensure consistency
      setTimeout(() => {
        checkFaceDataStatus();
      }, 1000);
    } catch (error) {
      console.error("Error registering face data:", error);

      let errorMessage = "Failed to register face data. ";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage +=
          "Network connection failed. Please check your internet connection.";
      } else if (error instanceof Error) {
        if (error.message.includes("HTTP")) {
          errorMessage += error.message;
        } else if (error.message.includes("Failed to process image")) {
          errorMessage += error.message;
        } else if (error.message.includes("endpoint not found")) {
          errorMessage += error.message;
        } else {
          errorMessage += "Please try again.";
        }
      } else {
        errorMessage += "Please check your connection and try again.";
      }

      setSuccessModal({
        message: errorMessage,
        meta: { type: "registration_error" },
      });
    } finally {
      setRegistrationLoading(false);
    }
  }

  // Check location before opening camera for attendance
  async function handleAttendanceCapture() {
    try {
      console.log(
        "🔍 Checking location before opening camera for attendance..."
      );

      // First check if geolocation is supported
      if (!navigator.geolocation) {
        setSuccessModal({
          message: `📍 Location Services Not Supported

❌ Your browser doesn't support location services.

🔧 Please try:
1. **Update your browser** to the latest version
2. **Use a modern browser** like Chrome, Firefox, Safari, or Edge
3. **Enable location services** in your browser settings

Turn on location services to mark attendance.`,
          meta: { mode: workMode, locationError: true },
        });
        return;
      }

      // Quick location test before opening camera
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("LOCATION_TIMEOUT"));
          }, 5000);

          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              console.log("❌ Location check failed:", error);
              if (error.code === error.PERMISSION_DENIED) {
                reject(new Error("LOCATION_PERMISSION_DENIED"));
              } else if (error.code === error.POSITION_UNAVAILABLE) {
                reject(new Error("LOCATION_UNAVAILABLE"));
              } else {
                reject(new Error("LOCATION_ERROR"));
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 3000,
              maximumAge: 60000,
            }
          );
        }
      );

      console.log("✅ Location check passed, opening camera for attendance");
      // If we get here, location is working - open camera
      openCamera(false);
    } catch (locationError) {
      console.log("❌ Location check failed before camera:", locationError);

      const errorMessage =
        locationError instanceof Error
          ? locationError.message
          : "LOCATION_ERROR";

      if (errorMessage === "LOCATION_PERMISSION_DENIED") {
        setSuccessModal({
          message: `📍 Location Services: OFF

❌ Location access was denied by your browser.

🔧 To enable location and mark attendance:
1. **Click the location icon** in your browser address bar
2. **Select "Allow"** for location access
3. **Or go to browser settings** and enable location for this site
4. **Refresh the page** and try again

📍 Location services must be ON to mark attendance.`,
          meta: { mode: workMode, locationError: true },
        });
      } else if (errorMessage === "LOCATION_UNAVAILABLE") {
        setSuccessModal({
          message: `📍 Location Services: OFF

❌ Location services are turned off on your device.

🔧 Please turn on location services:
1. **Android:** Settings > Location > Turn ON
2. **iPhone:** Settings > Privacy > Location Services > Turn ON  
3. **Windows:** Settings > Privacy > Location > Turn ON
4. **Mac:** System Preferences > Privacy > Location Services > Turn ON

📍 Location services must be ON to mark attendance.`,
          meta: { mode: workMode, locationError: true },
        });
      } else {
        setSuccessModal({
          message: `📍 Location Services: OFF

❌ Unable to access location services.

🔧 Please ensure:
1. **Location services are ON** in your device settings
2. **Browser has location permission** for this site
3. **Try refreshing** the page and allow location access

📍 Turn on location services to mark attendance.`,
          meta: { mode: workMode, locationError: true },
        });
      }

      // Also update the location status display
      setLocationStatus("unavailable");
      setCurrentLocation(null);
    }
  }

  function openCamera(isRegistration: boolean = false) {
    setShowCapture(true);
    if (isRegistration) {
      setShowFaceRegistration(true);
    }
    setCameraLoading(true);

    // Enhanced browser compatibility check
    console.log("=== Camera Access Debug Info ===");
    console.log("Current URL:", window.location.href);
    console.log("Protocol:", window.location.protocol);
    console.log("Navigator exists:", !!navigator);
    console.log("MediaDevices exists:", !!navigator.mediaDevices);
    console.log("getUserMedia exists:", !!navigator.mediaDevices?.getUserMedia);
    console.log("User Agent:", navigator.userAgent);

    // Check for HTTPS requirement (except localhost)
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]";
    const isHTTPS = window.location.protocol === "https:";

    console.log("Is localhost:", isLocalhost);
    console.log("Is HTTPS:", isHTTPS);

    if (!isLocalhost && !isHTTPS) {
      alert(
        "Camera access requires HTTPS. Please use HTTPS or localhost for testing."
      );
      setShowCapture(false);
      setShowFaceRegistration(false);
      setCameraLoading(false);
      return;
    }

    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera API not supported");

      // Try legacy approach for older browsers
      if (
        (navigator as any).getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).msGetUserMedia
      ) {
        console.log("Trying legacy camera API...");
        tryLegacyCameraAccess(isRegistration);
        return;
      }

      alert(`Camera access is not supported in this browser.
      
Possible solutions:
1. Use a modern browser (Chrome, Firefox, Safari, Edge)
2. Ensure you're using HTTPS (not HTTP)
3. Try accessing from localhost for testing
4. Check browser permissions for camera access
5. Update your browser to the latest version

Current environment:
- Protocol: ${window.location.protocol}
- Browser: ${
        navigator.userAgent.includes("Chrome")
          ? "Chrome"
          : navigator.userAgent.includes("Firefox")
          ? "Firefox"
          : navigator.userAgent.includes("Safari")
          ? "Safari"
          : "Unknown"
      }`);

      setShowCapture(false);
      setShowFaceRegistration(false);
      setCameraLoading(false);
      return;
    }

    // Try to access camera
    console.log("Attempting to access camera...");
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: "user", // Front-facing camera for selfies
        },
        audio: false,
      })
      .then((stream) => {
        console.log("Camera stream obtained successfully");
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.autoplay = true;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;

          // Ensure video plays
          videoRef.current
            .play()
            .then(() => {
              console.log("Video is playing");
              setCameraLoading(false);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              setCameraLoading(false);
            });

          // Handle video loaded event
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            setCameraLoading(false);
          };
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
        handleCameraError(error);
      });
  }

  // Legacy camera access for older browsers
  function tryLegacyCameraAccess(isRegistration: boolean) {
    console.log("Using legacy camera API");

    const getUserMedia =
      (navigator as any).getUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).mozGetUserMedia ||
      (navigator as any).msGetUserMedia;

    if (getUserMedia) {
      getUserMedia.call(
        navigator,
        { video: true, audio: false },
        (stream: MediaStream) => {
          console.log("Legacy camera access successful");
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.autoplay = true;
            videoRef.current.playsInline = true;
            videoRef.current.muted = true;
            setCameraLoading(false);
          }
        },
        (error: any) => {
          console.error("Legacy camera access failed:", error);
          handleCameraError(error);
        }
      );
    } else {
      alert(
        "Camera access is not supported in this browser. Please use a modern browser."
      );
      setShowCapture(false);
      setShowFaceRegistration(false);
      setCameraLoading(false);
    }
  }

  // Centralized error handling for camera issues
  function handleCameraError(error: any) {
    console.error("Camera error details:", error);

    let errorMessage = "Unable to access camera. ";
    let suggestions = "";

    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      errorMessage += "Camera access was denied.";
      suggestions = `
Solutions:
1. Click the camera icon in your browser's address bar and allow camera access
2. Check browser settings and enable camera permissions for this site
3. Restart your browser and try again`;
    } else if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      errorMessage += "No camera found on this device.";
      suggestions = `
Solutions:
1. Make sure your camera is connected and working
2. Try a different camera if you have multiple
3. Restart your device and try again`;
    } else if (
      error.name === "NotReadableError" ||
      error.name === "TrackStartError"
    ) {
      errorMessage += "Camera is being used by another application.";
      suggestions = `
Solutions:
1. Close other applications that might be using the camera
2. Restart your browser
3. Restart your device if needed`;
    } else if (error.name === "SecurityError") {
      errorMessage += "Camera access blocked for security reasons.";
      suggestions = `
Solutions:
1. Make sure you're using HTTPS or localhost
2. Check if your browser blocks camera access on this site
3. Try using a different browser`;
    } else {
      errorMessage += "An unknown error occurred.";
      suggestions = `
Solutions:
1. Try refreshing the page
2. Use a different browser (Chrome, Firefox, Safari, Edge)
3. Make sure you're using HTTPS or localhost
4. Check camera permissions in browser settings`;
    }

    alert(`${errorMessage}

${suggestions}

Error details: ${error.name} - ${error.message}`);

    setShowCapture(false);
    setShowFaceRegistration(false);
    setCameraLoading(false);
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
    // Capture photo from video stream with enhanced quality
    let capturedPhoto = null;
    if (videoRef.current) {
      const video = videoRef.current;

      // Wait for video to be fully loaded
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert(
          "Camera not ready. Please wait for the video to load and try again."
        );
        return;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        // Use optimal resolution for face recognition
        const targetWidth = Math.min(video.videoWidth, 1280);
        const targetHeight = Math.min(video.videoHeight, 720);

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Enable image smoothing for better quality
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        // Draw the image
        context.drawImage(video, 0, 0, targetWidth, targetHeight);

        // Capture with high quality (90% instead of 80%)
        capturedPhoto = canvas.toDataURL("image/jpeg", 0.9);

        console.log("=== Capture Debug Info ===");
        console.log(
          "Video dimensions:",
          video.videoWidth,
          "x",
          video.videoHeight
        );
        console.log("Canvas dimensions:", targetWidth, "x", targetHeight);
        console.log("Captured image size:", capturedPhoto.length, "characters");
        console.log("Image quality: 90%");
      }
    }

    if (!capturedPhoto) {
      alert("Failed to capture photo. Please try again.");
      return;
    }

    if (showFaceRegistration) {
      // Face registration flow
      const stepNames = ["Front", "Left", "Right"];
      console.log(
        `=== Capturing ${stepNames[faceRegistrationStep]} Face Image ===`
      );

      const newCapturedFaces = [...capturedFaces, capturedPhoto];
      setCapturedFaces(newCapturedFaces);

      if (faceRegistrationStep < 2) {
        // Move to next step
        console.log(
          `Moving to step ${faceRegistrationStep + 2}: ${
            stepNames[faceRegistrationStep + 1]
          }`
        );
        setFaceRegistrationStep(faceRegistrationStep + 1);
      } else {
        // All faces captured, ready to register
        console.log("All 3 face images captured, starting registration...");
        console.log("Images to register:", newCapturedFaces.length);

        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        setShowCapture(false);

        // Register face data
        await registerFaceData(newCapturedFaces);
      }
    } else {
      // Attendance marking flow

      // Validate remote location selection if in remote mode
      if (workMode === "Remote" && !remoteLocation) {
        setSuccessModal({
          message:
            "Please select a location type for remote work before marking attendance.",
          meta: { mode: workMode },
        });
        // Stop camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        setShowCapture(false);
        return;
      }

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setShowCapture(false);

      // Mark attendance via API - all location validation will be done on backend
      await markAttendance(capturedPhoto);
    }
  }

  function handleNextRegistrationStep() {
    if (faceRegistrationStep < 2) {
      setFaceRegistrationStep(faceRegistrationStep + 1);
    }
  }

  function cancelCapture() {
    setShowCapture(false);
    setShowFaceRegistration(false);
    setCameraLoading(false);
    setFaceRegistrationStep(0);
    setCapturedFaces([]);
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
          {faceDataLoading && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm border border-blue-300">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              Checking face registration status...
            </span>
          )}
          {!faceDataLoading && hasFaceData !== null && (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
                hasFaceData
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  hasFaceData ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {hasFaceData
                ? "✅ Face Registered - Ready for Attendance"
                : "❌ Face Registration Required"}
            </span>
          )}
          <button
            onClick={() => checkFaceDataStatus()}
            disabled={faceDataLoading}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
            title="Refresh face data status"
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>

      {/* Work Mode switch */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Work Mode</h3>
              <p className="text-xs text-gray-500">
                Select your working mode and location
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(["Office", "Remote"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setWorkMode(opt);
                    if (opt === "Office") {
                      setRemoteLocation(""); // Reset remote location when switching to office
                    }
                  }}
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

          {/* Location Type Dropdown for Remote Mode */}
          {workMode === "Remote" && (
            <div className="mt-3 space-y-2">
              <label className="text-xs font-medium text-gray-700">
                Choose the location type
              </label>
              <select
                value={remoteLocation}
                onChange={(e) => setRemoteLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select location type...</option>
                <option value="home">Home</option>
                <option value="vels-university">Vels University</option>
                <option value="others">Others</option>
              </select>
            </div>
          )}

          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {workMode === "Office" && (
                <span>Location verification within 500m of office</span>
              )}
              {workMode === "Remote" && (
                <span>
                  {remoteLocation === "home" &&
                    "Working from home - no geo validation"}
                  {remoteLocation === "vels-university" &&
                    "Working from Vels University"}
                  {remoteLocation === "others" && "Working from other location"}
                  {!remoteLocation && "Please select location type"}
                </span>
              )}
            </div>

            {/* Current Location Display */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">
                  Current Location Status
                </span>
                <button
                  onClick={getCurrentLocationForDisplay}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  disabled={locationStatus === "checking"}
                >
                  🔄 {locationStatus === "checking" ? "Checking..." : "Refresh"}
                </button>
              </div>

              {locationStatus === "checking" && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Detecting location...
                </div>
              )}

              {locationStatus === "available" && currentLocation && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-green-700 font-medium">
                      Location Services: ON
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-mono bg-white rounded px-2 py-1">
                    📍 Lat: {currentLocation.latitude.toFixed(6)}
                    <br />
                    📍 Lng: {currentLocation.longitude.toFixed(6)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}

              {locationStatus === "unavailable" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-red-700 font-medium">
                      Location Services: OFF
                    </span>
                  </div>
                  <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">
                    ⚠️ Turn on location services to mark attendance
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Capture Card */}
        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Mark Attendance</h3>
              <p className="text-xs text-gray-500">
                {faceDataLoading
                  ? "Checking registration status..."
                  : hasFaceData
                  ? "Face recognition attendance system"
                  : "Please register your face first"}
              </p>
            </div>
            {faceDataLoading ? (
              // Loading state
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-xs text-gray-500">
                  Checking face registration...
                </span>
              </div>
            ) : hasFaceData ? (
              // Employee has face data - show attendance capture button
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAttendanceCapture}
                  disabled={showCapture}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg ${
                    showCapture
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {showCapture ? "Camera Active" : "📷 Capture Attendance"}
                </button>
              </div>
            ) : (
              // Employee has no face data - show register button
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openCamera(true)}
                  disabled={showCapture}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg ${
                    showCapture
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700 transform hover:scale-105 transition-all"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {showCapture ? "Camera Active" : "🆔 Register Face"}
                </button>
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ Face registration required before marking attendance
                </div>
              </div>
            )}
          </div>

          {showCapture && (
            <div className="mt-3">
              {showFaceRegistration && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-amber-800">
                      {hasFaceData
                        ? "Face Re-registration"
                        : "Face Registration"}{" "}
                      - Step {faceRegistrationStep + 1} of 3
                    </h4>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((step) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full ${
                            step <= faceRegistrationStep
                              ? "bg-amber-600"
                              : "bg-amber-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {hasFaceData && (
                    <div className="text-xs text-amber-600 mb-2 font-medium">
                      ⚠️ This will replace your existing face data
                    </div>
                  )}
                  <p className="text-xs text-amber-700">
                    {faceRegistrationStep === 0 &&
                      "Position your face looking straight at the camera"}
                    {faceRegistrationStep === 1 &&
                      "Turn your face to the left and look at the camera"}
                    {faceRegistrationStep === 2 &&
                      "Turn your face to the right and look at the camera"}
                  </p>
                  {capturedFaces.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {capturedFaces.map((face, index) => (
                        <img
                          key={index}
                          src={face}
                          alt={`Captured face ${index + 1}`}
                          className="w-12 h-12 object-cover rounded border border-amber-300"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                {cameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Opening camera...</p>
                    </div>
                  </div>
                )}

                {showFaceRegistration && !cameraLoading && (
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-black bg-opacity-60 text-white p-2 rounded text-center text-sm">
                      {faceRegistrationStep === 0 &&
                        "📷 Look straight at the camera"}
                      {faceRegistrationStep === 1 &&
                        "👈 Turn your face to the left"}
                      {faceRegistrationStep === 2 &&
                        "👉 Turn your face to the right"}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                {showFaceRegistration ? (
                  <>
                    <button
                      onClick={handleCapture}
                      disabled={cameraLoading || registrationLoading}
                      className={`px-3 py-2 rounded-xl text-white text-sm ${
                        cameraLoading || registrationLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {registrationLoading
                        ? "Registering..."
                        : faceRegistrationStep === 2 &&
                          capturedFaces.length === 2
                        ? "Complete Registration"
                        : "Capture Face"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCapture}
                    disabled={cameraLoading}
                    className={`px-3 py-2 rounded-xl text-white text-sm ${
                      cameraLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {cameraLoading ? "Loading..." : "Capture"}
                  </button>
                )}

                <button
                  onClick={cancelCapture}
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
            className=""
          />
        </div>

        <div className="rounded-2xl border bg-white shadow-sm p-4">
          {RequestRegularizationComponent ? <RequestRegularizationComponent /> : null}
        </div>
      </div>

      {/* Success modal */}
      <Modal
        open={!!successModal}
        onClose={() => setSuccessModal(null)}
        title="Attendance"
        actions={
          <div className="flex justify-end gap-2">
            {successModal?.meta?.showAttendanceButton && hasFaceData && (
              <button
                onClick={() => {
                  setSuccessModal(null);
                  openCamera(false); // Open camera for attendance
                }}
                className="px-3 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700"
              >
                Mark Attendance Now
              </button>
            )}
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
          <div className="flex-1">
            <div className="font-medium whitespace-pre-line">
              {successModal?.message}
            </div>
            {successModal?.meta && (
              <div className="text-xs text-gray-600 mt-1">
                {!successModal.meta.showLocationDetails && (
                  <>
                    Mode: {successModal.meta.mode}
                    {successModal.meta.locationType && (
                      <> - Location Type: {successModal.meta.locationType}</>
                    )}
                    {successModal.meta.latitude != null &&
                      successModal.meta.longitude != null && (
                        <>
                          {" "}
                          - Coordinates: {successModal.meta.latitude.toFixed(6)}
                          , {successModal.meta.longitude.toFixed(6)}
                        </>
                      )}
                    {successModal.meta.distanceMeters != null && (
                      <> - Distance: {successModal.meta.distanceMeters} m</>
                    )}
                    {successModal.meta.remoteLocationLabel && (
                      <> - Location: {successModal.meta.remoteLocationLabel}</>
                    )}
                  </>
                )}
                {successModal.meta.photo && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Captured Photo:
                    </p>
                    <img
                      src={successModal.meta.photo}
                      alt="Captured attendance photo"
                      className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                {successModal.meta.locationError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-700 mb-2">
                      {successModal.meta.locationError.suggestion
                        ? "🧠 Face Recognition Error:"
                        : "📍 Location Information:"}
                    </p>
                    {successModal.meta.locationError.suggestion ? (
                      // Face recognition error details
                      <div className="text-xs text-red-600 space-y-1">
                        <div>
                          <strong>Error:</strong>{" "}
                          {successModal.meta.locationError.error}
                        </div>
                        <div>
                          <strong>Image Size:</strong>{" "}
                          {(
                            successModal.meta.locationError.imageSize / 1024
                          ).toFixed(2)}{" "}
                          KB
                        </div>
                        <div>
                          <strong>Image Type:</strong>{" "}
                          {successModal.meta.locationError.imageType}
                        </div>
                        <div>
                          <strong>Work Mode:</strong>{" "}
                          {successModal.meta.locationError.workMode}
                        </div>
                        <div>
                          <strong>Location Type:</strong>{" "}
                          {successModal.meta.locationError.locationType}
                        </div>
                        <div className="mt-2 p-2 bg-red-100 rounded">
                          <strong>💡 Quick Fix:</strong> Ensure better lighting
                          and clearer images for attendance capture.
                        </div>
                      </div>
                    ) : (
                      // Location error details
                      <div className="text-xs text-red-600 space-y-1">
                        <div>
                          <strong>Your Location:</strong>{" "}
                          {successModal.meta.locationError.currentLocation.latitude.toFixed(
                            6
                          )}
                          ,{" "}
                          {successModal.meta.locationError.currentLocation.longitude.toFixed(
                            6
                          )}
                        </div>
                        <div>
                          <strong>Office Location:</strong>{" "}
                          {successModal.meta.locationError.officeLocation.lat.toFixed(
                            6
                          )}
                          ,{" "}
                          {successModal.meta.locationError.officeLocation.lon.toFixed(
                            6
                          )}
                        </div>
                        <div>
                          <strong>Distance:</strong>{" "}
                          {Math.round(successModal.meta.locationError.distance)}{" "}
                          meters
                        </div>
                        <div>
                          <strong>Work Mode:</strong>{" "}
                          {successModal.meta.locationError.workMode}
                        </div>
                        <div>
                          <strong>Location Type:</strong>{" "}
                          {successModal.meta.locationError.locationType}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* API Response Popup Modal */}
      <Modal
        open={showApiResponsePopup}
        onClose={() => setShowApiResponsePopup(false)}
        title="🔗 Face Data Status API Response"
        actions={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowApiResponsePopup(false)}
              className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {apiResponseData && (
            <>
              {/* Success/Error Status */}
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  apiResponseData.success
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <span className="text-lg">
                  {apiResponseData.success ? "✅" : "❌"}
                </span>
                <span className="font-medium">
                  {apiResponseData.success
                    ? "API Call Successful"
                    : "API Call Failed"}
                </span>
              </div>

              {/* API Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    URL:
                  </label>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
                    {apiResponseData.url}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Timestamp:
                  </label>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    {new Date(apiResponseData.timestamp).toLocaleString()}
                  </div>
                </div>

                {apiResponseData.status && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      HTTP Status:
                    </label>
                    <div
                      className={`p-2 rounded text-xs font-mono ${
                        apiResponseData.status >= 200 &&
                        apiResponseData.status < 300
                          ? "bg-green-50 text-green-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {apiResponseData.status} {apiResponseData.statusText}
                    </div>
                  </div>
                )}

                {/* Response Data */}
                {apiResponseData.data && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Response Data:
                    </label>
                    <div className="bg-gray-50 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
                      <pre>{JSON.stringify(apiResponseData.data, null, 2)}</pre>
                    </div>
                    {/* Show interpretation of response */}
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                      <strong>Data Interpretation:</strong>
                      {apiResponseData.data.emp_id && (
                        <div>• Employee ID: {apiResponseData.data.emp_id}</div>
                      )}
                      {apiResponseData.data.has_face !== undefined && (
                        <div>
                          • Has Face:{" "}
                          {apiResponseData.data.has_face ? "Yes ✅" : "No ❌"}
                        </div>
                      )}
                      <div>
                        • Button to show:{" "}
                        {apiResponseData.data.has_face
                          ? 'Green "Capture Attendance" button'
                          : 'Amber "Register Face" button'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Information */}
                {apiResponseData.error && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {apiResponseData.errorType || "Error"}:
                    </label>
                    <div className="bg-red-50 p-3 rounded text-xs text-red-800 max-h-40 overflow-y-auto">
                      <pre>{apiResponseData.error}</pre>
                    </div>
                  </div>
                )}

                {/* Headers */}
                {apiResponseData.headers &&
                  Object.keys(apiResponseData.headers).length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Response Headers:
                      </label>
                      <div className="bg-gray-50 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                        <pre>
                          {JSON.stringify(apiResponseData.headers, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
              </div>
            </>
          )}
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

// ---- Attendance Module with Integrated Sidebar Layout ----------------------
export function AttendanceLeaveModuleLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const attendanceMenuItems = [
    {
      id: "dashboard",
      label: "Attendance Dashboard",
      icon: Clock,
      path: "/attendance",
    },
    {
      id: "daily",
      label: "Daily View",
      icon: Calendar,
      path: "/attendance/daily",
    },
    {
      id: "monthly",
      label: "Monthly Calendar",
      icon: CalendarIcon,
      path: "/attendance/monthly",
    },
    {
      id: "summary",
      label: "Summary Report",
      icon: BarChart3,
      path: "/attendance/summary",
    },
    {
      id: "manual-update",
      label: "Manual Update",
      icon: Edit,
      path: "/attendance/manual-update",
    },
    {
      id: "import",
      label: "Import Data",
      icon: Upload,
      path: "/attendance/import",
    },
    {
      id: "holidays",
      label: "Holidays",
      icon: Calendar,
      path: "/attendance/holidays",
    },
    {
      id: "metrics",
      label: "Metrics",
      icon: TrendingUp,
      path: "/attendance/metrics",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Main Sidebar Component */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Attendance Module Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Attendance Module Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Attendance & Leave Management
              </h1>
              <p className="text-sm text-gray-600">
                Track attendance, manage leave requests, and view reports
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Sub-Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <nav className="flex space-x-1 overflow-x-auto">
            {attendanceMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={classNames(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area with Outlet */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// ---- Standalone Attendance Dashboard (for use within sidebar layout) -------
export function AttendanceContent() {
  return <EmployeeDashboard />;
}

// ---- Attendance Sub-Pages ---------------------------------------------------
export function AttendanceDailyContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Attendance View</h2>
        <p className="text-gray-600">
          Daily attendance tracking and management interface.
        </p>
        {/* Add your daily attendance content here */}
      </div>
    </div>
  );
}

export function AttendanceMonthlyContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Attendance Calendar
        </h2>
        <p className="text-gray-600">
          Monthly view of attendance with calendar interface.
        </p>
        {/* Add your monthly calendar content here */}
      </div>
    </div>
  );
}

export function AttendanceSummaryContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Attendance Summary Report
        </h2>
        <p className="text-gray-600">
          Comprehensive attendance reports and analytics.
        </p>
        {/* Add your summary report content here */}
      </div>
    </div>
  );
}

export function AttendanceManualUpdateContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Manual Attendance Update</h2>
        <p className="text-gray-600">
          Manually update attendance records and corrections.
        </p>
        {/* Add your manual update content here */}
      </div>
    </div>
  );
}

export function AttendanceImportContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Import Attendance Data</h2>
        <p className="text-gray-600">
          Import attendance data from external sources.
        </p>
        {/* Add your import functionality here */}
      </div>
    </div>
  );
}

export function AttendanceHolidaysContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Holiday Calendar</h2>
        <p className="text-gray-600">
          Manage company holidays and special dates.
        </p>
        {/* Add your holiday calendar content here */}
      </div>
    </div>
  );
}

export function AttendanceMetricsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Attendance Metrics Dashboard
        </h2>
        <p className="text-gray-600">
          Advanced analytics and metrics for attendance data.
        </p>
        {/* Add your metrics dashboard content here */}
      </div>
    </div>
  );
}

// ---- Shell (role switch for demo) ------------------------------------------
// Demo shell for local testing only. Do NOT use in production routing.
export default function AttendanceLeaveModule() {
  // ...existing code from your AttendanceLeaveModule implementation...
}

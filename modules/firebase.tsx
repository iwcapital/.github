import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: "AIzaSyBArP8QxtVEUIY6lpbQfJiQEqeG2N59sqY",
    authDomain: "iwcapital.firebaseapp.com",
    projectId: "iwcapital",
    storageBucket: "iwcapital.firebasestorage.app",
    messagingSenderId: "495892776074",
    appId: "1:495892776074:web:5388f36933f3d340499973",
    measurementId: "G-JYTPQYV4F6"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const performance = getPerformance(app);

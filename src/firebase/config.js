// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAgKrM7xfKyt4OxsQKx2cOtXnzARRODXlY",
    authDomain: "firsttestqilv.firebaseapp.com",
    projectId: "firsttestqilv",
    storageBucket: "firsttestqilv.firebasestorage.app",
    messagingSenderId: "316467497114",
    appId: "1:316467497114:web:7216b90e8f470be886f723",
    measurementId: "G-KWYPSRHQT2"
};

// 初始化 Firebase 应用程序
const app = initializeApp(firebaseConfig);

// 获取 Firestore 数据库实例
export const db = getFirestore(app);
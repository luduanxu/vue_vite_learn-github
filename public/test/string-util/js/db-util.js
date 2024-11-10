// 定义数据库名称和版本
const dbName = "jsonDataDb";
const dbVersion = 1;
const dataTbName = "tbData";
let db;

// 初始化数据库
async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(dbName, dbVersion);

        request.onerror = function (event) {
            reject(event.target.error);
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve();
        };

        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            db.createObjectStore(dataTbName, {keyPath: "name"});
        };
    });
}

// 写入数据的函数
async function writeData(data) {
    try {
        await initIndexedDB();

        let transaction = db.transaction([dataTbName], "readwrite");

        transaction.oncomplete = function () {
            console.log("Transaction completed.");
        };

        transaction.onerror = function (event) {
            console.error("Transaction error:", event.target.error);
        };

        let objectStore = transaction.objectStore(dataTbName);

        // 使用 `name` 作为主键
        let request = objectStore.put(data);

        request.onsuccess = function () {
            console.log("Data added to the database.");
        };

        request.onerror = function (event) {
            console.error("Failed to add data:", event.target.error);
        };
    } catch (error) {
        console.error("Error initializing IndexedDB:", error);
    }
}

// 查询所有数据的函数
async function getAllData() {
    try {
        await initIndexedDB();

        let transaction = db.transaction([dataTbName], "readonly");
        transaction.oncomplete = function () {
            console.log("Transaction completed.");
        };
        transaction.onerror = function (event) {
            console.error("Transaction error:", event.target.error);
        };

        let objectStore = transaction.objectStore(dataTbName);
        let allData = [];

        // 使用Promise来等待数据收集完成
        return new Promise((resolve) => {
            objectStore.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    allData.push(cursor.value); // 存储查询结果
                    cursor.continue(); // 继续查询下一个记录
                } else {
                    // 当所有记录都被遍历后，解析Promise
                    resolve(allData);
                }
            };
        });
    } catch (error) {
        console.error("Error getting all data from IndexedDB:", error);
        throw error;
    }
}

// 删除特定数据的函数
async function deleteData(key) {
    try {
        await initIndexedDB();

        let transaction = db.transaction([dataTbName], "readwrite");

        transaction.oncomplete = function() {
            console.log("Transaction completed.");
        };

        transaction.onerror = function(event) {
            console.error("Transaction error:", event.target.error);
        };

        let objectStore = transaction.objectStore(dataTbName);

        // 使用 `key` 来删除数据
        let request = objectStore.delete(key);

        request.onsuccess = function() {
            console.log("Data deleted from the database.");
        };

        request.onerror = function(event) {
            console.error("Failed to delete data:", event.target.error);
        };
    } catch (error) {
        console.error("Error initializing IndexedDB:", error);
    }
}


// 修改特定数据的函数 Error initializing IndexedDB: DataCloneError: Failed to execute 'put' on 'IDBObjectStore': #<Object> could not be cloned.
//     at updateData (db-util.js:148:35)
async function updateData(updatedData) {
    try {
        await initIndexedDB();

        console.log("Attempting to update data:", updatedData); // 添加调试输出
        console.log("Attempting to update data:", JSON.stringify(updatedData)); // 添加调试输出

        let transaction = db.transaction([dataTbName], "readwrite");

        transaction.oncomplete = function() {
            console.log("Transaction completed.");
        };

        transaction.onerror = function(event) {
            console.error("Transaction error:", event.target.error);
        };

        let objectStore = transaction.objectStore(dataTbName);

        // 使用 `name` 作为主键来更新数据
        let request = objectStore.put(updatedData);

        request.onsuccess = function() {
            console.log("Data updated in the database.");
        };

        request.onerror = function(event) {
            console.error("Failed to update data:", event.target.error);
        };
    } catch (error) {
        console.error("Error initializing IndexedDB:", error);
    }
}

// 导出数据到文件
async function exportData() {
    try {
        const allData = await getAllData();
        const jsonData = JSON.stringify(allData);
        const blob = new Blob([jsonData], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exported_data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Data exported to file.");
    } catch (error) {
        console.error("Error exporting data:", error);
    }
}

// 导入数据从文件
async function importData(fileInput) {
    try {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = async function(e) {
            const content = e.target.result;
            const importedData = JSON.parse(content);
            for (let data of importedData) {
                await writeData(data);
            }
            console.log("Data imported successfully.");
        };
        reader.onerror = function(error) {
            console.error("Error reading file:", error);
        };
        reader.readAsText(file);
    } catch (error) {
        console.error("Error importing data:", error);
    }
}
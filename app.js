
// ==========================================
// ELDERCARE WEB APP
// Firebase Realtime Database
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    push,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyApIoRhGU714Fv4GLC4remucT-StXMXWjE",

    authDomain:
        "eldercare-de234.firebaseapp.com",

    databaseURL:
        "https://eldercare-de234-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "eldercare-de234",

    storageBucket:
        "eldercare-de234.firebasestorage.app",

    messagingSenderId:
        "162372032696",

    appId:
        "1:162372032696:web:6540a4ef34626542d37c4d",

    measurementId:
        "G-MSDHSNF15W"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


// ==========================================
// HTML ELEMENTS
// ==========================================

// Connection
const connectionDot =
    document.getElementById("connectionDot");

const connectionText =
    document.getElementById("connectionText");


// Current Health
const heartRateEl =
    document.getElementById("heartRate");

const spo2El =
    document.getElementById("spo2");


// Fall
const fallCard =
    document.getElementById("fallCard");

const fallStatusEl =
    document.getElementById("fallStatus");


// Updated
const lastUpdatedEl =
    document.getElementById("lastUpdated");


// Device Status
const wifiStatusEl =
    document.getElementById("wifiStatus");

const mpuStatusEl =
    document.getElementById("mpuStatus");

const max30102StatusEl =
    document.getElementById("max30102Status");

const fingerStatusEl =
    document.getElementById("fingerStatus");


// History
const historyList =
    document.getElementById("historyList");

const refreshBtn =
    document.getElementById("refreshBtn");


// Caretaker
const caretakerPhoneInput =
    document.getElementById("caretakerPhone");

const saveCaretakerBtn =
    document.getElementById("saveCaretakerBtn");

const caretakerMessage =
    document.getElementById("caretakerMessage");


// Medication
const medicineNameInput =
    document.getElementById("medicineName");

const medicineTimeInput =
    document.getElementById("medicineTime");

const addReminderBtn =
    document.getElementById("addReminderBtn");

const reminderMessage =
    document.getElementById("reminderMessage");

const reminderList =
    document.getElementById("reminderList");


// ==========================================
// FIREBASE CONNECTION STATUS
// ==========================================

const connectionRef =
    ref(db, ".info/connected");


onValue(connectionRef, (snapshot) => {

    const connected = snapshot.val() === true;


    if (connected) {

        connectionDot.classList.remove("offline");
        connectionDot.classList.add("connected");

        connectionText.textContent =
            "Connected";

    } else {

        connectionDot.classList.remove("connected");
        connectionDot.classList.add("offline");

        connectionText.textContent =
            "Disconnected";
    }
});


// ==========================================
// CURRENT HEALTH DATA
// ==========================================

const currentRef =
    ref(db, "ElderCare/current");


onValue(currentRef, (snapshot) => {

    const data = snapshot.val();


    if (!data) {

        heartRateEl.textContent = "--";
        spo2El.textContent = "--";
        fallStatusEl.textContent = "--";
        lastUpdatedEl.textContent = "--";

        wifiStatusEl.textContent = "--";
        mpuStatusEl.textContent = "--";
        max30102StatusEl.textContent = "--";
        fingerStatusEl.textContent = "--";

        return;
    }


    // ======================================
    // HEART RATE
    // ======================================

    heartRateEl.textContent =
        data.heartRate ?? "--";


    // ======================================
    // SPO2
    // ======================================

    spo2El.textContent =
        data.spo2 ?? "--";


    // ======================================
    // FALL STATUS
    // ======================================

    const fallStatus =
        data.fallStatus ?? "Normal";


    fallStatusEl.textContent =
        fallStatus;


    if (
        fallStatus === "FALL DETECTED"
    ) {

        fallCard.classList.remove(
            "fall-normal"
        );

        fallCard.classList.add(
            "fall-danger"
        );

        fallStatusEl.classList.remove(
            "normal"
        );

        fallStatusEl.classList.add(
            "danger"
        );

    } else {

        fallCard.classList.remove(
            "fall-danger"
        );

        fallCard.classList.add(
            "fall-normal"
        );

        fallStatusEl.classList.remove(
            "danger"
        );

        fallStatusEl.classList.add(
            "normal"
        );
    }


    // ======================================
    // LAST UPDATED
    // ======================================

    lastUpdatedEl.textContent =
        data.timestamp ?? "--";


    // ======================================
    // WIFI STATUS
    // ======================================

    wifiStatusEl.textContent =
        data.wifiStatus ?? "--";


    // ======================================
    // MPU6050
    // ======================================

    mpuStatusEl.textContent =
        data.mpuStatus ?? "--";


    // ======================================
    // MAX30102
    // ======================================

    max30102StatusEl.textContent =
        data.max30102Status ?? "--";


    // ======================================
    // FINGER
    // ======================================

    fingerStatusEl.textContent =
        data.fingerStatus ?? "--";

});


// ==========================================
// LOAD CARETAKER NUMBER
// ==========================================

const caretakerRef =
    ref(db, "ElderCare/settings/caretakerPhone");


onValue(caretakerRef, (snapshot) => {

    const phone =
        snapshot.val();


    if (phone) {

        caretakerPhoneInput.value =
            phone;
    }
});


// ==========================================
// SAVE CARETAKER PHONE
// ==========================================

saveCaretakerBtn.addEventListener(
    "click",
    async () => {

        let phone =
            caretakerPhoneInput.value.trim();


        // Empty
        if (!phone) {

            caretakerMessage.textContent =
                "Please enter a WhatsApp number.";

            caretakerMessage.style.color =
                "red";

            return;
        }


        // Remove + spaces - brackets
        phone =
            phone.replace(
                /[^0-9]/g,
                ""
            );


        // Validate
        if (
            !/^[0-9]{8,15}$/.test(phone)
        ) {

            caretakerMessage.textContent =
                "Please enter a valid phone number.";

            caretakerMessage.style.color =
                "red";

            return;
        }


        try {

            await set(
                caretakerRef,
                phone
            );


            caretakerMessage.textContent =
                "Caretaker number saved successfully.";

            caretakerMessage.style.color =
                "green";


        } catch (error) {

            console.error(
                "Save caretaker error:",
                error
            );


            caretakerMessage.textContent =
                "Failed to save caretaker number.";

            caretakerMessage.style.color =
                "red";
        }
    }
);


// ==========================================
// LOAD MEDICATION REMINDERS
// ==========================================

const remindersRef =
    ref(
        db,
        "ElderCare/settings/medicationReminders"
    );


onValue(remindersRef, (snapshot) => {

    const data =
        snapshot.val();


    renderReminders(
        data
    );
});


// ==========================================
// RENDER MEDICATION REMINDERS
// ==========================================

function renderReminders(data)
{
    reminderList.innerHTML = "";


    if (!data) {

        reminderList.innerHTML =
            '<p class="empty">No medication reminders yet.</p>';

        return;
    }


    const reminders =
        Object.entries(data);


    if (reminders.length === 0) {

        reminderList.innerHTML =
            '<p class="empty">No medication reminders yet.</p>';

        return;
    }


    reminders.forEach(
        ([id, reminder]) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "reminder-item";


            const medicineName =
                reminder.medicineName
                ?? "Unknown medicine";


            const time =
                reminder.time
                ?? "--:--";


            item.innerHTML = `

                <div class="reminder-info">

                    <strong>
                        ${escapeHtml(medicineName)}
                    </strong>

                    <span>
                        ⏰ ${escapeHtml(time)}
                    </span>

                </div>

                <button
                    class="delete-reminder"
                    data-id="${id}">
                    Delete
                </button>
            `;


            reminderList.appendChild(
                item
            );
        }
    );


    // Delete buttons
    document
        .querySelectorAll(
            ".delete-reminder"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;


                        try {

                            await remove(
                                ref(
                                    db,
                                    "ElderCare/settings/medicationReminders/" +
                                    id
                                )
                            );

                        } catch (error) {

                            console.error(
                                "Delete reminder error:",
                                error
                            );
                        }
                    }
                );
            }
        );
}


// ==========================================
// ADD MEDICATION REMINDER
// ==========================================

addReminderBtn.addEventListener(
    "click",
    async () => {

        const medicineName =
            medicineNameInput.value.trim();


        const medicineTime =
            medicineTimeInput.value;


        // Check medicine name
        if (!medicineName) {

            reminderMessage.textContent =
                "Please enter the medicine name.";

            reminderMessage.style.color =
                "red";

            return;
        }


        // Check time
        if (!medicineTime) {

            reminderMessage.textContent =
                "Please select a reminder time.";

            reminderMessage.style.color =
                "red";

            return;
        }


        try {

            const newReminderRef =
                push(remindersRef);


            await set(
                newReminderRef,
                {
                    medicineName:
                        medicineName,

                    time:
                        medicineTime
                }
            );


            // Clear input
            medicineNameInput.value =
                "";

            medicineTimeInput.value =
                "";


            reminderMessage.textContent =
                "Medication reminder added successfully.";

            reminderMessage.style.color =
                "green";


        } catch (error) {

            console.error(
                "Add reminder error:",
                error
            );


            reminderMessage.textContent =
                "Failed to add medication reminder.";

            reminderMessage.style.color =
                "red";
        }
    }
);


// ==========================================
// HEALTH HISTORY
// ==========================================

const historyRef =
    ref(
        db,
        "ElderCare/history"
    );


onValue(historyRef, (snapshot) => {

    const data =
        snapshot.val();


    renderHistory(
        data
    );
});


// ==========================================
// RENDER HISTORY
// ==========================================

function renderHistory(data)
{
    historyList.innerHTML = "";


    if (!data) {

        historyList.innerHTML =
            '<p class="empty">No health history yet.</p>';

        return;
    }


    const records =
        Object.entries(data);


    if (records.length === 0) {

        historyList.innerHTML =
            '<p class="empty">No health history yet.</p>';

        return;
    }


    // Newest first
    records.sort(
        (a, b) => {

            const timeA =
                new Date(
                    a[1].timestamp ?? 0
                ).getTime();


            const timeB =
                new Date(
                    b[1].timestamp ?? 0
                ).getTime();


            return timeB - timeA;
        }
    );


    // Show latest 20
    const latestRecords =
        records.slice(
            0,
            20
        );


    latestRecords.forEach(
        ([id, record]) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            item.innerHTML = `

                <div class="history-time">
                    🕐
                    ${escapeHtml(
                        record.timestamp ?? "--"
                    )}
                </div>

                <div class="history-data">

                    <span>
                        ❤️ HR:
                        <strong>
                            ${escapeHtml(
                                String(
                                    record.heartRate ?? "--"
                                )
                            )}
                            BPM
                        </strong>
                    </span>

                    <span>
                        🫁 SpO₂:
                        <strong>
                            ${escapeHtml(
                                String(
                                    record.spo2 ?? "--"
                                )
                            )}
                            %
                        </strong>
                    </span>

                    <span>
                        🚨 Fall:
                        <strong>
                            ${escapeHtml(
                                record.fallStatus ?? "--"
                            )}
                        </strong>
                    </span>

                    <span>
                        👆 Finger:
                        <strong>
                            ${escapeHtml(
                                record.fingerStatus ?? "--"
                            )}
                        </strong>
                    </span>

                    <span>
                        🔧 MPU6050:
                        <strong>
                            ${escapeHtml(
                                record.mpuStatus ?? "--"
                            )}
                        </strong>
                    </span>

                </div>
            `;


            historyList.appendChild(
                item
            );
        }
    );
}


// ==========================================
// REFRESH BUTTON
// ==========================================

refreshBtn.addEventListener(
    "click",
    () => {

        refreshBtn.textContent =
            "✓ Updated";

        setTimeout(
            () => {

                refreshBtn.textContent =
                    "↻ Refresh";

            },
            1000
        );
    }
);


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value)
{
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// START MESSAGE
// ==========================================

console.log(
    "ElderCare Web App started."
);

console.log(
    "Firebase Project: eldercare-de234"
);

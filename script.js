// Initialize based on Page
document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
    setupCheckBalanceEvents();

    // Check for history container
    if (document.getElementById('historyList')) {
        loadHistory();
    }
});

let holdTimer;

function setupCheckBalanceEvents() {
    const btn = document.getElementById('checkBalanceBtn');
    if (!btn) return;

    // Click for PIN (Redirect to PIN Page)
    btn.addEventListener('click', () => {
        window.location.href = "pin.html";
    });

    // Long Press for Reset (Mouse)
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('mouseup', endHold);
    btn.addEventListener('mouseleave', endHold);

    // Long Press for Reset (Touch)
    btn.addEventListener('touchstart', startHold);
    btn.addEventListener('touchend', endHold);
}

function startHold() {
    holdTimer = setTimeout(() => {
        resetBalance();
    }, 5000); // 5 Seconds
}

function endHold() {
    clearTimeout(holdTimer);
}

function resetBalance() {
    localStorage.setItem('walletBalance', 11650);
    alert("Balance Reset to ₹11,650 Successfully!");
    loadBalance(); // Refresh if on page
    window.location.reload();
}

function loadBalance() {
    let balance = localStorage.getItem('walletBalance');
    if (balance === null) {
        balance = 11650; // New Default Balance
        localStorage.setItem('walletBalance', balance);
    }

    // Balance Page Big Display
    let bigDisplay = document.getElementById('gpayBalance');
    if (bigDisplay) bigDisplay.innerText = `₹${balance}`;
}

function setAmount(val) {
    document.getElementById('amountInput').value = val;
    validateAmount();
}

function addAmount(val) {
    let current = parseInt(document.getElementById('amountInput').value) || 0;
    let newVal = current + val;
    document.getElementById('amountInput').value = newVal;
    validateAmount();
}

function validateAmount() {
    let input = document.getElementById('amountInput');
    if (!input) return false;

    let val = parseInt(input.value) || 0;
    let errorText = document.getElementById('errorText');

    if (val < 10 || val > 5000) {
        errorText.style.display = 'block';
        return false;
    } else {
        errorText.style.display = 'none';
        return true;
    }
}

function proceedToPay() {
    if (validateAmount()) {
        let amount = parseInt(document.getElementById('amountInput').value);
        let currentBal = parseInt(localStorage.getItem('walletBalance'));

        if (currentBal >= amount) {
            let newBal = currentBal - amount;
            localStorage.setItem('walletBalance', newBal);
            addToHistory(amount);
            window.location.href = `redeem.html?amount=${amount}`;
        } else {
            alert("Insufficient Balance! Recharge your wallet.");
        }
    } else {
        alert("Please enter a valid amount between ₹10 and ₹5000");
    }
}

function addToHistory(amount) {
    let transactions = JSON.parse(localStorage.getItem('redeemHistory') || '[]');
    let date = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); // Jul 1

    // Store
    transactions.unshift({ amount: amount, date: date, fullDate: new Date().toLocaleString(), status: "Success" });

    localStorage.setItem('redeemHistory', JSON.stringify(transactions));
}

function loadHistory() {
    let list = document.getElementById('historyList');
    if (!list) return;

    let transactions = JSON.parse(localStorage.getItem('redeemHistory') || '[]');

    list.innerHTML = "";

    if (transactions.length === 0) {
        list.style.textAlign = "center";
        list.style.padding = "20px";
        list.style.color = "#888";
        list.innerHTML = "No recent activity";
        return;
    }

    // Google Play Colors Icon
    const googlePlayColors = `<svg viewBox="0 0 24 24" style="width:24px;height:24px;"><path fill="#EA4335" d="M4.5 17.5L3 18.9V5.1L4.5 6.5l5.9 5.2-1.9 1.9-4 3.9z"></path><path fill="#FBBC04" d="M4.5 17.5l4-3.9 1.9 1.9 1.8 1.8L4.6 21c-.4.2-.1-3.5-.1-3.5z"></path><path fill="#34A853" d="M12.2 15.5l-1.8-1.8-1.9-1.9 6-6.1 4.7 2.7c.9.5.9 1.4 0 1.9L12.2 15.5z"></path><path fill="#4285F4" d="M4.5 6.5L14.5 2.2c.4-.2.8-.2.9.1l-4.9 2.8-6 6.1v-4.7z"></path></svg>`;

    transactions.forEach(t => {
        let item = `
            <div class="history-item">
                <div class="hist-icon">${googlePlayColors}</div>
                <div class="hist-details">
                    <div class="hist-title">Google Play</div>
                    <div class="hist-time">${t.date} • Free Fire</div>
                </div>
                <div class="hist-amount">₹${t.amount}.00</div>
            </div>
        `;
        list.innerHTML += item;
    });
}

function goBack() {
    window.history.back();
}

let amtInput = document.getElementById('amountInput');
if (amtInput) {
    amtInput.addEventListener('input', validateAmount);
}

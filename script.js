const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const expenses = [
  "food",
  "drink",
  "transportation",
  "housing",
  "education",
  "entertainment",
  "healthcare",
  "clothing",
  "miscellaneous",
];
const incomes = [
  "salary",
  "pocket money",
  "interest income",
  "bonus",
  "gifts",
  "other income",
];

//last
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//5
//Add Transaction
function addTransaction(e) {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const amountValue = +amount.value;

  if (isNaN(amountValue) || amountValue === 0) {
    alert("Please enter a valid amount");
    return;
  }

  // Check if the selected category matches any expense category
  if (expenses.includes(category.toLowerCase())) {
    transactions.push({
      id: generateID(),
      text: category,
      amount: -amountValue, // Minus the amount for expenses
    });
  }
  // Check if the selected category matches any income category
  else if (incomes.includes(category.toLowerCase())) {
    transactions.push({
      id: generateID(),
      text: category,
      amount: amountValue, // Plus the amount for income
    });
  } else {
    alert("Invalid category");
    return;
  }

  addTransactionDOM(transactions[transactions.length - 1]); // Pass the last transaction added
  updateValues();
  updateLocalStorage();
  amount.value = "";
}

//5.5
//Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

//2

//Add Trasactions to DOM list
function addTransactionDOM(transaction) {
  const item = document.createElement("li");

  // Add class based on the type of transaction
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // Determine the transaction type and adjust the amount accordingly
  const adjustedAmount =
    transaction.type === "expense" ? -transaction.amount : transaction.amount;

  // Display the transaction details in the list item
  item.innerHTML = `
      ${transaction.text} <span>${adjustedAmount}</span>
      <button class="delete-button" onclick="removeTransaction(${transaction.id})">x</button>
      `;
  list.appendChild(item);
}

//4

//Update the balance income and expence
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `₹${income}`;
  money_plus.innerText = `₹${total}`;
  money_minus.innerText = `₹${expense}`;
}

//6

//Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  Init();
}
//last
//update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//3

//Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();

form.addEventListener("submit", addTransaction);

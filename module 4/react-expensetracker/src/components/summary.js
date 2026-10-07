import React from 'react';

function ExpenseSummary({ transactions }) {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expense;

  return (
    <section className="summary">
      <h2>Expense Tracker</h2>

      <div className="summary-box">
        <div className="balance">
          <p>YOUR BALANCE</p>
          <h1>${balance.toFixed(2)}</h1>
        </div>

        <h3>SUMMARY</h3>

        <div className="income-expense">
          <div>
            <h4>INCOME</h4>
            <p className="income">${income.toFixed(2)}</p>
          </div>

          <div>
            <h4>EXPENSE</h4>
            <p className="expense">${expense.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExpenseSummary;
import React from 'react';

function ExpenseList({ transactions, setTransactions }) {
  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updatedTransactions);
  };

  return (
    <section className="expense-list">
      <h2>History</h2>

      <h3>EXPENSE LIST</h3>

      {transactions.map((transaction) => (
        <div
          className={`transaction ${
            transaction.type === 'income' ? 'income-item' : 'expense-item'
          }`}
          key={transaction.id}
        >
          <span>{transaction.title}</span>

          <span>
            {transaction.type === 'income' ? '+' : '-'}
            ${transaction.amount.toFixed(2)}

            <button onClick={() => deleteTransaction(transaction.id)}>
              Delete
            </button>
          </span>
        </div>
      ))}
    </section>
  );
}

export default ExpenseList;
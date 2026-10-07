import React, { useState } from 'react';

function AddExpense({ transactions, setTransactions }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');

  const addTransaction = () => {
    if (title.trim() === '' || amount === '' || type === '') {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title: title,
      amount: Number(amount),
      type: type
    };

    setTransactions([...transactions, newTransaction]);

    setTitle('');
    setAmount('');
    setType('');
  };

  return (
    <section className="add-expense">
      <h2>Add new transaction</h2>

      <h3>ADD EXPENSE</h3>

      <div className="form-box">
        <label>Title</label>

        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Amount</label>

        <input
          type="number"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="radio-option">
          <input
            type="radio"
            name="transactionType"
            value="income"
            checked={type === 'income'}
            onChange={(e) => setType(e.target.value)}
          />
          <span>Income</span>
        </div>

        <div className="radio-option">
          <input
            type="radio"
            name="transactionType"
            value="expense"
            checked={type === 'expense'}
            onChange={(e) => setType(e.target.value)}
          />
          <span>Expense</span>
        </div>

        <button onClick={addTransaction}>
          Add transaction
        </button>
      </div>
    </section>
  );
}

export default AddExpense;
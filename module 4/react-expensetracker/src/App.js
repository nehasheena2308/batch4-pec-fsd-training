import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ExpenseSummary from './components/summary';
import ExpenseList from './components/expenselist';
import AddExpense from './components/addexpense';

import './App.css';

function App() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: 'Groceries',
      amount: 50,
      type: 'expense'
    },
    {
      id: 2,
      title: 'Salary',
      amount: 2300,
      type: 'income'
    },
    {
      id: 3,
      title: 'Phone',
      amount: 1000,
      type: 'expense'
    }
  ]);

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <div className="expense-tracker">

              <ExpenseSummary
                transactions={transactions}
              />

              <ExpenseList
                transactions={transactions}
                setTransactions={setTransactions}
              />

              <AddExpense
                transactions={transactions}
                setTransactions={setTransactions}
              />

            </div>
          }
        />

        <Route
          path="/add"
          element={
            <div className="expense-tracker">

              <AddExpense
                transactions={transactions}
                setTransactions={setTransactions}
              />

            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
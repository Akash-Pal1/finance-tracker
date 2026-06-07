import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000"

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 })
  const [form, setForm] = useState({ amount: "", type: "income", category: "", description: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [txRes, sumRes] = await Promise.all([
      axios.get(`${API}/transactions`),
      axios.get(`${API}/summary`)
    ])
    setTransactions(txRes.data)
    setSummary(sumRes.data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      await axios.post(`${API}/transactions`, {
        ...form,
        amount: parseFloat(form.amount)
      })
      setForm({ amount: "", type: "income", category: "", description: "" })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || "Something went wrong")
    }
  }

  async function handleDelete(id) {
    await axios.delete(`${API}/transactions/${id}`)
    fetchData()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Finance Tracker</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Balance</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{summary.balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.total_income.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{summary.total_expenses.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Category (e.g. salary, food, rent)"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="col-span-2 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 p-6 pb-4">Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No transactions yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {transactions.map(t => (
                <li key={t.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 capitalize">{t.category}</p>
                    <p className="text-xs text-gray-400">{t.description || "—"} · {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
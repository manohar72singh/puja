const RevenueCard = ({ title, amount }) => {
  return (
    <div className="bg-green-600 text-white p-6 rounded-xl shadow">
      <h3>{title}</h3>
      <p className="text-3xl font-bold mt-2">₹ {amount}</p>
    </div>
  );
};

export default RevenueCard;

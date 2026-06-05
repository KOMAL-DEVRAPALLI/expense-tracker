import Member from "../models/member.model.js";
import Deposit from "../models/deposit.model.js";
import Expense from "../models/expense.model.js";

export const getSummary = async (req, res) => {
  try {
    const members = await Member.find();
    const deposits = await Deposit.find();
    const expenses = await Expense.find();

    const totalMembers = members.length;

    if (totalMembers === 0) {
      return res.status(400).json({
        success: false,
        message: "No members found",
      });
    }

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const expenseShare = totalExpense / totalMembers;

    const summary = members.map((member) => {
      const memberDeposits = deposits.filter(
        (deposit) =>
          deposit.memberId.toString() === member._id.toString()
      );

      const totalDeposit = memberDeposits.reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      );

      const balance = totalDeposit - expenseShare;

      return {
        memberId: member._id,
        name: member.name,
        totalDeposit,
        expenseShare,
        balance,
      };
    });

    res.status(200).json({
      success: true,
      totalMembers,
      totalExpense,
      expenseShare,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
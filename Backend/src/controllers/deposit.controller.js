import Deposit from "../models/deposit.model.js";
import Member from "../models/member.model.js";

export const createDeposit = async (req, res) => {
  try {
    const { memberId, amount } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Member ID and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const deposit = await Deposit.create({
      memberId,
      amount,
    });

    res.status(201).json({
      success: true,
      data: deposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate("memberId", "name");

    res.status(200).json({
      success: true,
      count: deposits.length,
      data: deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
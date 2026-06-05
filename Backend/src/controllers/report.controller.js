import PDFDocument from "pdfkit";
import Member from "../models/member.model.js";
import Deposit from "../models/deposit.model.js";
import Expense from "../models/expense.model.js";

export const generatePdfReport = async (req, res) => {
  try {
    const members = await Member.find();
    const deposits = await Deposit.find();
    const expenses = await Expense.find();

    const totalMembers = members.length;

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const expenseShare =
      totalMembers > 0
        ? totalExpense / totalMembers
        : 0;

    const summary = members.map((member) => {
      const memberDeposits = deposits.filter(
        (deposit) =>
          deposit.memberId.toString() ===
          member._id.toString()
      );

      const totalDeposit = memberDeposits.reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      );

      const balance =
        totalDeposit - expenseShare;

      return {
        name: member.name,
        totalDeposit,
        expenseShare,
        balance,
      };
    });

    const surplusMembers = summary.filter(
      (member) => member.balance > 0
    );

    const deficitMembers = summary.filter(
      (member) => member.balance < 0
    );

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="expense-report.pdf"'
    );

    doc.pipe(res);

    // ==========================
    // TITLE
    // ==========================

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("TRIP EXPENSE SUMMARY", {
        align: "center",
      });

    doc.moveDown(2);

    // ==========================
    // OVERVIEW
    // ==========================

    doc.fontSize(12).font("Helvetica");

    doc.text(`Total Members: ${totalMembers}`);
    doc.text(
      `Total Expense: Rs. ${totalExpense.toFixed(2)}`
    );
    doc.text(
      `Expense Share Per Member: Rs. ${expenseShare.toFixed(
        2
      )}`
    );

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(560, doc.y)
      .stroke();

    doc.moveDown();

    // ==========================
    // TABLE HEADER
    // ==========================

    let y = doc.y;

    doc.font("Helvetica-Bold");

    doc.text("Member", 50, y);
    doc.text("Deposit", 180, y);
    doc.text("Share", 320, y);
    doc.text("Balance", 450, y);

    y += 20;

    doc
      .moveTo(50, y)
      .lineTo(560, y)
      .stroke();

    // ==========================
    // TABLE DATA
    // ==========================

    doc.font("Helvetica");

    summary.forEach((member) => {
      y += 30;

      doc.text(member.name, 50, y);

      doc.text(
        `Rs. ${member.totalDeposit.toFixed(2)}`,
        180,
        y
      );

      doc.text(
        `Rs. ${member.expenseShare.toFixed(2)}`,
        320,
        y
      );

      doc.text(
        `Rs. ${member.balance.toFixed(2)}`,
        450,
        y
      );
    });

    y += 40;

    doc
      .moveTo(50, y)
      .lineTo(560, y)
      .stroke();

    // ==========================
    // MEMBERS TO RECEIVE
    // ==========================

    y += 30;

    doc.font("Helvetica-Bold");
    doc.text("Members To Receive", 50, y);

    doc.font("Helvetica");

    if (surplusMembers.length === 0) {
      y += 20;
      doc.text("None", 70, y);
    } else {
      surplusMembers.forEach((member) => {
        y += 20;

        doc.text(
          `${member.name} : Rs. ${member.balance.toFixed(
            2
          )}`,
          70,
          y
        );
      });
    }

    // ==========================
    // MEMBERS OWING MONEY
    // ==========================

    y += 40;

    doc.font("Helvetica-Bold");
    doc.text("Members Owing Money", 50, y);

    doc.font("Helvetica");

    if (deficitMembers.length === 0) {
      y += 20;
      doc.text("None", 70, y);
    } else {
      deficitMembers.forEach((member) => {
        y += 20;

        doc.text(
          `${member.name} : Rs. ${Math.abs(
            member.balance
          ).toFixed(2)}`,
          70,
          y
        );
      });
    }

    // ==========================
    // FOOTER
    // ==========================

    y += 60;

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        `Generated On: ${new Date().toLocaleDateString()}`,
        50,
        y
      );

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
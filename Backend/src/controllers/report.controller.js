import PDFDocument from "pdfkit";
import Member from "../models/member.model.js";
import Deposit from "../models/deposit.model.js";
import Expense from "../models/expense.model.js";

export const generatePdfReport = async (req, res) => {
  try {
    const [members, deposits, expenses] = await Promise.all([
      Member.find().lean(),
      Deposit.find().lean(),
      Expense.find().lean(),
    ]);

    const totalMembers = members.length;

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const expenseShare =
      totalMembers > 0
        ? totalExpense / totalMembers
        : 0;

    const depositMap = {};

    deposits.forEach((deposit) => {
      const memberId = deposit.memberId.toString();

      depositMap[memberId] =
        (depositMap[memberId] || 0) +
        deposit.amount;
    });

    const summary = members
      .map((member) => {
        const totalDeposit =
          depositMap[member._id.toString()] || 0;

        const balance =
          totalDeposit - expenseShare;

        return {
          name: member.name,
          totalDeposit,
          expenseShare,
          balance,
        };
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );

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

    const COL1 = 50;
    const COL2 = 180;
    const COL3 = 320;
    const COL4 = 450;

    // ======================
    // TITLE
    // ======================

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("TRIP EXPENSE SUMMARY", {
        align: "center",
      });

    doc.moveDown(2);

    // ======================
    // OVERVIEW
    // ======================

    doc
      .fontSize(12)
      .font("Helvetica");

    doc.text(`Total Members: ${totalMembers}`);
    doc.text(
      `Total Expense: Rs. ${totalExpense.toFixed(
        2
      )}`
    );
    doc.text(
      `Expense Share Per Member: Rs. ${expenseShare.toFixed(
        2
      )}`
    );

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown();

    // ======================
    // TABLE HEADER
    // ======================

    let y = doc.y;

    doc.font("Helvetica-Bold");

    doc.text("Member", COL1, y);
    doc.text("Deposit", COL2, y);
    doc.text("Share", COL3, y);
    doc.text("Balance", COL4, y);

    y += 20;

    doc
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();

    doc.font("Helvetica");

    // ======================
    // TABLE DATA
    // ======================

    summary.forEach((member) => {
      y += 25;

      if (y > 720) {
        doc.addPage();
        y = 60;
      }

      doc.text(member.name, COL1, y);

      doc.text(
        `Rs. ${member.totalDeposit.toFixed(2)}`,
        COL2,
        y
      );

      doc.text(
        `Rs. ${member.expenseShare.toFixed(2)}`,
        COL3,
        y
      );

      doc.text(
        `Rs. ${member.balance.toFixed(2)}`,
        COL4,
        y
      );
    });

    doc.moveDown(2);

    // ======================
    // RECEIVABLE
    // ======================

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Members To Receive");

    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(12);

    if (!surplusMembers.length) {
      doc.text("None");
    } else {
      surplusMembers.forEach((member) => {
        doc.text(
          `${member.name} : Rs. ${member.balance.toFixed(
            2
          )}`
        );
      });
    }

    doc.moveDown();

    // ======================
    // PAYABLE
    // ======================

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Members Owing Money");

    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(12);

    if (!deficitMembers.length) {
      doc.text("None");
    } else {
      deficitMembers.forEach((member) => {
        doc.text(
          `${member.name} : Rs. ${Math.abs(
            member.balance
          ).toFixed(2)}`
        );
      });
    }

    doc.moveDown(2);

    // ======================
    // FOOTER
    // ======================

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        `Generated On: ${new Date().toLocaleDateString()}`
      );

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
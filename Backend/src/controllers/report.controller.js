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

    const totalDeposits = deposits.reduce(
      (sum, deposit) => sum + deposit.amount,
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

    const highestContributor =
      summary.length > 0
        ? summary.reduce((a, b) =>
            a.totalDeposit > b.totalDeposit
              ? a
              : b
          )
        : null;

    // ==========================
    // Settlement Calculation
    // ==========================

    const creditors = summary
      .filter((m) => m.balance > 0)
      .map((m) => ({
        name: m.name,
        amount: m.balance,
      }));

    const debtors = summary
      .filter((m) => m.balance < 0)
      .map((m) => ({
        name: m.name,
        amount: Math.abs(m.balance),
      }));

    const settlements = [];

    let i = 0;
    let j = 0;

    while (
      i < debtors.length &&
      j < creditors.length
    ) {
      const amount = Math.min(
        debtors[i].amount,
        creditors[j].amount
      );

      settlements.push({
        from: debtors[i].name,
        to: creditors[j].name,
        amount,
      });

      debtors[i].amount -= amount;
      creditors[j].amount -= amount;

      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    // ==========================
    // PDF Setup
    // ==========================

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="trip-expense-report.pdf"'
    );

    doc.pipe(res);

    // ==========================
    // Header
    // ==========================

    doc
      .rect(
        0,
        0,
        doc.page.width,
        80
      )
      .fill("#1f2937");

    doc
      .fillColor("white")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        "TRIP EXPENSE REPORT",
        40,
        28,
        {
          align: "center",
        }
      );

    doc.fillColor("black");

    let y = 100;

    // ==========================
    // Overview
    // ==========================

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Overview", 40, y);

    y += 25;

    doc
      .fontSize(11)
      .font("Helvetica");

    doc.text(
      `Total Members: ${totalMembers}`,
      50,
      y
    );

    doc.text(
      `Total Deposits: Rs. ${totalDeposits.toFixed(
        2
      )}`,
      250,
      y
    );

    y += 20;

    doc.text(
      `Total Expense: Rs. ${totalExpense.toFixed(
        2
      )}`,
      50,
      y
    );

    doc.text(
      `Expense Share: Rs. ${expenseShare.toFixed(
        2
      )}`,
      250,
      y
    );

    y += 20;

    if (highestContributor) {
      doc.text(
        `Highest Contributor: ${highestContributor.name}`,
        50,
        y
      );
    }

    y += 35;

    // ==========================
    // Member Summary
    // ==========================

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Member Summary", 40, y);

    y += 30;

    const COL1 = 50;
    const COL2 = 200;
    const COL3 = 320;
    const COL4 = 450;

    // Header Row

    doc
      .rect(45, y - 5, 500, 25)
      .fill("#374151");

    doc.fillColor("white");

    doc.text("Member", COL1, y);
    doc.text("Deposit", COL2, y);
    doc.text("Share", COL3, y);
    doc.text("Balance", COL4, y);

    doc.fillColor("black");

    y += 30;

    summary.forEach((member, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      if (index % 2 === 0) {
        doc
          .rect(45, y - 3, 500, 22)
          .fill("#f5f5f5");
      }

      doc.fillColor("black");

      doc.text(member.name, COL1, y);

      doc.text(
        member.totalDeposit.toFixed(2),
        COL2,
        y
      );

      doc.text(
        member.expenseShare.toFixed(2),
        COL3,
        y
      );

      doc.fillColor(
        member.balance >= 0
          ? "green"
          : "red"
      );

      doc.text(
        member.balance.toFixed(2),
        COL4,
        y
      );

      doc.fillColor("black");

      y += 22;
    });

    y += 25;

    // ==========================
    // Settlements
    // ==========================

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(
        "Settlement Transactions",
        40,
        y
      );

    y += 25;

    doc
      .fontSize(11)
      .font("Helvetica");

    if (settlements.length === 0) {
      doc.text(
        "No settlements required.",
        50,
        y
      );
    } else {
      settlements.forEach((item) => {
        if (y > 730) {
          doc.addPage();
          y = 50;
        }

        doc.text(
          `${item.from} pays ${item.to}  →  Rs. ${item.amount.toFixed(
            2
          )}`,
          50,
          y
        );

        y += 18;
      });
    }

    // ==========================
    // Footer
    // ==========================

    doc.fontSize(9);

    doc.fillColor("gray");

    doc.text(
      `Generated On: ${new Date().toLocaleDateString()}`,
      40,
      doc.page.height - 40,
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
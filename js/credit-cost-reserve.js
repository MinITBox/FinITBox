'use strict';

(function () {
	const header = document.querySelector('.header');
	window.onscroll = () => {
		if (window.scrollY > 30) {
			header.classList.add('header--active');
		} else {
			header.classList.remove('header--active');
		}
	};
})();

// ! Calculation of the debt related to the credit ==================================
const t0 = performance.now(); //!performance (first value)

let rangeInterestRate = document.getElementById('range-interestRate');
let interestRate = document.getElementById('interestRate');

let rangeCreditAmount = document.getElementById('range-creditAmount');
let creditAmount = document.getElementById('creditAmount');

let rangeMonths = document.getElementById('range-months');
let months = document.getElementById('months');

let inputMonthlyCommission = document.getElementById(
	'input-monthly-commission'
);

let inputSingleCommission = document.getElementById('input-single-commission');

let annuity = document.getElementById('annuity');
let internalRateOfReturn = document.getElementById('irr');
let effectiveAnnualInterestRate = document.getElementById('ear');
let totalCreditCost = document.getElementById('total-credit-cost');

// initial value of interest rate
interestRate.innerHTML = rangeInterestRate.value;

// initial value of credit amount
creditAmount.innerHTML = rangeCreditAmount.value;

// initial value of months
months.innerHTML = rangeMonths.value;

// initial value of annuity
annuity.innerHTML = calcAnnuity();

// functions to calculate and update the values of annuity
function calcAnnuity() {
	return (
		(parseFloat(creditAmount.innerHTML) * parseFloat(interestRate.innerHTML)) /
			100 +
		(parseFloat(creditAmount.innerHTML) * parseFloat(interestRate.innerHTML)) /
			100 /
			(Math.pow(
				1 + parseFloat(interestRate.innerHTML) / 100,
				parseFloat(months.innerHTML)
			) -
				1)
	).toFixed(2);
}

// Table ====================================================================================

let tableBody = document.querySelector('tbody');
let creditBalance = document.getElementsByClassName('credit-balance');
let creditPayment = document.getElementsByClassName('credit-payment');
let interestPayment = document.getElementsByClassName('interest-payment');
let monthlyCommission = document.getElementsByClassName('monthly-commission');
let singleCommission = document.getElementsByClassName('single-commission');
let fullPayment = document.getElementsByClassName('full-payment');

let tableFoot = document.querySelector('tfoot');
let totalCreditPayment = document.getElementsByClassName(
	'total-credit-payment'
);
let totalInterestPayment = document.getElementsByClassName(
	'total-interest-payment'
);
let totalAnnuity = document.getElementsByClassName('total-annuity');

let totalMonthlyCommission = document.getElementsByClassName(
	'total-monthly-commission'
);
let totalSingleCommission = document.getElementsByClassName(
	'total-single-commission'
);
let totalFullPayment = document.getElementsByClassName('total-full-payment');

// Function to complete the table =========================================

function completingTable() {
	tableBody.innerHTML = '';
	// preventive table where nr. of rows = nr. of months
	for (let i = 0; i < months.innerHTML; i++) {
		tableBody.innerHTML += `<tr>
						<td class="nr-month">${i + 1}</td>
						<td class="credit-balance">0</td>
						<td class="credit-payment">0</td>
						<td class="interest-payment">0</td>
						<td class="annuity">${annuity.innerHTML}</td>
						<td class="monthly-commission">${inputMonthlyCommission.value}</td>
						<td class="single-commission">0.00</td>
						<td class="full-payment">0</td>
					</tr>`;
	}
	// initial values of the first row of the table
	creditBalance[0].innerHTML = parseFloat(creditAmount.innerHTML).toFixed(2);

	interestPayment[0].innerHTML = (
		(parseFloat(interestRate.innerHTML) / 100) *
		parseFloat(creditBalance[0].innerHTML)
	).toFixed(2);

	creditPayment[0].innerHTML = (
		parseFloat(annuity.innerHTML) -
		(parseFloat(interestRate.innerHTML) / 100) *
			parseFloat(creditBalance[0].innerHTML)
	).toFixed(2);

	singleCommission[0].innerHTML = inputSingleCommission.value;

	fullPayment[0].innerHTML = (
		parseFloat(creditPayment[0].innerHTML) +
		parseFloat(interestPayment[0].innerHTML) +
		parseFloat(monthlyCommission[0].innerHTML) +
		parseFloat(singleCommission[0].innerHTML)
	).toFixed(2);

	// completing the remaining table rows
	for (let i = 1; i < months.innerHTML; i++) {
		creditBalance[i].innerHTML = (
			parseFloat(creditBalance[i - 1].innerHTML) -
			parseFloat(creditPayment[i - 1].innerHTML)
		).toFixed(2);
		interestPayment[i].innerHTML = (
			(parseFloat(interestRate.innerHTML) / 100) *
			parseFloat(creditBalance[i].innerHTML)
		).toFixed(2);
		creditPayment[i].innerHTML = (
			parseFloat(annuity.innerHTML) - parseFloat(interestPayment[i].innerHTML)
		).toFixed(2);

		fullPayment[i].innerHTML = (
			parseFloat(creditPayment[i].innerHTML) +
			parseFloat(interestPayment[i].innerHTML) +
			parseFloat(monthlyCommission[i].innerHTML) +
			parseFloat(singleCommission[i].innerHTML)
		).toFixed(2);

		// correcting the last row of the table
		if (i == months.innerHTML - 1) {
			creditPayment[i].innerHTML = creditBalance[i].innerHTML;
			interestPayment[i].innerHTML = (
				parseFloat(annuity.innerHTML) - parseFloat(creditPayment[i].innerHTML)
			).toFixed(2);
		}
	}
	// calculating totals of the table values =======================================

	tableFoot.innerHTML = `<tr>
						<th class="total-row" colspan="2">Total</th>						
						<th class="total-credit-payment">0</th>
						<th class="total-interest-payment">0</th>
						<th class="total-annuity">0</th>
						<th class="total-monthly-commission">0</th>
						<th class="total-single-commission">0</th>
						<th class="total-full-payment">0</th>
					</tr>`;

	for (let i = 0; i < months.innerHTML; i++) {
		totalCreditPayment[0].innerHTML = (
			parseFloat(totalCreditPayment[0].innerHTML) +
			parseFloat(creditPayment[i].innerHTML)
		).toFixed(2);

		totalInterestPayment[0].innerHTML = (
			parseFloat(totalInterestPayment[0].innerHTML) +
			parseFloat(interestPayment[i].innerHTML)
		).toFixed(2);

		totalAnnuity[0].innerHTML = (
			parseFloat(totalAnnuity[0].innerHTML) + parseFloat(annuity.innerHTML)
		).toFixed(2);
		totalMonthlyCommission[0].innerHTML = (
			parseFloat(totalMonthlyCommission[0].innerHTML) +
			parseFloat(monthlyCommission[i].innerHTML)
		).toFixed(2);

		totalSingleCommission[0].innerHTML = (
			parseFloat(totalSingleCommission[0].innerHTML) +
			parseFloat(singleCommission[i].innerHTML)
		).toFixed(2);

		totalFullPayment[0].innerHTML = (
			parseFloat(totalFullPayment[0].innerHTML) +
			parseFloat(fullPayment[i].innerHTML)
		).toFixed(2);
	}
}

// calling the function to complete (to populate) the table
completingTable();

// calculation of IRR ==================================================
function calcIRR() {
	let cashFlowArray = [];
	cashFlowArray.push(-creditAmount.innerHTML);
	for (let i = 0; i < months.innerHTML; i++) {
		cashFlowArray.push(+fullPayment[i].innerHTML);
	}

	function IRRCalc(CArray) {
		let r = 0;
		let min = -1.0;
		let max = 10000.0;
		let guest;
		let NPV;

		do {
			guest = (min + max) / 2;
			NPV = 0;
			for (let j = 0; j < CArray.length; j++) {
				NPV += CArray[j] / Math.pow(1 + guest, j);
			}
			if (NPV > 0) {
				min = guest;
			} else {
				max = guest;
			}
			r++;
		} while (r < 100);
		return guest * 100;
	}
	let IRR = IRRCalc(cashFlowArray, 0.001).toFixed(2);
	return IRR;
}
internalRateOfReturn.textContent = calcIRR();

// calculation of EAR ==================================================
function calcEAR() {
	return (
		(Math.pow(1 + parseFloat(internalRateOfReturn.innerHTML) / 100, 12) - 1) *
		100
	).toFixed(2);
}
effectiveAnnualInterestRate.textContent = calcEAR();

// calculation of Total Credit Cost ====================================
function calcTotalCreditCost() {
	return (
		((parseFloat(totalFullPayment[0].innerHTML) -
			parseFloat(creditAmount.innerHTML)) /
			parseFloat(creditAmount.innerHTML)) *
		100
	).toFixed(2);
}
totalCreditCost.textContent = calcTotalCreditCost();

// * on input event updating the values of Interest Rate, Credit Amount, Number of Months and Interest Amount, Annuity

rangeInterestRate.addEventListener('input', () => {
	interestRate.innerHTML = rangeInterestRate.value;
	annuity.innerHTML = calcAnnuity();
	completingTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

rangeCreditAmount.addEventListener('input', () => {
	creditAmount.innerHTML = rangeCreditAmount.value;
	annuity.innerHTML = calcAnnuity();
	completingTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
rangeMonths.addEventListener('input', function () {
	months.innerHTML = rangeMonths.value;
	annuity.innerHTML = calcAnnuity();
	completingTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
inputMonthlyCommission.addEventListener('input', function () {
	completingTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
inputSingleCommission.addEventListener('input', function () {
	completingTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

// Alert if the page is opened on a mobile device and screen width is less than 1024px ========
window.addEventListener('load', () => {
	if (screen.width < 1024) {
		alert(
			'To more precisely set the range slider, it is recommended to open the web page on a desktop device and use the keyboard arrow keys ("<--", "-->")'
		);
	}
});
// Performance ====================================
const t1 = performance.now(); //!performance (second value)
console.log(t1 - t0, 'milliseconds'); //!performance

'use strict';

// * date format function

function ddmmyyyy(date) {
	let dd = String(date.getDate()).padStart(2, '0');
	let mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
	let yyyy = date.getFullYear();
	return dd + '.' + mm + '.' + yyyy;
}

function dateStringForDateObject(dateString) {
	let [day, month, year] = dateString.split('.');
	return year + '-' + month + '-' + day;
}

//  * The code necessary to add months to a date handling edge cases (leap year, shorter months, etc) (https://stackoverflow.com/questions/5645058/how-to-add-months-to-a-date-in-javascript)
Date.isLeapYear = function (year) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

Date.getDaysInMonth = function (year, month) {
	return [
		31,
		Date.isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	][month];
};

Date.prototype.isLeapYear = function () {
	return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
	return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
	let n = this.getDate();
	this.setDate(1);
	this.setMonth(this.getMonth() + value);
	this.setDate(Math.min(n, this.getDaysInMonth()));
	return this;
};

// ======================================================================================

// ! Calculation of the debt related to the credit ==================================
const t0 = performance.now(); //!performance (first value)

let rangeInterestRate = document.getElementById('range-interestRate');
let interestRate = document.getElementById('interestRate');

let rangeDailyPenaltyRate = document.getElementById('range-dailyPenaltyRate');
let dailyPenaltyRate = document.getElementById('dailyPenaltyRate');

let rangeMonths = document.getElementById('range-months');
let months = document.getElementById('months');

let creditAmount = document.getElementById('input-creditAmount');

let inputMonthlyCommission = document.getElementById(
	'input-monthly-commission'
);

let inputSingleCommission = document.getElementById('input-single-commission');

let inputDateCreditIssue = document.getElementById('input-date-credit-issue');
// *start JQuery datepicker =============================================================

jQuery(inputDateCreditIssue).datepicker({
	dateFormat: 'dd.mm.yy',
	changeMonth: true,
	changeYear: true,
	firstDay: 1,
});

// end JQuery datepicker ==============================================================

let outputDateRepayment = document.getElementById('output-date-repayment');

let annuity = document.getElementById('annuity');
let internalRateOfReturn = document.getElementById('irr');
let effectiveAnnualInterestRate = document.getElementById('ear');
let totalCreditCost = document.getElementById('total-credit-cost');

// initial value of interest rate
interestRate.innerHTML = rangeInterestRate.value;

// initial value of daily penalty rate
dailyPenaltyRate.innerHTML = rangeDailyPenaltyRate.value;

// initial value of months
months.innerHTML = rangeMonths.value;

//  *By default, the "Date of credit issue" is set to 6 month ago from the current date

let halfYearAgo = new Date().addMonths(-6);

inputDateCreditIssue.value = ddmmyyyy(halfYearAgo);

// By default, calculating the "Date of credit repayment"
// by taking into account the number of indicated months
outputDateRepayment.textContent = ddmmyyyy(
	new Date(dateStringForDateObject(inputDateCreditIssue.value)).addMonths(
		parseInt(months.textContent)
	)
);
// ======================================================================================

// initial value of annuity
annuity.innerHTML = calcAnnuity();

// functions to calculate and update the values of annuity
function calcAnnuity() {
	return (
		(parseFloat(creditAmount.value) * parseFloat(interestRate.innerHTML)) /
			100 +
		(parseFloat(creditAmount.value) * parseFloat(interestRate.innerHTML)) /
			100 /
			(Math.pow(
				1 + parseFloat(interestRate.innerHTML) / 100,
				parseFloat(months.innerHTML)
			) -
				1)
	).toFixed(2);
}

// ! Start Table "PAYMENT SCHEDULE"===========================================================
// !==========================================================================================

let scheduleTableBody = document.querySelector('.schedule-tbody');
let scheduleDatePayment = document.getElementsByClassName(
	'schedule-date-payment'
);
let scheduleDays = document.getElementsByClassName('schedule-days');
let scheduleCreditBalance = document.getElementsByClassName(
	'schedule-credit-balance'
);
let scheduleCreditPayment = document.getElementsByClassName(
	'schedule-credit-payment'
);
let scheduleAnnuity = document.getElementsByClassName('schedule-annuity');
let scheduleInterestPayment = document.getElementsByClassName(
	'schedule-interest-payment'
);
let scheduleMonthlyCommission = document.getElementsByClassName(
	'schedule-monthly-commission'
);
let scheduleSingleCommission = document.getElementsByClassName(
	'schedule-single-commission'
);
let scheduleFullPayment = document.getElementsByClassName(
	'schedule-full-payment'
);
// Table Foot
let scheduleTableFoot = document.querySelector('tfoot');
let scheduleTotalCreditPayment = document.getElementsByClassName(
	'schedule-total-credit-payment'
);
let scheduleTotalInterestPayment = document.getElementsByClassName(
	'schedule-total-interest-payment'
);
let scheduleTotalAnnuity = document.getElementsByClassName(
	'schedule-total-annuity'
);

let scheduleTotalMonthlyCommission = document.getElementsByClassName(
	'schedule-total-monthly-commission'
);
let scheduleTotalSingleCommission = document.getElementsByClassName(
	'schedule-total-single-commission'
);
let scheduleTotalFullPayment = document.getElementsByClassName(
	'schedule-total-full-payment'
);

// * Function to complete the table "PAYMENT SCHEDULE"==========================

function completingScheduleTable() {
	scheduleTableBody.innerHTML = '';
	// preventive table where nr. of rows = nr. of months
	for (let i = 0; i <= months.innerHTML; i++) {
		scheduleTableBody.innerHTML += `<tr>
						<td class="schedule-nr-month">${i}</td>
						<td class="schedule-days">0</td>
						<td class="schedule-date-payment">01.07.2024</td>
						<td class="schedule-credit-balance">0.00</td>
						<td class="schedule-credit-payment">0.00</td>
						<td class="schedule-interest-payment">0.00</td>
						<td class="schedule-annuity">0.00</td>
						<td class="schedule-monthly-commission">0.00</td>
						<td class="schedule-single-commission">0.00</td>
						<td class="schedule-full-payment">0</td>
					</tr>`;
	}
	// initial values of the first row of the table =============================

	scheduleDatePayment[0].innerHTML = inputDateCreditIssue.value;

	// Get the number of days by using the specified month and year
	scheduleDays[0].textContent = new Date(
		new Date(
			dateStringForDateObject(scheduleDatePayment[0].innerHTML)
		).getFullYear(),
		new Date(
			dateStringForDateObject(scheduleDatePayment[0].innerHTML)
		).getMonth() + 1,
		0
	).getDate();

	scheduleCreditBalance[0].innerHTML = parseFloat(creditAmount.value).toFixed(
		2
	);

	scheduleSingleCommission[0].innerHTML = inputSingleCommission.value;

	scheduleFullPayment[0].innerHTML = (
		parseFloat(scheduleCreditPayment[0].innerHTML) +
		parseFloat(scheduleInterestPayment[0].innerHTML) +
		parseFloat(scheduleMonthlyCommission[0].innerHTML) +
		parseFloat(scheduleSingleCommission[0].innerHTML)
	).toFixed(2);

	// completing the remaining table rows
	for (let i = 1; i <= months.innerHTML; i++) {
		scheduleDatePayment[i].textContent = ddmmyyyy(
			new Date(
				dateStringForDateObject(scheduleDatePayment[0].textContent)
			).addMonths(parseInt([i]))
		);

		// Nr of days in a period as difference between current date and previous date
		scheduleDays[i].textContent = Math.round(
			(new Date(
				dateStringForDateObject(scheduleDatePayment[i].textContent)
			).getTime() -
				new Date(
					dateStringForDateObject(scheduleDatePayment[i - 1].textContent)
				).getTime()) /
				(1000 * 60 * 60 * 24)
		);

		scheduleAnnuity[i].textContent = annuity.innerHTML;

		scheduleInterestPayment[i].innerHTML = (
			(parseFloat(interestRate.innerHTML) / 100) *
			parseFloat(scheduleCreditBalance[i - 1].innerHTML)
		).toFixed(2);
		scheduleCreditPayment[i].innerHTML = (
			parseFloat(annuity.innerHTML) -
			parseFloat(scheduleInterestPayment[i].innerHTML)
		).toFixed(2);

		scheduleCreditBalance[i].innerHTML = (
			parseFloat(scheduleCreditBalance[i - 1].innerHTML) -
			parseFloat(scheduleCreditPayment[i].innerHTML)
		).toFixed(2);

		scheduleMonthlyCommission[i].innerHTML = inputMonthlyCommission.value;

		scheduleFullPayment[i].innerHTML = (
			parseFloat(scheduleCreditPayment[i].innerHTML) +
			parseFloat(scheduleInterestPayment[i].innerHTML) +
			parseFloat(scheduleMonthlyCommission[i].innerHTML) +
			parseFloat(scheduleSingleCommission[i].innerHTML)
		).toFixed(2);

		// correcting the last row of the table
		if (i == months.innerHTML) {
			scheduleCreditPayment[i].innerHTML =
				scheduleCreditBalance[i - 1].innerHTML;
			scheduleInterestPayment[i].innerHTML = (
				parseFloat(annuity.innerHTML) -
				parseFloat(scheduleCreditPayment[i].innerHTML)
			).toFixed(2);
		}
		scheduleCreditBalance[i].innerHTML = (
			parseFloat(scheduleCreditBalance[i - 1].innerHTML) -
			parseFloat(scheduleCreditPayment[i].innerHTML)
		).toFixed(2);
	}
	// calculating totals of the "PAYMENT SCHEDULE" table values ================================
	// resetting to zero
	scheduleTableFoot.innerHTML = `<tr>
						<th class="schedule-total-row" colspan="4">Total</th>						
						<th class="schedule-total-credit-payment">0</th>
						<th class="schedule-total-interest-payment">0</th>
						<th class="schedule-total-annuity">0</th>
						<th class="schedule-total-monthly-commission">0</th>
						<th class="schedule-total-single-commission">0</th>
						<th class="schedule-total-full-payment">0</th>
					</tr>`;
	// calculation
	for (let i = 0; i <= months.innerHTML; i++) {
		scheduleTotalCreditPayment[0].innerHTML = (
			parseFloat(scheduleTotalCreditPayment[0].innerHTML) +
			parseFloat(scheduleCreditPayment[i].innerHTML)
		).toFixed(2);

		scheduleTotalInterestPayment[0].innerHTML = (
			parseFloat(scheduleTotalInterestPayment[0].innerHTML) +
			parseFloat(scheduleInterestPayment[i].innerHTML)
		).toFixed(2);

		scheduleTotalAnnuity[0].innerHTML = (
			parseFloat(scheduleTotalAnnuity[0].innerHTML) +
			parseFloat(scheduleAnnuity[i].textContent)
		).toFixed(2);
		scheduleTotalMonthlyCommission[0].innerHTML = (
			parseFloat(scheduleTotalMonthlyCommission[0].innerHTML) +
			parseFloat(scheduleMonthlyCommission[i].innerHTML)
		).toFixed(2);

		scheduleTotalSingleCommission[0].innerHTML = (
			parseFloat(scheduleTotalSingleCommission[0].innerHTML) +
			parseFloat(scheduleSingleCommission[i].innerHTML)
		).toFixed(2);

		scheduleTotalFullPayment[0].innerHTML = (
			parseFloat(scheduleTotalFullPayment[0].innerHTML) +
			parseFloat(scheduleFullPayment[i].innerHTML)
		).toFixed(2);
	}
}

// calling the function to complete (to populate) the table
completingScheduleTable();

// ! End Table "PAYMENT SCHEDULE"=============================================================
// !==========================================================================================

// calculation of IRR ==================================================
function calcIRR() {
	let cashFlowArray = [];
	cashFlowArray.push(-creditAmount.value + +inputSingleCommission.value);

	for (let i = 1; i <= months.innerHTML; i++) {
		cashFlowArray.push(+scheduleFullPayment[i].innerHTML);
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
		((parseFloat(scheduleTotalFullPayment[0].innerHTML) -
			parseFloat(creditAmount.value)) /
			parseFloat(creditAmount.value)) *
		100
	).toFixed(2);
}
totalCreditCost.textContent = calcTotalCreditCost();

// ? Start "Date of actual debt calculation" ... "PAYMENTS" table ============================
// ?==========================================================================================
// working with "Date of actual debt calculation":
let inputDateActualDebt = document.getElementById('input-date-actual-debt');
inputDateActualDebt.value = ddmmyyyy(
	new Date(dateStringForDateObject(inputDateCreditIssue.value)).addMonths(6)
);
jQuery(inputDateActualDebt).datepicker({
	dateFormat: 'dd.mm.yy',
	changeMonth: true,
	changeYear: true,
	firstDay: 1,
	minDate: inputDateCreditIssue.value,
});

// working with "Date of payment":
let inputPaymentDate = document.getElementById('input-payment-date');
jQuery(inputPaymentDate).datepicker({
	dateFormat: 'dd.mm.yy',
	changeMonth: true,
	changeYear: true,
	firstDay: 1,
	minDate: inputDateCreditIssue.value,
	maxDate: ddmmyyyy(
		// one day less than Date of actual debt calculation
		new Date(
			new Date(dateStringForDateObject(inputDateActualDebt.value)).getTime() -
				1000 * 60 * 60 * 24
		)
	),
});
// completing the table "PAYMENTS":
let inputPaymentAmount = document.getElementById('input-payment-amount');
let addPaymentButton = document.querySelector('.add-payment-button');
let paymentsTbody = document.querySelector('.payments-tbody');
paymentsTbody.innerHTML = ``;

function onAddPaymentButton(e) {
	e.preventDefault();
	if (
		inputPaymentDate.value == '' ||
		inputPaymentAmount.value == '' ||
		inputPaymentAmount.value <= 0
	) {
		return;
	}

	paymentsTbody.innerHTML += `
		<tr>
			<td class="payments-date-payment">${inputPaymentDate.value}</td>
			<td class="payments-amount">${parseFloat(inputPaymentAmount.value).toFixed(
				2
			)}</td>
			<td class="payments-table-buttons">
				<div class="table-buttons">
					<button class="table-edit-button" type="button">
						<svg
							class="edit-icon"
							stroke="currentColor"
							fill="currentColor"
							stroke-width="0"
							viewBox="0 0 576 512"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
							></path>
						</svg>
					</button>
					<button class="table-save-button" type="button">
						<svg
							class="save-icon"
							stroke="currentColor"
							fill="currentColor"
							stroke-width="0"
							viewBox="0 0 448 512"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
							></path>
						</svg>
					</button>
					<button class="table-delete-button" type="button"
								style="border: 1px
								height="20px"
								width="20px"">
						<svg							
							class="delete-icon"
							stroke="currentColor"
							fill="currentColor"
							stroke-width="0"
							viewBox="0 0 448 512"
							height="1em"
							width="1em"							
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
							></path>
						</svg>						
					</button>
				</div>
			</td>
		</tr>
	`;
	inputPaymentDate.value = '';
	inputPaymentAmount.value = '';
}
// selecting Dates from table "PAYMENTS"===============================
let paymentsDatePayment = document.getElementsByClassName(
	'payments-date-payment'
);
let paymentsAmount = document.getElementsByClassName('payments-amount');

function paymentsTotalAmountPaid() {
	let paymentsTotalAmount = document.querySelector('.payments-total-amount');

	paymentsTotalAmount.textContent = '0.00';

	if (paymentsAmount[0]?.textContent == undefined) {
		return;
	}
	for (let i = 0; i < paymentsAmount.length; i++) {
		paymentsTotalAmount.textContent = (
			parseFloat(paymentsTotalAmount.textContent) +
			parseFloat(paymentsAmount[i].textContent)
		).toFixed(2);
	}
	return paymentsTotalAmount.textContent;
}
paymentsTotalAmountPaid();
// function for removing row from table "PAYMENTS"
// necessary for event "click" attached below to "paymentsTbody" from table "PAYMENTS"
function onDeleteRow(e) {
	if (!e.target.closest('.table-delete-button')) {
		return;
	}
	const btn = e.target;
	btn.closest('tr').remove();
	paymentsTotalAmountPaid();

	// updating date range for "Date of payment" jQuery datepicker
	// the code below is repeated in function "onSaveRow()"
	if (
		//when table doesn't have the records
		paymentsDatePayment[paymentsDatePayment.length - 1]?.textContent ==
		undefined
	) {
		jQuery(inputPaymentDate).datepicker(
			'option',
			'minDate',
			inputDateCreditIssue.value
		);
	} else {
		//when table have the records
		jQuery(inputPaymentDate).datepicker(
			'option',
			'minDate',
			paymentsDatePayment[paymentsDatePayment.length - 1].textContent
		);
	}
}
function onEditRow(e) {
	if (!e.target.closest('.table-edit-button')) {
		return;
	}
	let btnEdit = e.target.closest('.table-edit-button');
	let btnSave = btnEdit.nextElementSibling;
	btnEdit.style.display = 'none';
	btnSave.style.display = 'inline-block';
	jQuery(inputPaymentDate).datepicker('disable');

	let rowPaymentsDatePayment = btnEdit.closest('.payments-table-buttons')
		.previousElementSibling.previousElementSibling;

	let rowPaymentsAmount = btnEdit.closest(
		'.payments-table-buttons'
	).previousElementSibling;

	let paymentsDatePayment_data = rowPaymentsDatePayment.textContent;

	let paymentsAmount_data = rowPaymentsAmount.textContent;

	rowPaymentsDatePayment.innerHTML = `<input
						id="edit-payment-date"						
						type="text"
						required
						pattern="(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}"
						placeholder="dd.mm.yyyy"
						value="${paymentsDatePayment_data}" 
					/>`;

	rowPaymentsAmount.innerHTML = `<input
						id="edit-payment-amount"						
						type="number"						
						placeholder="Payment amount"
						inputmode="decimal"
						min="0.00"
						step="0.01"
						value="${paymentsAmount_data}"
					/>`;

	// get the array of "tr" tags
	const trArr = Array.from(e.currentTarget.children);
	// get the index of closest "tr" tag by using event delegation
	const idx = Array.from(e.currentTarget.children).indexOf(
		e.target.closest('tr')
	);

	jQuery('#edit-payment-date').datepicker({
		dateFormat: 'dd.mm.yy',
		changeMonth: true,
		changeYear: true,
		firstDay: 1,
		minDate: inputDateCreditIssue.value,
		maxDate: ddmmyyyy(
			new Date(
				new Date(dateStringForDateObject(inputDateActualDebt.value)).getTime() -
					1000 * 60 * 60 * 24
			)
		),
	});
	// updating limits for date range
	// if (trArr.length == 1 && idx == 0) {
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'minDate',
	// 		inputDateCreditIssue.value
	// 	);
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'maxDate',
	// 		ddmmyyyy(

	// 			new Date(
	// 				new Date(
	// 					dateStringForDateObject(inputDateActualDebt.value)
	// 				).getTime() -
	// 					1000 * 60 * 60 * 24
	// 			)
	// 		)
	// 	);
	// }
	// if (trArr.length > 1 && idx == 0) {
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'minDate',
	// 		inputDateCreditIssue.value
	// 	);
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'maxDate',
	// 		paymentsDatePayment[idx + 1].textContent
	// 	);
	// }
	// if (trArr.length > 1 && idx > 0 && idx < trArr.length - 1) {
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'minDate',
	// 		paymentsDatePayment[idx - 1].textContent
	// 	);
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'maxDate',
	// 		paymentsDatePayment[idx + 1].textContent
	// 	);
	// }
	// if (trArr.length > 1 && idx == trArr.length - 1) {
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'minDate',
	// 		paymentsDatePayment[idx - 1].textContent
	// 	);
	// 	jQuery('[data-date-edited]').datepicker(
	// 		'option',
	// 		'maxDate',
	// 		ddmmyyyy(
	// 			new Date(
	// 				new Date(
	// 					dateStringForDateObject(inputDateActualDebt.value)
	// 				).getTime() -
	// 					1000 * 60 * 60 * 24
	// 			)
	// 		)
	// 	);
	// }
}
function onSaveRow(e) {
	if (!e.target.closest('.table-save-button')) {
		return;
	}
	let btnSave = e.target.closest('.table-save-button');

	let btnEdit = btnSave.previousElementSibling;

	let paymentsDatePayment_val =
		document.querySelector('#edit-payment-date').value;

	let paymentsAmount_val = document.querySelector('#edit-payment-amount').value;

	let rowPaymentsDatePayment = btnSave.closest('tr').firstElementChild;

	let rowPaymentsAmount =
		btnSave.closest('tr').firstElementChild.nextElementSibling;

	if (
		paymentsDatePayment_val == '' ||
		paymentsAmount_val == '' ||
		paymentsAmount_val == 0
	) {
		return;
	}

	rowPaymentsDatePayment.innerHTML = paymentsDatePayment_val;
	rowPaymentsAmount.innerHTML = parseFloat(paymentsAmount_val).toFixed(2);

	btnEdit.style.display = 'inline-block';
	btnSave.style.display = 'none';
	jQuery(inputPaymentDate).datepicker('enable');

	paymentsTotalAmountPaid();

	// updating date range for "Date of payment" jQuery datepicker
	// the code below is repeated in function "onDeleteRow()"

	//when table have the records - last record (in ascending order)
	jQuery(inputPaymentDate).datepicker(
		'option',
		'minDate',
		paymentsDatePayment[paymentsDatePayment.length - 1].textContent
	);
}

// ? End "Date of actual debt calculation" ... "PAYMENTS" table ==============================
// ?==========================================================================================
// ! Start "ACTUAL CREDIT DEBT" table ========================================================
// !==========================================================================================

let debtTableBody = document.querySelector('.debt-tbody');
let debtTbodyTr = document.getElementsByClassName('debt-tbody-tr');

let debtDate = document.getElementsByClassName('debt-date');
let debtDays = document.getElementsByClassName('debt-days');
let debtDaysMonth = document.getElementsByClassName('debt-days-month');
let debtTypeOperation = document.getElementsByClassName('debt-type-operation');
let debtCreditBalance = document.getElementsByClassName('debt-credit-balance');
let debtCredit = document.getElementsByClassName('debt-credit');
let debtCreditNotPaidOnTime = document.getElementsByClassName(
	'debt-credit-not-paid'
);
let debtInterest = document.getElementsByClassName('debt-interest');
let debtCommission = document.getElementsByClassName('debt-commission');
let debtPenalty = document.getElementsByClassName('debt-penalty');

let debtAdvancePayment = document.getElementsByClassName(
	'debt-advance-payment'
);
let debtAmountPaid = document.getElementsByClassName('debt-amount-paid');

// Table foot =========================================
// total
let debtTotalCreditBalance = document.querySelector(
	'.debt-total-credit-balance'
);
let debtTotalCredit = document.querySelector('.debt-total-credit');
let debtTotalCreditNotPaid = document.querySelector(
	'.debt-total-credit-not-paid'
);
let debtTotalInterest = document.querySelector('.debt-total-interest');
let debtTotalCommission = document.querySelector('.debt-total-commission');
let debtTotalPenalty = document.querySelector('.debt-total-penalty');
let debtTotalAdvancePayment = document.querySelector(
	'.debt-total-advance-payment'
);
let debtTotalAmountPaid = document.querySelector('.debt-total-amount-paid');
let debtTotalDebts = document.querySelector('.debt-total-debts');

// total accrued
let debtTotalAccruedCredit = document.querySelector(
	'.debt-total-accrued-credit'
);
let debtTotalAccruedInterest = document.querySelector(
	'.debt-total-accrued-interest'
);
let debtTotalAccruedCommission = document.querySelector(
	'.debt-total-accrued-commission'
);
let debtTotalAccruedPenalty = document.querySelector(
	'.debt-total-accrued-penalty'
);

// total paid
let debtTotalPaidCredit = document.querySelector('.debt-total-paid-credit');
let debtTotalPaidInterest = document.querySelector('.debt-total-paid-interest');
let debtTotalPaidCommission = document.querySelector(
	'.debt-total-paid-commission'
);
let debtTotalPaidPenalty = document.querySelector('.debt-total-paid-penalty');
let debtTotalPaidAdvancePayment = document.querySelector(
	'.debt-total-paid-advance-payment'
);
let debtTotalPaidAmountPaid = document.querySelector(
	'.debt-total-paid-amount-paid'
);

function completingActualCreditDebtTable() {
	let arrScheduleDatePayment = [];
	let arrDaysInMonth = [];
	let arrDebtDate = [inputDateActualDebt.value];

	for (let i = 0; i < scheduleDatePayment.length; i++) {
		arrScheduleDatePayment.push(scheduleDatePayment[i].innerHTML);
		arrDebtDate.push(scheduleDatePayment[i].innerHTML);
	}
	// Preparing array of days in monthly periods
	for (let i = 1; i < scheduleDatePayment.length; i++) {
		arrDaysInMonth.push(
			Math.round(
				(new Date(
					dateStringForDateObject(arrScheduleDatePayment[i])
				).getTime() -
					new Date(
						dateStringForDateObject(arrScheduleDatePayment[i - 1])
					).getTime()) /
					(1000 * 60 * 60 * 24)
			)
		);
	}

	// ? Supplementing array with extra monthly periods ================================
	// arrScheduleDatePayment
	// arrDaysInMonth
	// arrDebtDate
	while (
		new Date(
			dateStringForDateObject(
				arrScheduleDatePayment[arrScheduleDatePayment.length - 1]
			)
		) <= new Date(dateStringForDateObject(inputDateActualDebt.value))
	) {
		arrScheduleDatePayment.push(
			ddmmyyyy(
				new Date(
					dateStringForDateObject(
						arrScheduleDatePayment[arrScheduleDatePayment.length - 1]
					)
				).addMonths(1)
			)
		);
		arrDaysInMonth.push(
			Math.round(
				(new Date(
					dateStringForDateObject(
						arrScheduleDatePayment[arrScheduleDatePayment.length - 1]
					)
				).getTime() -
					new Date(
						dateStringForDateObject(
							arrScheduleDatePayment[arrScheduleDatePayment.length - 2]
						)
					).getTime()) /
					(1000 * 60 * 60 * 24)
			)
		);
		arrDebtDate.push(arrScheduleDatePayment[arrScheduleDatePayment.length - 1]);
	}

	// ?========================================================
	// Using Bubble Sorting Algorithm to put in right place (end of array) the
	// "Date of actual debt calculation"
	for (let x = 0; x < arrDebtDate.length; x++) {
		for (let y = 0; y < arrDebtDate.length - x - 1; y++) {
			if (
				new Date(dateStringForDateObject(arrDebtDate[y])) >
				new Date(dateStringForDateObject(arrDebtDate[y + 1]))
			) {
				let temp = arrDebtDate[y];
				arrDebtDate[y] = arrDebtDate[y + 1];
				arrDebtDate[y + 1] = temp;
			}
		}
	}

	// Eliminate "inputDateActualDebt.value" in case if it repeats 2 times in "arrDebtDate"
	for (let x = 1; x < arrDebtDate.length; x++) {
		if (
			new Date(dateStringForDateObject(arrDebtDate[x])).getTime() ===
			new Date(dateStringForDateObject(arrDebtDate[x - 1])).getTime()
		) {
			arrDebtDate.splice(x, 1);
			break;
		}
	}

	// ! clearing the body of table
	debtTableBody.innerHTML = '';
	/* 
	index variables are necessary to find the right place in table
	for the "credit early repayment" event, if it appears.
	They are determined at the end of function.
	*/
	let index_EarlyRepaymentOfCredit;
	let indexDate_EarlyRepaymentOfCredit;

	// recreating table in dependence of "Date of actual debt calculation"
	for (
		let dd = 0;
		new Date(dateStringForDateObject(arrDebtDate[dd])) <=
		new Date(dateStringForDateObject(inputDateActualDebt.value));
		dd++
	) {
		//* 4. distribution from advance payment which is enough to cover entire debt
		if (
			index_EarlyRepaymentOfCredit != undefined &&
			parseFloat(debtTotalCreditBalance.innerHTML) > 0
		) {
			// 1 - create element to insert into table
			let elmCalc = document.createElement('tr');
			let elmAdvance = document.createElement('tr');
			// 2 - add class attribute to element
			elmCalc.classList.add('debt-tbody-tr');
			elmAdvance.classList.add('debt-tbody-tr');
			// 3 - add content to element
			elmCalc.innerHTML = `<tr class="debt-tbody-tr">
						<td class="debt-date">${indexDate_EarlyRepaymentOfCredit}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">calculation</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">0.00</td>
						<td class="debt-debts"></td>
					</tr>`;
			elmAdvance.innerHTML = `<tr class="debt-tbody-tr">
						<td class="debt-date">${indexDate_EarlyRepaymentOfCredit}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">advance</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">0.00</td>
						<td class="debt-debts"></td>
					</tr>`;
			// 4 - insert element into table by index value
			debtTbodyTr[index_EarlyRepaymentOfCredit].after(elmCalc);
			debtTbodyTr[index_EarlyRepaymentOfCredit + 1].after(elmAdvance);
		}

		//? 1. filling table with rows ============================
		debtTableBody.innerHTML += `<tr class="debt-tbody-tr">
						<td class="debt-date">${arrDebtDate[dd]}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">calculation</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">0.00</td>
						<td class="debt-debts"></td>
					</tr>`;
		// filling "Type of operation" column with "obligation" event
		let lastY = 0;
		for (let x = 0; x < debtDate.length; x++) {
			for (let y = lastY; y < arrScheduleDatePayment.length; y++) {
				if (x == 0) {
					debtTypeOperation[x].innerHTML = 'obligation';
				} else if (x > 0) {
					if (
						new Date(
							dateStringForDateObject(debtDate[x - 1].innerHTML)
						).getTime() !=
							new Date(
								dateStringForDateObject(debtDate[x].innerHTML)
							).getTime() &&
						new Date(
							dateStringForDateObject(debtDate[x].innerHTML)
						).getTime() ===
							new Date(
								dateStringForDateObject(arrScheduleDatePayment[y])
							).getTime()
					) {
						debtTypeOperation[x].innerHTML = 'obligation';
						lastY = y;
					}
				}
			}
		}

		//* 3. ordinary distribution from advance payment (after "obligation" event)
		if (
			dd > 0 && //to avoid advance payment after first "obligation" event (kind of bug)
			parseFloat(debtTotalAdvancePayment.innerHTML) < 0 &&
			debtTypeOperation[debtDate.length - 1].innerHTML == 'obligation' &&
			new Date(
				dateStringForDateObject(debtDate[debtDate.length - 1].innerHTML)
			).getTime() !=
				new Date(
					dateStringForDateObject(inputDateActualDebt.value)
				).getTime() &&
			parseFloat(debtTotalDebts.innerHTML) > 0 &&
			index_EarlyRepaymentOfCredit == undefined // means that total advance is not enough to cover total Debt
		) {
			debtTableBody.innerHTML += `<tr class="debt-tbody-tr">
						<td class="debt-date">${arrDebtDate[dd]}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">advance</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">0.00</td>
						<td class="debt-debts"></td>
					</tr>`;
		}
		//* 2. distribution of payments:
		//? 2.1) if date of payment = date of obligation
		//? 2.2) if date of payments are the same
		//? 2.3) if date of payment <> date of obligation

		if (paymentsAmount[0]?.textContent != undefined) {
			for (let dp = 0; dp < paymentsDatePayment.length; dp++) {
				//? 2.1) if date of payment = date of obligation
				if (
					new Date(dateStringForDateObject(arrDebtDate[dd])).getTime() ===
					new Date(
						dateStringForDateObject(paymentsDatePayment[dp].innerHTML)
					).getTime()
				) {
					debtTableBody.innerHTML += `<tr class="debt-tbody-tr">
						<td class="debt-date">${paymentsDatePayment[dp].innerHTML}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">payment</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">${paymentsAmount[dp].innerHTML}</td>
						<td class="debt-debts"></td>
					</tr>`;
				}
				//? 2.2) if date of payments are the same
				else if (
					dp > 0 &&
					new Date(dateStringForDateObject(arrDebtDate[dd])).getTime() <
						new Date(
							dateStringForDateObject(paymentsDatePayment[dp].innerHTML)
						).getTime() &&
					new Date(
						dateStringForDateObject(paymentsDatePayment[dp].innerHTML)
					).getTime() <
						new Date(dateStringForDateObject(arrDebtDate[dd + 1])).getTime() &&
					new Date(
						dateStringForDateObject(paymentsDatePayment[dp - 1].innerHTML)
					).getTime() ===
						new Date(
							dateStringForDateObject(paymentsDatePayment[dp].innerHTML)
						).getTime()
				) {
					debtTableBody.innerHTML += `<tr class="debt-tbody-tr">
						<td class="debt-date">${paymentsDatePayment[dp].innerHTML}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">payment</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">${paymentsAmount[dp].innerHTML}</td>
						<td class="debt-debts"></td>
					</tr>`;
				}
				//? 2.3) if date of payment <> date of obligation
				else if (
					new Date(dateStringForDateObject(arrDebtDate[dd])).getTime() <
						new Date(
							dateStringForDateObject(paymentsDatePayment[dp].innerHTML)
						).getTime() &&
					new Date(
						dateStringForDateObject(paymentsDatePayment[dp].innerHTML)
					).getTime() <
						new Date(dateStringForDateObject(arrDebtDate[dd + 1])).getTime()
				) {
					debtTableBody.innerHTML += `<tr class="debt-tbody-tr">
						<td class="debt-date">${paymentsDatePayment[dp].innerHTML}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">calculation</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">0.00</td>
						<td class="debt-debts"></td>
					</tr>`;
					debtTableBody.innerHTML += `<tr class="debt-tbody-tr">
						<td class="debt-date">${paymentsDatePayment[dp].innerHTML}</td>
						<td class="debt-days">0</td>
						<td class="debt-days-month">0</td>
						<td class="debt-type-operation">payment</td>
						<td class="debt-credit-balance">0.00</td>
						<td class="debt-credit">0.00</td>
						<td class="debt-credit-not-paid">0.00</td>
						<td class="debt-interest">0.00</td>
						<td class="debt-commission">0.00</td>
						<td class="debt-penalty">0.00</td>
						<td class="debt-advance-payment">0.00</td>
						<td class="debt-amount-paid">${paymentsAmount[dp].innerHTML}</td>
						<td class="debt-debts"></td>
					</tr>`;
				}
			}
		}
		// !CSS styles for "Actual Credit Debt" rows set by event type ==================

		jQuery(".debt-tbody  tr:contains('obligation')").css({
			'background-color': '#fff',
			color: '#65000b',
		});
		jQuery(".debt-tbody  tr:contains('calculation')").css({
			'background-color': '#e6ecf4',
		});
		jQuery(".debt-tbody  tr:contains('advance')").css({
			'background-color': '#fffbe6',
		});
		jQuery(".debt-tbody  tr:contains('payment')").css({
			'background-color': '#e0ffe0',
		});
		for (let x = 1; x < debtTbodyTr.length; x++) {
			if (
				debtTypeOperation[x - 1].innerHTML == 'calculation' &&
				debtTypeOperation[x].innerHTML == 'advance'
			) {
				jQuery(debtTbodyTr[x - 1]).css({
					'background-color': '#fbdfdf',
				});
				jQuery(debtTbodyTr[x]).css({
					'background-color': '#fbdfdf',
				});
			}
		}
		// !=============================================================================

		// *initial values for totals
		debtTotalCredit.innerHTML = '0.00';
		debtTotalInterest.innerHTML = '0.00';
		debtTotalCommission.innerHTML = '0.00';
		debtTotalPenalty.innerHTML = '0.00';
		debtTotalAdvancePayment.innerHTML = '0.00';
		debtTotalAmountPaid.innerHTML = '0.00';
		debtTotalDebts.innerHTML = '0.00';
		// accrued
		debtTotalAccruedCredit.innerHTML = '0.00';
		debtTotalAccruedInterest.innerHTML = '0.00';
		debtTotalAccruedCommission.innerHTML = '0.00';
		debtTotalAccruedPenalty.innerHTML = '0.00';
		// paid
		debtTotalPaidCredit.innerHTML = '0.00';
		debtTotalPaidInterest.innerHTML = '0.00';
		debtTotalPaidCommission.innerHTML = '0.00';
		debtTotalPaidPenalty.innerHTML = '0.00';

		// adding data to the created table
		for (let i = 0; i < debtDate.length; i++) {
			// filling "Date" column is happening above

			// filling "Days" column
			if (i > 0) {
				debtDays[i].textContent = Math.round(
					(new Date(dateStringForDateObject(debtDate[i].innerHTML)).getTime() -
						new Date(
							dateStringForDateObject(debtDate[i - 1].innerHTML)
						).getTime()) /
						(1000 * 60 * 60 * 24)
				);
			}
			// filling "Days in the month" column
			for (let j = 1; j < arrScheduleDatePayment.length; j++) {
				if (
					new Date(dateStringForDateObject(debtDate[i].innerHTML)).getTime() ===
					new Date(dateStringForDateObject(arrScheduleDatePayment[j])).getTime()
				) {
					debtDaysMonth[i].innerHTML = arrDaysInMonth[j - 1];
				}
				if (
					new Date(
						dateStringForDateObject(arrScheduleDatePayment[j - 1])
					).getTime() <
						new Date(
							dateStringForDateObject(debtDate[i].innerHTML)
						).getTime() &&
					new Date(dateStringForDateObject(debtDate[i].innerHTML)).getTime() <
						new Date(
							dateStringForDateObject(arrScheduleDatePayment[j])
						).getTime()
				) {
					debtDaysMonth[i].innerHTML = arrDaysInMonth[j - 1];
				}
			}

			// filling "Credit balance" column
			if (i > 0) {
				if (parseFloat(debtCredit[i - 1].innerHTML) < 0) {
					debtCreditBalance[i].innerHTML = (
						parseFloat(debtCreditBalance[i - 1].innerHTML) +
						parseFloat(debtCredit[i - 1].innerHTML)
					).toFixed(2);
				} else {
					debtCreditBalance[i].innerHTML = debtCreditBalance[i - 1].innerHTML;
				}
			}
			debtCreditBalance[0].innerHTML = scheduleCreditBalance[0].innerHTML;

			// filling  last "Credit obligation / payment" when advance payment cover entire debt
			if (parseFloat(debtCreditBalance[i].innerHTML) == 0) {
				debtCredit[i].innerHTML = '0.00';
			} else if (
				index_EarlyRepaymentOfCredit != undefined &&
				debtTypeOperation[i].innerHTML == 'calculation' &&
				debtTypeOperation[i + 1].innerHTML == 'advance'
			) {
				debtCredit[i].innerHTML = parseFloat(
					debtCreditBalance[i].innerHTML
				).toFixed(2);
			} // filling Credit obligation / payment"  column in ordinary situation
			else {
				let currentJ = 0;
				for (let j = currentJ; j < scheduleDatePayment.length; j++) {
					if (
						new Date(
							dateStringForDateObject(debtDate[i].innerHTML)
						).getTime() ===
							new Date(
								dateStringForDateObject(scheduleDatePayment[j].innerHTML)
							).getTime() &&
						debtTypeOperation[i].innerHTML == 'obligation'
					) {
						debtCredit[i].innerHTML = scheduleCreditPayment[j].innerHTML;

						currentJ = j;

						break;
					}
				}
			}

			// filling "Credit obligation not paid on time" column
			if (i > 0) {
				debtCreditNotPaidOnTime[i].innerHTML = (
					parseFloat(debtCreditNotPaidOnTime[i - 1].innerHTML) +
					parseFloat(debtCredit[i - 1].innerHTML)
				).toFixed(2);
			}

			// filling "Interest obligation / payment" column
			if (i > 0 && debtDaysMonth[i].innerHTML != 0) {
				debtInterest[i].innerHTML = (
					(interestRate.innerHTML / 100 / debtDaysMonth[i].innerHTML) *
					debtDays[i].textContent *
					debtCreditBalance[i].innerHTML
				).toFixed(2);
			}

			// filling "Commission obligation / payment" column
			if (parseFloat(debtCreditBalance[i].innerHTML) == 0) {
				debtCommission[i].innerHTML = '0.00';
			} else {
				let lastJ = 1;
				for (let j = lastJ; j < arrScheduleDatePayment.length; j++) {
					if (
						new Date(
							dateStringForDateObject(debtDate[i].innerHTML)
						).getTime() ===
							new Date(
								dateStringForDateObject(arrScheduleDatePayment[j])
							).getTime() &&
						debtTypeOperation[i].innerHTML == 'obligation'
					) {
						debtCommission[i].innerHTML = parseFloat(
							inputMonthlyCommission.value
						).toFixed(2);

						lastJ = j;

						break;
					}
				}
			}

			debtCommission[0].innerHTML = parseFloat(
				inputSingleCommission.value
			).toFixed(2);

			// filling "Penalty obligation / payment" column
			if (i > 0) {
				debtPenalty[i].innerHTML = (
					((debtCreditNotPaidOnTime[i].innerHTML * dailyPenaltyRate.innerHTML) /
						100) *
					debtDays[i].textContent
				).toFixed(2);
			}

			// *Total row=================================================================
			// *Total Credit Balance
			debtTotalCreditBalance.innerHTML = debtCreditBalance[i].innerHTML;

			// *Total Credit =============================================
			if (
				debtTypeOperation[i].innerHTML == 'obligation' ||
				debtTypeOperation[i].innerHTML == 'calculation'
			) {
				//"if" statement is necessary to avoid
				//the boiling effect of "debtAmountPaid[i].innerHTML"
				// - avoiding double calculation of "debtTotalCredit.innerHTML"
				//by using two times "debtAmountPaid[i].innerHTML"
				//from "if" statement from "payment" event
				debtTotalCredit.innerHTML = (
					parseFloat(debtTotalCredit.innerHTML) +
					parseFloat(debtCredit[i].innerHTML)
				).toFixed(2);
			}

			// *Total Interest =============================================
			debtTotalInterest.innerHTML = (
				parseFloat(debtTotalInterest.innerHTML) +
				parseFloat(debtInterest[i].innerHTML)
			).toFixed(2);

			// *Total Commission ===========================================
			if (debtTypeOperation[i].innerHTML == 'obligation') {
				//"if" statement is necessary to avoid
				//the boiling effect of "debtAmountPaid[i].innerHTML"
				// - avoiding double calculation of "debtTotalCommission.innerHTML"
				//by using two times "debtAmountPaid[i].innerHTML"
				//from "if" statement from "payment" event
				debtTotalCommission.innerHTML = (
					parseFloat(debtTotalCommission.innerHTML) +
					parseFloat(debtCommission[i].innerHTML)
				).toFixed(2);
			}

			// *Total Penalty ==============================================
			debtTotalPenalty.innerHTML = (
				parseFloat(debtTotalPenalty.innerHTML) +
				parseFloat(debtPenalty[i].innerHTML)
			).toFixed(2);

			// *Total Advance Payment ======================================
			/*
			debtTotalAdvancePayment.innerHTML
			is calculated below, in the "Advance payment accumulation",
			which belongs to the "Payment distribution" section
			*/

			// *Total Amount Paid ==========================================
			debtTotalAmountPaid.innerHTML = (
				parseFloat(debtTotalAmountPaid.innerHTML) +
				parseFloat(debtAmountPaid[i].innerHTML)
			).toFixed(2);

			// ? Advance Payment distribution ============================================
			if (debtTypeOperation[i].innerHTML == 'advance') {
				// ?Penalty payment from advance payment====================================
				if (
					// if debtTotalAdvancePayment greater than debtTotalPenalty
					-parseFloat(debtTotalAdvancePayment.innerHTML) >=
					parseFloat(debtTotalPenalty.innerHTML)
				) {
					debtPenalty[i].innerHTML = (-parseFloat(
						debtTotalPenalty.innerHTML
					)).toFixed(2);

					debtTotalAdvancePayment.innerHTML = (
						parseFloat(debtTotalAdvancePayment.innerHTML) +
						parseFloat(debtTotalPenalty.innerHTML)
					).toFixed(2);

					debtTotalPenalty.innerHTML = '0.00';
				} else if (
					//if debtTotalAdvancePayment less than debtTotalPenalty
					-parseFloat(debtTotalAdvancePayment.innerHTML) <
					parseFloat(debtTotalPenalty.innerHTML)
				) {
					debtPenalty[i].innerHTML = parseFloat(
						debtTotalAdvancePayment.innerHTML
					).toFixed(2);

					debtTotalPenalty.innerHTML = (
						parseFloat(debtTotalPenalty.innerHTML) +
						parseFloat(debtTotalAdvancePayment.innerHTML)
					).toFixed(2);

					debtTotalAdvancePayment.innerHTML = '0.00';
				}

				// ?Commission payment from advance payment====================================
				if (
					// if debtTotalAdvancePayment greater than debtTotalCommission
					-parseFloat(debtTotalAdvancePayment.innerHTML) >=
					parseFloat(debtTotalCommission.innerHTML)
				) {
					debtCommission[i].innerHTML = (-parseFloat(
						debtTotalCommission.innerHTML
					)).toFixed(2);

					debtTotalAdvancePayment.innerHTML = (
						parseFloat(debtTotalAdvancePayment.innerHTML) +
						parseFloat(debtTotalCommission.innerHTML)
					).toFixed(2);

					debtTotalCommission.innerHTML = '0.00';
				} else if (
					//if debtTotalAdvancePayment less than debtTotalCommission
					-parseFloat(debtTotalAdvancePayment.innerHTML) <
					parseFloat(debtTotalCommission.innerHTML)
				) {
					debtCommission[i].innerHTML = parseFloat(
						debtTotalAdvancePayment.innerHTML
					).toFixed(2);

					debtTotalCommission.innerHTML = (
						parseFloat(debtTotalCommission.innerHTML) +
						parseFloat(debtTotalAdvancePayment.innerHTML)
					).toFixed(2);

					debtTotalAdvancePayment.innerHTML = '0.00';
				}

				// ?Interest payment from advance payment====================================
				if (
					// if debtTotalAdvancePayment greater than debtTotalInterest
					-parseFloat(debtTotalAdvancePayment.innerHTML) >=
					parseFloat(debtTotalInterest.innerHTML)
				) {
					debtInterest[i].innerHTML = (-parseFloat(
						debtTotalInterest.innerHTML
					)).toFixed(2);

					debtTotalAdvancePayment.innerHTML = (
						parseFloat(debtTotalAdvancePayment.innerHTML) +
						parseFloat(debtTotalInterest.innerHTML)
					).toFixed(2);

					debtTotalInterest.innerHTML = '0.00';
				} else if (
					//if debtTotalAdvancePayment less than debtTotalInterest
					-parseFloat(debtTotalAdvancePayment.innerHTML) <
					parseFloat(debtTotalInterest.innerHTML)
				) {
					debtInterest[i].innerHTML = parseFloat(
						debtTotalAdvancePayment.innerHTML
					).toFixed(2);

					debtTotalInterest.innerHTML = (
						parseFloat(debtTotalInterest.innerHTML) +
						parseFloat(debtTotalAdvancePayment.innerHTML)
					).toFixed(2);

					debtTotalAdvancePayment.innerHTML = '0.00';
				}
				// ?Credit payment from advance payment====================================

				if (
					// if debtTotalAdvancePayment greater than debtTotalCredit
					-parseFloat(debtTotalAdvancePayment.innerHTML) >=
					parseFloat(debtTotalCredit.innerHTML)
				) {
					debtCredit[i].innerHTML = (-parseFloat(
						debtTotalCredit.innerHTML
					)).toFixed(2);

					debtTotalAdvancePayment.innerHTML = (
						parseFloat(debtTotalAdvancePayment.innerHTML) +
						parseFloat(debtTotalCredit.innerHTML)
					).toFixed(2);

					debtTotalCredit.innerHTML = '0.00';
				} else if (
					//if debtTotalAdvancePayment less than debtTotalCredit
					-parseFloat(debtTotalAdvancePayment.innerHTML) <
					parseFloat(debtTotalCredit.innerHTML)
				) {
					debtCredit[i].innerHTML = parseFloat(
						debtTotalAdvancePayment.innerHTML
					).toFixed(2);

					debtTotalCredit.innerHTML = (
						parseFloat(debtTotalCredit.innerHTML) +
						parseFloat(debtTotalAdvancePayment.innerHTML)
					).toFixed(2);

					debtTotalAdvancePayment.innerHTML = '0.00';
				}
				// ?advance payment total distribution ==================================
				debtAdvancePayment[i].innerHTML = (
					-parseFloat(debtPenalty[i].innerHTML) +
					-parseFloat(debtCommission[i].innerHTML) +
					-parseFloat(debtInterest[i].innerHTML) +
					-parseFloat(debtCredit[i].innerHTML)
				).toFixed(2);
			}

			// *Payment distribution ============================================

			if (debtTypeOperation[i].innerHTML == 'payment') {
				let tempDebtAmountPaid = debtAmountPaid[i].innerHTML;

				// *Penalty payment ======================================
				if (
					// if tempDebtAmountPaid greater than debtTotalPenalty
					parseFloat(tempDebtAmountPaid) >=
					parseFloat(debtTotalPenalty.innerHTML)
				) {
					debtPenalty[i].innerHTML = (-parseFloat(
						debtTotalPenalty.innerHTML
					)).toFixed(2);

					tempDebtAmountPaid = (
						parseFloat(tempDebtAmountPaid) -
						parseFloat(debtTotalPenalty.innerHTML)
					).toFixed(2);

					debtTotalPenalty.innerHTML = '0.00';
				} else if (
					//if tempDebtAmountPaid less than debtTotalPenalty
					parseFloat(tempDebtAmountPaid) <
					parseFloat(debtTotalPenalty.innerHTML)
				) {
					debtPenalty[i].innerHTML = (-tempDebtAmountPaid).toFixed(2);

					debtTotalPenalty.innerHTML = (
						parseFloat(debtTotalPenalty.innerHTML) -
						parseFloat(tempDebtAmountPaid)
					).toFixed(2);

					tempDebtAmountPaid = 0;
				}

				// *Commission payment =======================================
				if (
					// if tempDebtAmountPaid greater than debtTotalCommission
					parseFloat(tempDebtAmountPaid) >=
					parseFloat(debtTotalCommission.innerHTML)
				) {
					debtCommission[i].innerHTML = (-parseFloat(
						debtTotalCommission.innerHTML
					)).toFixed(2);

					tempDebtAmountPaid = (
						parseFloat(tempDebtAmountPaid) -
						parseFloat(debtTotalCommission.innerHTML)
					).toFixed(2);

					debtTotalCommission.innerHTML = '0.00';
				} else if (
					//if tempDebtAmountPaid less than debtTotalCommission
					parseFloat(tempDebtAmountPaid) <
					parseFloat(debtTotalCommission.innerHTML)
				) {
					debtCommission[i].innerHTML = (-tempDebtAmountPaid).toFixed(2);

					debtTotalCommission.innerHTML = (
						parseFloat(debtTotalCommission.innerHTML) -
						parseFloat(tempDebtAmountPaid)
					).toFixed(2);

					tempDebtAmountPaid = 0;
				}

				// *Interest payment ======================================
				if (
					// if tempDebtAmountPaid greater than debtTotalInterest
					parseFloat(tempDebtAmountPaid) >=
					parseFloat(debtTotalInterest.innerHTML)
				) {
					debtInterest[i].innerHTML = (-parseFloat(
						debtTotalInterest.innerHTML
					)).toFixed(2);

					tempDebtAmountPaid = (
						parseFloat(tempDebtAmountPaid) -
						parseFloat(debtTotalInterest.innerHTML)
					).toFixed(2);

					debtTotalInterest.innerHTML = '0.00';
				} else if (
					//if tempDebtAmountPaid less than debtTotalInterest
					parseFloat(tempDebtAmountPaid) <
					parseFloat(debtTotalInterest.innerHTML)
				) {
					debtInterest[i].innerHTML = (-tempDebtAmountPaid).toFixed(2);

					debtTotalInterest.innerHTML = (
						parseFloat(debtTotalInterest.innerHTML) -
						parseFloat(tempDebtAmountPaid)
					).toFixed(2);

					tempDebtAmountPaid = 0;
				}
				// *Credit payment ======================================
				if (
					// if tempDebtAmountPaid greater than debtTotalCredit
					parseFloat(tempDebtAmountPaid) >=
					parseFloat(debtTotalCredit.innerHTML)
				) {
					debtCredit[i].innerHTML = (-parseFloat(
						debtTotalCredit.innerHTML
					)).toFixed(2);

					tempDebtAmountPaid = (
						parseFloat(tempDebtAmountPaid) -
						parseFloat(debtTotalCredit.innerHTML)
					).toFixed(2);

					debtTotalCredit.innerHTML = '0.00';
				} else if (
					//if tempDebtAmountPaid less than debtTotalCredit
					parseFloat(tempDebtAmountPaid) < parseFloat(debtTotalCredit.innerHTML)
				) {
					debtCredit[i].innerHTML = (-tempDebtAmountPaid).toFixed(2);

					debtTotalCredit.innerHTML = (
						parseFloat(debtTotalCredit.innerHTML) -
						parseFloat(tempDebtAmountPaid)
					).toFixed(2);

					tempDebtAmountPaid = 0;
				}
				// *Advance payment accumulation ======================================
				if (parseFloat(tempDebtAmountPaid) > 0) {
					debtAdvancePayment[i].innerHTML = (-tempDebtAmountPaid).toFixed(2);

					debtTotalAdvancePayment.innerHTML = (
						parseFloat(debtTotalAdvancePayment.innerHTML) +
						parseFloat(debtAdvancePayment[i].innerHTML)
					).toFixed(2);

					tempDebtAmountPaid = 0;
				}
			}

			// ? Total Accrued and Total Paid  ==============================
			// ?Total Credit Accrued ==========
			if (parseFloat(debtCredit[i].innerHTML) >= 0) {
				debtTotalAccruedCredit.innerHTML = (
					parseFloat(debtTotalAccruedCredit.innerHTML) +
					parseFloat(debtCredit[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Credit Paid ==========
			if (parseFloat(debtCredit[i].innerHTML) < 0) {
				debtTotalPaidCredit.innerHTML = (
					parseFloat(debtTotalPaidCredit.innerHTML) +
					parseFloat(debtCredit[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Interest Accrued ==========
			if (parseFloat(debtInterest[i].innerHTML) >= 0) {
				debtTotalAccruedInterest.innerHTML = (
					parseFloat(debtTotalAccruedInterest.innerHTML) +
					parseFloat(debtInterest[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Interest Paid ==========
			if (parseFloat(debtInterest[i].innerHTML) < 0) {
				debtTotalPaidInterest.innerHTML = (
					parseFloat(debtTotalPaidInterest.innerHTML) +
					parseFloat(debtInterest[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Commission Accrued ==========
			if (parseFloat(debtCommission[i].innerHTML) >= 0) {
				debtTotalAccruedCommission.innerHTML = (
					parseFloat(debtTotalAccruedCommission.innerHTML) +
					parseFloat(debtCommission[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Commission Paid ==========
			if (parseFloat(debtCommission[i].innerHTML) < 0) {
				debtTotalPaidCommission.innerHTML = (
					parseFloat(debtTotalPaidCommission.innerHTML) +
					parseFloat(debtCommission[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Penalty Accrued ==========
			if (parseFloat(debtPenalty[i].innerHTML) >= 0) {
				debtTotalAccruedPenalty.innerHTML = (
					parseFloat(debtTotalAccruedPenalty.innerHTML) +
					parseFloat(debtPenalty[i].innerHTML)
				).toFixed(2);
			}
			// ?Total Penalty Paid ==========
			if (parseFloat(debtPenalty[i].innerHTML) < 0) {
				debtTotalPaidPenalty.innerHTML = (
					parseFloat(debtTotalPaidPenalty.innerHTML) +
					parseFloat(debtPenalty[i].innerHTML)
				).toFixed(2);
			}
			// ! Total Debts after all type of operations ==============================
			debtTotalDebts.innerHTML = (
				parseFloat(debtTotalCreditBalance.innerHTML) +
				parseFloat(debtTotalInterest.innerHTML) +
				parseFloat(debtTotalCommission.innerHTML) +
				parseFloat(debtTotalPenalty.innerHTML) +
				parseFloat(debtTotalAdvancePayment.innerHTML)
			).toFixed(2);
			// !========================================================================
			// ? ===================================
			/*
			finding out the first index and the first date at which the payment is sufficient
			for the early repayment of the credit. 
			It is used to insert in the appropriate place in the table
			such a prepayment event (to see the beginning of the function)
			*/
			if (
				parseFloat(debtTotalCreditBalance.innerHTML) > 0 &&
				-parseFloat(debtTotalAdvancePayment.innerHTML) >=
					parseFloat(debtTotalCreditBalance.innerHTML) +
						parseFloat(debtCredit[i].innerHTML) &&
				index_EarlyRepaymentOfCredit == undefined &&
				parseFloat(debtTotalCreditBalance.innerHTML) +
					parseFloat(debtCredit[i].innerHTML) >
					0
			) {
				index_EarlyRepaymentOfCredit = i;
				indexDate_EarlyRepaymentOfCredit = debtDate[i].innerHTML;
			}

			// ? ====================================
		}
	}
}
completingActualCreditDebtTable();
// ! End "ACTUAL CREDIT DEBT" table ==========================================================
// !==========================================================================================

// * on input event updating the values of Interest Rate,
// * Credit Amount, Number of Months and Interest Amount, Annuity

rangeInterestRate.addEventListener('input', () => {
	interestRate.innerHTML = rangeInterestRate.value;
	annuity.innerHTML = calcAnnuity();
	completingScheduleTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

rangeDailyPenaltyRate.addEventListener('input', () => {
	dailyPenaltyRate.innerHTML = rangeDailyPenaltyRate.value;
	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

rangeMonths.addEventListener('input', function () {
	months.innerHTML = rangeMonths.value;
	outputDateRepayment.textContent = ddmmyyyy(
		new Date(dateStringForDateObject(inputDateCreditIssue.value)).addMonths(
			parseInt(months.textContent)
		)
	);

	annuity.innerHTML = calcAnnuity();
	completingScheduleTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

creditAmount.addEventListener('input', () => {
	annuity.innerHTML = calcAnnuity();
	completingScheduleTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();

	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
inputMonthlyCommission.addEventListener('input', function () {
	completingScheduleTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();
	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
inputSingleCommission.addEventListener('input', function () {
	completingScheduleTable();
	internalRateOfReturn.innerHTML = calcIRR();
	effectiveAnnualInterestRate.innerHTML = calcEAR();
	totalCreditCost.textContent = calcTotalCreditCost();
	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

// * on input event updating the values
jQuery(inputDateCreditIssue).on('input change', function () {
	outputDateRepayment.textContent = ddmmyyyy(
		new Date(dateStringForDateObject(inputDateCreditIssue.value)).addMonths(
			parseInt(months.textContent)
		)
	);
	completingScheduleTable();

	inputDateActualDebt.value = ddmmyyyy(
		new Date(dateStringForDateObject(inputDateCreditIssue.value)).addMonths(6)
	);

	if (inputDateCreditIssue.value != '') {
		jQuery(inputDateActualDebt).datepicker(
			'option',
			'minDate',
			inputDateCreditIssue.value
		);
		jQuery(inputPaymentDate).datepicker(
			'option',
			'minDate',
			inputDateCreditIssue.value
		);
		jQuery(inputPaymentDate).datepicker(
			'option',
			'maxDate',
			ddmmyyyy(
				// one day less than Date of actual debt calculation
				new Date(
					new Date(
						dateStringForDateObject(inputDateActualDebt.value)
					).getTime() -
						1000 * 60 * 60 * 24
				)
			)
		);
	}
	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
jQuery(inputDateActualDebt).on('input change', function () {
	if (inputDateActualDebt.value != '') {
		jQuery(inputPaymentDate).datepicker(
			'option',
			'maxDate',
			ddmmyyyy(
				// one day less than Date of actual debt calculation
				new Date(
					new Date(
						dateStringForDateObject(inputDateActualDebt.value)
					).getTime() -
						1000 * 60 * 60 * 24
				)
			)
		);
	}
	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

addPaymentButton.addEventListener('click', function (e) {
	onAddPaymentButton(e);

	if (
		paymentsDatePayment[paymentsDatePayment.length - 1]?.textContent !=
		undefined
	) {
		jQuery(inputPaymentDate).datepicker(
			'option',
			'minDate',
			paymentsDatePayment[paymentsDatePayment.length - 1].textContent
		);
	}
	paymentsTotalAmountPaid();
	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});

paymentsTbody.addEventListener('click', function (e) {
	onDeleteRow(e);
	onEditRow(e);
	onSaveRow(e);

	completingActualCreditDebtTable();

	console.log(t1 - t0, 'milliseconds'); //!performance
});
// Alert if the page is opened on a mobile device and screen width is less than 1024px ========
window.addEventListener('load', () => {
	if (screen.width < 1024) {
		alert(
			'It is recommended to open the web page on a desktop device for more convenient viewing of tables, more precise adjustment of range sliders using the arrow keys on the keyboard ("<--", "-->").'
		);
	}
});
//! Performance ====================================
const t1 = performance.now(); //!performance (second value)
console.log(t1 - t0, 'milliseconds'); //!performance

//! ====================================================

const moment = require("moment");
const fs = require("fs");

function readDataFromFile(pathToFile) {
	fs.readFile(pathToFile, "utf-8", (err, jsonString) => {
		if (err) {
			console.log(err);
			return;
		}
		getBalanceSheet(jsonString);
	});
}

//Uncomment below line and add path to read input from file
//readDataFromFile("./2-input.json");
//Or call the getBalanceSheet() by directly passing it JSON string

function getBalanceSheet(revAndExpData) {
	let revAndExpDataObj;
	if (typeof revAndExpData === "string") {
		revAndExpDataObj = JSON.parse(revAndExpData);
	} else {
		revAndExpDataObj = revAndExpData;
	}

	const { revenueData, expenseData } = revAndExpDataObj;

	const cleanedRevenueData = cleanData(revenueData);
	const cleanedExpenseData = cleanData(expenseData);

	const allStartDates = getAllStartDates(
		cleanedRevenueData,
		cleanedExpenseData
	);

	const balanceSheet = [];

	allStartDates.forEach((date) => {
		if (cleanedExpenseData[date] && cleanedRevenueData[date]) {
			const amount =
				cleanedRevenueData[date].amount - cleanedExpenseData[date].amount;
			const startDate = cleanedRevenueData[date].startDate;
			balanceSheet.push({ amount, startDate });
		} else if (!cleanedExpenseData[date] && !cleanedRevenueData[date]) {
			const amount = 0;
			const startDate = date;
			balanceSheet.push({ amount, startDate });
		} else if (!cleanedRevenueData[date]) {
			const amount = -1 * cleanedExpenseData[date].amount;
			const startDate = cleanedExpenseData[date].startDate;
			balanceSheet.push({ amount, startDate });
		} else if (!cleanedExpenseData[date]) {
			const amount = cleanedRevenueData[date].amount;
			const startDate = cleanedRevenueData[date].startDate;
			balanceSheet.push({ amount, startDate });
		}
	});

	console.log(balanceSheet);
}

function cleanData(data) {
	const newData = {};

	data.forEach((element) => {
		if (newData[element.startDate]) {
			newData[element.startDate] = {
				amount: element.amount + newData[element.startDate].amount,
				startDate: element.startDate,
			};
		} else {
			newData[element.startDate] = element;
		}
	});

	return newData;
}

function getAllStartDates(revData, expData) {
	const allStartDates = [];
	allStartDates.push(...Object.keys(revData), ...Object.keys(expData));
	allStartDates.sort();
	let uniqueStartDates = new Set(allStartDates);

	let allDates = Array.from(uniqueStartDates);
	for (let i = 1; i < allDates.length; i++) {
		const date1 = allDates[i - 1];
		const date2 = allDates[i];
		const year1 = new Date(date1).getFullYear();
		const month1 = new Date(date1).getMonth();
		const year2 = new Date(date2).getFullYear();
		const month2 = new Date(date2).getMonth();

		if (year2 === year1 && month2 !== month1 + 1) {
			const newDate = new Date(year1, month1 + 1, 1, 5, 30, 0).toISOString();
			allDates = [...allDates.slice(0, i), newDate, ...allDates.slice(i)];
		} else if (year2 !== year1) {
			let startDate = moment(allDates[i - 1]);
			let endDate = moment(allDates[i]);

			var result = [];

			while (startDate.isBefore(endDate)) {
				result.push(startDate.toISOString());
				startDate.add(1, "month");
			}

			allDates = [...allDates.slice(0, i), ...result, ...allDates.slice(i)];

			i = i + result.length;
		}
	}
	uniqueStartDates = new Set([...allDates]);

	return uniqueStartDates;
}

// getBalanceSheet({
// 	expenseData: [
// 		{
// 			amount: 20,
// 			startDate: "2020-05-01T00:00:00.000Z",
// 		},
// 		{
// 			amount: 30,
// 			startDate: "2020-03-01T00:00:00.000Z",
// 		},
// 	],
// 	revenueData: [
// 		{
// 			amount: 60,
// 			startDate: "2019-09-01T00:00:00.000Z",
// 		},
// 		{
// 			amount: 60,
// 			startDate: "2020-03-01T00:00:00.000Z",
// 		},
// 		{
// 			amount: 0,
// 			startDate: "2020-02-01T00:00:00.000Z",
// 		},
// 		{
// 			amount: 10,
// 			startDate: "2020-03-01T00:00:00.000Z",
// 		},
// 		{
// 			amount: 40,
// 			startDate: "2020-01-01T00:00:00.000Z",
// 		},
// 	],
// });

getBalanceSheet({
	expenseData: [
		{
			amount: 50,
			startDate: "2021-01-01T00:00:00.000Z",
		},
		{
			amount: 20,
			startDate: "2021-02-01T00:00:00.000Z",
		},
		{
			amount: 30,
			startDate: "2021-03-01T00:00:00.000Z",
		},
	],
	revenueData: [
		{
			amount: 60,
			startDate: "2021-02-01T00:00:00.000Z",
		},
	],
});

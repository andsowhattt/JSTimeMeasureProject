'use strict';
// оголошення змінних
const selectFirstDay = document.getElementById('startDate');
const selectLastDay = document.getElementById('endDate');
const output = document.getElementById('output');
const dateOptions = document.getElementById('date__filters-days');
const timeOptions = document.getElementById('date__filters-option');
const monthButton = document.getElementById('monthButton');
const weekButton = document.getElementById('weekButton');

// функція обробки натискання на кнопку
document.getElementById('calculateButton').addEventListener('click', function () {
	const startDate = new Date(selectFirstDay.value);
	const endDate = new Date(selectLastDay.value);
	if (isNaN(startDate) || isNaN(endDate)) {
		// якщо дата недійсна, вивести Invalid Date
		output.innerHTML = 'Invalid Date';
		return;
	}
	// перевірка, щоб кінцева дата не була раніше за початкову
	if (endDate < startDate) {
		// якщо кінцева дата раніше за початкову - повідомлення
		alert('End date cannot be earlier than start date');
		return;
	}
	// розрахунок різниці в датах
	// різниця в мілісекундах
	let millisecDiff = endDate.getTime() - startDate.getTime();
	// різниця в днях
	let daysDiff = Math.round(millisecDiff / (24 * 60 * 60 * 1000));

	// вибір варіанту підрахунку днів
	let sumDays;

	switch (dateOptions.value) {
		// всі дні
		case 'all':
			sumDays = daysDiff;
			// виведення результату
			output.innerHTML = `Result <span>${sumDays}</span> days.`;
			break;
		// робочі дні
		case 'weekdays':
			sumDays = sumBusinessDays(startDate, endDate);
			// виведення результату
			output.innerHTML = `Result <span>${sumDays}</span> weekdays.`;
			break;
		// вихідні
		case 'weekends':
			sumDays = sumWeekends(startDate, endDate);
			// виведення результату
			output.innerHTML = `Result <span>${sumDays}</span> weekends.`;
			break;
	}

	// вибір варіанту підрахунку часу
	let result;
	let timeUnit;

	// вибір розмірності часу
	switch (timeOptions.value) {
		// дні
		case 'days':
			result = sumDays;
			timeUnit = 'days';
			break;
		case 'hours':
			if (dateOptions.value === 'all') {
				result = millisecDiff / (60 * 60 * 1000);
			} else {
				result = sumDays * 24;
			}
			timeUnit = 'hours';
			break;
		case 'minutes':
			if (dateOptions.value === 'all') {
				result = millisecDiff / (60 * 1000);
			} else {
				result = sumDays * 24 * 60;
			}
			timeUnit = 'minutes';
			break;
		case 'seconds':
			if (dateOptions.value === 'all') {
				result = millisecDiff / 1000;
			} else {
				result = sumDays * 24 * 60 * 60;
			}
			timeUnit = 'seconds';
			break;
	}

	// виведення результату з розмірністю
	output.innerHTML = `<span class="counting-title">The result of counting:</span><span class="counting-results"> ${dateOptions.options[dateOptions.selectedIndex].text} (${Math.trunc(result)} ${timeUnit})</span>`;

	// додавання результату до таблиці і збереження
	let newResult = {
		// початкова дата
		startDate: startDate.toDateString(),
		// кінцева дата
		endDate: endDate.toDateString(),
		result: `${Math.trunc(result)} ${timeUnit}`
	};
	// додаємо результат в початок масиву
	latestResults.unshift(newResult);
	// якщо в масиві більше 10 елементів, видаляємо останній
	while (latestResults.length > 10) {
		latestResults.pop();
		// видаляємо останній рядок з таблиці
		tableContent.deleteRow(-1);
	}
	// вставляємо новий рядок з результатом в початок таблиці
	tableContent.insertRow(0).innerHTML = '<td>' + newResult.startDate + '</td><td>' + newResult.endDate + '</td><td>' + newResult.result + '</td>';
	// зберігаємо масив з результатами в локальному сховищі
	localStorage.setItem('dateResults', JSON.stringify(latestResults));
});

// додаю слухач подій до кнопки додати плюс місяць
monthButton.addEventListener('click', function () {
	// отримую значення дати з першого інпуту
	const startDate = new Date(selectFirstDay.value);
	// додаю 30 днів до дати
	const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
	// встановлюю результат на другий інпут
	selectLastDay.valueAsDate = endDate;
});

// додаю слухач подій до кнопки додати плюс тиждень
weekButton.addEventListener('click', function () {
	// отримую значення дати з першого інпуту
	const startDate = new Date(selectFirstDay.value);
	// додаю 7 днів до дати
	const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
	// встановлюю результат на другий інпут
	selectLastDay.valueAsDate = endDate;
});

// вихідні
function sumWeekends(startDate, endDate) {
	let count = 0;
	let curDate = new Date(startDate);
	while (curDate <= endDate) {
		const dayOfWeek = curDate.getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			count++;
		}
		curDate.setDate(curDate.getDate() + 1);
	}
	return count;
}

// будні
function sumBusinessDays(startDate, endDate) {
	let count = 0;
	let curDate = new Date(startDate);
	while (curDate < endDate) {
		const dayOfWeek = curDate.getDay();
		if (dayOfWeek >= 1 && dayOfWeek <= 5) {
			count++;
		}
		curDate.setDate(curDate.getDate() + 1);
	}
	return count;
}


// локальне сховище
let latestResults = JSON.parse(localStorage.getItem('dateResults')) || [];

// збереження результатів
let tableContent = document.getElementById('data__info-table').getElementsByTagName('tbody')[0];
// цикл для перегляду результатів
for (let i = 0; i < latestResults.length && i < 10; i++) {
	// обираємо поточний результат
	let result = latestResults[i];
	// додаємо новий рядок у таблицю
	let row = tableContent.insertRow();
	// додаємо значення початкової дати 
	row.insertCell().textContent = result.startDate;
	// додаємо значення кінцевої дати
	row.insertCell().textContent = result.endDate;
	// додаємо результат 
	row.insertCell().textContent = result.result;
}


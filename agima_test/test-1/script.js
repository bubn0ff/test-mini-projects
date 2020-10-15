let data = [
  { 
    day: 'пн',
    work: [
      { time: '10:00', todo: 'Совещание' },
      { time: '11:00', todo: 'Кофебрейк' },
      { time: '11:20', todo: 'Проектная работа' },
    ]
  },
  { 
    day: 'вт',
    work: [
      { time: '09:15', todo: 'Переговоры' },
      { time: '12:10', todo: 'Звонок инвесторам' },
      { time: '12:20', todo: 'Обед' },
    ],
  },
  { 
    day: 'ср',
    work: [
      { time: '08:00', todo: 'Разобрать почту' },
      { time: '08:35', todo: 'Завтрак' },
      { time: '09:00', todo: 'Работа с ошибками' },
    ],
  },
  { 
    day: 'чт',
    work: [
      { time: '13:00', todo: 'Менторство' },
      { time: '14:35', todo: 'Кодстайл' },
      { time: '15:10', todo: 'Звонок дизайнеру' },
    ],
  },
  { 
    day: 'пт',
    work: [
      { time: '13:20', todo: 'Совещание' },
      { time: '15:40', todo: 'Беседа с шефом' },
      { time: '16:00', todo: 'Залить код' },
    ],
  },
  { 
    day: 'сб',
    work: [
      { time: '19:20', todo: 'Звонок коллеге' },
    ],
  },
  { 
    day: 'вс',
    work: [
      { time: '18:00', todo: 'Отправить файлы' },
      { time: '18:15', todo: 'Обновить сайт' },
    ],
  },
];


// const z = data.filter(el => el.day === 'чт')[0];
// console.log(z); // объект с ключами day и work (а тут массив трёх объектов)
// console.log(z.work); // массив объектов ключа work (ЕГО И НАДО ПЕРЕБИРАТЬ!!!)


const scheduleList = document.querySelector('.schedule__list');
const scheduleRows = document.querySelector('.schedule__rows');
const scheduleAdd = document.querySelector('.schedule__add');
const scheduleCross = document.querySelector('.schedule__cross');
const scheduleDays = document.querySelector('.schedule__days');
const scheduleInputTime = document.querySelector('.schedule__input_time');
const scheduleInputTodo = document.querySelector('.schedule__input_todo');

// если есть в локальном хранилище данные - парсим их в переменную data
if (localStorage.getItem('data')) {
  data = JSON.parse(localStorage.getItem('data'));
}

// Функция вывода дней недели в правый блок с подгрузкой данных в левый блок
const setDays = () => {
  // выводим дни недели из переменной data в правый блок
  const days = data.map(el => el.day);

  for (let el in days) {
    scheduleDays.children[0].innerHTML += `<li class="schedule__days_item">${days[el]}</li>`;
  }

  const scheduleDaysItems = document.querySelectorAll('.schedule__days_item'); // li только появились!

  for (let item of scheduleDaysItems) {
    // подсвечиваем текущий день недели и загружаем его дела в левый блок
    if (item.textContent === transformDay()) {
      addClassToElement(item, 'active');
      const currentDay = data.filter(el => el.day === transformDay())[0];
      const currentTodo = currentDay.work;
      currentTodo.map(el => addRowsInDOM(el));
    }
    
    item.addEventListener("click", (e) => {
      // удаляем у всех дней недели класс .active и ставим его текущему дню
      deleteClassInArray(scheduleDaysItems);
      addClassToElement(e.target, 'active');

      // удаляем все существующие дела в пeрвом блоке
      const dynamicScheduleRows = document.querySelectorAll('.schedule__rows');
      Array.from(dynamicScheduleRows).forEach(el => el.remove());

      // загружаем дела по выбранному дню недели в левый блок
      const selectedDay = data.filter(el => el.day === e.target.textContent)[0];
      const selectedTodo = selectedDay.work;
      selectedTodo.map(el => addRowsInDOM(el));
    })
  }
}

// Функция добавления класса элементу
const addClassToElement = (element, needClass) => {
  element.classList.add(needClass);
}

// Функция удаления класса у элементов массива
const deleteClassInArray = (el) => {
  Array.from(el).forEach(item => {
    item.classList.remove('active');
  });
}

// Функция создания блока schedule__rows
const addRowsInDOM = (obj) => {
  const newRows = document.createElement('div');
  addClassToElement(newRows, 'schedule__rows');  
  newRows.innerHTML = 
    `
    <p class="schedule__time">${obj.time}</p>
    <p class="schedule__todo">${obj.todo}</p>
    <button class="schedule__cross"></button>
    `

  // вставляем newRows перед блоком scheduleAdd
  scheduleAdd.before(newRows);
}

// Функция перевода дня недели - из numeric в string с укорачиванием до первых двух символов
const transformDay = () => {
  const today = new Date().getDay().toLocaleString('ru');
  const daysArr = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  return daysArr[today].substring(0, 2);
}

// После полной загрузки сайта подгружаю данные из переменной в расписание
document.addEventListener("DOMContentLoaded", setDays);




// Модель одного дела (sked = синоним "расписание")
class Sked {
  constructor(time, todo) {
    this.time = time;
    this.todo = todo;
  }
}

class App {
  static addSked(sked) {
    if (sked.time && sked.todo) {
      /* создаём новый schedule__rows с плавным добавлением в расписание.
      ** функцию addRowsInDOM() не использовал потому, что не придумал, как правильно реализовать  
      ** плавное добавление нового блока в расписание, чтобы это распространялось только на addSked()
      */
      const newRows = document.createElement('div');
      addClassToElement(newRows, 'schedule__rows');
      addClassToElement(newRows, 'new__rows');
      newRows.innerHTML = 
        `
        <p class="schedule__time">${sked.time}</p>
        <p class="schedule__todo">${sked.todo}</p>
        <button class="schedule__cross"></button>
        `
        
      // вставляем newRows перед блоком scheduleAdd
      scheduleAdd.before(newRows);

      // добавляем новое дело в data
      addRowsInData(sked);

      // сортируем все дела (с новыми) в data
      // получаем текущий день недели в строковом формате
      const activeDay = document.querySelector('.active').textContent;

      // фильтруем data по текущему дню и получаем все его дела
      const selectedDay = data.filter(el => el.day === activeDay)[0];
      const selectedTodo = selectedDay.work;

      // сортируем дела в data по time
      selectedTodo.sort(sortByField('time'));

      // удаляем все существующие дела в пeрвом блоке
      const dynamicScheduleRows = document.querySelectorAll('.schedule__rows');
      Array.from(dynamicScheduleRows).forEach(el => el.remove());

      // загружаем дела по выбранному дню недели в левый блок
      selectedTodo.map(el => addRowsInDOM(el));

      // переводим фокус в первый input
      scheduleInputTime.focus();

      // добавляем все данные из data в локальное хранилище
      setLocalStorage(data);
    } else {
      null;
    }
  }

  // удаляем дело из расписания
  static deleteSked(el) {
    if (el.classList.contains('schedule__cross')) {
      el.parentElement.remove(); // удаляем выбранное дело из DOM
      deleteRowsInData(el); // удаляем выбранное дело из переменной data
    } else {
      null;
    }
  }

  // редактируем дело в расписании
  static editSked(el) {

    
    // TODO: реализовать!!!
    

  }

  // очищаем поля ввода в форме
  static clearFieldsInForm() {
    scheduleInputTime.value = '';
    scheduleInputTodo.value = '';
  }
}

// Функция удаления дел из data
const deleteRowsInData = (el) => {
  // получаем текущий день недели в строковом формате
  const activeDay = document.querySelector('.active').textContent;

  // фильтруем data по текущему дню и получаем все его дела
  const selectedDay = data.filter(el => el.day === activeDay)[0];
  const selectedTodo = selectedDay.work;

  // берём удаляемое дело из DOM и преобразуем в массив, получаем DOM-эелемент todo
  const selectedRowsNode = el.parentElement;
  const selectedRowsArr = Array.from(selectedRowsNode.children)[1];

  // получаем значение ключа todo удаляемого объекта
  const todoSelectedRowsArr = selectedRowsArr.textContent;
  
  // перебираем data на предмет наличия в ней данных с ключами time и todo удаляемого объекта
  const filteredDataTodo = selectedTodo.filter(el => el.todo === todoSelectedRowsArr)[0];

  const indexFilteredDataTodo = selectedTodo.indexOf(filteredDataTodo);

  if (indexFilteredDataTodo != -1) {
    selectedTodo.splice(indexFilteredDataTodo, 1);
  }

  // добавляем все данные из data в локальное хранилище
  setLocalStorage(data);

  // console.log('массив данных в переменной data выбранного дня:', selectedTodo);
}

// Функция добавления дел в data
const addRowsInData = (el) => {  
  // получаем текущий день недели в строковом формате
  const activeDay = document.querySelector('.active').textContent;

  // фильтруем data по текущему дню и получаем все его дела
  const selectedDay = data.filter(el => el.day === activeDay)[0];
  const selectedTodo = selectedDay.work;

  // добавляем в массив объектов selectedTodo новое дело
  selectedTodo.push(el);
}

// Функции сортировки по возрастанию (по конкретному полю)
const sortByField = field => {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

// Функция добавления всех данных из data в локальное хранилище
const setLocalStorage = (data) => {
  localStorage.setItem('data', JSON.stringify(data));
}



// Добавляем данные формы в расписание
scheduleList.addEventListener('submit', (e) => {
  e.preventDefault();

  const time = scheduleInputTime.value;
  const todo = scheduleInputTodo.value;
  const sked = new Sked(time, todo);

  App.addSked(sked);
  App.clearFieldsInForm();
})


// Удаляем данные из расписания по клику
scheduleList.addEventListener('click', (e) => {
  App.deleteSked(e.target);
});
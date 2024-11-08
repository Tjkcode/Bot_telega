/**
 * Выборка данных из таблицы по условию
 * table   таблица выборки
 * params  объект данных для условия, где ключ == заголовку в таблице
 */
function getRows(table_, params = {}) {
  // получим объект таблицы
  const table = file.getSheetByName(table_);
  // получим все данные из таблицы
  const rows = table.getDataRange().getValues();
  // запомним названия столбцов
  const headers = rows.shift();
  // получим все ключи условий
  const paramsKeys = Object.keys(params);
  // отфильтруем по условию если условия есть
  const data = paramsKeys.length 
    ? rows.filter((line, idx, arr) => {
      // добавим в конец элемента - ключ элемента в массиве строк таблицы
      // далее в объекте он будет под ключем key_row
      arr[idx].push(idx + 1);
      // вернем результат проверки условий
      return (paramsKeys.filter(key => line[headers.findIndex(header => header == key)] == params[key])).length == paramsKeys.length;
    }) 
    : rows;
  // вернем результат массивом объектов
  return setObjects(headers, data);
}

/**
 * Преобразуем в объекты
 */
function setObjects(headers, data) {
  // проверим
  if(data.length) {
    // пройдем по массиву и преобразуем элементы в объекты
    return data.map((item) => {
      // создадим новый объект
      let object = {};
      // переберем заголовки и заполним объект данными
      headers.forEach((head, key) => object[head] = item[key]);
      // добавим номер строки - нужен для редактирования или удаления из таблицы
      object.key_row = item.at(-1);
      // вернем объект
      return object;
    });
  }
  // вернем результат
  return data;
}
window.formatDate = function (date) {
  try {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  } catch {
    return formatDate(new Date());
  }
};

window.loadMenu = function () {
  const params = new URLSearchParams(new URL(window.location).search);
  const canteenURL = params.get("canteen_url");
  const menuId = params.get("menu_id");
  const mealTypeId = parseInt(params.get("meal_type_id"));
  const lang = params.has("lang") ? params.get("lang") : "it";
  
  let menuDate;
  if (params.has("menu_date")) {
    menuDate = window.formatDate(params.get("menu_date"));
  } else {
    menuDate = window.formatDate(new Date());
  }

  fetch(`${canteenURL}/api/public/v1/menu/get/dishes`, {
    method: "POST",
    body: new URLSearchParams({
      id: menuId,
      mealTypeId: mealTypeId,
      lang: lang,
      startingDate: menuDate,
      endingDate: menuDate
    })
  }).then(res => res.json()).then(dishes => {
    window.dishesByDishType.value = dishes.data.Dates[menuDate].MealTypes.filter(
      mt => mt.ID === mealTypeId
    )[0].DishTypes;
  }).catch(err => {});
};

const { createApp, ref } = Vue;

createApp({
  setup() {
    window.dishesByDishType = ref([]);
    return {
      dishesByDishType: window.dishesByDishType
    };
  }
}).mount('#app');
'user strict';

const scrollUp = document.querySelector('.scrollup');
const cardsImgs = document.querySelectorAll('.cards__img');
const cards = document.querySelector('.cards');
const cardsItems = document.querySelectorAll('.cards__item');
const sortPrice = document.querySelector('.sort__price');
const sortAge = document.querySelector('.sort__age');



document.addEventListener("DOMContentLoaded", () => {
  // переходим на самый верх сайта
  scrollUp.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  })
});



// по клику на кнопку "наверх" прятать блок наверху сайта
document.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    scrollUp.style.display = 'block';
  } else {
    scrollUp.style.display = 'none';
  }
})



// добавляем/убираем конкретного кота в избранное
cardsImgs.forEach(el => {  
  el.addEventListener('click', () => {
    if (el.classList.contains('cards__img_unselected')) {
      el.classList.remove('cards__img_unselected');
      el.classList.add('cards__img_selected');
      alert('Вы добавили этого кота в избранное!')
    } else {
      el.classList.remove('cards__img_selected');
      el.classList.add('cards__img_unselected');
      alert('Вы убрали этого кота из избранного!')
    }
  })
})



// сортируем карточки котов по цене
const sortCardsPrice = () => {
  const z = Array.from(cardsItems);

  z.sort((a, b) => {
    const priceA = parseInt(a.querySelector('.cards__price_value').textContent, 10);
    const priceB = parseInt(b.querySelector('.cards__price_value').textContent, 10);
    return priceA - priceB;
  })
  
  // вставляем в DOM в нужном порядке
  z.forEach(item => cards.appendChild(item));
}

// сортируем карточки котов по возрасту
const sortCardsAge = () => {
  const z = Array.from(cardsItems);

  z.sort((a, b) => {
    const priceA = parseInt(a.querySelector('.feat__age').textContent, 10);
    const priceB = parseInt(b.querySelector('.feat__age').textContent, 10);
    return priceA - priceB;
  })
  
  // вставляем в DOM в нужном порядке
  z.forEach(item => cards.appendChild(item));
}

sortPrice.addEventListener('click', sortCardsPrice);
sortAge.addEventListener('click', sortCardsAge);